import Swal from 'sweetalert2';

const customSwal = Swal.mixin({
  customClass: {
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
    htmlContainer: 'swal-text-custom',
    confirmButton: 'swal-confirm-button-custom',
    cancelButton: 'swal-cancel-button-custom',
  },
  buttonsStyling: false,
  background: '#121212', // Matches --eerie-black-2 / --smoky-black
  color: '#fcfcfc', // Matches --white-2
});

export default customSwal;
