var rq1 = document.getElementById("rq1");
var rq2 = document.getElementById("rq2");
var rq3 = document.getElementById("rq3");
var rq4 = document.getElementById("rq4");
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modal = document.getElementById('myModal');
var close = document.getElementById("close");


rq1.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/startpageClean.png";
  captionText.innerHTML = "<a href='https://startpageclean.github.io/' target='_blank' id='capText'> Check out the live site Here! </a>";
}
rq2.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/startpageDream.png";
  captionText.innerHTML = "Startpage Dream";
}
rq3.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/startpageDreamAdd.png";
  captionText.innerHTML = "Adding a shortcut";
}
rq4.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/startpageKind.png";
  captionText.innerHTML = "Startpage Kind";
}
close.onclick = function() {
  modal.style.display = "none";
}
