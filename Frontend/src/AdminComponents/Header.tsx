import React, { useState, useMemo, useEffect } from "react";
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
  caption?: string;
  emptyMessage?: string;
  rowKey?: (row: T, index: number) => string | number;
  hoverable?: boolean;
  hoverColor?: string;
  className?: string;

  searchable?: boolean;
  pageSize?: number;

  // NEW
  selectable?: boolean;
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  caption,
  emptyMessage = "No data available",
  rowKey,
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

  // NEW selection state
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset page on sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortKey, sortOrder]);

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

    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    );
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

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Selection handlers
  const toggleRow = (index: number) => {
    setSelectedRows((prev) => {
      const copy = new Set(prev);
      copy.has(index) ? copy.delete(index) : copy.add(index);
      return copy;
    });
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };

  const getAlignClass = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

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
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      )}

      <div className="overflow-x-auto rounded-xl shadow max-h-[400px]">
        <table className="min-w-full bg-white border border-gray-200">
          {caption && (
            <caption className="text-left px-4 py-2 text-sm text-gray-500">
              {caption}
            </caption>
          )}

          <thead className="bg-blue-600 text-white sticky top-0">
            <tr>
              {selectable && (
                <th className="px-4">
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={
                      selectedRows.size === paginatedData.length &&
                      paginatedData.length > 0
                    }
                  />
                </th>
              )}

              {tableColumns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`py-3 px-4 cursor-pointer ${getAlignClass(
                    col.align,
                  )}`}
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
                <td
                  colSpan={tableColumns.length + (selectable ? 1 : 0)}
                  className="text-center py-6"
                >
                  <Loader2 className="animate-spin mx-auto" />
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={tableColumns.length + (selectable ? 1 : 0)}
                  className="text-center py-6 text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`${hoverable ? hoverColor : ""} ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {selectable && (
                    <td className="px-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => toggleRow(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}

                  {tableColumns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`py-3 px-4 border-t ${getAlignClass(
                        col.align,
                      )}`}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm">
          <span>
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
