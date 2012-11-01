function bindBody() {
  $('body').on('mousemove',function(e){
    iconContainer.drag();
    spinner.drag(e);
    menu.quickPick.hover(e);
  });

  $('body').on('click',function(e){
    menu.quickPick.click(e);
  });
  
}
$(function(){
  bindBody();
});