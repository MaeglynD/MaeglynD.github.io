var rq1 = document.getElementById("rq1");
var img = document.getElementById('myImg');
var x = document.getElementsByTagName("BODY")[0]
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modal = document.getElementById('myModal');
var close = document.getElementById("close");


rq1.onclick = function(){
modal.style.display = "block";
  modalImg.src = "../assets/materializeEx.png";
  captionText.innerHTML = "Osu archive";
  x.style.overflowY = "hidden";
}
close.onclick = function() {
  modal.style.display = "none";
}
