class SoSlider{

    static #LIST = [];

    static getAll(){
        return SoSlider.#LIST;
    }

    static killAll(){
        SoSlider.#LIST.forEach(instance => instance.kill());
    }

    constructor(element, params = {}){
        this.element = element;
        this.dots = params.dots || false;
        this.arrows = params.arrows || false;
        this.vertical = params.vertical || false;
        this.autoplay = params.autoplay || false;
        this.infinite = params.infinite || false;
        this.speed = params.speed || 300;
        this.autoplaySpeed = params.autoplaySpeed || 3000;
        this.fade = params.fade || false;
        this.draggable = params.draggable || false;
        this.arrowsElement = params.arrowsElement || null;
        this.dotsElement = params.dotsElement || null;
        this.dotsColor = params.dotsColor || '#000';
        this.arrowsColor = params.arrowsColor || '#000';
        this.currentSlide = 0;

        SoSlider.#LIST.push(this);
        this.initSlider();
    }

    initSlider(){
        this.element.classList.add('SoSlider');
        this.slides = Array.from(this.element.children);
        this.createTrack();
        this.resizeSlides();

        if(this.dots) this.createDots();
        if(this.arrows) this.createArrows();
        if(this.draggable) this.ListenForDrag();
        if(this.autoplay) this.initAutoplay();
    }

    createTrack(){
        this.frame = document.createElement('div');
        this.frame.classList.add('SoSlider__frame');
        this.element.append(this.frame);


        this.track = document.createElement('div');
        this.track.classList.add('SoSlider__track');
        this.frame.append(this.track);
        this.slides.forEach(s => this.track.append(s));
    }

    resizeSlides(){
        this.width = this.element.clientWidth;
        this.slides.forEach((s, i) => {
            if(i === 0) s.classList.add('active');
            s.classList.add('SoSlider__slide');
            s.style.width = this.width+'px';
        });
    }

    slideToNext(){
        if(this.currentSlide < (this.slides.length - 1)){
            this.currentSlide++;
        }
        else if(this.infinite){
            this.currentSlide = 0;
        }
        this.slide(this.width*this.currentSlide);
    }

    slideToPrev(){
        if(this.currentSlide > 0){
            this.currentSlide--;
            this.slide(this.width*this.currentSlide);
        }
        else if(this.infinite){
            this.currentSlide = 0;
        }
    }

    initAutoplay(){
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    this.setAutoplayInstance();
                }
                else{
                    this.clearAutoplayInstance();
                }
            });
        }, {threshold: 0.5});
        this.observer.observe(this.element);
    }

    setAutoplayInstance(){
        this.autoPlayInstance = setInterval(this.autoPlay.bind(this), this.autoplaySpeed);
    }

    clearAutoplayInstance(){
        clearInterval(this.autoPlayInstance);
    }

    autoPlay(){
        if(this.infinite){
            this.slideToNext();
        }
        else if(this.currentSlide !== (this.slides.length - 1)){
            this.slideToNext();
        }   
        else{
            this.clearAutoplayInstance();
        } 
    }

    resetInterval(){
        this.clearAutoplayInstance();
    }

    slide(pos){
        document.querySelector('.SoSlider__slide.active').classList.remove('active');
        this.slides[this.currentSlide].classList.add('active');
        if(this.dots){
            document.querySelector('.SoSlider__dot.active').classList.remove('active');
            this.dotsElement[this.currentSlide].classList.add('active');
        }
        if(this.fade){
            this.track.animate([{opacity: 0},],{duration: this.speed, fill: "forwards", easing: 'ease-in'});
            setTimeout(() => {
                this.track.style.transform = `translateX(-${pos}px)`;
                setTimeout(() => {
                    this.track.animate([{opacity: 1},],{duration: this.speed, fill: "forwards", easing: 'ease-out'});
                }, 100);
            }, this.speed);
        }
        else{
            let a = this.track.animate(
                [{transform: `translateX(-${pos}px)`}],
                {duration: this.speed, fill: 'forwards', easing: 'ease-in-out'}
            );
            a.onfinish = () => {this.track.style.transform = `translateX(-${pos}px)`};
        }
    }

    ListenForDrag(){
        console.warn('Draggable: Feature not implemented yet.');
    }

    createDots(){
        this.element.style.setProperty('--dotsColor', this.dotsColor);
        if(!this.dotsElement){
            this.dotsElement = [];
            const dotParent = document.createElement('div');
            dotParent.classList.add('SoSlider__dots');
            this.element.append(dotParent);
            this.slides.forEach((s, i) => {
                let dot = document.createElement('button');
                dot.classList.add('SoSlider__dot')
                if(i === 0) dot.classList.add('active');
                dotParent.append(dot);
                this.dotsElement.push(dot);
            });
        }
        else{
            console.warn('dotsElement: Feature not implemented yet.');
            this.dotsElement = false;
            return this.createDots();
        }
        console.log('reached')
        this.ListenForDots();
    }

    ListenForDots(){
        this.dotsElement.forEach((dot, i) => dot.addEventListener('click', () => {
            if(this.autoPlay){
                this.resetInterval();
                this.setAutoplayInstance();
            }
            this.currentSlide = i;
            this.slide(this.width*this.currentSlide);
        }));
    }

    createArrows(){
        this.element.style.setProperty('--arrowsColor', this.arrowsColor);

        this.arrowsElement = [];
        this.leftArrow = document.createElement('div');
        this.leftArrow.classList.add('SoSlider__leftArrow', 'SoSlider__arrows');
        this.leftArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>ic_keyboard_arrow_left_48px</title><g fill="#000000" class="nc-icon-wrapper"><path d="M30.83 32.67l-9.17-9.17 9.17-9.17L28 11.5l-12 12 12 12z"></path></g></svg>';

        this.rightArrow = document.createElement('div');
        this.rightArrow.classList.add('SoSlider__rightArrow', 'SoSlider__arrows');
        this.rightArrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><title>ic_keyboard_arrow_right_48px</title><g fill="#000000" class="nc-icon-wrapper"><path d="M17.17 32.92l9.17-9.17-9.17-9.17L20 11.75l12 12-12 12z"></path></g></svg>';

        this.arrowsElement.push(this.leftArrow);
        this.arrowsElement.push(this.rightArrow);

        this.element.append(this.leftArrow);
        this.element.append(this.rightArrow);

        this.ListenForArrows();
    }

    ListenForArrows(){
        this.leftArrow.addEventListener('click', () => {
            this.slideToPrev();
            if(this.autoPlay){
                this.resetInterval();
                this.setAutoplayInstance()
            } 
        });
        this.rightArrow.addEventListener('click', () => {
            this.slideToNext();
            if(this.autoPlay){
                this.resetInterval();
                this.setAutoplayInstance()
            } 
        });
    }

    kill(){
        const i = SoSlider.#LIST.indexOf(this);
        SoSlider.#LIST.splice(i, 1);
    }

}