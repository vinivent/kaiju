# Kaiju - Exotic Reptile SaaS Backend

A comprehensive Java Spring Boot backend for an exotic reptile-focused platform.

## Features Implemented

### 1. **Product Marketing System**
- Full CRUD operations for reptile products
- Categories: Food, Habitat, Heating, Lighting, Health, Accessories, etc.
- Search and filtering capabilities
- Product ratings and reviews tracking
- Inventory management
- Multi-image support

**Endpoints:**
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product details
- `GET /api/products` - List all products (with filters)
- `GET /api/products/search?keyword=` - Search products
- `GET /api/products/top-rated` - Top rated products
- `GET /api/products/latest` - Latest products
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### 2. **Veterinarian Professional Directory**
- Veterinarian profiles with specializations
- License verification system
- Location-based search with geospatial queries
- Specialization filtering (Herpetology, Reptile Surgery, etc.)
- Rating and review system
- Chat availability status

**Endpoints:**
- `POST /api/veterinarians` - Register veterinarian
- `GET /api/veterinarians/{id}` - Get veterinarian profile
- `GET /api/veterinarians` - List veterinarians (with filters)
- `GET /api/veterinarians/search?keyword=` - Search by name/clinic
- `GET /api/veterinarians/specialization/{spec}` - Filter by specialization
- `GET /api/veterinarians/nearby?lat=&lon=&radius=` - Find nearby vets
- `GET /api/veterinarians/top-rated` - Top rated veterinarians
- `PATCH /api/veterinarians/{id}/verify` - Verify veterinarian
- `PUT /api/veterinarians/{id}` - Update profile

### 3. **Healthcare Location Search**
- Clinics, hospitals, pet stores, emergency centers
- Geospatial search for nearby locations
- Location type filtering
- Emergency service availability
- Operating hours and contact information
- Multi-veterinarian associations

**Endpoints:**
- `POST /api/locations` - Add healthcare location
- `GET /api/locations/{id}` - Get location details
- `GET /api/locations` - List all locations (with filters)
- `GET /api/locations/search?keyword=` - Search locations
- `GET /api/locations/nearby?lat=&lon=&radius=` - Find nearby
- `GET /api/locations/emergency` - Emergency locations
- `GET /api/locations/top-rated` - Top rated locations
- `PATCH /api/locations/{id}/verify` - Verify location

### 4. **Information & Article System**
- Rich content management for educational articles
- Categories: Care guides, species profiles, health, nutrition, etc.
- SEO-friendly slugs
- Featured articles
- View, like, and share tracking
- Tag-based organization
- Draft/Published workflow

**Endpoints:**
- `POST /api/articles` - Create article
- `GET /api/articles/{id}` - Get article by ID
- `GET /api/articles/slug/{slug}` - Get by slug (SEO-friendly)
- `GET /api/articles` - List articles (with filters)
- `GET /api/articles/search?keyword=` - Search articles
- `GET /api/articles/tag/{tag}` - Articles by tag
- `GET /api/articles/popular` - Most viewed articles
- `GET /api/articles/latest` - Latest articles
- `PATCH /api/articles/{id}/view` - Increment view count
- `PATCH /api/articles/{id}/like` - Increment like count

### 5. **Professional Chat System**
- Real-time chat between users and veterinarians
- Conversation management
- Message attachments support
- Read/unread tracking
- Conversation status (Active/Closed/Archived)
- Message history

**Endpoints:**
- `POST /api/chat/conversations` - Start conversation
- `GET /api/chat/conversations` - Get user's conversations
- `GET /api/chat/conversations/{id}` - Get conversation details
- `POST /api/chat/conversations/{id}/messages` - Send message
- `GET /api/chat/conversations/{id}/messages` - Get messages
- `PATCH /api/chat/conversations/{id}/read` - Mark as read
- `PATCH /api/chat/conversations/{id}/close` - Close conversation
- `GET /api/chat/unread-count` - Get unread count

## Project Structure

