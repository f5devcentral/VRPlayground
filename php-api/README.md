# PHP API with Type Juggling

This is a PHP API project, built with the Slim framework. It includes a `/type-juggling` endpoint that accepts a POST request with a JSON body containing a "payload" which can be of any type and an "id" integer. The "payload" is used to check for type juggling with 13 cases, and the "id" is used to choose which case to test. If you choose 0, it will try all cases and return an object with all messages indicating which test case passed.

## Getting Started with Docker Compose

Build and run the application with Docker Compose
```bash
docker-compose up -d --build
```

## Making a POST Request

You can make a POST request to the /type-juggling endpoint with a JSON body containing a "payload" string and an "id" integer. Here's an example using curl:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"payload": "your_payload", "id": your_id}' http://localhost:your_port/type-juggling
```

Replace your_payload with the string you want to test, your_id with the integer representing the test case you want to run, and your_port with the port your application is running on. The default port is 8080.

