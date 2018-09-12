<<<<<<< HEAD
var rq1 = document.getElementById("rq1");

var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modal = document.getElementById('myModal');
var close = document.getElementById("close");


rq1.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/perspectiveShowcase.png";
  captionText.innerHTML = "Perspective Design's Artist Showcase";
}

close.onclick = function() {
  modal.style.display = "none";
}
=======
var rq1 = document.getElementById("rq1");

var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modal = document.getElementById('myModal');
var close = document.getElementById("close");


rq1.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/perspectiveShowcase.png";
  captionText.innerHTML = "Perspective Design's Artist Showcase";
}

close.onclick = function() {
  modal.style.display = "none";
}
>>>>>>> 303c1e766adae4fd1e01ebffed16406978e204e6
