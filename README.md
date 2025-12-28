# AntiDL - Project Management System

A modern, feature-rich project management application inspired by Jira, built with Next.js 16 and TypeScript. Manage your teams, projects, and tasks with an intuitive interface featuring Kanban boards, table views, and calendar integration.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🏢 Workspace Management

- Create and manage multiple workspaces
- Invite team members via unique invite codes
- Role-based access control (Owner, Admin, Member)
- Workspace-specific settings and customization

### 📁 Project Organization

- Create unlimited projects within workspaces
- Custom project images and metadata
- Project-level task filtering and organization
- Quick project switching and navigation

### ✅ Advanced Task Management

- **Kanban Board**: Drag-and-drop tasks between status columns (Backlog, To Do, In Progress, In Review, Done)
- **Table View**: Sortable, filterable task list with bulk actions
- **Calendar View**: Timeline visualization with date-based organization
- Task properties: title, description, status, priority, assignee, dates, custom colors
- Real-time task updates and position tracking

### 👥 Team Collaboration

- Member management and role assignment
- Task assignment to team members
- User avatars and profiles
- Member activity tracking

### 🎨 User Experience

- **Dark/Light Mode**: System-wide theme support with smooth transitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Drag & Drop**: Intuitive task reordering and status updates
- **Search & Filter**: Quick access to tasks and projects
- **Collapsible Sidebar**: Maximize workspace with toggleable navigation

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 16.1 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React 19 with Server Components
- **Drag & Drop**: @dnd-kit
- **Tables**: TanStack React Table
- **Calendar**: react-big-calendar
- **Icons**: Lucide React
- **Theme**: next-themes

### Backend

- **Authentication**: NextAuth v5 (beta)
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma 6.19
- **Password Hashing**: bcryptjs
- **Validation**: Zod

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd jira-clone-next
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-here"
AUTH_URL="http://localhost:3000"
```

4. **Initialize the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
jira-clone-next/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes (login, register)
│   ├── (dashboard)/         # Protected dashboard routes
│   │   └── workspaces/      # Workspace-specific pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── tasks/              # Task-related components (Kanban, Table, Calendar)
│   ├── ui/                 # shadcn/ui base components
│   └── ...                 # Layout and shared components
├── features/               # Feature-based modules
│   ├── auth/              # Authentication logic
│   ├── workspaces/        # Workspace management
│   ├── projects/          # Project management
│   └── tasks/             # Task management
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses the following main entities:

- **User**: Authentication and profile information
- **Account**: OAuth provider accounts
- **Session**: User sessions
- **Workspace**: Team workspaces with invite codes
- **Member**: Workspace memberships with roles
- **Project**: Projects within workspaces
- **Task**: Tasks with status, priority, assignee, and dates

See [`prisma/schema.prisma`](prisma/schema.prisma) for the complete schema.

## 🎨 Key Features Showcase

### Kanban Board

- Drag-and-drop tasks between columns
- 5 status columns: Backlog, To Do, In Progress, In Review, Done
- Visual task cards with priority, assignee, and due dates
- Column-based task counting

### Table View

- Sortable columns
- Inline editing
- Bulk selection and actions
- Advanced filtering

### Calendar View

- Month/week/day views
- Drag tasks to reschedule
- Color-coded task display
- Quick task creation

## 📝 Development Commands

```bash
# Development
npm run dev          # Start development server

# Build
npm run build        # Create production build
npm run start        # Start production server

# Database
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema changes to database

# Linting
npm run lint         # Run ESLint
```

## 🔐 Authentication

The application uses NextAuth v5 with support for:

- Email/Password authentication (with bcrypt hashing)
- OAuth providers (configurable)
- Session-based authentication
- Protected routes and API endpoints

## 🎯 Roadmap

- [ ] Analytics dashboard
- [ ] Real-time notifications
- [ ] Task comments and activity log
- [ ] File attachments
- [ ] Advanced search
- [ ] Export functionality (CSV, PDF)
- [ ] Email notifications
- [ ] Subtasks and task dependencies
- [ ] Custom workflows
- [ ] API documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Minh** - Project Developer

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- Inspired by [Jira](https://www.atlassian.com/software/jira)

---

**Built with ❤️ using Next.js and TypeScript**
