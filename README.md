# Metin 2 – Yapay Günlük (Fixed)

Çalışır Next.js + TypeScript proje iskeleti. `index.tsx` ve `api/metin2.ts` birbiriyle uyumlu, `tsconfig.json` tek obje.

## Kurulum
1) `OPENAI_API_KEY` ile `.env.local` oluşturun (lokalde) veya Vercel Project Settings > Environment Variables'a ekleyin.
```
OPENAI_API_KEY=sk-... 
```
2) `npm install`
3) `npm run dev`

## Deploy (Vercel)
- Repo'ya push edin.
- Vercel otomatik build eder. Gerekirse **Redeploy > Clear build cache**.

## Notlar
- `tsconfig.json` içinde `useUnknownInCatchVariables: false` aktiftir (TS catch hatası yaşamazsınız).
- API `POST /api/metin2` endpoint'i `{ entry: string }` bekler ve `{ reply: string }` döndürür.
