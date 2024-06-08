# Task Management API Spec

## Create Task

**Endpoint**: `POST /api/tasks`

**Request Headers**: `Authorization: Bearer unique-token`

**Request Body**:

```json
{
  "project_id": 1,
  "section_id": 1,
  "title": "New Task",
  "description": "Task description",
  "due_date": "2023-12-31",
  "priority": "High",
  "is_recurring": true,
  "recurrence_interval": "Daily"
}
```

**Response Body Success:**:

```json
{
  "message": "Task created successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "section_id": 1,
    "title": "New Task",
    "description": "Task description",
    "due_date": "2023-12-31",
    "priority": "High",
    "status": "Pending",
    "is_recurring": true,
    "recurrence_interval": "Daily",
    "createdAt": "Current Time",
    "updatedAt": "Curren Time"
  }
}
```

**Response Body Error:**:

```json
{
  "error": "\"fields\" is required"
}
```

## Get Tasks

**Endpoint**: `GET /api/tasks`

**Request Headers**: `Authorization: Bearer unique-token`

**Response Body Success:**:

```json
[
  {
    "id": 1,
    "project_id": 1,
    "section_id": 1,
    "title": "New Task",
    "description": "Task description",
    "due_date": "2023-12-31",
    "priority": "High",
    "status": "Pending",
    "is_recurring": true,
    "recurrence_interval": "Daily",
    "createdAt": "Current Time",
    "updatedAt": "Curren Time"
  }
]
```

**Response Body Error:**:

```json
{
  "error": "Unauthorized"
}
```

## Update Task

**Endpoint**: `POST /api/tasks/:id`

**Request Headers**: `Authorization: Bearer unique-token`

**Request Body**:

```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "due_date": "2024-01-31",
  "priority": "Medium",
  "status": "In Progress",
  "is_recurring": false,
  "recurrence_interval": null
}
```

**Response Body Success:**:

```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "project_id": 1,
    "section_id": 1,
    "title": "Updated Task",
    "description": "Updated description",
    "due_date": "2024-01-31",
    "priority": "Medium",
    "status": "In Progress",
    "is_recurring": false,
    "recurrence_interval": null,
    "createdAt": "Current Time",
    "updatedAt": "Curren Time"
  }
}
```

**Response Body Error:**:

```json
{
  "error": "Unauthorized"
}
```

## Delete Task

**Endpoint** : `DELETE /api/tasks/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Task deleted successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
}
```
