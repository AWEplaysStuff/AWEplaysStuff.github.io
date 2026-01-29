<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1syB4EHXl9V0QTim57SkRqPtgAdwXTQ0C

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup Instructions:

1. **Add your Gemini API Key as a repository secret:**
   - Go to your repository settings
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Click "Add secret"

2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"

3. **Deploy:**
   - Push your changes to the `main` branch
   - The GitHub Actions workflow will automatically build and deploy your app
   - Your app will be available at: `https://AWEplaysStuff.github.io`

### Manual Deployment:

You can also trigger a manual deployment:
- Go to Actions tab in your repository
- Select "Deploy to GitHub Pages" workflow
- Click "Run workflow"
