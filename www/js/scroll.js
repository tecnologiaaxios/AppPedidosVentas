/* Ajax functions */
jQuery(document).ready( function($){

  revealPosts();

  //var last_scroll = 0;

  $(document).on('click', '.load-more:not(.loading)', function(){

    var that = $(this);
    var page = $(this).data('page');
    var newPage = page+1;
    var ajaxurl = that.data('url');

    that.addClass('loading').find('.text').slideUp(320);
    that.find('.fa').addClass('fa-spin');

    $.ajax({
        url : ajaxurl,
        type : 'post',
        data : {

          page : page,
          action : 'load_more'
        },
        error : function( response ){
          console.log(response);
        },
        success : function( response ){

          setTimeout(function(){

            that.data('page', newPage);
            $('.posts-container').append( response );

  					that.removeClass('loading').find('.text').slideDown(320);
  					that.find('.fa').removeClass('fa-spin');

            revealPosts();

  				}, 1000);
        }
    });

  });

  $(document).on('click', '.load-more-category:not(.loading)', function(){

    var that = $(this);
    var page = $(this).data('page');
    var cat = $(this).data('cat');
    var newPage = page+1;
    var ajaxurl = that.data('url');

    that.addClass('loading').find('.text').slideUp(320);
    that.find('.fa').addClass('fa-spin');

    $.ajax({
        url : ajaxurl,
        type : 'post',
        data : {

          page : page,
          cat : cat,
          action : 'load_more_category'
        },
        error : function( response ){
          console.log(response);
        },
        success : function( response ){

          setTimeout(function(){

            that.data('page', newPage);
            $('.posts-container').append( response );

  					that.removeClass('loading').find('.text').slideDown(320);
  					that.find('.fa').removeClass('fa-spin');

            revealPosts();

  				}, 1000);
        }
    });

  });

  /*$(window).scroll(function() {

    var scroll = $(window).scrollTop();

    if( Math.abs( scroll - last_scroll ) > $(window).height()*0.1 ) {
      last_scroll = scroll;

      $('.page-limit').each(function( index ) {

        if( isVisible( $(this) ) ) {

          history.replaceState( null, null, $(this).attr("data-page") );
          return (false);

        }

      });
    }

  });*/


  /*helper functions */
  function revealPosts() {

    var posts = $('article:not(.reveal)');
    var i = 0;

    setInterval(function(){

      if(i>=posts.length) return false;

      var el = posts[i];
      $(el).addClass('reveal');

      i++;

    }, 200);
  }

  /*function isVisible( element ) {

    var = scroll_pos = $(window).scrollTop();
    var window_height = $(window).height();
    var el_top = $(element).offset().top;
    var el_height = $(element).height();
    var el_bottom = el_top + el_height;

    return ( ( el_bottom - el_height*0.25 > scroll_pos) && ( el_top < ( scroll_pos+0.5*window_height) ) )
  }*/

});
