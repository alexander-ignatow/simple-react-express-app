# Contributing Guidelines

Thank you for contributing to Simple React Express App! This document outlines the standards and best practices for both client and server development.

## Table of Contents

- [Client Guidelines](#client-guidelines)
- [Server Guidelines](#server-guidelines)
- [General Best Practices](#general-best-practices)

## Client Guidelines

### React Best Practices

- Use functional components with hooks exclusively
- Leverage React 19 features and capabilities
- Follow the [React Rules of Hooks](https://react.dev/reference/rules)
- Separate concerns: keep components, hooks, and utilities organized
- Use composition over prop drilling; consider Context API or state management for complex prop passing

### Import Statements

- **Avoid default imports** unless necessary (e.g., third-party libraries that only export defaults)
- **Avoid wildcard imports** (`import *`); use named imports for clarity and to enable tree-shaking
- Use named imports for consistency and explicitness
- Use explicit type imports when possible to improve clarity and enable better tree-shaking
  ```tsx
  // ✅ Preferred
  import { Button } from '@/components/ui/button';
  import { useCallback } from 'react';
  import type { ComponentProps } from 'react';
  
  // ❌ Avoid
  import Button from '@/components/ui/button';
  import * as React from 'react';
  import { ComponentProps as CP } from 'react';
  ```
- Avoid re-exporting from index files unless strictly necessary to maintain clarity about where components originate

### Function Declarations

- **Prefer arrow functions** over function declarations for consistency
  ```tsx
  // ✅ Preferred
  const MyComponent = () => {
    return <div>Hello</div>;
  };
  
  // ❌ Avoid
  function MyComponent() {
    return <div>Hello</div>;
  }
  ```
- Exception: Use function declarations only when necessary (e.g., recursive functions, hoisting requirements)

### Project Structure

- Organize components by feature or domain
- Keep related utilities in dedicated `lib/` or `utils/` directories
- Use clear, descriptive file and folder names
- Example structure:
  ```
  src/
  ├── components/
  │   ├── ui/              # Reusable UI components (Button, Textarea, etc.)
  │   ├── forms/           # Form-related components
  │   └── layout/          # Layout components
  ├── hooks/               # Custom React hooks
  ├── lib/                 # Utility functions and helpers
  ├── types/               # TypeScript type definitions
  └── App.tsx              # Root component
  ```

## Server Guidelines

### Project Structure

- Organize routes, middleware, and services logically
- Separate concerns: keep route handlers, business logic, and utilities distinct
- Use clear, descriptive directory and file names
- Example structure:
  ```
  src/
  ├── routes/              # Route definitions
  ├── middleware/          # Express middleware
  ├── services/            # Business logic
  ├── types/               # TypeScript type definitions
  ├── utils/               # Utility functions
  └── index.ts             # Application entry point
  ```

### Code Standards

- Maintain TypeScript strict mode for type safety
- Use meaningful variable and function names
- **Avoid wildcard imports** (`import *`); use named imports instead for better tree-shaking and clarity
- **Use explicit type imports** when possible to clearly distinguish types from runtime values
  ```typescript
  // ✅ Preferred
  import type { User, ApiResponse } from '@/types';
  import { getUserById } from '@/services';
  
  // ❌ Avoid
  import * as Types from '@/types';
  import { getUserById, User } from '@/services';
  ```
- Keep functions focused and single-responsibility
- Document complex business logic with comments
- Use environment variables for configuration

## General Best Practices

### TypeScript

- Enable and maintain strict mode in both client and server
- Use explicit type annotations for function parameters and return types
- Avoid `any` type; use `unknown` with proper type narrowing if needed
- Create shared types for data contracts between client and server

### Code Quality

- Run ESLint and Prettier before committing
- Keep commits focused and atomic
- Write clear commit messages
- Test your changes thoroughly before opening a PR

### Performance

- **Client**: Memoize expensive components and callbacks appropriately
- **Server**: Implement proper error handling and logging
- Both: Monitor bundle size and API response times

### Security

- Validate and sanitize user input on both client and server
- Use environment variables for sensitive information
- Keep dependencies up to date
- Follow OWASP guidelines for API design

