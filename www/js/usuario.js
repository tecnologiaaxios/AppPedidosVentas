var usuarioLogeado;
var userID;

function obtenerUsuario(uid) {
  let usuario = firebase.database().ref('usuarios/'+uid);
  usuario.on('value', function(snapshot) {
    let usuarioactual = snapshot.val();
    usuarioLogeado = usuarioactual.nombre + " " + usuarioactual.apellidos;
    $('.nombreDeUsuario').html(usuarioLogeado);
    mostrarNotificaciones(usuarioLogeado)

    let storageRef = firebase.storage().ref(uid + '/fotoPerfil/');
    storageRef.getDownloadURL().then(function(url) {
      $('#imgPerfil').attr('src', url).show();;
      $('#imgPerfilModal').attr('src', url);
    });
  });
}

function haySesion() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var usuario = firebase.auth().currentUser;
      var uid = usuario.uid;
      userID = uid;

      obtenerUsuario(uid);
      $('[data-toggle="tooltip"]').tooltip();
    }
    else {
      $(location).attr("href", "index.html");
    }
  })
}

haySesion();

$('#notificaciones').on('click', function() {
  leerNotificaciones();
  haySesion();
});

function mostrarNotificaciones(usuarioLogeado) {
    let not = firebase.database().ref('notificaciones/'+usuarioLogeado+'/notificaciones');
    not.on('value', function(datosNotificacion) {
      let notis = datosNotificacion.val();
      let row = "";

      let arrNotificaciones = [];
      for(noti in notis) {
        arrNotificaciones.push(notis[noti]);
      }

      arrNotificaciones.reverse();
      for(let i=0; i<arrNotificaciones.length; i++){

        if(arrNotificaciones[i].leida == false) {
          row += '<div class="notification"><p id="pNoti">'+arrNotificaciones[i].mensaje+'</p><p id="horaNoti"><span class="glyphicon glyphicon-tasks"></span>Hace 3 minutos</p></div>';
        }
        else {
          row += '<div class="notification"><p id="pNoti">'+arrNotificaciones[i].mensaje+'</p><p id="horaNoti"><span class="glyphicon glyphicon-tasks"></span>Hace 3 minutos</p></div>';
        }
      }
      $('#notificaciones').attr('data-content', row);
      $('#notificaciones').popover({ content: row, html: true});
      row = "";
    });

    let rutanot = firebase.database().ref('notificaciones/'+usuarioLogeado);
    rutanot.on('value', function(datosNotUsuario) {
      let NotUsuario = datosNotUsuario.val();
      let cont = NotUsuario.cont;

      if(cont > 0) {
        $('#notificaciones').attr('style', 'font-size:20px; color: #74A6E9; margin-top:7px;');
        $('#spanNotificaciones').html(NotUsuario.cont).show();
      }
      else {
        $('#notificaciones').attr('style', 'font-size:20px; color: #CBCBCB; margin-top:7px;');
        $('#spanNotificaciones').hide();
      }
    });
}

