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
  const day = '0' + date.getDay();
  return `${year}-${month.slice(-2)}-${day.slice(-2)}`
}