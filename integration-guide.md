# SpiceCode Dashboard - Integration Guide

This document provides instructions for integrating the SpiceCode CLI with the SpiceCode Dashboard.

## Overview

The SpiceCode Dashboard is a web application that displays code metrics collected by the SpiceCode CLI. The dashboard allows you to:

1. View metrics for all your projects and files
2. Track metrics over time with historical data visualization
3. Identify code quality trends and issues

## Integration Steps

### 1. Get Your API Key

1. Log in to the SpiceCode Dashboard using GitHub authentication
2. Navigate to your Profile page
3. Copy your API key or generate a new one

### 2. Update SpiceCode CLI

To update your SpiceCode CLI to send metrics to the dashboard:

```javascript
// Example modification to spicecode/index.js

const axios = require('axios');

// After metrics are calculated
async function sendMetricsToDashboard(filePath, fileName, metrics, apiKey) {
  try {
    const projectName = process.cwd().split('/').pop(); // Get current directory name as project name
    
    const response = await axios.post('https://your-dashboard-url.com/api/metrics/submit', {
      projectName,
      filePath,
      fileName,
      metrics
    }, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
    console.log('Metrics sent to dashboard:', response.data.message);
  } catch (error) {
    console.error('Failed to send metrics to dashboard:', error.message);
  }
}

// Add a command line option for the API key
program
  .option('--api-key <key>', 'API key for SpiceCode Dashboard')
  .option('--project <name>', 'Project name for dashboard');

// In your main function
if (program.apiKey) {
  await sendMetricsToDashboard(filePath, fileName, metrics, program.apiKey);
}
```

### 3. Test the Integration

Run SpiceCode CLI with your API key:

```bash
spicecode analyze --api-key YOUR_API_KEY path/to/file.js
```

### 4. Verify in Dashboard

1. Log in to the SpiceCode Dashboard
2. Navigate to the Projects page
3. You should see your project and file metrics displayed

## Data Format

The metrics should be sent in the following format:

```json
{
  "projectName": "your-project-name",
  "filePath": "/path/to/file.js",
  "fileName": "file.js",
  "metrics": {
    "complexity": 5,
    "maintainability": 85,
    "linesOfCode": 120,
    "commentPercentage": 15,
    "duplications": 2,
    "bugs": 0,
    "vulnerabilities": 0,
    "codeSmells": 3
  }
}
```

## Deduplication

The dashboard automatically deduplicates metrics based on their content. If you submit identical metrics for the same file, they will not be duplicated in the database.

## Historical Data

Each time you submit different metrics for the same file, a new entry is created with a timestamp. This allows you to track changes over time and visualize trends in your code quality.
