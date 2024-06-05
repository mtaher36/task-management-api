# User Management API Spec

## Get User Profile

**Endpoint**: `GET /api/users/profile`

**Request Headers**: `Authorization: Bearer unique-token`

**Response Body Success:**:

```json
{
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "profile_image": null,
    "role_id": 0
  }
}
```

**Response Body Error:**:

```json
{
  "error": "Unauthorized"
}
```

## Update User Profile

**Endpoint**: `PUT /api/users/profile`

**Request Headers**: `Authorization: Bearer unique-token`

**Request Body**:

```json
{
  "username": "newuser123",
  "email": "newuser@example.com",
  "profile_image": "new_image_url"
}
```

**Response Body Success:**:

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "newuser123",
    "email": "newuser@example.com",
    "profile_image": "new_image_url",
    "role_id": 0
  }
}
```

**Response Body Error:**:

```json
{
  "error": "Username or Email already registered"
}
```

## Update User Password

**Endpoint:** `PUT /api/users/profile/password`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**Response Body Success:**

```json
{
  "message": "Password updated successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Current password is incorrect"
}
```
