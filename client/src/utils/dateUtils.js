export const generateDateList = (numberOfDays, startDate = new Date()) => {
  return Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  });
};

export const formatDateForInput = (isoString) => {
  if (!isoString) return "";
  
  const date = new Date(isoString);
  
  // O input datetime-local não sabe lidar com fusos automaticamente (ele mostra "tempo de parede").
  // Se quisermos mostrar a hora local correta (ex: Brasil -3h), precisamos ajustar:
  const offset = date.getTimezoneOffset() * 60000; // Converte offset em minutos para ms
  const localDate = new Date(date.getTime() - offset);
  
  // Retorna yyyy-MM-ddThh:mm e remove o 'Z' e milissegundos
  return localDate.toISOString().slice(0, 16);
};