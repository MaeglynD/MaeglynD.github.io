
var body = document.getElementsByTagName("BODY")[0];
var x = 0;

if(localStorage.getItem("mode") == "dark"){
  darkMode();
}else{
  lightMode();
}

function darkMode(){
  body.classList.add("nightmode");
}

function lightMode(){
  body.classList.remove("nightmode");
}

function nightmode(){
  body.classList.toggle("nightmode")
  if(body.classList.contains("nightmode")){
    localStorage.setItem("mode", "dark");
  }else{
    localStorage.setItem("mode", "light");
  }
}

var night = document.getElementById("nightmode");

night.onclick = function(){
  nightmode();
}