```
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── cesar/
                    └── kaiju/
                        ├── controller/       # REST controllers
                        │   ├── AuthController.java
                        │   ├── UserController.java
                        │   ├── ProductController.java
                        │   ├── VeterinarianController.java
                        │   ├── HealthcareLocationController.java
                        │   ├── ArticleController.java
                        │   └── ChatController.java
                        ├── dto/              # Data Transfer Objects
                        │   ├── Product (Request/Response) DTOs
                        │   ├── Veterinarian (Request/Response) DTOs
                        │   ├── HealthcareLocation (Request/Response) DTOs
                        │   ├── Article (Request/Response) DTOs
                        │   └── Chat (Request/Response) DTOs
                        ├── enums/            # Enumerations
                        │   ├── ProductCategory.java
                        │   ├── ProductStatus.java
                        │   ├── VeterinarianSpecialization.java
                        │   ├── LocationType.java
                        │   ├── ArticleCategory.java
                        │   ├── ArticleStatus.java
                        │   ├── ConversationStatus.java
                        │   ├── MessageType.java
                        │   └── UserRole.java
                        ├── model/            # JPA Entities
                        │   ├── User.java
                        │   ├── UserVerified.java
                        │   ├── PasswordResetToken.java
                        │   ├── Product.java
                        │   ├── Veterinarian.java
                        │   ├── HealthcareLocation.java
                        │   ├── Article.java
                        │   ├── ChatConversation.java
                        │   └── ChatMessage.java
                        ├── repository/       # JPA Repositories
                        │   ├── UserRepository.java
                        │   ├── UserVerifiedRepository.java
                        │   ├── PasswordResetTokenRepository.java
                        │   ├── ProductRepository.java
                        │   ├── VeterinarianRepository.java
                        │   ├── HealthcareLocationRepository.java
                        │   ├── ArticleRepository.java
                        │   ├── ChatConversationRepository.java
                        │   └── ChatMessageRepository.java
                        └── service/          # Business logic (to be implemented)
```

## Technology Stack

- **Framework:** Spring Boot 3.x
- **Database:** JPA/Hibernate (PostgreSQL recommended)
- **Security:** Spring Security with JWT
- **Validation:** Jakarta Validation
- **Documentation:** Lombok for boilerplate reduction

## Key Features

### Geospatial Capabilities
- Nearby search using Haversine formula for veterinarians and locations
- Latitude/longitude support
- Configurable search radius

### Search & Filtering
- Full-text search across multiple entities
- Category and status filtering
- Tag-based filtering for articles
- Pagination support on all list endpoints

### Security Features
- JWT-based authentication
- Password reset token system
- Email verification workflow
- User role management

### Data Integrity
- Comprehensive validation using Jakarta Validation
- Unique constraints on critical fields
- Proper entity relationships with JPA

## Next Steps

### Service Layer Implementation
Create service classes with business logic for:
1. `ProductService` - Product management logic
2. `VeterinarianService` - Veterinarian profile management
3. `HealthcareLocationService` - Location management
4. `ArticleService` - Content management with slug generation
5. `ChatService` - Real-time chat functionality

### Additional Enhancements
- Review and rating system implementation
- File upload service for images
- Email notification service
- Real-time WebSocket support for chat
- Advanced search with Elasticsearch
- Caching layer with Redis
- API documentation with Swagger/OpenAPI

## Database Schema Notes

### Key Relationships
- `Product` → Many-to-One → `User` (seller)
- `Veterinarian` → One-to-One → `User`
- `HealthcareLocation` → Many-to-Many → `Veterinarian`
- `Article` → Many-to-One → `User` (author)
- `ChatConversation` → Many-to-One → `User` and `Veterinarian`
- `ChatMessage` → Many-to-One → `ChatConversation` and `User` (sender)

### Special Fields
- **Timestamps:** All entities have `createdAt` and `updatedAt`
- **Soft Delete:** Consider implementing for data retention
- **Audit:** User actions tracked through relationships

## API Best Practices

- RESTful endpoint design
- Proper HTTP status codes
- Pagination for list endpoints
- Filtering and search capabilities
- Validation error responses
- Consistent response formats using DTOs

## Development Notes

- All DTOs use Java Records for immutability
- Repositories use Spring Data JPA with custom queries
- Controllers follow RESTful conventions
- Enums provide type-safe categorization
- Lombok reduces boilerplate code
