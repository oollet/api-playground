# 🌐 API Playground - Web App

Interactive Next.js web application for learning and testing REST APIs.

## 🌍 Live Demo

**Visit:** [api-playground-tawny.vercel.app](https://api-playground-tawny.vercel.app)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Package Manager:** pnpm

## 📁 Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── page.tsx      # Main playground page
│   │   ├── layout.tsx     # Root layout
│   │   └── globals.css   # Global styles
│   ├── lib/
│   │   └── api.ts        # API client functions
│   └── components/
│       └── ui/           # shadcn/ui components
├── package.json
└── pnpm-lock.yaml
```

## 🎯 Features

- ✅ All CRUD operations (GET, POST, PUT, PATCH, DELETE)
- ✅ Color-coded HTTP methods
- ✅ Real-time API response viewer
- ✅ Interactive data table
- ✅ Form validation
- ✅ Confirmation dialogs
- ✅ Educational comments throughout code

## 🔧 Configuration

The API endpoint is configured in `src/lib/api.ts`:

```typescript
export const API_BASE_URL = "https://api-playground-zita.onrender.com";
```

Change this to point to your own API server.

## 📦 Build

```bash
# Production build
pnpm build

# Start production server
pnpm start
```

## 🚀 Deploy to Vercel

This app is already deployed! See: [api-playground-tawny.vercel.app](https://api-playground-tawny.vercel.app)

To deploy your own:

1. Push to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repository
4. Set **Root Directory** to `web`
5. Deploy!

Vercel will automatically detect Next.js and configure everything.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

Part of the [API Playground](https://github.com/oollet/api-playground) project.
