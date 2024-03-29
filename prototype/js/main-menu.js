// Main Menu

function elementName(self) {
  var str = self.clone().children().remove().end().text(),
      tag = self.prop('tagName').toLowerCase();
  return '<' + tag + ' class="' + self.attr('class') + '" index="' + self.index() + '">' + $.trim(str) + '</' + tag + '>'; 
}

// Setup

var menu = {};

menu.setup = function (root) {
  var li = root.find('li');

  console.log('Menu setup for: ' + elementName(root));

  menu.submenu(root);
  menu.configListen(li);
  menu.checkboxListen(li);
  
  menu.addDisclosure(root);
  menu.dropdown(root);
  menu.quickMenu.create(root);
}

// Sub Menu Appearance
menu.submenu = function(element) {
  console.log('Setting up submenu for: ' + elementName(element));
  element.on('mouseover',function(e){
    var 
        target         = $(e.target),
        targetSubmenu  = target.children('ul'),
        offset         = parseInt(target.parent().css('width'))-4,
        level          = targetSubmenu.attr('level'),
        verticalOffset = target.outerHeight() * -1;
    
    if (targetSubmenu.size()) { 
      
      if (level > 1 && level%2 == 1) { 
        if (targetSubmenu.closest('#menu-quickpick').size() > 0) { 
          $('#menu-quickpick').css('z-index','1000'); 
          targetSubmenu.on('mouseleave',function(){ 
            $('#menu-quickpick').css('z-index','-1'); 
          });
        }
        offset = (parseInt(target.parent().css('width'))*-1)+4; 
      }

      if (targetSubmenu.is(':hidden'))     { 
        targetSubmenu.addClass('visible').css('left',offset).css('top',verticalOffset); 
      }

    }
  });
}

menu.rootHover = function (self) {
 self.on('mouseover',function(event){
    if (self.children('span').parents().size() == $(event.target).parents().size()) {
      hover($(this).children('span'));
    }
  });
}

menu.position = function (object) {
  if (object.horizontal || typeof object.horizontal == 'undefined') { 
    object.child.css('left',(object.parent.width()/2) - (object.child.width()/2)); 
  }
  if (object.vertical || typeof object.vertical == 'undefined') {
    object.child.css('top',(object.parent.height()/2) - (object.child.height()/2)); 
  }
}

// Add Disclosure Indicator for menu items
menu.addDisclosure = function (root) {
  root.find('ul').each(function(){
    $(this).addClass('background').attr('level',$(this).parents('ul').length);
    if ($(this).children('li').size() > 0) { $(this).addClass('menu-parent'); }
    if ($(this).closest('li').size() > 0 && $(this).parents('ul').length > 1) { 
      $(this).parent().append($('<span class="disclosure" />')); 
    }
  });
}

// Control visibility of the dropdown menu
menu.dropdown = function (root) {
  root.on('click',function(e){
    var target    = $(e.target).closest('.menu-root'),
        targetID  = target.closest('.menu-root-child').attr('id'),
        visible   = $('.menu-root-child.visible');

    if (visible.size()) {
      visible.each(function(){
        if (targetID != $(this).attr('id')) { 
          $(this).removeClass('visible'); 
        }
      });
    }

    target.children('ul').each(function() { 
      $(this).addClass('visible'); 
    });

    e.stopPropagation();
  
  });
}

// Listen for right click on menus
menu.configListen = function(element) {
  element.on('mousedown',function(event) {
    /* Right Click Options */
    if (event.which == 3) {
      menu.config.create(event);
    }
    event.stopPropagation();
  });
}

// When a menu item with a checkbox is clicked, check it
menu.checkboxListen = function (element) {
  element.on('click',function(e) {
    if ($(e.target).children('.checkbox').size() > 0) { element.toggleClass('checked'); }
  });
}


menu.quickMenu = {};

