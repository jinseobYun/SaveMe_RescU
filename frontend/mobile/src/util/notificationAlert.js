import Swal from "sweetalert2";

export const errorAlert = (errorMsg) => {
  const message = errorMsg.split(".");
  Swal.fire({
    title: "Error!",
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
  confirmFuc,

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
