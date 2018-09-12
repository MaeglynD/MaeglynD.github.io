var acc = document.getElementsByClassName("plus");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        this.classList.toggle("fa-plus");
        this.classList.toggle("fa-minus");
        var rlw = this.nextElementSibling;
        if (rlw.style.maxHeight){
          rlw.style.maxHeight = null;
        } else {
          rlw.style.maxHeight = rlw.scrollHeight + "px";
    }
    });
}