menu.quickMenu.create = function (root) {
  root.find('ul').each(function(){
    var 
      li            = $(this).children('li'),
      miniContainer = $('<div class="mini-menu-container">'),
      markerTmplt   = '<span class="marker"></span>';
    
    li.each(function(n){
      var 
        clss     = $(this).attr('class'),
        marker   = $(this).find('.marker'),
        miniMenu = $('<div class="miniMenu ' + clss + '" index="' + n + '"><div class="innerShadow"></div></div>'),
        markerColor;
      
      if (n == 0) { $(this).addClass('first'); }
      if (n == li.length-1) { $(this).addClass('last'); }
      
      $(this).attr('index',n);
      
      if (marker.size() < 1) { 
        marker = $(markerTmplt); 
        $(this).prepend(marker); 
      }

      if ($(this).children('.checkbox').size() > 0) { $(this).addClass('checkbox-container'); }
      
      markerColor = marker.attr('class').replace('marker','').trim();
      miniMenu.attr('class','miniMenu ' + markerColor);
      miniContainer.append(miniMenu);
    
    });

    $(this).append(miniContainer);
  
  });

  menu.quickMenu.bindHover(root);

}

// Quick Menu
menu.quickMenu.hover = function (element) {
  var 
    elemParent    = element.parent(),
    elemIndex     = element.attr('index'),
    elemSubMenu   = element.children('ul'),
    elemMiniMenu  = elemParent.children('.mini-menu-container').children('.miniMenu[index="' + elemIndex + '"]'),
    elemVertPos   = '',
    horizOffset   = '-8px';
  
  console.log('quick menu bind');

  elemParent.find('ul.visible').removeClass('visible');
  
  if (elemSubMenu.size()) {
    elemSubMenu.addClass('visible').css('top','').css('left','');
    elemVertPos = (elemSubMenu.offset().top - elemMiniMenu.offset().top)*-1;
    horizOffset = elemMiniMenu.offset().left - (elemSubMenu.offset().left + elemSubMenu.width() + (elemMiniMenu.parent().width()/2));
    if (leftRight() == 'left') { horizOffset = rootPadding - 5; }
    elemSubMenu.css('left',horizOffset).css('top',elemVertPos);
  }

}

menu.quickMenu.bindHover = function(root) {
  var 
    mini = root.find('.miniMenu'),
    li   = root.find('li'),
    loadMsg;

  if (typeof root.attr('menu') != 'undefined') {
    loadMsg = 'Quickmenu Bind: ' + root.attr('menu');
  }
  if (typeof root.attr('menu') == 'undefined') {
    loadMsg = 'Quickmenu Bind: ' + elementName(root);
  }

  console.log(loadMsg);

  function clear (element) { 
    var 
      parent = element.closest('ul'),
      index  = element.attr('index'),
      li     = parent.children('li[index="' + index + '"]'),
      mini   = parent.children('.mini-menu-container').children('.miniMenu[index="' + index + '"]');

    hover(li);
    hover(mini);
  }

  li.on('mouseover',function(event){
    if ($(this).parents().size() == $(event.target).parents().size()) {
      clear($(event.target));
    }
  });

  // Sub list elements
  li.on('mouseleave',function(event){
    var self         = $(this),
        configHidden = $('#configure-menu').is(':hidden'),
        childrenSize = self.children('ul').size();

    if (childrenSize && configHidden || $('#configure-menu').size() < 1) { 
      self.children('ul').removeClass('visible'); 
    }
  });

  mini.on('mouseover',function(){
    console.log('mini hover');
    var liTarget = $(this).closest('ul').children('li[index="' + $(this).attr('index') + '"]');
    clear($(this));
    menu.quickMenu.hover(liTarget);
  });
}
// Orientation

menu.orientation = function(str) {
  $('#ai-wheel').attr('class',str + '-handed');
}
// Menu Hub
var menuhub = {};
menuhub.mainConfigBind = function() {
  $('#main-configuration-menu .orientation').on('click',function(e){
    menu.orientation($(this).attr('id').split('-')[3]);
    e.stopPropagation();
  });
}
menuhub.bind = function() {
  $('#menu-hub *').on('contextmenu',function(event){ return false; });
  $('#menu-hub .ai').parent().click(function(e){ 
    $('#menu-hub').addClass('visible'); 
    $('#menu-quickpick').addClass('active');
    $('#main-wheel').addClass('faded');
    e.stopPropagation();
  });
  $('#menu-hub li').on('click',function(e){
    $('#configure-init').css('z-index','1');
    e.stopPropagation();
  });
  $('#configure-init').on('click',function(e){
    $('#main-configuration-menu').addClass('visible');
    $('#menu-hub ul.menu.first').addClass('faded');
    e.stopPropagation();
  });
  $('html').on('click',function(){
    $('#configure-init').css('z-index','2');
  });
  menuhub.mainConfigBind();
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
  menu.position({'child':$('#menu-hub'),'parent':$('#ai-wheel'),'vertical':false});
}

