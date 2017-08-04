const db = firebase.database();
const auth = firebase.auth();
var listaProductosPedido = [];

function llenarSelectTiendas() {
  let tiendasRef = db.ref('tiendas');
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


function llenarSelectProductos() {
  let idTienda = $("#tiendas").val();
  let productosRef = db.ref('tiendas/'+idTienda+'/productos');
  productosRef.on('value', function(snapshot) {
    let productos = snapshot.val();
    let row = "";
    for(let producto in productos) {
      row += '<option value="'+producto+'">'+productos[producto].clave + ' ' + productos[producto].nombre +' ' + productos[producto].empaque +'</option>';
    }
    $('#productos').empty().append('<option value="Productos" disabled selected>Productos</option>');
    $('#productos').append(row);
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
  llenarSelectProductos();
  let idTienda = $("#tiendas").val();
  console.log(idTienda);
  let tiendaActualRef = db.ref('tiendas/'+idTienda);
  tiendaActualRef.once('value', function(snapshot) {
    let tienda = snapshot.val();
    $('#tienda').val(tienda.nombre);
    $('#region').val(tienda.region);
  });
});

$('#productos').change(function(){
  let idTienda = $('#tiendas').val();
  let idProducto = $('#productos').val();
  let productoActualRef = db.ref('tiendas/'+idTienda+'/productos/'+idProducto);
  productoActualRef.once('value', function(snapshot){
    let producto = snapshot.val();
    $('#clave').val(producto.clave);
    $('#nombre').val(producto.nombre);
    $('#empaque').val(producto.empaque);
  });
});

$('#pedidoPz').keyup(function(){
  let pedidoPz = Number($('#pedidoPz').val());
  let degusPz = Number($('#degusPz').val());
  let empaque = Number($('#empaque').val());
  let totalPz = pedidoPz+degusPz;
  let totalKg = (totalPz*empaque).toFixed(4);

  $('#totalPz').val(totalPz);
  $('#totalKg').val(totalKg);
});

$('#degusPz').keyup(function(){
  let pedidoPz = Number($('#pedidoPz').val());
  let degusPz = Number($('#degusPz').val());
  let empaque = Number($('#empaque').val());
  let totalPz = pedidoPz+degusPz;
  let totalKg = (totalPz*empaque).toFixed(4);

  $('#totalPz').val(totalPz);
  $('#totalKg').val(totalKg);
});

$(document).ready(function() {
  llenarSelectTiendas();
  //llenarSelectProductos();
})

function agregarProducto() {
  let clave = $('#clave').val();
  let nombre = $('#nombre').val();
  let pedidoPz = $('#pedidoPz').val();
  let degusPz = $('#degusPz').val();
  let totalPz = $('#totalPz').val();
  let totalKg = $('#totalKg').val();

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
    totalPz: Number(totalPz),
    totalKg: Number(totalKg)
  };
  listaProductosPedido.push(datosProducto);

  $('#productos').focus();
  $('#pedidoPz').val('');
  $('#degusPz').val('');
  $('#totalPz').val('');
  $('#totalKg').val('')
}

function guardarPedido() {
  let pedidoRef = db.ref('pedidoEntrada/');
  let tienda = $('#tienda').val();
  let ruta = $('#region').val();
  let fechaCaptura = moment().format('DD/MM/YYYY');
  let uid = auth.currentUser.uid;
  console.log(uid);

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
  let historialPedidosEntradaRef = db.ref('historialPedidosEntrada');
  historialPedidosEntradaRef.on('value', function(snapshot) {
    let historialPedidos = snapshot.val();
    //console.log(historialPedidos);
    let row = "";
    //$('#tablaPedidosEnProceso tbody').empty();
    for(pedido in historialPedidos) {
      let histRef = db.ref('historialPedidosEntrada/'+pedido);
      histRef.on('value', function(snapshot) {
        let hola = snapshot.val();
        for(i in hola){
          let pedidoActual = db.ref('historialPedidosEntrada/'+pedido+'/'+i+'/encabezado');
          //console.log(pedidoActual);
          pedidoActual.once('value', function(snapshot) {
          let ped = snapshot.val();
          //console.log(ped)
          //$('#tienda').val(tienda.nombre);
          //$('#region').val(tienda.region);
          //console.log(i);
          row += '<tr><td>' +
              ped.fechaCaptura +" "+ped.ruta +" "+ ped.tienda+'</td></tr>';
           });
        }
      });
      //console.log(historialPedidos.val());
      //let div = $('<div/>', {'class': 'panel-body no-padding'});
      //let tr = $('<tr/>');
      //let td = $('<td/>');



      //let div1 = '<div class="input-group-addon btn btn-primary"><span class="glyphicon glyphicon-calendar"></span></div>';

      //div.append(tr);
      $('#historialPedidos').html(row);

    }

  });
}

mostrarHistorialPedidos();

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
