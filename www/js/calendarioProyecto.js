  var $currentPopover = null;
  $(document).on('shown.bs.popover', function (ev) {
  var $target = $(ev.target);
  if ($currentPopover && ($currentPopover.get(0) != $target.get(0))) {
    $currentPopover.popover('toggle');
  }
  $currentPopover = $target;
  }).on('hidden.bs.popover', function (ev) {
  var $target = $(ev.target);
  if ($currentPopover && ($currentPopover.get(0) == $target.get(0))) {
    $currentPopover = null;
  }
  });

  //quicktmpl is a simple template language I threw together a while ago; it is not remotely secure to xss and probably has plenty of bugs that I haven't considered, but it basically works
  //the design is a function I read in a blog post by John Resig (http://ejohn.org/blog/javascript-micro-templating/) and it is intended to be loosely translateable to a more comprehensive template language like mustache easily
  $.extend({
  quicktmpl: function (template) {return new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+template.replace(/[\r\t\n]/g," ").split("{{").join("\t").replace(/((^|\}\})[^\t]*)'/g,"$1\r").replace(/\t:(.*?)\}\}/g,"',$1,'").split("\t").join("');").split("}}").join("p.push('").split("\r").join("\\'")+"');}return p.join('');")}
  });

  $.extend(Date.prototype, {
  //provides a string that is _year_month_day, intended to be widely usable as a css class
  toDateCssClass:  function () {
  return '_' + this.getFullYear() + '_' + (this.getMonth() + 1) + '_' + this.getDate();
  },
  //this generates a number useful for comparing two dates;
  toDateInt: function () {
  return ((this.getFullYear()*12) + this.getMonth())*32 + this.getDate();
  },
  toTimeString: function() {
  var hours = this.getHours(),
      minutes = this.getMinutes(),
      hour = (hours > 12) ? (hours - 12) : hours,
      ampm = (hours >= 12) ? ' pm' : ' am';
  if (hours === 0 && minutes===0) { return ''; }
  if (minutes > 0) {
    return hour + ':' + minutes + ampm;
  }
  return hour + ampm;
  }
  });


  (function ($) {

  //t here is a function which gets passed an options object and returns a string of html. I am using quicktmpl to create it based on the template located over in the html block
  var t = $.quicktmpl($('#tmpl').get(0).innerHTML);

  function calendar($el, options) {
  //actions aren't currently in the template, but could be added easily...
  $el.on('click', '.js-cal-prev', function () { //es la funcionalidad del boton anterior
    switch(options.mode) {
    case 'year': options.date.setFullYear(options.date.getFullYear() - 1); break;
    case 'month': options.date.setMonth(options.date.getMonth() - 1); break;
    case 'week': options.date.setDate(options.date.getDate() - 7); break;
    case 'day':  options.date.setDate(options.date.getDate() - 1); break;
    }
    draw();
  }).on('click', '.js-cal-next', function () { // es la funcionalidad del boton siguiente
    switch(options.mode) {
    case 'year': options.date.setFullYear(options.date.getFullYear() + 1); break;
    case 'month': options.date.setMonth(options.date.getMonth() + 1); break;
    case 'week': options.date.setDate(options.date.getDate() + 7); break;
    case 'day':  options.date.setDate(options.date.getDate() + 1); break;
    }
    draw();
  }).on('click', '.js-cal-option', function () {
    var $t = $(this), o = $t.data();
    if (o.date) { o.date = new Date(o.date); }
    $.extend(options, o);
    draw();
  }).on('click', '.js-cal-years', function () {
    var $t = $(this),
        haspop = $t.data('popover'),
        s = '',
        y = options.date.getFullYear() - 2,
        l = y + 5;
    if (haspop) { return true; }
    for (; y < l; y++) {
      s += '<button type="button" class="btn btn-default btn-lg btn-block js-cal-option" data-date="' + (new Date(y, 1, 1)).toISOString() + '" data-mode="year">'+y + '</button>';
    }
    $t.popover({content: s, html: true, placement: 'auto top'}).popover('toggle');
    return false;
  }).on('click', '.event', function () {
    var $t = $(this),
        index = +($t.attr('data-index')),
        haspop = $t.data('popover'),
        data, time;

    if (haspop || isNaN(index)) { return true; }
    data = options.data[index];
    time = data.start.toTimeString();
    if (time && data.end) { time = time + ' - ' + data.end.toTimeString(); }
    $t.data('popover',true);
    //$t.popover({content: '<p><strong>' + time + '</strong></p>'+data.text, html: true, placement: 'auto left'}).popover('toggle');
    return false;
  });
  function dayAddEvent(index, event) { //asigna el evento al dia
    if (!!event.allDay) {
      monthAddEvent(index, event);
      return;
    }
    //esta variable es la que dibuja el div del evento en el calendario
    //le pone una clase evento <div id='left-rollbacks' class="container"></div>

    var $event = $('<div/>', {'class': 'event', text: event.title, title: event.title, 'data-index': index}), //crea un nuevo div
        start = event.start,
        end = event.end || start,
        time = event.start.toTimeString(),
        hour = start.getHours(),
        timeclass = '.time-22-0',
        startint = start.toDateInt(),
        dateint = options.date.toDateInt(),
        endint = end.toDateInt();
    if (startint > dateint || endint < dateint) { return; }

    if (!!time) {
      $event.html('<strong>' + time + '</strong> ' + $event.html());
    }
    $event.toggleClass('begin', startint === dateint);
    $event.toggleClass('end', endint === dateint);
    if (hour < 6) {
      timeclass = '.time-0-0';
    }
    if (hour < 22) {
      timeclass = '.time-' + hour + '-' + (start.getMinutes() < 30 ? '0' : '30');
    }
    $('timeclass').append($event);

  }

  function monthAddEvent(index, event) {
    var $event;
    if(event.categoria == 'Hito') {
      $event = $('<div/>', {'id': event.id, 'class': 'event-hito', style: 'border-left: solid 5px ' + event.color +' !important; ' , text: event.title, title: event.title, 'data-index': index});
    }
    else {
      if(event.estado == 'Pendiente') {
        $event = $('<div/>', {'id': event.id, 'class': 'event', style: 'border-left: solid 5px ' + event.color +' !important;' , text: event.title, title: event.title, 'data-index': index});
      }
      if(event.estado == 'Completada') {
        $event = $('<div/>', {'id': event.id, 'class': 'event-completada', style: 'border-left: solid 5px ' + event.color +' !important;' , text: event.title, title: event.title, 'data-index': index});
      }
    }
    //var $event = $('<div/>', {'id': event.id, 'class': 'event', style: 'border-left: solid 5px ' + event.color +' !important;' , text: event.title, title: event.title, 'data-index': index});
    var e = new Date(event.start),
        dateclass = e.toDateCssClass(),
        day = $('.' + e.toDateCssClass()),
        empty = $('<div/>', {'class':'clear event', html:' '}),
        numbevents = 0,
        time = event.start.toTimeString(),
        endday = event.end && $('.' + event.end.toDateCssClass()).length > 0,
        checkanyway = new Date(e.getFullYear(), e.getMonth(), e.getDate()+40),
        existing,
        i;

    $event.toggleClass('all-day', !!event.allDay);
    if (!!time) {
      $event.html('<strong>' + time + '</strong> ' + $event.html());
    }
    if (!event.end) {
      $event.addClass('begin end');
      $('.' + event.start.toDateCssClass()).append($event);
      return;
    }

    while (e <= event.end && (day.length || endday || options.date < checkanyway)) {
      if(day.length) {
        existing = day.find('.event').length;
        numbevents = Math.max(numbevents, existing);
        for(i = 0; i < numbevents - existing; i++) {
          day.append(empty.clone());
        }

        if(event.categoria == 'Hito') {
          let span = $('<span/>', {'style': 'color: #78DD00; float: right; font-size: 15px; margin-top: 10px; margin-right: 5px;', 'class': 'glyphicon glyphicon-star'});
          $event.append(span);
        }
        else {
          if(event.estado == "Pendiente") {
            let $div = $('<div/>', {'id': 'mostramelo', 'class': 'mostramelo'});
            let $buttonEditar = $('<button/>', {'id': 'btnEditar', 'class': 'editarTarea', 'onclick': 'editarTarea("'+event.id+'", "'+event.asignado+'", "'+event.idP+'")'});
            let $spanEditar = $('<span/>', {'class': 'glyphicon glyphicon-pencil'});
            let $buttonEliminar = $('<button/>', {'id': 'btnEliminar', 'class': 'eliminarTarea', 'onclick': 'eliminarTarea("'+event.id+'")'});
            let $spanEliminar = $('<span/>', {'class': 'glyphicon glyphicon-remove'});
            let $buttonCompletar = $('<button/>', {'id': 'btnCompletar', 'class': 'completarTarea', 'onclick': 'completarTarea("'+event.id+'")'});
            let $spanCompletar = $('<span/>', {'class': 'glyphicon glyphicon-ok'});

            $buttonEditar.append($spanEditar);
            $buttonEliminar.append($spanEliminar);
            $buttonCompletar.append($spanCompletar);

            $div.append($buttonEditar);
            $div.append($buttonEliminar);
            $div.append($buttonCompletar);

            $event.append($div);
          }
        }
        day.append($event);

        day.append(
          $event.
          toggleClass('begin', dateclass === event.start.toDateCssClass()).
          toggleClass('end', dateclass === event.end.toDateCssClass())
        );
        $event = $event.clone();
        $event.html(' ');
      }
      e.setDate(e.getDate() + 1);
      dateclass = e.toDateCssClass();
      day = $('.' + dateclass);
    }
  }
  function yearAddEvents(events, year) {
    var counts = [0,0,0,0,0,0,0,0,0,0,0,0];
    $.each(events, function (i, v) {
      if (v.start.getFullYear() === year) {
          counts[v.start.getMonth()]++;
      }
    });
    $.each(counts, function (i, v) {
      if (v!==0) {
          $('.month-'+i).append('<span class="badge">'+v+'</span>');
      }
    });
  }

  function draw() {
    $el.html(t(options));
    //potential optimization (untested), this object could be keyed into a dictionary on the dateclass string; the object would need to be reset and the first entry would have to be made here
    $('.' + (new Date()).toDateCssClass()).addClass('today');
    if (options.data && options.data.length) {
      if (options.mode === 'year') {
          yearAddEvents(options.data, options.date.getFullYear());
      } else if (options.mode === 'month' || options.mode === 'week') {
          $.each(options.data, monthAddEvent);
      } else {
          $.each(options.data, dayAddEvent);
      }
    }
  }

  draw();
  }

  ;(function (defaults, $, window, document) {
  $.extend({
    calendar: function (options) {
      return $.extend(defaults, options);
    }
  }).fn.extend({
    calendar: function (options) {
      options = $.extend({}, defaults, options);
      return $(this).each(function () {
        var $this = $(this);
        calendar($this, options);
      });
    }
  });
  })({
  days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
  months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  shortMonths: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
  date: (new Date()),
      daycss: ["c-sunday", "", "", "", "", "", "c-saturday"],
      todayname: "Hoy",
      thismonthcss: "current",
      lastmonthcss: "outside",
      nextmonthcss: "outside",
  mode: "week",
  data: []
  }, jQuery, window, document);

  })(jQuery);

  var ids = [];
  var nombres = [];
  var asignados = [];
  var categorias = [];
  var idPs = [];
  var estados = [];
  var comienzos = [];
  var data = [];
  var colores = [];

  var ruta = idProyecto;
  let semana = firebase.database().ref('/proyectos/'+ruta+'/tareas');
  semana.on('value', function(snapshot) {
  let tareas=snapshot.val();
  for(tarea in tareas) {
    ids.push(tarea);
    nombres.push(String(tareas[tarea].nombre));
    categorias.push(tareas[tarea].categoria);
    asignados.push(tareas[tarea].asignado);
    idPs.push(tareas[tarea].idP);
    estados.push(tareas[tarea].estado);
    comienzos.push(
      {
        año: tareas[tarea].año,
        mes: tareas[tarea].mes,
        dia: tareas[tarea].dia
      }
    );

    let cat = firebase.database().ref('/categorias');
    cat.on('value', function(snapshot) {
      let categorias = snapshot.val();

      for(categoria in categorias) {
        if(categorias[categoria].nombre == tareas[tarea].categoria){
          colores.push(categorias[categoria].color);
        }
      }
    })
  }

  var slipsum = [];

  //Recorro el arreglo de titulos de las tareas
  for(i = 0; i < nombres.length; i++) {
    end = new Date(comienzos[i].año, comienzos[i].mes, comienzos[i].dia, 00, 00);
    data.push({ title: nombres[i], color: colores[i], categoria: categorias[i], idP: idPs[i], id:ids[i], asignado: asignados[i], estado: estados[i], start: new Date(comienzos[i].año, comienzos[i].mes, comienzos[i].dia, 00, 00), end: end, text: ""  });
  }

  data.sort(function(a,b) { return (+a.start) - (+b.start); });
  //data must be sorted by start date

  $('td.calendar-day.current').empty();
  //Actually do everything
  $('#holder').calendar({
    data: data
  });

  //RESETEAR LAS VARIABLES
  nombres = [];
  asignados = [];
  categorias = [];
  estados = [];
  idPs = [];
  comienzos = [];
  colores = [];
  data = [];
  ids=[];
  })
