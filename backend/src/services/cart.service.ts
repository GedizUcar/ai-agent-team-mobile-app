import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type { AddCartItemBody, UpdateCartItemBody } from '../validators/cart';

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              comparePrice: true,
              isActive: true,
              deletedAt: true,
              images: {
                select: { url: true },
                orderBy: { sortOrder: 'asc' },
                take: 1,
              },
            },
          },
          variant: {
            select: {
              id: true,
              size: true,
              color: true,
              colorHex: true,
              stock: true,
              isActive: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!cart) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const items = cart.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    product: {
      name: item.product.name,
      price: Number(item.product.price),
      comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : null,
      imageUrl: item.product.images[0]?.url ?? null,
      isAvailable: item.product.isActive && item.product.deletedAt === null,
    },
    variant: {
      size: item.variant.size,
      color: item.variant.color,
      colorHex: item.variant.colorHex,
      stock: item.variant.stock,
      isAvailable: item.variant.isActive,
    },
    unitPrice: Number(item.product.price),
    total: Number(item.product.price) * item.quantity,
  }));

  // Only count available items in subtotal and itemCount
  const availableItems = items.filter((item) => item.product.isAvailable && item.variant.isAvailable);
  const subtotal = availableItems.reduce((sum, item) => sum + item.total, 0);
  const itemCount = availableItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items, subtotal, itemCount };
}

export async function addItem(userId: string, body: AddCartItemBody) {
  const { productId, variantId, quantity } = body;

  // Validate product exists and is active
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product || !product.isActive || product.deletedAt !== null) {
    throw new NotFoundError('Product not found');
  }

  // Validate variant exists and has stock
  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant || !variant.isActive || variant.productId !== productId) {
    throw new NotFoundError('Product variant not found');
  }

  if (variant.stock < quantity) {
    throw new BadRequestError('Insufficient stock', [
      { field: 'quantity', message: `Only ${variant.stock} items available` },
    ]);
  }

  const cart = await getOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId_variantId: {
        cartId: cart.id,
        productId,
        variantId,
      },
    },
  });

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > variant.stock) {
      throw new BadRequestError('Insufficient stock', [
        { field: 'quantity', message: `Only ${variant.stock} items available (${existingItem.quantity} already in cart)` },
      ]);
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId,
        quantity,
      },
    });
  }

  return getCart(userId);
}

export async function updateItemQuantity(userId: string, itemId: string, body: UpdateCartItemBody) {
  const { quantity } = body;

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      variant: true,
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new NotFoundError('Cart item not found');
  }

  if (quantity > cartItem.variant.stock) {
    throw new BadRequestError('Insufficient stock', [
      { field: 'quantity', message: `Only ${cartItem.variant.stock} items available` },
    ]);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  return getCart(userId);
}

export async function removeItem(userId: string, itemId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    throw new NotFoundError('Cart item not found');
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return getCart(userId);
}

export async function clearCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
