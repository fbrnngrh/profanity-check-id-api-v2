# API Specification: Profanity Checking (Indonesia)

## Overview

The Profanity Checking (Indonesia) API detects and filters profane words in Indonesian text. Helps create safer, family-friendly content.

### Version: 2.0.0
### Base URL: [https://api.profanity-check-id.com/v2](https://api.profanity-check-id.com/v2)

## Authentication

Use API key in `X-API-Key` header:

```
X-API-Key: your_api_key_here
```

## Endpoints

### Check Text for Profanity

Analyzes text for profane words.

- **URL**: `/check`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body

| Field | Type   | Required | Description                  |
|-------|--------|----------|------------------------------|
| text  | string | Yes      | Text to check for profanity  |

#### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`

| Field              | Type    | Description                               |
|--------------------|---------|-------------------------------------------|
| contains_profanity | boolean | Indicates if profanity found              |
| profanity_count    | integer | Number of profane words found             |
| profanities        | array   | List of profane words found               |
| censored_text      | string  | Original text with profanities censored   |
| message            | string  | Human-readable message about the result   |
| overall_severity   | number  | Severity score of the profanity detected  |

#### Example Request

```json
POST /check
{
  "text": "Dasar anjing, kamu brengsek!"
}
```

#### Example Response

```json
{
    "status": "success",
    "data": {
        "contains_profanity": true,
        "profanity_count": 1,
        "profanities": [
            {
                "word": "b4ngs4t"
            }
        ],
        "censored_text": "dia sangat baik hati ******* sekali",
        "message": "🤔 Hmm, mungkin bisa pilih kata yang lebih baik? Ditemukan 1 kata yang perlu diperhatikan. 🤔",
        "overall_severity": 1.000
    }
}
```

### Get Profanity List

Retrieves the list of profane words used by the API.

- **URL**: `/profanity-list`
- **Method**: `GET`

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|-------|-----------|-------------|
| page      |      | No        | Page number  |
| limit     |      | No        | Items per page |

#### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`

| Field            | Type     | Description                |
|------------------|----------|----------------------------|
| profanity_words  | array    | List of profane words      |
| pagination      | object   | Pagination metadata       |

#### Example Request

```
GET /profanity-list?page=1&limit=15
```

#### Example Response

```json
{
    "status": "success",
    "message": "Daftar kata-kata profanitas",
    "data": {
        "profanity_words": [
            {
                "id": 1,
                "word": "alay"
            }
        ],
        "pagination": {
            "total_items": 21,
            "total_pages": 2,
            "current_page": 1,
            "items_per_page": 15
        }
    }
}
```

## Error Responses

| Status Code | Description |
|-------------|-------------|
| 400         | Bad Request - Invalid input parameters |
| 401         | Unauthorized - Invalid or missing API key |
| 429         | Too Many Requests - Rate limit exceeded  |
| 500         | Internal Server Error - Something went wrong on the server |

#### Error Response Body

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Detailed error message"
  }
}
```

## Rate Limiting

Requests are limited to 100 per minute per API key. If you exceed this limit, you'll receive a 429 Too Many Requests response.

## Tech Stack

- backend with Bun and TypeScript with validation using Zod
- Cloudflare workers and Hono Typescript for the Framework
- Upstash vector database
[![API](https://app.eraser.io/workspace/oEFJl6nBSr0sil1yJoaL/preview?elements=9BcglzyzifWbKOv9A7XK1w&type=embed)](https://app.eraser.io/workspace/oEFJl6nBSr0sil1yJoaL?elements=9BcglzyzifWbKOv9A7XK1w)