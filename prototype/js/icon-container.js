var iconContainer = {};

function bindBody() {
  $('body').on('mousemove',function(){
    iconContainer.drag();
  });
}

iconContainer.update = function (callback) {
  putOnCircle({'parent':$('#secondRing'),'child':'.icon-container'});
  putOnCircle({'parent':$('#outter-ring'),'child':'.icon-container'});
  if (typeof callback == 'function') { setTimeout(callback(),1000); }
}

iconContainer.targetPos = function (object) {
  
  var
    targetMid  = object.target.eq(object.index),
    targetPrev = object.target.eq(object.index-1),
    targetElement;

  if ((object.index-1) == -1) { targetPrev = object.target.eq((object.target.size()-1)); }
  targetPrevLeft     = parseInt(targetPrev.offset().left),
  targetPrevTop      = parseInt(targetPrev.offset().top),
  targetPrevRight    = parseInt(targetPrevLeft + targetPrev.outerWidth()),
  targetPrevBottom   = parseInt(targetPrevTop + targetPrev.outerHeight()),
  
  targetMidLeft      = parseInt(targetMid.offset().left),
  targetMidTop       = parseInt(targetMid.offset().top),
  targetMidRight     = parseInt(targetMidLeft + targetMid.outerWidth()),
  targetMidBottom    = parseInt(targetMidTop + targetMid.outerHeight()),
  
  targetLeft    = parseInt((targetPrevLeft+targetMidLeft)/2),
  targetRight   = parseInt((targetPrevRight+targetMidRight)/2),
  targetTop     = parseInt((targetPrevTop+targetMidTop)/2),
  targetBottom  = parseInt((targetPrevBottom+targetMidBottom)/2),
  
  emptyTarget = {'left':targetLeft,'right':targetRight,'top':targetTop,'bottom':targetBottom,'width':targetRight-targetLeft,'height':targetBottom-targetTop};
  
  targetElement = $('<div class="emptyTarget"></div>')
                  .css('left',emptyTarget.left)
                  .css('top',emptyTarget.top)
                  .css('width',emptyTarget.width)
                  .css('height',emptyTarget.height)
                  .css('position','absolute')
                  .css('background-color','blue')
                  .css('opacity','0.00');
  
  $('body').append(targetElement);

}

iconContainer.drag = function () {
  if ($('body').hasClass('icon-drag')) {
    var clone = $('#drag-clone'),
        target;
    
    if (clone.size()) {
      var 
        container   = clone.find('.icon');
        iconClass   = $('.' + container.attr('class').split(' ').join('.'));
      if (iconClass.closest('#secondRing').size() > 0) { target = $('#outter-ring'); }
      if (iconClass.closest('#outter-ring').size() > 0) { target = $('#secondRing'); }
      if (!clone.hasClass('bound')) {
        bindClone(target);
      }
    }

    if (typeof target != 'undefined') {
      var 
        iconTarget     = target.find('.icon-container'),
        iconTargetSize = iconTarget.size(),
        targetArr      = [];
    }

    // If no targets, create targets
    // If more targets than previous, create targets
    
    function createTargets () {
      console.log('creatingTargets');
      $('.emptyTarget').remove();
      target.attr('size',iconTarget.size());
      for (var i=0;i<iconTarget.size();i++) {
        iconContainer.targetPos({'target':iconTarget,'index':i});
      }
    }
    function bindClone(target) {
      clone.off('mousemove');
      clone.addClass('bound').on('mousemove',function(e){
        var 
          emptyTarget = $('.emptyTarget'),
          cloneLeft   = clone.offset().left,
          cloneTop    = clone.offset().top,
          cloneRight  = cloneLeft + clone.outerWidth(),
          cloneBottom = cloneTop + clone.outerHeight();

        for (var i=0;i<emptyTarget.size();i++) {
          var emptyTargetOffset = emptyTarget.eq(i).offset();
          tmpTargetPos = {
            'left':emptyTargetOffset.left,
            'top':emptyTargetOffset.top,
            'right':emptyTargetOffset.left+emptyTarget.eq(i).width(),
            'bottom':emptyTargetOffset.top+emptyTarget.eq(i).height()
          }
          if (e.pageX > tmpTargetPos.left && e.pageY > tmpTargetPos.top && e.pageX < tmpTargetPos.right && e.pageY < tmpTargetPos.bottom) {
            emptyTarget.css('background-color','blue');
            emptyTarget.eq(i).css('background-color','red');
            if (parseInt($('#emptyIcon').attr('index')) != i) {
              $('#emptyIcon').remove();
            }
            if (!$('#emptyIcon').size()) {
              var targetEmpty = $('<div class="icon-container" id="emptyIcon" index="' + i + '"></div>'),
                  iconTarget  = target.find('.icon-container').eq(i);
              target.attr('index',i);
              targetEmpty.insertBefore(iconTarget);
              iconContainer.update();
            /*  setTimeout(mouseEmptyRemoval(targetPos()),1000);*/
            }
          }
        }
      });
    }

    if ( iconTarget.size() != parseInt(target.attr('size')) ) {
      createTargets();
    }
  }
}

