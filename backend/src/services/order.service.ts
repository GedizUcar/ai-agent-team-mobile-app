import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type { CreateOrderBody, ListOrdersQuery } from '../validators/order';

const SHIPPING_COST = 29.99;
const FREE_SHIPPING_THRESHOLD = 500;

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
  return `STL-${timestamp}-${random}`;
}

function buildPaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export async function createOrder(userId: string, body: CreateOrderBody) {
  // All cart reading, validation, stock checks, and writes happen inside the transaction
  const order = await prisma.$transaction(async (tx) => {
    // Read cart inside transaction
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                isActive: true,
                deletedAt: true,
                images: { select: { url: true }, orderBy: { sortOrder: 'asc' as const }, take: 1 },
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                color: true,
                stock: true,
                isActive: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestError('Cart is empty');
    }

    // Validate all items are available and have stock
    for (const item of cart.items) {
      if (!item.product.isActive || item.product.deletedAt !== null) {
        throw new BadRequestError(`"${item.product.name}" artik mevcut degil`);
      }
      if (!item.variant.isActive) {
        throw new BadRequestError(`"${item.product.name}" secili varyant artik mevcut degil`);
      }
      if (item.quantity > item.variant.stock) {
        throw new BadRequestError(
          `"${item.product.name}" icin yeterli stok yok`,
        );
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shippingCost;

    // Create order
    const newOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        shippingCost,
        total,
        shippingAddress: body.shippingAddress,
        notes: body.notes,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
            unitPrice: Number(item.product.price),
            total: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: { select: { url: true }, take: 1, orderBy: { sortOrder: 'asc' } } },
            },
            variant: {
              select: { size: true, color: true },
            },
          },
        },
      },
    });

    // Decrease stock with database-level guard (stock >= quantity)
    for (const item of cart.items) {
      const result = await tx.$executeRaw`
        UPDATE product_variants
        SET stock = stock - ${item.quantity}, updated_at = NOW()
        WHERE id = ${item.variant.id}::uuid AND stock >= ${item.quantity}
      `;

      if (result === 0) {
        throw new BadRequestError(
          `"${item.product.name}" icin yeterli stok kalmadi`,
        );
      }
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  return formatOrder(order);
}

export async function listOrders(userId: string, query: ListOrdersQuery) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: { select: { url: true }, take: 1, orderBy: { sortOrder: 'asc' } } },
            },
            variant: {
              select: { size: true, color: true },
            },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  const pagination = buildPaginationMeta(page, limit, total);

  return {
    orders: orders.map(formatOrder),
    pagination,
  };
}

export async function getOrderById(userId: string, orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, images: { select: { url: true }, take: 1, orderBy: { sortOrder: 'asc' } } },
          },
          variant: {
            select: { size: true, color: true },
          },
        },
      },
    },
  });

  if (!order || order.userId !== userId) {
    throw new NotFoundError('Order not found');
  }

  return formatOrder(order);
}

function formatOrder(order: any) {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    items: order.items.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.product.name,
      imageUrl: item.product.images[0]?.url ?? null,
      size: item.variant.size,
      color: item.variant.color,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
    })),
    itemCount: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
