import { Router, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { MediaController } from './media.controller';
import { MediaValidation } from './media.validation';
import auth from '../../middlewares/auth.middleware';
import requireRole from '../../middlewares/role.middleware';
import { upload } from '../../utils/cloudinary';

const router = Router();

// Public routes
router.get('/', MediaController.getAllMedia);
router.get('/featured', MediaController.getFeaturedMedia);

// TMDB poster search proxy (admin only)
router.get('/tmdb-search', auth, requireRole('ADMIN'), async (req: Request, res: Response) => {
  const { title, year } = req.query;
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    res.status(503).json({ success: false, message: 'TMDB API key not configured' });
    return;
  }

  try {
    const params = new URLSearchParams({
      api_key: apiKey,
      query: String(title || ''),
      ...(year ? { year: String(year) } : {}),
    });

    const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`);
    const tmdbData = await tmdbRes.json() as any;

    const results = (tmdbData.results || []).slice(0, 5).map((item: any) => ({
      title: item.title,
      year: item.release_date?.slice(0, 4),
      posterUrl: item.poster_path
        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
        : null,
      backdropUrl: item.backdrop_path
        ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
        : null,
      overview: item.overview,
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch from TMDB' });
  }
});

router.get('/:id', MediaController.getMediaById);

router.post(
  '/upload',
  auth,
  requireRole('ADMIN'),
  upload.single('image'),
  MediaController.uploadMedia,
);

// Admin routes
router.post(
  '/',
  auth,
  requireRole('ADMIN'),
  validateRequest(MediaValidation.createMediaValidationSchema),
  MediaController.createMedia,
);

router.put(
  '/:id',
  auth,
  requireRole('ADMIN'),
  validateRequest(MediaValidation.updateMediaValidationSchema),
  MediaController.updateMedia,
);

router.delete(
  '/:id',
  auth,
  requireRole('ADMIN'),
  MediaController.deleteMedia,
);

export const MediaRoutes = router;

