import { prisma } from '../../lib/prisma';
import { stripe } from '../../config/stripe.config';
import config from '../../config';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCheckoutSession = async (userId: string, priceId: string, type: 'subscription' | 'one-time') => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Create or retrieve Stripe customer
  let stripeCustomerId = (user as any).stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
      },
    });
    stripeCustomerId = customer.id;
    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId } as any,
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: type === 'subscription' ? 'subscription' : 'payment',
    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.client_url}/pricing`,
    metadata: {
      userId: user.id,
      type,
    },
  });

  return session.url;
};

const handleWebhook = async (sig: string, payload: Buffer) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      config.stripe_webhook_secret!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const { userId, type } = session.metadata;

      if (type === 'subscription') {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            subscriptionStatus: subscription.status,
          } as any,
        });

        await (prisma as any).subscription.create({
          data: {
            stripeId: subscription.id,
            status: subscription.status,
            priceId: subscription.items.data[0].price.id,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            userId,
          },
        });
      } else {
        // One-time payment
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            subscriptionStatus: 'lifetime',
          } as any,
        });

        await (prisma as any).payment.create({
          data: {
            stripeId: session.payment_intent || session.id,
            amount: session.amount_total,
            currency: session.currency,
            status: 'succeeded',
            type: 'one-time',
            userId,
          },
        });
      }

      // SEND NOTIFICATIONS SAFELY AFTER PAYMENT IS RECORDED
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          await (prisma as any).notification.create({
            data: {
              userId,
              title: '🎉 Premium Activated!',
              message: 'You now have full access to all premium content.',
            },
          });

          const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
          if (admins.length > 0) {
            await (prisma as any).notification.createMany({
              data: admins.map((admin: any) => ({
                userId: admin.id,
                title: '💳 New Premium Upgrade!',
                message: `${user.name} just upgraded to CineTube Premium.`,
              })),
            });
          }
        }
      } catch (err) {
        console.error('Non-critical notification error in webhook:', err);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const user = await prisma.user.findFirst({
        where: {
          subscriptions: {
            some: { stripeId: subscription.id },
          },
        } as any,
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPremium: false,
            subscriptionStatus: 'canceled',
          } as any,
        });

        await (prisma as any).subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: 'canceled',
          },
        });
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as any;
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        await (prisma as any).subscription.update({
          where: { stripeId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        });
      }
      break;
    }
  }

  return { received: true };
};

const verifySession = async (sessionId: string, userId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw new AppError(httpStatus.BAD_REQUEST, 'Payment not completed');
  }

  // Make sure this session belongs to this user
  if (session.metadata?.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'Session does not belong to this user');
  }

  const type = session.metadata?.type;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  // Already updated — skip
  if ((user as any).isPremium) return { alreadyPremium: true };

  if (type === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true, subscriptionStatus: subscription.status } as any,
    });

    // create subscription record if not exists
    const existing = await (prisma as any).subscription.findUnique({ where: { stripeId: subscription.id } });
    if (!existing) {
      await (prisma as any).subscription.create({
        data: {
          stripeId: subscription.id,
          status: subscription.status,
          priceId: subscription.items.data[0].price.id,
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          userId,
        },
      });
    }
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium: true, subscriptionStatus: 'lifetime' } as any,
    });
  }

  // SEND NOTIFICATIONS SAFELY
  try {
    // 1. Notify the user
    await (prisma as any).notification.create({
      data: {
        userId,
        title: '🎉 Premium Activated!',
        message: 'You now have full access to all premium content. Enjoy your cinematic experience!',
      },
    });

    // 2. Notify admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });

    if (admins.length > 0) {
      await (prisma as any).notification.createMany({
        data: admins.map((admin: any) => ({
          userId: admin.id,
          title: '💳 New Premium Upgrade!',
          message: `${user.name} just upgraded to CineTube Premium.`,
        })),
      });
    }
  } catch (error) {
    console.error('Non-critical error: Could not create premium notifications', error);
  }

  return { success: true, isPremium: true };
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
  verifySession,
};
