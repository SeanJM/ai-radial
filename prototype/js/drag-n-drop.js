// Drag and Drop Functionality
dragDrop = {};

dragDrop.test = function (object) {
  var targetGroup = object.target;
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

dragDrop.drag = function (object,callback) {
  var 
    el         = object.drag,
    dragOffset = 10,
    offsetX    = object.initMouseX - object.mouseX,
    offsetY    = object.initMouseY - object.mouseY,
    dragClone = $('#drag-clone');

  if (offsetX > dragOffset || offsetX < dragOffset*-1 || offsetY > dragOffset || offsetY < dragOffset*-1) {
    if (dragClone.size() < 1 || dragClone.is(':hidden')) { if (callback) { callback.start(); } }
    if (dragClone.size() < 1) { dragDrop.ghost(el); }
    if (dragClone.size() > 0) {
      dragDrop.test({'active':dragClone,'target':object.target,'mouseX':object.mouseX,'mouseY':object.mouseY});
      dragClone.css('left',object.mouseX-(dragClone.width()/2)).css('top',object.mouseY-(dragClone.height()/2)); 
      if (dragClone.is(':hidden')) { dragClone.show(); }
    }
  }
  if (typeof callback.dragging == 'function') { callback.dragging(); }
}

dragDrop.drop = function (el,callback) {
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
      if (callback.cancel) { callback.cancel(); }
    }

    if ($('.drag-into').size() > 0) {
      
      $('.dropped').removeClass('.dropped');
      
      dragClone
        .appendTo($('.drag-into'))
        .removeAttr('id')
        .removeClass('drag')
        .css('left','')
        .css('top','')
        .addClass('dropped')
        .children().removeAttr('style');

      if (callback) { callback.complete(); }
    }
  }
  el.closest('.menu-root-child').css('opacity','1');
}
// dragDrop.init(object,callback)
// The callback should be initiated when the object is dragged
// To be complete: Target object being the only thing that can be
// dragged into
dragDrop.init = function(object,callback) {
  var drag = object.drag, 
      mouse   = {};
  // Make element dragable when it's clicked
  drag.on('mousedown',function(e){
    $(this).addClass('drag');
    mouse.X = e.pageX;
    mouse.Y = e.pageY;
  });
  // When the mouse is released undrag object
  $('html').on('mouseup',function(e){
    if (drag.hasClass('drag')) {
      drag.removeClass('drag');
      dragDrop.drop(drag,callback);
    }
  });
  $('html').on('mousemove',function(e){
    if (drag.hasClass('drag')) {
      dragDrop.drag({'drag':drag,'target':object.target,'initMouseX':mouse.X,'initMouseY':mouse.Y,'mouseX':e.pageX,'mouseY':e.pageY},callback);
    }
  });
}