function mostrarOrdenes() {
   $('#misOrdenes').show();
   let ordenes = firebase.database().ref('misOrdenes/'+usuarioLogeado);
    ordenes.on('value', function(snapshot) {
      let ordenes = snapshot.val();
      $('#tablaordenes tbody').empty();

      let i = 1;
      for (orden in ordenes) {

        if(ordenes[orden].asignado == usuarioLogeado) {
          var state;
          if(ordenes[orden].estado === "Pendiente"){
            state='<a class="dropdown-toggle" data-toggle="dropdown"><span style="background-color: #FF0000; width: 30px; height: 25px; border-radius: 15px;" class="badge"><span></a>';
          }
          if(ordenes[orden].estado === "En proceso"){
            state='<a class="dropdown-toggle" data-toggle="dropdown"><span style="background-color: #FFCC00; width: 30px; height: 25px;" border-radius: 15px; class="badge"><span></a>';
          }
          if(ordenes[orden].estado === "Listo"){
            state='<a class="dropdown-toggle" data-toggle="dropdown"><span style="background-color: #4CDD85; width: 30px; height: 25px;" border-radius: 15px; class="badge"><span></a>';
          }

          let tr = $('<tr/>');
          let td = '<td>' + i + '</td>' +
                    '<td>' + ordenes[orden].cliente + '</td>' +
                    '<td>' + ordenes[orden].descripcion + '</td>' +
                    '<td>' + ordenes[orden].fechaRecep + '</td>' +
                    '<td>' + ordenes[orden].fechaEntrega + '</td>';
          tr.append(td);
          let tdDrop = $('<td/>', {
            'class': 'dropdown'
          });
          tdDrop.append(state);
          let ul = $('<ul/>', {
            'class': 'dropdown-menu'
          });
          let li1 = $('<li/>');
          let a1 = $('<a/>', { 'onclick': 'marcarComoPendiente("'+orden+'")'});
          let span1 = $('<span/>', {
            'style': 'color: #FF0000;',
            'class': 'glyphicon glyphicon-exclamation-sign'
          });
          a1.append(span1).append(' Marcar como pendiente');
          li1.append(a1);

          let li2 = $('<li/>');
          let a2 = $('<a/>', { 'onclick': 'marcarComoEnProceso("'+orden+'")'});
          let span2 = $('<span/>', {
            'style': 'color: #FFCC00;',
            'class': 'glyphicon glyphicon-time'
          });
          a2.append(span2).append(' Marcar como en proceso');
          li2.append(a2);

          let li3 = $('<li/>');
          let a3 = $('<a/>', { 'onclick': 'marcarComoLista("'+orden+'")'});
          let span3 = $('<span/>', {
            'style': 'color: #4CDD85;',
            'class': 'glyphicon glyphicon-ok'
          });
          a3.append(span3).append(' Marcar como lista');
          li3.append(a3);

          let li4 = $('<li/>');
          let a4 = $('<a/>', { 'onclick': 'eliminarOrden("'+orden+'")'});
          let span4 = $('<span/>', {
            'class': 'icons glyphicon glyphicon-minus-sign'
          });
          a4.append(span4).append(' Eliminar orden');
          li4.append(a4);

          ul.append(li1).append(li2).append(li3).append(li4);

          tdDrop.append(ul);
          tr.append(tdDrop);
          tr.append('<td>' + ordenes[orden].encargado + '</td>');

          $('#tablaordenes tbody').append(tr);

          i++;
        }

        i = 1;
        state = "";
      }
    }, function(errorObject) {
      console.log("La lectura de las ordenes falló: " + errorObject.code);
    })
}

function misOrdenes() {
  $('#Semana').hide();
  mostrarOrdenes();
}

function leerNotificaciones() {
  let rutanot = firebase.database().ref('notificaciones/'+usuarioLogeado);
  rutanot.update({cont: 0});
}


function logOut() {
  firebase.auth().signOut();
}

function mostrarCategorias() {
  let categorias = firebase.database().ref('/categorias');
  categorias.on('value', function(snapshot) {
    let categorias = snapshot.val();

    let lis="";
    for(categoria in categorias) {
      lis += '<li style="display:inline; padding:20px;"><span style="color:'+categorias[categoria].color+';" class="glyphicon glyphicon-asterisk"></span>'+categorias[categoria].nombre+'</li>';
    }

    $('#listaCategorias').empty().append(lis);
  });
}

mostrarCategorias();

function completarTarea(idTarea, idProyecto, asignado, nombreTarea) {
  var idTareaEnNodoTareas, datos;

  let nodoTareas = firebase.database().ref('tareas/');
  nodoTareas.orderByChild("idTarea").equalTo(idTarea).on("child_added", function(snapshot) {
    idTareaEnNodoTareas = snapshot.key;

    let tareasRef = firebase.database().ref('tareas/'+idTareaEnNodoTareas);
    tareasRef.on('value', function(daticos) {
      let tareas = daticos.val();
      datos = {
        idP: tareas.idP,
        asignado: tareas.asignado
      }
      let refMiSemana = firebase.database().ref('miSemana/'+tareas.asignado);
      refMiSemana.orderByChild("idTarea").equalTo(idTarea).on("child_added", function(snapshot) {
        firebase.database().ref('miSemana/'+datos.asignado+'/'+snapshot.key).update({ estado: "Completada"});
      });
    });

    firebase.database().ref('tareas/'+idTareaEnNodoTareas).update({ estado: "Completada" });
  });

  let tareasProyecto = firebase.database().ref('proyectos/'+idProyecto+'/tareas/');
  firebase.database().ref('proyectos/'+idProyecto+'/tareas/'+idTarea).update({ estado: "Completada" });

  var tareasCompletadas;
  let proyecto = firebase.database().ref('proyectos/'+idProyecto);
  proyecto.once('value').then( function(snapshot) {
    let datosProyecto = snapshot.val();
    tareasCompletadas = datosProyecto.tareasCompletadas;
    tareasCompletadas = tareasCompletadas+1;
    proyecto.update({ tareasCompletadas: tareasCompletadas });
  });

  let rutaUsuarios = firebase.database().ref('usuarios/');
  rutaUsuarios.once('value').then(function(snapshot) {
    let usuarios = snapshot.val();

    for(usuario in usuarios) {
      if(usuarios[usuario].puesto == "Administrador") {
        let trozoRuta = usuarios[usuario].nombre + ' ' + usuarios[usuario].apellidos;

        let notificaciones = firebase.database().ref('notificaciones/'+trozoRuta+'/notificaciones');
        moment.locale('es');
        let formato = moment().format("MMMM DD YYYY, HH:mm:ss");
        let fecha = formato.toString();
        let datosNotificacion = {
          mensaje: asignado + ' ha completado la tarea de ' + nombreTarea,
          tipo: 'Tarea',
          leida: false,
          fecha: fecha
        }
        notificaciones.push(datosNotificacion);

        let not = firebase.database().ref('notificaciones/'+trozoRuta);
        not.once('value', function(snapshot) {
          let notusuario = snapshot.val();
          let cont = notusuario.cont + 1;

          not.update({cont: cont});
        });
      }
    }
  });
}

