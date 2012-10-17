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
  var menu = {};
  menu.position = function(child,parent) {
    var childW   = child.width(),
        mainW   = parent.width(),
        menuPos = (mainW/2) - (childW/2);
    child.css('left',menuPos);
  }

  menu.rightClick = function(root) {
    console.log(root);
    root.find('li').each(function() {
      $(this).on('mousedown',function(event){
        /* Right Click Options */
        if (event.which == 3) {
          menuRoot.configure.create({'element': $(event.target),'mouse':event});
        }
      });
    });
  }

  menu.levels = function (root) {
    root.find('ul').each(function(){
      var level = $(this).parents('ul').length;
      $(this).attr('level',level);
    });
  }

  menu.disclosure = function (root) {
    root.find('li > ul').each(function(){ 
      var disclosure  = $('<span class="disclosure" />');
      $(this).parent().append(disclosure); 
    });
  }

  menu.minihover = function (element) {

    element.parent().find('ul.visible').removeClass('visible');
    if (element.children('ul').size()) { 
      var index             = element.attr('index'),
          subMenu           = element.children('ul'),
          miniMenu          = element.parent().find('.miniMenu[index="' + index + '"]');
          vertical_offset   = miniMenu.outerHeight() + parseInt(miniMenu.css('margin-bottom')) + parseInt(miniMenu.css('margin-top')),
          horizontal_offset = '-8px';
      if (element.position()['top']) { var vertical_position = (element.position()['top'] * -1) + (miniMenu.position()['top'] - miniMenu.outerHeight()); }
      
      if ($('#menu-hub').hasClass('right-handed')) {
        horizontal_offset = parseInt(element.parents('.menu-root-child').css('padding-right')) * -1;
      }
      if ($('#menu-hub').hasClass('left-handed')) {
        horizontal_offset = parseInt(element.parents('.menu-root-child').css('padding-right')) - 5;
      }
      subMenu
        .addClass('visible')
        .css('left',horizontal_offset)
        .css('top',vertical_position);
    }
  }
  menu.popOut = function (root) {
    var li = root.find('li');
    li.each(function(){
      $(this).on('mouseover',function(){
        if ($(this).children('ul').size()) { 
          var offset          = parseInt($(this).parent().css('width'))-4,
              level           = $(this).children('ul').attr('level');
              vertical_offset = $(this).outerHeight() * -1,
              subMenu         = $(this).children('ul'),
              width           = subMenu.find('li').width();
          
          if (level > 1 && level%2 == 1) { offset = (parseInt($(this).parent().css('width'))*-1)+4; }
          if (!subMenu.hasClass('visible')) {
            subMenu.addClass('visible').css('left',offset).css('top',vertical_offset);
          } 
        }
      });
    });
  }
  
  menu.visibility = function(root) {
    root.on('click',function(e){
      $('.menu-root-child.visible').removeClass('visible');
      var target = $(e.target);

      target.children('ul').each(function() { $(this).addClass('visible'); });
      // Scale all the quick menus
      target.find('ul').each(function() { $(this).children('.mini-menu-container').height($(this).height()); });

      e.stopPropagation();
    });
    $('html').on('click',function(){ root.children('ul').removeClass('visible'); });
  };

  // Quick Menu
  menu.quickMenu = {};
  menu.quickMenu.init = function (root) {
    menu.quickMenu.create(root);
    menu.quickMenu.bind(root);
    menu.quickMenu.hover(root);
  }

  menu.quickMenu.create = function (root) {
    root.find('ul').each(function(){
      var 
        li             = $(this).children('li'),
        quickContainer = $('<div class="mini-menu-container">'),
        markerTmplt    = '<span class="marker"></span>';
      
      li.each(function(){
        var 
          clss     = $(this).attr('class'),
          miniMenu = $('<div class="miniMenu" index="' + $(this).index() + '"><div class="innerShadow"></div></div>').addClass(clss),
          marker   = $(this).find('.marker'),
          markerColor;
        
        $(this).attr('index',$(this).index());
        
        if (marker.size() < 1) { 
          marker = $(markerTmplt); 
          $(this).prepend(marker); 
        }
        
        markerColor = marker.attr('class').replace('marker','').trim();
        miniMenu.attr('class','miniMenu ' + markerColor);
        
        quickContainer.append(miniMenu);
      });

      $(this).append(quickContainer);
    
    });
  }

  menu.quickMenu.bind = function(root) {
    var li = root.find('li');
    /* Activate Sub menu */

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
  }

  menu.quickMenu.hover = function(root) {
    var mini           = root.find('.miniMenu'),
        li             = root.find('li'),
        clearHighlight = function(element,index) { 
          element.closest('ul')
            .find('.hover').removeClass('hover').end()
            .find('[index="' + index + '"]').addClass('hover');
        };

    li.on('hover',function(){
      var index  = $(this).attr('index');
      clearHighlight($(this),index);
    });

    mini.each(function() {
      $(this).on('mouseover',function(){
        var index  = $(this).attr('index');
        clearHighlight($(this),index);
        menu.minihover($(this).closest('ul').children('li[index="' + index + '"]'));
      });
    });
  }
  
  // Menu Hub
  var menuhub = {};
  menuhub.bind = function() {
    $('#menu-hub *').on('contextmenu',function(event){ return false; });
    $('#menu-hub .ai').click(function(e){ 
      $('#menu-hub').addClass('visible'); 
      $('#menu-quickpick').addClass('active');
      e.stopPropagation();
    });
    $('html').on('click',function() {
      $('#menu-hub').removeClass('visible');
    });
  };

  menuhub.init = function () {
    menuhub.bind();
    menu.position($('#menu-hub'),$('#ai-wheel'));
  }

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
        menu.visibility(parent);
        menu.levels(parent);
        menu.quickMenu.init(parent);
        menu.popOut(parent);

        menu.disclosure($(menuChild));
        menu.rightClick($(menuChild));
        menuRoot.dragDrop.init($(menuChild));
      });
    });
  }
  
  // Drag and Drop Functionality
  menuRoot.dragDrop = {};
  menuRoot.dragDrop.drag = function (el,e) {
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
          var text = $.trim(el.clone().children().remove().end().text().replace('...','')),
              tempElem = $('<span style="float: left;">' + text + '</span>').hide().appendTo('body'),
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
            if (!inrect({'mousex':mouse.x,'mousey':mouse.y,'left':pick.left,'top':pick.top,'right':pick.right,'bottom':pick.bottom})) {
              pick.el.removeClass('drag-into');
            }
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
  menuRoot.dragDrop.drop = function (el) {
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
        var disclosure = dragClone.find('.disclosure'),
            dragInto   = $('.drag-into'),
            offset     = function() {
              var offsetPosition = dragInto.width() - dragClone.width(),
                  right          = offsetPosition + parseInt(dragInto.css('right')),
                  left           = offsetPosition + parseInt(dragInto.css('left'));
              console.log(dragClone.width());
              return { 'right':right,'left':left }
            };
        dragClone
          .appendTo(dragInto)
          .removeAttr('id')
          .removeClass('drag')
          .css('left','')
          .css('top','')
          .children().removeAttr('style');
        dragInto
          .css('right',offset().right)
          .css('left',offset().left)
          .width(dragClone.width());
        if (disclosure.size() > 0) {
          var disclosureW = disclosure.width()+5;
              right = parseInt(dragInto.css('right'))-disclosureW,
              left  = parseInt(dragInto.css('left'))+disclosureW,
              width = dragInto.width()+disclosureW;
          console.log(right);
          dragInto.css('right',right).css('left',left).width(width).addClass('more');
          dragClone.width(width); 
        }
      }
    }
  }
  menuRoot.dragDrop.init = function(element) {
    element.find('li').each(function(e){
      var el = $(this);
      // Make element dragable when it's clicked
      el.on('mousedown',function(e){
        $(e.target).addClass('drag');
      });
      // When the mouse is released undrag object
      $('html').on('mouseup',function(e){
        if (el.hasClass('drag')) {
          el.removeClass('drag');
          menuRoot.dragDrop.drop(el);
        }
      });
      $('html').on('mousemove',function(e){
        menuRoot.dragDrop.drag(el,e)
      });
    });
  };

  // Create Object for miniMenu Functions
  menuRoot.quickMenu = {};

  // Quick Pick Menu

  menuRoot.quickPick = {};
  menuRoot.quickPick.create = function() {
    $('#menu-quickpick .container').each(function() {
      $(this).find('.pick').each(function(n) {
        $(this).css('top',40*n).on('hover',function(){
          $(this).find('li').addClass('hover');
        });
      });
    });
  };

  // Right Click Configuration Menu
  menuRoot.configure = {};

  menuRoot.configure.create = function(data) {
    var el      = data['element'],
        cache   = $('<div />'),
        menu    = '#configure-menu';
    console.log(el);
    /* Check to see if it exists */
    if ($(menu).size() < 1) { 
      template.load({'template-file':'menu','template':menu,'parent':'body'},function() { menuRoot.configure.bind(data); }); 
    }
    menuRoot.configure.bind(data);
  };

  menuRoot.configure.bind = function(data) {
    var el    = data['element'],
        index = el.attr('index'),
        mini  = el.closest('ul').children('.miniMenu[index="' + index + '"]'),
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

  menuhub.init()
  menu.position($('#menu-quickpick'),$('#main-wheel'));
  menuRoot.loadDropdown();
  menuRoot.quickPick.create();
}); 
