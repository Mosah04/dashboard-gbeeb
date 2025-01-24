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
import { updateParticipant } from "@/lib/actions/participant.action";
import { ParticipantDialog } from "@/components/ParticipantDialog";

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
            let participantUpdated;
            setPaymentDone((oldChecked) => {
              participantUpdated = {
                ...participant,
                paymentDone: !oldChecked,
              };
              return !oldChecked;
            });
            try {
              const updatedParticipant = await updateParticipant(
                participantUpdated
              );
              if (updatedParticipant)
                toast({
                  title: "Succès",
                  description: "Paiement mis à jour!",
                  duration: 5000,
                });
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
      const [open, setOpen] = useState(false);

      return (
        <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Voir le badge: J'y suis</DropdownMenuItem>
            <DropdownMenuItem
            // onClick={() => navigator.clipboard.writeText(participant.email)}
            >
              Voir le badge: J'y serai
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ParticipantDialog
                participant={participant}
                onClose={() => setOpen(false)}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
