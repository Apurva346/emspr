// middleware/employeeQueryBuilder.js

/**
 * Builds the SQL query and parameters for fetching/exporting employee data.
 * @param {string} searchTerm - The term to search for (name, id, manager, department, salary).
 * @param {string} statusFilter - The status to filter by ('Active', 'Inactive', 'All').
 * @param {string} [selectClause='*'] - The fields to select.
 * @returns {{sqlQuery: string, queryParams: Array<any>}} The query and its parameters.
 */
// const buildEmployeeQuery = (searchTerm, statusFilter, selectClause) => {
//     let whereClause = '';
//     const queryParams = [];

//     // 1. Status Filter
//     if (statusFilter && statusFilter.toLowerCase() !== 'all') {
//         whereClause += ' WHERE status = ?';
//         queryParams.push(statusFilter);
//     }

//     // 2. Search Term
//     if (searchTerm) {
//         const condition = ` (CAST(id AS CHAR) LIKE ? OR name LIKE ? OR manager LIKE ? OR department LIKE ? OR CAST(salary AS CHAR) LIKE ?)`;
//         whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
//         const term = `%${searchTerm}%`; // NOTE: Changed to %searchTerm% for better search
//         queryParams.push(term, term, term, term, term);
//     }

//     const finalSelect = selectClause || '*';
//     // const sqlQuery = `SELECT ${finalSelect} FROM home ${whereClause}`;
//     const sqlQuery = `SELECT ${finalSelect} FROM home ${whereClause} ORDER BY id DESC`;
    
//     return { sqlQuery, queryParams };
// };


//normalization
const buildEmployeeQuery = (searchTerm, statusFilter, selectClause) => {
    let whereClause = '';
    const queryParams = [];

    if (statusFilter && statusFilter !== 'All') {
        whereClause += ' WHERE s.name = ?';
        queryParams.push(statusFilter.toLowerCase());
    }

    if (searchTerm) {
        const condition = `
            (h.name LIKE ? OR h.manager LIKE ? OR d.name LIKE ? OR CAST(h.salary AS CHAR) LIKE ?)
        `;
        whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
        const term = `%${searchTerm}%`;
        queryParams.push(term, term, term, term);
    }

    const sqlQuery = `
        SELECT 
            h.id, h.name, h.manager, h.salary, h.profile_pic, h.email, h.phone, h.position,
            d.name AS department,
            s.name AS status,
            wm.name AS working_mode,
            et.name AS emp_type
        FROM home h
        LEFT JOIN department d ON h.department_id = d.id
        LEFT JOIN status s ON h.status_id = s.id
        LEFT JOIN working_mode wm ON h.mode_id = wm.id
        LEFT JOIN emp_type et ON h.emp_type_id = et.id
        ${whereClause}
        ORDER BY h.id DESC
    `;

    return { sqlQuery, queryParams };
};

module.exports = {
    buildEmployeeQuery
};



