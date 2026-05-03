import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type Column<T> = {
  header: string;
  key: keyof T;
  sortable?: boolean;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
};

type TableProps<T extends Record<string, any>> = {
  data: T[];
  columns?: Column<T>[];
  rowKey?: (row: T, index: number) => string | number;
  loading?: boolean;
  pageSize?: number;
  selectable?: boolean;
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  rowKey = (_, i) => i,
  loading = false,
  pageSize = 5,
  selectable = true,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  // COLUMN WIDTH STATE (NEW)
  const [colWidths, setColWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!data.length) return;
    const initial: Record<string, number> = {};
    Object.keys(data[0]).forEach((k) => {
      initial[k] = 180;
    });
    setColWidths(initial);
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

  const toggleRow = useCallback((id: string | number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }, []);

  const toggleAll = () => {
    const ids = paginated.map((r, i) => rowKey(r, i));
    const all = ids.every((id) => selected.has(id));

    setSelected((prev) => {
      const copy = new Set(prev);
      ids.forEach((id) => (all ? copy.delete(id) : copy.add(id)));
      return copy;
    });
  };

  const handleSort = (key: keyof T) => {
    setSortOrder((p) => (sortKey === key && p === "asc" ? "desc" : "asc"));
    setSortKey(key);
  };

  const resizeColumn = (key: string, delta: number) => {
    setColWidths((prev) => ({
      ...prev,
      [key]: Math.max(80, (prev[key] || 150) + delta),
    }));
  };

  const isAllSelected =
    paginated.length > 0 &&
    paginated.every((r, i) => selected.has(rowKey(r, i)));

  return (
    <div className="space-y-3">
      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              {selectable && (
                <th className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}

              {tableColumns.map((col) => (
                <th
                  key={String(col.key)}
                  style={{ width: colWidths[String(col.key)] }}
                  className="relative px-4 py-3 text-left select-none"
                >
                  <div className="flex items-center justify-between">
                    <span
                      onClick={() => col.sortable && handleSort(col.key)}
                      className="cursor-pointer flex items-center gap-1"
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
                    </span>

                    {/* RESIZER */}
                    <div
                      onMouseDown={(e) => {
                        const startX = e.clientX;
                        const onMove = (ev: MouseEvent) => {
                          resizeColumn(String(col.key), ev.clientX - startX);
                        };
                        const onUp = () => {
                          window.removeEventListener("mousemove", onMove);
                          window.removeEventListener("mouseup", onUp);
                        };
                        window.addEventListener("mousemove", onMove);
                        window.addEventListener("mouseup", onUp);
                      }}
                      className="w-1 h-full cursor-col-resize absolute right-0 top-0"
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={10} className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td className="text-center py-6 text-gray-500" colSpan={10}>
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => {
                const id = rowKey(row, i);

                return (
                  <tr
                    key={id}
                    className="hover:bg-gray-50 even:bg-gray-50 transition"
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

                    {tableColumns.map((col) => (
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
