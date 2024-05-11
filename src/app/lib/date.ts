/**
 * Create locale date string
 * @param "new Date('2023-05-14')"
 * @example "Minggu, 14 Mei 2023"
 */
export const convertDateToLocaleString = (date: Date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
};

export const convertDateToShortString = (date: Date) => {
  const year = date.getFullYear();
  const month = '0' + (date.getMonth() + 1);
  const day = '0' + date.getDate();
  return `${year}-${month.slice(-2)}-${day.slice(-2)}`
}

export const convertDateToExcelShortString = (date: Date) => {
  const year = date.getFullYear();
  const month = '0' + (date.getMonth() + 1);
  const day = '0' + date.getDate();
  return `${day.slice(-2)}/${month.slice(-2)}/${year}`
}