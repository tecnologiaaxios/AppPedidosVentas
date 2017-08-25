const db = firebase.database();
const auth = firebase.auth();
var listaProductosPedido = [];

function logout() {
  auth.signOut();
}

function mostrarTicketsCalidadProducto() {
  let uid = auth.currentUser.uid;

  let ticketsRef = db.ref('tickets/calidadProducto');
  ticketsRef.orderByChild("promotora").equalTo(uid).on("value", function(snapshot) {
    let tickets = snapshot.val();
    $('#ticketsCalidadProducto tbody').empty();

    for(let ticket in tickets) {
      let datos = tickets[ticket];

      let dia = datos.fecha.substr(0,2);
      let mes = datos.fecha.substr(3,2);
      let año = datos.fecha.substr(6,4);
      let fecha = mes + '/' + dia + '/' + año;
      moment.locale('es');
      let fechaMostrar = moment(fecha).format('LL');

      let tr = $('<tr/>');
      let td = $('<td/>');
      let a = $('<a/>', {
        'onclick': 'abrirModalTicket("'+ticket+'")',
        text: 'Clave: ' + datos.clave + ' Producto: ' + datos.producto + ' Problema: ' + datos.problema + ' Fecha: ' + fechaMostrar
      })
      td.append(a);
      tr.append(td);
      $('#ticketsCalidadProducto tbody').append(tr);
    }

    //$('#ticketsCalidadProducto tbody').html(trs);
  });
}

function abrirModalTicket(idTicket) {
  $('#modalTicket').modal('show');

  let ticketRef = db.ref('tickets/calidadProducto/'+idTicket);
  ticketRef.once('value', function(snapshot) {
    let datos = snapshot.val();
    $('#claveTicket').val(datos.clave);
    $('#claveProducto').val(datos.producto);

    let dia = datos.fecha.substr(0,2);
    let mes = datos.fecha.substr(3,2);
    let año = datos.fecha.substr(6,4);
    let fechaMostrar = año + '-' + mes + '-' + dia;

    $('#fechaTicket').val(fechaMostrar);
    $('#respuesta').val(datos.respuesta);
    $('#problemaTicket').val(datos.problema);
  });
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

    arrayNotificaciones.reverse();

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
      mostrarTicketsCalidadProducto();
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

  if(this.value != null || this.value != undefined) {
    $('#productos').parent().removeClass('has-error');
    $('#helpblockProductos').hide();
  } else {
    $('#productos').parent().addClass('has-error');
    $('#helpblockProductos').show();
  }
});

$('#productosTicket').change(function() {
  let consorcio = $('#consorcio').val();
  let idProducto = $('#productos').val();

  let productoActualRef = db.ref('productos/'+consorcio+'/'+idProducto);
  productoActualRef.on('value', function(snapshot) {
    let producto = snapshot.val();
    $('#productoTicket').val(idProducto);
  });

  if(this.value != null || this.value != undefined) {
    $('#productosTicket').parent().parent().removeClass('has-error');
    $('#helpblockProductoTicket').hide();
  }
  else {
    $('#productosTicket').parent().parent().addClass('has-error');
    $('#helpblockProductoTicket').show();
  }
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

  if(this.value.length < 1) {
    $('#pedidoPz').parent().addClass('has-error');
    $('#helpblockPedidoPz').show();
  }
  else {
    $('#pedidoPz').parent().removeClass('has-error');
    $('#helpblockPedidoPz').hide();
  }
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

  if(this.value.length < 1) {
    $('#degusPz').parent().addClass('has-error');
    $('#helpblockDegusPz').show();
  }
  else {
    $('#degusPz').parent().removeClass('has-error');
    $('#helpblockDegusPz').hide();
  }
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

  if(this.value.length < 1) {
    $('#cambioFisico').parent().addClass('has-error');
    $('#helpblockCambioFisico').show();
  }
  else {
    $('#cambioFisico').parent().removeClass('has-error');
    $('#helpblockCambioFisico').hide();
  }
});

