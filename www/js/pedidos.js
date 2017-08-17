const db = firebase.database();
const auth = firebase.auth();
var listaProductosPedido = [];

function logout() {
  auth.signOut();
}

function mostrarNotificaciones() {
  let usuario = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/tiendas/'+usuario+'/lista');
  notificacionesRef.on('value', function(snapshot) {
    let lista = snapshot.val();
    let trs = "";

    let arrayNotificaciones = [];
    for(let notificacion in lista) {
      arrayNotificaciones.push(lista[notificacion]);
    }

    for(let i in arrayNotificaciones) {
      let date = arrayNotificaciones[i].fecha;
      moment.locale('es');
      let fecha = moment(date, "MMMM DD YYYY, HH:mm:ss").fromNow();

      trs += '<tr><td>'+arrayNotificaciones[i].mensaje +' '+fecha+'</td></tr>'
    }

    $('#notificaciones').empty().append(trs);
  });
}

function mostrarContador() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/tiendas/'+uid);
  notificacionesRef.on('value', function(snapshot) {
    let cont = snapshot.val().cont;

    if(cont > 0) {
      $('#spanNotificaciones').html(cont).show();
    }
    else {
      $('#spanNotificaciones').hide();
    }
  });
}

function verNotificaciones() {
  let uid = auth.currentUser.uid;
  let notificacionesRef = db.ref('notificaciones/tiendas/'+uid);
  notificacionesRef.update({cont: 0});
}

function haySesion() {
  auth.onAuthStateChanged(function (user) {
    //si hay un usuario
    if (user) {
      llenarSelectTiendas();
      mostrarHistorialPedidos();
      mostrarNotificaciones();
      mostrarContador();
    }
    else {
      $(location).attr("href", "index.html");
    }
  });
}

haySesion();

function llenarSelectTiendas() {
  let uid = auth.currentUser.uid;
  let usuariosRef = db.ref('usuarios/tiendas/supervisoras/'+uid);
  usuariosRef.once('value', function(snapshot) {
    let region = snapshot.val().region;
    $('.region p').html('Pedidos Región '+region);

    let tiendasRef = db.ref('regiones/'+region);
    tiendasRef.on('value', function(snapshot) {
      let tiendas = snapshot.val();
      let row = "";

      for(let tienda in tiendas) {
        let imagen = "";
        switch (tiendas[tienda].consorcio) {
          case "SORIANA":
            imagen = "assets/tiendas/soriana.png";
            break;
          case "SMART":
            imagen = "assets/tiendas/smart.png";
            break;
          case "GRAND":
            imagen = "assets/tiendas/grand.png";
            break;
          case "IBARRA":
            imagen = "assets/tiendas/ibarra.png";
            break;
          case "CHEDRAUI":
            imagen = "assets/tiendas/chedraui.png";
            break;
          case "STM":
            imagen = "assets/tiendas/stm.png";
            break;
          case "MASBODEGA":
            imagen = "assets/tiendas/masbodega.png";
            break;
          case "CHUPER":
            imagen = "assets/tiendas/chuper.png";
            break;
          case "ARTELI":
            imagen = "assets/tiendas/arteli.png";
            break;
        }

        row += '<option value="'+tienda+'" data-image="'+imagen+'">'+tiendas[tienda].nombre+'</option>';
      }

      $('#tiendas').show();
      $('#tiendas').empty().append('<option value="Tiendas" disabled selected>Selecciona una tienda para visitar</option>');
      $('#tiendas').append(row).msDropdown();
    });
  });

  /*let tiendasRef = db.ref('tiendas');
  tiendasRef.on('value', function(snapshot) {
    let tiendas = snapshot.val();
    let row = "";

    for(let tienda in tiendas) {
      let imagen = "";
      switch (tiendas[tienda].consorcio) {
        case "SORIANA":
          imagen = "assets/tiendas/soriana.png";
          break;
        case "SMART":
          imagen = "assets/tiendas/smart.png";
          break;
        case "GRAND":
          imagen = "assets/tiendas/grand.png";
          break;
        case "IBARRA":
          imagen = "assets/tiendas/ibarra.png";
          break;
        case "CHEDRAUI":
          imagen = "assets/tiendas/chedraui.png";
          break;
        case "STM":
          imagen = "assets/tiendas/stm.png";
          break;
        case "MASBODEGA":
          imagen = "assets/tiendas/masbodega.png";
          break;
        case "CHUPER":
          imagen = "assets/tiendas/chuper.png";
          break;
        case "ARTELI":
          imagen = "assets/tiendas/arteli.png";
          break;
      }

      row += '<option value="'+tienda+'" data-image="'+imagen+'">'+tiendas[tienda].nombre+'</option>';
    }

    $('#tiendas').show();
    $('#tiendas').empty().append('<option value="Tiendas" disabled selected>Selecciona una tienda para visitar</option>');
    $('#tiendas').append(row).msDropdown();
  });*/
}

