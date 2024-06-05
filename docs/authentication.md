# Authentication API Spec

## Register

**Endpoint**: `POST /api/auth/register`

**Request Body**:

```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Body Success:**:

```json
{
  "message": "User registered successfully",
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
  "error": "Username or Email already registered"
}
```

## Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Body Success:**:

```json
{
  "message": "Login successful",
  "token": "unique-token"
}
```

**Response Body Error:**:

```json
{
  "error": "Invalid email or password"
}
```

## Logout User

**Endpoint**: `POST /api/auth/logout`

**Request Headers**: `Authorization: Bearer unique-token`

**Response Body Success:**:

```json
{
  "message": "Logout successful"
}
```

**Response Body Error:**:

```json
{
  "error": "Unauthorized"
}
```

## Password Recovery Request

**Endpoint:** `POST /api/auth/recovery-request`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response Body Success:**

```json
{
  "message": "Password recovery email sent"
}
```

**Response Body Error:**

```json
{
  "error": "Email not found"
}
```

## Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**

```json
{
  "token": "recovery-token",
  "new_password": "newpassword123"
}
```

**Response Body Success:**

```json
{
  "message": "Password reset successfully"
}
```

**Response Body Error:**

```json
{
  "error": "Invalid or expired token"
}
```