$(document).ready(function() {
  //llenarSelectTiendas();
  //llenarSelectProductos();
  $('.input-group.date').datepicker({
    autoclose: true,
    format: "dd/mm/yyyy",
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
  let productoSeleccionado = $('#productos').val();

  console.log(pedidoPz.length>0);

  if((productoSeleccionado != null || productoSeleccionado != undefined) && pedidoPz.length > 0  && degusPz.length > 0 && cambioFisico.length > 0) {
    console.log('if');
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
  else {
    if(productoSeleccionado == null || productoSeleccionado == undefined) {
      $('#productos').parent().addClass('has-error');
      $('#helpblockProductos').show();
    }
    else {
      $('#productos').parent().removeClass('has-error');
      $('#helpblockProductos').hide();
    }
    if(pedidoPz.length < 1) {
      $('#pedidoPz').parent().addClass('has-error');
      $('#helpblockPedidoPz').show();
    }
    else {
      $('#pedidoPz').parent().removeClass('has-error');
      $('#helpblockPedidoPz').hide();
    }
    if(degusPz.length < 1) {
      $('#degusPz').parent().addClass('has-error');
      $('#helpblockDegusPz').show();
    }
    else {
      $('#degusPz').parent().removeClass('has-error');
      $('#helpblockDegusPz').hide();
    }
    if(cambioFisico.length < 1) {
      $('#cambioFisico').parent().addClass('has-error');
      $('#helpblockCambioFisico').show();
    }
    else {
      $('#cambioFisico').parent().removeClass('has-error');
      $('#helpblockCambioFisico').hide();
    }
  }
}

function guardarPedido() {

  if(listaProductosPedido.length > 0) {
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
    $("#productos").val('');
    $("#productos option[value=Seleccionar]").attr('selected', true);
    //$('#productosPedido tbody').empty();
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
  else {

  }
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

function tomarFoto() {
  navigator.camera.getPicture(
    function(imageUrl) {
      $('#foto').attr('src', imageURI);
    },
    function(message) {
      alert('Falló debido a: ' + message);
    },
    {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI
    });
}

function enviarTicketCalidadProducto() {
  let producto = $('#productosTicket').val();
  let cantidad = $('#cantidadMalEstado').val();
  let fechaCaducidad = $('#fechaCaducidad').val();
  let lote = $('#loteProducto').val();
  let problema = $('input:radio[name=problemasProductos]:checked').val();
  let descripcion = $('#descripcionTicket').val();
  let fecha = moment().format('DD/MM/YYYY');
  let tienda = $('#tienda').val();

  if((producto != null || producto != undefined) && cantidad.length > 0 && fechaCaducidad.length > 0 && lote.length > 0 && problema.length > 0 && descripcion.length > 0  && (tienda != null || tienda != undefined)) {
    let ticketsRef = db.ref('tickets/calidadProducto');
    ticketsRef.once('value', function(snapshot) {
      let tickets = snapshot.val();
      let uid = auth.currentUser.uid;

      let keys = Object.keys(tickets);
      let last = keys[keys.length-1];
      let ultimoTicket = tickets[last];
      let lastclave = ultimoTicket.clave;

      let datosTicket = {
        producto: producto,
        fechaCaducidad: fechaCaducidad,
        cantidad: Number(cantidad),
        lote: lote,
        problema: problema,
        descripcion: descripcion,
        tienda: tienda,
        fecha: fecha,
        clave: lastclave+1,
        estado: "Pendiente",
        respuesta: "",
        promotora: uid
      }

      ticketsRef.push(datosTicket);
    });

    $('#productosTicket').val('');
    $("#productosTicket option[value=Seleccionar]").attr('selected', true);
    $('#cantidadMalEstado').val('')
    $('#fechaCaducidad').val('');
    $('#loteProducto').val('');
    $('input:radio[name=problemasProductos]:checked').val('');
    $('#descripcionTicket').val('');
    $('#tienda').val('');
  }
  else {
    if(producto == undefined || producto == null) {
      $('#productosTicket').parent().parent().addClass('has-error');
      $('#helpblockProductoTicket').show();
    }
    else {
      $('#productosTicket').parent().parent().removeClass('has-error');
      $('#helpblockProductoTicket').hide();
    }
    if(cantidad.length < 1) {
      $('#cantidadMalEstado').parent().parent().addClass('has-error');
      $('#helpblockCantidadMalEstado').show();
    }
    else {
      $('#cantidadMalEstado').parent().parent().removeClass('has-error');
      $('#helpblockCantidadMalEstado').hide();
    }
    if(fechaCaducidad.length < 1) {
      $('#fechaCaducidad').parent().parent().addClass('has-error');
      $('#helpblockFechaCaducidad').show();
    }
    else {
      $('#fechaCaducidad').parent().parent().removeClass('has-error');
      $('#helpblockFechaCaducidad').hide();
    }
    if(lote.length < 1) {
      $('#loteProducto').parent().parent().addClass('has-error');
      $('#helpblockLoteProducto').show();
    }
    else {
      $('#loteProducto').parent().parent().removeClass('has-error');
      $('#helpblockLoteProducto').hide();
    }
    if(descripcion.length < 1) {
      $('#descripcionTicket').parent().parent().addClass('has-error');
      $('#helpblockDescripcion').show();
    }
    else {
      $('#descripcionTicket').parent().parent().removeClass('has-error');
      $('#helpblockDescripcion').hide();
    }
  }
}

$('#formCalidadProducto').on('show.bs.collapse', function () {
  $('#formRetrasoPedido').collapse('hide');
});

$('#formRetrasoPedido').on('show.bs.collapse', function () {
  $('#formCalidadProducto').collapse('hide');
});
