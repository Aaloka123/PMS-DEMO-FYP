import React, { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";

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
  rowKey?: (row: T, index: number) => string | number;

  searchable?: boolean;
  pageSizeOptions?: number[];
};

const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  rowKey,
  searchable = true,
  pageSizeOptions = [5, 10, 20],
}: TableProps<T>) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Columns
  const tableColumns = useMemo(() => {
    let cols =
      columns ||
      (data[0]
        ? Object.keys(data[0]).map((key) => ({
            header: key.toUpperCase(),
            key: key as keyof T,
            sortable: true,
          }))
        : []);

    if (visibleColumns.size === 0) return cols;

    return cols.filter((c) => visibleColumns.has(String(c.key)));
  }, [columns, data, visibleColumns]);

  // Filter
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;

    return data.filter((row) =>
      Object.values(row).some((v) =>
        String(v).toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    );
  }, [data, debouncedSearch]);

  // Sort
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

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // CSV Export
  const exportCSV = () => {
    const headers = tableColumns.map((c) => c.header).join(",");
    const rows = sortedData
      .map((row) => tableColumns.map((c) => `"${row[c.key] ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([headers + "\n" + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "table-data.csv";
    a.click();
  };

  const toggleRow = (index: number) => {
    const newSet = new Set(selectedRows);
    newSet.has(index) ? newSet.delete(index) : newSet.add(index);
    setSelectedRows(newSet);
  };

  const toggleAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, i) => i)));
    }
  };

  return (
    <div className="space-y-3">
      {/* TOP BAR */}
      <div className="flex flex-wrap gap-2 justify-between">
        {searchable && (
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-3 py-1 rounded"
          />
        )}

        <div className="flex gap-2">
          <button onClick={exportCSV} className="border px-3 py-1 rounded">
            Export CSV
          </button>

          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border px-2 py-1"
          >
            {pageSizeOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={
                    selectedRows.size === paginatedData.length &&
                    paginatedData.length > 0
                  }
                />
              </th>

              {tableColumns.map((col) => (
                <th
                  key={String(col.key)}
                  onClick={() =>
                    col.sortable &&
                    (setSortKey(col.key),
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc"))
                  }
                  className="px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={tableColumns.length + 1}>
                  <Loader2 className="animate-spin mx-auto my-4" />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(i)}
                      onChange={() => toggleRow(i)}
                    />
                  </td>

                  {tableColumns.map((col) => (
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
      <div className="flex justify-between items-center">
        <span>
          Page {currentPage} / {totalPages}
        </span>

        <div className="flex gap-1">
          <button onClick={() => setCurrentPage(1)}>{"<<"}</button>
          <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
            {"<"}
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            {">"}
          </button>

          <button onClick={() => setCurrentPage(totalPages)}>{">>"}</button>
        </div>
      </div>
    </div>
  );
};

export default Table;
