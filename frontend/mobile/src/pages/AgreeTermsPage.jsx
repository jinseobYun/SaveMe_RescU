import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { Header } from "@components/common";
import useFormInputStore from "@/store/useFormInputStore";

import {
  Grid,
  Button,
  Text,
  Input,
  NextPageButton,
} from "@components/elements";
import useForm from "@/hooks/useForm";
import { registerUser } from "@/api/userApi";
const AgreeTermsPage = () => {
  const navigate = useNavigate();

  const [isVerify, setIsVerify] = useState(false);
  const { updateInputs, inputs, clearInputs } = useFormInputStore();
  const onClickBtn = () => {
    Swal.fire({
      text: "가입이 완료되었습니다!",
      confirmButtonColor: "var(--orange-color-100)",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/", { replace: true });
      }
    });
    //TODO - 회원가입 api 연결
    // registerUser(
    //   {inputs},
    //   ({ data }) => {
    // clearInputs();
    //     if (data.status === "200") {
    //       Swal.fire({
    //         text: "가입이 완료되었습니다!",
    //         confirmButtonColor: "var(--orange-color-100)"",
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           <Navigate to="/" replace={true} />;
    //         }
    //       });
    //     }
    //   },
    //   (error) => {}
    // );
  };
  const [allCheck, setAllCheck] = useState(false);
  const [gpsCheck, setGpsCheck] = useState(false);
  const [useCheck, setUseCheck] = useState(false);

  const allBtnEvent = () => {
    if (allCheck === false) {
      setAllCheck(true);
      setGpsCheck(true);
      setUseCheck(true);
    } else {
      setAllCheck(false);
      setGpsCheck(false);
      setUseCheck(false);
    }
  };

  const onClickGpsBtn = () => {
    if (gpsCheck === false) {
      setGpsCheck(true);
    } else {
      setGpsCheck(false);
    }
  };

  const onClicInfoUseBtn = () => {
    if (useCheck === false) {
      setUseCheck(true);
    } else {
      setUseCheck(false);
    }
  };

  useEffect(() => {
    if (gpsCheck === true && useCheck === true) {
      setAllCheck(true);
      setIsVerify(true);
    } else {
      setAllCheck(false);
      setIsVerify(false);
    }
  }, [gpsCheck, useCheck]);

  return (
    <>
      <Header navText="이용 약관 동의" />
      <form>
        <div>
          <div>
            <div>
              <input
                type="checkbox"
                id="all-check"
                checked={allCheck}
                onChange={allBtnEvent}
              />
              <label for="all-check">전체동의</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="check1"
                checked={gpsCheck}
                onChange={onClickGpsBtn}
              />
              <label for="check1">
                위치기반서비스 이용 <span>(필수)</span>
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="check2"
                checked={useCheck}
                onChange={onClicInfoUseBtn}
              />
              <label for="check2">
                개인정보 수집 밎 이용 <span>(필수)</span>
              </label>
            </div>
          </div>
        </div>
      </form>
      <NextPageButton
        isError={!isVerify}
        text="동의 후 시작하기"
        handleClick={onClickBtn}
      />
    </>
  );
};

export default AgreeTermsPage;
