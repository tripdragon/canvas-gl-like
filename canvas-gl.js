
import { init, tacos } from './main.js';

// Define the class for the custom element
// CustomHTMLCanvasElement
class CanvasGL extends HTMLCanvasElement {
// class CanvasGL extends HTMLElement {
// export customElements.define('canvas-gl', 
  // class CanvasGL extends HTMLElement {
    constructor() {
      super(); // Always call super() first in the constructor
      
      let src = this.getAttribute(`src`);
      let shader = this.getAttribute(`shader`);
      if(src && shader){
        // debugger
        tacos(src);
        let _this = this;
        var image = new Image();
        image.src = src;  // MUST BE SAME DOMAIN!!!
        image.onload = function() {
          // debugger
         init({canvas:_this, image:image, fragShader: shader});
        }
      }
      else if(shader){
        init({canvas:this, fragShader: shader});
      }
      else {
        init({canvas:this});
      }

      // Create a shadow DOM
      // this.attachShadow({mode: 'open'});

      // const canvas = document.createElement('canvas');

      // Append the element to the shadow DOM
      // this.shadowRoot.appendChild(canvas);
    }
    tacos(){
      console.log("narfs");
    }
  }
// );


// customElements.define('canvas-gl', );
customElements.define('canvas-gl', CanvasGL, { extends: 'canvas' } );
