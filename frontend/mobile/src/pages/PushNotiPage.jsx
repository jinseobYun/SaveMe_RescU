import React from "react";
import styled from "styled-components";

const PushNotiPage = () => {
  const notifications = [];

  return (
    <PageContainer>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id}>
          <Title>
            [{notification.type}] {notification.title}
          </Title>
          <DateText>{notification.date}</DateText>
        </NotificationCard>
      ))}
    </PageContainer>
  );
};

export default PushNotiPage;

const PageContainer = styled.div`
  width: 100%;
  padding: 20px;
  background-color: #f5f5f5;
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
  color: #007bff;
  margin-bottom: 5px;

  &::after {
    content: "•";
    margin-left: 5px;
    color: red;
  }
`;

const DateText = styled.div`
  font-size: 12px;
  color: gray;
`;
