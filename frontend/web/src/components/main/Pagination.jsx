import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalItems, onPageChange, itemsPerPage }) => {
  // 유효성 검증: itemsPerPage가 0이거나, totalItems가 undefined일 경우를 대비
  if (!totalItems || itemsPerPage <= 0) {
    return null; // 잘못된 경우에 컴포넌트를 렌더링하지 않음
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 0) {
    return null; // 페이지 수가 0 이하인 경우에도 컴포넌트를 렌더링하지 않음
  }

  const handleClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button className="page-btn"
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button id="page-num"
          key={index}
          onClick={() => handleClick(index + 1)}
          className={currentPage === index + 1 ? "active" : ""}
        >
          {index + 1}
        </button>
      ))}
      <button className="page-btn"
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
