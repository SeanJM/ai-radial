$(function(){
  
  // Templating
  var template = {};
  template.load = function (data,callback) {
    var cache           = $('<div />'),
        templateAddress = './templates/' + data['template-file'] + '.html' + ' ' + data['template'],
        newCache;
    cache.load(templateAddress,function() {
      newCache = cache.replaceWith(cache.contents());
      newCache.appendTo(data['parent']);
      if (callback) { callback(newCache); }
    });
  };

  // Main Menu
  var menuHub = {};
  menuHub.position = function() {
    var menu    = $('#menu-hub'),
        menuW   = menu.width(),
        mainW   = $('#ai-wheel').width(),
        menuPos = (mainW/2) - (menuW/2);
    menu.css('left',menuPos);
  };

  menuHub.bind = function() {
    $('#menu-hub *').on('contextmenu',function(event){ return false; });
    $('#menu-hub .ai').click(function(){ $('#menu-hub').addClass('visible'); });
  };

  // Menu Root (Secondary Menu)
  var menuRoot = {};
  menuRoot.child = {};
  menuRoot.loadDropdown = function() {
    $('.menu-root').each(function(){
      var menuChild = '#' + $(this).attr('menu'),
          parent    = $(this);
      console.log('Loading Dropdown menu for: ' + menuChild);
      template.load(
      {
        'template-file':'menu',
        'template':menuChild,
        'parent':parent
      },function() {
        menuRoot.quickMenu.manager($(menuChild));
        menuRoot.child.bind(parent);
        menuRoot.child.levels(parent);
        menuRoot.configure.rightClick($(menuChild));
      });
    });
  }
  
  // Menu Root Children 
  menuRoot.child.bind = function(root) {
    root.on('click',function(e){
      $('.menu-root-child.visible').removeClass('visible');
      var childList  = $(this).children('ul');
      childList.addClass('visible');
      childList.children('.mini-menu-container').height(childList.height());
      e.stopPropagation();
    });
    $('html').on('click',function(){ root.children('ul').removeClass('visible'); });
  };

  menuRoot.child.levels = function(root) {
    root.find('ul').each(function(){
      var level = $(this).parents('ul').length;
      $(this).attr('level',level);
    });
  };

  // Create Object for miniMenu Functions
  menuRoot.quickMenu = {};
  menuRoot.quickMenu.create = function(root) {
    var li        = root.find('li'),
        i         = 0,
        quickContainer = $('<div class="mini-menu-container">');
    li.each(function(){
      i++;
      var clss        = $(this).attr('class'),
          marker      = $(this).find('.marker'),
          miniMenu    = $('<div class="miniMenu" index="' + i + '"><div class="innerShadow"></div></div>').addClass(clss),
          disclosure  = $('<span class="disclosure" />');
      
      if (marker.size()) { 
        var markerColor = marker.attr('class').replace('marker','').trim();
        miniMenu.attr('class','miniMenu ' + markerColor); 
      }

      $(this).attr('index',i);
      if ($(this).find('ul').size()) { $(this).append(disclosure); }
      quickContainer.append(miniMenu);
    });

    root.append(quickContainer);
  };

  menuRoot.quickMenu.liBind = function(root) {
    var li = root.find('li');
    /* Activate Sub menu */
    li.on('mouseover',function(){
      if ($(this).children('ul').size()) { 
        var offset          = parseInt($(this).parent().css('width'))-4,
            level           = $(this).children('ul').attr('level');
            vertical_offset = $(this).outerHeight() * -1,
            subMenu         = $(this).children('ul'),
            width           = subMenu.find('li').width();
        
        if (level > 1 && level%2 == 1) { offset = (parseInt($(this).parent().css('width'))*-1)+4; }
        if (!subMenu.hasClass('visible')) {
          subMenu
            .addClass('visible')
            .css('left',offset)
            .css('top',vertical_offset);
        } 
      }
    });
    
    li.on('miniover',function(){

      $(this).parent().find('ul.visible').removeClass('visible');

      if ($(this).children('ul').size()) { 
        var index             = $(this).attr('index'),
            subMenu           = $(this).children('ul'),
            miniMenu          = $(this).parent().find('.miniMenu[index="' + index + '"]');
            vertical_offset   = miniMenu.outerHeight() + parseInt(miniMenu.css('margin-bottom')) + parseInt(miniMenu.css('margin-top')),
            vertical_position = ($(this).position()['top'] * -1) + (miniMenu.position()['top'] - miniMenu.outerHeight()),
            horizontal_offset = '-8px';
        
        if ($('#menu-hub').hasClass('right-handed')) {
          horizontal_offset = parseInt($(this).parents('.menu-root-child').css('padding-right')) * -1;
        }
        if ($('#menu-hub').hasClass('left-handed')) {
          horizontal_offset = parseInt($(this).parents('.menu-root-child').css('padding-right')) - 5;
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

  };

  menuRoot.quickMenu.hoverHighlight = function(root) {
    var mini           = root.find('.miniMenu'),
        li             = root.find('li'),
        clearHighlight = function(element) { element.parents('ul').find('.hover').removeClass('hover'); };

    li.on('hover',function(){
      var index  = $(this).attr('index'),
          parent = $(this).parent();
      
      clearHighlight($(this));
      parent.find('.miniMenu[index="' + index + '"]').addClass('hover');
      
    });

    mini.on('mouseover',function(){
      var index  = $(this).attr('index'),
          parent = $(this).parents('ul');
      
      clearHighlight($(this));
      parent.find('li[index="' + index + '"]').addClass('hover').trigger('miniover');

    });

  };

  menuRoot.quickMenu.manager = function(root) {
    
    menuRoot.quickMenu.create(root);
    menuRoot.quickMenu.liBind(root);
    menuRoot.quickMenu.hoverHighlight(root);
  
  };


  // Right Click Configuration Menu
  menuRoot.configure = {};
  menuRoot.configure.rightClick = function(menuRootChild) {
    menuRootChild.find('li').on('mousedown',function(event){
      /* Right Click Options */
      var selectedItem = $(this);
      if (event.which == 3) {
        menuRoot.configure.create({'element': selectedItem,'mouse':event});
      }
    });
  };

  menuRoot.configure.create = function(data) {
    var el      = data['element'],
        cache   = $('<div />'),
        menu    = '#configure-menu';
    
    /* Check to see if it exists */
    if ($(menu).size() < 1) { 
      template.load({'template-file':'menu','template':menu,'parent':'body'},function() { menuRoot.configure.bind(data); }); 
    }
    menuRoot.configure.bind(data);
  };

  menuRoot.configure.bind = function(data) {
    var el    = data['element'],
        index = el.attr('index'),
        mini  = el.parents('#menu-hub').find('.miniMenu[index="' + index + '"]'),
        menu  = $('#configure-menu');

    el.addClass('select');

    menu.on('contextmenu',function(){ return false; });
    menu.css('top',data['mouse'].pageY-10).css('left',data['mouse'].pageX-10);
    menu.find('.mark').off('click');
    menu.find('.mark').on('click',function(event){
      var color = $(this).attr('class').replace('mark','').replace('color','').trim();
      el.find('.marker').attr('class','marker ' + color);
      mini.attr('class','miniMenu ' + color);
      // Stops the root menu child from closing
      event.stopPropagation();
    });
    
    function hideMenu() {
      if (menu.is(':visible')) { menu.hide(); }
      el.removeClass('select');
    } 
    menu.on('click',function(event) { 
      hideMenu(); 
      // Stops the root menu child from closing
      event.stopPropagation();
    });
    menu.on('mouseleave',function(){ hideMenu(); });

    if (menu.is(':hidden')) { menu.show(); }

    $('#hide-entry').off('click');
    $('#hide-entry').on('click',function(event){
      el.addClass('hidden');
      mini.addClass('hidden');
      // Stops the root menu child from closing
      event.stopPropagation();
    });

    $('#show-hidden').off('click');
    $('#show-hidden').on('click',function(event){
      el.parent().find('.hidden').removeClass('hidden');
      mini.parent().find('.hidden').removeClass('hidden');
      // Stops the root menu child from closing
      event.stopPropagation();
    });

  };

  menuHub.bind()
  menuHub.position();
  menuRoot.loadDropdown();
}); 
