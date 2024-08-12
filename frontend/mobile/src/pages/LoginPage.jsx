import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import base64 from "base-64";
import utf8 from "utf8";
import { Grid, Button, Text, Input } from "@components/elements";
import { Header } from "@components/common";
import useForm from "@/hooks/useForm";
import { loginApi } from "@/api/userApi";
import useUserStore from "@/store/useUserStore";
import useFormInputStore from "@/store/useFormInputStore";
import { errorAlert } from "@/util/notificationAlert";

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken, setReFreshToken, login, setUserId, setUserName } =
    useUserStore();
  const { clearInputs } = useFormInputStore();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: { id: "", password: "" },
    onSubmit: (values) => {
      loginApi(
        values.id,
        values.password,
        deviceToken,
        (response) => {
          if (response.status === 200) {
            setAccessToken(response.data.accessToken);
            setReFreshToken(response.data.refreshToken);
            setUserId(values.id);
            login();
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            let payload = response.data.accessToken.substring(
              response.data.accessToken.indexOf(".") + 1,
              response.data.accessToken.lastIndexOf(".")
            );
            let dec = base64.decode(payload);
            let decUtf8 = utf8.decode(dec);
            let decJson = JSON.parse(decUtf8);
            console.log("dec: " + dec);
            console.log(decUtf8);
            console.log(decJson);
            setUserName(decJson.memberName);
            clearInputs();
            navigate("/");
          }
        },
        (error) => {
          console.log(error);
          errorAlert(error.response.data);
        }
      );
    },
    validate: null,
  });
  const [deviceToken, setDeviceToken] = useState();
  useEffect(() => {
    //FIXME - 주석해체
    const deviceToken = window.AndroidInterface.getDeviceToken();
    console.log("deviceToken: " + deviceToken);
    setDeviceToken(deviceToken);
  }, []);
  return (
    <Container>
      <Header navText="로그인" />
      <Grid
        $display="flex"
        $width="100vw"
        $height="580px"
        $padding="100px 4px"
        $flex_direction="column"
        $align_items="center"
      >
        <StyledForm onSubmit={handleSubmit} noValidate>
          <Input
            $name="id"
            $placeholder="아이디"
            $value={values.id}
            _onChange={handleChange}
            $label="아이디*"
            $haveToCheckValid={false}
          />
          <Input
            $name="password"
            $placeholder="비밀번호"
            $value={values.password}
            _onChange={handleChange}
            $label="비밀번호*"
            $haveToCheckValid={false}
            $type="password"
          />
          <Button
            $display="flex"
            $width="200px"
            $height="48px"
            $padding="8px 12px"
            $margin="2rem 0"
            $justify-content="center"
            $align-items="center"
            $bg={{ default: "var(--main-orange-color)" }}
            $color={{ default: "var(--white-color-100)" }}
            children="로그인"
          />
          <TextBox>
            <Text children="계정이 없으신가요? " />
            <Link to="/signup/userinfo">
              <Text children="회원가입" $color="var(--main-orange-color)" />
            </Link>
          </TextBox>
          <TextBox>
            <Link to="/findid">
              <Text children="아이디 찾기" $color="var(--gray-color-200)" />
            </Link>
            <Text children="|" $color="var(--gray-color-200)" />

            <Link to="/findpassword">
              <Text children="비밀번호 찾기" $color="var(--gray-color-200)" />
            </Link>
          </TextBox>
        </StyledForm>
      </Grid>
    </Container>
  );
};

export default Login;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`;

const TextBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin: 1rem;
`;
