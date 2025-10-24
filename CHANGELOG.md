# @bluvenit/astro-adapter-azure

## 1.0.0

### Major Changes

- **BREAKING**: Updated to Azure Functions v4 programming model
- **BREAKING**: Requires Node.js 18.0.0 or higher
- Updated `@azure/functions` dependency to v4.0.0
- Migrated from function.json to code-centric approach
- Updated HTTP request/response handling to use Fetch API standard
- Improved error handling and logging
- Updated function registration to use `app.http()` method

### Migration Notes

If upgrading from a previous version:
1. Ensure your Node.js runtime is v18 or higher
2. Update your Azure Function App to use Functions Runtime v4.25+
3. No changes required to your Astro configuration

## 0.0.5

- Add astro-adapter-azure to runtime dependencies
- Fix errors

## 0.0.4

### Patch Changes

- Fix correct dist content

## 0.0.3

### Patch Changes

- 6eb358c: Fix serverEntrypoint
- 2a7acf9: Add genreation of helper api files

## 0.0.2

### Patch Changes

- Initial setup
