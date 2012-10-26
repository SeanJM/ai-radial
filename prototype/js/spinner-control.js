var colors               = {};

colors.background        = {};
colors.background.normal = 'rgb(255,255,255)';
colors.background.hover  = 'rgb(25,126,255)';

colors.text              = {}
colors.text.normal       = 'rgb(135,135,135)';
colors.text.hover        = 'rgb(255,255,255)';

colors.opacity           = {};
colors.opacity.normal    = '0.8';
colors.opacity.faded     = '0.4';

colors.bind = {};
colors.bind.background = function() {
  $('.background').css('background-color',colors.background.normal);
  $('.background').css('color',colors.text);

  $('.background.mouseover').off('mouseover');
  $('.background.mouseover').off('mouseleave');
  
  $('.background.mouseover').on('mouseover',function() {
    $(this).css('background-color',colors.background.hover);
  });
  $('.background.mouseover').on('mouseleave',function() {
    $(this).css('background-color',colors.background.normal)
  });
}
colors.bind.opacity = function() {
  $('.opacity').css('opacity',colors.opacity.normal);
}
colors.bind.border = function () {
  $('.border').css('border','1px solid rgba(0,0,0,0.1)');
}
colors.bind.all = function() {
  colors.bind.background();
  colors.bind.opacity();
  colors.bind.border();
}

var configure = {};
configure.brightness = function (brightness) {
  colors.background.normal = 'rgb(' + brightness + ',' + brightness + ',' + brightness + ')';
  colors.bind.background();
}

configure.opacity = function (opacity) {
  colors.opacity.normal = opacity/100;
  colors.opacity.faded  = (opacity*0.5)/100;
  colors.bind.opacity();
}

var spinner = {};
spinner.drag = function(e) {
  if ($('body').hasClass('spinner-drag')) {
    var active = $('#main-configuration-menu .spinner-container.active');
    var handle = active.find('.handle');
    var spinnerX = (active.offset().left+(active.outerWidth()/2));
    var spinnerY = (active.offset().top+(active.outerHeight()/2));
    var r = active.outerWidth()/2;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var dx = mouseX - spinnerX;
    var dy = mouseY - spinnerY;

    var radians = Math.atan2(dy,dx);

    var angle = radians * 180 / Math.PI;
    
    var hx = r*Math.cos(radians)+r-(handle.width()/2);
    var hy = r*Math.sin(radians)+r-(handle.width()/2);

    active.find('.handle').css('left',parseInt(hx)).css('top',parseInt(hy));

    if (active.closest('#main-configuration-menu-brightness').size() > 0) {
      var brightness = parseInt((radians+Math.PI)/(Math.PI*2)*255);
      configure.brightness(brightness);
    }
    if (active.closest('#main-configuration-menu-opacity').size() > 0) {
      var opacity = parseInt((radians+Math.PI)/(Math.PI*2)*100);
      configure.opacity(opacity);
    }
  }
}
spinner.control = function() {
  $('#main-configuration-menu .spinner-container').on('mousedown',function(e){
    $(this).addClass('active');
    $('body').addClass('spinner-drag');
    var transitionValue = $('#ai-wheel.background').css('-webkit-transition');
    $('#main-wheel.background').css('-webkit-transition','none');
    $('body').on('mouseup',function () {
      $(this).removeClass('spinner-drag');
      $('#main-wheel.background').css('-webkit-transition',transitionValue);
      $('#main-configuration-menu .spinner-container.active').removeClass('active');
    });
  });
}
$(function() {
  spinner.control();
  colors.bind.all();
});