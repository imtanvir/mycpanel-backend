# Portfolio Admin Dashboard Backend

Welcome to the **Portfolio Admin Dashboard Backend**! This is the server-side application for managing portfolio-related data and functionalities. Built with modern technologies, this backend ensures scalability, security, and high performance.

---

Live: https://mycpanel-api.vercel.app

## 🚀 Features

- **User Authentication and Authorization**: Secure authentication using JWT with role-based access control.
- **CRUD Operations**: Efficient management of resources (projects, blogs, users, etc.) using RESTful APIs.
- **Database Integration**: Seamlessly connected to MongoDB via Mongoose for schema-based data handling.
- **Error Handling**: Centralized error-handling middleware for better debugging and user experience.
- **API Documentation**: Comprehensive API documentation for easy integration.
- **Security**: Implements best practices such as input validation, rate limiting, and CORS policies.
- **TypeScript Support**: Strongly typed backend for improved code quality and maintainability.

---

## 🛠️ Tech Stack

- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Programming Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **ODM**: [Mongoose](https://mongoosejs.com/)
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: [Joi](https://joi.dev/) or [Zod](https://zod.dev/)
- **Environment Management**: [dotenv](https://github.com/motdotla/dotenv)

---

## 📂 Folder Structure


---

## 🔑 Environment Variables

The project uses the following environment variables:

| Variable          | Description                        |
|-------------------|------------------------------------|
| `PORT`            | Port number for the server         |
| `MONGO_URI`       | MongoDB connection string          |
| `JWT_SECRET`      | Secret key for JWT authentication  |
| `NODE_ENV`        | Environment mode (`development`/`production`) |

### Create a `.env` file in the root directory and populate it with your values.

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio-admin-backend.git
   cd portfolio-admin-backend


## Install dependencies:


npm install
Set up environment variables:

Create a .env file in the root directory.
Add the required environment variables (see above).
Run the development server:


npm run dev
Build for production:


npm run build
Start the production server:


npm run start
🛡️ API Documentation
When the server runs, the API documentation is available at http://localhost:<PORT>/api-docs. Swagger/OpenAPI has been used for API documentation.

## 📋 Scripts
Script	Description
npm run dev	Start the server in development mode
npm run build	Build the TypeScript project for production
npm run start	Start the built application
npm run lint	Lint the code using ESLint
npm run test	Run tests (if testing is configured)




## 🙌 Acknowledgements
Express.js for the backend framework.
TypeScript for static typing.
MongoDB for database management.
JWT for secure authentication.
👤 Author
Md. Tanvir Parvej Badhon
Full Stack Developer | Portfolio
