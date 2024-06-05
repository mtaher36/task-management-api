# Task Assignment API Spec

## Assign User to Task

**Endpoint:** `POST /api/task-assignments`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "task_id": 1,
  "user_id": 2
}
```

**Response Body Success:**

```json
{
  "message": "User assigned to task successfully",
  "taskAssignment": {
    "id": 1,
    "task_id": 1,
    "user_id": 2,
    "assigned_at": "2023-06-04T12:00:00Z"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Invalid input data"
}
```

## Get Task Assignments

**Endpoint:** `GET /api/task-assignments`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "task_id": 1,
    "user_id": 2,
    "assigned_at": "2023-06-04T12:00:00Z"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```
