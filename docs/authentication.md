# Authentication API Spec

## Register

**Endpoint**: `POST /api/auth/register`

**Request Body**:

```json
{
  "username": "test",
  "email": "test@example.com",
  "password": "test123",
  "confirmPassword": "123"
}
```

**Response Body Success:**:

```json
{
  "message": "User registered, please check your email for OTP"
}
```

**Response Body Error:**:

```json
{
  "error": "Username or Email already registered"
}
```

## Email Verify OTP

**Endpoint**: `GET /api/auth/verify-email/:token`

**Response Body Success:**:

```json
{
  "message": "Email verified successfully"
}
```

**Response Body Error:**:

```json
{
  "error": "Invalid or expired token"
}
```

## Login

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "test@test.com",
  "password": "password123"
}
```

**Response Body Success:**:

```json
{
  "token": "secret_token"
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

**Endpoint:** `POST /api/auth/request-password-reset`

**Request Body:**

```json
{
  "email": "test@test.com"
}
```

**Response Body Success:**

```json
{
  "message": "Password reset link sent to your email"
}
```

**Response Body Error:**

```json
{
  "error": "User with this email does not exist"
}
```

## Reset Password

**Endpoint:** `POST /api/auth/verify-otp-reset-password`

**Request Body:**

```json
{
  "email": "user@test.com",
  "otp": "recovery-otp"
}
```

**Response Body Success:**

```json
{
  "message": "New password sent to your email"
}
```

**Response Body Error:**

```json
{
  "error": "Invalid or expired token"
}
```
