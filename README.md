![version](https://img.shields.io/badge/Version-v1.5.1-informational)

# README #

Sõcreativ' Slider JS.

[Démo](https://valmgr.github.io/SoSlider/demo.html)

### Information ###

* Work In Progress
* v1.5.1

### Documentation ###

#### Create basic slider
```js
const myslider = new SoSlider(element, {});
```

#### Create slider with options
```js
const slider = new SoSlider(element, {
    speed: 350,
    arrows: true,
    autoplay: true,
    infinite: true
});
```

#### Slider options

| Options         | Type             | Default       | Description                           |
| --------------- | ---------------- | ------------- | ------------------------------------- |
| `speed`         | `int`            | `350`         | Animation speed in ms                 |
| `ease`          | `String`         | `ease-in-out` | Easing for animation                  |
| `arrows`        | `Bool`           | `false`       | Show prev/next arrows                 |
| `dots`          | `Bool`           | `false`       | Show dots                             |
| `autoplay`      | `Bool`           | `false`       | Enable autoplay                       |
| `autoplaySpeed` | `Int`            | `3000`        | autoplay speed in ms                  |
| `pauseOnHover`  | `Bool`           | `false`       | Pause autoplay on hover               |
| `infinite`      | `Bool`           | `false`       | Infinite loop sliding                 |
| `vertical`      | `Bool`           | `false`       | Vertical slide mode                   |
| `asNavFor`      | `SoSlider`       | `null`        | Sync with another SoSlider            |
| `fade`          | `Bool`           | `false`       | Enable fade animation                 |
| `draggable`     | `Bool`           | `false`       | Enable dragging                       |
| `treshold`      | `int`            | `200`         | Treshold before switch while dragging |
| `appendArrows`  | `HTMLDivElement` | `null`        | Node to attach arrows                 |
| `appendDots`    | `HTMLDivElement` | `null`        | Node to attachs dots                  |
| `nextArrow`     | `HTMLDivElement` | `null`        | Node to use as next arrow             |
| `prevArrow`     | `HTMLDivElement` | `null`        | Node to use as prev arrow             |
| `dotsClass`     | `String`         | `null`        | Class for dots elements               |
| `arrowsClass`   | `String`         | `null`        | Class for arrows elements             |
| `arrowsColor`   | `String`         | `'#000'`      | Arrows colors                         |
| `dotsColor`     | `String`         | `'#000'`      | Dots colors                           |
| `slideToShow`   | `int`            | `1`           | Slides to show in same time           |
| `slideToScroll` | `int`            | `1`           | Slides to scroll in same time         |
| `centerMode`    | `bool`           | `false`       | Align current slide to center         |
| `focusOnSelect` | `bool`           | `false`       | Focus and center slide on click       |



### Sõcreativ' Web agency ###

* [https://socreativ.com/](https://socreativ.com/)
* [contact@socreativ.com](mailto:contact@socreativ.com)