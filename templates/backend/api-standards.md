# API Tasarim Standartlari

Bu belge, projede kullanilacak RESTful API tasarim standartlarini tanimlar.

## Genel Ilkeler

### 1. RESTful Tasarim
- Kaynak odakli URL'ler
- HTTP metodlarinin dogru kullanimi
- Stateless iletisim
- Tutarli response formati

### 2. Versiyon Yonetimi
```
/api/v1/resources
/api/v2/resources
```

URL tabanli versiyon yonetimi kullanilir. Major degisikliklerde yeni versiyon olusturulur.

## URL Yapisi

### Genel Format
```
https://api.example.com/api/v1/{resource}
```

### Isimlendirme Kurallari

| Kural | Dogru | Yanlis |
|-------|-------|--------|
| Cogul isim kullan | /users | /user |
| Kucuk harf kullan | /user-profiles | /userProfiles |
| Kebab-case kullan | /order-items | /order_items |
| Fiil kullanma | /users | /getUsers |

### Hiyerarsik Kaynaklar
```
GET /api/v1/users/{userId}/orders
GET /api/v1/users/{userId}/orders/{orderId}
GET /api/v1/users/{userId}/orders/{orderId}/items
```

### Ornek Endpoint'ler

```
# Users
GET     /api/v1/users              # Liste
GET     /api/v1/users/:id          # Detay
POST    /api/v1/users              # Olustur
PUT     /api/v1/users/:id          # Guncelle (tam)
PATCH   /api/v1/users/:id          # Guncelle (kismi)
DELETE  /api/v1/users/:id          # Sil

# User Orders (nested resource)
GET     /api/v1/users/:id/orders   # Kullanicinin siparisleri

# Search/Filter
GET     /api/v1/users?role=admin&status=active
GET     /api/v1/products?category=electronics&sort=-price

# Actions (istisnai durumlar)
POST    /api/v1/users/:id/activate
POST    /api/v1/orders/:id/cancel
```

## HTTP Metodlari

### GET - Kaynak Okuma
```
GET /api/v1/users
GET /api/v1/users/123

Response: 200 OK
```

### POST - Kaynak Olusturma
```
POST /api/v1/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

Response: 201 Created
```

### PUT - Tam Guncelleme
```
PUT /api/v1/users/123
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "role": "user"
}

Response: 200 OK
```

### PATCH - Kismi Guncelleme
```
PATCH /api/v1/users/123
Content-Type: application/json

{
  "name": "John Doe Updated"
}

Response: 200 OK
```

### DELETE - Silme
```
DELETE /api/v1/users/123

Response: 204 No Content
```

## Request Format

### Headers
```
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
Accept-Language: tr-TR
X-Request-ID: uuid-v4
```

### Query Parameters

| Parametre | Aciklama | Ornek |
|-----------|----------|-------|
| page | Sayfa numarasi | ?page=2 |
| limit | Sayfa basi kayit | ?limit=20 |
| sort | Siralama | ?sort=-createdAt |
| fields | Alan secimi | ?fields=id,name |
| search | Arama | ?search=john |
| filter | Filtreleme | ?status=active |

### Siralama Formati
```
# Artan siralama
?sort=name

# Azalan siralama
?sort=-createdAt

# Coklu siralama
?sort=-createdAt,name
```

### Filtreleme Formati
```
# Esitlik
?status=active

# Karsilastirma
?price[gte]=100&price[lte]=500

# Dizi
?category[in]=electronics,clothing

# Arama
?name[contains]=phone
```

## Response Format

### Basarili Response

#### Tek Kayit
```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Liste (Paginasyon ile)
```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "John" },
    { "id": "2", "name": "Jane" }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### Olusturma Response
```json
{
  "success": true,
  "data": {
    "id": "124",
    "name": "New User",
    ...
  },
  "message": "User created successfully"
}
```

### Hata Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  },
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## HTTP Status Codes

### Basari Kodlari (2xx)

| Kod | Durum | Kullanim |
|-----|-------|----------|
| 200 | OK | Basarili GET, PUT, PATCH |
| 201 | Created | Basarili POST |
| 204 | No Content | Basarili DELETE |

### Client Hata Kodlari (4xx)

| Kod | Durum | Kullanim |
|-----|-------|----------|
| 400 | Bad Request | Gecersiz istek formati |
| 401 | Unauthorized | Kimlik dogrulama gerekli |
| 403 | Forbidden | Yetki yok |
| 404 | Not Found | Kaynak bulunamadi |
| 409 | Conflict | Kaynak catismasi |
| 422 | Unprocessable Entity | Validation hatasi |
| 429 | Too Many Requests | Rate limit asildi |

### Server Hata Kodlari (5xx)

| Kod | Durum | Kullanim |
|-----|-------|----------|
| 500 | Internal Server Error | Beklenmeyen hata |
| 502 | Bad Gateway | Upstream server hatasi |
| 503 | Service Unavailable | Gecici olarak kullanilamaz |

## Error Codes

### Standart Hata Kodlari

```typescript
enum ErrorCode {
  // Validation Errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',

  // Authentication Errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Authorization Errors
  FORBIDDEN = 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',

  // Resource Errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',

  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server Errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
```

## Rate Limiting

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

### Limitler

| Endpoint Tipi | Limit | Pencere |
|---------------|-------|---------|
| Public | 60/dakika | 1 dakika |
| Authenticated | 1000/saat | 1 saat |
| Admin | 10000/saat | 1 saat |

### Rate Limit Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "retryAfter": 60
  }
}
```

## API Dokumantasyonu

### Swagger/OpenAPI Spesifikasyonu

```yaml
openapi: 3.0.0
info:
  title: Mobile App API
  version: 1.0.0
  description: AI Agent Team Mobile App Backend API

paths:
  /api/v1/users:
    get:
      summary: List users
      tags:
        - Users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: limit
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'
```

## Best Practices

### 1. Idempotency
```
# Idempotent: Ayni sonuc
GET, PUT, DELETE

# Non-idempotent: Farkli sonuc olabilir
POST

# POST icin idempotency key kullan
X-Idempotency-Key: unique-request-id
```

### 2. HATEOAS (Opsiyonel)
```json
{
  "data": {
    "id": "123",
    "name": "John"
  },
  "links": {
    "self": "/api/v1/users/123",
    "orders": "/api/v1/users/123/orders",
    "profile": "/api/v1/users/123/profile"
  }
}
```

### 3. Field Selection
```
GET /api/v1/users?fields=id,name,email
```

### 4. Bulk Operations
```
POST /api/v1/users/bulk
{
  "operations": [
    { "action": "create", "data": {...} },
    { "action": "update", "id": "123", "data": {...} }
  ]
}
```

## Checklist

Her endpoint icin:

- [ ] RESTful URL yapisi
- [ ] Dogru HTTP metodu
- [ ] Input validation
- [ ] Authentication/Authorization
- [ ] Error handling
- [ ] Rate limiting
- [ ] Response format uyumu
- [ ] Swagger dokumantasyonu
- [ ] Unit/Integration test

---

*Bu standartlar tum API gelistirme surecinde uygulanir.*
