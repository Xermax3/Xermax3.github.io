const AUTOSCROLL_DELAY = 10000; // 10 seconds
const SLIDESHOW_CLASSNAME = "slideshow";
const SLIDESHOW_CONTAINER_CLASSNAME = "slideshow-container";
const SLIDESHOW_SLIDE_CLASSNAME = "slide";
const SLIDESHOW_BUTTON_CLASSNAME = "slide-button";
const SLIDESHOW_BUTTON_FOCUS_CLASSNAME = "slide-button-focus";


// Once page is loaded, setup every slideshow.
document.addEventListener("DOMContentLoaded", () => {
    
    for (let root of document.getElementsByClassName(SLIDESHOW_CLASSNAME)) {
        let slideshow = {}

        try {
            slideshow.container = root.getElementsByClassName(SLIDESHOW_CONTAINER_CLASSNAME)[0];
        } catch (error) {
            error("Slideshow does not have a slideshow-container!");
        }
        slideshow.slides = slideshow.container.getElementsByClassName(SLIDESHOW_SLIDE_CLASSNAME);
        slideshow.buttons = root.getElementsByClassName(SLIDESHOW_BUTTON_CLASSNAME);

        // Find initial focused slide and set initial position
        for (let i = 0; i < slideshow.slides.length; i++) {
            if (slideshow.buttons[i].classList.contains(SLIDESHOW_BUTTON_FOCUS_CLASSNAME)) {
                slideshow.slideFocusId = i;
                break;
            }
        }

        // Wait for all images to load. Otherwise slideshow might initially focus on first image loaded.
        let images = slideshow.container.getElementsByTagName("img");
        let imagesLoaded = { count: 0 };
        for (let image of images) {
            if (image.complete) {
                updateLoadedImageAndAddEvents(slideshow, images.length, imagesLoaded);
            } else {
                image.onload = function() {
                    updateLoadedImageAndAddEvents(slideshow, images.length, imagesLoaded);
                }
            }
        }
    }

});

function updateLoadedImageAndAddEvents(slideshow, imageCount, imagesLoaded) {
    imagesLoaded.count++;
    if (imagesLoaded.count == imageCount) {
        slideshow.container.style.scrollSnapType="x mandatory"

        // Add button and scroll events
        for (let i = 0; i < slideshow.slides.length; i++) {
            slideshow.buttons[i].onclick = function() { showSlide(slideshow, i, true) };
        }
        slideshow.container.ontouchmove = function() {
            scrollSlides(slideshow);
        };
        slideshow.container.onscroll = function() {
            scrollSlides(slideshow);
        };

        slideshow.autoScrollTimer = window.setInterval( function() { autoScroll(slideshow); }, AUTOSCROLL_DELAY);
    }
}

function resetTimer(slideshow) {
    window.clearInterval(slideshow.autoScrollTimer);
    slideshow.autoScrollTimer = window.setInterval(function() { autoScroll(slideshow); }, AUTOSCROLL_DELAY);
}

function showSlide(slideshow, slideId, doResetTimer) {
    slideshow.container.scrollLeft = slideshow.slides[slideId].offsetLeft + 2;
    if (doResetTimer) {
        resetTimer(slideshow);
    }
}

function scrollSlides(slideshow) {
    let pos = slideshow.container.scrollLeft;
    let slideLength = slideshow.container.scrollWidth / slideshow.slides.length;
    let slideNum = Math.floor((pos + (slideLength / 2)) / slideLength);
    if (slideshow.slideFocusId == slideNum) {
        resetTimer(slideshow);
    } else {
        slideshow.buttons[slideshow.slideFocusId].classList.remove(SLIDESHOW_BUTTON_FOCUS_CLASSNAME);
        slideshow.slideFocusId = slideNum;
        slideshow.buttons[slideNum].classList.add(SLIDESHOW_BUTTON_FOCUS_CLASSNAME);
    }
    
}

function autoScroll(slideshow) {
    showSlide(slideshow, (slideshow.slideFocusId + 1) % slideshow.slides.length, false);
}