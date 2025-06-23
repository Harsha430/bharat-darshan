# Bharat Darshan - Indian Heritage Blog

A modern, responsive blog website built with React, Tailwind CSS, and Firebase, focused on Indian culture, heritage, and preserving our mother tongue.

## 🇮🇳 Features

- **Modern Design**: Clean, professional interface inspired by Indian flag colors
- **Responsive Layout**: Mobile-first design that works on all devices
- **Firebase Integration**: Authentication and Firestore database
- **Admin Dashboard**: Secure admin panel for content management
- **Rich Content**: Support for articles with images, tags, and formatted content
- **Social Sharing**: Share articles across social media platforms
- **Reading Progress**: Visual progress indicator for articles
- **Scroll Animations**: Smooth animations triggered by scroll
- **Search & Filter**: Find articles by title, content, author, or tags

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router DOM
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Auth and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bharat-darshan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config and update `.env` file

4. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Update with your Firebase configuration
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Firebase Setup

### Firestore Collections

1. **users** collection:
   ```javascript
   {
     uid: "user_id",
     name: "Admin Name",
     role: "admin"
   }
   ```

2. **posts** collection:
   ```javascript
   {
     title: "Article Title",
     content: "Article content...",
     tags: ["culture", "heritage"],
     imageUrl: "https://example.com/image.jpg",
     authorId: "user_id",
     authorName: "Author Name",
     timestamp: firestore.Timestamp,
     updatedAt: firestore.Timestamp (optional)
   }
   ```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
      allow update, delete: if request.auth != null &&
        request.auth.uid == resource.data.authorId;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Creating Admin Users

1. Create a user in Firebase Authentication
2. Add a document in the `users` collection with the user's UID:
   ```javascript
   {
     name: "Admin Name",
     role: "admin"
   }
   ```

## 🎨 Design System

### Color Palette

- **Saffron**: `#FF9933` - Primary accent color
- **White**: `#FFFFFF` - Background and text
- **Green**: `#138808` - Secondary accent color
- **Navy**: `#000080` - Headers and important text
- **Dark Gray**: `#333333` - Body text

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

## 📱 Routes

- `/` - Home page with blog articles
- `/post/:id` - Individual blog post
- `/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/admin/new` - Create new post (protected)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Build and deploy to Firebase
- `npm run deploy:hosting` - Deploy only hosting to Firebase
- `npm run serve` - Serve locally using Firebase

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── BlogCard.jsx
│   ├── LoadingSpinner.jsx
│   ├── ProtectedRoute.jsx
│   ├── ReadingProgress.jsx
│   └── SocialShare.jsx
├── pages/              # Route components
│   ├── Home.jsx
│   ├── PostDetail.jsx
│   ├── Login.jsx
│   ├── AdminDashboard.jsx
│   └── NewPost.jsx
├── hooks/              # Custom React hooks
│   └── useScrollAnimation.js
├── context/            # React context
│   └── AuthContext.jsx
├── firebase/           # Firebase configuration
│   ├── config.js
│   ├── auth.js
│   └── firestore.js
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## 🚀 Deployment

### Prerequisites for Deployment

1. **Firebase CLI**: Install globally
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Login**: Authenticate with your Google account
   ```bash
   firebase login
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase Hosting**
   ```bash
   firebase deploy
   ```

   Or deploy only hosting:
   ```bash
   firebase deploy --only hosting
   ```

### Automatic Deployment with GitHub Actions

This project includes GitHub Actions for automatic deployment:

1. **Setup GitHub Secrets**: Add these secrets to your GitHub repository:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `FIREBASE_SERVICE_ACCOUNT_BHARAT_DARSHAN_6920F`

2. **Generate Firebase Service Account**:
   ```bash
   firebase init hosting:github
   ```

3. **Push to main branch**: Deployment happens automatically on push to `main`

### Firebase Hosting Setup Commands

```bash
# Initialize Firebase in your project
firebase init

# Select:
# - Hosting: Configure files for Firebase Hosting
# - Use existing project: bharat-darshan-6920f
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds and deploys with GitHub: Yes

# Deploy manually
firebase deploy

# Serve locally
firebase serve
```

### Git Setup Commands

```bash
# Initialize git repository
git init

# Add remote origin (replace with your repository URL)
git remote add origin https://github.com/yourusername/bharat-darshan.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Bharat Darshan blog setup"

# Push to main branch
git push -u origin main
```

### Live URLs

- **Production**: https://bharat-darshan-6920f.web.app
- **Firebase Console**: https://console.firebase.google.com/project/bharat-darshan-6920f

## 🌟 Key Features Explained

### Admin Authentication
- Only pre-authorized admin accounts can access the dashboard
- Secure Firebase Authentication with email/password
- Role-based access control

### Content Management
- Rich text editor for article content
- Image URL support (external images only)
- Tag system for categorization
- Draft and publish workflow

### User Experience
- Smooth scroll animations
- Reading progress indicator
- Social media sharing
- Mobile-responsive design
- Fast loading with Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Indian heritage and culture
- Built with modern web technologies
- Designed for preserving and sharing knowledge

---

**"They may kill me, but they cannot kill my ideas."** - Bhagat Singh
