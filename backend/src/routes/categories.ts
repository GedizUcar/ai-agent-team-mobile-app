import { Router } from 'express';
import * as productController from '../controllers/product.controller';

const categoryRouter = Router();

categoryRouter.get('/', productController.listCategories);

export { categoryRouter };
