# Deepak — Portfolio

3D portfolio built with React, TypeScript, Three.js and GSAP.
Content lives in `src/config.ts`.

```bash
npm install
npm run dev
npm run build
```

## Deploy on Vercel
1. Push this folder to a GitHub repo and import it on vercel.com (Framework: Vite).
2. In Settings -> Environment Variables add `RESEND_API_KEY`.
3. Deploy. The contact form posts to `/api/contact` and emails you through Resend.
