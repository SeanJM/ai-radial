function bindBody() {
  $('body').on('mousemove',function(e){
    iconContainer.drag();
    spinner.drag(e);
  });
}
$(function(){
  bindBody();
});