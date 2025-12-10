export default function ProjectsHeader({currentProject, times}) {
  return (
    <header className="card p-4">
      <div className="flex gap-8 w-full">
        <h1 className="text-xl font-bold">
          {currentProject?.name || "Gastos Totais"}
        </h1>
        <p className="text-xl font-bold text-blue-500">R$ 1.000.000,00</p>
      </div>

      <div className="flex gap-8 mt-2">
        <p>Resina: 250 Kg</p>
        <p>Roving: 300 Kg</p>
        <p>Tecido: 50 Kg</p>
        <p>CMD Tec: 20 cmd</p>
        <p>
          Total de Horas:{" "}
          {times?.projects?.[currentProject?.id]?.total_hours ?? 0} Horas
        </p>
        <p>
          Total de Homens:{" "}
          {times?.projects?.[currentProject?.id]?.qtd_employees ?? 0} F
        </p>
        <p>
          Total Horas-Homem:{" "}
          {(times?.projects?.[currentProject?.id]?.qtd_employees ?? 0) *
            (times?.projects?.[currentProject?.id]?.total_hours ?? 0)}{" "}
          F HH
        </p>
      </div>
    </header>
  );
}
