# SkillBridge API Documentation

Complete reference for all API endpoints with request/response examples.

## Base URL

```
Development: http://localhost:3000
Production: https://your-domain.com
```

---

## Authentication Endpoints

### POST /api/auth/signup

Register a new user account.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | User's email (must be unique) |
| password | string | Yes | Password (min 6 characters) |
| confirmPassword | string | Yes | Must match password |

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Set-Cookie:**
```
authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses:**

```json
// 400: Validation error
{
  "error": "All fields are required"
}

// 400: Password mismatch
{
  "error": "Passwords do not match"
}

// 400: Password too short
{
  "error": "Password must be at least 6 characters"
}

// 409: Email already exists
{
  "error": "User already exists with this email"
}
```

---

### POST /api/auth/login

Authenticate user and get JWT token.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Set-Cookie:**
```
authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800
```

**Error Responses:**

```json
// 400: Missing fields
{
  "error": "Email and password are required"
}

// 401: Invalid credentials
{
  "error": "Invalid email or password"
}
```

---

### POST /api/auth/logout

Clear authentication session.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Cookie: authToken=..."
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Skills Endpoints

### GET /api/skills

Retrieve all available skills.

**Request:**
```bash
curl -X GET http://localhost:3000/api/skills
```

**Query Parameters:**
| Parameter | Type | Optional | Description |
|-----------|------|----------|-------------|
| None | - | - | Returns all skills |

**Response (200 OK):**
```json
{
  "skills": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "React.js Development",
      "description": "Learn modern React with hooks and Next.js integration...",
      "category": "Programming",
      "createdBy": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique skill ID |
| title | string | Skill name |
| description | string | Detailed skill description |
| category | string | Skill category |
| createdBy | object | Creator info (populated) |
| createdAt | DateTime | Creation timestamp |

---

### POST /api/skills

Create a new skill (requires authentication).

**Request:**
```bash
curl -X POST http://localhost:3000/api/skills \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=..." \
  -d '{
    "title": "Python Web Development",
    "description": "Master Django and Flask for building web applications...",
    "category": "Programming"
  }'
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Skill name (max 100 chars) |
| description | string | Yes | Detailed description |
| category | string | Yes | One of: Programming, Design, Languages, Business, Creative, Other |

**Response (201 Created):**
```json
{
  "message": "Skill created successfully",
  "skill": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Python Web Development",
    "description": "Master Django and Flask...",
    "category": "Programming",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T11:45:00Z"
  }
}
```

**Error Responses:**

```json
// 401: Not authenticated
{
  "error": "Unauthorized"
}

// 400: Missing fields
{
  "error": "All fields are required"
}
```

---

### GET /api/skills/[id]

Get specific skill details.

**Request:**
```bash
curl -X GET http://localhost:3000/api/skills/507f1f77bcf86cd799439013
```

**URL Parameters:**
| Parameter | Description |
|-----------|-------------|
| id | MongoDB ObjectId of the skill |

**Response (200 OK):**
```json
{
  "skill": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Python Web Development",
    "description": "Learn to build web applications using Python frameworks like Django and Flask. Master REST APIs, databases, and deployment.",
    "category": "Programming",
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T11:45:00Z"
  }
}
```

**Error Responses:**

```json
// 400: Invalid ID
{
  "error": "Invalid skill ID"
}

// 404: Not found
{
  "error": "Skill not found"
}
```

---

### DELETE /api/skills/[id]

Delete a skill (creator only, requires authentication).

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/skills/507f1f77bcf86cd799439013 \
  -H "Cookie: authToken=..."
```

**Response (200 OK):**
```json
{
  "message": "Skill deleted successfully"
}
```

**Error Responses:**

```json
// 401: Not authenticated
{
  "error": "Unauthorized"
}

// 403: Not the creator
{
  "error": "Forbidden"
}

// 404: Not found
{
  "error": "Skill not found"
}
```

---

## Requests Endpoints

### GET /api/requests

Get skill learning requests (requires authentication).

**Request:**
```bash
curl -X GET "http://localhost:3000/api/requests?type=all" \
  -H "Cookie: authToken=..."
```

**Query Parameters:**
| Parameter | Type | Optional | Values | Description |
|-----------|------|----------|--------|-------------|
| type | string | Yes | all, sent, received | Filter request type |

**Response (200 OK):**
```json
{
  "requests": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "skillId": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Python Web Development"
      },
      "studentId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe"
      },
      "teacherId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Jane Smith"
      },
      "status": "pending",
      "createdAt": "2024-01-15T12:00:00Z"
    }
  ]
}
```

