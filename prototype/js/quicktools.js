var quicktools = {}

quicktools.init = function () {
  var parent = $('#quicktools'),
      tmp,
      el;
  parent.find('.tool-select').each(function(){
    el = $(this),
    putOnCircle({'parent':el,'child':$('.icon')});
  });
  parent.find('.selected-tool .arrow').on('click',function(e){
    var 
      root         = $(this).closest('.quicktool'),
      toolSelect   = root.find('.tool-select'),
      selectedTool = root.find('.selected-tool .icon'),
      target;
    
    if (toolSelect.hasClass('visible')) {
      $('html').trigger('click');
    }
    else {
      root.addClass('top');
      toolSelect.addClass('visible').on('click',function(e){
        target = $(e.target);
        
        toolSelect.removeClass('visible');
        root.removeClass('top');
        selectedTool.replaceWith(target.clone().removeAttr('style'));
      });
      e.stopPropagation();
    }
  });
  $('html').on('click',function(){
    $('.top').removeClass('top');
    $('.visible').each(function() {
      $(this).removeClass('visible');
    });
  });
}

/* Onload */
$(function(){
  quicktools.init();
});