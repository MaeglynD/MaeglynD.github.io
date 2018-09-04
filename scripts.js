var body = document.getElementsByTagName('body')[0];
var link = document.getElementsByTagName('a')
var imgfake = document.getElementById("imgfake");
var c = document.getElementById("container").children
var x = 1;
imgfake.addEventListener("click", function(){
  if(x == 4){
    x = x-4;
    body.style.backgroundImage = 'url("bg/' + x + '.png")';
    for (var i = 0; i < c.length; i++) {
      c[i].style.color = "#272525";
    }
    for (var i = 0; i < link.length; i++) {
      link[i].style.color = "red";
    }
  }else{
    body.style.backgroundImage = 'url("bg/' + x + '.png")';
    for (var i = 0; i < c.length; i++) {
      c[i].style.color = "white";
    }
    for (var i = 0; i < link.length; i++) {
      link[i].style.color = "white";
    }
  }
  x++;
});
