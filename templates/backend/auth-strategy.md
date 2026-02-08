# Authentication & Authorization Stratejisi

Bu belge, projede kullanilacak kimlik dogrulama ve yetkilendirme stratejisini tanimlar.

## Genel Bakis

### Authentication (Kimlik Dogrulama)
Kullanicinin kim oldugunu dogrulama sureci.

### Authorization (Yetkilendirme)
Kullanicinin ne yapabilecegini belirleme sureci.

## Authentication Stratejisi

### JWT (JSON Web Token) Tabanli

```
Secim Gerekceleri:
1. Stateless - sunucu tarafinda session tutmaya gerek yok
2. Olceklenebilir - load balancing ile uyumlu
3. Mobile-friendly - cookie'ye ihtiyac yok
4. Cross-platform - web, mobile, API
```

### Token Yapisi

#### Access Token
```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@example.com",
    "role": "USER",
    "iat": 1640000000,
    "exp": 1640003600
  },
  "signature": "..."
}
```

#### Refresh Token
```json
{
  "payload": {
    "sub": "user-uuid",
    "tokenId": "unique-token-id",
    "iat": 1640000000,
    "exp": 1641209600
  }
}
```

### Token Sureler

| Token Tipi | Sure | Kullanim |
|------------|------|----------|
| Access Token | 1 saat | API istekleri |
| Refresh Token | 14 gun | Access token yenileme |
| Password Reset | 1 saat | Sifre sifirlama |
| Email Verification | 24 saat | Email dogrulama |

## Authentication Flow

### 1. Kayit (Register)

```
+--------+     +--------+     +----------+
| Client | --> | Server | --> | Database |
+--------+     +--------+     +----------+
     |             |               |
     | POST /register              |
     |------------>|               |
     |             | Hash password |
     |             |-------------->|
     |             |    Save user  |
     |             |<--------------|
     |  201 + tokens               |
     |<------------|               |
```

```typescript
// POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John"
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

### 2. Giris (Login)

```typescript
// POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "USER"
    },
    "tokens": {
      "accessToken": "eyJhbG...",
      "refreshToken": "eyJhbG...",
      "expiresIn": 3600
    }
  }
}
```

### 3. Token Yenileme

```typescript
// POST /api/v1/auth/refresh
{
  "refreshToken": "eyJhbG..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "expiresIn": 3600
  }
}
```

### 4. Cikis (Logout)

```typescript
// POST /api/v1/auth/logout
// Header: Authorization: Bearer <accessToken>

// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Password Yonetimi

### Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash password
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Password Gereksinimleri

```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain special character');
```

### Sifre Sifirlama

```
1. POST /api/v1/auth/forgot-password
   - Email gonder
   - Reset token olustur (1 saat gecerli)
   - Email ile link gonder

2. POST /api/v1/auth/reset-password
   - Token dogrula
   - Yeni sifre kaydet
   - Tum session'lari sonlandir
```

## Authorization Stratejisi

### Role-Based Access Control (RBAC)

```typescript
enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}
```

### Role Hiyerarsisi

```
SUPER_ADMIN
    |
  ADMIN
    |
MODERATOR
    |
  USER
```

### Permission Tanimlari

```typescript
enum Permission {
  // User permissions
  USER_READ = 'user:read',
  USER_CREATE = 'user:create',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',

  // Product permissions
  PRODUCT_READ = 'product:read',
  PRODUCT_CREATE = 'product:create',
  PRODUCT_UPDATE = 'product:update',
  PRODUCT_DELETE = 'product:delete',

  // Order permissions
  ORDER_READ = 'order:read',
  ORDER_CREATE = 'order:create',
  ORDER_UPDATE = 'order:update',
  ORDER_CANCEL = 'order:cancel',
}
```

### Role-Permission Mapping

```typescript
const rolePermissions: Record<Role, Permission[]> = {
  USER: [
    Permission.USER_READ,
    Permission.PRODUCT_READ,
    Permission.ORDER_READ,
    Permission.ORDER_CREATE,
  ],

  MODERATOR: [
    ...rolePermissions.USER,
    Permission.PRODUCT_CREATE,
    Permission.PRODUCT_UPDATE,
    Permission.ORDER_UPDATE,
  ],

  ADMIN: [
    ...rolePermissions.MODERATOR,
    Permission.USER_CREATE,
    Permission.USER_UPDATE,
    Permission.PRODUCT_DELETE,
    Permission.ORDER_CANCEL,
  ],

  SUPER_ADMIN: [
    // All permissions
    ...Object.values(Permission),
  ],
};
```

