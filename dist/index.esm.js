import e,{useState as t,useEffect as r}from"react";import*as a from"@radix-ui/react-dialog";import n from"axios";import{FileUploader as o}from"react-drag-drop-files";import{toast as i,ToastContainer as l}from"react-toastify";function c(){c=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,a=Object.defineProperty||function(e,t,r){e[t]=r.value},n="function"==typeof Symbol?Symbol:{},o=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",l=n.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function u(e,t,r,n){var o=t&&t.prototype instanceof p?t:p,i=Object.create(o.prototype),l=new C(n||[]);return a(i,"_invoke",{value:E(e,r,l)}),i}function d(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var m={};function p(){}function f(){}function h(){}var g={};s(g,o,(function(){return this}));var w=Object.getPrototypeOf,v=w&&w(w(z([])));v&&v!==t&&r.call(v,o)&&(g=v);var y=h.prototype=p.prototype=Object.create(g);function x(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){function n(a,o,i,l){var c=d(e[a],e,o);if("throw"!==c.type){var s=c.arg,u=s.value;return u&&"object"==typeof u&&r.call(u,"__await")?t.resolve(u.__await).then((function(e){n("next",e,i,l)}),(function(e){n("throw",e,i,l)})):t.resolve(u).then((function(e){s.value=e,i(s)}),(function(e){return n("throw",e,i,l)}))}l(c.arg)}var o;a(this,"_invoke",{value:function(e,r){function a(){return new t((function(t,a){n(e,r,t,a)}))}return o=o?o.then(a,a):a()}})}function E(e,t,r){var a="suspendedStart";return function(n,o){if("executing"===a)throw new Error("Generator is already running");if("completed"===a){if("throw"===n)throw o;return O()}for(r.method=n,r.arg=o;;){var i=r.delegate;if(i){var l=k(i,r);if(l){if(l===m)continue;return l}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===a)throw a="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);a="executing";var c=d(e,t,r);if("normal"===c.type){if(a=r.done?"completed":"suspendedYield",c.arg===m)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(a="completed",r.method="throw",r.arg=c.arg)}}}function k(e,t){var r=t.method,a=e.iterator[r];if(void 0===a)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=void 0,k(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var n=d(a,e.iterator,t.arg);if("throw"===n.type)return t.method="throw",t.arg=n.arg,t.delegate=null,m;var o=n.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,m):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,m)}function N(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function L(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function C(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(N,this),this.reset(!0)}function z(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var a=-1,n=function t(){for(;++a<e.length;)if(r.call(e,a))return t.value=e[a],t.done=!1,t;return t.value=void 0,t.done=!0,t};return n.next=n}}return{next:O}}function O(){return{value:void 0,done:!0}}return f.prototype=h,a(y,"constructor",{value:h,configurable:!0}),a(h,"constructor",{value:f,configurable:!0}),f.displayName=s(h,l,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===f||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,h):(e.__proto__=h,s(e,l,"GeneratorFunction")),e.prototype=Object.create(y),e},e.awrap=function(e){return{__await:e}},x(b.prototype),s(b.prototype,i,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,a,n,o){void 0===o&&(o=Promise);var i=new b(u(t,r,a,n),o);return e.isGeneratorFunction(r)?i:i.next().then((function(e){return e.done?e.value:i.next()}))},x(y),s(y,l,"Generator"),s(y,o,(function(){return this})),s(y,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var a in t)r.push(a);return r.reverse(),function e(){for(;r.length;){var a=r.pop();if(a in t)return e.value=a,e.done=!1,e}return e.done=!0,e}},e.values=z,C.prototype={constructor:C,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function a(r,a){return i.type="throw",i.arg=e,t.next=r,a&&(t.method="next",t.arg=void 0),!!a}for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n],i=o.completion;if("root"===o.tryLoc)return a("end");if(o.tryLoc<=this.prev){var l=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(l&&c){if(this.prev<o.catchLoc)return a(o.catchLoc,!0);if(this.prev<o.finallyLoc)return a(o.finallyLoc)}else if(l){if(this.prev<o.catchLoc)return a(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return a(o.finallyLoc)}}}},abrupt:function(e,t){for(var a=this.tryEntries.length-1;a>=0;--a){var n=this.tryEntries[a];if(n.tryLoc<=this.prev&&r.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var i=o?o.completion:{};return i.type=e,i.arg=t,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(i)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),L(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var a=r.completion;if("throw"===a.type){var n=a.arg;L(r)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:z(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),m}},e}function s(e,t,r,a,n,o,i){try{var l=e[o](i),c=l.value}catch(e){return void r(e)}l.done?t(c):Promise.resolve(c).then(a,n)}function u(e){return function(){var t=this,r=arguments;return new Promise((function(a,n){var o=e.apply(t,r);function i(e){s(o,a,n,i,l,"next",e)}function l(e){s(o,a,n,i,l,"throw",e)}i(void 0)}))}}function d(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var a,n,o,i,l=[],c=!0,s=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(a=o.call(r)).done)&&(l.push(a.value),l.length!==t);c=!0);}catch(e){s=!0,n=e}finally{try{if(!c&&null!=r.return&&(i=r.return(),Object(i)!==i))return}finally{if(s)throw n}}return l}}(e,t)||p(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e){return function(e){if(Array.isArray(e))return f(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||p(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function p(e,t){if(e){if("string"==typeof e)return f(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?f(e,t):void 0}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,a=new Array(t);r<t;r++)a[r]=e[r];return a}!function(e,t){void 0===t&&(t={});var r=t.insertAt;if(e&&"undefined"!=typeof document){var a=document.head||document.getElementsByTagName("head")[0],n=document.createElement("style");n.type="text/css","top"===r&&a.firstChild?a.insertBefore(n,a.firstChild):a.appendChild(n),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e))}}('/*! tailwindcss v3.3.2 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:""}html{-webkit-text-size-adjust:100%;font-feature-settings:normal;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-variation-settings:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{color:inherit;font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]{display:none}*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{inset:0}.left-\\[50\\%\\]{left:50%}.right-5{right:1.25rem}.top-7{top:1.75rem}.top-\\[50\\%\\]{top:50%}.mx-auto{margin-left:auto;margin-right:auto}.my-3{margin-bottom:.75rem;margin-top:.75rem}.mb-1{margin-bottom:.25rem}.mb-4{margin-bottom:1rem}.mr-1{margin-right:.25rem}.mr-4{margin-right:1rem}.mr-5{margin-right:1.25rem}.mt-1{margin-top:.25rem}.mt-4{margin-top:1rem}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.h-10{height:2.5rem}.h-12{height:3rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.h-60{height:15rem}.h-7{height:1.75rem}.h-8{height:2rem}.h-\\[540px\\]{height:540px}.h-\\[600px\\]{height:600px}.h-fit{height:-moz-fit-content;height:fit-content}.h-full{height:100%}.w-10{width:2.5rem}.w-16{width:4rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-7{width:1.75rem}.w-8{width:2rem}.w-\\[375px\\]{width:375px}.w-full{width:100%}.translate-x-\\[-50\\%\\]{--tw-translate-x:-50%}.translate-x-\\[-50\\%\\],.translate-y-\\[-50\\%\\]{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-y-\\[-50\\%\\]{--tw-translate-y:-50%}@keyframes spin{to{transform:rotate(1turn)}}.animate-spin{animation:spin 1s linear infinite}.cursor-not-allowed{cursor:not-allowed}.cursor-pointer{cursor:pointer}.appearance-none{-webkit-appearance:none;-moz-appearance:none;appearance:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-end{justify-content:flex-end}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-x-2{-moz-column-gap:.5rem;column-gap:.5rem}.gap-y-1{row-gap:.25rem}.-space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(-.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(-.5rem*var(--tw-space-x-reverse))}.space-x-2>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.5rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.5rem*var(--tw-space-x-reverse))}.space-x-3>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(.75rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(.75rem*var(--tw-space-x-reverse))}.space-x-4>:not([hidden])~:not([hidden]){--tw-space-x-reverse:0;margin-left:calc(1rem*(1 - var(--tw-space-x-reverse)));margin-right:calc(1rem*var(--tw-space-x-reverse))}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.5rem*var(--tw-space-y-reverse));margin-top:calc(.5rem*(1 - var(--tw-space-y-reverse)))}.space-y-3>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(.75rem*var(--tw-space-y-reverse));margin-top:calc(.75rem*(1 - var(--tw-space-y-reverse)))}.space-y-4>:not([hidden])~:not([hidden]){--tw-space-y-reverse:0;margin-bottom:calc(1rem*var(--tw-space-y-reverse));margin-top:calc(1rem*(1 - var(--tw-space-y-reverse)))}.overflow-hidden{overflow:hidden}.overflow-y-auto{overflow-y:auto}.rounded-\\[6px\\]{border-radius:6px}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.bg-black{--tw-bg-opacity:1;background-color:rgb(0 0 0/var(--tw-bg-opacity))}.bg-black\\/30{background-color:rgba(0,0,0,.3)}.bg-blue-400\\/20{background-color:rgba(96,165,250,.2)}.bg-gray-200{--tw-bg-opacity:1;background-color:rgb(229 231 235/var(--tw-bg-opacity))}.bg-green-200{--tw-bg-opacity:1;background-color:rgb(187 247 208/var(--tw-bg-opacity))}.bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255/var(--tw-bg-opacity))}.p-1{padding:.25rem}.p-4{padding:1rem}.p-\\[25px\\]{padding:25px}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-bottom:.25rem;padding-top:.25rem}.py-2{padding-bottom:.5rem;padding-top:.5rem}.py-4{padding-top:1rem}.pb-4,.py-4{padding-bottom:1rem}.pt-8{padding-top:2rem}.text-left{text-align:left}.text-center{text-align:center}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-light{font-weight:300}.font-medium{font-weight:500}.font-normal{font-weight:400}.text-\\[\\#484848\\]{--tw-text-opacity:1;color:rgb(72 72 72/var(--tw-text-opacity))}.text-\\[\\#919191\\]{--tw-text-opacity:1;color:rgb(145 145 145/var(--tw-text-opacity))}.text-black{--tw-text-opacity:1;color:rgb(0 0 0/var(--tw-text-opacity))}.text-gray-400{--tw-text-opacity:1;color:rgb(156 163 175/var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99/var(--tw-text-opacity))}.text-green-500{--tw-text-opacity:1;color:rgb(34 197 94/var(--tw-text-opacity))}.text-red-500{--tw-text-opacity:1;color:rgb(239 68 68/var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255/var(--tw-text-opacity))}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.hover\\:bg-gray-100:hover{--tw-bg-opacity:1;background-color:rgb(243 244 246/var(--tw-bg-opacity))}.hover\\:bg-gray-300:hover{--tw-bg-opacity:1;background-color:rgb(209 213 219/var(--tw-bg-opacity))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}',{insertAt:"top"});var h={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},g=e.createContext&&e.createContext(h),w=function(){return w=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},w.apply(this,arguments)},v=function(e,t){var r={};for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&t.indexOf(a)<0&&(r[a]=e[a]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(a=Object.getOwnPropertySymbols(e);n<a.length;n++)t.indexOf(a[n])<0&&Object.prototype.propertyIsEnumerable.call(e,a[n])&&(r[a[n]]=e[a[n]])}return r};function y(t){return t&&t.map((function(t,r){return e.createElement(t.tag,w({key:r},t.attr),y(t.child))}))}function x(t){return function(r){return e.createElement(b,w({attr:w({},t.attr)},r),y(t.child))}}function b(t){var r=function(r){var a,n=t.attr,o=t.size,i=t.title,l=v(t,["attr","size","title"]),c=o||r.size||"1em";return r.className&&(a=r.className),t.className&&(a=(a?a+" ":"")+t.className),e.createElement("svg",w({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,n,l,{className:a,style:w(w({color:t.color||r.color},r.style),t.style),height:c,width:c,xmlns:"http://www.w3.org/2000/svg"}),i&&e.createElement("title",null,i),t.children)};return void 0!==g?e.createElement(g.Consumer,null,(function(e){return r(e)})):r(h)}function E(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z",clipRule:"evenodd"}}]})(e)}function k(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"}}]})(e)}function N(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z",clipRule:"evenodd"}}]})(e)}function L(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z",clipRule:"evenodd"}}]})(e)}function C(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",clipRule:"evenodd"}}]})(e)}function z(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z",clipRule:"evenodd"}}]})(e)}function O(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",clipRule:"evenodd"}}]})(e)}function S(e){return x({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",clipRule:"evenodd"}}]})(e)}var j=function(t){var r=t.setActiveStep;return e.createElement("div",{className:"flex flex-col h-full items-center justify-between "},e.createElement("div",{className:"flex pt-8 -space-x-2"},e.createElement("img",{src:"/assets/images/icon-integration.png",alt:"Rubber Icon",className:"rounded-full border w-16"}),e.createElement("img",{src:"data:image/svg+xml,%3csvg width='65' height='64' viewBox='0 0 65 64' fill='none' xmlns='http://www.w3.org/2000/svg'%3e %3crect x='1' y='0.5' width='63' height='63' rx='31.5' fill='black' /%3e %3cpath d='M15.8334 22L32.5 12L49.1667 22L32.5 32L15.8334 22Z' fill='%23B5B5B5' /%3e %3cpath d='M15.8334 42L32.5 52V32L15.8334 22V42Z' fill='%23E0E0E0' /%3e %3cpath d='M49.1667 42.6667L32.5 52V32L49.1667 22V42.6667Z' fill='%235C5C5C' /%3e %3crect x='1' y='0.5' width='63' height='63' rx='31.5' stroke='white' /%3e%3c/svg%3e",alt:"Carbon Icon",className:"rounded-full border w-16"})),e.createElement("h1",{className:"text-xl font-light"},e.createElement("span",{className:"font-normal"},"Rubber")," ","uses"," ",e.createElement("span",{className:"font-normal"},"Carbon")," ",e.createElement("br",null),"to connect your data."),e.createElement("ul",{className:""},e.createElement("li",{className:"flex flex-row items-start w-full space-x-2 py-2 px-4"},e.createElement(L,{className:"w-5 h-5 mr-1 text-gray-400 mt-1"}),e.createElement("div",{className:"flex flex-col gap-y-1"},e.createElement("h1",{className:"text-base font-medium"},"Private"),e.createElement("p",{className:"text-sm font-normal text-gray-400"},"Your credentials will never be made available to Rubber."))),e.createElement("li",{className:"flex flex-row items-start w-full space-x-2 py-2 px-4"},e.createElement(N,{className:"w-7 h-7 mr-1 text-gray-400"}),e.createElement("div",{className:"flex flex-col gap-y-1"},e.createElement("h1",{className:"text-md font-medium"},"Secure"),e.createElement("p",{className:"text-sm font-normal text-gray-400"},"You can select to give Rubber access to specific information only.")))),e.createElement("div",{className:"flex flex-col space-y-3 w-full items-center"},e.createElement("p",{className:"text-xs text-center text-gray-400"},"By continuing, you agree to Carbon's",e.createElement("br",null),e.createElement("u",null,"User Terms and Privacy Policy.")),e.createElement("button",{className:"w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer",onClick:function(){return r(1)}},e.createElement("p",null,"Connect"))))};function _(e){return x({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"}},{tag:"path",attr:{fillRule:"evenodd",d:"M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"}}]})(e)}function A(e){return x({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"}}]})(e)}function M(e){return x({tag:"svg",attr:{viewBox:"0 0 15 15",fill:"none"},child:[{tag:"path",attr:{d:"M3.25781 3.11684C3.67771 3.45796 3.83523 3.43193 4.62369 3.37933L12.0571 2.93299C12.2147 2.93299 12.0836 2.77571 12.0311 2.74957L10.7965 1.85711C10.56 1.67347 10.2448 1.46315 9.64083 1.51576L2.44308 2.04074C2.18059 2.06677 2.12815 2.19801 2.2327 2.30322L3.25781 3.11684ZM3.7041 4.84917V12.6704C3.7041 13.0907 3.91415 13.248 4.38693 13.222L12.5562 12.7493C13.0292 12.7233 13.0819 12.4341 13.0819 12.0927V4.32397C13.0819 3.98306 12.9508 3.79921 12.6612 3.82545L4.12422 4.32397C3.80918 4.35044 3.7041 4.50803 3.7041 4.84917ZM11.7688 5.26872C11.8212 5.50518 11.7688 5.74142 11.5319 5.76799L11.1383 5.84641V11.6205C10.7965 11.8042 10.4814 11.9092 10.2188 11.9092C9.79835 11.9092 9.69305 11.7779 9.37812 11.3844L6.80345 7.34249V11.2532L7.61816 11.437C7.61816 11.437 7.61816 11.9092 6.96086 11.9092L5.14879 12.0143C5.09615 11.9092 5.14879 11.647 5.33259 11.5944L5.80546 11.4634V6.29276L5.1489 6.24015C5.09625 6.00369 5.22739 5.66278 5.5954 5.63631L7.53935 5.50528L10.2188 9.5998V5.97765L9.53564 5.89924C9.4832 5.61018 9.69305 5.40028 9.95576 5.37425L11.7688 5.26872ZM1.83874 1.33212L9.32557 0.780787C10.245 0.701932 10.4815 0.754753 11.0594 1.17452L13.4492 2.85424C13.8436 3.14309 13.975 3.22173 13.975 3.53661V12.7493C13.975 13.3266 13.7647 13.6681 13.0293 13.7203L4.33492 14.2454C3.78291 14.2717 3.52019 14.193 3.23111 13.8253L1.47116 11.5419C1.1558 11.1216 1.02466 10.8071 1.02466 10.4392V2.25041C1.02466 1.77825 1.23504 1.38441 1.83874 1.33212Z",fill:"currentColor"}}]})(e)}var P={PRODUCTION:"https://api.carbon.ai",DEVELOPMENT:"https://api.dev.carbon.ai",LOCAL:"http://localhost:8000"},R=function(t){var r=t.setActiveStep,o=t.apikey,i=t.userid,l=t.activeIntegrations,s=t.environment,d=[{id:"notion",subpath:"notion",name:"Notion",icon:e.createElement(M,{className:"w-8 h-8"}),description:"Lets your users connect their Notion accounts to Carbon.",active:!0},{active:!0,name:"Google Docs",subpath:"google",id:"googleDocs",description:"Lets your users connect their Google Docs to Carbon.",scope:"docs",icon:e.createElement(A,{className:"w-7 h-7"}),data_source_type:"GOOGLE_DOCS"},{active:!0,name:"File Upload",subpath:"local",id:"localFiles",description:"Lets your users upload local files to Carbon.",icon:e.createElement(_,{className:"w-7 h-7"}),data_source_type:"LOCAL_FILE"}],m=function(){var e=u(c().mark((function e(t){var r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,n.get("".concat(P[s],"/integrations/").concat(t.subpath,"/oauth_url"),{params:{id:i,apikey:o,scope:t.scope},headers:{"Content-Type":"application/json",authorization:"Bearer ".concat(o),"customer-id":i}});case 3:200===(r=e.sent).status&&r.data&&window.open(r.data.oauth_url,"_blank"),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log("Error in OAuth URL flow: ",e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(t){return e.apply(this,arguments)}}();return e.createElement("div",{className:"flex flex-col h-full items-center"},e.createElement(a.Title,{className:"text-lg mb-4 font-medium w-full"},e.createElement("div",{className:"w-full flex items-center space-x-4"},e.createElement(E,{onClick:function(){return r(0)},className:"cursor-pointer h-6 w-6 text-gray-400"}))),e.createElement("ul",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto"},d.map((function(t){var a=l.map((function(e){return e.data_source_type})).includes(t.data_source_type);return e.createElement("li",{key:t.id,className:"border rounded-md h-fit items-center px-4 w-full ".concat(t.active?"bg-white cursor-pointer hover:bg-gray-100":"bg-gray-200 cursor-not-allowed")},e.createElement("div",{className:"flex flex-row items-center w-full space-x-3 py-4 justify-between ".concat(t.active?"bg-white cursor-pointer hover:bg-gray-100":"bg-gray-200 cursor-not-allowed"),onClick:function(){if(t.active){if("LOCAL_FILE"===t.data_source_type)return void r(t.data_source_type);a?r(t.data_source_type):m(t)}}},e.createElement("div",{className:"flex flex-row items-center"},e.createElement("span",{className:"mr-4"},t.icon),e.createElement("h1",{className:"text-md font-normal"},t.name)),e.createElement("div",{className:"flex flex-col"},e.createElement("div",{className:"flex flex-row w-full items-center space-x-4"},!t.active&&e.createElement("p",{className:"text-xs text-gray-600 bg-white px-4 py-1 rounded-full "},"Coming Soon"),t.active&&a&&e.createElement(k,{className:"text-green-500 w-6 h-6"})))))}))))},F=function(r){var o=r.integrationData,i=r.setActiveStep,l=r.apikey,s=r.userid,p=r.entryPoint,f=r.environment,h=d(t([]),2),g=h[0],w=h[1],v=d(t(null),2),y=v[0],x=v[1],b=function(){var e=u(c().mark((function e(){var t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.post("".concat(P[f],"/integrations/google/sync"),{user_id:s,api_key:l,file_ids:g});case 2:200===(t=e.sent).status&&t.data&&x(t.data);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return e.createElement("div",{className:"flex flex-col h-[540px] items-center"},e.createElement(a.Title,{className:"text-lg mb-4 font-medium w-full"},e.createElement("div",{className:"w-full flex items-center space-x-4"},!p&&e.createElement(E,{onClick:function(){return i(1)},className:"cursor-pointer h-6 w-6 text-gray-400"}),e.createElement("h1",null,"Select Files"))),!y&&e.createElement(e.Fragment,null,e.createElement("div",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto"},o.token.all_files.map((function(t){var r=g.includes(t.id);return e.createElement("div",{key:t.id,className:"border rounded-md h-fit items-center p-4 w-full cursor-pointer ".concat(r?"bg-green-200":"bg-white hover:bg-gray-100"),onClick:function(){w((function(e){return e.includes(t.id)?e.filter((function(e){return e!==t.id})):[].concat(m(e),[t.id])}))}},e.createElement("h1",{className:"text-md font-normal"},t.name))}))),e.createElement("div",{className:"flex flex-col h-full space-y-2 w-full"},e.createElement("button",{className:"w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer",onClick:function(){return b()}},"Sync Files"))),y&&e.createElement("div",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center"},200===y.code?e.createElement(k,{className:"text-green-500 w-8 h-8"}):e.createElement(O,{className:"text-red-500  w-8 h-8"}),e.createElement("p",null,y.message)))};function B(e){return x({tag:"svg",attr:{viewBox:"0 0 1024 1024"},child:[{tag:"path",attr:{d:"M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z"}},{tag:"path",attr:{d:"M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z"}}]})(e)}function T(e){return x({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"path",attr:{d:"M21 12a9 9 0 1 1-6.219-8.56"}}]})(e)}var I=["txt","csv","pdf"];function V(r){var l=r.setActiveStep,s=r.apikey,m=r.userid,p=r.entryPoint,f=r.environment,h=d(t(null),2),g=h[0],w=h[1],v=d(t(null),2),y=v[0],x=v[1],b=d(t(!1),2),N=b[0],L=b[1],C=function(){var e=u(c().mark((function e(){var t,r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,L(!0),(t=new FormData).append("file",g),e.next=6,n.post("".concat(P[f],"/uploadfile"),t,{headers:{"Content-Type":"multipart/form-data",Authorization:"Bearer ".concat(s),"customer-id":m}});case 6:200===(r=e.sent).status&&r.data&&(x(r.data),i.success("Successfully uploaded file"),L(!1)),e.next=15;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0),i.error("Error uploading file"),L(!1);case 15:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}();return e.createElement("div",{className:"flex flex-col h-[540px] items-center relative"},e.createElement(a.Title,{className:"text-lg mb-4 font-medium w-full"},e.createElement("div",{className:"w-full flex items-center space-x-4"},!p&&e.createElement(E,{onClick:function(){return l(1)},className:"cursor-pointer h-6 w-6 text-gray-400"}),e.createElement("h1",null,"Upload Files"))),!y&&e.createElement("div",{className:"w-full h-full flex-col flex space-y-4 justify-between"},e.createElement(o,{multiple:!1,handleChange:w,name:"file",types:I,maxSize:"20",label:"Upload or drag a file here to embed."},e.createElement("div",{className:"rounded-lg flex py-2 h-60 w-full mt-4 mb-1 cursor-pointer text-center border justify-center items-center gap-x-2  overflow-hidden text-black space-x-2"},e.createElement("div",null,e.createElement(B,{className:"w-10 text-[#484848] h-10 mb-4 mx-auto"}),e.createElement("p",{className:"text-[#484848]"},"Upload a TXT, PDF or CSV File."),e.createElement("p",{className:"text-[#919191]"},"Max 20 MB per File")))),g&&e.createElement("table",{class:"my-3 w-full rounded-lg bg-blue-400/20 items-center"},e.createElement("tr",null,e.createElement("td",{class:"py-4 px-6 text-sm font-medium"},"Name"),e.createElement("td",{class:"py-4 px-6 text-left text-sm"},g.name)),e.createElement("tr",null,e.createElement("td",{class:"py-2 px-6 text-sm font-medium"},"Size"),e.createElement("td",{class:"py-2 px-6 text-left text-sm"},"".concat(parseFloat(g.size/1024).toFixed(2)," KB"))),e.createElement("tr",null,e.createElement("td",{class:"py-4 px-6 text-sm font-medium"},"Type"),e.createElement("td",{class:"py-4 px-6 text-left text-sm "},g.type))),e.createElement("div",{className:"flex flex-row h-full justify-end space-y-2 w-full"},e.createElement("button",{className:"w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer",onClick:function(){g?C():i.error("Please select a file to upload")}},N?e.createElement(T,{className:"animate-spin text-white"}):e.createElement(z,{className:"text-white"}),e.createElement("p",null,"Upload File")))),y&&e.createElement("div",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center"},y?e.createElement(e.Fragment,null,e.createElement(k,{className:"text-green-500 w-8 h-8"}),e.createElement("p",{className:"text-center"},"File Upload Successful")):e.createElement(e.Fragment,null,e.createElement(O,{className:"text-red-500  w-8 h-8"}),e.createElement("p",{className:"text-center"},"There is an error uploading your file. Please try again later."))))}var G=function(t){var n=t.apikey,o=t.userid,i=t.orgName,c=t.brandIcon,s=t.environment,u=void 0===s?"PRODUCTION":s,m=t.entryPoint,p=void 0===m?null:m,f=d(e.useState(p||0),2),h=f[0],g=f[1],w=d(e.useState([]),2),v=w[0];return w[1],r((function(){}),[]),e.createElement(a.Root,null,e.createElement(a.Trigger,{asChild:!0},e.createElement(C,{className:"w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer"})),e.createElement(a.Portal,null,e.createElement(a.Overlay,{className:"bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30"}),e.createElement(a.Content,{className:"flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[600px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none"},e.createElement(a.Close,{asChild:!0},e.createElement("button",{className:"absolute inline-flex h-fit appearance-none focus:outline-none justify-end pb-4 cursor-pointer top-7 right-5","aria-label":"Close"},e.createElement(S,{className:"w-6 h-6 text-gray-400"}))),0===h&&e.createElement(j,{setActiveStep:g,orgName:i,brandIcon:c}),1===h&&e.createElement(R,{setActiveStep:g,apikey:n,userid:o,activeIntegrations:v,environment:u}),"GOOGLE_DOCS"===h&&e.createElement(F,{integrationData:v.find((function(e){return"GOOGLE_DOCS"===e.data_source_type})),apikey:n,userid:o,setActiveStep:g,entryPoint:p,environment:u}),"LOCAL_FILE"===h&&e.createElement(V,{apikey:n,userid:o,setActiveStep:g,entryPoint:p,environment:u})),e.createElement(l,{position:"bottom-right",pauseOnFocusLoss:!1,pauseOnHover:!1})))};export{G as CarbonConnect};
