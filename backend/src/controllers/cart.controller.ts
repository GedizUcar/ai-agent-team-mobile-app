import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../types/api';
import type { AddCartItemBody, UpdateCartItemBody } from '../validators/cart';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const cart = await cartService.getCart(userId);

  const response: ApiResponse = {
    success: true,
    data: cart,
  };

  res.json(response);
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const body: AddCartItemBody = req.body;

  const cart = await cartService.addItem(userId, body);

  const response: ApiResponse = {
    success: true,
    data: cart,
    message: 'Item added to cart',
  };

  res.status(201).json(response);
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const itemId = req.params.itemId;
  const body: UpdateCartItemBody = req.body;

  const cart = await cartService.updateItemQuantity(userId, itemId, body);

  const response: ApiResponse = {
    success: true,
    data: cart,
  };

  res.json(response);
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const itemId = req.params.itemId;

  const cart = await cartService.removeItem(userId, itemId);

  const response: ApiResponse = {
    success: true,
    data: cart,
    message: 'Item removed from cart',
  };

  res.json(response);
});
