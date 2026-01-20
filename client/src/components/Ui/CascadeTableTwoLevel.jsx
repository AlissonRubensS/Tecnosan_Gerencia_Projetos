import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import remove_square from "@imgs/remove-square.png";
import add_square from "@imgs/add-square.png";

function CascadeTableTwoLevel({ data }) {
  const [openGroups, setOpenGroups] = useState({});

  const groupedData = useMemo(() => {
    const grouped = {};
    data.forEach((item) => {
      const dept = item.department_name ?? "Sem Departamento";
      const comp = item.component_name ?? "Sem Componente";
      const daysLate = Number(item.days_late) || 0;

      if (!grouped[dept]) grouped[dept] = [];
      grouped[dept].push({ component_name: comp, days_late: daysLate });
    });
    return grouped;
  }, [data]);

  const toggleGroup = (key) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  const getTotals = (items) => {
    const avgDays =
      items.length > 0
        ? Math.round(items.reduce((acc, i) => acc + i.days_late, 0))
        : 0;
    return avgDays;
  };

  return (
    <table className="w-full border-collapse text-sm text-left">
      <thead className="sticky top-0 z-10">
        <tr className="bg-sky-200 uppercase font-semibold text-gray-700">
          <th className="p-2 border-b border-sky-300">
            Departamento / Componente
          </th>
          <th className="p-2 border-b border-sky-300 text-center w-32">
            Dias de Atraso
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groupedData).length === 0 ? (
          <tr>
            <td colSpan={2} className="text-center py-4 text-gray-500">
              Nenhum processo em atraso.
            </td>
          </tr>
        ) : (
          Object.entries(groupedData).map(([department, components]) => {
            const avgDays = getTotals(components);
            return (
              <React.Fragment key={department}>
                {/* 🔹 Departamento */}
                <tr className="bg-sky-50 hover:bg-sky-100 border-b border-sky-100 transition-colors">
                  <td colSpan={2} className="p-0">
                    <button
                      onClick={() => toggleGroup(department)}
                      className="flex items-center justify-between w-full p-2 font-medium focus:outline-none"
                    >
                      <span className="flex items-center gap-2">
                        <img
                          src={
                            openGroups[department]
                              ? remove_square
                              : add_square
                          }
                          className="h-4 w-4 opacity-70"
                          alt="toggle"
                        />
                        {department}
                      </span>
                      <span className="font-bold">{avgDays} dias (total)</span>
                    </button>
                  </td>
                </tr>

                {/* 🔹 Componentes */}
                {openGroups[department] &&
                  components.map((item, i) => (
                    <tr
                      key={i}
                      className="bg-white hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <td className="p-2 pl-9 text-gray-600 border-r border-dashed border-gray-200">
                        {item.component_name}
                      </td>
                      <td className="p-2 text-center font-mono text-red-500 font-medium">
                        {item.days_late}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })
        )}
      </tbody>
    </table>
  );
}

CascadeTableTwoLevel.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      department_name: PropTypes.string,
      component_name: PropTypes.string,
      days_late: PropTypes.number,
    })
  ).isRequired,
};

export default CascadeTableTwoLevel;