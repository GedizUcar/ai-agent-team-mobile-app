import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import type { ListProductsQuery } from '../validators/product';

const ACTIVE_PRODUCT_FILTER = {
  isActive: true,
  deletedAt: null,
} satisfies Prisma.ProductWhereInput;

const ACTIVE_CATEGORY_FILTER = {
  isActive: true,
} satisfies Prisma.CategoryWhereInput;

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

function buildOrderBy(sortBy?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sortBy) {
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'oldest':
      return { createdAt: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

export async function listProducts(query: ListProductsQuery) {
  const { page, limit, categoryId, search, sortBy } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {
    ...ACTIVE_PRODUCT_FILTER,
  };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(sortBy),
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        isFeatured: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const pagination = buildPaginationMeta(page, limit, total);

  return { products, pagination };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          url: true,
          altText: true,
          sortOrder: true,
        },
      },
      variants: {
        where: { isActive: true },
        orderBy: [{ size: 'asc' }, { color: 'asc' }],
        select: {
          id: true,
          size: true,
          color: true,
          colorHex: true,
          stock: true,
          sku: true,
        },
      },
    },
  });

  if (!product || product.deletedAt !== null || !product.isActive) {
    throw new NotFoundError('Product not found');
  }

  return product;
}

export async function listCategories() {
  const categories = await prisma.category.findMany({
    where: ACTIVE_CATEGORY_FILTER,
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      imageUrl: true,
      sortOrder: true,
      _count: {
        select: {
          products: {
            where: ACTIVE_PRODUCT_FILTER,
          },
        },
      },
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    imageUrl: cat.imageUrl,
    sortOrder: cat.sortOrder,
    productCount: cat._count.products,
  }));
}

export async function getHomeData() {
  const [featuredProducts, newArrivals, categories] = await Promise.all([
    // Featured products
    prisma.product.findMany({
      where: {
        ...ACTIVE_PRODUCT_FILTER,
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        isFeatured: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    }),

    // New arrivals
    prisma.product.findMany({
      where: ACTIVE_PRODUCT_FILTER,
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        isFeatured: true,
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
            altText: true,
          },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
      },
    }),

    // Categories with product count
    prisma.category.findMany({
      where: ACTIVE_CATEGORY_FILTER,
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        sortOrder: true,
        _count: {
          select: {
            products: {
              where: ACTIVE_PRODUCT_FILTER,
            },
          },
        },
      },
    }),
  ]);

  return {
    featuredProducts,
    newArrivals,
    categories: categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      imageUrl: cat.imageUrl,
      sortOrder: cat.sortOrder,
      productCount: cat._count.products,
    })),
  };
}
