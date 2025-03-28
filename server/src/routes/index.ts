import { Router } from "express";

const router = Router();

// Import route modules
// import authRoutes from './auth.routes';
// import userRoutes from './user.routes';

// Root API endpoint
router.get("/", (req, res) => {
  res.json({
    message: "API is working",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);

export default router;
