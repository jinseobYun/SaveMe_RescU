function SignUpValidation({ name, birth, gender, phoneNumber, id, password, confirmPassword }) {
  const errors = {};

  if (!name) {
    errors.name = "이름을 입력해주세요.";
  }
  if (!birth) {
    errors.birth = "생년월일을 설정해주세요.";
  }

  if (!gender) {
    errors.gender = "성별을 선택해주세요.";
  }
  if (!phoneNumber) {
    errors.phoneNumber = "전화번호를 입력해주세요.";
  }
  if (!/^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/.test(phoneNumber)) {
    errors.phoneNumber = "입력된 전화번호가 유효하지 않습니다.";
  }

  if (!id) {
    errors.id = "아이디를 입력해주세요.";
  } else if (!/^[가-힣]{5,20}$/.test(id)) {
    errors.id = "입력된 아이디가 유효하지 않습니다.";
  } else {
    //TODO - 아이디 중복체크 api 넣기
  }

  if (!password) {
    errors.password = "비밀번호가 입력되지 않았습니다.";
  } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/.test(password)) {
    errors.password = "입력된 비밀번호가 유효하지 않습니다.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "비밀번호가 입력되지 않았습니다.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
  }

  return errors;
}

export { SignUpValidation };
