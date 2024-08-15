import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AddIcon from "@mui/icons-material/Add";
import { Header, TabBar } from "@components/common";
import { Button, Text } from "@components/elements";
import {
  getEmergencycontacts,
  registerEmergencycontact,
  updateEmergencycontact,
  deleteEmergencycontact,
} from "@api/emergencycontactApi";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import EmergencyContactInput from "@components/input/EmergencyContactInput";
import { yesorNoAlert, toastAlert } from "@/util/notificationAlert";

const EmergencycontactsPage = () => {
  const emergencyContactList = useUserStore(
    (state) => state.emergencyContactList
  );
  const setEmergencyContactList = useUserStore(
    (state) => state.setEmergencyContactList
  );
  const addEmergencyContact = useUserStore(
    (state) => state.addEmergencyContact
  );
  const deleteEmergencyContact = useUserStore(
    (state) => state.deleteEmergencyContact
  );
  const { clearAllInputs } = useFormInputStore();
  const navigate = useNavigate();

  const [showButton, setShowButton] = useState(false);

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
        const relationInputValue = document.querySelector(
          "#swal-react-container input[name='relation']"
        ).value;
        const phoneNumberInputValue = document.querySelector(
          "#swal-react-container input[name='phoneNumber']"
        ).value;
        if (emergencyContactList && contactItem) {
          const existsInInputs = emergencyContactList.some((item) => {
            return (
              item.emergencyContactId !== contactItem.emergencyContactId &&
              (item.relation === relationInputValue ||
                item.phoneNumber === phoneNumberInputValue)
            );
          });
          if (existsInInputs) {
            Swal.showValidationMessage("중복된 연락처가 있습니다.");
            return false;
          }
        }

        // 추가 처리 로직
        const newItem = {
          relation: relationInputValue,
          phoneNumber: phoneNumberInputValue,
        };
        newItem.emergencyContactId =
          contactItem && contactItem.emergencyContactId;

        return relationInputValue && phoneNumberInputValue
          ? Promise.resolve(newItem)
          : Promise.reject("입력해 주세요.");
      },
      width: "30em",
      confirmButtonText: "저장하기",
      confirmButtonColor: "#FFCC70",
    }).then((result) => {
      if (result.isConfirmed) {
        result.value.emergencyContactId
          ? (result.value.relation !== contactItem.relation ||
              result.value.phoneNumber !== contactItem.phoneNumber) &&
            updateEmergencycontact(
              result.value.emergencyContactId,
              result.value,
              (response) => {
                if (response.status === 200) {
                  toastAlert("수정되었습니다!");

                  deleteEmergencyContact(result.value.emergencyContactId);
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
                if (response.status === 201) {
                  toastAlert("등록되었습니다!");

                  console.log(response.data);
                  let newContact = result.value;
                  newContact.emergencyContactId =
                    response.data.emergencyContactId;
                  addEmergencyContact(newContact);
                  console.log(newContact);
                  clearAllInputs();
                }
              },
              (error) => {
                console.log(error);
                // errorAlert(error.response.data);
              }
            );
        setShowButton(false);
      }
    });
  };

  const onClickDeleteBtn = (contact) => {
    yesorNoAlert(
      `${contact.relation} 연락처를 삭제하시겠습니까?`,
      "취소",
      "삭제하기",
      (result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          deleteEmergencycontact(
            contact.emergencyContactId,
            (response) => {
              if (response.status === 200) {
                toastAlert("삭제되었습니다!");
                deleteEmergencyContact(contact.emergencyContactId);
                if (emergencyContactList.length === 0) setShowButton(true);
              }
            },
            (error) => {
              // console.log(error.toJSON());
              // errorAlert(error.response.data);
            }
          );
        }
      }
    );
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
    // $padding: "14px 32px",
    $width: "",
    $height: "10vh",
    $margin: "20rem 0 0 0",
  };
  useEffect(() => {
    getEmergencycontacts(
      (response) => {
        if (response.status === 200) {
          if (typeof response.data != "string") {
            setEmergencyContactList(response.data);
            setShowButton(false);
          } else {
            setEmergencyContactList([]);
            setShowButton(true);
          }
        }
      },
      (error) => {
        // console.log(error.toJSON());
        // errorAlert(error.response.data);
      }
    );
  }, []);
  return (
    <Container>
      <Header navText="비상 연락망" goTo="/menu" />

      <Content>
        {!showButton ? (
          <ContactList>
            <AddBtnDiv>
              <Button
                _onClick={onClickShowModal}
                $width="40px"
                $height="40px"
                $bg={{
                  default: "var(--orange-color-200)",
                }}
                $color={{ default: "var(--white-color-100)" }}
                children={<AddIcon />}
                $padding=""
                $border="1px solid  var(--orange-color-200)"
                $radius="50%"
              />
            </AddBtnDiv>
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
                      children="수정"
                      $padding=""
                      $border="1px solid  var(--orange-color-200)"
                      $radius="10px"
                    />

                    <Button
                      _onClick={() => {
                        onClickDeleteBtn(contact);
                      }}
                      children="삭제"
                      $padding=""
                      $border="1px solid  var(--orange-color-200)"
                      $radius="10px"
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
const AddBtnDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-right: 5rem;
  margin-bottom: 2rem;
`;

const Content = styled.div`
  flex-direction: column;
  display: flex;
  align-items: center;
  overflow: auto;
  height: 82vh;
`;

const ContactList = styled.div`
  flex: 1;
  padding: 10px;
  width: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
`;

const ContactCard = styled.div`
  width: 80%;
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
  gap: 1em;
`;
