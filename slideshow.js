const autoScrollDelay = 10000; // 10 seconds

let slideshowList = document.getElementsByClassName("slideshow");
let slideFocusNumList = [];
let autoScrollTimerList = [];

for (let i = 0; i < slideshowList.length; i++) {
    let container = slideshowList[i].getElementsByClassName("slideshow-container")[0];

    slideFocusNumList[i] = 0;
    let slidesLength = container.getElementsByClassName("slide").length;
    autoScrollTimerList[i] = window.setInterval( function() { autoScroll(i, slidesLength); }, autoScrollDelay);
    container.scrollLeft = 0;
}

function updateTimer(slideshowId, slidesLength) {
    window.clearInterval(autoScrollTimerList[slideshowId]);
    autoScrollTimerList[slideshowId] = window.setInterval(function() { autoScroll(slideshowId, slidesLength); }, autoScrollDelay);
}

function showSlide(slideshowId, slideNum, updateTime) {
    let container = slideshowList[slideshowId].getElementsByClassName("slideshow-container")[0];
    let slideList = slideshowList[slideshowId].getElementsByClassName("slide");
    
    if (updateTime) {
        updateTimer(slideshowId, container.getElementsByClassName("slide").length);
    }
    slideFocusNumList[slideshowId] = slideNum;
    container.scrollLeft = slideList[slideFocusNumList[slideshowId]].offsetLeft;
}

function scrollSlides(slideshowId) {
    let container = slideshowList[slideshowId].getElementsByClassName("slideshow-container")[0];
    let buttonList = slideshowList[slideshowId].getElementsByClassName("slideshow-button");
    let slideList = container.getElementsByClassName("slide");

    let pos = container.scrollLeft;
    let slideLength = container.scrollWidth / slideList.length;
    let slideNum = Math.floor((pos + (slideLength / 2)) / slideLength);
    buttonList[slideFocusNumList[slideshowId]].classList.remove("slideshow-button-focus");
    updateTimer(slideshowId, container.getElementsByClassName("slide").length);
    slideFocusNumList[slideshowId] = slideNum;
    buttonList[slideFocusNumList[slideshowId]].classList.add("slideshow-button-focus");
}

function autoScroll(slideshowId, slidesLength) {
    showSlide(slideshowId, (slideFocusNumList[slideshowId] + 1) % slidesLength, false);
}