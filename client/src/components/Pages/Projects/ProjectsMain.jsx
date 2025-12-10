// Import de funções
import { useState } from "react";

// Import de icones
import { FaSearch } from "react-icons/fa";

// Import de componentes especificos a esta página
import ProjectEquipmentsTable from "./ProjectEquipmentsTable";

export default function ProjectsMain({currentProject, times}) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <main className="card m-0 p-4 gap-4 overflow-y-auto">
      {/* Barra de Pesquisa */}
      <div className="flex flex-row justify-between w-full">
        <form
          className="flex flex-row justify-between space-x-4 p-2 rounded-xl bg-white-gray h-fit"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <button>
            <FaSearch />
          </button>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent"
            value={searchTerm}
            onChange={(e) => {
              e.preventDefault();
              setSearchTerm(e.target.value);
            }}
          />
        </form>

        {/* Botões de ações */}
        <div className="flex flex-row justify-center gap-4 h-fit">
          <button className="bnt-add">+ Novo Equipamento</button>
          <button className="bnt">Ir para Cronograma</button>
          <button className="bnt">Ir para Acessórios</button>
        </div>
      </div>

      {/* Tabela */}
      {currentProject && (
        <ProjectEquipmentsTable
          project_id={currentProject?.id}
          searchTerm={searchTerm}
          times={times ?? {}}
        />
      )}
    </main>
  );
}
