import tick_double from "@imgs/tick-double.png"
import archive from "@imgs/archive.png"
export default function ProjectsFooter() {
  return (
    <footer className="flex justify-center">
      <div className="w-1/4 h-fit bg-white flex flex-row rounded shadow p-2 justify-around">
        <button className="flex items-center gap-2 bnt">
          <img src={archive} className="h-5 w-5" />
          <span className="font-medium text-base">Arquivar Projeto</span>
        </button>

        <button className="flex items-center gap-2 bnt-add">
          <img src={tick_double} className="h-5 w-5" />
          <span className="font-medium text-base">Concluir Projeto</span>
        </button>
      </div>
    </footer>
  );
}
