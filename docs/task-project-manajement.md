# Task Project Management API Spec

## Create Task Project

**Endpoint:** `POST /api/task-projects`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "title": "New Project",
  "description": "Project description"
}
```

**Response Body Success:**

```json
{
  "message": "Task project created successfully",
  "taskProject": {
    "id": 1,
    "title": "New Project ",
    "description": "Project Description",
    "owner_id": 1,
    "createdAt": "Current Timestamp",
    "updatedAt": "Current Timestamp"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Title is required"
}
```

## Get Task Projects By Project ID

**Endpoint:** `GET /api/task-projects/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json

  {
    "id": 1,
    "title": "Title",
    "description": "Project",
    "owner_id": 1,
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  },
```

**Response Body Error:**

```json
{
  "error": "Project ID not found"
}
```

## Get Task Projects By User ID

**Endpoint:** `GET /api/task-projects`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Project",
    "owner_id": 1,
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  },
  {
    "id": 2,
    "title": "ProjectB",
    "description": "ProjectB",
    "owner_id": 1,
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  },
  {
    "id": 3,
    "title": "ProjectB",
    "description": "ProjectB",
    "owner_id": 1,
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Project ID not found"
}
```

## Update Task Project

**Endpoint:** `PUT /api/task-projects/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "title": "Updated Project",
  "description": "Updated description"
}
```

**Response Body Success:**

```json
{
  "message": "Task project updated successfully",
  "taskProject": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated Project",
    "owner_id": 1,
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Task project not found"
}
```

## Delete Task Project

**Endpoint:** `DELETE /api/task-projects/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Task project deleted successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Task project not found"
}
```
