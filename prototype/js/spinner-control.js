
var hover = function (element) {
  var oldHover = element.parent().find('.hover');
  mouseleave(oldHover);  
  mouseover(element);
  element.trigger('hover');
}

var mouseleave = function (element,callback) {
  element.removeClass('hover');
  if (typeof callback == 'function') { callback(); }
}

var mouseover = function (element,callback) {
  element.addClass('hover');
  
  element.on('mouseleave',function(){
    mouseleave(element);
  });

  if (typeof callback == 'function') { callback(); }
}

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
colors.bind = {};

colors.background        = {};

colors.text              = {}

colors.opacity           = {};

colors.spinner              = {}
colors.spinner.empty        = 135;
colors.spinner.fill         = '0,152,255';
colors.spinner.handle       = 80;

colors.bind.background = function(str) {
  var 
    active = $('#main-configuration-menu-brightness .spinner-container'),
    spinnerBG;
  
  colors.background.hover = '0,152,255';

  if (typeof str != 'undefined') {
    var base = parseInt((str/255*190)+51);
    
    colors.bind.text(255-base);
    colors.background.normal = base;
    
    if (base < 255) { spinnerBG = 130; colors.background.hover = '0,152,255'; $('body').removeClass('dark').addClass('light'); }
    if (base < 220) { spinnerBG = 120; $('body').removeClass('medium'); }
    if (base < 190) { spinnerBG = 100; $('body').addClass('medium'); }
    if (base < 150) { spinnerBG = 50; colors.background.hover = '255,152,20'; $('body').removeClass('light').addClass('dark').addClass('medium'); }
    if (base < 100) { spinnerBG = 20; $('body').removeClass('medium'); }
    
    colors.bind.spinner(spinnerBG);
  }
  
  $('.background').css('background-color',rgb(colors.background.normal));
  spinner.handle({'active':active,'angle':str/255*360});

}

colors.bind.opacity = function(str) {
  colors.opacity.faded = '0.4';
  if (typeof str != 'undefined') {
    colors.opacity.normal = (str/100);
  }
  $('.opacity').css('opacity',colors.opacity.normal);
  var active = $('#main-configuration-menu-opacity .spinner-container');
  spinner.handle({'active':active,'angle':str/100*360});
}

colors.bind.border = function () {
  $('.border').css('border','1px solid rgba(0,0,0,0.1)');
}

colors.bind.text = function(str) {
  colors.text.normal       = 135;
  colors.text.hover        = 255;
  if (typeof str != 'undefined') {
    colors.text.normal = str;
  }
}

colors.bind.spinner = function(str) {
  if (typeof str != 'undefined') {
    colors.spinner.empty = str;
    if (colors.background.normal < 255) { 
      colors.spinner.handle = 160; 
      colors.spinner.fill = '0,152,255';
    }
    if (colors.background.normal < 150) { 
      colors.spinner.handle = 160; 
      colors.spinner.fill = '255,152,20';
    }
    if (colors.background.normal < 100) { 
      colors.spinner.handle = 100; 
    }
  }
  $('.spinner-empty').css('background',rgb(colors.spinner.empty));
  $('.spinner-fill').css('background',rgb(colors.spinner.fill));
  $('.spinner-container .handle').css('background-image','-webkit-linear-gradient(top,' + rgb(colors.spinner.handle+90) + ',' + rgb(colors.spinner.handle) + ')');
  $('.spinner-container .handle div').css('background-image','-webkit-linear-gradient(bottom,' + rgb(colors.spinner.handle+90) + ',' + rgb(colors.spinner.handle+20) + ')');
}

colors.bind.all = function() {
  colors.bind.background();
  colors.bind.opacity();
  colors.bind.border();
  colors.bind.spinner();
  colors.bind.text();
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
    var spinnerX = (active.offset().left+(active.outerWidth()/2));
    var spinnerY = (active.offset().top+(active.outerHeight()/2));
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var dx = mouseX - spinnerX;
    var dy = mouseY - spinnerY;

    var radians = Math.atan2(dy,dx);
    var angle = (radians * 180 / Math.PI)+180;

    if (active.closest('#main-configuration-menu-brightness').size() > 0) {
      var brightness = parseInt((radians+Math.PI)/(Math.PI*2)*255);
      colors.bind.background(brightness);
    }
    if (active.closest('#main-configuration-menu-opacity').size() > 0) {
      var opacity = parseInt((radians+Math.PI)/(Math.PI*2)*100);
      colors.bind.opacity(opacity);
    }
  }
}

spinner.handle = function(object) {
  var 
    active      = object.active,
    angle       = object.angle,
    handle      = active.find('.handle'),
    r           = (active.outerWidth()/2)-2;
    radians     = ((object.angle-180)/180)*Math.PI,
    hx          = (r*Math.cos(radians)+r-(handle.width()/2))+2,
    hy          = (r*Math.sin(radians)+r-(handle.width()/2))+2;
    spinnerProg = parseInt(((angle)/360)*active.find('.prog').size());

    active.find('.prog:lt(' + spinnerProg + ')').show();
    active.find('.prog:gt(' + spinnerProg + ')').hide();
    handle.css('left',hx).css('top',hy);
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
    e.stopPropagation();
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
  colors.bind.background(255);
  colors.bind.opacity(90);
  colors.bind.all();
});