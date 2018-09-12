var rq1 = document.getElementById("rq1");
var rq2 = document.getElementById("rq2");
var rq3 = document.getElementById("rq3");
var rq4 = document.getElementById("rq4");
var img = document.getElementById('myImg');
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modal = document.getElementById('myModal');
var close = document.getElementById("close");

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

rq1.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/oldcolLogin.png";
  captionText.innerHTML = "Old COL8 Login page";
}
rq2.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/newcolLogin.png";
  captionText.innerHTML = "New COL8 Login page";
}
rq3.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/oldcolUpload.png";
  captionText.innerHTML = "Old COL8 Upload page";
}
rq4.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/newcolUpload.png";
  captionText.innerHTML = "New COL8 Upload page";
}
close.onclick = function() {
modal.style.display = "none";
}