## Middleware Implementation

### Auth Middleware

```typescript
// middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { UnauthorizedError } from '@/errors';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};
```

### Role Middleware

```typescript
// middlewares/role.middleware.ts
export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

// Kullanim
router.delete(
  '/users/:id',
  authenticate,
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),
  userController.delete
);
```

### Permission Middleware

```typescript
// middlewares/permission.middleware.ts
export const requirePermission = (...permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const userPermissions = rolePermissions[req.user.role];
    const hasPermission = permissions.every(p =>
      userPermissions.includes(p)
    );

    if (!hasPermission) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

// Kullanim
router.post(
  '/products',
  authenticate,
  requirePermission(Permission.PRODUCT_CREATE),
  productController.create
);
```

## Session Yonetimi

### Redis ile Session Store

```typescript
// Session modeli
interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
  expiresAt: Date;
}

// Redis key yapisi
// session:{userId}:{sessionId}
```

### Session Islemleri

```typescript
class SessionService {
  // Yeni session olustur
  async createSession(userId: string, data: SessionData): Promise<Session>;

  // Session dogrula
  async validateSession(sessionId: string): Promise<Session | null>;

  // Session sonlandir
  async revokeSession(sessionId: string): Promise<void>;

  // Kullanicinin tum session'larini sonlandir
  async revokeAllUserSessions(userId: string): Promise<void>;

  // Aktif session listele
  async getUserSessions(userId: string): Promise<Session[]>;
}
```

## OAuth2 / Social Login

### Desteklenen Provider'lar

| Provider | Kullanim |
|----------|----------|
| Google | Google hesabi ile giris |
| Apple | iOS icin zorunlu |
| Facebook | Opsiyonel |

### OAuth Flow

```
1. Client -> Provider: Yetkilendirme istegi
2. Provider -> Client: Authorization code
3. Client -> Server: Code gonder
4. Server -> Provider: Code ile token al
5. Server -> Provider: Token ile kullanici bilgisi al
6. Server: Kullanici olustur veya bagla
7. Server -> Client: JWT token'lar
```

```typescript
// POST /api/v1/auth/oauth/google
{
  "idToken": "google-id-token"
}

// Response
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... },
    "isNewUser": true
  }
}
```

## Guvenlik Onlemleri

### 1. Brute Force Korumasi

```typescript
// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 5, // 5 deneme
  message: 'Too many login attempts, please try again later',
});

// Account lockout
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 dakika
```

### 2. Token Guveniligi

```typescript
// Secure token generation
import crypto from 'crypto';

function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Token hashing (refresh token icin)
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
```

### 3. Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
  },
}));
```

### 4. CORS Konfigurasyonu

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## API Endpoint'leri

### Auth Endpoints

```
POST   /api/v1/auth/register          # Kayit
POST   /api/v1/auth/login             # Giris
POST   /api/v1/auth/logout            # Cikis
POST   /api/v1/auth/refresh           # Token yenileme
POST   /api/v1/auth/forgot-password   # Sifre sifirlama istegi
POST   /api/v1/auth/reset-password    # Sifre sifirlama
POST   /api/v1/auth/verify-email      # Email dogrulama
GET    /api/v1/auth/me                # Mevcut kullanici
PATCH  /api/v1/auth/change-password   # Sifre degistirme
DELETE /api/v1/auth/account           # Hesap silme

# OAuth
POST   /api/v1/auth/oauth/google      # Google ile giris
POST   /api/v1/auth/oauth/apple       # Apple ile giris

# Sessions
GET    /api/v1/auth/sessions          # Aktif oturumlar
DELETE /api/v1/auth/sessions/:id      # Oturum sonlandirma
DELETE /api/v1/auth/sessions          # Tum oturumlari sonlandir
```

## Checklist

Her auth endpoint icin:

- [ ] Input validation yapildi
- [ ] Rate limiting uygulandı
- [ ] Error mesajlari bilgi sizintisi icermiyor
- [ ] Logging yapildi (hassas veri haric)
- [ ] Token guvenligi saglandi
- [ ] HTTPS zorunlu
- [ ] Test yazildi

---

*Bu strateji tum kimlik dogrulama ve yetkilendirme islemlerinde uygulanir.*
