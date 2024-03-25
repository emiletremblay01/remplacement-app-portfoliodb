import prismadb from "@/lib/prismadb";
import { ModificationForm } from "./components/ModificationForm";

const RemplacementIdPage = async ({
  params,
}: {
  params: { remplacementId: string };
}) => {
  const remplacement = await prismadb.remplacement.findFirst({
    where: { id: params.remplacementId },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ModificationForm initialData={remplacement} />
      </div>
    </div>
  );
};

export default RemplacementIdPage;
