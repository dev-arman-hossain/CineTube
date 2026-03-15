import { Router } from 'express';

const router = Router();

const moduleRoutes = [
  // {
  //   path: '/auth',
  //   route: AuthRoutes,
  // },
  // {
  //   path: '/media',
  //   route: MediaRoutes,
  // },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
