// Imports de componentes gerais
import NavBar from "../../Ui/NavBar";
import SidebarList from "../../Ui/SlideBarList";

// Import de componentes de especifícos a outro componente
import AddBudgetModal from "../Budgets/AddBudgetModal";

// Import de componentes especificos a esta página
import ProjectsHeader from "./ProjectsHeader";
import ProjectsMain from "./ProjectsMain";
import ProjectsFooter from "./ProjectsFooter";

// Import de funções
import { selectedProjectContext } from "@content/SeletedProject.jsx";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";

// Import de Services
import { listProjects } from "@services/ProjectService";
import { getTimesCascade } from "@services/ViewsService";
import { VerifyAuth } from "@services/AuthService";

function Projects() {
  const [projects, setProjects] = useState([]); // inicial vazio
  const [isAddBudgetModalOpen, setAddBudgetModalOpen] = useState(false);
  const { currentProject, setCurrentProject } = useContext(
    selectedProjectContext
  );
  const [times, setTimes] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const user = await VerifyAuth();

      const project_data = await listProjects(user.user_id);
      if (project_data) setProjects(project_data);

      const hours_data = await getTimesCascade();
      setTimes(hours_data);
    }
    loadData();
  }, []);

  return (
    <>
      <div className="flex flex-col max-w-screen min-h-screen overflow-x-hidden gap-6">
        <NavBar select_index={1} />

        {/* Header Principal */}
        <div className="card justify-between">
          <h1 className="text-base font-medium">Projetos</h1>
          <button
            className="px-4 py-1 rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => navigate("/budgets")}
          >
            Ir para Orçamento
          </button>
        </div>

        {/* Layout Principal */}
        <div className="flex flex-1 ml-8 gap-4 mb-8">
          {/* Sidebar */}
          <div className="w-1/12 min-w-[150px]">
            <SidebarList
              items={projects.map((project) => ({
                id: project.project_id,
                name: project.project_name,
                desc: project.project_desc,
                status: project.status,
                start_date: project.start_date,
                completion_date: project.completion_date,
                deadline: project.deadline,
              }))}
              selectedItem={currentProject}
              onSelectItem={setCurrentProject}
              onAdd={() => setAddBudgetModalOpen(true)}
              addLabel="+ Novo Projeto"
              titleAll="Todos os Projetos"
              filterOptions={[
                { value: "Running", label: "Executando" },
                { value: "Pending", label: "Pendente" },
              ]}
            />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex flex-col flex-1 gap-4">
            {/* Header do Projeto */}
            <ProjectsHeader times={times} />

            {/* MAIN expansivo */}
            <ProjectsMain times={times}/>

            {/* Footer */}
            <ProjectsFooter />
          </div>
        </div>
      </div>

      {/* Modal de Adicionar Orçamento */}
      {isAddBudgetModalOpen && (
        <AddBudgetModal
          isOpen={isAddBudgetModalOpen}
          setOpen={setAddBudgetModalOpen}
        />
      )}
    </>
  );
}

export default Projects;
