![spicecloud-logo-text](https://github.com/user-attachments/assets/e90df7cf-587f-4533-af28-661ca40f3b94)

![spicecloudlogo](https://github.com/user-attachments/assets/c935c082-1f44-4b2c-adf3-d6cef059d1e5)


# SpiceCode Dashboard - README

A full-stack web application that serves as a dashboard for the SpiceCode CLI code analyzer. This application allows users to track code quality metrics over time, visualize trends, and manage multiple projects.

## Features

- **GitHub Authentication**: Secure login using GitHub OAuth
- **API Key Management**: Generate and manage API keys for CLI integration
- **Project Management**: View and organize multiple codebases
- **File-level Metrics**: Track metrics for individual files within projects
- **Historical Data**: View how code quality evolves over time
- **Metrics Visualization**: Interactive charts and graphs for data analysis
- **Deduplication**: Automatic deduplication of identical metrics submissions

## Tech Stack

### Backend
- **Express.js**: Web server framework
- **PostgreSQL**: Database for storing users, projects, and metrics
- **Sequelize**: ORM for database interactions
- **Passport.js**: Authentication middleware with GitHub strategy
- **JWT**: Token-based authentication for frontend-backend communication

### Frontend
- **React**: UI library for building the user interface
- **React Router**: Client-side routing
- **Material-UI**: Component library for consistent design
- **Recharts**: Charting library for metrics visualization
- **Axios**: HTTP client for API requests

## Project Structure

```
spicecode-dashboard/
├── server/                 # Backend Express application
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Sequelize models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server entry point
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable components
│       ├── contexts/       # React contexts
│       ├── pages/          # Page components
│       └── App.js          # Main React component
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── integration-guide.md    # Guide for integrating with SpiceCode CLI
├── deployment-guide.md     # Instructions for deploying to Render
└── test-data.md            # Sample data for testing
```

## Getting Started

See the [Deployment Guide](./deployment-guide.md) for instructions on setting up and deploying the application.

For information on integrating with the SpiceCode CLI, see the [Integration Guide](./integration-guide.md).

## Development

To run the application locally:

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```
3. Set up environment variables in `.env` files
4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Use the sample data in [test-data.md](./test-data.md) to validate the application's functionality.

## Deployment

This application is designed to be deployed as a single project on Render. See the [Deployment Guide](./deployment-guide.md) for detailed instructions.

## License

This project is licensed under the MIT License.