function marcarComoPendiente(idOrden) {
  let ordenes = firebase.database().ref('ordenes/'+idOrden);

  ordenes.update({
    estado: 'Pendiente'
  });
  let nombre = $('.nombreDeUsuario');
  let misOrdenes = firebase.database().ref('misOrdenes/'+nombre+'/'+idOrden);
  misOrdenes.update({
    estado: 'Pendiente'
  });
}

function marcarComoLista(idOrden) {
  let ordenes = firebase.database().ref('ordenes/'+idOrden);

  ordenes.update({
    estado: 'Listo'
  });
  let nombre = $('.nombreDeUsuario');
  let misOrdenes = firebase.database().ref('misOrdenes/'+nombre+'/'+idOrden);
  misOrdenes.update({
    estado: 'Pendiente'
  });
}

function marcarComoEnProceso(idOrden) {
  let ordenes = firebase.database().ref('ordenes/'+idOrden);

  ordenes.update({
    estado: 'En proceso'
  });
  let nombre = $('.nombreDeUsuario');
  let misOrdenes = firebase.database().ref('misOrdenes/'+nombre+'/'+idOrden);
  misOrdenes.update({
    estado: 'Pendiente'
  });
}

function modalEditarPerfil() {

  let uid = firebase.auth().currentUser.uid;
  let usuario = firebase.database().ref('usuarios/'+uid);
  usuario.once('value').then(function(snapshot) {
    let datos = snapshot.val();
     $('#nombreUsuario').val(datos.nombre);
     $('#apellidosUsuario').val(datos.apellidos);
     $('#emailUsuario').val(datos.email);
     $('#puestoUsuario').val(datos.puesto);
  });

  $('#modalEditarPerfil').modal();


}

$('#upload-imagen').change(function(e) {
  if(this.files && this.files[0]) {
    var archivo = e.target.files[0];
    var nombre = e.target.files[0].name;

      let user = $('#modalEditarPerfil').attr('data-uid');

      var storageRef = firebase.storage().ref(user+'/');
      var uploadTask = storageRef.child('fotoPerfil').put(archivo);

      uploadTask.on('state_changed', function(snapshot){
      }, function(error) {

      }, function() {
        var downloadURL = uploadTask.snapshot.downloadURL;
        $('#imgPerfilModal').attr('src', downloadURL);
        $('#imgPerfil').attr('src', downloadURL);
      });
    }
  }
);

function guardarContraseña() {
  let contraseñaNueva = $('#contraseñaNuevaUsuario').val();

  let contraseñaActualFirebase = auth.currentUser;

  if(contraseñaNueva.length > 0) {
    auth.currentUser.updatePassword(contraseñaNueva)
    .then(function () {
      $('#contraseñaNuevaUsuario').val('');

      $('#nuevaContraseñaAlertSuccess').fadeIn(2000);
      $('#nuevaContraseñaAlertSuccess').fadeOut(1000);
    }, function(error) {
      $('#contraseñaNuevaUsuario').val('');
      $('#nuevaContraseñaAlertDanger').fadeIn(2000);
      $('#nuevaContraseñaAlertDanger').fadeOut(1000);
    });
  }
}

function guardarCambios() {
  let nombre = $('#nombreUsuario').val();
  let apellidos = $('#apellidosUsuario').val();
  let email = $('#emailUsuario').val();
  //let puesto = $('#puestoUsuario').val();
  let sobremi = $('#sobremi').val();

  let rutausuario = firebase.database().ref('usuarios/'+userID);
  rutausuario.update({
    nombre: nombre,
    apellidos: apellidos,
    sobremi: sobremi
  });
}
