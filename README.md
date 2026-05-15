# UI Components

Reusable React components packaged in Vite library mode for use across multiple projects.

## Stack

- React + TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Table
- Vite library build

## Exported component

`DataTable` is a generic table component with:

- typed TanStack column definitions
- optional search powered by React Hook Form
- built-in pagination
- packaged CSS output for npm consumers

## Install

```bash
npm install @zee-dev/ui-components react react-dom react-hook-form @tanstack/react-table
```

## Usage

```tsx
import { createColumnHelper } from '@tanstack/react-table'
import { DataTable } from '@zee-dev/ui-components'
import '@zee-dev/ui-components/styles.css'

type User = {
  id: string
  name: string
  role: string
}

const columnHelper = createColumnHelper<User>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
  }),
  columnHelper.accessor('role', {
    header: 'Role',
  }),
]

export function UsersTable({ users }: { users: User[] }) {
  return (
    <DataTable
      title="Team members"
      description="Shared component rendered from the npm package."
      data={users}
      columns={columns}
      search={{
        accessor: (user) => `${user.name} ${user.role}`,
        placeholder: 'Search users',
      }}
    />
  )
}
```

## Commands

```bash
npm run typecheck
npm run build
```

## Publishing

Update the package name in `package.json` before publishing if you want to use a scoped npm package name.
