document.addEventListener("DOMContentLoaded", function() {
  
  function menuFixed() {
    
    window.addEventListener('scroll', function(){
      let topView = document.querySelector('body').getBoundingClientRect().top,
          header = document.querySelector('header');

      if(topView < 0) header.classList.add('fixed');
      else header.classList.remove('fixed');
      
    });
    
  }
  menuFixed();

  function activeCounter(){
    const counters = document.querySelectorAll('.counter-item .number');

    counters.forEach(function(counter){
        let updateCounter = function(){
          let target = +counter.getAttribute('data-target'),
              c = +counter.innerText,
              increment = target / target;
          if (counter.getAttribute('data-target') > 1000) {
            increment = target / 100
          }
          if (c < target) {
            counter.innerText = Math.ceil(c + increment);
            setTimeout(updateCounter, 1);
          } else {
            counter.innerText = target;
          }
        }
        updateCounter();
    });

  }
  activeCounter();

  function toggleMenu() {
    let button = document.querySelector(".burger-menu"),
        overlay = document.querySelector(".overlay-menu"),
        menu = document.querySelector("ul.container-menu");

    button.addEventListener("click", function(){
        overlay.classList.add("active");
        menu.classList.add("active");
    });

    function hideMenu() {
        overlay.classList.remove("active");
        menu.classList.remove("active");
    }

    overlay.addEventListener("click", function(){
        hideMenu();
    });

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
            hideMenu();
        }
    };

}
toggleMenu();

});