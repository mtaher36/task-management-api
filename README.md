# Task Management App API Documentation

Welcome to the Task Management App API documentation. This API allows you to manage tasks, projects, sections, and user accounts. Below is an overview of the available endpoints and their documentation.

## Table of Contents

1. [Authentication](./docs/authentication.md)
2. [User Management](./docs/user-management.md)
3. [Task Management](./docs/task-management.md)
4. [Task Project Management](./docs/task-project-management.md)
5. [Task Section Management](./docs/task-section-management.md)
6. [Task Sub Tasks](./docs/task-subtasks.md)
7. [Task Assigment](./docs/task-assigment.md)
8. [Task Comments](./docs/task-comments.md)
9. [Task Notification](./docs/task-notification.md)

## Getting Started

To get started with this API, follow the setup instructions below.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mtaher36/task-management-api.git
   cd task-management-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your environment variables:

   ```env
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   ```

4. Run migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Start the server:
   ```bash
   npm start
   ```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

For detailed API documentation, refer to the individual markdown files in the docs directory.

Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

License
This project is licensed under the MIT License.
