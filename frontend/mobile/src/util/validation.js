import { checkIdDuplication } from "@/api/userApi";
function SignUpValidationUserInfo({ name, birth, gender, phoneNumber }) {
  const errors = {};
  if (!name) {
    errors.name = "이름을 입력해주세요.";
  } else if (!/^[가-힣]{1,20}$/.test(name)) {
    errors.name = "한글 최대 20자로 입력해주세요.";
  }

  if (!birth) {
    errors.birth = "생년월일을 설정해주세요.";
  }
  // if (!gender) {
  //   errors.gender = "성별을 선택해주세요.";
  // }
  if (!phoneNumber) {
    errors.phoneNumber = "전화번호를 입력해주세요.";
  } else if (!/^01(0|1|[6-9])[0-9]{3,4}[0-9]{4}$/.test(phoneNumber)) {
    errors.phoneNumber = "유효한 전화 번호를 입력해주세요.";
  }

  return errors;
}
function SignUpValidationLoginInfo({ id, password, confirmPassword }) {
  const errors = {};
  let isCheck = false;
  if (!id) {
    errors.id = "아이디를 입력해주세요.";
    isCheck = true;
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(id)) {
    isCheck = true;
    errors.id = "아이디는5~20 자 이내 영문과 숫자 조합이어야합니다";
  } else if (!isCheck) {
    //TODO - 아이디 중복체크 api 연결
    checkIdDuplication(
      { memberId: id },
      ({ data }) => {
        if (!data.result) {
          errors.id = "중복된 아이디입니다.";
        }
        isCheck = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  if (!password) {
    errors.password = "비밀번호가 입력되지 않았습니다.";
  } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/.test(password)) {
    errors.password =
      ": 8~20 자 이내 1개 이상의 영문과 1개 이상의 숫자로 조합.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "비밀번호가 입력되지 않았습니다.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "비밀번호와  일치하지 않습니다.";
  }

  return errors;
}
export { SignUpValidationUserInfo, SignUpValidationLoginInfo };
