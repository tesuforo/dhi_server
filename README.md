## Available Scripts

### `npm run dev`

Run the server in development mode.

### `npm test`

Run all unit-tests with hot-reloading.

### `npm test -- --testFile="name of test file" (i.e. --testFile=Users).`

Run a single unit-test.

### `npm run test:no-reloading`

Run all unit-tests without hot-reloading.

### `npm run lint`

Check for linting errors.

### `npm run build`

Build the project for production.

### `npm start`

Run the production build (Must be built first).

### `npm start -- --env="name of env file" (default is production).`

Run production build with a different env file.


# appointment-scheduling-backend

This is a project for appointment scheduling backend.

## Project Details

- Name: appointment-scheduling-backend
- Version: 0.0.0

### Scripts

The following scripts can be executed using "npm run":

- `build`: Compiles the code using `ts-node`
- `lint`: Runs eslint on the files inside the "src" folder
- `lint:tests`: Runs eslint on the files inside the "spec" folder
- `start`: Starts the server in development mode using nodemon
- `dev`: Starts the server using nodemon
- `test`: Starts the server for testing using nodemon and the nodemon configuration for testing
- `test:no-reloading`: Starts the server for testing without reloading using ts-node and tsconfig-paths

### Nodemon Configuration

The nodemon configuration is as follows:

- Watch: looks for changes inside the "src" folder
- Ignore: ignores the "public" folder inside "src"
- Execute: runs the "src/index.ts" using ts-node and tsconfig-paths

### Module Aliases

The project uses an alias for modules to simplify imports:

- Alias: "@src"
- Path: "dist"
