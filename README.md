# Express Acadamizer API

Final solo assignment Codaisseur academy.
RESTful Express API for Classes/students on top of MongoDB.

## Authentication

Create a User with the following attributes:

| Attribute | Type   | Description   |
|-----------|--------|---------------|
| name      | string | Full name     |
| email     | string | Email address |
| password  | string | Password      |

Use the following endpoints to deal with initial authentication and the user.

| HTTP Verb | Path        | Description |
|-----------|-------------|--------------|
| `POST`    | `/users`    | Create a user account |
| `POST`    | `/sessions` | Log in with email and password, and retrieve a JWT token |
| `GET`     | `/users/me` | Retrieve own user data |

To authorize further requests, use Bearer authentication with the provided JWT token:

```
Authorization: Bearer <token here>
```


## Classes

**Note:** See `models/class.js` for the Class schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/classes` | Retrieve all classes |
| `POST` | `/classes` | Create a class* |
| `GET` | `/classes/:id` | Retrieve a single class by it's `id` |
| `PUT` | `/classes/:id` | Update a class with a specific `id`* |
| `PATCH` | `/classes/:id` | Patch (partial update) a class with a specific `id`* |
| `DELETE` | `/classes/:id` | Destroy a single class by it's `id`* |
| `GET` | `/classes/:id/students` | Retrieve all Students for a specific class |
| `POST` | `/classes/:id/students` | Add a student to a class *|
| `PATCH` | `/classes/:id/students/:studentId`| Update a student in a class with a specific `id` *|
| `DELETE` | `/classes/:id/students` | Delete a student in a class with a specific `id` *|
| | | _* Needs authentication_ |

