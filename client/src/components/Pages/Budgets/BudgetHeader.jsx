import { useEffect, useState } from "react";
import { vwBudgetsMaterialsSummary } from "@services/ViewsService.js";

export default function ProjectsHeader({ currentBudget }) {
  const [budgetsSummary, setBudgetsSummary] = useState([]);
  const [currentBudgetSummay, setCurrentBudgetSummay] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const budget_summary_data = await vwBudgetsMaterialsSummary();
      setBudgetsSummary(budget_summary_data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const aux = budgetsSummary?.find(
      (bud) => bud?.budget_id == currentBudget?.id
    );
    setCurrentBudgetSummay(aux);
  }, [currentBudget, budgetsSummary, setCurrentBudgetSummay]);

  return (
    <header className="card p-4">
      <div className="flex gap-8 w-full">
        <h1 className="text-xl font-bold">
          {currentBudget?.name || "Gastos Totais"}
        </h1>
        <p className="text-xl font-bold text-blue-500">
          {" "}
          {(currentBudgetSummay?.total_value ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
        </p>
      </div>

      <div className="flex gap-8 mt-2">
        {/* Materiais Summay */}
        <p>Resina: {currentBudgetSummay?.resina}</p>
        <p>Roving: {currentBudgetSummay?.roving}</p>
        <p>Tecido KG: {currentBudgetSummay?.tecido_kg}</p>
        <p>Tecido CMD: {currentBudgetSummay?.tecido_cmd}</p>
        <p>Catalizador: {currentBudgetSummay?.catalizador}</p>
        <p>Manta: {currentBudgetSummay?.manta}</p>
        <p>Resina ISO: {currentBudgetSummay?.resina_iso}</p>
        <p>Total Horas-Homem: {currentBudgetSummay?.horas_homem} HH</p>
      </div>
    </header>
  );
}
