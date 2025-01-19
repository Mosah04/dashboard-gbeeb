"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const filters = [
  {
    value: "name",
    label: "Nom et prénoms",
  },
  {
    value: "email",
    label: "Email",
  },
  {
    value: "sex",
    label: "Sexe",
  },
  {
    value: "phoneNumber",
    label: "Numéro de téléphone",
  },
  {
    value: "cell",
    label: "Cellule de provenance",
  },
  {
    value: "church",
    label: "Eglise de provenance",
  },
];

export function Combobox({ columnToFilter, setColumnToFilter }) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {columnToFilter
            ? filters.find((filter) => filter.value === columnToFilter)?.label
            : "Filtrer par"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          {/* <CommandInput placeholder="Trouver un filtre..." /> */}
          <CommandList>
            <CommandEmpty>Aucun filtre trouvé</CommandEmpty>
            <CommandGroup>
              {filters.map((filter) => (
                <CommandItem
                  key={filter.value}
                  value={filter.value}
                  onSelect={(currentValue) => {
                    setColumnToFilter(
                      currentValue === columnToFilter ? "" : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {filter.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      columnToFilter === filter.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
