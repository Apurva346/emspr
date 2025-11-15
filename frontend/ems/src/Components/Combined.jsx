import React from "react";
import Navbar from "./Navbar";
import StatusFilter from "./StatusFilter";

const Combined = ({
  currentStatus,
  onStatusChange,
  fetchEmployees,
  searchTerm,
  statusFilter,
  fetchEmployeesWithSearch
}) => {
  return (
    <div 
      className="d-flex justify-content-between align-items-center mb-3"
    >
      {/* LEFT SIDE → Status Filter */}
      <div>
        <StatusFilter
          currentStatus={currentStatus}
          onStatusChange={onStatusChange}
        />
      </div>

      {/* RIGHT SIDE → Navbar */}
      <div>
        <Navbar
          fetchEmployees={fetchEmployees}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          fetchEmployeesWithSearch={fetchEmployeesWithSearch}
        />
      </div>
    </div>
  );
};

export default Combined;
