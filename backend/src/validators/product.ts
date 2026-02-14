import { z } from 'zod';

export const listProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().positive()),
    limit: z
      .string()
      .optional()
      .default('20')
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().min(1).max(100)),
    categoryId: z.string().uuid('Invalid category ID').optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(['price_asc', 'price_desc', 'newest', 'oldest'])
      .optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid product ID'),
  }),
});

export const listCategoriesSchema = z.object({});

export const homeDataSchema = z.object({});

export type ListProductsQuery = z.infer<typeof listProductsSchema>['query'];
export type GetProductParams = z.infer<typeof getProductSchema>['params'];
