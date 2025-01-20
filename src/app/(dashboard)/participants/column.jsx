"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const columns = [
  {
    accessorKey: "imageURL",
    header: "",
    cell: ({ row }) => {
      return (
        <Avatar className="h-12 w-12 rounded-lg">
          <AvatarImage
            src={row.getValue("imageURL")}
            alt={row.getValue("name")}
          />
          <AvatarFallback className="rounded-lg">
            {row
              .getValue("name")
              ?.split(" ")
              .map((i) => i[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nom et prénoms",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "sex",
    header: "Sexe",
  },
  {
    accessorKey: "phoneNumber",
    header: "Numéro de téléphone",
  },
  {
    accessorKey: "cell",
    header: "Cellule de provenance",
  },
  {
    accessorKey: "church",
    header: "Eglise de provenance",
  },
  {
    accessorKey: "paymentDone",
    header: "Paiement",
    cell: ({ row }) => {
      const participant = row.original;
      const [paymentDone, setPaymentDone] = useState(participant.paymentDone);
      return (
        <Switch
          checked={paymentDone}
          onCheckedChange={async () => {
            let stringifiedData;
            setPaymentDone((oldChecked) => {
              stringifiedData = JSON.stringify({
                ...participant,
                paymentDone: !oldChecked,
              });
              return !oldChecked;
            });
            try {
              const response = await fetch(
                (process.env.NEXT_PUBLIC_DEPLOYMENT_URL ||
                  "http://localhost:8080") + "/api/participants",
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json", // Important pour signaler que le contenu est du JSON
                  },
                  body: stringifiedData,
                }
              );
              if (response.ok) {
                toast({
                  title: "Succès",
                  description: "Paiement mis à jour!",
                  duration: 5000,
                });
              } else {
                toast({
                  title: "Erreur",
                  description: "Le paiement n'a pas été mis à jour!",
                  variant: "destructive",
                  duration: 5000,
                });
                setPaymentDone((oldChecked) => !oldChecked);
              }
            } catch (error) {
              toast({
                title: "Erreur",
                description: "Le paiement n'a pas été mis à jour",
                variant: "destructive",
                duration: 5000,
              });
              console.log("Erreur lors de la modification", error);
              setPaymentDone((oldChecked) => !oldChecked);
            }
          }}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const participant = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(participant.email)}
            >
              Voir le badge
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir le participant</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
