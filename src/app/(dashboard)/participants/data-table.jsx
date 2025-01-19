"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/TablePagination";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/SearchFilter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function DataTable({ columns, data }) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnToFilter, setColumnToFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <>
      <div className="flex flex-row flex-wrap gap-2 justify-between items-center">
        <h1 className="font-bold text-xl">Participants</h1>
        <div className="flex flex-row flex-wrap gap-4 justify-between max-lg:w-full">
          <div className="flex flex-1 basis-2/3 gap-2">
            <Input
              className="min-w-[100px]"
              type="text"
              placeholder="Rechercher"
              value={
                columnToFilter &&
                (table.getColumn(columnToFilter)?.getFilterValue() ?? "")
              }
              onChange={(event) => {
                if (columnToFilter)
                  table
                    .getColumn(columnToFilter)
                    ?.setFilterValue(event.target.value);
              }}
            />
            <Combobox
              columnToFilter={columnToFilter}
              setColumnToFilter={setColumnToFilter}
            />
          </div>
          <Button className="basis-1/3 flex-1" type="button">
            Exporter
          </Button>
        </div>
      </div>
      <Separator className="my-2" />
      <div>
        <div className="rounded-md">
          <Table className="border-separate border-spacing-x-0 border-spacing-y-2">
            <TableHeader className="text-nowrap">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="font-semibold text-foreground"
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-0 py-2 my-2 bg-background"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        className="first:rounded-l-md last:rounded-r-md"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    Aucun résultat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          {table.getRowModel().rows?.length > 0 && (
            <TablePagination table={table} />
          )}
        </div>
      </div>
    </>
  );
}
