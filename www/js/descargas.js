$(document).ready(function {

  var db = firebase.database().ref('descargas/');

  var guardarDescarga = function() {
    var email = $("#email").val();
    var datosDescarga = {
      name: $("#nombre").val(),
      apellido: $("#apellido").val(),
      email: email,
      telefono: $("#telefono").val(),
      empresa: $("#empresa").val(),
      puesto: $("#puesto").val(),
      buscando: $("#buscando").val()
    }

    db.push().set(datosDescarga)
  }

  $("#btnDescargar").click(guardarDescarga);




});
