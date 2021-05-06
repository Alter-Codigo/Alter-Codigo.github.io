'use strict';

const landing = document.querySelector('section.landing');
const mainSection = document.querySelectorAll('.slide:not(.landing)');
const spyElements = document.querySelectorAll('.scrollspy-element');
const svgPaths = document.querySelectorAll('.svg-container svg path');
const maxDashArray = [];
const currentDashArray = [];
let dynamicStyles = null;
let accumulatedDash = 0.0;
svgPaths.forEach((path) => {
    const dashLength = path.getTotalLength();
    accumulatedDash = accumulatedDash + dashLength;
    maxDashArray.push(dashLength);
    currentDashArray.push(-dashLength);
    path.style.strokeDasharray = `${dashLength} ${dashLength}`;
    path.style.strokeDashoffset = -dashLength;
});

window.onscroll = onScroll;
onScroll();

function addDashAnimation(from, to, idx) {
    if (!dynamicStyles) {
      dynamicStyles = document.createElement('style');
      dynamicStyles.type = 'text/css';
      document.head.appendChild(dynamicStyles);
    }
    const body = `@keyframes dash-array-${idx} {
        from {
            stroke-dashoffset: ${from};
        }
        to {
            stroke-dashoffset: ${to};
        }
    }`;
    if (dynamicStyles.sheet.cssRules[idx] !== undefined) {
        dynamicStyles.sheet.deleteRule(idx);
    }
    dynamicStyles.sheet.insertRule(body, idx);
  }

function computePathOffset(stateDash) {
    const sum = maxDashArray.reduce((acc, cur) => acc + cur);
    let percentage = stateDash * sum / 100 ;
    const stateDashArray = [];
    maxDashArray.map((v, i) => {
        if (percentage <= 0) {
            stateDashArray.push(-maxDashArray[i]);
        } else if (percentage >= v) {
            stateDashArray.push(0);
        } else {
            const delta = percentage - v;
            stateDashArray.push(delta);
        }
        percentage = percentage - v;
    });
    return stateDashArray;
}

function animateRiver(ev) {
    let stateDash = 0;
    mainSection.forEach((v, i) => {
        let rect = v.getBoundingClientRect().y;
        if (rect < window.innerHeight - 300) {
            stateDash = (i + 1) * (100 / 11);
        }
    });
    const stateDashArray = computePathOffset(stateDash);

    svgPaths.forEach((v, i) => {
        if (currentDashArray[i] !== stateDashArray[i]) {
            console.log("OK?");
            addDashAnimation(currentDashArray[i], stateDashArray[i], i);
            v.style.strokeDashoffset = stateDashArray[i];
            v.style.animation = `dash-array-${i} 1.5s`;
            currentDashArray[i] = stateDashArray[i];
        }
    });
}

function backgroundAttachements(ev) {
    const h = landing.clientHeight;
    const breakpoint = (h / 4.0) * 3.0;
    if (landing.getBoundingClientRect().y < -breakpoint) {
        landing.classList.add('not-attached');
    } else {
        landing.classList.remove('not-attached');
    }
}

function activateSlides(ev) {
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

function onScroll(ev) {
    animateRiver(ev);
    backgroundAttachements(ev);
    activateSlides(ev);
}
