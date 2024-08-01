# API Specification: Profanity Checking (Indonesia)

## Overview

The Profanity Checking (Indonesia) API provides a service to detect and filter profane words in Indonesian text. This API is designed to help developers create safer and more family-friendly content by identifying and optionally censoring inappropriate language.

### Version: 2.0.0

### Base URL: [https://api.profanity-check-id.com/v2](https://api.profanity-check-id.com/v2)

## Authentication

All API requests require the use of an API key. To authenticate, include the API key in the `X-API-Key` header:

```
X-API-Key: your_api_key_here
```

## Endpoints

### Check Text for Profanity

Analyzes the provided text for profane words and returns the results.

- **URL**: `/check`
- **Method**: `POST`
- **Content-Type**: `application/json`

### Request Body

| Field | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| text | string | Yes | The text to be checked for profanity |

### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`
| Field | Type | Description |
| ----- | ----- | ----- |
| contains_profanity | boolean | Indicates if profanity was found |
| profanity_count | integer | Number of profane words found |
| profanities | array | List of profane words found |
| censored_text | string | Original text with profanities censored |
| message | string |  |
| overal severity | number |  |

### Example Request

```json
POST /check
{
  "text": "Dasar anjing, kamu brengsek!",
}
```

### Example Response

```json
{
    "status": "success",
    "data": {
        "contains_profanity": true,
        "profanity_count": 1,
        "profanities": [
            {
                "word": "b4ngs4t",
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

### Query Parameters

| Parameter | Type | Required | Description |
| ----- | ----- | ----- | ----- |
| page |  | No |  |
| limit |  | No |  |

### Response

- **Status Code**: 200 OK
- **Content-Type**: `application/json`
| Field | Type | Description |
| ----- | ----- | ----- |
| words | array | List of profane words |

### Example Request

```
GET /profanity-list?page=1&limit=15
```

### Example Response

```json
{
    "status": "success",
    "message": "Daftar kata-kata profanitas",
    "data": {
        "profanity_words": [
            {
                "id": 1,
                "word": "alay",
            },
        ],
        "pagination": {
            "total_items": 21,
            "total_pages": 2,
            "current_page": 1,
            "items_per_page": 15
        },
    }
}
```

## Error Responses

| Status Code | Description |
| ----- | ----- |
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Something went wrong on the server |

### Error Response Body

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
