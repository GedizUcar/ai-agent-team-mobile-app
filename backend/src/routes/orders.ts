import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { createOrderSchema, listOrdersSchema, getOrderSchema } from '../validators/order';

const orderRouter = Router();

// All order routes require authentication
orderRouter.use(authenticate);

orderRouter.post('/', validate(createOrderSchema), orderController.createOrder);
orderRouter.get('/', validate(listOrdersSchema), orderController.listOrders);
orderRouter.get('/:id', validate(getOrderSchema), orderController.getOrder);

export { orderRouter };
