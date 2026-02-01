# FindMate – Your Perfect Roommate is Just a Search Away! 🏠

**Live Demo:** [https://findmate-com.vercel.app/](https://findmate-com.vercel.app/)

Built with Next.js 14 App Router, Clerk for Auth, React, Prisma ORM, PostgreSQL, Tailwind CSS, UploadThing, Razorpay for payments, TypeScript, and more.

<p align="center">
  <img src="<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d63bee00-fd18-48c4-800b-4be6114cb65d" />
" alt="FindMate Dashboard Screenshot" width="800"/>
</p>

## Features

### Core Technologies:
- **Next.js 14 App Router** for server-side rendering, file-based routing, and API endpoints with Server Components
- **React 18** for building interactive user interfaces with reusable components
- **Clerk** for secure authentication with email/password, Google, and GitHub Sign-in
- **Prisma ORM** for type-safe database queries and schema management
- **PostgreSQL** for reliable relational database storage
- **Tailwind CSS** for utility-first, responsive styling with custom design system
- **UploadThing** for secure file uploads (profile photos, documents) up to 4MB
- **Razorpay** for subscription management and secure payment processing (₹399/6 months, ₹599/1 year)
- **TypeScript** for static typing and enhanced development experience
- **Lucide Icons** for beautiful, consistent iconography

### Application Features:
- Smart city-based search with budget range and gender preference filters
- Freemium model: Browse roommates for free, send requests with premium
- Connection request system with accept/reject workflow
- Profile management with 3-slide onboarding form
- Room Buddies dashboard for accepted connections
- Premium access control for contact details, social links, and documents
- Real-time notification bell with badge count
- Secure payment flow with Razorpay signature verification
- Responsive design for mobile, tablet, and desktop
- 🚀 Session storage caching for faster searches
- 🛠️ Production-ready deployment on Vercel
- 🔔 Toast notifications for user actions and status updates
- ⚙️ Performance optimization with selective queries
- 🔍 SEO-friendly with server-side rendering

## ✨ Getting Started

### Prerequisites
```bash
Node.js 18+ and npm/yarn
PostgreSQL database
Accounts: Clerk, Razorpay, UploadThing
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/findmate.git
cd findmate
```

2. Install dependencies
```bash
npm install
```

3. Copy the .env.example variables into a separate .env.local file
```bash
cp .env.example .env.local
```

4. Create the required credentials:
   - Clerk authentication keys
   - Razorpay API credentials
   - UploadThing configuration
   - PostgreSQL database URL

5. Set up the database
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ How to Fork and Clone

1. Click the "Fork" button in the top right corner of this repository to create your own copy
2. Clone your forked repository to your local machine
3. Install dependencies with `npm install`
4. Set up your environment variables in `.env.local`
5. Run the development server with `npm run dev`

## 📁 Project Structure
```
findmate/
├── app/
│   ├── (landing)/              # Landing page route group
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── components/         # Dashboard-specific components
│   │   ├── pricing/           # Premium plans page
│   │   ├── profile/           # User profile management
│   │   ├── profile-view/[id]/ # View other profiles
│   │   ├── my-posts/          # User's posts
│   │   └── room-buddies/      # Accepted connections
│   ├── api/                   # API routes
│   │   ├── payment/           # Razorpay integration
│   │   ├── posts/             # Post CRUD operations
│   │   ├── requests/          # Connection requests
│   │   ├── connections/       # Accepted connections
│   │   └── notifications/     # Notification system
│   ├── sign-in/               # Clerk sign-in
│   └── sign-up/               # Clerk sign-up
├── components/                # Shared components
├── lib/                       # Utility functions
│   ├── db.ts                  # Prisma client
│   └── razorpay.ts            # Payment utilities
├── prisma/
│   └── schema.prisma          # Database schema
└── middleware.ts              # Authentication middleware
```

## 💳 Payment Plans

- **6 Months Plan**: ₹399 - Perfect for short-term searches
- **1 Year Plan**: ₹599 - Best value, save ₹199!

Premium features include:
- Unlimited connection requests
- View phone numbers of accepted connections
- Access social media links
- Download verification documents
- Priority support

## 🎯 Key Features Explained

### Freemium Model
- Free users can browse all roommate listings and view basic info
- Premium required to send connection requests and view contact details
- Clear upgrade prompts guide users to premium plans

### Connection Flow
1. User searches for roommates by city/budget/gender
2. Clicks "Send Request" (requires premium)
3. Request appears in recipient's notification bell
4. Recipient accepts or rejects
5. Accepted connections move to "Room Buddies"
6. Full contact info visible to both parties

### Security Features
- Clerk authentication with JWT tokens
- Razorpay signature verification (HMAC SHA256)
- Database-level unique constraints
- Foreign key cascading for data integrity
- Protected API routes with authentication checks

## 🙏 Acknowledgements

- [Clerk](https://clerk.com) for authentication
- [Razorpay](https://razorpay.com) for payment processing
- [Prisma](https://www.prisma.io) for database ORM
- [UploadThing](https://uploadthing.com) for file uploads
- [Vercel](https://vercel.com) for hosting

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
