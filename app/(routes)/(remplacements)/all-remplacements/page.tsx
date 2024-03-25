// TODO: Add loading skeleton
// TODO: Add Statut handling vs Courriel envoyé
// TODO: Add toggle for couriel envoyé inside datatable
// TODO: Change Affichage de colonnes columns names
// TODO: Clean up code imports

import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";

import { DownloadButton } from "@/components/DownloadButton";
import { getAllRemplacements } from "@/actions/server-actions";

export const revalidate = 0;
export default async function AllRemplacements() {
  const remplacements = await getAllRemplacements();

  return (
    <div className="container mx-auto py-10 space-y-2">
      <h1 className="font-semibold text-muted-foreground text-lg flex  justify-between gap-4 items-center">
        Historique de tous les remplacements
        <DownloadButton fileName="remplacements" data={remplacements} />
      </h1>
      <DataTable columns={columns} data={remplacements} />
    </div>
  );
}
