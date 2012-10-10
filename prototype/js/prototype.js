$(function(){

  /* ----------------------- Functions ------------------ */
  
  /* Main Menu */
  
  function positionMenu() {
    var menu = $('#main-menu'),
        menuW = menu.width(),
        mainW = $('#ai-wheel').width(),
        menuPos = (mainW/2) - (menuW/2);
    menu.css('left',menuPos);
  }

  /* Drawing Icons on a Circle */

  function putOnCircle(arr) {
    var parent     = arr['parent'],
        child      = parent.find(arr['child']),
        ringWidth  = $(parent).outerWidth(),
        ringHeight = $(parent).outerHeight(),
        h          = parseInt((ringWidth/2) - (child.outerWidth() / 2)),
        k          = parseInt((ringHeight/2) - (child.outerHeight() / 2)),
        step       = 2*Math.PI/child.size(),
        theta      = 0,
        r          = (ringWidth / 2) - (child.width());
      if (arr.hasOwnProperty('radius') == true) { 
        r          = arr['radius']; 
        h          = parseInt((ringWidth /2) - (child.outerWidth() / 2));
        k          = parseInt((ringWidth / 2) - (child.outerHeight() / 2));
      }

    child.each(function(){
      var x        = h + parseInt(r * Math.cos(theta)),
          y        = k - parseInt(r * Math.sin(theta));
      theta += step;
      $(this).css('top',y).css('left',x);
    });
  }
  
  /* More tools */

  function moreRad(n) {
    var value = { 1:10, 2:40, 3:45, 4:45, 5:55, 6:60, 7:70, 8:75, 9:80 };
    return value[n];
  }

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

  /* Keyboard */
  
  function arrowKeyPos() {
    var arrowkey  = $('#arrows'),
        arrowkeyW = arrowkey.width(),
        keyboardW = $('#keyboard').width();
    
    arrowkey.css('left',(keyboardW/2) - (arrowkeyW/2));
  }

  /* Spinner */
  function spinnerInput(data) {
    var key = data['key'],
        el  = data['el'];

    /* Arrow Down */
    if (key == '40') {
      spinnerVal({
        'el': el,
        'inc': -1
      });
    }
    
    /* Arrow Up */
    if (key == '38') {
      spinnerVal({
        'el': el,
        'inc': 1
      });
    }
    
    /* Spacebar */
    if (key == '13') { 
      el
        .toggleClass('edit')
        .toggleClass('visible'); 
    }
  }

  function spinnerVal(data) {
    var el  = data['el'],
        inc = data['inc'],
        value = el.find('.value').text(),
        inputValue = el.find('input').val(),
        val = parseInt(value) + inc;

    if (inputValue != value) { val = parseInt(inputValue) + inc; }
    if (/%/i.test(value)) { val = val + '%'; }
    
    el.find('input').val(val);
    el.find('.value').text(val);
  }

  function miniMenu() {
    var i = 0;
    $('#main-menu .menu.first ul li').each(function(){
      i++;
      var parent    = $(this).parent(),
          miniMenu  = $('<div class="miniMenu" index="' + i + '" />').css('top',((i-1)*8) + 4);
      $(this).attr('index',i);
      parent.append(miniMenu);
      $(this).bind('hover',function(){
        var index = $(this).attr('index');
        $('.miniMenu').removeClass('hover');
        $(this).parent().find('li').removeClass('hover');
        $('.miniMenu[index="' + index + '"]').addClass('hover');
      });
      $('.miniMenu').bind('hover',function(){
        var index = $(this).attr('index');
        $('.miniMenu').removeClass('hover');
        $(this).parent().find('li').removeClass('hover');
        $(this).parent().find('li[index="' + index + '"]').addClass('hover');
      });
    });
  }

  /* --------------------- End Functions ---------------- */

  /* Main Menu */
  
  positionMenu();
  $('#main-menu .ai').click(function(){
    $('#main-menu').addClass('visible');
  });

  miniMenu();
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

  /* Second Ring */

  putOnCircle({'parent':$('#secondRing'),'child':$('.icon-container')});
  
  $('.more-tools').each(function(){
    var icon            = $(this).find('.icon'),
        totalIcons      = icon.size(),
        rad             = moreRad(totalIcons);
      
      $(this).find('.more-ring')
        .css('width'        ,(rad * 2))
        .css('height'       ,(rad * 2))
        .css('top'          ,(rad * -1))
        .css('left'         ,(rad * -1))
        .css('border-radius',(rad));
    
    putOnCircle({
      'parent':$(this).find('.more-ring'),
      'child':$(this).find('.more-ring .icon')});
  });
  
  /* Icon Container More Tools Menu */

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

  /* Keyboard */
  
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

  /* Spinner */

  $('html').click(function(){
    $('.spinner').each(function() {
      var spinner = $(this);
      if (spinner.hasClass('visible')) {
        spinner.toggleClass('visible').removeClass('edit');
      }
    });
  });

  $('html').on('keydown',function(event){
    $('.spinner').each(function(){
      if ($(this).is(':visible') && !$(this).hasClass('edit') && $(this).hasClass('visible')) {
        spinnerInput({'key':event.which,'el': $(this)});
      }
    });
  }); 
  $('.spinner').click(function(event){
    event.stopPropagation();
  });

  
  $('.spinner .value').click(function(event){
    var input   = $(this).parents('.spinner').find('input'),
        spinner = $(this).parents('.spinner'),
        value   = $(this).parents('.spinner').find('.value').text();

    spinner.toggleClass('edit');
    input.focus().val(value);
    
    event.stopPropagation();
  });

  $('.spinner input').click(function(event){
    event.stopPropagation();
  });


  $('.spinner').on('keydown',function(event){
    spinnerInput({'key': event.which, 'el': $(this)});
  });

  $('.spinner .handle').click(function(event){
    event.stopPropagation();
  });

  /* Buttons and Icons that Spawn the Spinner */
  $('#keyboard .undo.key-container').click(function(event){
    $('#keyboard .undo.spinner').toggleClass('visible');
    event.stopPropagation();
  });

  $('.icon-container .icon.zoom').click(function(event){
    $('.zoom.spinner').toggleClass('visible');
    event.stopPropagation();
  });

  /* Outter Wheel */
  
  putOnCircle({'parent':$('#outter-ring'),'child':$('.icon-container')});
});