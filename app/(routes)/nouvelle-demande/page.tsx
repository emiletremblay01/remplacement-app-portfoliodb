import { NouvelleDemandeForm } from "./components/NouvelleDemandeForm";

const NouvelleDemandePage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <NouvelleDemandeForm />
      </div>
    </div>
  );
};

export default NouvelleDemandePage;
