# Task Subtasks API Spec

## Create Subtask

**Endpoint:** `POST /api/subtasks`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "task_id": 1,
  "title": "New Subtask",
  "description": "Subtask description",
  "due_date": "2023-12-31",
  "priority": "Medium"
}
```

**Response Body Success:**

```json
{
  "message": "Subtask created successfully",
  "subtask": {
    "id": 1,
    "task_id": 1,
    "title": "New Subtask",
    "description": "Subtask description",
    "due_date": "2023-12-31",
    "priority": "Medium",
    "status": "Pending"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Invalid input data"
}
```

## Get Subtasks

**Endpoint:** `GET /api/subtasks`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "title": "New Subtask",
    "description": "Subtask description",
    "due_date": "2023-12-31",
    "priority": "Medium",
    "status": "Pending"
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

**Endpoint:** `PUT /api/subtasks/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "title": "Updated Subtask",
  "description": "Updated description",
  "due_date": "2024-01-31",
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
    "due_date": "2024-01-31",
    "priority": "High",
    "status": "In Progress"
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

**Endpoint:** `DELETE /api/subtasks/:id`

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
