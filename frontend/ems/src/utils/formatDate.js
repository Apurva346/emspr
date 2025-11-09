// // // src/utils/formatDate.js

// // /**
// //  * Format any date (string or Date object) to "YYYY-MM-DD"
// //  * Handles null, undefined, invalid formats safely.
// //  */
// // export const formatDate = (date) => {
// //   if (!date) return '';
// //   try {
// //     const d = new Date(date);
// //     // Ensures it's always in YYYY-MM-DD format without timezone shift
// //     return d.toISOString().split('T')[0];
// //   } catch (error) {
// //     console.error('Invalid date:', date);
// //     return '';
// //   }
// // };
// // src/utils/formatDate.js

// export const formatDate = (date) => {
//   if (!date || date === '0000-00-00') return '';
//   try {
//     const d = new Date(date);

//     // Get year, month, day in UTC (not local timezone)
//     const year = d.getUTCFullYear();
//     const month = String(d.getUTCMonth() + 1).padStart(2, '0');
//     const day = String(d.getUTCDate()).padStart(2, '0');

//     return `${year}-${month}-${day}`;
//   } catch (error) {
//     console.error('Invalid date:', date);
//     return '';
//   }
// };
// src/utils/formatDate.js
export const formatDate = (date) => {
  if (!date || date === '0000-00-00') return '';

  // If it already looks like 1995-05-09T18:30:00.000Z → cut before "T"
  if (date.includes('T')) {
    return date.split('T')[0];
  }

  // If it's already in YYYY-MM-DD form
  return date;
};
