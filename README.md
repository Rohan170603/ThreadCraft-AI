# 🎉 ThreadCraft AI

Welcome to **ThreadCraft AI**—the cutting-edge tool for social media content creation! 🚀 This application is designed to revolutionize how you craft engaging posts for Twitter, Instagram, and LinkedIn. Utilizing **Next.js 14** and **TypeScript**, along with the power of **Gemini AI**, ThreadCraft AI streamlines the content generation process, ensuring you captivate your audience effortlessly.

---

## 🌟 Key Features

- **AI-Driven Content Creation**: Generate eye-catching social media posts in seconds with advanced generative AI, tailored for each platform.
- **Secure User Management**: Experience seamless user authentication and account management powered by **Clerk**.
- **Engagement Points System**: Earn points for using the app, encouraging continuous interaction and creativity.
- **Content Regeneration**: Access and refresh your previously generated content, keeping your feed dynamic and engaging.
- **Mobile-Optimized Design**: Enjoy a fully responsive interface that looks great on both desktop and mobile devices.
- **Preview Before You Post**: Get a sneak peek of your content to ensure it’s perfect before sharing it with the world.
- **Integration with Google's Generative AI (Gemini)**: Tap into Google's cutting-edge AI technology for top-notch content generation.

## 🛠 Technology Stack

**Frontend**:
- **Next.js 14**: High-performance server-side rendering for fast-loading pages.
- **TypeScript**: Strongly typed language for building robust applications.
- **Tailwind CSS**: A utility-first CSS framework for rapid, responsive design.

**Backend**:
- **Clerk**: Simplifying user authentication and management for a secure experience.
- **Gemini AI**: Leverage Google’s latest AI for intelligent content generation.

## 🚀 Getting Started

To set up your own instance of **ThreadCraft AI**, follow these instructions:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rohan170603/ThreadCraft-AI.git
   cd ThreadCraft-AI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=your_neon_database_url
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


