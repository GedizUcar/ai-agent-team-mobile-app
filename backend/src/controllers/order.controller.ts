import { Request, Response } from 'express';
import * as orderService from '../services/order.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../types/api';
import type { CreateOrderBody, ListOrdersQuery } from '../validators/order';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const body: CreateOrderBody = req.body;

  const order = await orderService.createOrder(userId, body);

  const response: ApiResponse = {
    success: true,
    data: order,
    message: 'Order created successfully',
  };

  res.status(201).json(response);
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const query: ListOrdersQuery = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
  };

  const { orders, pagination } = await orderService.listOrders(userId, query);

  const response: ApiResponse = {
    success: true,
    data: orders,
    meta: { pagination },
  };

  res.json(response);
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const orderId = req.params.id;

  const order = await orderService.getOrderById(userId, orderId);

  const response: ApiResponse = {
    success: true,
    data: order,
  };

  res.json(response);
});
