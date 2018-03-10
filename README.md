# Express Acadamizer API

RESTful Express API for Classe/students on top of MongoDB.

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

**Note:** See `models/class.js` for the Game schema attributes.

| HTTP Verb | Path | Description |
|-----------|------|--------------|
| `GET` | `/classes` | Retrieve all games |
| `POST` | `/classes` | Create a game* |
| `GET` | `/classes/:id` | Retrieve a single game by it's `id` |
| `PUT` | `/classes/:id` | Update a game with a specific `id`* |
| `PATCH` | `/classes/:id` | Patch (partial update) a game with a specific `id`* |
| `DELETE` | `/classes/:id` | Destroy a single game by it's `id`* |
| | | _* Needs authentication_ |

