  import { settings, select, classNames } from './settings.js';
  import Home from './components/Home.js';
  import Product from './components/Product.js';
  import Cart from './components/Cart.js';
  import Booking from './components/Booking.js';
  

  const app = {

    initPages: function() {
      const thisApp = this;
      const idFromHash = window.location.hash.replace('#/', '');

      thisApp.pages = document.querySelector(select.containerOf.pages).children;
      thisApp.navLinks = document.querySelectorAll(select.nav.links);

      let pageMatchingHash = thisApp.pages[0].id;

      for(let page of thisApp.pages) {
        if(page.id === idFromHash) {
          pageMatchingHash = page.id;
          break;
        }
      }

      // console.log('pageMatchingHash', pageMatchingHash);
      thisApp.activatePage(pageMatchingHash);

      for(let link of thisApp.navLinks) {
        link.addEventListener('click', function(event) {
          const clickedElement = this;
          event.preventDefault();

          // get page id from href attribute 
          const id = clickedElement.getAttribute('href').replace('#', '');

          // run thisApp.activatePage with that id
          thisApp.activatePage(id);

          // change URL hash
          window.location.hash= '#/' + id;
        });
      }
    },

    activatePage: function(pageId) {
      const thisApp = this;

      // add class "active" to matching pages, remove from non-matching
      for(let page of thisApp.pages) {
        page.classList.toggle(classNames.pages.active, page.id === pageId);
      }
      // add class "active" to matching links, remove from non-matching
      for(let link of thisApp.navLinks) {
        link.classList.toggle(
          classNames.nav.active, 
          link.getAttribute('href') === '#' + pageId
          );
      }
    },

    initMenu: function() {
      const thisApp = this;
      // const testProduct = new Product();
      // console.log('testProduct:', testProduct);
      for(let productData of thisApp.data.products) {
        new Product(productData.id, productData);
      }
    },

    initData: function() {
      const thisApp = this;
    
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;

      fetch(url)
      .then(function(rawResponse) {
        return rawResponse.json();
        })
      .then(function(parsedResponse) {
        // console.log('parsedResponse', parsedResponse);

      // save parasedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;
      // console.log(parsedResponse);
          
      // execute initMenu method
        thisApp.initMenu();
      });
      // console.log('thisApp.data', JSON.stringify(thisApp.data));       
    },

    initHome: function() {
      const thisApp = this;
  
      thisApp.homePageContainer = document.querySelector(select.containerOf.homePage);
      thisApp.home = new Home(thisApp.homePageContainer);
  
      thisApp.home.dom.orderLink.addEventListener('click', function(event){
        event.preventDefault();
        thisApp.activatePage(this.getAttribute('href').replace('#', ''));
      });
  
      thisApp.home.dom.bookingLink.addEventListener('click', function(event) {
        event.preventDefault();
        thisApp.activatePage(this.getAttribute('href').replace('#', ''));
      });
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);

      thisApp.productList = document.querySelector(select.containerOf.menu);

      thisApp.productList.addEventListener('add-to-cart', function(event) {
        app.cart.add(event.detail.product.prepareCartProduct());
      });
    },

    initBooking: function(){
      const thisApp = this;
  
      thisApp.BookingWidgetContainer = document.querySelector(select.containerOf.booking);
      thisApp.booking = new Booking(thisApp.BookingWidgetContainer);
    },

    init: function(){
      const thisApp = this;

      thisApp.initPages();
      thisApp.initData();
      thisApp.initHome();
      thisApp.initCart();
      thisApp.initBooking();
    },
  };

  app.init();
  
