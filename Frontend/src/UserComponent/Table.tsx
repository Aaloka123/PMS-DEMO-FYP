import React, { useState } from "react";
import { ArrowUpDown, Loader2 } from "lucide-react";

type Column<T> = {
  header: string;
  key: keyof T;
  align?: "left" | "center" | "right";
  sortable?: boolean; // Change 2
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
  hoverColor?: string; // Change 4
  className?: string; // Change 5
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
}: TableProps<T>) => {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const tableColumns =
    columns ??
    (data[0]
      ? Object.keys(data[0]).map((key) => ({
          header: key.toUpperCase(),
          key: key as keyof T,
        }))
      : []);

  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;

    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;

    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

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

  return (
    <div className={`overflow-x-auto rounded-xl shadow ${className}`}>
      <table className="min-w-full bg-white border border-gray-200">
        {caption && (
          <caption className="text-left px-4 py-2 text-sm text-gray-500">
            {caption}
          </caption>
        )}

        <thead className="bg-blue-600 text-white sticky top-0 z-10">
          <tr>
            {tableColumns.map((col) => (
              <th
                key={String(col.key)}
                onClick={() => handleSort(col.key, col.sortable)}
                className={`py-3 px-4 text-sm font-semibold tracking-wide cursor-pointer flex items-center gap-2 ${getAlignClass(
                  col.align,
                )}`}
              >
                {col.header}
                {col.sortable && <ArrowUpDown size={14} />}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={tableColumns.length}
                className="text-center py-6 text-blue-500 font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Loading data...
                </div>
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={tableColumns.length}
                className="text-center py-6 text-gray-400 italic"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={`
                  ${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${hoverable ? hoverColor : ""}
                  transition duration-200
                `}
              >
                {tableColumns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`py-3 px-4 border-t border-gray-200 text-sm text-gray-700 ${getAlignClass(
                      col.align,
                    )}`}
                  >
                    {row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
