export const generateDateList = (numberOfDays, startDate = new Date()) => {
  return Array.from({ length: numberOfDays }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    return date;
  });
};