import { cache } from "react";
import prismadb from "@/lib/prismadb";
export const getLatestRemplacements = cache(async () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const remplacements = await prismadb.remplacement.findMany({
    where: {
      dateQuart: {
        gte: currentDate,
      },
    },
    orderBy: {
      dateQuart: "asc",
    },
  });
  return remplacements;
});

export const getAllRemplacements = cache(async () => {
  setAllEnAttenteRemplacementsPastDateQuartToNonRemplace();
  const remplacements = await prismadb.remplacement.findMany({
    orderBy: {
      dateDemande: "desc",
    },
  });
  return remplacements;
});

const setAllEnAttenteRemplacementsPastDateQuartToNonRemplace = async () => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  await prismadb.remplacement.updateMany({
    where: {
      dateQuart: {
        lt: currentDate,
      },
      statut: "en attente",
    },
    data: {
      statut: "non remplacé",
    },
  });
};
