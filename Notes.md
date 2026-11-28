# My Notes

### Testing

In a normal express node application we use jest and supertest for our tests. There are a couple of dependencies that we need to be careful about too while using jest with typescript because of the difference in releases and support between each release.

To transform Typescript test files for jest we use `ts-jest`

#### Understanding the testing tools
These four packages have different responsibilities:


| Package                        | What it does                                            |
|--------------------------------|---------------------------------------------------------|
| Jest                           | Test Runner, assertions, mocks, coverage                |
| ts-jest                        | Running Typescript tests through Jest                   |
| ts-jest                        | Testing HTTP endpoints without manually starting a port |
| @types/jest / @types/supertest | Typescript definitions                                  |

### Testing Progressions
1. Unit Testing: Testing individual functions and services independently



## Database constraints vs Application validation
It is a vey important backend engineering concept.

1. Presentation Layer. We did this using `Zod`. The layer requests structure, data types, required input fields and basic input validation.
2. Business layer. This is where we have the `Services`. Here we will implement the exercise specific metrics, ownership, workout state transitions, unit conversion and competitive rules
3. Persistence layer. Here we have the database. We are using PostgreSQL. Foreign Keys, uniqueness, nullability, valid enum values and Check Constraints

For example, a user attempting to log a bench press set with a negative weight should be rejected by Zod. But even if someone bypasses the API and attempts a direct database insert, the PostgreSQL CHECK constraint still protects the data.
This is called `Defence in depth`