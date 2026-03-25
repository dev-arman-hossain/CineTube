import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { MediaRoutes } from '../modules/media/media.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { CommentRoutes } from '../modules/comment/comment.routes';
import { WatchlistRoutes } from '../modules/watchlist/watchlist.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
import { PaymentRoutes } from '../modules/payment/payment.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/media',
    route: MediaRoutes,
  },
  {
    path: '/reviews',
    route: ReviewRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/watchlist',
    route: WatchlistRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
  {
    path: '/notifications',
    route: NotificationRoutes,
  },
  {
    path: '/payment',
    route: PaymentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
