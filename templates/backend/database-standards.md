# Veritabani Tasarim Standartlari

Bu belge, projede kullanilacak veritabani tasarim ve yonetim standartlarini tanimlar.

## Teknoloji Secimi

### Ana Veritabani: PostgreSQL

| Ozellik | Aciklama |
|---------|----------|
| Tip | Iliskisel (RDBMS) |
| Versiyon | 15+ |
| ACID | Tam uyumlu |
| JSON Destegi | JSONB ile native |

### Secim Gerekceleri
```
1. Guclu iliskisel ozellikler
2. JSONB ile esnek veri yapilari
3. Full-text search destegi
4. Olceklenebilirlik
5. Genis topluluk ve dokumantasyon
6. Production-proven guvenilirlik
```

### Cache Layer: Redis

| Kullanim | Aciklama |
|----------|----------|
| Session Store | Kullanici oturumlari |
| Cache | API response cache |
| Rate Limiting | Istek limitleme |
| Queue | Background job'lar |

## ORM: Prisma

### Secim Gerekceleri
```
1. Type-safe database client
2. Otomatik migration
3. Visual database browser (Prisma Studio)
4. Kolay iliski yonetimi
5. Performans optimizasyonlari
```

### Prisma Schema Yapisi

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Ornek model tanimlari asagida
```

## Tablo Isimlendirme Kurallari

### Genel Kurallar

| Kural | Ornek |
|-------|-------|
| snake_case kullan | user_profiles |
| Cogul isim kullan | users, orders |
| Kisa ve anlamli | categories (not: ctgrs) |
| Prefix kullanma | users (not: tbl_users) |

### Sutun Isimlendirme

| Kural | Ornek |
|-------|-------|
| snake_case kullan | first_name, created_at |
| Primary key | id |
| Foreign key | user_id, order_id |
| Boolean | is_active, has_permission |
| Timestamp | created_at, updated_at, deleted_at |

## Standart Model Yapisi

### Temel Alanlar

Her tabloda bulunmasi gereken alanlar:

```prisma
model BaseFields {
  id         String   @id @default(uuid())
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@map("base_fields")
}
```

### Soft Delete

```prisma
model SoftDeleteFields {
  deletedAt  DateTime? @map("deleted_at")
  isDeleted  Boolean   @default(false) @map("is_deleted")
}
```

## Ornek Schema Tanimlari

### User Model

```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String    @map("password_hash")
  firstName      String?   @map("first_name")
  lastName       String?   @map("last_name")
  avatarUrl      String?   @map("avatar_url")
  role           UserRole  @default(USER)
  isActive       Boolean   @default(true) @map("is_active")
  emailVerified  Boolean   @default(false) @map("email_verified")
  lastLoginAt    DateTime? @map("last_login_at")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  // Relations
  profile        UserProfile?
  orders         Order[]
  sessions       Session[]

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
  MODERATOR
}
```

### UserProfile Model

```prisma
model UserProfile {
  id          String   @id @default(uuid())
  userId      String   @unique @map("user_id")
  phone       String?
  address     String?
  city        String?
  country     String?
  bio         String?
  dateOfBirth DateTime? @map("date_of_birth")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}
