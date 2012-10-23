// Drag and Drop Functionality
dragDrop = {};

dragDrop.test = function (object) {
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

dragDrop.ghost = function (element) {
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

dragDrop.drag = function (el,object) {
  if (el.hasClass('drag')) {
    var 
      dragOffset = 10,
      offsetX    = object.initMouseX - object.mouseX,
      offsetY    = object.initMouseY - object.mouseY;

    if (offsetX > dragOffset || offsetX < dragOffset*-1 || offsetY > dragOffset || offsetY < dragOffset*-1) {
      var dragClone = $('#drag-clone');
      
      if (dragClone.size() < 1) { dragDrop.ghost(el); }
      if (dragClone.size() > 0) {
        el.closest('.menu-root-child').css('opacity','0.3');
        dragDrop.test({'active':dragClone,'mouseX':object.mouseX,'mouseY':object.mouseY});
        dragClone.css('left',object.mouseX-(dragClone.width()/2)).css('top',object.mouseY-(dragClone.height()/2)); 
        
        if (dragClone.is(':hidden')) { dragClone.show(); }
      }
    }
  }
}

dragDrop.drop = function (el) {
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
      dragInto.find('.visible').removeClass('visible');
      menu.quickMenu.bind(dragInto);
      menu.setup(dragInto);
    }
  }
  el.closest('.menu-root-child').css('opacity','1');
}
dragDrop.init = function(element) {
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
        dragDrop.drop(el);
      }
    });
    $('html').on('mousemove',function(e){
      dragDrop.drag(el,{'initMouseX':mouse.X,'initMouseY':mouse.Y,'mouseX':e.pageX,'mouseY':e.pageY});
    });
  });
}