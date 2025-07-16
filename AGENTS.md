# Agent Task: API Setup and Verification

This document outlines the steps for an AI agent to set up and verify the quiz API.

## 1. Understand the API

- **Objective:** Familiarize yourself with the API endpoints, request methods, and response structures.
- **Action:** Read the `api_docs.md` file to get a comprehensive understanding of how the API works.

## 2. Verify API Response

- **Objective:** Ensure the API is responding as expected.
- **Action:** Use a `curl` command to send a `GET` request to the API and verify the JSON response.

### Example `curl` command:

```bash
curl "https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=1"
```

### Expected Response Structure:

```json
{
  "test": {
    "test_group": 1,
    "next_test_group": 2,
    "question": [
      {
        "question": "What is the capital of Rwanda?",
        "comment": "This is a comment about the question.",
        "test_answer": 0,
        "answers": ["Kigali", "Nairobi", "Kampala", "Dodoma"]
      },
      {
        "question": "What is the highest mountain in Rwanda?",
        "comment": "This is another comment.",
        "test_answer": 2,
        "answers": [
          "Mount Sabyinyo",
          "Mount Gahinga",
          "Mount Karisimbi",
          "Mount Muhabura"
        ]
      }
    ]
  }
}
```

## 3. Implement API Integration

- **Objective:** Integrate the API into the application.
- **Action:** Based on the API documentation and successful verification, proceed with implementing the API calls within the application's codebase.
