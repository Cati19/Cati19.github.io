$(document).ready(function() {
  function adjustTextBasedOnWidth() {
      if ($(window).width() <= 647) { 
          $('.option[data-value="disability"]').html('Beein-trächtigung');
          $('.option[data-value="gender"]').html('Geschlechts-identität');
          $('.option[data-value="religion"]').html('Glaubens-zugehörigkeit');
      } else {
          $('.option[data-value="disability"]').text('Beeinträchtigung');
          $('.option[data-value="gender"]').text('Geschlechtsidentität');
          $('.option[data-value="religion"]').text('Glaubenszugehörigkeit');
      }
  }
  adjustTextBasedOnWidth();

  $(window).resize(function() {
      adjustTextBasedOnWidth();
  });
});


$(function() {
    const intersection = $("#intersection");
  
    function initializecircle() {
      $(".circle").draggable({
        containment: ".spawn",
        drag: function(event, ui) {
          checkOverlap();
        },
        stop: function() {
          checkOverlap(); 
        }
      });
    }
  
    initializecircle();

    $(".option").on("click", function() {
      const selectedValue = $(this).data("value");
      const selectedDiv = $("#" + selectedValue); 

      selectedDiv.toggle();

      $(this).toggleClass("selected");

      checkOverlap(); 
  });

  function checkOverlap() {
    const divs = $(".circle:visible"); 
    const activeIds = divs.map((_, div) => div.id).get(); 
    const boundingRects = Object.fromEntries(
      activeIds.map(id => [id, document.getElementById(id).getBoundingClientRect()])
    );
    let overlapFound = false;
  
    hardCodedGroups.forEach(group => {
      if (group.ids.every(id => activeIds.includes(id))) {
        const allRectsOverlap = group.ids.every((id1, _, ids) => 
          ids.every(id2 => id1 === id2 || isOverlapping(boundingRects[id1], boundingRects[id2]))
        );
        if (allRectsOverlap) {
          displayIntersection(group.data, group.ids);
          overlapFound = true;
          return; 
        }
      }
    });
  
    if (overlapFound) return; 
  
    for (let i = 0; i < activeIds.length; i++) {
      for (let j = i + 1; j < activeIds.length; j++) {
        const id1 = activeIds[i];
        const id2 = activeIds[j];
        const rect1 = boundingRects[id1];
        const rect2 = boundingRects[id2];
  
        if (isOverlapping(rect1, rect2)) {
          const overlapData = combinations[`${id1}_${id2}`];
          if (overlapData) {
            displayIntersection(overlapData, [id1, id2]);
            overlapFound = true;
            return; 
          }
        }
      }
    }
  
    if (!overlapFound) {
      intersection.hide();
    }
  }

  function isOverlapping(rect1, rect2) {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    );
  }
  
  function displayIntersection(overlapData, group) {
    const boundingRects = group.map(id => document.getElementById(id).getBoundingClientRect());
  
    const overlapLeft = Math.max(...boundingRects.map(rect => rect.left));
    const overlapTop = Math.max(...boundingRects.map(rect => rect.top));
    const overlapRight = Math.min(...boundingRects.map(rect => rect.right));
    const overlapBottom = Math.min(...boundingRects.map(rect => rect.bottom));
  
    if (overlapRight > overlapLeft && overlapBottom > overlapTop) {
      const overlapCenterX = (overlapLeft + overlapRight) / 2;
      const overlapCenterY = (overlapTop + overlapBottom) / 2;
  
      intersection.html(`<a href="${overlapData.url}" target="_self">${overlapData.text}</a>`).show();
  
      const intersectionWidth = intersection.outerWidth();
      const intersectionHeight = intersection.outerHeight();
  
      let offsetX = 0;
      let offsetY = 0;

      if (window.innerWidth < 450) {
        offsetX = 10; 
        offsetY = -230;
      } else if (window.innerWidth < 768) {
        offsetX = 10; 
        offsetY = -170;
      } else if (window.innerWidth < 1200) {
        offsetX = 0;
        offsetY = -180;
      } else {
        offsetX = -70;
        offsetY = -160;
      }
  
      intersection.css({
        left: `${overlapCenterX - intersectionWidth / 2 + offsetX}px`,
        top: `${overlapCenterY - intersectionHeight / 2 + offsetY}px`,
        transform: "none" 
      });
    } else {
      intersection.hide();
    }
  }

});
  