# TaskSphere - Enterprise Task Management Platform

A modern, full-stack task management application built with React, TypeScript, Spring Boot, and MySQL. TaskSphere provides role-based access control, real-time collaboration, and comprehensive project tracking for teams of all sizes.

## 🚀 Features

### Core Functionality
- **Role-Based Access Control (RBAC)** - CEO, Admin, Manager, Team Leader, and Member roles
- **Task Management** - Create, assign, track, and manage tasks with priorities and deadlines
- **Team Collaboration** - Organize teams, assign tasks, and track progress
- **Real-time Dashboard** - Dynamic metrics, charts, and activity feeds
- **Calendar Integration** - View tasks by dates and deadlines
- **Organizational Hierarchy** - Microsoft Teams-style organizational structure
- **Dark/Light Mode** - Persistent theme preferences

### Advanced Features
- **Task Revert System** - Team leaders can revert completed tasks for quality control
- **Pagination** - Efficient data loading with 5 items per page
- **Drag & Drop Kanban** - Visual task management with status updates
- **Analytics & Reporting** - Performance metrics and productivity insights
- **Password Reset** - Secure password recovery system
- **Responsive Design** - Works seamlessly on desktop and mobile

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Spring Boot 3** with Java
- **Spring Security** for authentication
- **JWT** for secure token-based auth
- **MySQL** database
- **Maven** for dependency management
- **CORS** configuration for cross-origin requests

### Architecture
- **Microservices** - Separate UserService and TaskService
- **RESTful APIs** - Clean API design
- **Role-based routing** - Dynamic navigation based on user roles
- **Centralized state management** - React Context for auth

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **MySQL** 8.0+
- **Maven** 3.6+

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskSphere/backend
   ```

2. **Configure MySQL Database**
   ```sql
   CREATE DATABASE tasksphere;
   CREATE USER 'tasksphere_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON tasksphere.* TO 'tasksphere_user'@'localhost';
   ```

3. **Update application.properties**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/tasksphere
   spring.datasource.username=tasksphere_user
   spring.datasource.password=your_password
   ```

4. **Start UserService**
   ```bash
   cd TaskSphere/Backend/UserService
   mvn spring-boot:run
   # Runs on http://localhost:8086
   ```

5. **Start TaskService**
   ```bash
   cd TaskSphere/Backend/TaskService
   mvn spring-boot:run
   # Runs on http://localhost:8087
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd TaskSphere/frontend/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # Runs on http://localhost:8081
   ```

## 🏗 Project Structure

```
TaskSphere/
├── backend/
│   ├── UserService/          # User management microservice
│   └── TaskService/          # Task management microservice
├── frontend/
│   └── client/
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   ├── pages/        # Application pages
│       │   ├── contexts/     # React contexts
│       │   ├── services/     # API services
│       │   └── lib/          # Utilities
│       └── public/
└── README.md
```

## 👥 User Roles & Permissions

### CEO
- Full system access
- View all organizational data
- Manage all users and teams

### Admin
- User management
- System configuration
- Access to all features except CEO-level controls

### Manager
- Team oversight
- Task assignment and management
- Performance analytics

### Team Leader
- Team member management
- Task assignment within team
- Task revert capabilities
- Team performance tracking

### Member
- Personal task management
- Team collaboration
- Task status updates

## 🔐 Authentication Flow

1. **Login** - JWT token generation
2. **Role Detection** - Dynamic dashboard routing
3. **Protected Routes** - Role-based access control
4. **Token Persistence** - Secure token storage
5. **Password Reset** - Email-based recovery

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    role VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    team_leader_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to BIGINT,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status VARCHAR(20) DEFAULT 'TODO',
    deadline DATE,
    progress INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 UI/UX Features

- **Modern Design** - Clean, professional interface
- **Responsive Layout** - Mobile-first approach
- **Smooth Animations** - Framer Motion powered
- **Consistent Theming** - Dark/Light mode support
- **Accessibility** - WCAG compliant components
- **Loading States** - Skeleton screens and spinners

## 🔧 Configuration

### Environment Variables
```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:8086
VITE_TASK_API_URL=http://localhost:8087

# Backend (application.properties)
server.port=8086
spring.datasource.url=jdbc:mysql://localhost:3306/tasksphere
jwt.secret=your-secret-key
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Docker)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/app.jar app.jar
EXPOSE 8086
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: support@tasksphere.app
- Documentation: [docs.tasksphere.app](https://docs.tasksphere.app)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time notifications
- [ ] File attachments
- [ ] Time tracking
- [ ] Advanced reporting
- [ ] API integrations
- [ ] Workflow automation

---

**TaskSphere** - Empowering teams to achieve more, together.