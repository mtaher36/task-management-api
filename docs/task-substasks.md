# Task Subtasks API Spec

## Create Subtask

**Endpoint:** `POST /api/:taskId/subtasks`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "title": "New Subtask",
  "description": "Subtask description",
  "priority": "Medium"
}
```

**Response Body Success:**

```json
{
  {
  "message": "Subtask created successfully",
  "subtask": {
    "id": 1,
    "task_id": 1,
    "title": "Example Subtask",
    "description": "This is an example subtask.",
    "priority": "High",
    "status": "InProgress",
    "createdAt": "2024-06-10T13:28:23.856Z",
    "updatedAt": "2024-06-10T13:28:24.000Z"
  }
}
}
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```

## Get Subtasks

**Endpoint:** `GET /api/:taskId/subtasks`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "title": "Updated",
    "description": "This is an example subtask.",
    "priority": "High",
    "status": "InProgress",
    "createdAt": "2024-06-10T13:28:23.856Z",
    "updatedAt": "2024-06-10T14:34:00.000Z"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```

## Update Subtask

**Endpoint:** `PUT /api/:taskId/subtasks/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "title": "Updated Subtask",
  "description": "Updated description",
  "priority": "High",
  "status": "In Progress"
}
```

**Response Body Success:**

```json
{
  "message": "Subtask updated successfully",
  "subtask": {
    "id": 1,
    "task_id": 1,
    "title": "Updated Subtask",
    "description": "Updated description",
    "priority": "High",
    "status": "InProgress",
    "createdAt": "2024-06-10T13:28:23.856Z",
    "updatedAt": "2024-06-10T14:34:00.000Z"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Subtask not found"
}
```

## Delete Subtask

**Endpoint:** `DELETE /api/:taskId/subtasks/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Subtask deleted successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Subtask not found"
}
```

## Completed Task

**Endpoint** : `POST /api/tasks/:id/complete`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Subtask completed successfully",
  "subtask": {
    "id": 1,
    "task_id": 1,
    "title": "Example Subtask",
    "description": "This is an example subtask.",
    "priority": "High",
    "status": "Completed",
    "createdAt": "2024-06-10T09:24:27.287Z",
    "updatedAt": "2024-06-10T15:13:07.000Z"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```
