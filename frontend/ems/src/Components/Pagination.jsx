// import React from 'react'
// import { Pagination as BTPagination } from 'react-bootstrap';

// const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
//     const pageNumbers = [];
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//     }
//   return (
//     <BTPagination className="justify-content-center mt-3">
//             <BTPagination.Prev
//                 onClick={() => paginate(currentPage - 1)}
//                 disabled={currentPage === 1}
//             />
//             {pageNumbers.map(number => (
//                 <BTPagination.Item
//                     key={number}
//                     active={number === currentPage}
//                     onClick={() => paginate(number)}
//                 >
//                     {number}
//                 </BTPagination.Item>
//             ))}
//             <BTPagination.Next
//                 onClick={() => paginate(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//             />
//         </BTPagination>
//   )
// }

// export default Pagination


import React from 'react'
import { Pagination as BTPagination } from 'react-bootstrap';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    
    // Total pages calculate karne ke liye zaroori
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <BTPagination className="justify-content-center mt-3">
            
            {/* 1. PREV Button (Ab 'children' prop use kiya gaya hai) */}
            <BTPagination.Prev
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {/* Ab yahan 'Prev' text aayega arrow ki jagah */}
                Prev 
            </BTPagination.Prev>
            
            {/* Yahan koi page numbers nahi hain, sirf buttons hain */}
            
            {/* 2. NEXT Button (Ab 'children' prop use kiya gaya hai) */}
            <BTPagination.Next
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {/* Ab yahan 'Next' text aayega arrow ki jagah */}
                Next
            </BTPagination.Next>
            
        </BTPagination>
    )
}

export default Pagination
