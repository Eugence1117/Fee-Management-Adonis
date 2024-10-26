# Project Setup

This project is a **prototype version** of a Fee and Payment Management System built with **AdonisJS**. It leverages **Adonis Lucid ORM** for database interactions, **JAPA** as the unit testing library. The setup instructions below will guide you through initializing the project, setting up migrations, seeding data, and running tests.

## Table of Contents

- [Project Startup](#project-startup)
- [Testing](#testing)
- [Extra Implementations](#extra-implementations)

---

## Project Startup

1. **Install Dependencies**

   ```
   npm install
   ```

2. **Configure Environment Variables**

   - Duplicate the `.env.example` file and rename it to `.env`.
   - Update the `.env` file with your database, and other required configuration settings.

3. **Run Migrations**

   ```
   node ace migration:run
   ```

4. **Seed Database**
   ```
   node ace db:seed
   ```

---

## Testing

To run tests, it is recommended to use a separate database schema.

```
npm run test
```

---

## Extra Implementations

- ⬜ **Setup the development environment using Docker**
- ✅ **Admin User Authentication**
- ⬜ **Cache with Redis**
- ⬜ **User Actions Log**
- ✅ **Unit Tests**

## Documentation

You can get more information about this project from [here](../../wiki).

## License

This project is licensed under the MIT License.
