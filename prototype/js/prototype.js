// Global Functions

function leftRight () {
  if ($('#ai-wheel').hasClass('right-handed')) { return 'right'; }
  return 'left';
}


  /* ----------------------- Functions ------------------ */
  

  /* Drawing Icons on a Circle */

function putOnCircle(object) {
  var parent     = object['parent'],
      child      = parent.find(object['child']),
      ringWidth  = $(parent).outerWidth(),
      ringHeight = $(parent).outerHeight(),
      step       = 2*Math.PI/child.size(),
      theta      = 0,
      r          = (ringWidth / 2) - (child.width()),
      h,k,x,y;

    if (object.hasOwnProperty('radius')) { r = object['radius']; }
    
    h = parseInt((ringWidth /2) - (child.outerWidth() / 2));
    k = parseInt((ringWidth / 2) - (child.outerHeight() / 2));

  child.each(function(){
    x = h + parseInt(r * Math.cos(theta));
    y = k - parseInt(r * Math.sin(theta));
    theta += step;
    $(this).css('top',y).css('left',x);
  });
}
  
  /* More tools */

  function moreRad(n) {
    var value = { 1:10, 2:40, 3:45, 4:45, 5:55, 6:60, 7:70, 8:75, 9:80 };
    return value[n];
  }

  /* Keyboard */
  
  function arrowKeyPos() {
    var arrowkey  = $('#arrows'),
        arrowkeyW = arrowkey.width(),
        keyboardW = $('#keyboard').width();
    
    arrowkey.css('left',(keyboardW/2) - (arrowkeyW/2));
  }

  /* Spinner */
  function spinnerInput(data) {
    var key = data['key'],
        el  = data['el'];

    /* Arrow Down */
    if (key == '40') { spinnerVal({'el': el, 'inc': -1 }); }
    /* Arrow Up */
    if (key == '38') { spinnerVal({'el': el, 'inc': 1 }); }
    /* Spacebar */
    if (key == '13') { 
      el
        .toggleClass('edit')
        .toggleClass('visible'); 
    }
  }

  function spinnerVal(data) {
    var el  = data['el'],
        inc = data['inc'],
        value = el.find('.value').text(),
        inputValue = el.find('input').val(),
        val = parseInt(value) + inc;

    if (inputValue != value) { val = parseInt(inputValue) + inc; }
    if (/%/i.test(value)) { val = val + '%'; }
    
    el.find('input').val(val);
    el.find('.value').text(val);
  }

  function centerRings() {
    $('.ring').each(function(){
      var outterRingW   = $('#outter-ring').width()/2,
          innerRingW    = $(this).width()/2,
          innerRingPos  = outterRingW-innerRingW;
      
      $(this)
        .css('left',innerRingPos)
        .css('top',innerRingPos);
    });
  }

  function protonBind() {
    
    $('#fillStroke').click(function(){
      $(this).toggleClass('stroke');
      $('#microFillControl').toggleClass('stroke');
    });
    
    $('#swapFillStroke').click(function(){
      $('#fillStroke').toggleClass('swap');
    });
    
    $('#dFillStroke').click(function(){
      $('#fillStroke').addClass('default');
    });
    
    $('#drawModes').click(function(){
      if ($(this).hasClass('front')) {
        $(this).removeClass('front').addClass('behind');
        return false;
      }
      if ($(this).hasClass('behind')) {
        $(this).removeClass('behind').addClass('clip');
        return false;
      }
      if ($(this).hasClass('clip')) {
        $(this).removeClass('clip').addClass('front');
        return false;
      }
    });
  }

  function moreToolCircle(element) {
    console.log(element);
    var 
        icon       = element.find('.icon'),
        totalIcons = icon.size(),
        rad        = moreRad(totalIcons),
        moreRing   = element.find('.more-ring'),
        timer;
      
      moreRing
        .css('width'        ,(rad*2))
        .css('height'       ,(rad*2))
        .css('top'          ,(rad*-1))
        .css('left'         ,(rad*-1))
        .css('border-radius',(rad));
    
    timer = setInterval(function() {
      if (moreRing.width() == rad*2) {
        clearInterval(timer);
        putOnCircle({'parent':moreRing, 'child':moreRing.find('.icon')});
        moreRing.addClass('visible');
        moreRing.on('mouseleave',function() { moreRing.removeClass('visible'); });
      }
    },10);
  }

  function iconContainerBind () {
    function updateCircle(callback) {
      putOnCircle({'parent':$('#secondRing'),'child':'.icon-container'});
      putOnCircle({'parent':$('#outter-ring'),'child':'.icon-container'});
      if (typeof callback == 'function') { setTimeout(callback(),1000); }
    }
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
          element.css('opacity','0.2'); 
          $('#drag-clone').css('opacity','0.8'); 
        }),
        'dragging': (function(){
          var iconTarget = target.find('.icon-container'),
              clone      = $('#drag-clone'),
              iconTargetSize = iconTarget.size();

          if (clone.size() > 0) {
            var
            cloneLeft   = clone.offset().left,
            cloneTop    = clone.offset().top,
            cloneRight  = cloneLeft + clone.outerWidth(),
            cloneBottom = cloneTop + clone.outerHeight();
          }

          var targetPos = function(i) {
              var
                targetMid  = iconTarget.eq(i),
                targetPrev = iconTarget.eq(i-1);

              if ((i-1) == -1) { targetPrev = iconTarget.eq((iconTarget.size()-1)); }
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
              
              emptyTarget = {'left':targetLeft,'right':targetRight,'top':targetTop,'bottom':targetBottom};
              return emptyTarget;
            }
          
          for (var i=0;i<iconTargetSize;i++) {

            var tmpTargetPos = targetPos(i);

            if (cloneRight >= tmpTargetPos.left && cloneBottom >= tmpTargetPos.top && cloneLeft <= tmpTargetPos.right && cloneTop <= tmpTargetPos.bottom) {
              var targetEmpty = $('<div class="icon-container" id="emptyIcon"></div>');
              if (!$('#emptyIcon').size()) {
                targetEmpty.insertBefore(iconTarget.eq(i));
                updateCircle(function() { mouseEmptyRemoval(targetPos(i)) });
              /*  setTimeout(mouseEmptyRemoval(targetPos()),1000);*/
              }
            }
          }
        }),
        'complete': (function(){
          element.remove();
          var dropped = target.find('.dropped').removeClass('dropped');
          dropped.hide().insertAfter($('#emptyIcon'));
          $('#emptyIcon').remove();
          updateCircle(function(){ dropped.show(); });
        }),
        'cancel':(function(){
          element.css('opacity','1');
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
                updateCircle();
              }
              // Inside
              if (cloneBottom > object.top && cloneRight > object.left && cloneLeft < object.right && cloneTop < object.bottom) { 
                $('#emptyIcon').addClass('inside');
                console.log('inside');
              }
              // Outside
              if (cloneBottom < object.top || cloneRight < object.left || cloneLeft > object.right || cloneTop > object.bottom) {
                console.log('outside');
                removeEmpty();
              }
            }
          });
        }
      }
    }
  }

  function spinnerBind() {
    $('html').on('keydown',function(event){
      $('.spinner').each(function(){
        if ($(this).is(':visible') && !$(this).hasClass('edit') && $(this).hasClass('visible')) {
          spinnerInput({'key':event.which,'el': $(this)});
        }
      });
    }); 

    $('.spinner').on('click',function(event){ event.stopPropagation(); });
    
    $('.spinner .value').on('click',function(event){
      var input   = $(this).parents('.spinner').find('input'),
          spinner = $(this).parents('.spinner'),
          value   = $(this).parents('.spinner').find('.value').text();

      spinner.toggleClass('edit');
      input.focus().val(value);
      
    });

    $('.spinner').on('keydown',function(event){
      spinnerInput({'key': event.which, 'el': $(this)});
    });

  }

  /* --------------------- End Functions ---------------- */

$(function(){
  iconContainerBind();
  centerRings();
  protonBind();  
  arrowKeyPos();
  spinnerBind();

  putOnCircle({'parent':$('#secondRing'),'child':$('.icon-container')});
  
  $('.key-container').hover(function(){
    $(this).addClass('hover');
  },function(){
    $(this).removeClass('hover');
  });

  /* Toggle the Alt, Ctrl and Shift Keys */
  $('#keyboard .toggle-key').click(function(){
    $(this).toggleClass('toggled');
    
  });

  /* Spinner */

  /* Buttons and Icons that Spawn the Spinner */
  $('#keyboard .undo.key-container').click(function(event){
    $('#keyboard .undo.spinner').toggleClass('visible');
    event.stopPropagation();
  });

  $('.icon-container .icon.zoom').click(function(event){
    $('.zoom.spinner').toggleClass('visible');
    event.stopPropagation();
  });

  /* Outter Wheel */
  
  putOnCircle({'parent':$('#outter-ring'),'child':$('.icon-container')});
});