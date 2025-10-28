# 🔧 Phase 2: Infrastructure Layer - Overview

> **Nhiệm vụ:** Xây dựng tầng Infrastructure - nền tảng kết nối Database với Business Logic  
> **Thời gian ước tính:** 2-3 ngày (16-24 giờ)  
> **Trạng thái:** Chưa bắt đầu

---

## 🎯 Phase 2 làm gì?

### Mục tiêu chính

**Xây dựng tầng Infrastructure Layer** - cầu nối giữa Database (Prisma) và Business Logic (NestJS)

Theo nguyên tắc **Clean Architecture**, chúng ta KHÔNG cho phép:

- ❌ Controller gọi trực tiếp `prisma.user.findMany()`
- ❌ Business logic phụ thuộc vào Prisma
- ❌ Code bị ràng buộc chặt với database

Thay vào đó:

- ✅ Controller → Use Case → Repository Interface → Repository Implementation → Prisma
- ✅ Business logic chỉ biết đến Interface, không biết Prisma
- ✅ Dễ dàng thay đổi database (Prisma → TypeORM) mà không ảnh hưởng business logic

---

## 📦 Cấu trúc sẽ tạo

```
src/
├── core/
│   └── domain/
│       └── interfaces/
│           └── repositories/           ← Tầng Domain (Interface)
│               ├── base.repository.interface.ts
│               ├── user.repository.interface.ts
│               ├── scholarship.repository.interface.ts
│               └── application.repository.interface.ts
│
└── infras/
    ├── database/                        ← Database Module
    │   ├── database.module.ts          (Global module)
    │   └── prisma.service.ts           (Prisma wrapper)
    │
    └── repositories/                    ← Tầng Infrastructure (Implementation)
        ├── user.repository.ts
        ├── scholarship.repository.ts
        ├── application.repository.ts
        └── repositories.module.ts      (DI Container)
```

---

## 🔨 Các bước thực hiện

### **Step 2.1: Database Module** (2 giờ) ⭐ BẮT ĐẦU TỪ ĐÂY

**Làm gì:**

- Tạo `PrismaService` - wrapper cho Prisma Client
- Tạo `DatabaseModule` - NestJS module quản lý database connection
- Setup lifecycle hooks (connect/disconnect)

**Tại sao:**

- NestJS cần module để quản lý dependency injection
- Prisma cần được init đúng cách (connect khi app start, disconnect khi app stop)
- Có thể dùng lại ở mọi nơi nhờ `@Global()` decorator

**Output:**

```typescript
// Sau bước này, mọi module có thể inject PrismaService
constructor(private prisma: PrismaService) {}
```

**Files:**

- ✅ `src/infras/database/prisma.service.ts`
- ✅ `src/infras/database/database.module.ts`
- ✅ Update `src/app.module.ts`

---

### **Step 2.2: Repository Interfaces** (3 giờ)

**Làm gì:**

- Định nghĩa **interface** (contract) cho repositories
- Tạo `IRepositoryBase` với CRUD cơ bản
- Tạo interface riêng cho User, Scholarship, Application

**Tại sao:**

- **Dependency Inversion Principle (SOLID)**: Business logic phụ thuộc vào abstraction, không phụ thuộc implementation
- Dễ test (mock interface thay vì mock Prisma)
- Dễ thay đổi database sau này

**Ví dụ:**

```typescript
// Interface ở Domain Layer
export interface IRepositoryUser {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY'); // DI Token
```

**Files:**

- ✅ `base.repository.interface.ts` - CRUD chung
- ✅ `user.repository.interface.ts` - User specific
- ✅ `scholarship.repository.interface.ts`
- ✅ `application.repository.interface.ts`

---

### **Step 2.3: Repository Implementations** (4 giờ)

**Làm gì:**

- Implement các interface đã định nghĩa
- Sử dụng Prisma để tương tác database
- Setup Dependency Injection

**Tại sao:**

- Tách biệt business logic khỏi database implementation
- Mỗi repository chịu trách nhiệm cho 1 entity (Single Responsibility)
- Có thể swap implementation dễ dàng

**Ví dụ:**

```typescript
@Injectable()
export class UserRepository implements IRepositoryUser {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // ... other methods
}
```

**Setup DI:**

```typescript
@Module({
  providers: [
    {
      provide: USER_REPOSITORY, // Token
      useClass: UserRepository, // Implementation
    },
  ],
  exports: [USER_REPOSITORY],
})
export class RepositoriesModule {}
```

**Files:**

- ✅ `user.repository.ts`
- ✅ `scholarship.repository.ts`
- ✅ `application.repository.ts`
- ✅ `repositories.module.ts`

---

### **Step 2.4: Testing** (2 giờ)

**Làm gì:**

- Viết unit tests cho repositories
- Test CRUD operations
- Test custom methods

**Tại sao:**

- Đảm bảo repository hoạt động đúng
- Dễ refactor sau này
- Documentation through tests

**Ví dụ:**

```typescript
describe('UserRepository', () => {
  it('should find user by email', async () => {
    const user = await repository.findByEmail('admin@scholarship.com');
    expect(user).toBeDefined();
    expect(user.role).toBe('ADMIN');
  });
});
```

**Files:**

- ✅ `user.repository.spec.ts`
- ✅ `scholarship.repository.spec.ts`
- ✅ `application.repository.spec.ts`

---

## 🌟 Lợi ích của Phase 2

### 1. **Clean Architecture**