```

### Product Model

```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  comparePrice Decimal? @map("compare_price") @db.Decimal(10, 2)
  sku         String?  @unique
  stock       Int      @default(0)
  isActive    Boolean  @default(true) @map("is_active")
  categoryId  String   @map("category_id")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  // Relations
  category    Category @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  orderItems  OrderItem[]

  // Indexes
  @@index([categoryId])
  @@index([slug])
  @@index([isActive])
  @@map("products")
}
```

### Order Model

```prisma
model Order {
  id            String      @id @default(uuid())
  orderNumber   String      @unique @map("order_number")
  userId        String      @map("user_id")
  status        OrderStatus @default(PENDING)
  subtotal      Decimal     @db.Decimal(10, 2)
  tax           Decimal     @default(0) @db.Decimal(10, 2)
  shipping      Decimal     @default(0) @db.Decimal(10, 2)
  total         Decimal     @db.Decimal(10, 2)
  notes         String?
  shippingAddress Json?     @map("shipping_address")
  billingAddress  Json?     @map("billing_address")
  paidAt        DateTime?   @map("paid_at")
  shippedAt     DateTime?   @map("shipped_at")
  deliveredAt   DateTime?   @map("delivered_at")
  cancelledAt   DateTime?   @map("cancelled_at")
  createdAt     DateTime    @default(now()) @map("created_at")
  updatedAt     DateTime    @updatedAt @map("updated_at")

  // Relations
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

## Iliski Tanimlari

### One-to-One
```prisma
model User {
  profile UserProfile?
}

model UserProfile {
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### One-to-Many
```prisma
model User {
  orders Order[]
}

model Order {
  userId String
  user   User   @relation(fields: [userId], references: [id])
}
```

### Many-to-Many
```prisma
model Product {
  tags ProductTag[]
}

model Tag {
  products ProductTag[]
}

model ProductTag {
  productId String
  tagId     String
  product   Product @relation(fields: [productId], references: [id])
  tag       Tag     @relation(fields: [tagId], references: [id])

  @@id([productId, tagId])
}
```

## Index Stratejisi

### Ne Zaman Index Kullanilir

| Durum | Index Tipi |
|-------|------------|
| Primary key | Otomatik (BTREE) |
| Foreign key | BTREE |
| Unique constraint | UNIQUE |
| Sik sorgulanan alanlar | BTREE |
| Full-text search | GIN |
| JSON alanlar | GIN |

### Index Ornekleri

```prisma
model Product {
  // Tek alan index
  @@index([categoryId])

  // Composite index
  @@index([categoryId, isActive])

  // Unique index
  @@unique([sku])
}
```

## Migration Yonetimi

### Migration Olusturma
```bash
# Development
npx prisma migrate dev --name add_users_table

# Production
npx prisma migrate deploy
```

### Migration Dosya Yapisi
```
prisma/
├── schema.prisma
└── migrations/
    ├── 20240101000000_init/
    │   └── migration.sql
    ├── 20240102000000_add_users/
    │   └── migration.sql
    └── migration_lock.toml
```

### Migration Best Practices

1. **Atomik Degisiklikler**: Her migration tek bir degisiklik icermeli
2. **Geri Alinabilir**: Rollback stratejisi olmali
3. **Test Edilmis**: Staging ortaminda test edilmeli
4. **Dokumante Edilmis**: Degisiklik aciklamasi olmali

## Query Optimizasyonu

### Select Optimization
```typescript
// YANLIS: Tum alanlari cek
const users = await prisma.user.findMany();

// DOGRU: Sadece gerekli alanlari cek
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    firstName: true,
  },
});
```

### Relation Loading
```typescript
// YANLIS: N+1 problemi
const users = await prisma.user.findMany();
for (const user of users) {
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
  });
}

// DOGRU: Include ile tek sorguda
const users = await prisma.user.findMany({
  include: {
    orders: true,
  },
});
```

### Pagination
```typescript
const users = await prisma.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    createdAt: 'desc',
  },
});
```

## Veri Tipleri

### PostgreSQL - Prisma Mapping

| PostgreSQL | Prisma | Kullanim |
|------------|--------|----------|
| UUID | String @default(uuid()) | Primary keys |
| VARCHAR | String | Text |
| TEXT | String | Long text |
| INTEGER | Int | Sayilar |
| BIGINT | BigInt | Buyuk sayilar |
| DECIMAL | Decimal | Para birimleri |
| BOOLEAN | Boolean | True/False |
| TIMESTAMP | DateTime | Tarih/saat |
| JSONB | Json | Flexible data |

## Guvenlik

### SQL Injection Korunmasi
```typescript
// Prisma otomatik olarak parametreleri escape eder
const user = await prisma.user.findFirst({
  where: {
    email: userInput, // Guvenli
  },
});
```

### Sensitive Data
```typescript
// Password hash'i response'da dondurme
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    // passwordHash: true, // DAHIL ETME!
  },
});
```

## Checklist

Her tablo icin:

- [ ] Isimlendirme kurallarina uygun
- [ ] Primary key (UUID) tanimli
- [ ] created_at, updated_at alanlari var
- [ ] Soft delete gerekli mi degerlendirildi
- [ ] Foreign key'ler tanimli
- [ ] Gerekli indexler eklendi
- [ ] Iliskiler dogru tanimlanmis
- [ ] Migration olusturulmus ve test edilmis

---

*Bu standartlar tum veritabani tasarim surecinde uygulanir.*
