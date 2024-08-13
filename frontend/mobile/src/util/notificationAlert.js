import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const errorAlert = (errorMsg, title) => {
  const message = errorMsg.split(".");
  Swal.fire({
    title: title || "Error!",
    text: message[0],
    confirmButtonText: "확인",
    confirmButtonColor: "#FFCC70",
  });
};
export const successAlert = (successMsg, didCloseFuc, confirmFuc) => {
  Swal.fire({
    text: successMsg,
    confirmButtonText: "확인",
    confirmButtonColor: "#FFCC70",
    didClose: didCloseFuc,
  });
};

export const yesorNoAlert = (
  title,
  confirmButtonText,
  cancelButtonText,
  confirmFuc
) => {
  Swal.fire({
    title: title,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#FF4C4C",
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
  }).then(confirmFuc);
};

export const confirmAlert = (title, confirmButtonText, confirmFuc) => {
  Swal.fire({
    title: title,
    showCancelButton: true,
    confirmButtonText: `<span style="color: #2C2C2E;">취소</span>`,
    cancelButtonText: confirmButtonText,
    confirmButtonColor: "#FFFCE3",
    cancelButtonColor: "#FFCC70",
  }).then(confirmFuc);
};
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  width: "30%",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const toastAlert = (isSuccess, title, width) => {
  Toast.fire({
    icon: isSuccess ? "success" : "error",
    title: title,
    width: width || "20em",
  });
};
