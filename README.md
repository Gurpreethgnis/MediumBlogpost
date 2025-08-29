# DemoName R&D Hub - Internal Knowledge Sharing Platform

A modern, React-based internal knowledge sharing platform designed for pharmaceutical R&D organizations. Built with a focus on fast writing, safe sharing, and easy discovery within an organization.

## 🚀 Features

- **Modern React 18 + TypeScript** frontend with Tailwind CSS
- **Rich Text Editor** with TipTap for creating research posts
- **Role-Based Access Control** (RBAC) with SSO authentication
- **Post Management** with visibility controls (Org-wide, Space/Team, Private)
- **Interactive Elements** including likes, bookmarks, and comments
- **Search & Discovery** with tags and advanced filtering
- **Responsive Design** optimized for all devices
- **Bayer-inspired Styling** with modern, clean aesthetics

## 🏗️ Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Database**: PostgreSQL with Redis for caching
- **Storage**: MinIO (S3-compatible) for file uploads
- **Authentication**: OIDC with Passport.js
- **Containerization**: Docker Compose for local development

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- TipTap Rich Text Editor
- React Router for navigation
- React Query for data fetching
- Zustand for state management
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript for type safety
- Prisma ORM for database operations
- JWT for authentication
- Winston for logging
- Zod for validation
- Multer for file uploads

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd MediumBlogpost
```

### 2. Start the Services
```bash
# Start all services
docker-compose up -d

# Or start individual services
docker-compose up -d postgres redis minio
docker-compose up -d api
docker-compose up -d web
```

### 3. Access the Application
- **Frontend**: http://localhost:6545
- **API**: http://localhost:3001
- **PostgreSQL**: localhost:15432
- **Redis**: localhost:16379
- **MinIO**: http://localhost:9000

## 📁 Project Structure

```
MediumBlogpost/
├── api/                 # Backend API service
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Express middleware
│   │   ├── utils/      # Utility functions
│   │   └── config.ts   # Configuration
│   ├── prisma/         # Database schema & migrations
│   └── Dockerfile.dev  # Development container
├── web/                # Frontend React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── types/      # TypeScript interfaces
│   │   └── services/   # API service layer
│   ├── public/         # Static assets
│   └── Dockerfile.dev  # Development container
├── worker/             # Background job processor
├── docker-compose.yml  # Service orchestration
└── README.md          # This file
```

## 🔧 Development

### Frontend Development
```bash
cd web
npm install
npm run dev
```

### Backend Development
```bash
cd api
npm install
npm run dev
```

### Database Management
```bash
# Generate Prisma client
cd api
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio
```

## 🎨 Customization

### Styling
The platform uses Tailwind CSS with custom components. Key styling files:
- `web/src/index.css` - Global styles and custom components
- `web/tailwind.config.js` - Tailwind configuration

### Branding
To customize the branding:
1. Update company name in `web/src/components/Layout.tsx`
2. Modify colors in `web/tailwind.config.js`
3. Update page titles in `web/index.html`

## 🔐 Authentication

The platform supports OIDC authentication with configurable providers. Update the environment variables in `docker-compose.yml`:

```yaml
environment:
  - OIDC_CLIENT_ID=your_client_id
  - OIDC_CLIENT_SECRET=your_client_secret
  - OIDC_ISSUER_URL=your_issuer_url
  - OIDC_CALLBACK_URL=http://localhost:3001/auth/callback
```

## 📊 Database Schema

The platform includes comprehensive data models for:
- Users and authentication
- Posts and content management
- Comments and interactions
- Spaces and team organization
- Tags and categorization
- File attachments
- Audit logging

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd web
npm run build

# Backend
cd api
npm run build
```

### Environment Variables
Create `.env` files for production deployment:
- Database connection strings
- OIDC configuration
- File storage credentials
- Session secrets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code examples

## 🔄 Updates

The platform is actively maintained with regular updates for:
- Security patches
- Performance improvements
- New features
- Bug fixes

---

Built with ❤️ for modern R&D teams
