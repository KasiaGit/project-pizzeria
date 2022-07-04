import { select, classNames, templates } from '../settings.js';
import AmountWidget from './AmountWidget.js';
import utils from '../utils.js';

class Product {
    constructor(id, data) {
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();
    }

    renderInMenu() {
      const thisProduct = this;

      // generate HTML based on template
      const generatedHTML = templates.menuProduct(thisProduct.data);

      // create element using.createElementFromHTML
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);

      // find menu container
      const menuContainer = document.querySelector(select.containerOf.menu);

      // add element to menu
      menuContainer.appendChild(this.element);
    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    initAccordion () {
      const thisProduct = this;

      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

      /* START: add event listener to clickable trigger on event click */
      clickableTrigger.addEventListener('click', function(event) {
      // console.log(event.target);
        
        
      /* prevent default action for event */
        event.preventDefault;

      /* find active product (product that has active class) */
      const productActive = document.querySelector('.product.active');
      // console.log(productActive);
        

        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(productActive && thisProduct.element != productActive){
          productActive.classList.remove('active');
        }

        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle('active');

      });
    }

    initOrderForm(){
        const thisProduct = this;
        thisProduct.form.addEventListener('submit', function(event){
          event.preventDefault();
          thisProduct.processOrder();
        });
        
        for(let input of thisProduct.formInputs){
          input.addEventListener('change', function(){
            thisProduct.processOrder();
          });
        }
        
        thisProduct.cartButton.addEventListener('click', function(event){
          event.preventDefault();
          thisProduct.processOrder();
          thisProduct.addToCart();
        });
      }

    processOrder() {
        const thisProduct = this;
      
        // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
        const formData = utils.serializeFormToObject(thisProduct.form);
      
        // set price to default price
        let price = thisProduct.data.price;
      
        // for every category (param)...
        for(let paramId in thisProduct.data.params) {
          // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
          const param = thisProduct.data.params[paramId];
          // console.log(paramId, param);
      
          // for every option in this category
          for(let optionId in param.options) {
            // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
            const option = param.options[optionId];
            // console.log(optionId, option);
            // check if there is param with a name of paramId in formData and if it includes optionId
            const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
            if(optionSelected) {
              // check if the option is not default
              if(option.default != true) {
                // add option price to price variable
                price= option.price + price;
              }
            } else {
              // check if the option is default
              if(option.default == true) {
                // reduce price variable
                price = price - option.price;
              }
            }

            const typeParam = param['label'].toLowerCase();
            const valParam  = option['label'].toLowerCase();            
            const optionImage = thisProduct.imageWrapper.querySelector(`.${typeParam}-${valParam}`);
            
            if(optionImage) {
              if(optionSelected) {
                optionImage.classList.add(classNames.menuProduct.imageVisible);
              }
              else {
                optionImage.classList.remove(classNames.menuProduct.imageVisible);
              }
            }
          }
        }
        thisProduct.priceSingle = price;
        // multiply price by amount
        price *= thisProduct.amountWidget.value;
        // update calculated price in the HTML
        thisProduct.priceElem.innerHTML = price;

      }

    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', function(){
        thisProduct.processOrder();
      });
    }
   
    prepareCartProduct(){
      const thisProduct = this;

      const productSummary = {};
      productSummary.id = thisProduct.id;
      productSummary.name = thisProduct.data.name;
      productSummary.amount = thisProduct.amountWidget.value;
      productSummary.priceSingle = thisProduct.priceSingle;
      productSummary.price = productSummary.priceSingle * productSummary.amount; 
      productSummary.params = thisProduct.prepareCartProductParams();

      return productSummary;
    }
    prepareCartProductParams(){
      const thisProduct = this;

      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      const params = {};
    
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        // console.log(paramId, param);
    
         // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
         params[paramId] = {
          label: param.label,
          options: {}
        };
        // for every option in this category
        for(let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          // console.log(optionId, option);
          // check if there is param with a name of paramId in formData and if it includes optionId
          const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
          if(optionSelected) {
            params[paramId].options[optionId] = option.label;
          }
        }
      }
      return params;
    }
    addToCart(){
      const thisProduct = this;

      // app.cart.add(thisProduct.prepareCartProduct());
      const event = new CustomEvent('add-to-cart', {
        bubbles: true,
        detail: {
          product: thisProduct,
        },
      });

      thisProduct.element.dispatchEvent(event);
    }
  }

  export default Product;