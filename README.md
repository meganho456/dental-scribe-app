# Dental Scribe App

A small Next.js app that records audio, transcribes it with OpenAI Whisper, and converts the transcript into a concise Dental SOAP note (Subjective, Objective, Assessment, Plan) using GPT-4o. Uses the Universal Tooth Numbering system (1–32).

## Quick links
- Transcription action: `app/actions/transcribeAudio.ts`
- Route: `app/api/transcribe/route.ts`
- UI / recorder: `app/page.tsx`

## Prerequisites
- Node 18+ and npm
- An OpenAI API key with access to the required models

## Environment
Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=sk-...
```

## Install & Run (development)

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Usage
- Click “Start Clinical Session” to record, click “Stop Recording” to stop.
- The app sends the audio to `/api/transcribe`, obtains the raw transcript, then generates a condensed SOAP clinical note and displays it in the `Clinical Notes` textarea.

## API (local)
- POST `/api/transcribe` — multipart form-data with `file` field. Returns JSON: `{ "text": "...raw transcript...", "note": "...SOAP note..." }`

## Testing & troubleshooting
- Ensure `OPENAI_API_KEY` is set and server restarted after edits.
- If you get file-format errors, send the file with an explicit filename or ensure the server converts blobs to Buffer before sending to OpenAI.
- Inspect server console for transcription logs.

## Contributing / PR
- Create a feature branch, push, open PR (template available at `.github/PULL_REQUEST_TEMPLATE.md`).

## License
- MIT
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
