import { Router } from 'express';
import { authRouter } from './auth';
import { productRouter } from './products';
import { categoryRouter } from './categories';
import { cartRouter } from './cart';
import { orderRouter } from './orders';
import { getHomeData } from '../controllers/product.controller';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Home page data
router.get('/home', getHomeData);

// API routes
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/cart', cartRouter);
router.use('/orders', orderRouter);

export { router };