// Menu Root (Secondary Menu)
var menuRoot = {};
menuRoot.child = {};
menuRoot.loadDropdown = function() {
  $('.menu-root').each(function(){
    var menuChild = '#' + $(this).attr('menu'),
        parent    = $(this);
    console.log('Loading Dropdown menu for: ' + menuChild);
    
    template.load({
      'template-file':'menu',
      'template':menuChild,
      'parent':parent
    },function() {
      menu.setup(parent);
      $(menuChild).find('li').each(function(){ 
        var el = $(this);
        dragDrop.init(
          { 'drag':el,'target':$('#menu-quickpick .pick') },{
            'start': (function(){ el.closest('.menu-root-child').css('opacity','0.3'); }),
            'mouseleave': (function(){
              mouseleave($('#menu-quickpick .hover'));
            }),
            'mouseover': (function(){
              hover($('.drag-into'));
            }),
            'complete': (function(){ 
              el.closest('.menu-root-child').css('opacity','1'); 
              var
                dragInto       = $('.drag-into'),
                dragClone      = dragInto.children('li'),
                disclosure     = dragClone.find('.disclosure'),
                dragIntoRight  = u.parseInt(dragInto.css('right')),
                dragIntoLeft   = u.parseInt(dragInto.css('left')),
                offsetPosition = dragInto.width() - dragClone.width(),
                right          = 0,
                left           = 0,
                width          = 0;
                
                if (u.isNum(dragIntoRight)) { right = offsetPosition + u.parseInt(dragIntoRight); }
                if (u.isNum(dragIntoLeft))  { left  = offsetPosition + u.parseInt(dragIntoLeft); }

                dragInto.width(dragClone.width());
      
                if (right != 0) { dragInto.css('right',right); }
                if (left != 0) { dragInto.css('left',left); }

                // Bind the dropped element
                menu.quickPick.setup(dragInto);
            }) }); 
      });
      if (menuChild == '#type-menu') { menu.fonts(parent); }
    });
    // End Template Load
    menu.rootHover($(this));
  });
}

// Create Object for miniMenu Functions
menu.quickPick = {};

// When the menu is dropped in the quickpick
menu.quickPick.setup = function (self) {
  console.log('Setting up quickpick menu: ' + elementName(self));

  menu.quickPick.hoverInit();
  menu.setup(self);
  menu.quickMenu.bindHover(self);
  self.addClass('background');
  self.css('background','');
  colors.bind.all();

}

// Hover
menu.quickPick.hoverInit = function () {
  $('body').addClass('hover-pick');
}

menu.quickPick.click = function (event) {
  var target = $('.pick > li.hover');
  if (target.size()) {
    if (event.pageX > target.offset().left && event.pageY > target.offset().top && event.pageX < (target.offset().left + target.width()) && event.pageY < (target.offset().top + target.height())) {
      target.trigger('click');
    }  
  }
}

menu.quickPick.hover = function (event) {
  if ($('body').hasClass('hover-pick')) {
    $('.pick > li').each(function(){
      if (event.pageX > $(this).offset().left && event.pageY > $(this).offset().top && event.pageX < ($(this).offset().left + $(this).width()) && event.pageY < ($(this).offset().top + $(this).height())) {
        if (!$(this).hasClass('hover')) {
          mouseover($(this));
          $(this).trigger('mouseover');
        }
      }
      else {
        if ($(this).hasClass('hover')) { 
          mouseleave($(this)); 
          /*$(this).trigger('mouseleave');*/
        }
      }
    });
  }
}

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

}

// Fonts Menu

