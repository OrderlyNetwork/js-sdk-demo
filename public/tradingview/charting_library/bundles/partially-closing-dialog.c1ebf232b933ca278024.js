(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[5001],{67891:function(e,t){var n,o,i;o=[t],void 0===(i="function"==typeof(n=function(e){"use strict";function t(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}Object.defineProperty(e,"__esModule",{value:!0});var n=!1;if("undefined"!=typeof window){var o={get passive(){n=!0}};window.addEventListener("testPassive",null,o),window.removeEventListener("testPassive",null,o)}var i="undefined"!=typeof window&&window.navigator&&window.navigator.platform&&/iP(ad|hone|od)/.test(window.navigator.platform),s=[],r=!1,l=-1,a=void 0,c=void 0,u=function(e){return s.some((function(t){return!(!t.options.allowTouchMove||!t.options.allowTouchMove(e))}))},d=function(e){var t=e||window.event;return!!u(t.target)||1<t.touches.length||(t.preventDefault&&t.preventDefault(),!1)},p=function(){setTimeout((function(){void 0!==c&&(document.body.style.paddingRight=c,c=void 0),void 0!==a&&(document.body.style.overflow=a,a=void 0)}))};e.disableBodyScroll=function(e,o){if(i){if(!e)return void console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");if(e&&!s.some((function(t){return t.targetElement===e}))){var p={targetElement:e,options:o||{}};s=[].concat(t(s),[p]),e.ontouchstart=function(e){1===e.targetTouches.length&&(l=e.targetTouches[0].clientY)},e.ontouchmove=function(t){var n,o,i,s;1===t.targetTouches.length&&(o=e,s=(n=t).targetTouches[0].clientY-l,!u(n.target)&&(o&&0===o.scrollTop&&0<s||(i=o)&&i.scrollHeight-i.scrollTop<=i.clientHeight&&s<0?d(n):n.stopPropagation()))},r||(document.addEventListener("touchmove",d,n?{passive:!1}:void 0),r=!0)}}else{h=o,setTimeout((function(){if(void 0===c){var e=!!h&&!0===h.reserveScrollBarGap,t=window.innerWidth-document.documentElement.clientWidth;e&&0<t&&(c=document.body.style.paddingRight,document.body.style.paddingRight=t+"px")}void 0===a&&(a=document.body.style.overflow,document.body.style.overflow="hidden")}));var m={targetElement:e,options:o||{}};s=[].concat(t(s),[m])}var h},e.clearAllBodyScrollLocks=function(){i?(s.forEach((function(e){e.targetElement.ontouchstart=null,e.targetElement.ontouchmove=null})),r&&(document.removeEventListener("touchmove",d,n?{passive:!1}:void 0),r=!1),s=[],l=-1):(p(),s=[])},e.enableBodyScroll=function(e){if(i){if(!e)return void console.error("enableBodyScroll unsuccessful - targetElement must be provided when calling enableBodyScroll on IOS devices.");e.ontouchstart=null,e.ontouchmove=null,s=s.filter((function(t){return t.targetElement!==e})),r&&0===s.length&&(document.removeEventListener("touchmove",d,n?{passive:!1}:void 0),r=!1)}else 1===s.length&&s[0].targetElement===e?(p(),s=[]):s=s.filter((function(t){return t.targetElement!==e}))}})?n.apply(t,o):n)||(e.exports=i)},58644:e=>{e.exports={wrapper:"wrapper-2eXD4rIf",input:"input-2eXD4rIf",box:"box-2eXD4rIf",icon:"icon-2eXD4rIf",noOutline:"noOutline-2eXD4rIf","intent-danger":"intent-danger-2eXD4rIf",check:"check-2eXD4rIf",
dot:"dot-2eXD4rIf"}},28209:e=>{e.exports={checkbox:"checkbox-2jiVkfto",reverse:"reverse-2jiVkfto",label:"label-2jiVkfto",baseline:"baseline-2jiVkfto"}},74325:e=>{e.exports={scrollable:"scrollable-yzGChVZZ",content:"content-yzGChVZZ",input:"input-yzGChVZZ",endSlot:"endSlot-yzGChVZZ",message:"message-yzGChVZZ",estimation:"estimation-yzGChVZZ",label:"label-yzGChVZZ"}},37604:(e,t,n)=>{"use strict";n.d(t,{CheckboxInput:()=>c});var o=n(67294),i=n(94184),s=n(21659),r=n(7536),l=n(58644),a=n.n(l);function c(e){const t=i(a().box,a()["intent-"+e.intent],{[a().check]:!Boolean(e.indeterminate),[a().dot]:Boolean(e.indeterminate),[a().noOutline]:-1===e.tabIndex}),n=i(a().wrapper,e.className);return o.createElement("span",{className:n,title:e.title},o.createElement("input",{id:e.id,tabIndex:e.tabIndex,className:a().input,type:"checkbox",name:e.name,checked:e.checked,disabled:e.disabled,value:e.value,autoFocus:e.autoFocus,role:e.role,onChange:function(){e.onChange&&e.onChange(e.value)},ref:e.reference}),o.createElement("span",{className:t},o.createElement(s.Icon,{icon:r,className:a().icon})))}},18270:(e,t,n)=>{"use strict";n.d(t,{Checkbox:()=>c});var o=n(67294),i=n(94184),s=n(60624),r=n(37604),l=n(28209),a=n.n(l);class c extends o.PureComponent{render(){const{inputClassName:e,labelClassName:t,...n}=this.props,s=i(this.props.className,a().checkbox,{[a().reverse]:Boolean(this.props.labelPositionReverse),[a().baseline]:Boolean(this.props.labelAlignBaseline)}),l=i(a().label,t,{[a().disabled]:this.props.disabled});let c=null;return this.props.label&&(c=o.createElement("span",{className:l,title:this.props.title},this.props.label)),o.createElement("label",{className:s},o.createElement(r.CheckboxInput,{...n,className:e}),c)}}c.defaultProps={value:"on"};(0,s.makeSwitchGroupItem)(c)},60624:(e,t,n)=>{"use strict";n.d(t,{SwitchGroup:()=>s,makeSwitchGroupItem:()=>r});var o=n(67294),i=n(45697);class s extends o.PureComponent{constructor(){super(...arguments),this._subscriptions=new Set,this._getName=()=>this.props.name,this._getValues=()=>this.props.values,this._getOnChange=()=>this.props.onChange,this._subscribe=e=>{this._subscriptions.add(e)},this._unsubscribe=e=>{this._subscriptions.delete(e)}}getChildContext(){return{switchGroupContext:{getName:this._getName,getValues:this._getValues,getOnChange:this._getOnChange,subscribe:this._subscribe,unsubscribe:this._unsubscribe}}}render(){return this.props.children}componentDidUpdate(e){this._notify(this._getUpdates(this.props.values,e.values))}_notify(e){this._subscriptions.forEach(t=>t(e))}_getUpdates(e,t){return[...t,...e].filter(n=>t.includes(n)?!e.includes(n):e.includes(n))}}function r(e){var t;return(t=class extends o.PureComponent{constructor(){super(...arguments),this._onChange=e=>{this.context.switchGroupContext.getOnChange()(e)},this._onUpdate=e=>{e.includes(this.props.value)&&this.forceUpdate()}}componentDidMount(){this.context.switchGroupContext.subscribe(this._onUpdate)}render(){return o.createElement(e,{...this.props,name:this._getName(),onChange:this._onChange,checked:this._isChecked()})}
componentWillUnmount(){this.context.switchGroupContext.unsubscribe(this._onUpdate)}_getName(){return this.context.switchGroupContext.getName()}_isChecked(){return this.context.switchGroupContext.getValues().includes(this.props.value)}}).contextTypes={switchGroupContext:i.any.isRequired},t}s.childContextTypes={switchGroupContext:i.any.isRequired}},91083:(e,t,n)=>{"use strict";n.r(t),n.d(t,{PartiallyClosingDialog:()=>h});var o=n(74245),i=n(67294),s=n(18270),r=n(93302),l=n(15300),a=n(32011),c=n(69397);var u=n(91436),d=n(3631),p=n(6867),m=n(74325);function h(e){const{positionOrTrade:t,qtyFormatter:n,supportLots:h,qtyStep:f,uiQtyStep:v,minQty:g,message:b,onClose:y,dialogActionHandler:w,onOpen:C}=e,x=(0,i.useMemo)(()=>Math.abs(t.qty),[t.qty]),[E,S]=(0,i.useState)(!0),[_,k]=(0,i.useState)(!1),[N,T]=(0,i.useState)(x),[B,D]=(0,i.useState)(!1),[L,G]=(0,i.useState)(!1),[I,O]=(0,i.useState)(),P=(()=>{const[e,t]=(0,i.useState)(!window.navigator.onLine),n=e=>t("offline"===e.type);return(0,i.useEffect)(()=>(window.addEventListener("online",n),window.addEventListener("offline",n),()=>{window.removeEventListener("online",n),window.removeEventListener("offline",n)})),e})(),V=!L&&null!==N&&N<x;(0,i.useEffect)(()=>{let e;const t=new r.Big(x),n=null!==N?new r.Big(N):null,i=null==n?void 0:n.minus(g).mod(f);null===n?e=(0,o.t)("Number format is invalid"):n.gt(t)?e=(0,o.t)("Specified value is more than the instrument maximum"):!n.eq(t)&&n.lt(g)?e=(0,o.t)("Specified value is less than the instrument minimum of {minQty}").replace("{minQty}",String(g)):!n.eq(t)&&t.minus(n).lt(g)?e=(0,o.t)("Remaining quantity of position is less than the instrument minimum of {minQty}").replace("{minQty}",String(g)):n.eq(t)||(null==i?void 0:i.eq(0))||(e=(0,o.t)("The specified value is not a multiple of {step}").replace("{step}",String(f))),G(B||void 0!==e),O(e)},[B,N,x,f,g]),(0,i.useEffect)(()=>{P&&R()},[P,R]);const q=(0,i.useMemo)(()=>null!==N?(0,p.splitThousands)(n.format(N)," "):"",[N,n]),M=(0,i.useMemo)(()=>null!==N?(0,p.splitThousands)(n.format(new r.Big(x).minus(N).toNumber())," "):"",[N,x,n]),Q=_&&null!==N&&N<x?(0,o.t)("Partially close"):(0,o.t)("Close position");return i.createElement(d.CreateConfirmDialog,{isOpen:E,isOpened:E,submitButtonDisabled:_&&L,render:function(){const e=(0,p.splitThousands)(n.format(x)," "),r=(0,o.t)("of {positionQty} lot",{context:"close_position_total",plural:"of {positionQty} lots",count:x}).replace("{positionQty}",e),a=(0,o.t)("of {positionQty} unit",{context:"close_position_total",plural:"of {positionQty} units",count:x}).replace("{positionQty}",e),c=h?r:a;return i.createElement(l.TouchScrollContainer,{className:m.scrollable,onScroll:j},i.createElement("div",{className:m.content},i.createElement("div",{className:m.message},b),i.createElement(s.Checkbox,{name:"partially-close-checkbox",label:i.createElement("span",{className:m.label},(0,o.t)("Partial close")),checked:_,onChange:Z,disabled:!1,indeterminate:!1,labelPositionReverse:!1}),_&&i.createElement("form",{onSubmit:z},i.createElement(u.NumberInput,{error:L,errorMessage:I,
errorHandler:X,className:m.input,value:N,useFormatter:!0,formatter:n,forceShowControls:!0,min:g,step:f,uiStep:v,mode:"float",onValueChange:A,onEmptyString:U,endSlot:i.createElement("p",{className:m.endSlot},c)}),V&&i.createElement("div",{className:m.estimation},i.createElement("div",null,(0,o.t)("Partially close {symbol} {quantity}").replace("{symbol}",t.symbol).replace("{quantity}",q)),i.createElement("div",null,(0,o.t)("Leaving a position of {leavingQty}").replace("{leavingQty}",M))))))},onClose:R,title:(0,o.t)("Close position"),onSubmit:z,onCancel:()=>{},onKeyDown:function(e){27===(0,c.hashFromEvent)(e)&&R()},dataName:"trading-partial-closing-dialog",backdrop:!0,submitOnEnterKey:!0,defaultActionOnClose:"none",submitButtonText:Q,cancelButtonText:(0,o.t)("Cancel"),onOpen:C});function Z(){k(e=>!e)}function R(){S(!1),w({status:!1}),y()}function z(){w(_?null===N||L?{status:!1}:{status:!0,qty:N}:{status:!0,qty:x}),S(!1),y()}function A(e){T(e)}function U(){T(null)}function X(e){D(e)}function j(){a.globalCloseDelegate.fire()}}},3631:(e,t,n)=>{"use strict";n.d(t,{CreateConfirmDialog:()=>r});var o=n(67294),i=n(9187);const s=o.lazy(async()=>({default:(await Promise.all([n.e(8193),n.e(706),n.e(4078),n.e(83),n.e(2273),n.e(9602),n.e(4882),n.e(1274),n.e(5514),n.e(268),n.e(4956),n.e(6848),n.e(3566)]).then(n.bind(n,44956))).AdaptiveConfirmDialog})),r=(0,i.withDialogLazyLoad)(s)},21786:(e,t,n)=>{"use strict";n.d(t,{SplitThousandsFormatter:()=>s});var o=n(6867),i=n(74605);class s{constructor(e=" "){this._divider=e}format(e){const t=(0,o.splitThousands)(e,this._divider);return(0,i.isRtl)()?(0,i.startWithLTR)(t):t}parse(e){const t=(0,i.stripLTRMarks)(e).split(this._divider).join(""),n=Number(t);return isNaN(n)||/e/i.test(t)?{res:!1}:{res:!0,value:n,suggest:this.format(n)}}}},15300:(e,t,n)=>{"use strict";n.d(t,{TouchScrollContainer:()=>l});var o=n(67294),i=n(67891),s=n(16282),r=n(85452);function l(e){const{reference:t,children:n,...s}=e,l=(0,o.useRef)(null),c=(0,o.useCallback)(e=>{t&&(t.current=e),r.CheckMobile.iOS()&&(null!==l.current&&(0,i.enableBodyScroll)(l.current),l.current=e,null!==l.current&&(0,i.disableBodyScroll)(l.current,{allowTouchMove:a(l)}))},[t]);return o.createElement("div",{ref:c,...s},n)}function a(e){return t=>{const n=(0,s.ensureNotNull)(e.current),o=document.activeElement;return!n.contains(t)||null!==o&&n.contains(o)&&o.contains(t)}}},7536:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>'},14897:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>'}}]);