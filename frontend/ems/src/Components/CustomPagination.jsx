// import React from "react";
// import { Pagination, Form } from "react-bootstrap";

// const CustomPagination = ({
//   pageSize = 10,
//   currentPage = 1,
//   totalCount = 0,
//   onPageChange = () => {},
//   onPageSizeChange = () => {},
// }) => {
//   const totalPages = Math.ceil(totalCount / pageSize) || 1;

//   // 🧠 Generate visible page numbers smartly
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5; // किती पेज दिसणार (middle part)
//     let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisible - 1);

//     if (endPage - startPage < maxVisible - 1) {
//       startPage = Math.max(1, endPage - maxVisible + 1);
//     }

//     // सुरुवातीला "1" आणि dots दाखवायचं का ते ठरवा
//     if (startPage > 1) {
//       pages.push(1);
//       if (startPage > 2) pages.push("...");
//     }

//     // मुख्य पेज रेंज
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     // शेवटी "..." आणि शेवटचं पेज दाखवायचं का ते ठरवा
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) pages.push("...");
//       pages.push(totalPages);
//     }

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   return (
//     <div className="pagination-wrap mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
//       {/* Left info */}
//       <div className="text-muted small">
//         Showing {(currentPage - 1) * pageSize + 1} to{" "}
//         {Math.min(currentPage * pageSize, totalCount)} of {totalCount} employees
//       </div>

//       {/* Right controls */}
//       <div className="d-flex align-items-center gap-2">
//         <span className="small">Show:</span>
//         <Form.Select
//           size="sm"
//           value={pageSize}
//           onChange={(e) => onPageSizeChange(Number(e.target.value))}
//           style={{ width: "80px" }}
//         >
//           {[5, 10, 15, 20, 50, 100].map((size) => (
//             <option key={size} value={size}>
//               {size}
//             </option>
//           ))}
//         </Form.Select>

//         <Pagination size="sm" className="mb-0">
//           {/* Prev Button */}
//           <Pagination.Prev
//             disabled={currentPage === 1}
//             onClick={() => onPageChange(currentPage - 1)}
//           />

//           {/* Dynamic Page Numbers */}
//           {pageNumbers.map((page, index) =>
//             page === "..." ? (
//               <Pagination.Ellipsis key={`dots-${index}`} disabled />
//             ) : (
//               <Pagination.Item
//                 key={page}
//                 active={page === currentPage}
//                 onClick={() => onPageChange(page)}
//               >
//                 {page}
//               </Pagination.Item>
//             )
//           )}

//           {/* Next Button */}
//           <Pagination.Next
//             disabled={currentPage === totalPages}
//             onClick={() => onPageChange(currentPage + 1)}
//           />
//         </Pagination>
//       </div>
//     </div>
//   );
// };

// export default CustomPagination;


import React from "react";
import { Pagination, Form } from "react-bootstrap";

const CustomPagination = ({
  pageSize = 10,
  currentPage = 1,
  totalCount = 0,
  onPageChange = () => {},
  onPageSizeChange = () => {}, // Home.jsx मधून हे prop येते
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // 🧠 Generate visible page numbers smartly
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; 
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    // सुरुवातीला "1" आणि dots दाखवायचं का ते ठरवा
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    // मुख्य पेज रेंज
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // शेवटी "..." आणि शेवटचं पेज दाखवायचं का ते ठरवा
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-wrap mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
      {/* Left info */}
      <div className="text-muted small">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, totalCount)} of {totalCount} employees
      </div>

      {/* Right controls */}
      <div className="d-flex align-items-center gap-2">
        <span className="small">Show:</span>
        <Form.Select
          size="sm"
          value={pageSize}
          // हे Home.jsx मधील handlePageSizeChange ला कॉल करेल
          onChange={(e) => onPageSizeChange(Number(e.target.value))} 
          style={{ width: "80px" }}
        >
            {/* ⭐ CHANGE 1: नवीन page size पर्याय जोडणे */}
          {[5, 10, 15, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Form.Select>

        <Pagination size="sm" className="mb-0">
          {/* Prev Button */}
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />

          {/* Dynamic Page Numbers */}
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <Pagination.Ellipsis key={`dots-${index}`} disabled />
            ) : (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Pagination.Item>
            )
          )}

          {/* Next Button */}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
};

export default CustomPagination;
