# MERN Memories App

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) for sharing and discovering memories through posts, images, and videos.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure login/signup
- **Role-based access control** (Admin, User)
- **Protected routes** - users can only edit/delete their own posts
- **Secure password hashing** using bcryptjs

### 🎨 Modern UI/UX
- **Material-UI components** for consistent, beautiful design
- **Responsive design** that works on all devices
- **Loading skeletons** and spinners for better user experience
- **Modern card-based layout** with smooth animations

### 📱 Core Functionality
- **Create, read, update, delete** memories with rich media support
- **Image and video uploads** with preview
- **Tag-based organization** for easy discovery
- **Real-time search** across posts and tags
- **Pagination** for better performance

### ❤️ Social Features
- **Like/Unlike posts** with visual feedback
- **Comment system** with user avatars
- **User profiles** showing personal memories
- **Creator attribution** on all posts

### 🔍 Search & Discovery
- **Real-time search** with debounced input
- **Tag-based filtering** for content discovery
- **Search by title, message, or tags**

### 👑 Admin Features
- **Admin dashboard** with platform statistics
- **User management** capabilities
- **Content moderation** tools
- **System overview** and activity monitoring

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-memories-app
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   JWT_SECRET=your-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/memories
   PORT=5000
   ```

5. **Start the application**
   
   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm start
   ```
   
   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
project_mern_memories/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── actions/       # Redux actions
│   │   ├── reducers/      # Redux reducers
│   │   ├── api/           # API functions
│   │   └── constants/     # Action types
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/search` - Search posts
- `GET /posts/:id` - Get specific post
- `POST /posts` - Create new post (authenticated)
- `PATCH /posts/:id` - Update post (owner/admin only)
- `DELETE /posts/:id` - Delete post (owner/admin only)
- `PATCH /posts/:id/likePost` - Like/unlike post (authenticated)
- `POST /posts/:id/comments` - Add comment (authenticated)
- `DELETE /posts/:id/comments/:commentId` - Remove comment (owner/admin only)

## 🎯 Key Technologies

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 🔒 Security Features

- **JWT token validation** on protected routes
- **Password hashing** with bcryptjs
- **Role-based access control** (RBAC)
- **Owner-only modifications** for posts and comments
- **Input validation** and sanitization
- **CORS protection** for cross-origin requests

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🚀 Performance Features

- **Lazy loading** for better initial load times
- **Debounced search** to reduce API calls
- **Pagination** for large datasets
- **Optimized images** and media handling
- **Efficient state management** with Redux

## 🔮 Future Enhancements

- [ ] **Real-time notifications** using WebSockets
- [ ] **Image optimization** and compression
- [ ] **Advanced search filters** (date, location, etc.)
- [ ] **Social sharing** integration
- [ ] **Mobile app** using React Native
- [ ] **Analytics dashboard** for creators
- [ ] **Content moderation** AI
- [ ] **Multi-language support**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Material-UI team for the amazing component library
- MongoDB team for the robust database solution
- React team for the incredible frontend framework
- Express.js team for the lightweight web framework

---

**Happy coding! 🎉**