//llenarSelectTiendas();

/*function llenarSelectTiendas() {
  var jsonData = [
    {description:'', value:'', text:'Tienda'}
  ];

  let tiendasRef = db.ref('tiendas');
  tiendasRef.on('value', function(snapshot) {
    let tiendas = snapshot.val();

    for(let tienda in tiendas) {
      let imagen = "";
      switch (tiendas[tienda].consorcio) {
        case "SORIANA":
          imagen = "assets/tiendas/soriana.png";
          break;
        case "SMART":
          imagen = "assets/tiendas/smart.png";
          break;
        case "GRAND":
          imagen = "assets/tiendas/grand.png";
          break;
        case "IBARRA":
          imagen = "assets/tiendas/ibarra.png";
          break;
        case "CHEDRAUI":
          imagen = "assets/tiendas/chedraui.png";
          break;
        case "STM":
          imagen = "assets/tiendas/stm.png";
          break;
      }

      let json = {image:imagen, value:tienda, text:tiendas[tienda].nombre};
      jsonData.push(json);
    }
    $("#tiendas").msDropDown({byJson:{data:jsonData, name:'tiendas'}}).data("dd");
    $("#tiendas").msDropdown().data("dd").on("change", function(res) {
      let idTienda = $('#tiendas').msDropdown().data('dd').value;
      let tiendaActualRef = db.ref('tiendas/'+idTienda);
      tiendaActualRef.once('value', function(snapshot) {
        let tienda = snapshot.val();
        $('#tienda').val(tienda.nombre);
        $('#region').val(tienda.region);
      });
    });
  });

}*/


/*function llenarSelectProductos() {
  let consorcio= $("#tiendas").val();

  let uid = auth.currentUser.uid;
  let usuarioRef = db.ref('usuarios/tiendas/supervisoras/'+uid);
  usuarioRef.once('value', function(snapshot) {
    let region = snapshot.val().region;

    let productosRef = db.ref('regiones/'+region+'/'+idTienda+'/productos');
    productosRef.on('value', function(snapshot) {
      let productos = snapshot.val();
      let row = "";
      for(let producto in productos) {
        row += '<option value="'+producto+'">'+productos[producto].clave + ' ' + productos[producto].nombre + ' ' + productos[producto].empaque +'</option>';
      }
      $('#productos').empty().append('<option value="Productos" disabled selected>Productos</option>');
      $('#productos').append(row);
    });
  });
}*/

function llenarSelectProductos() {
  let consorcio = $('#consorcio').val();

  let productosRef = db.ref('productos/'+consorcio);
  productosRef.on('value', function(snapshot) {
    let productos = snapshot.val();
    let options = '<option value="Productos" disabled selected>Productos</option>';
    for(let producto in productos) {
      options += '<option value="'+producto+'">'+ producto + '  ' + productos[producto].nombre + '  ' + productos[producto].empaque +'</option>';
    }
    $('#productos').html(options);
    $('#productosTicket').html(options);
  });
}

/*function llenarSelectProductos() {
  var jsonData = [
    {description:'', value:'', text:'Tienda'}
  ];

  let idTienda = $("#tiendas").msDropdown().data("dd").value;
  let productosRef = db.ref('tiendas/'+idTienda+'/productos');
  productosRef.on('value', function(snapshot) {
    let productos = snapshot.val();
    //console.log(productos);
    for(let producto in productos) {
      let json = {value:producto, text:productos[producto].nombre};
      jsonData.push(json);
    }
    $("#tiendas").msDropDown({byJson:{data:jsonData, name:'productos'}}).data("dd");
  });
}*/

//llenarSelectProductos();