iconContainer.bind = function () {

  var element   = $('.icon-container'),
      morering  = element.find('.more-ring');

  element.on('click',function(event){
    $('.icon-container.selected').removeClass('selected');
    $(this).addClass('selected');
  });

  element.find('.arrow').on('click',function(event){
    if (element.find('.more-ring.visible').size() > 0) { $('html').trigger('click'); }
    moreToolCircle($(this).parent());
    event.stopPropagation();
  });

  morering.find('.icon').on('click',function(){
    var selectedIcon  = $(this),
        replaceIcon   = $(this).parents('.icon-container').find('.icon:first');
    replaceIcon.replaceWith(selectedIcon.clone());
  });

  element.each(function(){
    var 
      element = $(this),
      parent  = element.parent(),
      target  = $('#secondRing'),
      dropTarget;
    if (parent.attr('id') == 'secondRing') { target = $('#outter-ring'); }

    dragDrop.init(
    { 'drag':element,'target':target },{

      'start': (function(){ 
        $('body').addClass('icon-drag')
        element.css('opacity','0.2'); 
        $('#drag-clone').css('opacity','0.8'); 

      }),

      'dragging': (function(){

      }),
      'complete': (function(){
        element.remove();
        var dropped = target.find('.dropped').removeClass('dropped');

        dropped.hide().insertAfter($('#emptyIcon'));
        $('#emptyIcon').remove();
        $('body').removeClass('icon-drag');
        iconContainer.update(function(){ dropped.show().css('opacity','1'); });
      }),
      'cancel':(function(){
        $('#emptyIcon').remove();
        iconContainer.update();
        element.css('opacity','1');
        $('body').removeClass('icon-drag');
      }) }); 
  });
  // Drag and Drop Continued
  function mouseEmptyRemoval (object) {
    setInterval(function() {
      if ($('#emptyIcon').css('position')) {
        htmlBind();
      }
    },300);
    var htmlBind = function () {
      if (!$('body').hasClass('bound')) {
        console.log('binding html');
        $('body').addClass('bound').on('mousemove',function() {
          if ($('#emptyIcon').size() > 0 && $('#drag-clone').size() > 0) {

              clone       = $('#drag-clone'),
              cloneTop    = clone.offset().top,
              cloneRight  = clone.offset().left + clone.outerWidth(),
              cloneBottom = clone.offset().top + clone.outerHeight(),
              cloneLeft   = clone.offset().left;

            function removeEmpty() {
              $('#emptyIcon').remove();
              iconContainer.update();
            }
            // Inside
            if (cloneBottom > object.top && cloneRight > object.left && cloneLeft < object.right && cloneTop < object.bottom) { 
              console.log('inside');
            }
            // Outside
            // This is getting ran too many times
            // Once it's outside put a block on the index that it last triggered
            // untill is triggers another index
            if (cloneBottom < object.top || cloneRight < object.left || cloneLeft > object.right || cloneTop > object.bottom) {
              removeEmpty();
              console.log('outside');
            }
          }
        });
      }
    }
  }
}
$(function(){
  iconContainer.bind();
  bindBody();
});