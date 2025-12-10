
export const formatDate = (date) => {
  if (!date || date === '0000-00-00') return '';

  // If it already looks like 1995-05-09T18:30:00.000Z → cut before "T"
  if (date.includes('T')) {
    return date.split('T')[0];
  }

  // If it's already in YYYY-MM-DD form
  return date;
};
