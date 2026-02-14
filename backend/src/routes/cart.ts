import { Router } from 'express';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../validators/cart';

const cartRouter = Router();

// All cart routes require authentication
cartRouter.use(authenticate);

cartRouter.get('/', cartController.getCart);
cartRouter.post('/items', validate(addCartItemSchema), cartController.addItem);
cartRouter.patch('/items/:itemId', validate(updateCartItemSchema), cartController.updateItem);
cartRouter.delete('/items/:itemId', validate(removeCartItemSchema), cartController.removeItem);

export { cartRouter };
