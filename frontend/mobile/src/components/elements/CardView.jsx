import React, { useEffect, useState } from "react";
import { Text, Image } from "@components/element";
import { topicsJson } from "@/assets/json/firstAid";
import { aidTopicsJson } from "@/assets/json/firstAid.js";

const CardView = ({ name, idx }) => {
  return (
    <GroupBox>
      <Image src={topicsJson[idx].imgUrl} width="50px" height="45px" contain />

      <TextBox>
        <Text size="15px" $title>
          {aid.name}
        </Text>
      </TextBox>
    </GroupBox>
  );
};

export default CardView;

const GroupBox = styled.div`
  max-width: 220px;
  min-width: 220px;
  overflow: hidden;
  background-color: rgb(255, 255, 255, 0.4);
  border-radius: 10px;
  box-shadow: 0px 1px 8px #dfdbdb;
  text-align: center;
  align-items: center;
  min-height: 130px;
  max-height: 130px;
  padding: 10px 20px;
  box-sizing: border-box;
  font-size: 17px;
  display: flex;
  justify-content: space-between;
  margin: 0 10px 0 0;
  @media all and (max-width: 767px) {
    min-height: 20%;
    height: 130px;
  }
  text-decoration: none;
  color: black;
`;

const TextBox = styled.div`
  min-width: 80px;
  box-sizing: border-box;
  padding: 0 5px 0 0;
`;
