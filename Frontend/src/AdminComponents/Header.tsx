import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

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

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

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

  // GLOBAL SEARCH
  const searched = useMemo(() => {
    if (!debouncedSearch) return data;
    const q = debouncedSearch.toLowerCase();

    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [data, debouncedSearch]);

  // COLUMN FILTERS
  const filtered = useMemo(() => {
    return searched.filter((row) => {
      return Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        return String(row[key]).toLowerCase().includes(value.toLowerCase());
      });
    });
  }, [searched, columnFilters]);

  // SORTING
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

  const isAllSelected =
    paginated.length > 0 &&
    paginated.every((r, i) => selected.has(rowKey(r, i)));

  return (
    <div className="space-y-3">
      {/* TOP BAR */}
      <div className="flex justify-between gap-2 flex-wrap">
        {searchable && (
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all columns..."
            className="border px-3 py-2 rounded text-sm"
          />
        )}
      </div>

      {/* BULK INFO */}
      {selected.size > 0 && (
        <div className="bg-blue-50 border p-2 rounded text-sm">
          {selected.size} row(s) selected
        </div>
      )}

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

              {tableColumns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className="px-4 py-3 cursor-pointer text-left"
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable &&
                      (sortKey === col.key ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUpDown size={14} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>

            {/* COLUMN FILTER ROW */}
            <tr className="bg-blue-500">
              {selectable && <th />}
              {tableColumns.map((col) => (
                <th key={String(col.key)} className="px-2 py-1">
                  <input
                    className="w-full px-2 py-1 text-xs text-black rounded"
                    placeholder="filter"
                    onChange={(e) =>
                      setColumnFilters((p) => ({
                        ...p,
                        [String(col.key)]: e.target.value,
                      }))
                    }
                  />
                </th>
              ))}
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
                    className="hover:bg-gray-50 transition"
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

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-2 py-1 border rounded ${
                page === i + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Table;
