import React, { useEffect, useState } from "react";
import styled from "styled-components";

import useUserStore from "@/store/useUserStore";
import { getPushNoti } from "@/api/pushNotiApi";
import { Header, TabBar } from "@components/common";
import { Grid, Button, Text, Input } from "@components/elements";
const PushNotiPage = () => {
  const { userName, userId } = useUserStore();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  const [notifications, setNotifications] = useState([
    {
      pushNotificationId: 1,
      title: "김싸피님에 대한 신고가 접수되었습니다",
      notificationTime: "2021.05.22",
      body: "김싸피님이 싸피싸핍 병원(으)로 이송될 예정입니다.",
    },
    {
      pushNotificationId: 2,
      title: "박싸피님에 대한 신고가 접수되었습니다",
      notificationTime: "2021.05.22",
      body: "박싸피님이 대전3반 병원(으)로 이송될 예정입니다.",
    },
    {
      pushNotificationId: 3,
      title: "이싸피님에 대한 신고가 접수되었습니다",
      notificationTime: "2021.05.22",
      body: "이싸피님이 5팀 병원(으)로 이송될 예정입니다.",
    },
  ]);

  useEffect(() => {
    getPushNoti(
      userId,
      (response) => {
        //FIXME - 더미 데이터 지우기
        // setNotifications(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  });
  return (
    <Container>
      <Header navText="보호자 알림" goTo="/menu" />
      <NotiBox>
        {notifications.length > 0 &&
          notifications.map((notification) => (
            <NotificationCard
              key={notification.pushNotificationId}
              onClick={() => toggleExpand(notification.pushNotificationId)}
            >
              <Title>
                {notification.title}
                <ToggleIcon>
                  {expandedId === notification.pushNotificationId ? "▲" : "▼"}
                </ToggleIcon>
              </Title>
              <DateText>{notification.notificationTime}</DateText>
              {expandedId === notification.pushNotificationId && (
                <BodyText>{notification.body}</BodyText>
              )}
            </NotificationCard>
          ))}
      </NotiBox>
      <TabBar />
    </Container>
  );
};

export default PushNotiPage;
const NotiBox = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const NotificationCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  padding: 15px;
  cursor: pointer;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: var(--orange-color-200);
  margin-bottom: 5px;

  // &::after {
  //   content: "•";
  //   margin-left: 5px;
  //   color: red;
  // }
`;

const DateText = styled.div`
  font-size: 12px;
  color: gray;
`;

const BodyText = styled.div`
  font-size: 14px;
  color: #333;
  margin-top: 10px;
  line-height: 1.4;
`;

const ToggleIcon = styled.span`
  margin-left: 10px;
  font-size: 20px;
`;
