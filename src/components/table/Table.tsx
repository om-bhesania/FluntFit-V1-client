import React, { Fragment, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  Row,
  Table as ReactTable,
  PaginationState,
} from "@tanstack/react-table";
import classNames from "classnames";
import { Button, Skeleton, Spinner } from "@nextui-org/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronUpIcon,
} from "lucide-react";

interface ReactTableProps<T extends object> {
  data: T[];
  columns: ColumnDef<T>[];
  renderSubComponent?: (props: { row: Row<T> }) => React.ReactElement;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  className?: string;
  loading: boolean;
}

function Table<T extends object>({
  data,
  columns,
  renderSubComponent,
  pageIndex,
  pageSize,
  pageCount,
  onPaginationChange,
  className,
  loading,
}: ReactTableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: pageIndex ?? 0,
    pageSize: pageSize ?? 15,
  });
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]); // default sorting by "date" column in descending order

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (onPaginationChange) {
      onPaginationChange(pagination);
    }
  }, [pagination, onPaginationChange]);

  return (
    <div className="flex flex-col my-5">
      <div className="overflow-x-auto shadow-xl rounded-lg tablee">
        <div className="inline-block min-w-full py-1">
          <div className="overflow-hidden p-1 rounded-2xl">
            <table
              className={classNames("min-w-full whitespace-nowrap", className)}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b bg-gray-100">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="py-3.5 px-3 text-left text-gray-600 cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()} // toggle sorting on header click
                      >
                        {header.isPlaceholder ? null : (
                          <div className="flex items-center justify-center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUpIcon className="h-4 w-4 ml-1" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            )}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={columns.length / 2}
                      className="py-3.5 px-3 whitespace-nowrap text-end pr-[320px]"
                    >
                      <Spinner size="lg" className="h-12 w-12 text-end" />
                    </td>
                  </tr>
                ) : (
                  <>
                    {table.getRowModel().rows.map((row) => (
                      <Fragment key={row.id}>
                        <tr
                          className={classNames(
                            "hover:bg-gray-50 border-b-1 border-gray-500/20",
                            {
                              "bg-gray-200 ": row.getIsExpanded(),
                            }
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="py-3.5 px-3 whitespace-nowrap text-center"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>

                        {renderSubComponent ? (
                          <tr key={row.id + "-expanded"}>
                            <td colSpan={columns.length}>
                              {renderSubComponent({ row })}
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Pagination table={table} data={data} />
    </div>
  );
}

function Pagination<T>({
  table,
  data,
}: React.PropsWithChildren<{ table: ReactTable<T>; data: any }>) {
  return (
    <>
      {data.length > 10 && (
        <div className="flex items-center justify-between p-2 self-end mt-3">
          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronsLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm">
              <span>Page </span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <Button
              isIconOnly
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronsRight className="h-5 w-5" />
            </Button>
            <Button
              isIconOnly
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border-primary border-2"
              variant="ghost"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;
