import { prisma } from '../src/lib/prisma';
import { ReviewService } from '../src/modules/review/review.service';

async function test() {
  console.log('Starting verification...');

  // 1. Get a media to review
  const media = await prisma.media.findFirst();
  if (!media) {
    console.error('No media found to test');
    return;
  }
  console.log(`Testing with media: ${media.title} (${media.id})`);
  console.log(`Initial avgRating: ${media.avgRating}, totalRatings: ${media.totalRatings}`);

  // 2. Get a user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error('No user found to test');
    return;
  }

  // 3. Create a review
  console.log('Creating review...');
  const newReview = await ReviewService.createReview(user.id, {
    mediaId: media.id,
    rating: 8,
    content: 'This is a test review for verification.',
    hasSpoiler: false,
  });

  console.log(`Review created with status: ${newReview.status}`);

  // 4. Check if media ratings updated
  const updatedMedia = await prisma.media.findUnique({ where: { id: media.id } });
  console.log(`Updated avgRating: ${updatedMedia?.avgRating}, totalRatings: ${updatedMedia?.totalRatings}`);

  // 5. Update the review
  console.log('Updating review rating to 10...');
  await ReviewService.updateReview(newReview.id, user.id, { rating: 10 });

  const updatedMedia2 = await prisma.media.findUnique({ where: { id: media.id } });
  console.log(`Updated avgRating after update: ${updatedMedia2?.avgRating}`);

  // 6. Test filtering
  console.log('Testing filtering...');
  const filteredReviews = await ReviewService.getAllReviews({ mediaId: media.id });
  const hasOurReview = filteredReviews.some((r: any) => r.id === newReview.id);
  console.log(`Filter by mediaId works: ${hasOurReview}`);

  // Cleanup
  console.log('Cleaning up...');
  await prisma.review.delete({ where: { id: newReview.id } });
  
  const finalMedia = await prisma.media.findUnique({ where: { id: media.id } });
  console.log(`Final avgRating after delete: ${finalMedia?.avgRating}, totalRatings: ${finalMedia?.totalRatings}`);

  console.log('Verification finished.');
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
