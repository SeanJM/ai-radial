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
    root.find('li').each(function() {
      $(this).on('mousedown',function(event){
        /* Right Click Options */
        if (event.which == 3) {
          menuRoot.configure.create({'element': $(event.target),'mouse':event});
          event.stopPropagation();
        }
      });
    });
  }

  menu.levels = function (root) {
    root.find('ul').each(function(){
      var level = $(this).parents('ul').length;
      $(this).attr('level',level);
      if ($(this).children('li').size() > 0) { $(this).addClass('menu-parent'); }
    });
  }

  menu.disclosure = function (root) {
    root.find('li > ul').each(function(){ 
      var disclosure  = $('<span class="disclosure" />');
      $(this).parent().append(disclosure); 
    });
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
  
  menu.visibile = function(root) {
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
  }

  menu.quickMenu.create = function (root) {
    root.find('ul').each(function(){
      var 
        li             = $(this).children('li'),
        quickContainer = $('<div class="mini-menu-container">'),
        markerTmplt    = '<span class="marker"></span>';
      
      li.each(function(n){
        var 
          clss     = $(this).attr('class'),
          miniMenu = $('<div class="miniMenu" index="' + n + '"><div class="innerShadow"></div></div>').addClass(clss),
          marker   = $(this).find('.marker'),
          markerColor;
        
        if (n == 0) { $(this).addClass('first'); }
        if (n == li.length-1) { $(this).addClass('last'); }
        $(this).attr('index',n);
        
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
    var mini           = root.find('.miniMenu'),
        li             = root.find('li');

    function clear (element,index) { 
      var parent = element.closest('ul'),
          li     = parent.children('li[index="' + index + '"]'),
          mini   = parent.children('.mini-menu-container').children('.miniMenu[index="' + index + '"]');

      parent.find('.hover').removeClass('hover');
      li.addClass('hover');
      mini.addClass('hover');
    }

    function hover (element) {
      var 
        elemParent    = element.parent(),
        elemIndex     = element.attr('index'),
        elemSubMenu   = element.children('ul'),
        elemTop       = element.position()['top'],
        elemMiniMenu  = elemParent.find('.miniMenu[index="' + elemIndex + '"]'),
        elemVertPos   = '',
        parentPadding = u.parseInt(element.closest('ul').css('padding-right')) / 1.8,
        rootPadding   = u.parseInt(element.closest('.menu-root-child').css('padding-right')),
        horizOffset   = '-8px';
      
      elemParent.find('ul.visible').removeClass('visible');
      
      if (elemSubMenu.size()) { 
        if (elemTop) { elemVertPos = (elemTop*-1) + (elemMiniMenu.position()['top'] - elemMiniMenu.outerHeight()); }
        if (leftRight() == 'right') { horizOffset = (rootPadding * -1) - parentPadding; }
        if (leftRight() == 'left') { horizOffset = rootPadding - 5; }

        elemSubMenu.addClass('visible').css('left',horizOffset).css('top',elemVertPos);
      }
    }

    li.each(function() {
      var el        = $(this),
          index     = el.attr('index'),
          miniMenu  = el.parent().find('.miniMenu[index="' + index + '"]');

      el.on('mouseover',function(){
        clear(el,index);
      });
      
      el.on('mouseleave',function(){
        miniMenu.removeClass('hover');
        if (el.children('ul').size()) { 
          el.children('ul').removeClass('visible').trigger('minileave'); 
        }
      });
    });

    mini.each(function() {
      $(this).on('mouseover',function(){
        var index  = $(this).attr('index');
        clear($(this),index);
        hover($(this).closest('ul').children('li[index="' + index + '"]'));
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
      $('#menu-quickpick').removeClass('active');
    });
  };

  menu.inrect = function (object) {
    var 
      activeLeft   = object.active.offset().left,
      activeRight  = activeLeft + object.active.width(),
      activeTop    = object.active.offset().top,
      activeBottom = activeTop + object.active.height(),

      passiveLeft   = object.passive.offset().left,
      passiveRight  = passiveLeft + object.passive.width(),
      passiveTop    = object.passive.offset().top,
      passiveBottom = passiveTop + object.passive.height();

    if (activeRight > passiveLeft && activeBottom > passiveTop && activeTop < passiveBottom && activeLeft < passiveRight) { return true }
    return false;
  }

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
        menu.visibile(parent);
        menu.levels(parent);
        menu.quickMenu.init(parent);
        menu.popOut(parent);

        menu.disclosure($(menuChild));
        menu.rightClick($(menuChild));
        menu.dragDrop.init($(menuChild));
      });
    });
  }
  
  // Drag and Drop Functionality
  menu.dragDrop = {};
  menu.dragDrop.ghost = function (element) {
    var 
      disclosure = element.children('.disclosure'),
      text       = $.trim(element.clone().children().remove().end().text()),
      tempElem   = $('<span style="float: left; position: absolute; font-size:' + element.css('font-size') + ';">' + text + '</span>').hide().appendTo('body'),
      width      = tempElem.width()+20,
      ghost      = element.clone().appendTo('body').attr('id','drag-clone').hide();

    if (disclosure.size() > 0) { 
      ghost.addClass('more');
      width+=disclosure.width()+8;
    }

    tempElem.remove();
    ghost.width(width);
  }

  menu.dragDrop.test = function (object) {
    var targetGroup = $('#menu-quickpick .pick');
    for (var i = 0;i<targetGroup.size();i++) {
      var target        = {};
          target.el     = targetGroup.eq(i);
          target.left   = target.el.offset().left;
          target.top    = target.el.offset().top;
          target.bottom = target.el.offset().top + target.el.height();
          target.right  = target.el.offset().left + target.el.width();
      // Check to see if the dragged element is inside the target
      if (!menu.inrect({'active':object.active,'passive':target.el})) {
        target.el.removeClass('drag-into');
      }
      if (menu.inrect({'active':object.active,'passive':target.el})) {
        $('.drag-into').removeClass('drag-into');
        target.el.addClass('drag-into'); 
      }
    }
  }

  menu.dragDrop.drag = function (el,object) {
    if (el.hasClass('drag')) {
      var 
        dragOffset = 10,
        offsetX    = object.initMouseX - object.mouseX,
        offsetY    = object.initMouseY - object.mouseY;

      if (offsetX > dragOffset || offsetX < dragOffset*-1 || offsetY > dragOffset || offsetY < dragOffset*-1) {
        var dragClone = $('#drag-clone');
        
        if (dragClone.size() < 1) { menu.dragDrop.ghost(el); }
        if (dragClone.size() > 0) {
          el.closest('.menu-root-child').css('opacity','0.3');
          menu.dragDrop.test({'active':dragClone,'mouseX':object.mouseX,'mouseY':object.mouseY});
          dragClone.css('left',object.mouseX-(dragClone.width()/2)).css('top',object.mouseY-(dragClone.height()/2)); 
          
          if (dragClone.is(':hidden')) { dragClone.show(); }
        }
      }
    }
  }

  menu.dragDrop.drop = function (el) {
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
        var 
          disclosure     = dragClone.find('.disclosure'),
          dragInto       = $('.drag-into'),
          dragIntoRight  = dragInto.css('right').replace('px',''),
          dragIntoLeft   = dragInto.css('left').replace('px',''),
          right          = 0,
          left           = 0,
          width          = 0,
          offsetPosition = dragInto.width() - dragClone.width();
          
          if (u.isNum(dragIntoRight)) { right = offsetPosition + u.parseInt(dragIntoRight); }
          if (u.isNum(dragIntoLeft))  { left  = offsetPosition + u.parseInt(dragIntoLeft); }

        dragClone
          .appendTo(dragInto)
          .removeAttr('id')
          .removeClass('drag')
          .css('left','')
          .css('top','')
          .children().removeAttr('style');
        
        dragInto.width(dragClone.width());
        if (right != 0) { dragInto.css('right',right); }
        if (left != 0) { dragInto.css('left',left); }

        // Bind the dropped element
        menu.quickPick.bind(dragInto);
        menu.quickMenu.bind(dragInto);
      }
    }
    el.closest('.menu-root-child').css('opacity','1');
  }
  menu.dragDrop.init = function(element) {
    element.find('li').each(function(e){
      var 
        el    = $(this),
        mouse = {};
      // Make element dragable when it's clicked
      el.on('mousedown',function(e){
        $(e.target).addClass('drag');
        mouse.X = e.pageX;
        mouse.Y = e.pageY;
      });
      // When the mouse is released undrag object
      $('html').on('mouseup',function(e){
        if (el.hasClass('drag')) {
          el.removeClass('drag');
          menu.dragDrop.drop(el);
        }
      });
      $('html').on('mousemove',function(e){
        menu.dragDrop.drag(el,{'initMouseX':mouse.X,'initMouseY':mouse.Y,'mouseX':e.pageX,'mouseY':e.pageY});
      });
    });
  };

  // Create Object for miniMenu Functions
  menuRoot.quickMenu = {};
  menu.quickPick = {};
  
  menu.quickPick.create = function() {
    var quickPick = $('#menu-quickpick'),
        pick      = quickPick.find('.pick');

    $('#menu-quickpick .container').each(function() {
      $(this).find('.pick').each(function(n) {
        $(this).css('top',40*n);
      });
    });
    quickPick.on('click',function(event) {
      event.stopPropagation();
    });
    quickPick.on('mouseover',function() {
      $(this).addClass('active');
    });
    quickPick.on('mouseleave',function() {
      if (!$('#menu-hub').hasClass('visible')) { $(this).removeClass('active'); }
    });

    $('html').on('mousemove',function(event){
      for (var i=0;i<pick.size();i++) {
        var mouseX = event.pageX,
            mouseY = event.pageY,
            curPick = pick.eq(i);
            pickX  = curPick.offset().left,
            pickY  = curPick.offset().top,
            pickW  = curPick.outerWidth(),
            pickH  = curPick.outerHeight(),
            inrect = 0;
        if (mouseX > pickX && mouseX < pickX+pickW && mouseY > pickY && mouseY < pickY+pickH) { inrect = 1; }
        if (inrect == 1 && !curPick.hasClass('hover')) { curPick.addClass('hover'); }
        if (inrect == 0 && curPick.hasClass('hover') && !curPick.children('li').hasClass('hover')) { curPick.removeClass('hover'); }
      }
    });
  }

  menu.quickPick.bind = function(element) {
    // Clean its classes
    element.find('.visible').removeClass('visible');

    element.on('mouseover',function() {
      $(this).children('ul').addClass('visible')
    });
    element.on('mouseleave',function(){
      $(this).children('ul').removeClass('visible');
    });

    element.find('li').each(function(){
      $(this).on('mouseover',function(e){ 
        var ul = $(e.target).children('ul'),
            ulOffset;
        $(this).addClass('hover');
        if (ul.size() > 0) {
          if (ul.is(':hidden')) {
            if (ul.closest('.container').hasClass('right')) { ulOffset = u.parseInt(($('#main-wheel').offset().left+$('#main-wheel').width())-$(e.target).offset().left)+10; }
            if (ul.closest('.container').hasClass('left')) { ulOffset = u.parseInt($('#main-wheel').offset().left-$(e.target).offset().left-ul.outerWidth()-10); }
            ul.css('left',ulOffset).addClass('visible');
          }
        }
      });
      $(this).on('mouseleave',function(){ 
        var ul = $(this).children('ul');
        $(this).removeClass('hover');
        if (ul.size() > 0) {
          ul.removeClass('visible');
        }
      });
    });

  }
  
  // Right Click Configuration Menu
  menuRoot.configure = {};

  menuRoot.configure.create = function(data) {
    var el      = data['element'],
        cache   = $('<div />'),
        menu    = '#configure-menu';
    /*console.log(el);*/
    /* Check to see if it exists */
    if ($(menu).size() < 1) { 
      template.load({'template-file':'menu','template':menu,'parent':'body'},function() { menuRoot.configure.bind(data); }); 
    }
    menuRoot.configure.bind(data);
  };

  menuRoot.configure.bind = function(data) {
    var el    = data['element'],
        index = el.attr('index'),
        mini  = el.closest('ul').children('.mini-menu-container').find('[index="' + index + '"]'),
        menu  = $('#configure-menu');

    function hideMenu() {
      if (menu.is(':visible')) { menu.hide(); }
      el.removeClass('select');
    }

    if (menu.is(':hidden')) { menu.show(); }
    
    el.addClass('select');
   
    menu.on('click',function(event) {
      hideMenu();
      event.stopPropagation();
    });

    menu.on('contextmenu',function(){ return false; });
    menu.on('mouseleave',function(){ hideMenu(); });
    
    menu.find('.mark').off('click');
    
    menu.find('.mark').on('click',function(){
      var color = $(this).attr('class').replace('mark','').replace('color','').trim();
      console.log(mini);
      el.find('.marker').attr('class','marker ' + color);
      mini.attr('class','miniMenu ' + color);
    });
    
    menu.css('top',data['mouse'].pageY-10).css('left',data['mouse'].pageX-10);


    $('#hide-entry').off('click');
    $('#hide-entry').on('click',function(event){
      el.addClass('hidden');
      mini.addClass('hidden');

      event.stopPropagation();
    });

    $('#show-hidden').off('click');
    $('#show-hidden').on('click',function(event){
      el.parent().find('.hidden').removeClass('hidden');
      mini.parent().find('.hidden').removeClass('hidden');
    });

  };

  menuhub.init()
  menu.position($('#menu-quickpick'),$('#main-wheel'));
  menuRoot.loadDropdown();
  menu.quickPick.create();
}); 
