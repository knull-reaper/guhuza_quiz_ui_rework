# How to Fetch Quiz Questions from the API

This document explains how to fetch quiz questions from the API for the Guhuza Quiz App. This information is intended to be used by other developers or AI agents who need to interact with the quiz API.

## API Endpoint

The API endpoint for fetching quiz questions is:

`https://api-ghz-v2.azurewebsites.net/api/v2/quiz`

## Method

The request method is `GET`.

## Parameters

The API accepts one query parameter:

- `level`: (required) The level of the quiz to fetch. This should be an integer representing the quiz level.

## Example Request

Here is an example of how to fetch a quiz for level 1:

```
GET https://api-ghz-v2.azurewebsites.net/api/v2/quiz?level=1
```

## Example Response

The API returns a JSON object with the following structure:

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
