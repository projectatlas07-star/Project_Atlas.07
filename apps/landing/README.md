# Project Atlas Landing Application

Public-facing landing page for Project Atlas - AI Operating System for Insurance Restoration.

## Environment Variables

Required environment variable:

- `NEXT_PUBLIC_ATLAS_APP_URL`: URL of the authenticated Atlas web application (default: `http://localhost:3000`)

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Start Production

```bash
npm start
```

## Deployment

This application is designed for Vercel deployment. Ensure the `NEXT_PUBLIC_ATLAS_APP_URL` environment variable is set in your Vercel project settings.