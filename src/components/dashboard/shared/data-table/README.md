# Data Table Components

Reusable data table building blocks for dashboard views. They bundle common UX patterns such as global search, column visibility toggles, pagination, and configurable cells.

## Quick start

```tsx
import { DataTable, type DataTableColumn } from "@/components/dashboard/shared/data-table";

type Row = { id: number; name: string; role: string };

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    label: "نام",
    sortable: true,
    searchValue: (row) => row.name,
  },
  {
    id: "role",
    label: "نقش",
    sortable: true,
    searchValue: (row) => row.role,
  },
];

<DataTable
  data={rows}
  columns={columns}
  rowKey={(row) => row.id}
  searchPlaceholder="جستجو در کاربران..."
/>;
```

### Column options

- `render(row, context)` – custom cell rendering with access to the global row index.
- `sortValue(row)` – override the value used for client-side sorting.
- `searchValue(row)` – customize the string(s) matched during global search.
- `toggleable` – set to `false` to keep a column permanently visible.
- `searchable` – set to `false` to exclude from global filtering.

### Extra props

- `toolbarActions` – inject custom controls (e.g., export button) next to the column selector.
- `initialSort` – start with a default column and direction ("asc" or "desc").
- `emptyState` – provide localized text or actions when the dataset is empty.
- `perPageOptions` & `defaultPerPage` – configure pagination controls.

These primitives are intentionally headless regarding data fetching: fetch rows in the page container, then render them with `DataTable` for a consistent management UI across admin pages.
