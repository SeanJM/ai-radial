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
          var markerColor = marker.attr('class').replace('marker','').trim(); 
          miniMenu.attr('class','miniMenu ' + markerColor);
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
            vertical_offset   = miniMenu.outerHeight() + parseInt(miniMenu.css('margin-bottom')),
            vertical_position = ($(this).position()['top'] * -1) + (miniMenuPos - miniMenu.outerHeight()),
            horizontal_offset = '-8px';
        
        if ($('#main-menu').hasClass('right-handed')) {
          horizontal_offset = parseInt($(this).parents('.menu-root').css('padding-right')) * -1;
        }
        if ($('#main-menu').hasClass('left-handed')) {
          horizontal_offset = parseInt($(this).parents('.menu-root').css('padding-right')) - 5;
        }
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
  function load_template(data,callback) {
    var cache = $('<div />'),
        templateAddress = './templates/' + data['template-file'] + '.html' + ' ' + data['template'],
        newCache;
    if ($(data['template']).size)
    cache.load(templateAddress,function() {
      newCache = cache.replaceWith(cache.contents());
      newCache.appendTo(data['parent']);
      if (callback) {
        callback(newCache);
      }
    });
  }

  load_template(
    {
      'template-file':'menu',
      'template':'#file-menu',
      'parent':'#main-menu .menu.first li.file'
    },function() {

      miniMenu(); 
      bindConfigureMenu();

    });
  
  function menuBind(data) { 
    var el    = data['element'],
        index = el.attr('index'),
        mini  = el.parents('#main-menu').find('.miniMenu[index="' + index + '"]'),
        menu  = $('#configure-menu');

    el.addClass('select');

    menu.on('contextmenu',function(){ return false; });
    menu.css('top',data['mouse'].pageY-10).css('left',data['mouse'].pageX-10);
    menu.find('.mark').off('click');
    menu.find('.mark').on('click',function(){
      var color = $(this).attr('class').replace('mark','').replace('color','').trim();
      el.find('.marker').attr('class','marker ' + color);
      mini.attr('class','miniMenu ' + color);
    });
    
    function hideMenu() {
      if (menu.is(':visible')) { menu.hide(); }
      el.removeClass('select');
    } 
    menu.on('click',function (){ hideMenu(); });
    menu.on('mouseleave',function(){ hideMenu(); });

    if (menu.is(':hidden')) { menu.show(); }

    $('#hide-entry').off('click');
    $('#hide-entry').on('click',function(){
      el.addClass('hidden');
      mini.addClass('hidden');
    });

    $('#show-hidden').off('click');
    $('#show-hidden').on('click',function(){
      el.parent().find('.hidden').removeClass('hidden');
      mini.parent().find('.hidden').removeClass('hidden');
    });

  }

  function bindConfigureMenu() {
    $('#main-menu ul.menu.first .container > li').on('mousedown',function(event){
      /* Right Click Options */
      if (event.which == 3) {
        configureMenu({'element': $(this),'mouse':event});
      }
    });
  }

  function configureMenu(data) {
    var el      = data['element'],
        cache   = $('<div />'),
        menu    = '#configure-menu';
    

    /* Check to see if it exists */
    if ($(menu).size() < 1) { 
      load_template({'template-file':'menu','template':menu,'parent':'body'},function() { menuBind(data); }); 
    }

    menuBind(data);
  }

  $('#main-menu *').on('contextmenu',function(event){ return false; });
  $('#main-menu .ai').click(function(){
    $('#main-menu').addClass('visible');
  });
  positionMenu();
}); 
