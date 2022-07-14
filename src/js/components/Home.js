import { select, templates, settings } from '../settings.js';

class Home {
    constructor(wrapper) {
        const thisHome = this;
        thisHome.render(wrapper);
        thisHome.initAction();
    }
    render(wrapper) {
        const thisHome = this;

        const weekStart = settings.hours.weekStart;
        const weekEnd = settings.hours.weekEnd;
        const openHour = settings.hours.open + ':00';
        const closeHour = settings.hours.close + ':00';

        const generatedHTML = templates.homePage(),
        generatedText = weekStart + '-' + weekEnd + ', ' + openHour + ' - ' + closeHour;

        thisHome.dom = {};

        thisHome.dom.wrapper = wrapper;
        thisHome.dom.wrapper.innerHTML = generatedHTML;

        thisHome.dom.openingHours = thisHome.dom.wrapper.querySelector(select.homePage.openingHours);
        thisHome.dom.openingHours.innerHTML = generatedText;

        thisHome.dom.orderLink = thisHome.dom.wrapper.querySelector(select.homePage.orderLink);
        thisHome.dom.bookingLink = thisHome.dom.wrapper.querySelector(select.homePage.bookingLink);

        thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.homePage.mainCarousel);
        }

    initAction() {
        const thisHome = this;

        thisHome.carousel = new Splide(select.homePage.mainCarousel, { //eslint-disable-line no-undef
            type: 'loop',
            autoplay: true,
            interval: 3000,
            arrows: false,
            easing: 'ease',
        });

        thisHome.carousel.mount();
    }
}

export default Home;