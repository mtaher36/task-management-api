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
    "name": "New Section"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Invalid input data"
}
```

## Get Task Sections

**Endpoint:** `GET /api/task-sections`

**Request Headers:**

`Authorization: Bearer unique-token`

**Response Body Success:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "New Section"
  }
]
```

**Response Body Error:**

```json
{
  "error": "Unauthorized"
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
    "name": "Updated Section"
  }
}
```

**Response Body Error:**

```json
{
  "error": "Task section not found"
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
  "error": "Task section not found"
}
```
