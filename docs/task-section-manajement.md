# Task Section Management API Spec

## Create Task Section

**Endpoint:** `POST /api/task-sections`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "project_id": 1,
  "name": "New Section"
}
```

**Response Body Success:**

```json
{
  "message": "Task section created successfully",
  "taskSection": {
    "id": 1,
    "project_id": 1,
    "name": "Section",
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  }
}
```

**Response Body Error:**

```json
{
  "error": "field Name is required"
}
```

## Get Task Sections By Projects Id

**Endpoint:** `GET /api/task-sections/:project_id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "Section 1",
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  },
  {
    "id": 2,
    "project_id": 1,
    "name": "Section 2",
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Forbidden: You do not own this project"
}
```

## Get Task Sections By Section Id

**Endpoint:** `GET /api/task-sections/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "id": 1,
  "project_id": 1,
  "name": "Section 1",
  "createdAt": "Current Time",
  "updatedAt": "Current Time"
}
```

**Response Body Error:**

```json
{
  "error": "Forbidden: You do not own this project"
}
```

## Update Task Section

**Endpoint:** `PUT /api/task-sections/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "name": "Updated Section"
}
```

**Response Body Success:**

```json
{
  "message": "Task section updated successfully",
  "taskSection": {
    "id": 1,
    "project_id": 1,
    "name": "Updated Section",
    "createdAt": "Current Time",
    "updatedAt": "Current Time"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Forbidden: You do not own this task section"
}
```

## Delete Task Section

**Endpoint:** `DELETE /api/task-sections/:id`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
{
  "message": "Task section deleted successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Forbidden: You do not own this task section"
}
```
