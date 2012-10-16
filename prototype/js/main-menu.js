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
  menuHub.position = function(child,parent) {
    var childW   = child.width(),
        mainW   = parent.width(),
        menuPos = (mainW/2) - (childW/2);
    child.css('left',menuPos);
  };

  menuHub.bind = function() {
    $('#menu-hub *').on('contextmenu',function(event){ return false; });
    $('#menu-hub .ai').click(function(){ 
      $('#menu-hub').addClass('visible'); 
      $('#menu-quickpick').addClass('active');
    });
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
        menuRoot.dragndrop.init($(menuChild));
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

  // Drag and Drop Functionality
  menuRoot.dragndrop = {};
  menuRoot.dragndrop.drag = function (el,e) {
    if (el.hasClass('drag') && el.find('drag').size() > 0) { 
      el.removeClass('drag'); 
      el = el.find('drag'); 
    }
    if (el.hasClass('drag')) {
      var mouse   = {},
          offset  = e.pageX - el.offset().left;
          mouse.x = e.pageX;
          mouse.y = e.pageY;
      // Check to see that the mouse has moved atleast 5px
      // so that we know a drag was intentional
      if (offset > 5 || offset < -5) {
        var dragClone = $('#drag-clone');
        if (dragClone.size() <= 0) {
          // Creating a temporary element to get the correct width
          var text = $.trim(el.clone().children().remove().end().text()),
              tempElem = $('<span>' + text + '</span>').hide().appendTo('body'),
              width = tempElem.width();
          if (width < 60) { width = 60; }
          tempElem.remove();
          el
            .clone()
            .appendTo('body')
            .attr('id','drag-clone')
            .width(width);
        }
        if (dragClone.size() > 0) {
          var picks = $('#menu-quickpick .pick');
          var inrect = function(object) {
            var mousex = object.mousex,
                mousey = object.mousey,
                left   = object.left,
                top    = object.top,
                bottom = object.bottom,
                right  = object.right;
            if (mousex > left && mousey > top && mousey < bottom && mousex < right) { return true }
            return false;
          };
          for (var i = 0;i<picks.size();i++) {
            var pick        = {};
                pick.el     = picks.eq(i);
                pick.left   = pick.el.offset().left;
                pick.top    = pick.el.offset().top;
                pick.bottom = pick.el.offset().top + pick.el.height();
                pick.right  = pick.el.offset().left + pick.el.width();
            if (inrect({'mousex':mouse.x,'mousey':mouse.y,'left':pick.left,'top':pick.top,'right':pick.right,'bottom':pick.bottom})) {
              $('.drag-into').removeClass('drag-into');
              pick.el.addClass('drag-into'); 
            }
          }
          dragClone.css('left',mouse.x).css('top',mouse.y); 
        }
      }
    }
  }
  menuRoot.dragndrop.drop = function (el) {
    if (el.hasClass('drag')) {
      var dragClone = $('#drag-clone');
      if (dragClone.size() > 0) { 
        // Remove Clone if it hasn't been dragged into anything
        if ($('.drag-into').size() < 1) {
          var left = el.offset().left,
              top = el.offset().top;
          dragClone.animate({'left':left,'top':top},200,function() {
            dragClone.fadeOut(100,function() { 
              dragClone.remove(); 
            });
          }); 
        }
        if ($('.drag-into').size() > 0) {
          dragInto = $('.drag-into');
          var offset = dragInto.width() - dragClone.width(),
              right   = offset + parseInt(dragInto.css('right'));
              left   = offset + parseInt(dragInto.css('left'));
          console.log(offset + ' ' + right);
          dragClone
            .appendTo(dragInto)
            .css('position','relative')
            .css('left','')
            .css('top','')
            .removeAttr('id');
          dragInto.width(dragClone.width()).css('right',right).css('left',left);
        }
      }
      el.removeClass('drag');
    }
  }
  menuRoot.dragndrop.init = function(element) {
    element.find('li').each(function(e){
      var el = $(this);
      // Make element dragable when it's clicked
      el.on('mousedown',function(e){
        $(e.target).addClass('drag');
      });
      // When the mouse is released undrag object
      $('html').on('mouseup',function(e){
        menuRoot.dragndrop.drop(el);
      });
      $('html').on('mousemove',function(e){
        menuRoot.dragndrop.drag(el,e)
      });
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
    menuRoot.quickPick.create();
  
  };

  // Quick Pick Menu

  menuRoot.quickPick = {};
  menuRoot.quickPick.create = function() {
    $('#menu-quickpick .container').each(function() {
      $(this).find('.pick').each(function(n) {
        $(this).css('top',40*n);
      });
    });
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
  menuHub.position($('#menu-hub'),$('#ai-wheel'));
  menuHub.position($('#menu-quickpick'),$('#main-wheel'));
  menuRoot.loadDropdown();
}); 
