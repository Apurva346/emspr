// middleware/employeeQueryBuilder.js

/**
 * Builds the SQL query and parameters for fetching/exporting employee data.
 * @param {string} searchTerm - The term to search for (name, id, manager, department, salary).
 * @param {string} statusFilter - The status to filter by ('Active', 'Inactive', 'All').
 * @param {string} [selectClause='*'] - The fields to select.
 * @returns {{sqlQuery: string, queryParams: Array<any>}} The query and its parameters.
 */
const buildEmployeeQuery = (searchTerm, statusFilter, selectClause) => {
    let whereClause = '';
    const queryParams = [];

    // 1. Status Filter
    if (statusFilter && statusFilter.toLowerCase() !== 'all') {
        whereClause += ' WHERE status = ?';
        queryParams.push(statusFilter);
    }

    // 2. Search Term
    if (searchTerm) {
        const condition = ` (CAST(id AS CHAR) LIKE ? OR name LIKE ? OR manager LIKE ? OR department LIKE ? OR CAST(salary AS CHAR) LIKE ?)`;
        whereClause += whereClause ? ` AND ${condition}` : ` WHERE ${condition}`;
        const term = `%${searchTerm}%`; // NOTE: Changed to %searchTerm% for better search
        queryParams.push(term, term, term, term, term);
    }

    const finalSelect = selectClause || '*';
    const sqlQuery = `SELECT ${finalSelect} FROM home ${whereClause}`;
    
    return { sqlQuery, queryParams };
};

module.exports = {
    buildEmployeeQuery
};


