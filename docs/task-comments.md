# Task Comments API Spec

## Add Comment to Task

**Endpoint:** `POST /api/task-comments`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "task_id": 1,
  "comment": "This is a comment"
}
```

**Response Body Success:**

```json
{
  "message": "Comment added successfully",
  "taskComment": {
    "id": 1,
    "task_id": 1,
    "comment": "This is a comment",
    "user_id": 1,
    "created_at": "2023-06-04T12:00:00Z"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Invalid input data"
}
```

## Get Task Comments

**Endpoint:** `GET /api/task-comments`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "comment": "This is a comment",
    "user_id": 1,
    "created_at": "2023-06-04T12:00:00Z"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```

## Delete Task Commets

**Endpoint:** `DELETE /api/task-comments/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Task comment deleted successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Task comment not found"
}
```
