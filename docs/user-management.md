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
    "role_id": 0,
    "isActive": true,
    "createdAt": "2024-06-05T08:15:45.751Z",
    "updatedAt": "2024-06-06T06:31:19.000Z"
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

## Update Email

**Endpoint**: `PUT /api/users/profile`

**Request Headers**: `Authorization: Bearer unique-token`

**Request Body**:

```json
{
  "email": "newtest@test.com"
}
```

**Response Body Success:**:

```json
{
  "message": "OTP sent to your new email address for verification"
}
```

**Response Body Error:**:

```json
{
  "error": "Username or Email already registered"
}
```

## Verify OTP Email Update

**Endpoint**: `PUT /api/users/profile.verify-otp`

**Request Headers**: `Authorization: Bearer unique-token`

**Request Body**:

```json
{
  "otp": "your_otp"
}
```

**Response Body Success:**:

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "newtest@test.com",
    "profile_image": "new_image_url",
    "role_id": 0,
    "isActive": true,
    "createdAt": "2024-06-05T08:15:45.751Z",
    "updatedAt": "2024-06-06T06:31:19.000Z"
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
  "message": "'OTP sent to your email address for verification"
}
```

**Response Body Error:**

```json
{
  "error": "Current password is incorrect"
}
```

## Verify OTP Password Update

**Endpoint:** `PUT /api/users/profile/password/verify-otp`

**Request Headers:**

`Authorization: Bearer unique-token`

**Request Body:**

```json
{
  "otp": "your_otp"
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
  "error": "Invalid or expired OTP"
}
```
