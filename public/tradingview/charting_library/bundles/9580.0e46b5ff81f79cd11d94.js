(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[9580],{78090:t=>{t.exports={"toast-positioning-wrapper":"toast-positioning-wrapper-1j0He64l",compact:"compact-1j0He64l","location-bottom-left":"location-bottom-left-1j0He64l","location-bottom-right":"location-bottom-right-1j0He64l",hidden:"hidden-1j0He64l",added:"added-1j0He64l"}},72865:(t,e,o)=>{"use strict";o.d(e,{useForceUpdate:()=>n});var i=o(67294);const n=()=>{const[,t]=(0,i.useReducer)((t,e)=>t+1,0);return t}},28595:(t,e,o)=>{"use strict";o.d(e,{OverlapManager:()=>s,getRootOverlapManager:()=>a});var i=o(16282);class n{constructor(){this._storage=[]}add(t){this._storage.push(t)}remove(t){this._storage=this._storage.filter(e=>t!==e)}has(t){return this._storage.includes(t)}getItems(){return this._storage}}class s{constructor(t=document){this._storage=new n,this._windows=new Map,this._index=0,this._document=t,this._container=t.createDocumentFragment()}setContainer(t){const e=this._container,o=null===t?this._document.createDocumentFragment():t;!function(t,e){Array.from(t.childNodes).forEach(t=>{t.nodeType===Node.ELEMENT_NODE&&e.appendChild(t)})}(e,o),this._container=o}registerWindow(t){this._storage.has(t)||this._storage.add(t)}ensureWindow(t,e={position:"fixed",direction:"normal"}){const o=this._windows.get(t);if(void 0!==o)return o;this.registerWindow(t);const i=this._document.createElement("div");if(i.style.position=e.position,i.style.zIndex=this._index.toString(),i.dataset.id=t,void 0!==e.index){const t=this._container.childNodes.length;if(e.index>=t)this._container.appendChild(i);else if(e.index<=0)this._container.insertBefore(i,this._container.firstChild);else{const t=this._container.childNodes[e.index];this._container.insertBefore(i,t)}}else"reverse"===e.direction?this._container.insertBefore(i,this._container.firstChild):this._container.appendChild(i);return this._windows.set(t,i),++this._index,i}unregisterWindow(t){this._storage.remove(t);const e=this._windows.get(t);void 0!==e&&(null!==e.parentElement&&e.parentElement.removeChild(e),this._windows.delete(t))}getZindex(t){const e=this.ensureWindow(t);return parseInt(e.style.zIndex||"0")}moveToTop(t){if(this.getZindex(t)!==this._index){this.ensureWindow(t).style.zIndex=(++this._index).toString()}}removeWindow(t){this.unregisterWindow(t)}}const r=new WeakMap;function a(t=document){const e=t.getElementById("overlap-manager-root");if(null!==e)return(0,i.ensureDefined)(r.get(e));{const e=new s(t),o=function(t){const e=t.createElement("div");return e.style.position="absolute",e.style.zIndex=150..toString(),e.style.top="0px",e.style.left="0px",e.id="overlap-manager-root",e}(t);return r.set(o,e),e.setContainer(o),t.body.appendChild(o),e}}},22165:(t,e,o)=>{"use strict";o.d(e,{Portal:()=>d,PortalContext:()=>h});var i=o(67294),n=o(73935),s=o(80068),r=o(28595),a=o(66189);class d extends i.PureComponent{constructor(){super(...arguments),this._uuid=(0,s.guid)()}componentWillUnmount(){this._manager().removeWindow(this._uuid)}render(){
const t=this._manager().ensureWindow(this._uuid,this.props.layerOptions);return t.style.top=this.props.top||"",t.style.bottom=this.props.bottom||"",t.style.left=this.props.left||"",t.style.right=this.props.right||"",t.style.pointerEvents=this.props.pointerEvents||"",n.createPortal(i.createElement(h.Provider,{value:this},this.props.children),t)}moveToTop(){this._manager().moveToTop(this._uuid)}_manager(){return null===this.context?(0,r.getRootOverlapManager)():this.context}}d.contextType=a.SlotContext;const h=i.createContext(null)},66189:(t,e,o)=>{"use strict";o.d(e,{Slot:()=>n,SlotContext:()=>s});var i=o(67294);class n extends i.Component{shouldComponentUpdate(){return!1}render(){return i.createElement("div",{style:{position:"fixed",zIndex:150,left:0,top:0},ref:this.props.reference})}}const s=i.createContext(null)},47368:(t,e,o)=>{"use strict";var i,n;o.d(e,{ToastAnimationStage:()=>i,ToastPriority:()=>n}),function(t){t[t.Add=0]="Add",t[t.Remove=1]="Remove",t[t.None=2]="None"}(i||(i={})),function(t){t[t.Low=0]="Low",t[t.Medium=1]="Medium",t[t.High=2]="High"}(n||(n={}))},69580:(t,e,o)=>{"use strict";o.d(e,{ToastsLayer:()=>_});var i=o(67294),n=o(73935),s=o(94184),r=o(80068),a=o(22165),d=o(66189),h=o(28595),c=o(72865),l=o(47368);class g{constructor(t){this._animationStage=l.ToastAnimationStage.Add,this._keys=new Map,this._element=null,this.render=t=>this._render(t),this.remove=()=>this._currentToastsLayer.removeToast(this);const{priority:e,origin:o,currentLayer:i,onLayerChange:n,render:s}=t;this._staticData=Object.freeze({priority:e,origin:o,onLayerChange:n}),this._currentToastsLayer=i||o,this._render=s}getStaticData(){return this._staticData}migrate(t){this._currentToastsLayer=t,this._animationStage=l.ToastAnimationStage.Add}getCurrentLayer(){return this._currentToastsLayer}isForeign(){return this._staticData.origin!==this._currentToastsLayer}getAnimationStage(){return this._animationStage}setAnimationStage(t){this._animationStage=t}setKey(t,e){this._keys.set(t,e)}getKey(t=this._currentToastsLayer){return this._keys.get(t)}getElement(){return this._element}setElement(t){this._element=t}}var u=o(78090);const m={position:"fixed",left:"0",bottom:"0",right:"0",zIndex:160};class _{constructor(t,e,o=m,i){this._toasts={[l.ToastPriority.Low]:[],[l.ToastPriority.Medium]:[],[l.ToastPriority.High]:[]},this._container=void 0!==e?e:document.body,this._suggestedLayout=void 0!==t?t:"loose",this._location=null!=i?i:"bottom-left",this._manager=new h.OverlapManager(document),this._overlapManagerContainer=function(t,e={}){const o=t.createElement("div");return o.dataset.role="toast-container",y(o,{...m,...e}),o}(document,o),this._manager.setContainer(this._overlapManagerContainer),this._container.appendChild(this._overlapManagerContainer),this._detachedContainer=document.createElement("div")}showToast(t){const{render:e,priority:o=l.ToastPriority.Medium,index:i,origin:n=this,onLayerChange:s}=t,r=new g({priority:o,origin:n,currentLayer:this,render:e,onLayerChange:s}),a=this._getNextKey();return r.setKey(this,a),
"compact"===this._suggestedLayout&&o===l.ToastPriority.Low?Promise.all(this._toasts[l.ToastPriority.Low].map(t=>this.removeToast(t))).then(()=>{this._add(r,i),this._render()}):(this._add(r,i),this._render()),r}showExistingToast(t){const e=this._getNextKey();return t.setKey(this,e),this._add(t),this._render(),t}removeToast(t){return new Promise(e=>{t.setAnimationStage(l.ToastAnimationStage.Remove),this._render(),setTimeout(()=>{this._remove(t),this._render(),e()},250)})}update(t){const{suggestedLayout:e,location:o,container:i,rootContainerOptions:n}=t;let s=!1,r=!1;void 0!==e&&e!==this._suggestedLayout&&(this._setSuggestedLayout(e),s=!0),void 0!==o&&(this._setLocation(o),r=!0),void 0!==i&&(this._setContainer(i),r=!0),void 0!==n&&(this._updateRootContainer(n),r=!0),s?"compact"===this._suggestedLayout&&this._toasts[l.ToastPriority.Low].slice(0,-1).forEach(t=>this.removeToast(t)):r&&this._render()}getToasts(){return this._toasts}forceRender(){this._render()}merge(t){p(t.getToasts()).forEach(async e=>{const o=e.getStaticData();await e.remove(),e.migrate(this),this.showExistingToast(e),void 0!==o.onLayerChange&&o.onLayerChange(t,this)})}split(t){p(this._toasts).filter(t=>t.isForeign()).forEach(async e=>{const o=e.getStaticData();await e.remove(),e.migrate(t),t.showExistingToast(e),void 0!==o.onLayerChange&&o.onLayerChange(this,t)})}reset(){this._toasts={[l.ToastPriority.Low]:[],[l.ToastPriority.Medium]:[],[l.ToastPriority.High]:[]},this._render()}destroy(){this._removeRootContainer()}_removeRootContainer(){n.unmountComponentAtNode(this._detachedContainer),this._detachedContainer.remove(),this._overlapManagerContainer.remove()}_getToastsList(t){const e=t.getStaticData().priority;return this._toasts[e]}_normalizeIndex(t,e){return t<0?0:t>e.length?e.length:t}_add(t,e){const o=this._getToastsList(t);if(void 0!==e){const i=this._normalizeIndex(e,o);o.splice(i,0,t)}else o.push(t)}_remove(t){const e=this._getToastsList(t),o=e.indexOf(t);o>=0&&e.splice(o,1)}_render(){const t=p(this._toasts);n.render(i.createElement(T,{toasts:t,suggestedLayout:this._suggestedLayout,location:this._location,manager:this._manager,layer:this}),this._detachedContainer)}_setSuggestedLayout(t){t!==this._suggestedLayout&&(this._suggestedLayout=t)}_setLocation(t){t!==this._location&&(this._location=t)}_setContainer(t){t!==this._container&&(this._container=t,this._container.appendChild(this._overlapManagerContainer))}_updateRootContainer(t){y(this._overlapManagerContainer,t)}_getNextKey(){return(0,r.randomHashN)(5)}}function p(t){return[...t[l.ToastPriority.Low],...t[l.ToastPriority.Medium],...t[l.ToastPriority.High]]}function y(t,e){const{top:o,right:i,bottom:n,left:s,position:r,zIndex:a}=e;void 0!==r&&(t.style.position=r),void 0!==a&&(t.style.zIndex=String(a)),void 0!==o&&(t.style.top=o),void 0!==i&&(t.style.right=i),void 0!==n&&(t.style.bottom=n),void 0!==s&&(t.style.left=s)}function v(t,e,o){return t.getKey(o)||e.toString(10)}function f(t){const{toast:e,toasts:o,layer:n,suggestedLayout:r,location:d,forceRender:h}=t,c=(0,
i.useRef)(null),g=e.getAnimationStage(),m=g!==l.ToastAnimationStage.None,_=g===l.ToastAnimationStage.Add,p=function(t,e,o){var i;const n=e.indexOf(t),s=v(t,n,o);let r=0;for(const t of e){const a=e.indexOf(t),d=v(t,a,o),h=(null===(i=t.getElement())||void 0===i?void 0:i.offsetHeight)||0,c=t.getAnimationStage()!==l.ToastAnimationStage.None;let g=0;c&&d===s?g=1:!c&&n<a&&(g=-1),r+=g*h}return r}(e,o,n),y=s(u["toast-positioning-wrapper"],m&&u.hidden,_&&u.added,"compact"===r&&u.compact,d&&u["location-"+d]);return(0,i.useEffect)(()=>{if(e.getCurrentLayer()!==n||e.getAnimationStage()!==l.ToastAnimationStage.Add||null===c.current)return;const t=e.getElement();null===t||t!==c.current?(e.setElement(c.current),h()):(e.setAnimationStage(l.ToastAnimationStage.None),h())}),i.createElement(a.Portal,{layerOptions:{position:"absolute"},left:"0",right:"0"},i.createElement("div",{className:y,style:{transform:`translateY(${p}px)`},ref:c},e.render({onRemove:e.remove,suggestedLayout:r})))}function T(t){const{toasts:e,suggestedLayout:o,location:n,manager:s,layer:r}=t,a=(0,c.useForceUpdate)();return i.createElement(d.SlotContext.Provider,{value:s},e.map((t,s)=>i.createElement(f,{key:v(t,s,r),toast:t,toasts:e,layer:r,suggestedLayout:o,location:n,forceRender:a})))}}}]);