```
┌─────────────────────────────────────────────┐
│          Presentation Layer (API)           │
│         (Controllers, DTOs, Guards)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│          Application Layer                  │
│         (Use Cases, Services)               │
└─────────────────┬───────────────────────────┘
                  │ Depends on Interface ↓
┌─────────────────▼───────────────────────────┐
│          Domain Layer                       │
│    (Entities, Interfaces, Value Objects)    │ ← Repository Interfaces ở đây
└─────────────────────────────────────────────┘
                  ▲ Implements
┌─────────────────┴───────────────────────────┐
│       Infrastructure Layer                  │
│  (Repositories, Database, External APIs)    │ ← Repository Implementations ở đây
└─────────────────┬───────────────────────────┘
                  │
                  ▼
            [ PostgreSQL ]
```

### 2. **SOLID Principles**

✅ **S - Single Responsibility**

- Mỗi repository chịu trách nhiệm cho 1 entity
- `UserRepository` chỉ lo User, không lo Scholarship

✅ **O - Open/Closed**

- Mở cho mở rộng (thêm method mới)
- Đóng cho sửa đổi (không sửa interface sau khi ổn định)

✅ **L - Liskov Substitution**

- Có thể thay `UserRepository` bằng `MockUserRepository` trong test
- Không ảnh hưởng business logic

✅ **I - Interface Segregation**

- Interface nhỏ, tập trung
- Không ép client implement method không dùng

✅ **D - Dependency Inversion**

- Business logic phụ thuộc vào `IRepositoryUser` (abstraction)
- KHÔNG phụ thuộc vào `UserRepository` (implementation)

### 3. **Testability**

**Trước Phase 2:**

```typescript
// ❌ Khó test - phụ thuộc Prisma
class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Làm sao mock prisma.user.findUnique ???
  }
}
```

**Sau Phase 2:**

```typescript
// ✅ Dễ test - phụ thuộc interface
class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private userRepo: IRepositoryUser,
  ) {}

  async login(email: string) {
    const user = await this.userRepo.findByEmail(email);
    // Dễ dàng mock userRepo !!!
  }
}

// Test
const mockUserRepo: IRepositoryUser = {
  findByEmail: jest.fn().mockResolvedValue(fakeUser),
};
```

### 4. **Flexibility**

**Đổi database dễ dàng:**

```typescript
// Hiện tại: Prisma
class UserRepository implements IRepositoryUser {
  constructor(private prisma: PrismaService) {}
}

// Tương lai: TypeORM
class UserRepository implements IRepositoryUser {
  constructor(private typeorm: TypeOrmService) {}
}

// Business logic KHÔNG cần thay đổi gì!
```

---

## 🎓 Kiến thức cần thiết

### 1. **NestJS Concepts**

- Modules & Dependency Injection
- Providers & Custom Providers
- `@Injectable()` decorator
- `@Inject()` decorator với Symbol tokens

### 2. **TypeScript**

- Interfaces
- Generics (`IRepositoryBase<T>`)
- Symbols (DI tokens)
- Async/Await

### 3. **Design Patterns**

- Repository Pattern
- Dependency Injection
- Interface Segregation

---

## 📊 Timeline chi tiết

| Step      | Task                       | Time    | Output                         |
| --------- | -------------------------- | ------- | ------------------------------ |
| 2.1       | Database Module            | 2h      | PrismaService + DatabaseModule |
| 2.2       | Repository Interfaces      | 3h      | 4 interfaces + DI tokens       |
| 2.3       | Repository Implementations | 4h      | 3 repositories + module        |
| 2.4       | Testing                    | 2h      | Unit tests (80%+ coverage)     |
| **Total** | -                          | **11h** | Infrastructure foundation      |

---

## 🚀 Sau Phase 2 chúng ta có gì?

### ✅ Infrastructure hoàn chỉnh

```typescript
// Mọi service có thể inject repository
@Injectable()
class AnyService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: IRepositoryUser,
    @Inject(SCHOLARSHIP_REPOSITORY)
    private scholarshipRepo: IRepositoryScholarship,
  ) {}

  async doSomething() {
    const user = await this.userRepo.findById('...');
    const scholarships = await this.scholarshipRepo.findAll();
    // Business logic here
  }
}
```

### ✅ Sẵn sàng cho Phase 3 & 4

- Phase 3: Domain Entities & Business Logic
- Phase 4: Authentication (sử dụng UserRepository)

### ✅ Code base chất lượng

- Clean Architecture ✅
- SOLID Principles ✅
- Testable ✅
- Maintainable ✅
- Scalable ✅

---

## 🎯 Next Steps

### Bắt đầu ngay bây giờ:

1. **Confirm với anh:**
   - Đã hiểu rõ mục đích Phase 2?
   - Sẵn sàng bắt đầu Step 2.1?

2. **Start Step 2.1:**

   ```bash
   # Tạo module & service
   nest g module infras/database
   nest g service infras/database/prisma --no-spec
   ```

3. **Follow checklist** trong `DEVELOPMENT_ROADMAP.md`

---

## ❓ FAQs

**Q: Tại sao không dùng Prisma trực tiếp?**  
A: Prisma là implementation detail. Nếu sau này đổi database/ORM, toàn bộ business logic phải sửa. Với repository pattern, chỉ cần sửa implementation layer.

**Q: Repository pattern có phức tạp không?**  
A: Ban đầu mất thời gian setup, nhưng về lâu dài giúp code dễ maintain, test, và scale.

**Q: Có cần tạo repository cho tất cả 21 tables?**  
A: Không. Chỉ tạo cho các entity chính: User, Scholarship, Application. Các bảng khác tạo khi cần.

**Q: Bao giờ dùng Prisma trực tiếp được?**  
A: Trong repository implementation. KHÔNG BAO GIỜ dùng Prisma ở controller hay use case.

---

**Ready?** Bắt đầu Step 2.1 thôi! 🚀
