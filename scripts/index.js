'use strict';

const mainSection = document.querySelectorAll('.slide:not(#landing)');
const spyElements = document.querySelectorAll('.scrollspy-element');
const svgContainer = document.querySelector('.svg-container');
window.onscroll = onScroll;
onScroll();

function animateRiver() {
    
}

function onScroll(ev) {
    mainSection.forEach((v, i) => {
        let rect = v.getBoundingClientRect().y;
        if (rect < window.innerHeight - 300) {
            spyElements.forEach((spyElement) => {
                const active = document.querySelector('.scrollspy-element.active');
                if (active !== null) {
                    active.classList.remove('active')
                }
                spyElements[i].classList.add('active');
            });
            v.classList.add('active');
        } else {
            v.classList.remove('active')
        }
    });
}
