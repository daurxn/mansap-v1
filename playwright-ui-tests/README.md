# Playwright UI Tests

This project contains UI tests written with Playwright, a powerful framework for browser automation and end-to-end testing.

## Project Structure

- `tests/` - Directory containing test files
  - `example.spec.js` - Example test suite demonstrating various UI testing capabilities
- `playwright.config.js` - Playwright configuration file

## Test Scenarios

The example test suite demonstrates:

1. Basic navigation and title verification
2. Searching functionality
3. Navigation through documentation
4. Form filling and submission with verification

## Running Tests

To run the tests, use the following commands:

```bash
# Run all tests
npx playwright test

# Run tests in a specific browser
npx playwright test --project=chromium

# Run tests in UI mode
npx playwright test --ui

# Run a specific test file
npx playwright test tests/example.spec.js

# Run tests in debug mode
npx playwright test --debug
```

## Viewing Test Reports

After running the tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Test Examples](https://playwright.dev/docs/writing-tests)
