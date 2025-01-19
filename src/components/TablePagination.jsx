"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

const TablePagination = ({ table }) => {
  const maxButtons = 6;

  const buttons = generatePagination(
    table.getState().pagination.pageIndex + 1,
    table.getPageCount(),
    maxButtons
  );

  console.log("Start");
  console.log("Éléments totaux", table.getFilteredRowModel().rows.length);
  console.log("Éléments par page", table.getState().pagination.pageSize);
  console.log("Page actuelle (0-based)", table.getState().pagination.pageIndex);
  console.log("Nombre de pages", table.getPageCount());
  console.log("End");

  return (
    <div className="flex flex-row gap-1 items-center">
      {buttons.map((button, index) => (
        <React.Fragment key={index}>
          {button === "Précédent" || button === "Suivant" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (button === "Précédent") {
                  table.previousPage();
                } else {
                  table.nextPage();
                }
              }}
            >
              <span className="sr-only">{button}</span>
              {button === "Précédent" ? (
                <ChevronLeft />
              ) : (
                <ChevronLeft className="rotate-180" />
              )}
            </Button>
          ) : button === "..." ? (
            <span className="px-2">...</span>
          ) : (
            <ToggleGroup
              value={(table.getState().pagination.pageIndex + 1).toString()}
              onValueChange={(value) => table.setPageIndex(Number(value) - 1)}
              type="single"
            >
              <ToggleGroupItem
                key={button}
                value={button.toString()}
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {button}
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default TablePagination;

const generatePagination = (currentPage, pageTotal, maxButtons) => {
  let buttons = [];
  const midRange = Math.floor((maxButtons - 2) / 2);
  const firstButton = Math.max(2, currentPage - midRange);
  const lastButton = Math.min(pageTotal - 1, currentPage + midRange);

  if (currentPage > 1) {
    buttons.push("Précédent");
  }

  buttons.push(1);

  if (firstButton > 2) {
    buttons.push("...");
  }

  for (let i = firstButton; i <= lastButton; i++) {
    buttons.push(i);
  }

  if (lastButton < pageTotal - 1) {
    buttons.push("...");
  }

  buttons.push(pageTotal);

  if (currentPage < pageTotal) {
    buttons.push("Suivant");
  }
  buttons = [...new Set(buttons)];
  return buttons;
};
