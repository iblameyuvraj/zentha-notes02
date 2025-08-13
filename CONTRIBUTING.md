# Contributing to Zentha Notes 🤝

Thank you for your interest in contributing to Zentha Notes! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Support](#support)

## 📜 Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to a positive environment for our community include:

- Demonstrating empathy and kindness toward other people
- Being respectful of differing opinions, viewpoints, and experiences
- Giving and gracefully accepting constructive feedback
- Accepting responsibility and apologizing to those affected by our mistakes
- Focusing on what is best for the overall community

Examples of unacceptable behavior include:

- The use of sexualized language or imagery, and sexual attention or advances
- Trolling, insulting or derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Git
- A Supabase account (for testing)

### Fork and Clone

1. **Fork the repository**
   - Go to [https://github.com/iblameyuvraj/zentha-notes02](https://github.com/iblameyuvraj/zentha-notes02)
   - Click the "Fork" button in the top ight

2. **Clone your fork**
   ```bash
   git clone https://github.com/iblameyuvraj/zentha-notes02.git
   cd zentha-notes
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/iblameyuvraj/zentha-notes02.git
   ```

## 🛠️ Development Setup

### 1. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 2. Environment Setup

```bash
cp env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL scripts from `zAll setups/databse-setup/` in your Supabase SQL editor
3. Configure storage bucket following `zAll setups/MD-Files/STORAGE_SETUP.md`

### 4. Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

- **🐛 Bug Fixes**: Fix issues and improve stability
- **✨ New Features**: Add new functionality and improvements
- **📚 Documentation**: Improve docs, add examples, fix typos
- **🎨 UI/UX Improvements**: Enhance the user interface and experience
- **🧪 Tests**: Add or improve test coverage
- **🔧 Infrastructure**: Improve build process, CI/CD, deployment
- **🌐 Localization**: Add translations and internationalization
- **📊 Performance**: Optimize performance and reduce bundle size

### Before You Start

1. **Check existing issues**: Search for existing issues before creating new ones
2. **Discuss major changes**: Open an issue to discuss significant changes
3. **Follow the roadmap**: Check our roadmap for planned features
4. **Read documentation**: Familiarize yourself with the codebase and docs

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `invalid` - Something that won't be worked on
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 🔄 Pull Request Process

### 1. Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the code style guidelines
- Add tests for new functionality
- Update documentation as needed

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git commit -m "feat: add user profile management"
git commit -m "fix: resolve authentication redirect issue"
git commit -m "docs: update setup instructions"
git commit -m "test: add unit tests for storage functions"
```

### 4. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 5. Create a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template
5. Submit the PR

### 6. PR Review Process

- **Automated Checks**: CI/CD will run tests and linting
- **Code Review**: Maintainers will review your code
- **Address Feedback**: Make requested changes
- **Merge**: Once approved, your PR will be merged

## 🎨 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper typing
- Use strict mode in `tsconfig.json`

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use proper prop types and interfaces
- Implement proper error boundaries

### File Naming

- Use kebab-case for file names: `user-profile.tsx`
- Use PascalCase for components: `UserProfile`
- Use camelCase for functions and variables: `getUserData`

### Code Organization

```typescript
// 1. Imports (external, internal, relative)
import React from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

// 2. Types and interfaces
interface UserProfileProps {
  userId: string
  onUpdate?: (data: UserData) => void
}

// 3. Component definition
export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  // 4. Hooks
  const { user, loading } = useAuth()
  
  // 5. Event handlers
  const handleUpdate = (data: UserData) => {
    onUpdate?.(data)
  }
  
  // 6. Render
  return (
    <div>
      {/* JSX content */}
    </div>
  )
}
```

### Comments and Documentation

- Write clear, concise comments
- Document complex functions and components
- Use JSDoc for public APIs
- Keep comments up to date

## 🧪 Testing Guidelines

### Test Types

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Storage Tests**: Test file upload and download functionality

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test -- --testPathPattern=storage
```

### Writing Tests

```typescript
import { render, screen } from '@testing-library/react'
import { UserProfile } from './user-profile'

describe('UserProfile', () => {
  it('renders user information correctly', () => {
    render(<UserProfile userId="123" />)
    expect(screen.getByText('User Profile')).toBeInTheDocument()
  })
})
```

### Test Coverage

- Aim for at least 80% test coverage
- Focus on critical user paths
- Test error scenarios and edge cases
- Mock external dependencies appropriately

## 📚 Documentation

### Documentation Standards

- Write clear, concise documentation
- Include code examples
- Keep documentation up to date
- Use proper markdown formatting

### Documentation Types

- **README.md**: Project overview and setup
- **API Documentation**: Function and component APIs
- **Setup Guides**: Installation and configuration
- **Tutorials**: Step-by-step guides
- **Architecture**: System design and structure

### Updating Documentation

When making changes that affect documentation:

1. Update relevant documentation files
2. Add examples for new features
3. Update setup instructions if needed
4. Review and test documentation changes

## 🐛 Reporting Issues

### Before Reporting

1. **Search existing issues**: Check if the issue already exists
2. **Reproduce the issue**: Ensure you can reproduce it consistently
3. **Check documentation**: Verify it's not a configuration issue
4. **Test on latest version**: Ensure you're using the latest code

### Issue Template

Use the issue template and provide:

- **Clear title**: Brief description of the issue
- **Detailed description**: What happened vs. what was expected
- **Steps to reproduce**: Step-by-step instructions
- **Environment**: OS, browser, Node.js version
- **Screenshots**: If applicable
- **Console errors**: Any error messages

### Example Issue

```markdown
## Bug Report

**Description:**
User authentication fails when using Google OAuth

**Steps to Reproduce:**
1. Go to login page
2. Click "Sign in with Google"
3. Complete Google authentication
4. User is redirected to error page

**Expected Behavior:**
User should be redirected to dashboard after successful authentication

**Actual Behavior:**
User sees "Authentication failed" error message

**Environment:**
- OS: macOS 12.0
- Browser: Chrome 96.0.4664.110
- Node.js: 18.0.0

**Additional Information:**
Console shows: "Error: Invalid OAuth configuration"
```

## 💡 Feature Requests

### Before Requesting

1. **Check existing features**: Ensure the feature doesn't already exist
2. **Search issues**: Look for similar feature requests
3. **Consider alternatives**: Check if there's a workaround
4. **Think about scope**: Consider the complexity and impact

### Feature Request Template

- **Clear title**: Brief description of the feature
- **Detailed description**: What the feature should do
- **Use cases**: How it would be used
- **Mockups**: Visual examples if applicable
- **Implementation ideas**: Technical approach (optional)

## 🆘 Support

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the setup guides and README
- **Email**: support@zentha.in for urgent issues

### Community Guidelines

- Be respectful and constructive
- Help others when you can
- Follow the code of conduct
- Share knowledge and experiences

## 🏆 Recognition

### Contributors

We recognize and appreciate all contributors:

- **Code Contributors**: Those who submit code changes
- **Documentation Contributors**: Those who improve documentation
- **Bug Reporters**: Those who report and help fix bugs
- **Community Members**: Those who help others and provide feedback

### Hall of Fame

Top contributors will be featured in our README and documentation.

## 📄 License

By contributing to Zentha Notes, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Zentha Notes!** 🎉

Your contributions help make education more accessible and technology more powerful.

For questions about contributing, please contact us at hi@zentha.in 

