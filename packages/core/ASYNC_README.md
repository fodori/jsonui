# JsonUI Async Functions Support

This document explains how to use asynchronous functions within the JsonUI framework, enabling support for HTTP requests, async validation, file uploads, and other asynchronous operations.

## Overview

JsonUI now supports both synchronous and asynchronous functions. The system automatically detects whether a function is async and handles it appropriately, maintaining backward compatibility with existing synchronous functions.

## Key Features

- **Backward Compatibility**: All existing synchronous functions continue to work unchanged
- **Automatic Detection**: The system automatically identifies async functions
- **Error Handling**: Comprehensive error handling for async operations
- **Loading States**: Built-in loading state management for async operations
- **React Hooks**: Utility hooks for managing async state in components

## Usage

### 1. Creating Async Functions

Mark your functions as async and set the `isAsync` property:

```javascript
const fetchUserData = async (attr, props, callerArgs, stock) => {
  const { userId } = attr
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch user data')
  }
  return response.json()
}

// Mark the function as async
fetchUserData.isAsync = true
```

### 2. Using Async Functions in JsonUI Definitions

#### As Modifiers (for data fetching):

```json
{
  "$comp": "Text",
  "$children": {
    "$modifier": "fetchUserData",
    "userId": 123
  }
}
```

#### As Actions (for user interactions):

```json
{
  "$comp": "Button",
  "$children": "Load User Data",
  "onClick": {
    "$action": "fetchUserData",
    "userId": 123
  }
}
```

### 3. Built-in Async Functions

The framework provides several built-in async functions:

#### HTTP GET Request

```json
{
  "$action": "httpGet",
  "url": "https://api.example.com/data",
  "headers": {
    "Authorization": "Bearer token"
  },
  "timeout": 5000
}
```

#### HTTP POST Request

```json
{
  "$action": "httpPost",
  "url": "https://api.example.com/submit",
  "data": {
    "name": "John",
    "email": "john@example.com"
  },
  "headers": {
    "Content-Type": "application/json"
  }
}
```

#### Async Validation

```json
{
  "$modifier": "asyncValidate",
  "value": {
    "$modifier": "get",
    "store": "form",
    "path": "/email"
  },
  "validationUrl": "/api/validate/email",
  "field": "email"
}
```

#### Delay

```json
{
  "$action": "delay",
  "ms": 2000
}
```

### 4. Using the Async Wrapper

For components that need async modifier support, use `WrapperAsync`:

```javascript
import { WrapperAsync } from '@jsonui/react'

// The async wrapper automatically handles loading states
// and processes async modifiers before rendering
```

### 5. React Hooks for Async Operations

#### useAsyncAction Hook

```javascript
import { useAsyncAction } from '@jsonui/react'

function MyComponent({ stock }) {
  const { isLoading, error, data, execute } = useAsyncAction(
    stock,
    'fetchUserData',
    { userId: 123 },
    {
      onSuccess: (data) => console.log('Data loaded:', data),
      onError: (error) => console.error('Error:', error),
    }
  )

  return (
    <div>
      <button onClick={() => execute()} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      {error && <div>Error: {error.message}</div>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

#### useAsyncModifier Hook

```javascript
import { useAsyncModifier } from '@jsonui/react'

function UserProfile({ stock, userId }) {
  const { isLoading, error, data } = useAsyncModifier(
    stock,
    'fetchUserData',
    { userId },
    [userId] // dependencies
  )

  if (isLoading) return <div>Loading user...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>User: {data?.name}</div>
}
```

## API Reference

### Stock Class Additions

#### `callFunctionAsync(name, attr, props, callerArgs): Promise<any>`

Calls a function asynchronously, handling both sync and async functions.

#### `isAsyncFunction(name): boolean`

Checks if a registered function is marked as async.

### Async Wrapper Utilities

#### `getRootWrapperPropsAsync(props, stock): Promise<void>`

Async version of `getRootWrapperProps` that processes async modifiers.

#### `hasAsyncModifiers(props, stock): boolean`

Checks if props contain any async modifier functions.

#### `calculatePropsFromModifierAsync(props, stock): Promise<ReduxPath[]>`

Async version that processes modifiers sequentially to avoid race conditions.

## Error Handling

Async functions should throw errors for proper error handling:

```javascript
const validateData = async (attr) => {
  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify(attr.data),
    })

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // The framework will catch this and handle it appropriately
    throw new Error(`Validation error: ${error.message}`)
  }
}
```

## Loading States

The async wrapper automatically provides loading states:

- **Loading**: Shown while async modifiers are executing
- **Error**: Displayed when async operations fail
- **Success**: Normal component rendering when async operations complete

## Best Practices

1. **Mark Async Functions**: Always set `isAsync = true` on async functions
2. **Error Handling**: Use proper try-catch blocks in async functions
3. **Timeouts**: Set reasonable timeouts for HTTP requests
4. **Loading States**: Consider UX during async operations
5. **Dependencies**: Use dependency arrays in hooks to control re-execution
6. **Cancellation**: Handle component unmounting in long-running operations

## Examples

See `/packages/react/src/examples/AsyncExample.tsx` for a complete working example demonstrating:

- Async data fetching
- Form validation with async APIs
- File upload handling
- HTTP requests (GET/POST)
- Error handling and loading states

## Migration from Sync to Async

To migrate existing functions to async:

1. Add `async` keyword to function declaration
2. Set `functionName.isAsync = true`
3. Use `await` for asynchronous operations
4. Handle errors with try-catch
5. Test with both sync and async execution paths

The framework maintains full backward compatibility, so existing sync functions continue to work without modification.
