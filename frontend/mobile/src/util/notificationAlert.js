import Swal from "sweetalert2";

export const errorAlert = (errorMsg) => {
  Swal.fire({
    title: 'Error!',
    text: errorMsg,
    confirmButtonText: 'Okay'
  })
}
