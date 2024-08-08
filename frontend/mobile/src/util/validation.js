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
  if (!gender) {
    errors.gender = "성별을 선택해주세요.";
  }
  if (!phoneNumber) {
    errors.phoneNumber = "전화번호를 입력해주세요.";
  } else if (!/^01(0|1|[6-9])[0-9]{4}[0-9]{4}$/.test(phoneNumber)) {
    errors.phoneNumber = "유효한 전화 번호를 입력해주세요.";
  }

  return errors;
}
let previd;
function SignUpValidationLoginInfo({ id, password, passwordConfirm }) {
  const errors = {};
  if (!id) {
    errors.id = "아이디를 입력해주세요.";
  } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(id)) {
    errors.id = "아이디는5~20 자 이내 영문과 숫자 조합이어야합니다";
  } else if (previd !== id) {
    checkIdDuplication(
      id,
      ({ data }) => {
        if (!data) {
          errors.id = "중복된 아이디입니다.";
        } else {
          previd = id;
        }
      },
      (error) => {
        console.log(error.toJSON());
      }
    );
  }

  if (!password) {
    errors.password = "비밀번호가 입력되지 않았습니다.";
  } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/.test(password)) {
    errors.password = "영대소문, 숫자를 포함한ss 8~20자를 입력해주세요.";
  }

  if (!passwordConfirm) {
    errors.passwordConfirm = "비밀번호가 입력되지 않았습니다.";
  } else if (passwordConfirm !== password) {
    errors.passwordConfirm = "비밀번호와  일치하지 않습니다.";
  }

  return errors;
}

function EmergencyContactValidation({ relation, phoneNumber }) {
  const errors = {};
  if (!relation) {
    errors.relation = "관계를 입력해주세요.";
  } else if (!/^[가-힣]+$/.test(relation)) {
    errors.relation = "한글 최대 20자로 입력해주세요.";
  }
  if (!phoneNumber) {
    errors.phoneNumber = "전화번호를 입력해주세요.";
  } else if (!/^01(0|1|[6-9])[0-9]{4}[0-9]{4}$/.test(phoneNumber)) {
    errors.phoneNumber = "유효한 전화 번호를 입력해주세요.";
  }
  return errors;
}

function ChangePwValidation({ newPassword, newPasswordConfirm }) {
  const errors = {};

  if (!newPassword) {
    errors.newPassword = "비밀번호가 입력되지 않았습니다.";
  } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/.test(newPassword)) {
    errors.newPassword = "영대소문, 숫자를 포함한 8~20자를 입력해주세요";
  }

  if (!newPasswordConfirm) {
    errors.newPasswordConfirm = "비밀번호가 입력되지 않았습니다.";
  } else if (newPasswordConfirm !== newPassword) {
    errors.newPasswordConfirm = "비밀번호와  일치하지 않습니다.";
  }

  return errors;
}

export {
  SignUpValidationUserInfo,
  SignUpValidationLoginInfo,
  EmergencyContactValidation,
  ChangePwValidation,
};
