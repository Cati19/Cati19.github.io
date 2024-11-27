$(function() {
    const intersection = $("#intersection");
  
    function initializecircle() {
      $(".circle").draggable({
        drag: function(event, ui) {
          checkOverlap();
        },
        stop: function() {
          checkOverlap(); 
        }
      });
    }
  
    initializecircle();
  
    $("#div-selector").on("change", function() {
      const selectedDiv = $("#" + $(this).val()); 
      selectedDiv.toggle();
      checkOverlap(); 
    });
  
    function checkOverlap() {
      const divs = $(".circle:visible"); 
      let overlapFound = false;
  
      divs.each(function(i, div1) {
        divs.each(function(j, div2) {
          if (i !== j && $(div1).collision($(div2)).length > 0) {
            handleOverlap(div1, div2);
            overlapFound = true;
          }
        });
      });
  
      if (!overlapFound) {
        intersection.hide(); 
      }
    }
  
    function handleOverlap(el1, el2) {
      const key = `${el1.id}_${el2.id}`;
      const reverseKey = `${el2.id}_${el1.id}`;
      const overlapData = combinations[key] || combinations[reverseKey];
  
      if (overlapData) {
          const rect1 = el1.getBoundingClientRect();
          const rect2 = el2.getBoundingClientRect();
  
          const overlapLeft = Math.max(rect1.left, rect2.left);
          const overlapTop = Math.max(rect1.top, rect2.top);
          const overlapRight = Math.min(rect1.right, rect2.right);
          const overlapBottom = Math.min(rect1.bottom, rect2.bottom);
  
          if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
              const overlapCenterX = (overlapLeft + overlapRight) / 2;
              const overlapCenterY = (overlapTop + overlapBottom) / 2;
  
              intersection.html(`<a href="${overlapData.url}" target="_self">${overlapData.text}</a>`).show();
  
              const intersectionWidth = intersection.outerWidth();
              const intersectionHeight = intersection.outerHeight();
  
              intersection.css({
                  left: `${overlapCenterX - intersectionWidth / 2}px`,
                  top: `${overlapCenterY - intersectionHeight / 2}px`,
                  transform: "translate(-80%, -850%)" 
              });
          } else {
              intersection.hide();
          }
      } else {
          intersection.hide();
      }
  }
});
  