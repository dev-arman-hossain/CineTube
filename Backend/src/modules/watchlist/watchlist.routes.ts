import { Router } from 'express';
import { WatchlistController } from './watchlist.controller';
import auth from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, WatchlistController.getMyWatchlist);
router.post('/toggle', auth, WatchlistController.toggleWatchlist);

export const WatchlistRoutes = router;