$('#tiendas').change(function(){
  let idTienda = $("#tiendas").val();

  let uid = auth.currentUser.uid;
  let usuariosRef = db.ref('usuarios/tiendas/supervisoras/'+uid);
  usuariosRef.once('value', function(snapshot) {
    let region = snapshot.val().region;

    let tiendaActualRef = db.ref('regiones/'+region+'/'+idTienda);
    tiendaActualRef.once('value', function(snapshot) {
      let tienda = snapshot.val();
      $('#tienda').val(tienda.nombre);
      $('#region').val(region);
      $('#consorcio').val(tienda.consorcio);

      llenarSelectProductos();
    });
  });
});

/*$('#productos').change(function(){
  let idTienda = $('#tiendas').val();
  let idProducto = $('#productos').val();
  let uid = auth.currentUser.uid;
  let usuariosRef = db.ref('usuarios/tiendas/supervisoras/'+uid);
  usuariosRef.once('value', function(snapshot) {
    let region = snapshot.val().region;

    let productoActualRef = db.ref('regiones/'+region+'/'+idTienda+'/productos/'+idProducto);
    productoActualRef.once('value', function(snapshot){
      let producto = snapshot.val();
      $('#clave').val(producto.clave);
      $('#nombre').val(producto.nombre);
      $('#empaque').val(producto.empaque);
    });
  });
});*/

$('#productos').change(function() {
  let consorcio = $('#consorcio').val();
  let idProducto = $('#productos').val();

  let productoActualRef = db.ref('productos/'+consorcio+'/'+idProducto);
  productoActualRef.on('value', function(snapshot) {
    let producto = snapshot.val();
    $('#clave').val(idProducto);
    $('#nombre').val(producto.nombre);
    $('#empaque').val(producto.empaque);
    $('#precioUnitario').val(producto.precioUnitario);
    $('#unidad').val(producto.unidad);
  });
});

$('#productosTicket').change(function() {
  let consorcio = $('#consorcio').val();
  let idProducto = $('#productos').val();

  let productoActualRef = db.ref('productos/'+consorcio+'/'+idProducto);
  productoActualRef.on('value', function(snapshot) {
    let producto = snapshot.val();
    $('#productoTicket').val(idProducto);
  });
});

$('#pedidoPz').keyup(function(){
  let pedidoPz = Number($('#pedidoPz').val());
  let degusPz = Number($('#degusPz').val());
  let cambioFisico = Number($('#cambioFisico').val());
  let empaque = Number($('#empaque').val());
  let totalPz = pedidoPz+degusPz+cambioFisico;
  let totalKg = (totalPz*empaque).toFixed(4);

  $('#totalPz').val(totalPz);
  $('#totalKg').val(totalKg);
});

$('#degusPz').keyup(function(){
  let pedidoPz = Number($('#pedidoPz').val());
  let degusPz = Number($('#degusPz').val());
  let cambioFisico = Number($('#cambioFisico').val());
  let empaque = Number($('#empaque').val());
  let totalPz = pedidoPz+degusPz+cambioFisico;
  let totalKg = (totalPz*empaque).toFixed(4);

  $('#totalPz').val(totalPz);
  $('#totalKg').val(totalKg);
});

$('#cambioFisico').keyup(function(){
  let pedidoPz = Number($('#pedidoPz').val());
  let degusPz = Number($('#degusPz').val());
  let cambioFisico = Number($('#cambioFisico').val());
  let empaque = Number($('#empaque').val());
  let totalPz = pedidoPz+degusPz+cambioFisico;
  let totalKg = (totalPz*empaque).toFixed(4);

  $('#totalPz').val(totalPz);
  $('#totalKg').val(totalKg);
});

$(document).ready(function() {
  //llenarSelectTiendas();
  //llenarSelectProductos();
  $('.input-group.date').datepicker({
    autoclose: true,
    format: "dd/mm/yyyy",
    startDate: "today",
    language: "es"
  });
});

