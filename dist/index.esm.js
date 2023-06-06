import*as e from"react";import t,{useEffect as r,useState as n}from"react";import*as a from"@radix-ui/react-dialog";import o from"axios";function l(){l=function(){return e};var e={},t=Object.prototype,r=t.hasOwnProperty,n=Object.defineProperty||function(e,t,r){e[t]=r.value},a="function"==typeof Symbol?Symbol:{},o=a.iterator||"@@iterator",i=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function s(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{s({},"")}catch(e){s=function(e,t,r){return e[t]=r}}function u(e,t,r,a){var o=t&&t.prototype instanceof d?t:d,l=Object.create(o.prototype),i=new O(a||[]);return n(l,"_invoke",{value:E(e,r,i)}),l}function f(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=u;var m={};function d(){}function h(){}function p(){}var v={};s(v,o,(function(){return this}));var y=Object.getPrototypeOf,g=y&&y(y(k([])));g&&g!==t&&r.call(g,o)&&(v=g);var w=p.prototype=d.prototype=Object.create(v);function x(e){["next","throw","return"].forEach((function(t){s(e,t,(function(e){return this._invoke(t,e)}))}))}function b(e,t){function a(n,o,l,i){var c=f(e[n],e,o);if("throw"!==c.type){var s=c.arg,u=s.value;return u&&"object"==typeof u&&r.call(u,"__await")?t.resolve(u.__await).then((function(e){a("next",e,l,i)}),(function(e){a("throw",e,l,i)})):t.resolve(u).then((function(e){s.value=e,l(s)}),(function(e){return a("throw",e,l,i)}))}i(c.arg)}var o;n(this,"_invoke",{value:function(e,r){function n(){return new t((function(t,n){a(e,r,t,n)}))}return o=o?o.then(n,n):n()}})}function E(e,t,r){var n="suspendedStart";return function(a,o){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===a)throw o;return S()}for(r.method=a,r.arg=o;;){var l=r.delegate;if(l){var i=C(l,r);if(i){if(i===m)continue;return i}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var c=f(e,t,r);if("normal"===c.type){if(n=r.done?"completed":"suspendedYield",c.arg===m)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n="completed",r.method="throw",r.arg=c.arg)}}}function C(e,t){var r=t.method,n=e.iterator[r];if(void 0===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=void 0,C(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),m;var a=f(n,e.iterator,t.arg);if("throw"===a.type)return t.method="throw",t.arg=a.arg,t.delegate=null,m;var o=a.arg;return o?o.done?(t[e.resultName]=o.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,m):o:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,m)}function N(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function L(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function O(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(N,this),this.reset(!0)}function k(e){if(e){var t=e[o];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var n=-1,a=function t(){for(;++n<e.length;)if(r.call(e,n))return t.value=e[n],t.done=!1,t;return t.value=void 0,t.done=!0,t};return a.next=a}}return{next:S}}function S(){return{value:void 0,done:!0}}return h.prototype=p,n(w,"constructor",{value:p,configurable:!0}),n(p,"constructor",{value:h,configurable:!0}),h.displayName=s(p,c,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===h||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,p):(e.__proto__=p,s(e,c,"GeneratorFunction")),e.prototype=Object.create(w),e},e.awrap=function(e){return{__await:e}},x(b.prototype),s(b.prototype,i,(function(){return this})),e.AsyncIterator=b,e.async=function(t,r,n,a,o){void 0===o&&(o=Promise);var l=new b(u(t,r,n,a),o);return e.isGeneratorFunction(r)?l:l.next().then((function(e){return e.done?e.value:l.next()}))},x(w),s(w,c,"Generator"),s(w,o,(function(){return this})),s(w,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},e.values=k,O.prototype={constructor:O,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(L),!e)for(var t in this)"t"===t.charAt(0)&&r.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function n(r,n){return l.type="throw",l.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var a=this.tryEntries.length-1;a>=0;--a){var o=this.tryEntries[a],l=o.completion;if("root"===o.tryLoc)return n("end");if(o.tryLoc<=this.prev){var i=r.call(o,"catchLoc"),c=r.call(o,"finallyLoc");if(i&&c){if(this.prev<o.catchLoc)return n(o.catchLoc,!0);if(this.prev<o.finallyLoc)return n(o.finallyLoc)}else if(i){if(this.prev<o.catchLoc)return n(o.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<o.finallyLoc)return n(o.finallyLoc)}}}},abrupt:function(e,t){for(var n=this.tryEntries.length-1;n>=0;--n){var a=this.tryEntries[n];if(a.tryLoc<=this.prev&&r.call(a,"finallyLoc")&&this.prev<a.finallyLoc){var o=a;break}}o&&("break"===e||"continue"===e)&&o.tryLoc<=t&&t<=o.finallyLoc&&(o=null);var l=o?o.completion:{};return l.type=e,l.arg=t,o?(this.method="next",this.next=o.finallyLoc,m):this.complete(l)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),m},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),L(r),m}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var a=n.arg;L(r)}return a}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:k(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),m}},e}function i(e,t,r,n,a,o,l){try{var i=e[o](l),c=i.value}catch(e){return void r(e)}i.done?t(c):Promise.resolve(c).then(n,a)}function c(e){return function(){var t=this,r=arguments;return new Promise((function(n,a){var o=e.apply(t,r);function l(e){i(o,n,a,l,c,"next",e)}function c(e){i(o,n,a,l,c,"throw",e)}l(void 0)}))}}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,o,l,i=[],c=!0,s=!1;try{if(o=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=o.call(r)).done)&&(i.push(n.value),i.length!==t);c=!0);}catch(e){s=!0,a=e}finally{try{if(!c&&null!=r.return&&(l=r.return(),Object(l)!==l))return}finally{if(s)throw a}}return i}}(e,t)||f(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e){return function(e){if(Array.isArray(e))return m(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||f(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(e,t){if(e){if("string"==typeof e)return m(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?m(e,t):void 0}}function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}var d={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},h=t.createContext&&t.createContext(d),p=function(){return p=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},p.apply(this,arguments)},v=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(n=Object.getOwnPropertySymbols(e);a<n.length;a++)t.indexOf(n[a])<0&&Object.prototype.propertyIsEnumerable.call(e,n[a])&&(r[n[a]]=e[n[a]])}return r};function y(e){return e&&e.map((function(e,r){return t.createElement(e.tag,p({key:r},e.attr),y(e.child))}))}function g(e){return function(r){return t.createElement(w,p({attr:p({},e.attr)},r),y(e.child))}}function w(e){var r=function(r){var n,a=e.attr,o=e.size,l=e.title,i=v(e,["attr","size","title"]),c=o||r.size||"1em";return r.className&&(n=r.className),e.className&&(n=(n?n+" ":"")+e.className),t.createElement("svg",p({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,a,i,{className:n,style:p(p({color:e.color||r.color},r.style),e.style),height:c,width:c,xmlns:"http://www.w3.org/2000/svg"}),l&&t.createElement("title",null,l),e.children)};return void 0!==h?t.createElement(h.Consumer,null,(function(e){return r(e)})):r(d)}function x(e){return g({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",clipRule:"evenodd"}}]})(e)}function b(e){return g({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",clipRule:"evenodd"}}]})(e)}function E(e){return g({tag:"svg",attr:{viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",clipRule:"evenodd"}}]})(e)}function C(e){return g({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"}},{tag:"path",attr:{fillRule:"evenodd",d:"M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"}}]})(e)}function N(e){return g({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"}}]})(e)}function L(e){return g({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"}}]})(e)}function O(e){return g({tag:"svg",attr:{viewBox:"0 0 15 15",fill:"none"},child:[{tag:"path",attr:{d:"M3.25781 3.11684C3.67771 3.45796 3.83523 3.43193 4.62369 3.37933L12.0571 2.93299C12.2147 2.93299 12.0836 2.77571 12.0311 2.74957L10.7965 1.85711C10.56 1.67347 10.2448 1.46315 9.64083 1.51576L2.44308 2.04074C2.18059 2.06677 2.12815 2.19801 2.2327 2.30322L3.25781 3.11684ZM3.7041 4.84917V12.6704C3.7041 13.0907 3.91415 13.248 4.38693 13.222L12.5562 12.7493C13.0292 12.7233 13.0819 12.4341 13.0819 12.0927V4.32397C13.0819 3.98306 12.9508 3.79921 12.6612 3.82545L4.12422 4.32397C3.80918 4.35044 3.7041 4.50803 3.7041 4.84917ZM11.7688 5.26872C11.8212 5.50518 11.7688 5.74142 11.5319 5.76799L11.1383 5.84641V11.6205C10.7965 11.8042 10.4814 11.9092 10.2188 11.9092C9.79835 11.9092 9.69305 11.7779 9.37812 11.3844L6.80345 7.34249V11.2532L7.61816 11.437C7.61816 11.437 7.61816 11.9092 6.96086 11.9092L5.14879 12.0143C5.09615 11.9092 5.14879 11.647 5.33259 11.5944L5.80546 11.4634V6.29276L5.1489 6.24015C5.09625 6.00369 5.22739 5.66278 5.5954 5.63631L7.53935 5.50528L10.2188 9.5998V5.97765L9.53564 5.89924C9.4832 5.61018 9.69305 5.40028 9.95576 5.37425L11.7688 5.26872ZM1.83874 1.33212L9.32557 0.780787C10.245 0.701932 10.4815 0.754753 11.0594 1.17452L13.4492 2.85424C13.8436 3.14309 13.975 3.22173 13.975 3.53661V12.7493C13.975 13.3266 13.7647 13.6681 13.0293 13.7203L4.33492 14.2454C3.78291 14.2717 3.52019 14.193 3.23111 13.8253L1.47116 11.5419C1.1558 11.1216 1.02466 10.8071 1.02466 10.4392V2.25041C1.02466 1.77825 1.23504 1.38441 1.83874 1.33212Z",fill:"currentColor"}}]})(e)}function k(e){return g({tag:"svg",attr:{role:"img",viewBox:"0 0 24 24"},child:[{tag:"title",attr:{},child:[]},{tag:"path",attr:{d:"M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"}}]})(e)}var S=e.forwardRef((function({title:t,titleId:r,...n},a){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":r},n),t?e.createElement("title",{id:r},t):null,e.createElement("path",{fillRule:"evenodd",d:"M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z",clipRule:"evenodd"}))}));var _=e.forwardRef((function({title:t,titleId:r,...n},a){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":r},n),t?e.createElement("title",{id:r},t):null,e.createElement("path",{d:"M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"}),e.createElement("path",{d:"M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"}))}));var j=e.forwardRef((function({title:t,titleId:r,...n},a){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":r},n),t?e.createElement("title",{id:r},t):null,e.createElement("path",{fillRule:"evenodd",d:"M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z",clipRule:"evenodd"}))})),A=function(e){var r=e.setActiveStep;return t.createElement("div",{className:"flex flex-col h-full items-center justify-between "},t.createElement("div",{className:"flex pt-8 -space-x-2"},t.createElement("img",{src:"/assets/images/icon-integration.png",alt:"Rubber Icon",className:"rounded-full border w-16"}),t.createElement("img",{src:"/assets/icons/CarbonIcon.svg",alt:"Carbon Icon"})),t.createElement("h1",{className:" text-xl font-light"},t.createElement("span",{className:"font-normal"},"Rubber")," uses"," ",t.createElement("span",{className:"font-normal"},"Carbon")," ",t.createElement("br",null),"to connect your data."),t.createElement("ul",{className:""},t.createElement("li",{className:"flex flex-row items-start w-full space-x-2 py-2 px-4"},t.createElement(j,{className:"w-5 h-5 mr-1 text-gray-400 mt-1"}),t.createElement("div",{className:"flex flex-col gap-y-1"},t.createElement("h1",{className:"text-md font-medium"},"Private"),t.createElement("p",{className:"text-sm font-normal text-gray-400"},"Your credentials will never be made available to Rubber."))),t.createElement("li",{className:"flex flex-row items-start w-full space-x-2 py-2 px-4"},t.createElement(_,{className:"w-7 h-7 mr-1 text-gray-400"}),t.createElement("div",{className:"flex flex-col gap-y-1"},t.createElement("h1",{className:"text-md font-medium"},"Secure"),t.createElement("p",{className:"text-sm font-normal text-gray-400"},"You can select to give Rubber access to specific information only.")))),t.createElement("div",{className:"flex flex-col space-y-3 w-full items-center"},t.createElement("p",{className:"text-xs text-center text-gray-400"},"By continuing, you agree to Carbon's",t.createElement("br",null),t.createElement("u",null,"User Terms and Privacy Policy.")),t.createElement("button",{className:"w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer",onClick:function(){return r(1)}},t.createElement("p",null,"Connect"))))},z=function(e){var r=e.setActiveStep,n=e.apikey,i=e.userid,s=e.activeIntegrations,u=[{id:"notion",subpath:"notion",name:"Notion",icon:t.createElement(O,{className:"w-8 h-8"}),description:"Lets your users connect their Notion accounts to Carbon.",active:!0},{active:!0,name:"Google Docs",subpath:"google",id:"googleDocs",description:"Lets your users connect their Google Docs to Carbon.",scope:"docs",icon:t.createElement(L,{className:"w-7 h-7"}),data_source_type:"GOOGLE_DOCS"},{active:!0,name:"Google Drive",subpath:"google",id:"googleDrive",description:"Lets your users connect their Google Docs to Carbon.",scope:"drive",icon:t.createElement(L,{className:"w-7 h-7"})},{active:!0,name:"Gmail",subpath:"google",id:"gmail",description:"Lets your users connect their Google Docs to Carbon.",scope:"gmail",icon:t.createElement(L,{className:"w-7 h-7"})},{active:!1,name:"Slack",subpath:"slack",id:"slack",description:"Lets your users connect their Slack accounts to Carbon.",icon:t.createElement(k,{className:"w-7 h-7"})},{active:!1,name:"Discord",subpath:"discord",id:"discord",description:"Lets your users connect their Discord accounts to Carbon.",icon:t.createElement(N,{className:"w-7 h-7"})},{active:!1,name:"File Upload",subpath:"local",id:"localFiles",description:"Lets your users upload local files to Carbon.",icon:t.createElement(C,{className:"w-7 h-7"})}],f=function(){var e=c(l().mark((function e(t){var r;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.get("http://localhost:8000/integrations/".concat(t.subpath,"/oauth_url"),{params:{id:i,apikey:n,scope:t.scope}});case 2:200===(r=e.sent).status&&r.data&&window.open(r.data.oauth_url,"_blank");case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return t.createElement("div",{className:"flex flex-col h-full items-center"},t.createElement(a.Title,{className:"text-lg mb-4 font-medium w-full"},t.createElement("div",{className:"w-full flex items-center space-x-4"},t.createElement(S,{onClick:function(){return r(0)},className:"cursor-pointer h-6 w-6 text-gray-400"}))),t.createElement("ul",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto"},u.map((function(e){var n=s.map((function(e){return e.data_source_type})).includes(e.data_source_type);return t.createElement("li",{key:e.id,className:"border rounded-md h-fit items-center px-4 w-full ".concat(e.active?"bg-white cursor-pointer hover:bg-gray-100":"bg-gray-200 cursor-not-allowed")},t.createElement("div",{className:"flex flex-row items-center w-full space-x-3 py-4 justify-between ".concat(e.active?"bg-white cursor-pointer hover:bg-gray-100":"bg-gray-200 cursor-not-allowed"),onClick:function(){e.active&&(n?(console.log("Integration already active"),r("GOOGLE_DOCS")):f(e))}},t.createElement("div",{className:"flex flex-row items-center"},t.createElement("span",{className:"mr-4"},e.icon),t.createElement("h1",{className:"text-md font-normal"},e.name)),t.createElement("div",{className:"flex flex-col"},t.createElement("div",{className:"flex flex-row w-full items-center space-x-4"},!e.active&&t.createElement("p",{className:"text-xs text-gray-600 bg-white px-4 py-1 rounded-full "},"Coming Soon"),e.active&&n&&t.createElement(x,{className:"text-green-500 w-6 h-6"})))))}))))},M=function(e){var r=e.integrationData,i=e.setActiveStep,f=e.apikey,m=e.userid,d=s(n([]),2),h=d[0],p=d[1],v=function(){var e=c(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.post("http://localhost:8000/integrations/google/sync",{user_id:m,api_key:f,file_ids:h});case 2:200===(t=e.sent).status&&t.data&&(console.log("Sync Response: ",t.data),i(2));case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return t.createElement("div",{className:"flex flex-col h-[540px] items-center"},t.createElement(a.Title,{className:"text-lg mb-4 font-medium w-full"},t.createElement("div",{className:"w-full flex items-center space-x-4"},t.createElement(S,{onClick:function(){return i(1)},className:"cursor-pointer h-6 w-6 text-gray-400"}),t.createElement("h1",null,"Select Files"))),t.createElement("div",{className:"flex flex-col space-y-3 w-full py-2 overflow-y-auto"},r.token.all_files.map((function(e){var r=h.includes(e.id);return t.createElement("div",{key:e.id,className:"border rounded-md h-fit items-center p-4 w-full cursor-pointer ".concat(r?"bg-green-200":"bg-white hover:bg-gray-100"),onClick:function(){p((function(t){return t.includes(e.id)?t.filter((function(t){return t!==e.id})):[].concat(u(t),[e.id])}))}},t.createElement("h1",{className:"text-md font-normal"},e.name))}))),t.createElement("div",{className:"flex flex-col h-full space-y-2 w-full"},t.createElement("button",{className:"w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer",onClick:function(){return v()}},"Sync Files")))},G=function(e){var n=e.apikey,i=e.userid,u=s(t.useState(0),2),f=u[0],m=u[1],d=s(t.useState([]),2),h=d[0],p=d[1],v=function(){var e=c(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.get("http://localhost:8000/integrations",{params:{id:i,apikey:n}});case 2:200===(t=e.sent).status&&p(t.data.active_integrations);case 4:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return r((function(){v();var e=setInterval(v,1e4);return function(){return clearInterval(e)}}),[]),t.createElement(a.Root,null,t.createElement(a.Trigger,{asChild:!0},t.createElement(b,{className:"w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer"})),t.createElement(a.Portal,null,t.createElement(a.Overlay,{className:"bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30"}),t.createElement(a.Content,{className:"flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[740px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none"},t.createElement(a.Close,{asChild:!0},t.createElement("button",{className:"absolute inline-flex h-fit appearance-none focus:outline-none justify-end pb-4 cursor-pointer top-7 right-5","aria-label":"Close"},t.createElement(E,{className:"w-6 h-6 text-gray-400"}))),0===f&&t.createElement(A,{setActiveStep:m}),1===f&&t.createElement(z,{setActiveStep:m,apikey:n,userid:i,activeIntegrations:h}),"GOOGLE_DOCS"===f&&t.createElement(M,{integrationData:h.find((function(e){return"GOOGLE_DOCS"===e.data_source_type})),apikey:n,userid:i,setActiveStep:m}))))};export{G as default};