**Status Values:**
| Status | Description |
|--------|-------------|
| pending | Awaiting teacher response |
| accepted | Teacher accepted the request |
| rejected | Teacher rejected the request |
| completed | Learning is complete |

---

### POST /api/requests

Send a skill learning request (requires authentication).

**Request:**
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=..." \
  -d '{
    "skillId": "507f1f77bcf86cd799439013"
  }'
```

**Request Body:**
| Field | Type | Required |
|-------|------|----------|
| skillId | string (ObjectId) | Yes |

**Response (201 Created):**
```json
{
  "message": "Request sent successfully",
  "request": {
    "_id": "507f1f77bcf86cd799439014",
    "skillId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Python Web Development"
    },
    "studentId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "teacherId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "status": "pending",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**Error Responses:**

```json
// 401: Not authenticated
{
  "error": "Unauthorized"
}

// 400: Invalid skill ID
{
  "error": "Invalid skill ID"
}

// 400: Skill not found
{
  "error": "Skill not found"
}

// 400: Cannot request own skill
{
  "error": "Cannot request your own skill"
}

// 400: Request already exists
{
  "error": "Request already exists"
}
```

---

### PUT /api/requests

Accept or reject a skill request (teacher only, requires authentication).

**Request:**
```bash
curl -X PUT http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Cookie: authToken=..." \
  -d '{
    "requestId": "507f1f77bcf86cd799439014",
    "status": "accepted"
  }'
```

**Request Body:**
| Field | Type | Required | Values |
|-------|------|----------|--------|
| requestId | string (ObjectId) | Yes | - |
| status | string | Yes | accepted, rejected |

**Response (200 OK):**
```json
{
  "message": "Request accepted successfully",
  "request": {
    "_id": "507f1f77bcf86cd799439014",
    "skillId": {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Python Web Development"
    },
    "studentId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "teacherId": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "status": "accepted",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**Error Responses:**

```json
// 401: Not authenticated
{
  "error": "Unauthorized"
}

// 400: Missing fields
{
  "error": "Request ID and status are required"
}

// 400: Invalid status
{
  "error": "Invalid status"
}

// 403: Not the teacher
{
  "error": "Forbidden"
}

// 404: Request not found
{
  "error": "Request not found"
}
```

---

## Error Handling

All error responses follow this standard format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST request |
| 400 | Bad Request | Invalid input, missing fields |
| 401 | Unauthorized | Not authenticated, invalid token |
| 403 | Forbidden | Authenticated but not authorized |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource (e.g., email exists) |
| 500 | Server Error | Internal server error |

---

## Authentication

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "iat": 1642345260,
  "exp": 1642950060
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

### Cookie Storage

Tokens are stored in HTTP-only cookies that:
- Cannot be accessed by JavaScript (prevents XSS)
- Are automatically sent with requests to same domain
- Are Secure (HTTPS only in production)
- Have SameSite=Strict (CSRF protection)
- Expire after 7 days

### Manual Token Usage

If needed, you can access the token from cookies:

```javascript
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('authToken='))
  ?.split('=')[1];
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding for production:

```typescript
// Using middleware like express-rate-limit
npm install express-rate-limit
```

---

## CORS

All endpoints accept requests from the same origin. For cross-origin requests, configure:

```typescript
// next.config.ts
module.exports = {
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
          }
        ]
      }
    ]
  }
}
```

---

## Testing Endpoints

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456","confirmPassword":"123456"}'

# Get all skills
curl -X GET http://localhost:3000/api/skills

# Create skill (you need authToken cookie)
curl -X POST http://localhost:3000/api/skills \
  -H "Content-Type: application/json" \
  -b "authToken=$TOKEN" \
  -d '{"title":"Test Skill","description":"Test","category":"Programming"}'
```

### Using Postman

1. Create new request
2. Set method to POST/GET/PUT/DELETE
3. Enter URL: `http://localhost:3000/api/...`
4. Add headers: `Content-Type: application/json`
5. (Optional) Add cookie: `authToken=...`
6. Add JSON body
7. Click Send

### Using JavaScript Fetch

```javascript
// Signup
const response = await fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    password: '123456',
    confirmPassword: '123456'
  })
});

// Create skill (authenticated)
const response = await fetch('/api/skills', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Send cookies
  body: JSON.stringify({
    title: 'React',
    description: 'Learn React',
    category: 'Programming'
  })
});
```

---

## Versioning

Current API Version: **v1** (stable)

Future endpoints may be prefixed with `/api/v2/` for breaking changes.

---

Last Updated: January 2024
