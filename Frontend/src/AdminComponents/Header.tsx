import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Trash2,
  Download,
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
  searchable?: boolean;
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
  searchable = true,
  pageSize = 5,
  selectable = true,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());

  // debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
  }, [search]);

  // reset selection when data changes
  useEffect(() => {
    setSelected(new Set());
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

  const filtered = useMemo(() => {
    if (!debouncedSearch) return data;
    const q = debouncedSearch.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [data, debouncedSearch]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      const aV = a[sortKey];
      const bV = b[sortKey];

      if (aV == null) return 1;
      if (bV == null) return -1;

      if (aV < bV) return sortOrder === "asc" ? -1 : 1;
      if (aV > bV) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortOrder]);

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

  const handleSort = (key: keyof T) => {
    setSortOrder((p) => (sortKey === key && p === "asc" ? "desc" : "asc"));
    setSortKey(key);
  };

  const downloadCSV = () => {
    const headers = tableColumns.map((c) => c.header).join(",");
    const rows = sorted.map((row) =>
      tableColumns
        .map((c) => `"${String(row[c.key] ?? "").replace(/"/g, '""')}"`)
        .join(","),
    );

    const blob = new Blob([headers + "\n" + rows.join("\n")], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table.csv";
    a.click();
  };

  const allSelected =
    paginated.length > 0 &&
    paginated.every((r, i) => selected.has(rowKey(r, i)));

  return (
    <div className="space-y-3">
      {/* TOP BAR */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        {searchable && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border px-3 py-2 rounded text-sm"
          />
        )}

        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded text-sm"
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* BULK ACTION BAR */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded border">
          <span className="text-sm">{selected.size} selected</span>
          <button className="flex items-center gap-1 text-red-500">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full">
          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              {selectable && (
                <th className="px-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}

              {tableColumns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className="px-4 py-3 cursor-pointer"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td className="text-center py-8" colSpan={10}>
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td className="text-center py-8 text-gray-500" colSpan={10}>
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
                    className="hover:bg-gray-50 transition cursor-pointer"
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
      <div className="flex justify-between text-sm">
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
