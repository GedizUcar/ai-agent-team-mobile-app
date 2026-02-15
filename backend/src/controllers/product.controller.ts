import { Request, Response } from 'express';
import * as productService from '../services/product.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../types/api';
import type { ListProductsQuery } from '../validators/product';

export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const query: ListProductsQuery = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    categoryId: req.query.categoryId as string | undefined,
    search: req.query.search as string | undefined,
    sortBy: req.query.sortBy as ListProductsQuery['sortBy'],
  };

  const { products, pagination } = await productService.listProducts(query);

  const response: ApiResponse = {
    success: true,
    data: products,
    meta: {
      pagination,
    },
  };

  res.json(response);
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const product = await productService.getProductById(id);

  const response: ApiResponse = {
    success: true,
    data: product,
  };

  res.json(response);
});

export const listCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await productService.listCategories();

  const response: ApiResponse = {
    success: true,
    data: categories,
  };

  res.json(response);
});

export const getHomeData = asyncHandler(async (_req: Request, res: Response) => {
  const homeData = await productService.getHomeData();

  const response: ApiResponse = {
    success: true,
    data: homeData,
  };

  res.json(response);
});