function agregarProducto() {
  let clave = $('#clave').val();
  let nombre = $('#nombre').val();
  let pedidoPz = $('#pedidoPz').val();
  let degusPz = $('#degusPz').val();
  let cambioFisico = $('#cambioFisico').val();
  let totalPz = $('#totalPz').val();
  let totalKg = $('#totalKg').val();
  let precioUnitario = $('#precioUnitario').val();
  let unidad = $('#unidad').val();

  let row = '<tr>' +
              '<td>'+clave+'</td>'+
              '<td>'+nombre+'</td>'+
              '<td>'+pedidoPz+'</td>'+
              '<td>'+degusPz+'</td>'+
              '<td>'+totalPz+'</td>'+
              '<td>'+totalKg+'</td>'+
            '</tr>';

  $('#productosPedido tbody').append(row);

  let datosProducto = {
    clave: clave,
    nombre: nombre,
    pedidoPz: Number(pedidoPz),
    degusPz: Number(degusPz),
    cambioFisico: Number(cambioFisico),
    totalPz: Number(totalPz),
    totalKg: Number(totalKg),
    precioUnitario: Number(precioUnitario),
    unidad: unidad
  };
  listaProductosPedido.push(datosProducto);

  $('#productos').focus();
  $('#pedidoPz').val('');
  $('#degusPz').val('');
  $('#cambioFisico').val('');
  $('#totalPz').val('');
  $('#totalKg').val('')
  $('#precioUnitario').val('');
  $('#unidad').val('');
}

function guardarPedido() {
  let pedidoRef = db.ref('pedidoEntrada/');
  let tienda = $('#tienda').val();
  let ruta = $('#region').val();
  let fechaCaptura = moment().format('DD/MM/YYYY');
  let uid = auth.currentUser.uid;

  let encabezado = {
    encabezado: {
      fechaCaptura: fechaCaptura,
      tienda: tienda,
      ruta: ruta,
      fechaRuta: "",
      estado: "Pendiente",
      promotora: uid
    }
  };

  let key = pedidoRef.push(encabezado).getKey();

  let pedidoDetalleRef = db.ref('pedidoEntrada/'+key+'/detalle');

  for(let producto in listaProductosPedido) {
    pedidoDetalleRef.push(listaProductosPedido[producto]);
  }

  //$('#tiendas option').first().attr('selected', true);
  //$('#productos option').first().attr('selected', true);
  $("#tiendas").val('Tiendas')
  $("#productos").val('Productos')
  $('#productosPedido tbody').empty();
  listaProductosPedido.length = 0;

  //Envío de notificación al almacen
  let usuariosAlmacenRef = db.ref('usuarios/planta/almacen');
  usuariosAlmacenRef.once('value', function(snapshot) {
    let usuarios = snapshot.val();
    for(let usuario in usuarios) {
      let notificacionesListaRef = db.ref('notificaciones/almacen/'+usuario+'/lista');
      moment.locale('es');
      let formato = moment().format("MMMM DD YYYY, HH:mm:ss");
      let fecha = formato.toString();
      let notificacion = {
        fecha: fecha,
        leida: false,
        mensaje: "Se ha generado un pedido: Clave: " + key
      };
      notificacionesListaRef.push(notificacion);

      let notificacionesRef = db.ref('notificaciones/almacen/'+usuario);
      notificacionesRef.once('value', function(snapshot) {
        let notusuario = snapshot.val();
        let cont = notusuario.cont + 1;

        notificacionesRef.update({cont: cont});
      });
    }
  });
}

function mostrarHistorialPedidos() {
  let uid = auth.currentUser.uid

  let usuarioRef = db.ref('usuarios/tiendas/supervisoras/'+uid);
  usuarioRef.once('value', function(snapshot) {
    let region = snapshot.val().region;

    let historialPedidosEntradaRef = db.ref('regiones/'+region);
    historialPedidosEntradaRef.once('value', function(snapshot) {
      let tiendas = snapshot.val();
      let row = "";

      for(let tienda in tiendas) {
        let historialPedidos = tiendas[tienda].historialPedidos;
        for(let pedido in historialPedidos) {
          let ped = historialPedidos[pedido].encabezado;

          let diaCaptura = ped.fechaCaptura.substr(0,2);
          let mesCaptura = ped.fechaCaptura.substr(3,2);
          let añoCaptura = ped.fechaCaptura.substr(6,4);
          let fechaCaptura = mesCaptura + '/' + diaCaptura + '/' + añoCaptura;
          moment.locale('es');
          let fechaCapturaMostrar = moment(fechaCaptura).format('LL');
          row += '<tr><td>' + fechaCapturaMostrar +" "+ped.ruta +" "+ ped.tienda+'</td></tr>';
        }
      }
      $('#historialPedidos').html(row);
    });
  });
}

