import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";

type Column<T> = {
  header: string;
  key: keyof T;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, any>> = {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;

  loading?: boolean;

  // SERVER SIDE SUPPORT
  serverSide?: boolean;
  totalCount?: number;
  onFetchData?: (params: any) => void;
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  loading = false,
  serverSide = false,
  totalCount = 0,
  onFetchData,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Persist settings
  useEffect(() => {
    localStorage.setItem(
      "table-settings",
      JSON.stringify({ filters, sortKey, sortOrder }),
    );
  }, [filters, sortKey, sortOrder]);

  // SERVER FETCH
  useEffect(() => {
    if (serverSide && onFetchData) {
      onFetchData({ page, sortKey, sortOrder, filters });
    }
  }, [page, sortKey, sortOrder, filters]);

  // FILTER
  const filteredData = useMemo(() => {
    if (serverSide) return data;

    return data.filter((row) =>
      Object.entries(filters).every(([key, val]) =>
        String(row[key]).toLowerCase().includes(val.toLowerCase()),
      ),
    );
  }, [data, filters]);

  // SORT
  const sortedData = useMemo(() => {
    if (serverSide || !sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = serverSide
    ? Math.ceil(totalCount / pageSize)
    : Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    if (serverSide) return data;

    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const toggleSelect = (id: string | number) => {
    const newSet = new Set(selected);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setSelected(newSet);
  };

  return (
    <div className="space-y-3">
      {/* TABLE */}
      <div className="overflow-auto max-h-[500px] border rounded">
        <table className="min-w-full">
          <thead className="sticky top-0 bg-gray-900 text-white">
            <tr>
              <th></th>

              {columns.map((col) => (
                <th key={String(col.key)} className="px-3 py-2">
                  <div
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => {
                      if (!col.sortable) return;
                      setSortKey(col.key);
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    {col.header}
                    {col.sortable && <ArrowUpDown size={12} />}
                  </div>

                  {col.filterable && (
                    <input
                      placeholder="Filter..."
                      value={filters[String(col.key)] || ""}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          [String(col.key)]: e.target.value,
                        })
                      }
                      className="mt-1 w-full text-black text-xs px-1"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length}>
                  <Loader2 className="animate-spin mx-auto my-4" />
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const id = rowKey(row);

                return (
                  <tr key={id} className="border-t hover:bg-gray-100">
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleSelect(id)}
                      />
                    </td>

                    {columns.map((col) => (
                      <td key={String(col.key)} className="px-3 py-2">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <span>
          Page {page} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button onClick={() => setPage(1)}>{"<<"}</button>
          <button onClick={() => setPage((p) => Math.max(1, p - 1))}>
            {"<"}
          </button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            {">"}
          </button>
          <button onClick={() => setPage(totalPages)}>{">>"}</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
