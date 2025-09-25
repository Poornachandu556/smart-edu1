# Vercel Environment Variables Setup

## Your Website URL:
https://smart-79ko6wh64-jonnagadalac-2600s-projects.vercel.app

## Required Environment Variables:

### 1. NEXTAUTH_SECRET
```
942df43882bd03dad4d4dfd33165d1930e25f817e7da85fb9292a505b515a622
```

### 2. NEXTAUTH_URL
```
https://smart-79ko6wh64-jonnagadalac-2600s-projects.vercel.app
```

### 3. GOOGLE_CLIENT_ID
- Go to: https://console.cloud.google.com/
- Create/Select project
- Enable Google+ API
- Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
- Set authorized redirect URI: `https://smart-79ko6wh64-jonnagadalac-2600s-projects.vercel.app/api/auth/callback/google`
- Copy the Client ID

### 4. GOOGLE_CLIENT_SECRET
- From the same Google Cloud Console
- Copy the Client Secret

### 5. OPENAI_API_KEY (Optional but Recommended)
- Get from: https://platform.openai.com/api-keys
- **IMPORTANT**: Without this, AI tutor will show fallback responses
- For full AI functionality, add this environment variable

### 6. DATABASE_URL (If using external database)
- Your database connection string
- For now, you can skip this if using local SQLite

## How to Add in Vercel:

1. Go to: https://vercel.com/jonnagadalac-2600s-projects/smart-edu2/settings
2. Click "Environment Variables" tab
3. Add each variable with its value
4. Click "Save"
5. Redeploy: `vercel --prod`

## After Adding Variables:
Run this command to redeploy with new environment variables:
```bash
vercel --prod
```
