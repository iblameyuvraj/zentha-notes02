# Zentha Notes 📚

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-orange?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Premium Study Materials & Educational Resources for Engineering Students**

Zentha Notes is a comprehensive educational platform designed to provide high-quality study materials, notes, and assignments for engineering students. Built with modern web technologies, it offers a seamless learning experience with robust authentication, file management, and content organization.

## ✨ Features

### 🎓 Educational Content Management
- **Multi-Year Support**: Organized content for 1st, 2nd, 3rd, and 4th year students
- **Subject Combinations**: Physics & PPS, Chemistry & Civil combinations for 1st year
- **Smart Organization**: Automatic folder structure based on year, semester, and subject
- **File Types**: Support for PDF, DOC, DOCX, images, ZIP, and 7Z files
- **Content Categories**: Notes and Assignments with detailed descriptions

### 🔐 Authentication & User Management
- **Secure Authentication**: Supabase-powered user authentication
- **Role-Based Access**: Student and Teacher roles with different permissions
- **Profile Management**: User profiles with academic information
- **Session Management**: Automatic session handling and redirects
- **Account Security**: Password protection and account deletion

### 📁 File Upload & Storage
- **Teacher Dashboard**: Dedicated interface for content uploads
- **Smart Storage**: Automatic organization in Supabase Storage
- **File Validation**: Size and type validation (25MB limit)
- **Download Tracking**: Monitor download statistics
- **Public Access**: Secure download URLs for students

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Interactive Components**: Radix UI components for accessibility
- **Animations**: Smooth transitions with Framer Motion
- **Toast Notifications**: User feedback with Sonner

### 🔍 SEO Optimized
- **Meta Tags**: Dynamic titles and descriptions
- **Structured Data**: Schema.org markup for search engines
- **Sitemap**: Automatic XML sitemap generation
- **Social Media**: Open Graph and Twitter Card optimization
- **Performance**: Optimized loading and Core Web Vitals

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/zentha-notes.git
   cd zentha-notes
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   
   Run the SQL scripts in your Supabase SQL editor:
   - [Database Setup](./zAll%20setups/databse-setup/db.sql)
   - [Teacher Uploads Table](./zAll%20setups/databse-setup/teacher_uploads.sql)

5. **Configure Storage Bucket**
   
   Follow the [Storage Setup Guide](./zAll%20setups/STORAGE_SETUP.md) to create and configure the `teacher-uploads` bucket.

6. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
zentha-notes/
├── app/                          # Next.js app directory
│   ├── dashboard1/              # 1st year student dashboards
│   ├── dashboard2/              # 2nd year student dashboards
│   ├── dashboard3/              # 3rd year student dashboards
│   ├── dashboard4/              # 4th year student dashboards
│   ├── teacher-dashboard/       # Teacher upload interface
│   ├── login/                   # Authentication pages
│   ├── signup/
│   └── settings/                # User settings
├── components/                   # Reusable UI components
│   ├── ui/                      # Radix UI components
│   └── ...                      # Custom components
├── lib/                         # Utility functions
│   ├── supabase.ts             # Supabase client
│   ├── storage.ts              # File storage utilities
│   └── utils.ts                # General utilities
├── contexts/                    # React contexts
│   └── AuthContext.tsx         # Authentication context
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
│   └── 1st-year/              # Study materials
└── zAll setups/                # Setup documentation
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library

### Backend & Database
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **Supabase Storage** - File storage
- **Row Level Security** - Data protection

### Development Tools
- **pnpm** - Package manager
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your_ga_id
```

### Database Schema

The application uses the following main tables:

- **profiles** - User profiles and academic information
- **teacher_uploads** - File upload records and metadata

See the [Database Setup Guide](./zAll%20setups/databse-setup/) for detailed schema information.

## 📚 Usage

### For Students

1. **Sign Up**: Create an account with your academic details
2. **Select Year**: Choose your current year (1st, 2nd, 3rd, 4th)
3. **Choose Combination**: Select your subject combination
4. **Access Materials**: Browse notes and assignments for your subjects
5. **Download**: Access study materials through secure download links

### For Teachers

1. **Teacher Login**: Access the teacher dashboard
2. **Upload Content**: Upload notes and assignments with metadata
3. **Organize**: Files are automatically organized by year/subject
4. **Track**: Monitor download statistics and content usage

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Add environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Configure build settings for Next.js
- **Railway**: Direct deployment from GitHub
- **DigitalOcean App Platform**: Containerized deployment

## 🧪 Testing

### Storage Testing

Visit `/test-storage` to run automated storage tests and verify your setup.

### Manual Testing

1. **Authentication**: Test signup, login, and logout flows
2. **File Upload**: Upload files through teacher dashboard
3. **Content Access**: Verify student access to uploaded materials
4. **Responsive Design**: Test on various screen sizes

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **File Validation**: Type and size validation before upload
- **User Isolation**: Users can only access their own content
- **HTTPS**: Secure communication with Supabase
- **Input Validation**: Client and server-side validation

## 📈 Performance

- **Image Optimization**: Automatic WebP/AVIF conversion
- **Bundle Splitting**: Code splitting for faster loads
- **CDN Delivery**: Supabase Storage with global CDN
- **Caching**: Strategic caching for static assets
- **Core Web Vitals**: Optimized for performance metrics

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation

- [Supabase Setup Guide](./zAll%20setups/SUPABASE_SETUP.md)
- [Authentication Setup](./zAll%20setups/AUTH_SETUP.md)
- [Storage Setup Guide](./zAll%20setups/STORAGE_SETUP.md)
- [Teacher Dashboard Guide](./zAll%20setups/TEACHER_DASHBOARD_IMPLEMENTATION.md)
- [SEO Implementation](./zAll%20setups/SEO_IMPLEMENTATION.md)

### Getting Help

- **Issues**: Create an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact us at support@zentha.in

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling system
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📊 Project Status

- **Version**: 0.1.0
- **Status**: Active Development
- **Last Updated**: December 2024
- **Maintainer**: Zentha Studio

---

<div align="center">
  <p>Made by <a href="https://zentha.in">Zentha Studio</a> in collab with <a href="https://yuvraj.site">Yuvraj Soni</a></p>
  <p>Empowering education through technology</p>
</div> 