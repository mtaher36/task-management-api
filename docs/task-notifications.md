# Task Notifications API Spec

## Get Notifications

**Endpoint:** `GET /api/notifications`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "user_id": 1,
    "task_id": 1,
    "notification_type": "Email",
    "message": "Task due date is approaching",
    "is_read": false,
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

## Mark Notification as Read

**Endpoint:** `PATCH /api/notifications/:id/read`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Notification marked as read",
  "notification": {
    "id": 1,
    "user_id": 1,
    "task_id": 1,
    "notification_type": "Email",
    "message": "Task due date is approaching",
    "is_read": true,
    "created_at": "2023-06-04T12:00:00Z"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Notification not found"
}
```
