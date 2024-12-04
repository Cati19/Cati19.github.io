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
      const divs = $(".circle:visible"); // Nur sichtbare Kreise
      const activeIds = divs.map((_, div) => div.id).get(); // IDs der sichtbaren Kreise
      let overlapFound = false;
    
      // Prüfe spezifische Kombinationen
      const hardCodedGroups = [
        { ids: ['age', 'gender', 'race'], data: combinations['gender_age_race'] },
        { ids: ['age', 'sexual-orientation', 'gender'], data: combinations['sexual-orientation_gender_age'] },
        { ids: ['race', 'ethnicity', 'gender', 'age'], data: combinations['race_ethnicity_gender_age'] },
      ];
    
      hardCodedGroups.forEach(group => {
        if (group.ids.every(id => activeIds.includes(id))) {
          displayIntersection(group.data, group.ids);
          overlapFound = true;
        }
      });
    
      if (!overlapFound) {
        intersection.hide(); // Verstecke das Intersections-Div, wenn keine Übereinstimmung gefunden wird
      }
    }
  
  function mergeOverlappingGroups(groups) {
      let merged = [];
  
      groups.forEach(group => {
          let mergedWithExisting = false;
  
          // Prüfe, ob die aktuelle Gruppe mit bestehenden Gruppen verbunden werden kann
          merged = merged.map(existingGroup => {
              if ([...group].some(id => existingGroup.has(id))) {
                  mergedWithExisting = true;
                  group.forEach(id => existingGroup.add(id)); // Verbinden
                  return existingGroup;
              }
              return existingGroup;
          });
  
          if (!mergedWithExisting) {
              merged.push(new Set(group));
          }
      });
  
      return merged;
  }
  
  
  function displayIntersection(overlapData, group) {
    const boundingRects = group.map(id => document.getElementById(id).getBoundingClientRect());
  
    // Berechne die gemeinsame Überlappung
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
  
      intersection.css({
        left: `${overlapCenterX - intersectionWidth / 2}px`,
        top: `${overlapCenterY - intersectionHeight / 2}px`,
        transform: "translate(-50%, -50%)"
      });
    } else {
      intersection.hide();
    }
  
}

  
});
  