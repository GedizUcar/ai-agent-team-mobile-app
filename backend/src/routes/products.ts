import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { validate } from '../middlewares/validate';
import { listProductsSchema, getProductSchema } from '../validators/product';

const productRouter = Router();

productRouter.get('/', validate(listProductsSchema), productController.listProducts);
productRouter.get('/home', productController.getHomeData);
productRouter.get('/:id', validate(getProductSchema), productController.getProduct);

export { productRouter };
