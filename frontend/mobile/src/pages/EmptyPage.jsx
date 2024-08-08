import React from "react";
import img404 from "@/assets/img/404img.jpg";
const EmptyPage = () => {
  return (
    <div>
      <img src={img404} alt="" />
      존재하지 않는 페이지입니다
    </div>
  );
};

export default EmptyPage;
