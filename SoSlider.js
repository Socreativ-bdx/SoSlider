/**
 * SoSlider
 * Author: Sõcreativ'
 * Version: v1.5.0
 * Link: https://bitbucket.org/socreativ/soslider/src/master/
 */
"use-strict";
console.log('SoSlider - v1.5.0 - Sõcreativ');

class SoSlider {

    static #LIST = [];

    static getAll() {
        return SoSlider.#LIST;
    }

    static killAll() {
        SoSlider.#LIST.forEach(instance => instance.kill());
    }

    constructor(element, params = {}) {
        this.element = element;
        this.dots = params.dots || false;
        this.ease = params.ease || 'ease-in-out';
        this.arrows = params.arrows || false;
        this.vertical = params.vertical || false;               // not implemented - Scheduled v1.6.0
        this.autoplay = params.autoplay || false;
        this.infinite = params.infinite || false;
        this.speed = params.speed || 350;
        this.pauseOnHover = params.pauseOnHover || false;
        this.autoplaySpeed = params.autoplaySpeed || 3000;
        this.fade = params.fade || false;
        this.draggable = params.draggable || false;
        this.treshold = params.treshold || 200;
        this.appendArrows = params.appendArrows || null;
        this.appendDots = params.appendDots || null;
        this.nextArrow = params.nextArrow || null;
        this.prevArrow = params.prevArrow || null;
        this.arrowsClass = params.arrowsClass || null;
        this.dotsClass = params.dotsClass || null;
        this.dotsColor = params.dotsColor || '#000';
        this.arrowsColor = params.arrowsColor || '#000';
        this.asNavFor = params.asNavFor || null;                // not implemented - Scheduled v1.6.0
        this.slideToShow = params.slideToShow || 1;
        this.slideToScroll = params.slideToScroll || 1;
        this.centerMode = params.centerMode || false;
        this.focusOnSelect = params.focusOnSelect || false;

        // Handle incompatible params
        if (this.centerMode) this.fade = false;
        if (this.fade) this.draggable = false;
        if (this.slideToScroll > this.slideToShow) this.slideToScroll = this.slideToShow;
        if (this.centerMode) this.slideToScroll = 1;

        SoSlider.#LIST.push(this);
        this.initSlider();
    }

    initSlider() {
        this.element.classList.add('SoSlider');
        if (this.centerMode) this.element.classList.add('SoSlider__center');
        this.slides = Array.from(this.element.children);
        this.width = (this.element.clientWidth / this.slideToShow);
        this.offset = this.infinite && !this.fade ? this.slideToShow : 0;
        if (this.centerMode) this.width -= this.width / 8;
        this.isSliding = false;
        this.trackOffset = 0;
        this.currentSlide = 0;

        this.createTrack();
        if (this.dots) this.createDots();
        if (this.arrows) this.createArrows();
        if (this.draggable) this.ListenForDrag();
        if (this.autoplay) this.initAutoplay();
        if (this.pauseOnHover && this.autoplay) this.ListenForHover();
        if (this.infinite && !this.fade) this.initInfinite();
        if (this.centerMode && this.focusOnSelect) this.ListenForFocus();
    }

    createTrack() {
        this.frame = document.createElement('div');
        this.frame.classList.add('SoSlider__frame');
        this.element.append(this.frame);

        this.track = document.createElement('div');
        this.track.classList.add('SoSlider__track');
        this.frame.append(this.track);
        this.centerOffset = this.centerMode ? this.frame.clientWidth / 2 - this.width / 2 : 0
        this.slides.forEach((s, i) => {
            if (i === 0) {
                s.classList.add('active');
            }
            s.classList.add('SoSlider__slide');
            s.style.width = this.width + 'px';
            this.track.append(s);
        });
        this.track.style.transform = `translateX(-${this.offset * this.width - this.centerOffset}px)`;
    }

    initInfinite() {
        this.copy = [];
        for (let i = 0; i < this.slideToShow; i++) {
            const copyFirst = this.slides[i].cloneNode(true);
            copyFirst.removeAttribute('data-fancybox');
            copyFirst.classList.add('SoSlider__copy');
            if (i === 0) copyFirst.classList.remove('active');
            this.track.append(copyFirst);

            const copyLast = this.slides[this.slides.length - 1 - i].cloneNode(true);
            copyLast.removeAttribute('data-fancybox');
            copyLast.classList.add('SoSlider__copy');
            this.track.prepend(copyLast);
            this.copy.push(copyFirst, copyLast);
        }
    }

