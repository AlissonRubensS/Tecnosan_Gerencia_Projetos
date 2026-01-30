// Bibliotecas
import { useEffect, useState } from "react";
import { parseBRL } from "../../../utils/IntUtils";

// Componentes
import NavBar from "../../Ui/NavBar";
import RecipeTable from "./RecipeTable";
import RecipeHeader from "./RecipeHeader";

// Serviços
import { listMaterials } from "@services/MaterialService.js";
import { listAccessories } from "@services/AccessoriesServices.js";
import { VerifyAuth } from "@services/AuthService.js";
import {
  vwComponentRecipeMaterials,
  vwEquipmentMaterialsSummary,
} from "@services/ViewsService.js";

function Recipes() {
  // Estados de Expansão
  const [materialsExpanded, setMaterialsExpanded] = useState(false);
  const [accessoriesExpanded, setAccessoriesExpanded] = useState(false);
  const [componentsExpanded, setcomponetsExpanded] = useState(false);
  const [equipmentsExpanded, setEquipmentsExpanded] = useState(false);

  // Listas de Dados
  const [materialsList, setMaterialsList] = useState([]);
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [componentsList, setComponentsList] = useState([]);
  const [equipmentsList, setEquipmentsList] = useState([]);

  // Estados de Busca
  const [searchMaterial, setSearchMaterial] = useState("");
  const [searchAccessory, setSearchAccessory] = useState("");
  const [searchComponent, setSearchComponent] = useState("");
  const [searchEquipment, setSearchEquipment] = useState("");

  // Função auxiliar para traduzir o status (Pode ficar fora do componente ou num utils)
  const translateStatus = (status) => {
    const statusMap = {
      Available: "Disponível",
      "In Use": "Em Uso",
      Maintenance: "Manutenção",
      Lost: "Perdido",
    };
    return statusMap[status] || status || "-";
  };

  // Função auxiliar para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  // ... DENTRO DO SEU COMPONENTE ...

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Verificação de Auth e Disparo simultâneo das requisições (Muito mais rápido)
        await VerifyAuth();

        const [materialsData, accessoriesData, componentsData, equipmentsData] =
          await Promise.all([
            listMaterials(),
            listAccessories(),
            vwComponentRecipeMaterials(),
            vwEquipmentMaterialsSummary(),
          ]);

        // --- 2. Formatar Materiais ---
        setMaterialsList(
          materialsData.map((i) => ({
            ID: i.material_id,
            Material: i.material_name,
            Descrição: i.material_desc,
            "Valor Unitário": `R$ ${i.value} / ${i.uni}`,
          })),
        );
        // --- 3. Formatar Acessórios (CORRIGIDO E TRADUZIDO) ---
        setAccessoriesList(
          accessoriesData.map((i) => ({
            ID: i.accessory_id,
            Acessório: i.name,
            "Nº de Série": i.serial_number || "-",
            "Data da Compra": formatDate(i.purchase_date),
            Status: translateStatus(i.status),
            Valor: parseBRL(parseFloat(i.value)),
          })),
        );

        // --- 4. Formatar Componentes ---
        setComponentsList(
          componentsData.map((dc) => ({
            ID: dc.component_recipe_id,
            Componente: dc.recipe_name,
            "Total Funcionários": dc.qtd_employees,
            "Total Horas": dc.qtd_hours,
            "Horas-Homens": dc.horas_homem,
            "Valor Total": parseBRL(dc.total_value),
          })),
        );

        // --- 5. Formatar Equipamentos ---
        setEquipmentsList(
          equipmentsData.map((de) => ({
            ID: de.equipment_recipe_id,
            Equipamento: de.recipe_name,
            "Horas-Homens": de.horas_homem,
            "Valor Total": parseBRL(de.total_value),
          })),
        );
      } catch (error) {
        console.error("Erro ao carregar dados da tela de Receitas:", error);
      }
    };

    loadAllData();
  }, []);

  // --- FILTROS COM PROTEÇÃO CONTRA NULL/UNDEFINED ---
  // A correção está aqui: (m.Material || "") garante que nunca seja null antes do .toLowerCase()

  const filterMaterials = materialsList.filter((m) =>
    (m.Material || "").toLowerCase().includes(searchMaterial.toLowerCase()),
  );

  const filterAccessories = accessoriesList.filter((a) =>
    (a.Acessório || "").toLowerCase().includes(searchAccessory.toLowerCase()),
  );

  const filterComponents = componentsList.filter((c) =>
    (c.Componente || "").toLowerCase().includes(searchComponent.toLowerCase()),
  );

  const filterEquipments = equipmentsList.filter((e) =>
    (e.Equipamento || "").toLowerCase().includes(searchEquipment.toLowerCase()),
  );

  return (
    <div className="w-full flex flex-col gap-4 text-xs mb-16 overflow-x-hidden overflow-y-auto">
      <NavBar select_index={5} />

      {[
        {
          label: "Material",
          list: filterMaterials,
          isExpand: materialsExpanded,
          setExpand: setMaterialsExpanded,
          setSearch: setSearchMaterial,
        },
        {
          label: "Acessório",
          list: filterAccessories,
          isExpand: accessoriesExpanded,
          setExpand: setAccessoriesExpanded,
          setSearch: setSearchAccessory,
        },
        {
          label: "Componente",
          list: filterComponents,
          isExpand: componentsExpanded,
          setExpand: setcomponetsExpanded,
          setSearch: setSearchComponent,
        },
        {
          label: "Equipamento",
          list: filterEquipments,
          isExpand: equipmentsExpanded,
          setExpand: setEquipmentsExpanded,
          setSearch: setSearchEquipment,
        },
      ].map((i, key) => (
        <div className="justify-between self-center w-4/5" key={key}>
          <RecipeHeader i={i} />
          <RecipeTable i={i} />
        </div>
      ))}
    </div>
  );
}

export default Recipes;
