import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

type Column<T> = {
  header: string;
  key: keyof T;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, any>> = {
  data: T[];
  columns?: Column<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => string | number;
  pageSize?: number;
  selectable?: boolean;
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = "No data available",
  rowKey = (_, i) => i,
  pageSize = 5,
  selectable = true,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  // NEW: column visibility
  const [visibleCols, setVisibleCols] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (data.length) {
      setVisibleCols(new Set(Object.keys(data[0])));
    }
  }, [data]);

  const tableColumns: Column<T>[] = useMemo(() => {
    if (columns) return columns;
    if (!data.length) return [];
    return Object.keys(data[0]).map((k) => ({
      header: k.toUpperCase(),
      key: k as keyof T,
      sortable: true,
    }));
  }, [columns, data]);

  const filteredColumns = useMemo(() => {
    return tableColumns.filter((c) => visibleCols.has(String(c.key)));
  }, [tableColumns, visibleCols]);

  const sorted = useMemo(() => {
    if (!sortKey) return data;

    return [...data].sort((a, b) => {
      const aV = a[sortKey];
      const bV = b[sortKey];

      if (aV == null) return 1;
      if (bV == null) return -1;

      if (aV < bV) return sortOrder === "asc" ? -1 : 1;
      if (aV > bV) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const toggleRow = (id: string | number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const toggleAll = () => {
    const ids = paginated.map((r, i) => rowKey(r, i));
    const all = ids.every((id) => selected.has(id));

    setSelected((prev) => {
      const copy = new Set(prev);
      ids.forEach((id) => (all ? copy.delete(id) : copy.add(id)));
      return copy;
    });
  };

  const toggleColumn = (key: string) => {
    setVisibleCols((prev) => {
      const copy = new Set(prev);
      copy.has(key) ? copy.delete(key) : copy.add(key);
      return copy;
    });
  };

  const isAllSelected =
    paginated.length > 0 &&
    paginated.every((r, i) => selected.has(rowKey(r, i)));

  const handleSort = (key: keyof T) => {
    setSortOrder((p) => (sortKey === key && p === "asc" ? "desc" : "asc"));
    setSortKey(key);
  };

  return (
    <div className="space-y-3">
      {/* COLUMN TOGGLE PANEL */}
      <div className="flex flex-wrap gap-2">
        {tableColumns.map((col) => (
          <button
            key={String(col.key)}
            onClick={() => toggleColumn(String(col.key))}
            className="flex items-center gap-1 border px-2 py-1 rounded text-xs"
          >
            {visibleCols.has(String(col.key)) ? (
              <Eye size={12} />
            ) : (
              <EyeOff size={12} />
            )}
            {col.header}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              {selectable && (
                <th className="px-3">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}

              {filteredColumns.length === 0 ? (
                <th className="px-4 py-3">No Columns Selected</th>
              ) : (
                filteredColumns.map((col) => (
                  <th
                    key={String(col.key)}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className="px-4 py-3 cursor-pointer"
                  >
                    {col.header}
                    {sortKey === col.key ? (
                      sortOrder === "asc" ? (
                        <ArrowUp size={12} />
                      ) : (
                        <ArrowDown size={12} />
                      )
                    ) : (
                      <ArrowUpDown size={12} />
                    )}
                  </th>
                ))
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center py-6">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-6 text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const id = rowKey(row, i);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={`hover:bg-gray-50 transition ${
                      selected.has(id) ? "bg-blue-50" : ""
                    }`}
                  >
                    {selectable && (
                      <td className="px-3">
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}

                    {filteredColumns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-2 border-t">
                        {col.render
                          ? col.render(row[col.key], row)
                          : String(row[col.key] ?? "-")}
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
      <div className="flex justify-between items-center text-sm">
        <span>
          Page {page} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="border px-3 py-1 rounded disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="border px-3 py-1 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
