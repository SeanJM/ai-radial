var rgb = function (str) {
  var num;
  if (typeof str == 'string') { 
    num = str.split(','); 
    if (num.length > 1) { num = str; }
  }
  else {
    num = str + ',' + str + ',' + str;
  }
  return 'rgb(' + num + ')';
}
var colors               = {};

colors.background        = {};
colors.background.normal = 255;
colors.background.hover  = '25,126,255';

colors.text              = {}
colors.text.normal       = 135;
colors.text.hover        = 255;

colors.opacity           = {};
colors.opacity.normal    = '0.8';
colors.opacity.faded     = '0.4';

colors.spinner              = {}
colors.spinner.empty        = 135;
colors.spinner.fill         = '25,126,255';
colors.spinner.handle       = 80;

colors.bind = {};
colors.bind.background = function(str) {
  if (typeof str != 'undefined') {
    var base = parseInt((str/255*190)+60);
    colors.bind.text(255-base);
    colors.background.normal = base;
    if (base < 250) { spinnerBG = 130; }
    if (base < 220) { spinnerBG = 120; }
    if (base < 190) { spinnerBG = 100; }
    if (base < 140) { spinnerBG = 50; }
    if (base < 100) { spinnerBG = 20; }
    colors.bind.spinner(spinnerBG);
  }
  else {
    $('.mouseover').on('mouseover',function() {
        $(this).css('background-color',rgb(colors.background.hover));
        $(this).css('color',rgb(colors.text.hover));
    });
    $('.mouseover').on('mouseleave',function() {
      $(this).css('background-color',rgb(colors.background.normal));
      $(this).css('color',rgb(colors.text.normal));
    });
  }
  
  $('.background').css('background-color',rgb(colors.background.normal));

}
colors.bind.opacity = function() {
  $('.opacity').css('opacity',colors.opacity.normal);
}
colors.bind.border = function () {
  $('.border').css('border','1px solid rgba(0,0,0,0.1)');
}
colors.bind.text = function(str) {
  if (typeof str != 'undefined') {
    colors.text.normal = str;
  }
  $('.text-color').css('color',rgb(colors.text.normal));
}
colors.bind.spinner = function(str) {
  if (typeof str != 'undefined') {
    colors.spinner.empty = str;
    if (colors.background.normal < 255) { colors.spinner.handle = 160; }
    if (colors.background.normal < 170) { colors.spinner.handle = 150; }
  }
  $('.spinner-empty').css('background',rgb(colors.spinner.empty));
  $('.spinner-fill').css('background',rgb(colors.spinner.fill));
  $('.spinner-container .handle').css('background-image','-webkit-linear-gradient(top,' + rgb(colors.spinner.handle+90) + ',' + rgb(colors.spinner.handle) + ')');
  $('.spinner-container .handle div').css('background-image','-webkit-linear-gradient(bottom,' + rgb(colors.spinner.handle+90) + ',' + rgb(colors.spinner.handle) + ')');
}

colors.bind.all = function() {
  colors.bind.background();
  colors.bind.opacity();
  colors.bind.border();
  colors.bind.spinner();
}

var configure = {};

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
    var r = (active.outerWidth()/2)-2;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var dx = mouseX - spinnerX;
    var dy = mouseY - spinnerY;

    var radians = Math.atan2(dy,dx);

    var angle = radians * 180 / Math.PI;
    
    var hx = (r*Math.cos(radians)+r-(handle.width()/2))+2;
    var hy = (r*Math.sin(radians)+r-(handle.width()/2))+2;

    var spinnerProg = parseInt(((angle+180)/360)*active.find('.prog').size());

    handle.css('left',hx).css('top',hy);
    active.find('.prog:lt(' + spinnerProg + ')').show();
    active.find('.prog:gt(' + spinnerProg + ')').hide();
    if (active.closest('#main-configuration-menu-brightness').size() > 0) {
      var brightness = parseInt((radians+Math.PI)/(Math.PI*2)*255);
      colors.bind.background(brightness);
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
  $('#main-configuration-menu .spinner-container .spinner').each(function(){
    var r = $(this).width()/2;
    var cir = parseInt(2*Math.PI*r);
    for (var i=0;i < cir;i++) {
      var div = $('<div class="prog" style="-webkit-transform:rotate(' + i/cir*360 + 'deg)"><div class="spinner-fill"></div></div>');
      div.css('top',parseInt($(this).height()/2)-1);
      $(this).append(div);
    }
  });
}
$(function() {
  spinner.control();
  colors.bind.all();
});