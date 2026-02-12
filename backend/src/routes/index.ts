import { Router } from 'express';
import { authRouter } from './auth';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRouter);
// router.use('/products', productRouter);
// router.use('/categories', categoryRouter);
// router.use('/cart', cartRouter);
// router.use('/orders', orderRouter);

export { router };
