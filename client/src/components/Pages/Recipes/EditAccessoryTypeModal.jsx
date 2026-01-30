import { IoMdClose } from "react-icons/io";
import { useState, useEffect } from "react";
import { updateAccessory } from "@services/AccessoriesServices.js"; 

export default function EditAccessoryTypeModal({ isVisible, setVisible, accessory }) {
  // Estados para os 4 campos
  const [name, setName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [value, setValue] = useState(0);
  const [purchaseDate, setPurchaseDate] = useState("");

  useEffect(() => {
    if (accessory) {
      // 1. Nome
      setName(accessory.Acessório || "");
      
      // 2. Serial (Remove o traço se for vazio)
      const serial = accessory["Número de Série"];
      setSerialNumber(serial === "-" ? "" : serial);

      // 3. Valor (Converte string "R$ 1.200,50" para float 1200.50)
      const rawValue = accessory["Valor"] || accessory["Custo Estimado"];
      let numValue = 0;
      if (typeof rawValue === 'string') {
        numValue = Number(rawValue.replace("R$", "").replace(/\./g, "").replace(",", ".").trim());
      } else {
        numValue = Number(rawValue);
      }
      setValue(isNaN(numValue) ? 0 : numValue);

      // 4. Data (Converte "dd/mm/aaaa" para "aaaa-mm-dd" para o input funcionar)
      const rawDate = accessory["Data Compra"];
      if (rawDate && rawDate !== "-") {
        const parts = rawDate.split('/'); // [dd, mm, aaaa]
        if (parts.length === 3) {
          setPurchaseDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
            setPurchaseDate("");
        }
      } else {
        setPurchaseDate("");
      }
    }
  }, [accessory, isVisible]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!accessory?.ID) return;
      
      // Envia todos os 4 campos atualizados
      await updateAccessory(accessory.ID, name, serialNumber, value, purchaseDate);
      
      window.location.reload();
      setVisible(false);
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar.");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-200 p-6 rounded-lg shadow-lg w-96 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Editar Acessório</h2>
          <button onClick={() => setVisible(false)} type="button"><IoMdClose /></button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col space-y-4">
          
          {/* Nome */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Nome *</label>
            <input
              type="text"
              className="p-2 rounded border border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Serial Number */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Número de Série</label>
            <input
              type="text"
              className="p-2 rounded border border-gray-300"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          {/* Data de Compra */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Data de Compra</label>
            <input
              type="date"
              className="p-2 rounded border border-gray-300"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* Valor */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700">Valor (R$)</label>
            <input
              type="number"
              className="p-2 rounded border border-gray-300"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setVisible(false)} className="p-2 bg-slate-50 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bnt-add">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}