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
    "title": "New Project",
    "description": "Project description",
    "owner_id": 1
  }
}
```

**Response Body Error:**

```json
{
  "error": "Invalid input data"
}
```

## Get Task Projects

**Endpoint:** `GET /api/task-projects`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "title": "New Project",
    "description": "Project description",
    "owner_id": 1
  }
]
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
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
    "title": "Updated Project",
    "description": "Updated description",
    "owner_id": 1
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