function enviarTicketCalidadProducto() {
  let producto = $('#productosTicket').val();
  let cantidad = Number($('#cantidadMalEstado').val());
  let fechaCaducidad = $('#fechaCaducidad').val();
  let lote = $('#loteProducto').val();
  let problema = $('input:radio[name=problemasProductos]:checked').val();
  let descripcion = $('#descripcionTicket').val();
  let fecha = moment().format('DD/MM/YYYY');
  let tienda = $('#tienda').val();

  let ticketsRef = db.ref('tickets/calidadProducto');
  ticketsRef.once('value', function(snapshot) {
    let tickets = snapshot.val();

    let keys = Object.keys(tickets);
    let last = keys[keys.length-1];
    let ultimoTicket = tickets[last];
    let lastclave = ultimoTicket.clave;
    console.log(lastclave);

    let datosTicket = {
      producto: producto,
      fechaCaducidad: fechaCaducidad,
      cantidad: cantidad,
      lote: lote,
      problema: problema,
      descripcion: descripcion,
      tienda: tienda,
      fecha: fecha,
      clave: lastclave+1,
      estado: "Pendiente",
      respuesta: ""
    }

    ticketsRef.push(datosTicket);
  });
}

//mostrarHistorialPedidos();

//$('#historialPedidos').empty().append(mostrarHistorialPedidos());
      /*row += '<tr>' +
              '<td>' + pedidoPadre + '</td>' +
              '<td>' + pedidosPadre[pedidoPadre].fechaCreacionPadre + '</td>' +
              '<td>' + pedidosPadre[pedidoPadre].fechaRuta + '</td>' +
              '<td><input type="text" class="form-control" style="width: 100px; display:inline-block padding-right: 10px;" placeholder="Nueva fecha de ruta"><button class="btn btn-primary" type="button"><i class="fa fa-floppy-o" aria-hidden="true"></i></button></td>' +
              '<td>' + pedidosPadre[pedidoPadre].ruta + '</td>' +
              '<td></td>' +
             '</tr>';*/

      /*let diaCaptura = pedidosPadre[pedidoPadre].fechaCreacionPadre.substr(0,2);
      let mesCaptura = pedidosPadre[pedidoPadre].fechaCreacionPadre.substr(3,2);
      let añoCaptura = pedidosPadre[pedidoPadre].fechaCreacionPadre.substr(6,4);
      let fechaCaptura = mesCaptura + '/' + diaCaptura + '/' + añoCaptura;
      moment.locale('es');
      let fechaCapturaMostrar = moment(fechaCaptura).format('DD MMMM YYYY');

      let fechaRutaMostrar;
      if(pedidosPadre[pedidoPadre].fechaRuta.length > 0) {
        let diaRuta = pedidosPadre[pedidoPadre].fechaRuta.substr(0,2);
        let mesRuta = pedidosPadre[pedidoPadre].fechaRuta.substr(3,2);
        let añoRuta = pedidosPadre[pedidoPadre].fechaRuta.substr(6,4);
        let fechaRuta = mesRuta + '/' + diaRuta + '/' + añoRuta;

        fechaRutaMostrar = moment(fechaRuta).format('DD MMMM YYYY');
      } else {
        fechaRutaMostrar = "Fecha pendiente";
      }

      row = '<td>' + pedidoPadre + '</td>' +
            '<td>' + fechaCapturaMostrar + '</td>' +
            '<td>' + fechaRutaMostrar + '</td>';

      div.append(input);
      div.append('<span class="input-group-addon btn-primary"><i class="glyphicon glyphicon-calendar"></i></span>');
      //div.append(button);
      td.append(div);
      td.append(button);
      tr.append(row);
      tr.append(td);
      tr.append('<td>' + pedidosPadre[pedidoPadre].ruta + '</td>');
      div2.append(input2);
      span2.append(button2);
      div2.append(span2);
      td2.append(div2);
      tr.append(td2);
      tr.append('<td><a class="btn btn-info" href="pedidoPadre.html?id='+pedidoPadre+'">Ver más</a></td>');

      $('#tablaPedidosEnProceso tbody').append(tr);

      $('.input-group.date').datepicker({
        format: "dd/mm/yyyy",
        startDate: "today",
        language: "es"
      });
    }
  });*/

  $('#formCalidadProducto').on('show.bs.collapse', function () {
    $('#formRetrasoPedido').collapse('hide');
  });

  $('#formRetrasoPedido').on('show.bs.collapse', function () {
    $('#formCalidadProducto').collapse('hide');
  });
