"use client";

import { ColumnDef } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Remplacement } from "@/types";

import CellAction from "./CellAction";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Remplacement>[] = [
  {
    accessorKey: "dateDemande",
    header: "Date de la demande",
    cell: ({ row }) => {
      const formatter = new Intl.DateTimeFormat("fr-CA", {
        day: "2-digit",
        month: "short",
      });
      const formatted = formatter.format(row.getValue("dateDemande") as Date);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "nomEquipier",
    header: "Nom de l'équipier",
  },

  {
    accessorKey: "recuPar",
    header: "Reçu par",
  },
  {
    accessorKey: "dateQuart",
    header: "Date",
    cell: ({ row }) => {
      const formatter = new Intl.DateTimeFormat("fr-CA", {
        day: "2-digit",
        month: "short",
      });
      const formatted = formatter.format(row.getValue("dateQuart") as Date);

      return <div className="">{formatted}</div>;
    },
  },
  {
    accessorKey: "heuresQuart",
    header: "Heures",
  },
  {
    accessorKey: "posteQuart",
    header: "Poste",
  },

  {
    accessorKey: "courrielEnvoye",
    header: "Courriel envoyé?",
    cell: ({ row }) => {
      const dates = row.getValue("courrielEnvoye") as Date[];
      if (dates.length <= 0) {
        return <div className="text-red-800 animate-pulse">NON</div>;
      }

      const formatter = new Intl.DateTimeFormat("fr-CA", {
        day: "2-digit",
        month: "short",
      });
      const highestDate = dates.reduce((a, b) =>
        a.getTime() > b.getTime() ? a : b
      );
      const formatted = formatter.format(highestDate);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "statut",
    header: () => <div className="text-left w-24">Statut</div>,
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string;

      return (
        <div
          className={cn("px-2 py-1 flex justify-center w-full rounded-full", {
            "bg-yellow-100 text-yellow-800": statut === "en attente",
            "bg-green-100 text-green-800": statut === "approuvé",
            "bg-red-100 text-red-800": statut === "non remplacé",
          })}
        >
          <p className="shrink-0 text-xs">{statut.toUpperCase()}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "nomEquipierRemplacant",
    header: "Remplaçant",
    cell: ({ row }) => {
      const statut = row.getValue("nomEquipierRemplacant") as string;

      return (
        <div
          className={cn("", {
            "text-lg": statut === "",
          })}
        >
          {statut === "" ? "🤷🏻‍♀️" : statut}
        </div>
      );
    },
  },
  {
    accessorKey: "remplacementEffectuePar",
    header: "Remplacement effectué par",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