    initAutoplay() {
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.setAutoplayInstance();
                }
                else {
                    this.clearAutoplayInstance();
                }
            });
        }, { threshold: 0.5 });
        this.observer.observe(this.element);
    }

    setAutoplayInstance() {
        if (this.autoplay) {
            this.autoPlayInstance = setInterval(this.autoPlay.bind(this), this.autoplaySpeed);
        }
    }

    clearAutoplayInstance() {
        clearInterval(this.autoPlayInstance);
    }

    autoPlay() {
        if (this.infinite) {
            this.slideToNext();
        }
        else if (this.currentSlide !== (this.slides.length - 1) && this.fade) {
            this.slideToNext();
        }
        else {
            this.clearAutoplayInstance();
        }
    }

    resetInterval() {
        this.clearAutoplayInstance();
    }

    setClassActive(i) {
        Array.from(document.querySelectorAll('.SoSlider__slide.active')).forEach(e => e.classList.remove('active'));
        this.slides[i].classList.add('active');
        if (i === 0 && this.centerMode) this.copy[0].classList.add('active');
        if (i === this.slides.length - 1 && this.centerMode) this.copy[1].classList.add('active');
        if (this.dots) {
            document.querySelector('.SoSlider__dot.active').classList.remove('active');
            this.dotsElement[i / this.slideToScroll].classList.add('active');
        }
    }

    slideToNext() {
        this.isSliding = true;
        if (this.currentSlide < (this.slides.length - 1)) {
            this.currentSlide += this.slideToScroll;
            if (this.slides[this.currentSlide] === undefined) this.currentSlide = 0;
        }
        else if (this.infinite) {
            this.currentSlide = 0;
            if (!this.fade) {
                this.fakeSlide = this.slides.length;
                this.setClassActive(this.currentSlide);
                return this.slideTo(this.fakeSlide, this.currentSlide);
            }
        }
        this.fade ? this.fadeTo(this.currentSlide) : this.slideTo(this.currentSlide);
        this.setClassActive(this.currentSlide);
    }

    slideToPrev() {
        this.isSliding = true;
        if (this.currentSlide > 0) {
            this.currentSlide -= this.slideToScroll;
            if (this.slides[this.currentSlide] === undefined) this.currentSlide = this.slide.length - 1;
        }
        else if (this.infinite) {
            this.currentSlide = this.slides.length - 1;
            if (!this.fade) {
                this.fakeSlide = -1;
                this.setClassActive(this.currentSlide);
                return this.slideTo(this.fakeSlide, this.currentSlide);
            }
        }
        this.fade ? this.fadeTo(this.currentSlide) : this.slideTo(this.currentSlide);
        this.setClassActive(this.currentSlide);
    }

    slideTo(slideToAnim, slideToTranslate = slideToAnim) {
        const a = this.track.animate(
            [{ transform: `translateX(-${(slideToAnim + this.offset) * this.width - this.centerOffset}px)` }],
            { duration: this.speed, easing: this.ease }
        );
        a.onfinish = () => {
            this.track.style.transform = `translateX(-${(slideToTranslate + this.offset) * this.width - this.centerOffset}px)`;
            this.trackOffset = -(slideToTranslate + this.offset) * this.width;
            this.isSliding = false;
        };
    }

    fadeTo(slide) {
        const a = this.track.animate([{ opacity: 0 },], { duration: this.speed, fill: "forwards", easing: this.ease });
        a.onfinish = () => {
            this.track.style.transform = `translateX(-${(slide + this.offset) * this.width}px)`;
            setTimeout(() => {
                this.track.animate([{ opacity: 1 },], { duration: this.speed, fill: "forwards", easing: this.ease });
                this.isSliding = false;
            }, 100);
        }
    }

    ListenForDrag() {
        this.drag = { initialPos: 0, posX1: 0, posX2: 0 };
        this.trackOffset = this.infinite ? -this.width : 0;
        this.track.addEventListener('mousedown', this.DragStart.bind(this));
        this.track.addEventListener('touchstart', this.DragStart.bind(this));
        this.track.addEventListener('touchend', this.DragEnd.bind(this));
        this.track.addEventListener('touchmove', this.Dragging.bind(this));
    }

    DragStart(e) {
        e.preventDefault();
        this.drag.initialPos = this.trackOffset;
        if (e.type == 'touchstart') {
            this.drag.posX1 = e.touches[0].clientX;
        }
        else {
            this.drag.posX1 = e.clientX;
            document.onmouseup = this.DragEnd.bind(this);
            document.onmousemove = this.Dragging.bind(this);
        }
    }

    DragEnd(e) {
        let posFinal = -this.track.style.transform.match(/\d+/)[0];
        if (this.infinite || this.currentSlide !== 0) {
            if (posFinal - this.drag.initialPos < -this.treshold) {
                this.slideToNext();
            }
            else if (posFinal - this.drag.initialPos > this.treshold) {
                this.slideToPrev();
            }
            else {
                this.slideTo(this.currentSlide);
            }
        }
        else {
            this.slideTo(this.currentSlide);
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }

    Dragging(e) {
        if (e.type == 'touchmove') {
            this.drag.posX2 = this.drag.posX1 - e.touches[0].clientX;
            this.drag.posX1 = e.touches[0].clientX;
        }
        else {
            this.drag.posX2 = this.drag.posX1 - e.clientX;
            this.drag.posX1 = e.clientX;
        }
        let newPos = this.trackOffset - this.drag.posX2;

        this.track.style.transform = `translateX(${newPos}px)`;
        this.trackOffset = newPos;
    }

    createDots() {
        this.dotsElement = [];
        const dotParent = document.createElement('div');
        dotParent.classList.add('SoSlider__dots');
        const pages = this.slides.length / this.slideToScroll;
        for (let i = 0; i < pages; i++) {
            let dot = document.createElement('button');
            dot.classList.add('SoSlider__dot');
            if (this.dotsClass !== null) dot.classList.add(this.dotsClass);
            if (i === 0) dot.classList.add('active');
            dotParent.append(dot);
            this.dotsElement.push(dot);
        };
        if (this.appendDots) {
            this.appendDots.append(dotParent);
            this.appendDots.style.setProperty('--dotsColor', this.dotsColor);
        }
        else {
            this.element.append(dotParent);
            this.element.style.setProperty('--dotsColor', this.dotsColor);
        }
        this.ListenForDots();
    }

    ListenForDots() {
        this.dotsElement.forEach((dot, i) => dot.addEventListener('click', () => {
            if (!this.isSliding) {
                this.isSliding = true;
                if (this.autoplay) {
                    this.resetInterval();
                    this.setAutoplayInstance();
                }
                this.currentSlide = i;
                this.slideTo(this.currentSlide);
                this.setClassActive(this.currentSlide);
            }
        }));
    }

    createArrows() {
        if (!this.prevArrow) {
            this.leftArrow = document.createElement('div');
            this.leftArrow.classList.add('SoSlider__leftArrow', 'SoSlider__arrows');
            this.leftArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>ic_keyboard_arrow_left_48px</title><g fill="#000000" class="nc-icon-wrapper"><path d="M30.83 32.67l-9.17-9.17 9.17-9.17L28 11.5l-12 12 12 12z"></path></g></svg>';
        }
        else {
            this.leftArrow = this.prevArrow;
        }
        if (this.arrowsClass !== null) this.leftArrow.classList.add(this.arrowsClass);


        if (!this.nextArrow) {
            this.rightArrow = document.createElement('div');
            this.rightArrow.classList.add('SoSlider__rightArrow', 'SoSlider__arrows');
            this.rightArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>ic_keyboard_arrow_right_48px</title><g fill="#000000" class="nc-icon-wrapper"><path d="M17.17 32.92l9.17-9.17-9.17-9.17L20 11.75l12 12-12 12z"></path></g></svg>';
        }
        else {
            this.rightArrow = this.nextArrow;
        }
        if (this.arrowsClass !== null) this.rightArrow.classList.add(this.arrowsClass);

        if (this.appendArrows) {
            this.appendArrows.style.setProperty('--arrowsColor', this.arrowsColor);
            this.appendArrows.append(this.leftArrow);
            this.appendArrows.append(this.rightArrow);
        }
        else {
            this.element.style.setProperty('--arrowsColor', this.arrowsColor);
            this.element.append(this.leftArrow);
            this.element.append(this.rightArrow);
        }
        this.ListenForArrows();
    }

    ListenForArrows() {
        this.leftArrow.addEventListener('click', () => {
            if (!this.isSliding) {
                this.slideToPrev();
                if (this.autoplay) {
                    this.resetInterval();
                    this.setAutoplayInstance();
                }
            }
        });
        this.rightArrow.addEventListener('click', () => {
            if (!this.isSliding) {
                this.slideToNext();
                if (this.autoplay) {
                    this.resetInterval();
                    this.setAutoplayInstance();
                }
            }
        });
    }

    ListenForFocus() {
        this.slides.forEach((s, i) => s.addEventListener('click', () => {
            if (!this.isSliding) {
                this.isSliding = true;
                if (this.autoplay) {
                    this.resetInterval();
                    this.setAutoplayInstance();
                }
                this.currentSlide = i;
                this.slideTo(this.currentSlide);
                this.setClassActive(this.currentSlide);
            }
        }));
        this.copy.forEach((c, i) => c.addEventListener('click', () => {
            if (!this.isSliding) {
                this.isSliding = true;
                if (this.autoplay) {
                    this.resetInterval();
                    this.setAutoplayInstance();
                }
                this.currentSlide = i%2 === 0 
                    ? Math.floor(i / 2)
                    :this.copy.length - 1 - Math.floor(i/2);
                this.slideTo(this.currentSlide);
                this.setClassActive(this.currentSlide);
            }
        }));
    }

    ListenForHover() {
        this.element.addEventListener('mouseover', () => this.clearAutoplayInstance());
        this.element.addEventListener('mouseleave', () => this.setAutoplayInstance());
    }

    // Public functions

    kill() {
        clearInterval(this.autoPlayInstance);
        this.observer.disconnect();
        const id = SoSlider.#LIST.indexOf(this);
        SoSlider.#LIST.splice(id, 1);
        return null;
    }

    slideGoTo(index = 0){
        this.currentSlide = index;
        this.fade ? this.fadeTo(this.currentSlide) : this.slideTo(this.currentSlide);
    }

    getCurrentSlide(){
        return this.slide[this.currentSlide];
    }


}