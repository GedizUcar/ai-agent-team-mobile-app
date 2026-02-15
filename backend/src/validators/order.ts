import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().min(2, 'Full name is required'),
      phone: z.string().min(10, 'Phone number is required'),
      address: z.string().min(5, 'Address is required'),
      city: z.string().min(2, 'City is required'),
      postalCode: z.string().min(4, 'Postal code is required'),
      country: z.string().default('TR'),
    }),
    notes: z.string().optional(),
    items: z.array(z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid(),
      quantity: z.number().int().min(1),
    })).optional(),
  }),
});

export const listOrdersSchema = z.object({
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
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid order ID'),
  }),
});

export type CreateOrderBody = z.infer<typeof createOrderSchema>['body'];
export type ListOrdersQuery = z.infer<typeof listOrdersSchema>['query'];
export type GetOrderParams = z.infer<typeof getOrderSchema>['params'];
