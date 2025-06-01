# Restaurant Reservation API

## Objective
Design and implement a backend API for a restaurant reservation system that manages tables and seating availability.

## API Design and Features

### Reservations
Build endpoints to create, update, cancel, and retrieve reservations.
- Each reservation should include fields like:
    - Date
    - Time
    - Customer details
    - Party size
- Assume each reservation has a duration of **45 minutes**.
- Maintain a list of tables, each with a maximum seating capacity (e.g., a table for 2, 4, 6, etc.).
    - This can be just a static list, no need to make it editable.
- Check table availability based on **party size and reservation time**, ensuring that reservations are allocated to specific tables.

### Availability Checker
Implement an endpoint to get all the slots available for a given day and party size.
- Should return a list of all the slots of **15 minutes available in the entire day**.

### Waitlist
If no tables are available, add the customer to a **waitlist**.
- Automatically promote waitlisted reservations if a slot becomes available.

### Send a Notification
Send a **notification 1 hour before** the reservation to the customer.
- Could be just a log in the console, no need to use a real SMS or push notification.

## Things We Value
- Tests
- Performance
- Code design

---

## Implementation

This project was implemented using these technologies:
- typescript
- node
- vitest
- mysql
- kysely
- kysely-codegen (for database code generation)
- kysely-migrate (for database migrations)
- fastify (to create the API routes)
- luxon (for date and time manipulation)
- docker compose (for integration tests)
- tsyringe (dependency injection, inversion of control)
- node-cron (for cron jobs)
- yarn (for package management)

### Build

To do a complete build of the project, you need to follow these steps:
```bash
docker compose up       # to start the MySQL database
yarn install            # to install the dependencies
yarn migrate            # to run the database migrations
yarn generate-types     # to generate the database types
yarn build              # to build the project
```

### Upgrade dependencies

To upgrade the dependencies of the project, you can use the following command:
```bash
yarn upgrade --latest
```

### Test

In this project the tests are separated into two categories: unit tests and integration tests.  
Unit tests are located in the `tests/unit` and integration tests are located in the `tests/integration`.

Tests are written using `vitest` and can be run in watch mode or in a single run.  
By default, the tests will run in watch mode, and you can run them in a single run by using the `:run` at the end of the command.

Here are all possible commands to run the tests:
```bash
# To run all tne tests
yarn test
yarn test:run

# To run the unit tests
yarn test:unit
yarn test:unit:run

# To run the integration tests
yarn test:integration
yarn test:integration:run
```

### Run

To run the project, execute the following command:
```bash
docker compose up -d
yarn dev
```

The *docker compose* command will start a MySQL database.  
You can verify that the project is running by accessing the following URL: http://localhost:3000/health

## Decisions and possible improvements

- In the specification, it was not clear how the tables should be allocated to the reservations. I decided to implement a simple algorithm that allocates the reservation to the table with the smallest capacity that fits the party size.
- The opening hours of the restaurant are not defined in the specification. I decided to consider that the restaurant is open from 8:00 to 14:00 (to avoid too much results in the availability checker), but this should be changed to a more realistic scenario.
- And related to the previous point, the opening hours should be considered when creating and updating a reservation, to avoid creating reservations outside the opening hours.
- When a reservation that is in the waitlist is promoted, some notification should be sent to the customer. This feature was not implemented and not defined in the specification.
- When getting the availability of slots, is not specified if the slots should take care of the reservations that are in the wait list. I decided to consider only the reservations that are assigned to a table.
- In multiple places, I'm getting all the items from a list and filtering them. This could be improved by using a database query getting only the necessary data.
- Error handling should be put in place to handle exceptions and return a proper response to the user.