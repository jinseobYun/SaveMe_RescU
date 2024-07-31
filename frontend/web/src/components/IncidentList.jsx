import React from "react";
import ListItem from "./IncidentListItem";

// 필터 되기 이전 데이터 가져오기
// const IncidentList = ({ data, filter }) => {
//   const filteredData = data.filter(filter);

//   return (
//     <div className="incident-list">
//       {filteredData.map((item) => (
//         <ListItem key={item.emergencyId} item={item} />
//       ))}
//     </div>
//   );
// };

// 필터된 데이터를 받아오기
const IncidentList = ({ data }) => {
  // const filteredData = data;

  return (
    <div className="incident-list">
      {data.map((item) => (
        <ListItem key={item.emergencyId} item={item} />
      ))}
    </div>
  );
};

export default IncidentList;
