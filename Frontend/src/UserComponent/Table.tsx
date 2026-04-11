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

  const [visibleCols, setVisibleCols] = useState(
    columns.map((col) => String(col.key)),
  );

  const [page, setPage] = useState(1);
  const pageSize = 5;

  /* FILTER */
  const filteredData = useMemo(() => {
    if (serverSide) return data;

    return data.filter((row) =>
      Object.entries(filters).every(([key, val]) =>
        String(row[key]).toLowerCase().includes(val.toLowerCase()),
      ),
    );
  }, [data, filters]);

  /* SORT */
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

  /* EXPORT CSV */
  const exportCSV = () => {
    const rows = [columns.map((c) => c.header)];

    paginatedData.forEach((row) => {
      rows.push(columns.map((c) => String(row[c.key])));
    });

    const csvContent = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
  };

  /* TOGGLE COLUMN */
  const toggleColumn = (key: string) => {
    setVisibleCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div className="space-y-3">
      {/* ACTION BAR */}
      <div className="flex justify-between flex-wrap gap-3">
        <button
          onClick={exportCSV}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Export CSV
        </button>

        <div className="flex gap-2 flex-wrap">
          {columns.map((col) => (
            <label key={String(col.key)} className="text-xs">
              <input
                type="checkbox"
                checked={visibleCols.includes(String(col.key))}
                onChange={() => toggleColumn(String(col.key))}
              />{" "}
              {col.header}
            </label>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-auto border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-900 text-white">
            <tr>
              {columns
                .filter((col) => visibleCols.includes(String(col.key)))
                .map((col) => (
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
              paginatedData.map((row) => (
                <tr key={rowKey(row)} className="border-t hover:bg-gray-100">
                  {columns
                    .filter((col) => visibleCols.includes(String(col.key)))
                    .map((col) => (
                      <td key={String(col.key)} className="px-3 py-2">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <span>
          Page {page} / {totalPages || 1}
        </span>

        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(1)}>
            {"<<"}
          </button>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            {"<"}
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            {">"}
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
