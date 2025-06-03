# SpiceCode Dashboard - Mock Test Data

This file contains mock test data to validate the end-to-end data flow and deduplication functionality of the SpiceCode Dashboard.

## Sample API Request for Metrics Submission

```json
{
  "projectName": "test-project",
  "filePath": "/src/components/Button.js",
  "fileName": "Button.js",
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

## cURL Command for Testing

```bash
curl -X POST http://localhost:5000/api/metrics/submit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{
    "projectName": "test-project",
    "filePath": "/src/components/Button.js",
    "fileName": "Button.js",
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
  }'
```

## Deduplication Test

To test deduplication, submit the same metrics twice. The second submission should return a message indicating that the metrics already exist.

## Historical Data Test

To test historical data tracking, submit updated metrics for the same file:

```json
{
  "projectName": "test-project",
  "filePath": "/src/components/Button.js",
  "fileName": "Button.js",
  "metrics": {
    "complexity": 6,
    "maintainability": 82,
    "linesOfCode": 135,
    "commentPercentage": 14,
    "duplications": 3,
    "bugs": 1,
    "vulnerabilities": 0,
    "codeSmells": 4
  }
}
```

This should create a new entry in the metrics history while preserving the previous entry.
