import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

type Column<T> = {
  header: string;
  key: keyof T;
  align?: "left" | "center" | "right";
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
  hoverable?: boolean;
  hoverColor?: string;
  className?: string;
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
  hoverable = true,
  hoverColor = "hover:bg-blue-50",
  className = "",
  searchable = true,
  pageSize = 5,
  selectable = false,
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );

  // reset selection when data changes (small improvement)
  useEffect(() => {
    setSelectedRows(new Set());
  }, [data]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => setCurrentPage(1), [sortKey, sortOrder]);

  const tableColumns: Column<T>[] = useMemo(() => {
    if (columns) return columns;
    if (!data.length) return [];

    return Object.keys(data[0]).map((key) => ({
      header: key.toUpperCase(),
      key: key as keyof T,
      sortable: true,
    }));
  }, [columns, data]);

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;
    const q = debouncedSearch.toLowerCase();

    return data.filter((row) => {
      for (const k in row) {
        const val = row[k];
        if (val != null && String(val).toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [data, debouncedSearch]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = useCallback(
    (key: keyof T, sortable?: boolean) => {
      if (!sortable) return;

      setSortOrder((prev) =>
        sortKey === key && prev === "asc" ? "desc" : "asc",
      );
      setSortKey(key);
    },
    [sortKey],
  );

  const toggleRow = useCallback((id: string | number) => {
    setSelectedRows((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  }, []);

  const toggleAll = useCallback(() => {
    const ids = paginatedData.map((row, i) => rowKey(row, i));
    const allSelected = ids.every((id) => selectedRows.has(id));

    setSelectedRows((prev) => {
      const copy = new Set(prev);
      ids.forEach((id) => (allSelected ? copy.delete(id) : copy.add(id)));
      return copy;
    });
  }, [paginatedData, selectedRows, rowKey]);

  const isAllSelected = useMemo(() => {
    const ids = paginatedData.map((row, i) => rowKey(row, i));
    return ids.length > 0 && ids.every((id) => selectedRows.has(id));
  }, [paginatedData, selectedRows, rowKey]);

  const csvData = useMemo(() => {
    const headers = tableColumns.map((c) => c.header).join(",");

    const rows = sortedData.map((row) =>
      tableColumns
        .map((c) => {
          const val = row[c.key];
          const str = val == null ? "" : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(","),
    );

    return [headers, ...rows].join("\n");
  }, [tableColumns, sortedData]);

  const downloadCSV = useCallback(() => {
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
  }, [csvData]);

  const renderSortIcon = (colKey: keyof T) => {
    if (sortKey !== colKey) return <ArrowUpDown size={14} />;
    return sortOrder === "asc" ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex justify-between gap-2 flex-wrap">
        {searchable && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          />
        )}

        <div className="flex gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <button
            onClick={downloadCSV}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white border">
          <thead className="bg-blue-600 text-white">
            <tr>
              {selectable && (
                <th className="px-4">
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
                  onClick={() => handleSort(col.key, col.sortable)}
                  className="px-4 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={tableColumns.length} className="text-center py-6">
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={tableColumns.length} className="text-center py-6">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => {
                const id = rowKey(row, i);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={hoverable ? hoverColor + " cursor-pointer" : ""}
                  >
                    {selectable && (
                      <td className="px-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(id)}
                          onChange={() => toggleRow(id)}
                        />
                      </td>
                    )}

                    {tableColumns.map((col) => (
                      <td key={String(col.key)} className="px-4 py-2 border-t">
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] ?? "-")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm">
        <span>
          Page {currentPage} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border px-2 py-1 rounded"
          >
            Prev
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border px-2 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
