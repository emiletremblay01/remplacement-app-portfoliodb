"use client";
import { convertToCSV } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { Remplacement } from "@/types";

export const DownloadButton = ({
  data,
  fileName,
}: {
  data: Remplacement[];
  fileName: string;
}) => {
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDataForCSV = (data: Remplacement[]) => {
    // Define column names
    const columnNames = [
      "Date de la demande",
      "Date du quart",
      "Heures du quart",
      "Poste",
      "Nom de l'equipier",
      "Nom de l'equipier remplaçant",
      "Directeur",
    ];

    // Add column names row
    let csvData = columnNames.join(",") + "\n";

    // Filter data and keep only the required columns
    const formattedData = data.map((item) => ({
      dateDemande: formatDate(new Date(item.dateDemande)),
      dateQuart: formatDate(new Date(item.dateQuart)),
      heuresQuart: item.heuresQuart,
      nomEquipier: item.nomEquipier,
      nomEquipierRemplacant: item.nomEquipierRemplacant,
      posteQuart: item.posteQuart,
      remplacementEffectuePar: item.remplacementEffectuePar,
    }));

    // Convert formatted data to CSV string and append to csvData
    csvData += formattedData
      .map((item) => Object.values(item).join(","))
      .join("\n");

    return csvData;
  };

  const handleDownload = () => {
    const csvData = formatDataForCSV(data);

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload}>
      Télécharger
      <DownloadIcon className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default DownloadButton;
