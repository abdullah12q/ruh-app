<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Project Context: Rُuh (رُوح)

This project is a premium, next-generation Islamic web platform. The aesthetic is non-traditional, minimalist, and highly immersive.

### Tech Stack & AI Instructions:

1. **Styling:** Strictly use Tailwind CSS. Do not write custom CSS unless absolutely necessary for GSAP.
2. **Design System:** Implement a "Deep Sanctuary" dark mode (#050505) utilizing glassmorphism (frosted glass, `backdrop-blur`) and subtle borders. Avoid pure white or pure black text to reduce eye strain.
3. **Animations:** Use GSAP for complex scroll-triggered animations and Framer Motion for simple UI state transitions (like modals and page transitions).
4. **State Management:** Use Zustand for global client state. Do not use Redux or React Context for global states unless strictly required.
5. **Database:** Use MongoDB with Mongoose. Ensure database connections are cached in development to prevent connection limits during hot reloads.
6. **Authentication:** Use Auth.js (NextAuth) with the MongoDB adapter.
7. **Data Fetching:** For external APIs (like Quran.com API), use Next.js native `fetch` with appropriate cache tags, or React Query for dynamic client-side fetching.

### Font Configuration:

- English UI: 'Plus Jakarta Sans' or 'Satoshi' (Primary), 'Inter' (Reading paragraphs).
- Arabic Quranic Text: 'KFGQPC Uthmanic Script HAFS' (Strictly for Quran).
- Arabic UI: 'IBM Plex Sans Arabic' or 'Tajawal'.
