import { useEffect, useMemo, useState, useContext } from "react";
import {
  totalValuesProjects,
  totalMaterialsProjects,
} from "@services/ViewsSummary.js";
import { VerifyAuth } from "@services/AuthService.js";
import { selectedProjectContext } from "@content/SeletedProject.jsx";

function renderMaterialSummary(
  project_materials,
  materials = [
    { id: 1, label: "Resina" },
    { id: 2, label: "Roving" },
    { id: 3, label: "Tecido (Kg)" },
    { id: 4, label: "Tecido (camadas)" },
    { id: 5, label: "Catalisador" },
    { id: 6, label: "Manta" },
    { id: 7, label: "Resina ISO" },
  ],
) {
  if (!project_materials) return <p>Carregando...</p>;

  return materials.map((mat, index) => {
    const matData = project_materials.find((m) => m.material_id == mat.id);

    // CORREÇÃO AQUI: Converter para Number antes de usar toFixed
    const valorNumerico = Number(matData?.total_value || 0);

    return (
      <p key={index}>
        {mat.label}: {valorNumerico.toFixed(2)}
      </p>
    );
  });
}

export default function ProjectsHeader({ times }) {
  const [projectsMaterials, setProjectsMaterial] = useState([]);
  const [projectsValues, setProjectsValues] = useState([]);

  const { currentProject } = useContext(selectedProjectContext);

  useEffect(() => {
    const loadData = async () => {
      const user = await VerifyAuth();
      const [times_data, material_data] = await Promise.all([
        totalValuesProjects(user.user_id),
        totalMaterialsProjects(user.user_id),
      ]);
      setProjectsValues(times_data);
      setProjectsMaterial(material_data);
    };
    loadData();
  }, []);

  const summary = useMemo(() => {
    // SE NENHUM PROJETO SELECIONADO: MOSTRAR TUDO
    if (!currentProject) {
      // 1. Soma Total de Valor (R$)
      const totalVal = projectsValues.reduce(
        (acc, curr) => acc + Number(curr.total_value || 0), // Garante soma numérica
        0,
      );

      // 2. Soma Agregada de Materiais
      const allMaterialsMap = new Map();

      projectsMaterials.forEach((pm) => {
        const current = allMaterialsMap.get(pm.material_id) || {
          material_id: pm.material_id,
          total_value: 0,
        };
        // Garante soma numérica e evita concatenação de strings
        current.total_value += Number(pm.total_value || 0);
        allMaterialsMap.set(pm.material_id, current);
      });

      const totalMat = Array.from(allMaterialsMap.values());

      return {
        name: "Visão Geral (Todos os Projetos)",
        materials: totalMat,
        value: totalVal.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        isGlobal: true,
      };
    }

    // SE PROJETO SELECIONADO: LÓGICA ANTIGA
    const total_mat = projectsMaterials.filter(
      (p) => p.project_id == currentProject.id,
    );

    const total_value = projectsValues.find(
      (p) => p.project_id == currentProject.id,
    );

    const value = Number(total_value?.total_value || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      },
    );

    return {
      name: currentProject.name,
      materials: total_mat,
      value: value,
      isGlobal: false,
    };
  }, [currentProject, projectsMaterials, projectsValues]);

  // Cálculo de Horas Totais (Global ou Específico)
  const hoursMetrics = useMemo(() => {
    if (!times?.projects)
      return { total_hours: 0, qtd_employees: 0, total_hh: 0 };

    if (!currentProject) {
      // Soma de todos os projetos
      const allProjects = Object.values(times.projects);
      const total_hours = allProjects.reduce(
        (acc, curr) => acc + Number(curr.total_hours || 0),
        0,
      );

      const qtd_employees = allProjects.reduce(
        (acc, curr) => acc + Number(curr.qtd_employees || 0),
        0,
      );

      const total_hh = allProjects.reduce(
        (acc, curr) =>
          acc + Number(curr.qtd_employees || 0) * Number(curr.total_hours || 0),
        0,
      );

      return { total_hours, qtd_employees, total_hh };
    } else {
      // Projeto Específico
      const pData = times.projects[currentProject.id];
      return {
        total_hours: Number(pData?.total_hours || 0),
        qtd_employees: Number(pData?.qtd_employees || 0),
        total_hh:
          Number(pData?.qtd_employees || 0) * Number(pData?.total_hours || 0),
      };
    }
  }, [times, currentProject]);

  return (
    <header className="card p-4">
      <div className="flex gap-8 w-full">
        <h1 className="text-xl font-bold">
          {summary?.name || "Carregando..."}
        </h1>
        <p className="text-xl font-bold text-blue-500"> {summary?.value}</p>
      </div>

      <div className="flex gap-4 mt-2 flex-wrap">
        {/* Materiais Summary */}
        {renderMaterialSummary(summary?.materials)}

        <p>Total de Horas: {hoursMetrics.total_hours.toFixed(1)} Horas</p>
        <p>Total de Homens: {hoursMetrics.qtd_employees} F</p>
        <p>Total Horas-Homem: {hoursMetrics.total_hh.toFixed(1)} HH</p>
      </div>
    </header>
  );
}
