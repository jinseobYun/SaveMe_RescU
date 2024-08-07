import Swal from "sweetalert2";

export const errorAlert = (errorMsg) => {
  const message = errorMsg.split(".");
  Swal.fire({
    title: "Error!",
    text: message[0],
    confirmButtonText: "Okay",
    confirmButtonColor: "#FFCC70",
  });
};
