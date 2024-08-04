import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import Swal from "sweetalert2";

import { Header, TabBar } from "@components/common";
import { Grid, Button, Text, Input } from "@components/elements";
import {
  getEmergencycontacts,
  registerEmergencycontact,
  updateEmergencycontact,
  deleteEmergencycontact,
} from "@api/emergencycontactApi";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import EmergencyContactInput from "@components/input/EmergencyContactInput";
const EmergencycontactsPage = () => {
  const {
    emergencyContactList,
    setEmergencyContactList,
    addEmergencyContact,
    deleteEmergencyContact,
  } = useUserStore();
  const { clearAllInputs } = useFormInputStore();
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(true);

  const onClickShowModal = (contactItem) => {
    Swal.fire({
      // title: `<h5> 적어주세요</h5>`,
      html: '<div id="swal-react-container"></div>',
      didOpen: () => {
        const container = document.getElementById("swal-react-container");
        const root = createRoot(container);
        root.render(
          <EmergencyContactInput
            $onChange={Swal.resetValidationMessage}
            $prev={contactItem}
          />
        );
      },
      preConfirm: () => {
        const relationnputValue = document.querySelector(
          "#swal-react-container input[name='relation']"
        ).value;
        const phoneNumberInputValue = document.querySelector(
          "#swal-react-container input[name='phoneNumber']"
        ).value;
        if (emergencyContactList) {
          const existsInInputs = emergencyContactList.some(
            (item) =>
              (item.emergency_contact_id !== contactItem.emergency_contact_id &&
                item.relation === relationnputValue) ||
              item.phoneNumber === phoneNumberInputValue
          );
          if (existsInInputs) {
            Swal.showValidationMessage("중복된 연락처가 있습니다.");
            return false;
          }
        }

        // 추가 처리 로직
        const newItem = {
          relation: relationnputValue,
          phoneNumber: phoneNumberInputValue,
        };
        newItem.emergency_contact_id =
          contactItem && contactItem.emergency_contact_id;

        return relationnputValue && phoneNumberInputValue
          ? Promise.resolve(newItem)
          : Promise.reject("입력해 주세요.");
      },
      width: "30em",
      confirmButtonText: "저장하기",
      confirmButtonColor: "var(--main-orange-color)",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(result.value);
        result.value.emergency_contact_id
          ? updateEmergencycontact(
              result.value.emergency_contact_id,
              result.value,
              (response) => {
                if (response.status === 200) {
                  Swal.fire("수정되었습니다");

                  deleteEmergencyContact(result.value.emergency_contact_id);
                  addEmergencyContact(result.value);
                  clearAllInputs();
                }
              },
              (error) => {
                console.log(error);
              }
            )
          : registerEmergencycontact(
              result.value,
              (response) => {
                if (response.status === 200) {
                  Swal.fire("등록되었습니다");
                  addEmergencyContact(result.value);
                  clearAllInputs();
                }
              },
              (error) => {
                console.log(error);
              }
            );
        setShowButton(false);
      }
    });
  };

  const onClickDeleteBtn = (contact) => {
    Swal.fire({
      title: `${contact.relation} 연락처를 삭제하시겠습니까?`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#FF4C4C",
      confirmButtonText: "취소",
      cancelButtonText: "삭제하기",
    }).then((result) => {
      if (result.isDismissed) {
        deleteEmergencycontact(
          contact.emergency_contact_id,
          (response) => {
            if (response.status === 200) {
              Swal.fire("삭제되었습니다");
              deleteEmergencyContact(contact.emergency_contact_id);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  };
  const btnStyles = {
    _onClick: onClickShowModal,
    children: "등록하기 >",
    $radius: "8px",
    $bg: {
      default: "var(--orange-op50-color)",
      hover: "var(--main-orange-color)",
    },
    $color: {
      default: "var(--white-color-200)",
    },
    $padding: "1rem 2rem",
    $size: "24px",
    $bold: true,
    $padding: "14px 32px",
    $width: "",
    $height: "10vh",
  };
  useEffect(() => {
    //TODO - api 연결
    // getEmergencycontacts(
    //   (response) => {
    //     if (response.status === 200) {
    //       setEmergencyContactList(response.data.contactList);
    //       response.data.contactList &&
    //         response.data.contactList.length > 0 &&
    //         setShowButton(false);
    //     }
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    setShowButton(false);
    setEmergencyContactList([
      {
        emergency_contact_id: 1,
        phoneNumber: "010-1010-1010",
        relation: "MOM",
      },
      {
        emergency_contact_id: 5,
        phoneNumber: "010-1010-1010",
        relation: "MOM",
      },
    ]);
  }, []);
  return (
    <Container>
      <Header navText="비상 연락망" />

      <Content>
        {!showButton ? (
          <ContactList>
            <AddButton onClick={onClickShowModal}>추가 하기</AddButton>
            {emergencyContactList &&
              emergencyContactList.map((contact, index) => (
                <ContactCard key={index}>
                  <div>
                    <ContactName>{contact.relation}</ContactName>
                    <ContactPhone>{contact.phoneNumber}</ContactPhone>
                  </div>
                  <ButtonBox>
                    <Button
                      _onClick={() => {
                        onClickShowModal(contact);
                      }}
                      children="수정하기"
                      $padding=""
                      $border="1px solid  var(--orange-color-200)"
                    />

                    <Button
                      _onClick={() => {
                        onClickDeleteBtn(contact);
                      }}
                      children="삭제하기"
                      $padding=""
                      $border="1px solid  var(--orange-color-200)"
                    />
                  </ButtonBox>
                </ContactCard>
              ))}
          </ContactList>
        ) : (
          <>
            <Button {...btnStyles} />
          </>
        )}
      </Content>
      <TabBar />
    </Container>
  );
};

export default EmergencycontactsPage;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;
const Content = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: auto;
  height: 83vh;
`;

const AddButton = styled.button`
  background-color: var(--orange-color-200);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
`;

const ContactList = styled.div`
  flex: 1;
  padding: 10px;
  width: -webkit-fill-available;
`;

const ContactCard = styled.div`
  position: relative;
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ContactName = styled.p`
  font-size: 16px;
  margin: 0;
`;

const ContactPhone = styled.p`
  font-size: 14px;
  color: gray;
  margin: 5px 0 0 0;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 01em;
`;
