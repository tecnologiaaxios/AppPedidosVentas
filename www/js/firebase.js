  const db = firebase.database();

  //inicia sesion en firebase
  function login() {
    var email = $('#email').val();
    var contrasena = $('#contrasena').val();

    if(email.length > 0 && contrasena.length > 0) {
      firebase.auth().signInWithEmailAndPassword(email, contrasena)
      .then(function() { //en caso de exito se obtiene el usuario
        getUser();
      })
      .catch(function(error) {
        console.log(error); //en caso de error lo imprime en consola

        if(error.code === 'auth/user-not-found') { //imprime un error si tu usuario es equivocado
          $('#email').parent().addClass('has-error');
          $('#helpblockEmail').empty().html("El usuario es incorrecto").show();
        }
        if(error.code === 'auth/wrong-password') { //imprime un error si te equivocaste en la contraseña
          $('#contrasena').parent().addClass('has-error');
          $('#helpblockContraseña').empty().html("La contraseña es incorrecta").show();
        }
      });
    }
    else {
      if(email == "") {
        $('#email').parent().addClass('has-error');
        $('#helpblockEmail').show();
      }
      else {
        $('#email').parent().removeClass('has-error');
        $('#helpblockEmail').hide();
      }
      if(contrasena == "") {
        $('#contrasena').parent().addClass('has-error');
        $('#helpblockContraseña').show();
      }
      else {
        $('#contrasena').parent().removeClass('has-error');
        $('#helpblockContraseña').hide();
      }
    }
  }

  //Si hay sesion
  function getUser() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var user = firebase.auth().currentUser;
        var uid = user.uid;

        db.ref('usuarios/' + uid).on('value', function(snap) {
          let usuario = snap.val();
          var privilegio = usuario.puesto;

          if(privilegio == 'Administrador') {
            $(location).attr("href", "admin.html");
          }
          if(privilegio == 'Usuario') {
            $(location).attr("href", "usuario.html");
          }
        });
      }
    });
  }

  getUser();

  //cierra la sesión de firebase
  function logOut() {
    firebase.auth().signOut();
  }
