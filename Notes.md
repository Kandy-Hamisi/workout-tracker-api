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
