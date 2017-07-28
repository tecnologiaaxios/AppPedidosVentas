// FirebaseUI config.
var uiConfig = {
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

var name;
var foto;

var getUser = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      console.log('inició sesion');
      console.log(user);
      name=user.displayName;
      foto=user.photoURL;
      $('#authentication').hide();
      $('#enviar-coment').show();
      $('#cont-coment').show();
      $('#salir').show();
    }
    else {
      console.log('cerró sesion');

    }
  })
}
getUser();

var cerrarSesion = function() {
  firebase.auth().signOut().then(function() {
    console.log("ya cerramos la sesion");
    location.reload();
  }, function(error) {
    console.log("no cerramos la sesion");
  });
}
//var myUserId = firebase.auth().currentUser.uid;
  var db = firebase.database().ref('comentarios/');

  db.orderByChild("prioridad").startAt(2).on('value', function(snapshot){
  var comentarios = snapshot.val();
  $('#cont-coment').empty();
  var row = "";


  for(comentario in comentarios) {
    row += '<div class="comentario" id="' + comentario +'">' +
           '<img width="50" id="foto-live" src="'+ comentarios[comentario].avatar + '" alt="">' +
           '<p id="nombre-live" class="nombre">' + comentarios[comentario].nombre + '</p>' +
          // '<p class="hora">' + comentarios[comentario].hora + '</p>' +
           '<p style="200px" id="coment-live" class="mensaje">'+ comentarios[comentario].mensaje + '</p></div>'
  }
  $('#cont-coment').append(row);
  row="";
}, function(errorObject) {
  console.log("La lectura falló: " + errorObject.code);
})

var enviarComentario = function(user) {
  var datosComentario = {
    prioridad:999999999,
    avatar: foto,
    nombre: name,
    hora: (new Date).getTime(),
    mensaje: $('#mensaje').val()
  }

  db.push().set(datosComentario)
}
