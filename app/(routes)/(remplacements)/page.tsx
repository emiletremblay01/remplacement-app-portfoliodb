// TODO: Add loading skeleton
// TODO: Add Statut handling vs Courriel envoyé
// TODO: Add toggle for couriel envoyé inside datatable
// TODO: Change Affichage de colonnes columns names
// TODO: Clean up code imports

import { Button } from "@/components/ui/button";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

import { getLatestRemplacements } from "@/actions/server-actions";
import Link from "next/link";
import { Wand2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import GenerateEmailBtn from "@/components/GenerateEmailBtn";
export const revalidate = 0;
export default async function HomePage() {
  const remplacements = await getLatestRemplacements();
  const courrielFormatter = () => {
    function getRandomValueFromArray(array: string[]) {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
    }
    let result = "";
    result += `${getRandomValueFromArray([
      "Bonjour les amis!",
      "Salut la gang!",
      "Allo l'équipe!",
    ])} \n\n`;
    result +=
      "Voici nos remplacements à combler pour les prochains jours: \n\n";

    const formatter = new Intl.DateTimeFormat("fr-CA", {
      day: "2-digit",
      month: "short",
    });
    remplacements.map((remplacement) => {
      const { statut } = remplacement;
      if (statut === "approuvé") return;

      const { dateQuart, heuresQuart, posteQuart, courrielEnvoye } =
        remplacement;

      const formatted = formatter.format(dateQuart);
      let icon = "";
      switch (posteQuart) {
        case "Café":
          icon = "☕";
          break;
        case "Billetterie":
          icon = "🎟️";
          break;
        case "Concession":
          icon = "🍿";
          break;
        case "Plancher":
          icon = "🧹";
          break;
        default:
          break;
      }
      let relance = "";
      if (courrielEnvoye.length > 0) {
        relance = "(relancé)";
      }

      result += `\t• ${formatted}  -  ${heuresQuart}  -  ${posteQuart} ${icon} ${relance} \n`;
    });
    result += `\n\n${getRandomValueFromArray([
      "Manifestez-vous!",
      "Merci beaucoup!",
      "Premier arrivé, premier servi!",
    ])} \n\n`;
    return result;
  };
  const a = courrielFormatter();
  return (
    <div className="container mx-auto py-10 space-y-4">
      <h1 className=" font-semibold text-muted-foreground text-lg">
        Remplacements des jours à venir
      </h1>
      <GenerateEmailBtn startingText={a} />
      <DataTable columns={columns} data={remplacements} />
    </div>
  );
}
