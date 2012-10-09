$(function(){
  /* Position Rings */
  $('.ring').each(function(){
    var outterRingW   = $('#outter-ring').width()/2,
        innerRingW    = $(this).width()/2,
        innerRingPos  = outterRingW-innerRingW;
    
    $(this)
      .css('left',innerRingPos)
      .css('top',innerRingPos);
  });
  
  $('#fillStroke').click(function(){
    $(this).toggleClass('stroke');
    $('#microFillControl').toggleClass('stroke');
  });
  
  $('#swapFillStroke').click(function(){
    $('#fillStroke').toggleClass('swap');
  });
  
  $('#dFillStroke').click(function(){
    $('#fillStroke').addClass('default');
  });
  
  $('#drawModes').click(function(){
    if ($(this).hasClass('front')) {
      $(this).removeClass('front').addClass('behind');
      return false;
    }
    if ($(this).hasClass('behind')) {
      $(this).removeClass('behind').addClass('clip');
      return false;
    }
    if ($(this).hasClass('clip')) {
      $(this).removeClass('clip').addClass('front');
      return false;
    }
  });

  function putOnCircle(arr) {
    var parent = arr['parent'];
    var child = arr['child'];
    var ringWidth       = $(parent).outerWidth(),
        ringHeight      = $(parent).outerHeight(),
        h               = parseInt((ringWidth/2) - (child.outerWidth() / 2)),
        k               = parseInt((ringHeight/2) - (child.outerHeight() / 2)),
        step            = 2*Math.PI/child.size(),
        theta           = 0,
        r               = (ringWidth / 2) - (child.width());
      if (arr.hasOwnProperty('radius') == true) { 
        r               = arr['radius']; 
        h               = parseInt((ringWidth /2) - (child.outerWidth() / 2));
        k               = parseInt((ringWidth / 2) - (child.outerHeight() / 2));
      }
    child.each(function(){
      var x             = h + parseInt(r * Math.cos(theta)),
          y             = k - parseInt(r * Math.sin(theta));
      theta += step;
      $(this).css('top',y).css('left',x);
    });
  }
  /* Second Ring */
  putOnCircle({'parent':$('#secondRing'),'child':$('.icon-container')});
  
  /* More tools */
  
  $('#secondRing .more-tools').each(function(){
    var icon            = $(this).find('.icon'),
        totalIcons      = icon.size(),
        rad             = (totalIcons * (icon.width() + 10)) / 1.7;

    $(this).find('.more-ring')
      .css('width',(rad * 2))
      .css('height',(rad * 2))
      .css('top',(rad * -1))
      .css('left',(rad * -1))
      .css('border-radius',(rad));
    
    putOnCircle({
      'parent':$(this).find('.more-ring'),
      'child':$(this).find('.more-ring .icon')});
  });
  
  /* Icon Container More Tools Menu */
  function moretools(data) {
    var el        = data['target'],
        event     = data['event'],
        morering  = el.find('.more-ring'),
        timer;
    
    if (event == 'init') {
      setTimeout(function(){
        /* Check to make sure the mouse is down */
        if (el.hasClass('mousedown')) {
          el.addClass('show-tools');
        }
      },200);
    }
    
    if (event == 'leave') {
      if (morering.is(':visible')) {
        el.addClass('hide-tools');
      setTimeout(function(){
        /* Check to make sure the mouse is down */
          el.removeClass('hide-tools');
          el.removeClass('show-tools');
        },200);
      }
    }
  
  }

  $('.icon-container').on('mousedown',function(){
    $(this).addClass('mousedown');
    moretools({
      'target'  : $(this),
      'event'   : 'init'
    });
  });

  $('.icon-container').on('mouseup',function(){
    $(this).removeClass('mousedown');
  });

  $('.icon-container').on('mouseleave',function(){
    $(this).removeClass('mousedown');
    moretools({
      'target'  : $(this),
      'event'   : 'leave'
    });
  });

  $('.icon-container').click(function(){
    $('.icon-container.selected').removeClass('selected');
    $(this).addClass('selected');
  });

  $('.icon-container .more-ring .icon').on('click',function(){
    var selectedIcon  = $(this),
        replaceIcon   = $(this).parents('.icon-container').find('.icon:first');
    replaceIcon.replaceWith(selectedIcon.clone());
    
    moretools({
      'target'  : $(this).parents('.icon-container'),
      'event'   : 'leave'
    });
  });
  
  function arrowKeyPos() {
    var arrowkey  = $('#arrows'),
        arrowkeyW = arrowkey.width(),
        keyboardW = $('#keyboard').width();
    
    arrowkey.css('left',(keyboardW/2) - (arrowkeyW/2));
  }
  
  /* Position the arrow keys */
  arrowKeyPos();
  
  $('.key-container').hover(function(){
    $(this).addClass('hover');
  },function(){
    $(this).removeClass('hover');
  });

  /* Toggle the Alt, Ctrl and Shift Keys */
  $('#keyboard .toggle-key').click(function(){
    $(this).toggleClass('toggled');
    
  });

  /* Undo & Redo spinner */
  $('html').click(function(){
    var spinner = $('#keyboard .undo.spinner');
    if (spinner.hasClass('visible')) {
      spinner.toggleClass('visible');
    }
  }); 

  $('#keyboard .undo.key-container').click(function(event){
    $('#keyboard .undo.spinner').toggleClass('visible');

    event.stopPropagation();
  });

  $('#keyboard .spinner .value').click(function(event){
    var input   = $(this).parents('.spinner').find('input'),
        spinner = $(this).parents('.spinner');

    input.focus().val(input.val());
    spinner.toggleClass('edit');
    
    event.stopPropagation();
  });

  $('#keyboard .spinner input').click(function(event){
    event.stopPropagation();
  });

  $('#keyboard .spinner input').keyup(function(event){
    var key = event.which;
    if (key == '13') { 
      var spinner = $(this).parents('.spinner');
      spinner
        .toggleClass('edit')
        .toggleClass('visible'); 
    }
  });

  $('#keyboard .spinner .handle').click(function(event){
    event.stopPropagation();
  });

});