$(function(){
  
  function positionMenu() {
    var menu    = $('#main-menu'),
        menuW   = menu.width(),
        mainW   = $('#ai-wheel').width(),
        menuPos = (mainW/2) - (menuW/2);
    menu.css('left',menuPos);
  }

  function miniMenu() {
    var i           = 0,
        ul          = $('#main-menu .menu.first ul'),
        li          = $('#main-menu .menu.first ul li'),
        firstLayer  = $('#main-menu > ul > li');
    
    ul.each(function(){
      var li = $(this).find('li');
      li.each(function(){
        i++;
        
        var container = $(this).parent().find('.mini-menu-container'),
            clss      = $(this).attr('class'),
            marker    = $(this).find('.marker'),
            miniMenu  = $('<div class="miniMenu" index="' + i + '"><div class="innerShadow"></div></div>').addClass(clss),
            disclosure= $('<span class="disclosure" />');
        
        if (marker.size()) { 
          var markerColor = marker.css('background-color'); 
          miniMenu.css('background-color',markerColor);
        }

        $(this).attr('index',i);
        if ($(this).find('ul').size()) {
          $(this).append(disclosure);
        }
        container.append(miniMenu);
      });
      
    });

    li.on('hover',function(){
      var index   = $(this).attr('index'),
          parent  = $(this).parent();

      parent.find('.miniMenu').removeClass('hover');
      parent.find('li').removeClass('hover');
      parent.find('.miniMenu[index="' + index + '"]').addClass('hover');
      
    });

    /* Activate Sub menu */
    
    li.on('mouseover',function(){
      if ($(this).children('ul').size()) { 
        var offset          = parseInt($(this).parent().css('width')) - 4,
            vertical_offset = $(this).outerHeight() * -1,
            subMenu         = $(this).children('ul'),
            width           = subMenu.find('li').width();
        
        if (!subMenu.hasClass('visible')) {
          subMenu
            .addClass('visible')
            .css('left',offset)
            .css('top',vertical_offset);
        } 
      }
    });

    li.on('miniover',function(){

      $(this)
        .parent().find('ul.visible').removeClass('visible');

      if ($(this).children('ul').size()) { 
        var index             = $(this).attr('index'),
            subMenu           = $(this).children('ul'),
            miniMenu          = $(this).parent().find('.miniMenu[index="' + index + '"]');
            miniMenuPos       = miniMenu.position()['top'];
            horizontal_offset = '-8px',
            vertical_offset   = miniMenu.outerHeight() + parseInt(miniMenu.css('margin-bottom')),
            vertical_position = ($(this).position()['top'] * -1) + (miniMenuPos - miniMenu.outerHeight());
        
        subMenu
          .addClass('visible')
          .css('left',horizontal_offset)
          .css('top',vertical_position);

      }


    });

    li.on('mouseleave',function(){
      var index     = $(this).attr('index'),
          miniMenu  = $(this).parent().find('.miniMenu[index="' + index + '"]');

      miniMenu.removeClass('hover');
      
      if ($(this).children('ul').size()) { 
        $(this)
          .children('ul')
          .removeClass('visible')
          .trigger('minileave');
      }
    });

    $('.miniMenu').on('mouseover',function(){
      var index   = $(this).attr('index'),
          parent  = $(this).parents('ul');
      
      parent.find('.miniMenu').removeClass('hover');
      parent.find('li').removeClass('hover');
      
      parent.find('li[index="' + index + '"]')
        .addClass('hover')
        .trigger('miniover');
    });
    
    firstLayer.on('click',function(e){
      $(this).children('ul').toggleClass('visible');
    });

    $('html').on('click',function(){
      if (firstLayer.find('.visible').size() > 0) {
        /*firstLayer.find('.visible').removeClass('visible');*/
      }
    });
  }

  $('#main-menu ul.menu.first .container > li').on('mousedown',function(event){
    /* Right Click Options */
    if (event.which == 3) { 
      console.log(event.which);
      event.preventDefault();
    }
  });
  $('#main-menu ul.menu.first .container > li').on('contextmenu',function(event){
    return false;
  });
  positionMenu();
  $('#main-menu .ai').click(function(){
    $('#main-menu').addClass('visible');
  });

  miniMenu();
});  
