# SpiceCode Dashboard - Deployment Guide

This document provides instructions for deploying the SpiceCode Dashboard to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. A [GitHub](https://github.com/) account with OAuth App credentials
3. PostgreSQL database (can be provisioned on Render)

## Deployment Steps

### 1. Set Up PostgreSQL Database on Render

1. Log in to your Render account
2. Navigate to "New" > "PostgreSQL"
3. Configure your database:
   - Name: `spicecode-dashboard-db`
   - Database: `spicecode_dashboard`
   - User: `spicecode_user`
   - Region: Choose the closest to your users
4. Click "Create Database"
5. Once created, note the "Internal Database URL" for later use

### 2. Deploy the Web Service

1. Navigate to "New" > "Web Service"
2. Connect your GitHub repository containing the SpiceCode Dashboard code
3. Configure the web service:
   - Name: `spicecode-dashboard`
   - Environment: `Node`
   - Build Command: `npm install && npm run install-client && npm run build`
   - Start Command: `npm start`
   - Instance Type: Choose based on your needs (starter is fine for testing)

4. Add the following environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   SESSION_SECRET=your_secure_session_secret
   GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
   GITHUB_CALLBACK_URL=https://your-render-app-url.onrender.com/api/auth/github/callback
   DATABASE_URL=your_internal_database_url_from_step_1
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://your-render-app-url.onrender.com
   ```

5. Click "Create Web Service"

### 3. Configure GitHub OAuth App

1. Go to GitHub > Settings > Developer settings > OAuth Apps
2. Create a new OAuth App:
   - Application name: `SpiceCode Dashboard`
   - Homepage URL: `https://your-render-app-url.onrender.com`
   - Authorization callback URL: `https://your-render-app-url.onrender.com/api/auth/github/callback`
3. Generate a new client secret
4. Update the environment variables in your Render web service with the GitHub Client ID and Secret

### 4. Verify Deployment

1. Once deployment is complete, visit your Render app URL
2. You should see the SpiceCode Dashboard login page
3. Test the GitHub authentication flow
4. Verify that you can generate an API key and view your profile

## Local Development Setup

To run the application locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```
3. Create a `.env` file in the root directory with the required environment variables
4. Create a `.env` file in the client directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Render logs for any error messages
2. Verify that all environment variables are correctly set
3. Ensure your GitHub OAuth App is properly configured
4. Check that your database connection string is correct

For local development issues:

1. Check that PostgreSQL is running and accessible
2. Verify that your `.env` files contain the correct configuration
3. Check the console for any error messages