menu.fonts = function (element) {
  var 
    fonts = $('#font-list'),
    li = fonts.find('li'),
    fontListMax = 20,
    interval = 100,
    timer;
  li.each(function(e){
    var ff = '"' + $(this).text() + '"';
    $(this).css('font-family',ff);
    if (e > fontListMax) { $(this).hide(); }
  });
  function next () {
    var visibleIndex = parseInt(fonts.find('li').filter(':visible').eq('0').attr('index')),
        hiddenIndex = visibleIndex + fontListMax + 1;
    if (fonts.find('li[index="' + hiddenIndex + '"]').size() < 1) { 
      fonts.find('.nav-list.up').addClass('disabled');
    }
    if (fonts.find('li[index="' + hiddenIndex + '"]').size() > 0) {
      fonts.find('.nav-list.down').removeClass('disabled');
      fonts.find('li[index="' + visibleIndex + '"]').hide();
      fonts.find('li[index="' + hiddenIndex + '"]').show();
    }
  }
  function prev () {
    var visibleIndex = parseInt(fonts.find('li').filter(':visible').eq('0').attr('index')),
        hiddenIndex = visibleIndex + fontListMax;
    if (fonts.find('li[index="' + (visibleIndex - 1) + '"]').size() < 1) { 
      fonts.find('.nav-list.down').addClass('disabled');
    }
    if (fonts.find('li[index="' + (visibleIndex - 1) + '"]').size() > 0) {
      fonts.find('.nav-list.up').removeClass('disabled');
      fonts.find('li[index="' + hiddenIndex + '"]').hide();
      fonts.find('li[index="' + (visibleIndex - 1) + '"]').show();
    }
  }
  fonts.find('.nav-list.up').on('mousedown',function(e){
    next();
    e.stopPropagation();
    timer = setInterval(function(){
      next();   
    },interval);
  });
  fonts.find('.nav-list').on('mouseup',function(e){
    clearInterval(timer);
  });
  fonts.find('.nav-list.down').on('mousedown',function(e){
    prev();
    e.stopPropagation();
    timer = setInterval(function(){
      prev();   
    },interval);
  });
}

// Right Click Configuration Menu

menu.config = {};

menu.config.bind = function(data) {
  var 
      el      = $(data.target),
      index   = el.attr('index'),
      mini    = el.closest('ul').children('.mini-menu-container').find('[index="' + index + '"]'),
      config  = $('#configure-menu');

  function hideMenu() {
    if (config.is(':visible')) { config.hide(); }
    el.removeClass('select');
  }
  function showMenu() {
    if (config.is(':hidden')) { config.show(); }
    el.addClass('select');
  }

  showMenu();

  config.on('contextmenu',function(){ return false; });
  config.on('click',function(event) {
    hideMenu();
    event.stopPropagation();
  });
  config.on('mouseleave',function(){ hideMenu(); });
  
  config.find('.mark').off('click');
  config.find('.mark').on('click',function(){
    var color = $(this).attr('class').replace('mark','').replace('color','').trim();
    el.children('.marker').attr('class','marker ' + color);
    mini.attr('class','miniMenu ' + color);
  });
  
  config.find('li').on('hover',function(){
    hover($(this));
  });

  config.css('top',data.pageY-10).css('left',data.pageX-10);

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

}

menu.config.create = function(data) {
  var element = '#configure-menu';
  if ($(element).
    size() < 1) { 
    template.load({'template-file':'menu','template':element,'parent':'body'},function() { 
      menu.config.bind(data); 
    }); 
  }
  menu.config.bind(data);
}

/* Onload */

$(function(){
  menuhub.init()
  menu.position({'child':$('#menu-quickpick'),'parent':$('#main-wheel'),'vertical':false});
  menu.position({'child':$('#main-configuration-menu'),'parent':$('#menu-hub'),'vertical':true});
  menu.position({'child':$('#main-configuration-menu-close'),'parent':$('#main-configuration-menu')});
  menu.position({'child':$('#main-configuration-menu-brightness'),'parent':$('#main-configuration-menu'),'vertical':false});
  menu.position({'child':$('#main-configuration-menu-opacity'),'parent':$('#main-configuration-menu'),'vertical':false});
  menu.position({'child':$('#main-configuration-menu-left'),'parent':$('#main-configuration-menu'),'horizontal':false});
  menu.position({'child':$('#main-configuration-menu-right'),'parent':$('#main-configuration-menu'),'horizontal':false});
  $('#main-configuration-menu .icon').each(function(){
    menu.position({'child':$(this),'parent':$(this).parent()});
  });
  $('#main-configuration-menu .spinner').each(function(){
    menu.position({'child':$(this),'parent':$(this).parent()});
  });
  $('#main-configuration-menu .spinner-container').each(function(){
    menu.position({'child':$(this),'parent':$(this).parent()});
  });
  $('#main-configuration-menu .spinner-mask').each(function(){
    menu.position({'child':$(this),'parent':$(this).parent()});
  });
  menuRoot.loadDropdown();
  menu.quickPick.create();
}); 
