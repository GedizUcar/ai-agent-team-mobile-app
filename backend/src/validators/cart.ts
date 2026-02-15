import { z } from 'zod';

export const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid('Invalid item ID'),
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export const removeCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid('Invalid item ID'),
  }),
});

export type AddCartItemBody = z.infer<typeof addCartItemSchema>['body'];
export type UpdateCartItemBody = z.infer<typeof updateCartItemSchema>['body'];
export type UpdateCartItemParams = z.infer<typeof updateCartItemSchema>['params'];
export type RemoveCartItemParams = z.infer<typeof removeCartItemSchema>['params'];
