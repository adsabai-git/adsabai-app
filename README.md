# ThaiPost Ad Platform

A React-based advertisement posting platform built with Next.js, featuring user authentication and multiple ad posting tiers (Basic, Standard, Premium).

## Features

- **User Authentication**: Login and registration system
- **Protected Routes**: Ad posting requires user authentication
- **Three Ad Tiers**:
  - **Basic Ad**: Text-only advertisement with standard placement
  - **Standard Ad**: Enhanced advertisement with contact information and location targeting
  - **Premium Ad**: Featured advertisement with images, complete contact info, and website integration
- **Responsive Design**: Built with Tailwind CSS for mobile-first design
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── auth/
│   ├── login/
│   └── register/
├── ads/
│   ├── basic/
│   ├── standard/
│   └── premium/
├── components/
│   ├── Navigation.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## Authentication

The application uses a simple authentication system with:
- Email/password login
- User registration
- Local storage for session persistence
- Protected routes for ad posting

## Ad Posting Tiers

### Basic Ad
- Text-only advertisement
- Standard placement
- 30-day duration
- Basic analytics

### Standard Ad
- Enhanced text advertisement
- Contact information display
- Location-based targeting
- 60-day duration
- Detailed analytics
- Priority placement

### Premium Ad
- Featured advertisement placement
- Multiple high-quality images
- Complete contact information
- Website integration
- Advanced location targeting
- 90-day duration
- Premium analytics dashboard
- Top search result placement
- Social media integration

## Technologies Used

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **ESLint**: Code linting

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
