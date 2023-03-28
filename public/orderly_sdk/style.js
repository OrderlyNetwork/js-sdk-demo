"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modalStyles = void 0;
exports.modalStyles = `
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&display=swap");

#near-wallet-selector-modal {
  --backdrop-bg: #26262630;
  --heading-color: #222222;
  --text-color: #676767;
  --sidebar-border-color: #EDEDED;
  --selected-wallet-bg: #4F7CD1;
  --selected-wallet-bg-hover: transparent;
  --wallet-option-border-color: #A7A7A730;
  --wallet-option-bg-hover: #6494ee3d;
  --wallet-option-outline-color: #6494EE;
  --content-bg: #FAFAFA;
  --change-path-bg: #EDEDED;
  --home-button-bg: #EDEDED;
  --confirm-button-bg: #5F8AFA;
  --confirm-button-bg-hover: #5AA6FF;
  --error: #DB5555;
  --close-button-bg-color: #EDEDED;
  --close-button-fill-icon-color: #9F9F9F;
  --spinner-color: #676767;
  --bottom-section: #ececec;
  --mobile-text: #3e3e3e;
  --connected-green: #47E586;
  --gradient-dark-icon: radial-gradient(297.59% 179.46% at 91.67% -25%, #AEC2EA 0%, #95D1E4 100%);
  --get-wallet-option-bg-color: #F8F9FA;
  --get-wallet-option-bg-color-hover: #6494ee3d;
  --get-wallet-option-border-color: #C1C1C1;
  --get-wallet-outline-color: #6494EE;
  --get-wallet-option-box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
  --secondary-button-bg-color: #4F7CD129;
  --secondary-button-border-color: #4F7CD129;
  --secondary-button-text-color: #4F7CD1;
  --what-wallet-icon-color: #FFFFFF;
  --deprecated-icon-bg-color: #D7E2F7;
  --deprecated-icon-bg-color-selected: #4F7CD1;
}

#near-wallet-selector-modal .dark-theme {
  --backdrop-bg: #26262630;
  --heading-color: #FFFFFF;
  --text-color: #C1C1C1;
  --sidebar-border-color: #313030;
  --selected-wallet-bg: #4F7CD1;
  --selected-wallet-bg-hover: #262626CC;
  --wallet-option-border-color: #A7A7A730;
  --wallet-option-bg-hover: #4f7cd13d;
  --wallet-option-outline-color: #4F7CD1;
  --content-bg: #232323;
  --change-path-bg: #161616;
  --home-button-bg: #313030;
  --confirm-button-bg: #5F8AFA;
  --confirm-button-bg-hover: #5AA6FF;
  --error: #DB5555;
  --close-button-bg-color: #313030;
  --close-button-fill-icon-color: #C1C1C1;
  --spinner-color: #FFFFFF;
  --bottom-section: #131313;
  --mobile-text: #c1c1c1;
  --connected-green: #47E586;
  --gradient-dark-icon: radial-gradient(124.37% 124.37% at 91.67% -25%, #112140 0%, #262B35 100%);
  --get-wallet-option-bg-color: #0000001F;
  --get-wallet-option-bg-color-hover: #4f7cd13d;
  --get-wallet-option-border-color: #313030;
  --get-wallet-outline-color: #4F7CD1;
  --get-wallet-option-box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
  --secondary-button-bg-color: #4F7CD129;
  --secondary-button-border-color: #4F7CD1;
  --secondary-button-text-color: #FFFFFF;
  --what-wallet-icon-color: #568FFC;
  --deprecated-icon-bg-color: #2F394E;
  --deprecated-icon-bg-color-selected: #4F7CD1;
}

@media (prefers-color-scheme: dark) {
  #near-wallet-selector-modal {
    --backdrop-bg: #26262630;
    --heading-color: #FFFFFF;
    --text-color: #C1C1C1;
    --sidebar-border-color: #313030;
    --selected-wallet-bg: #4F7CD1;
    --selected-wallet-bg-hover: #262626CC;
    --wallet-option-border-color: #A7A7A730;
    --wallet-option-bg-hover: #4f7cd13d;
    --wallet-option-outline-color: #4F7CD1;
    --content-bg: #232323;
    --change-path-bg: #161616;
    --home-button-bg: #313030;
    --confirm-button-bg: #5F8AFA;
    --confirm-button-bg-hover: #5AA6FF;
    --error: #DB5555;
    --close-button-bg-color: #313030;
    --close-button-fill-icon-color: #C1C1C1;
    --spinner-color: #FFFFFF;
    --bottom-section: #131313;
    --mobile-text: #c1c1c1;
    --connected-green: #47E586;
    --gradient-dark-icon: radial-gradient(124.37% 124.37% at 91.67% -25%, #112140 0%, #262B35 100%);
    --get-wallet-option-bg-color: #0000001F;
    --get-wallet-option-bg-color-hover: #4f7cd13d;
    --get-wallet-option-border-color: #313030;
    --get-wallet-outline-color: #4F7CD1;
    --get-wallet-option-box-shadow: 0px 2px 2px rgba(17, 22, 24, 0.04);
    --secondary-button-bg-color: #4F7CD129;
    --secondary-button-border-color:#4F7CD1;
    --secondary-button-text-color: #FFFFFF;
    --what-wallet-icon-color: #568FFC;
    --deprecated-icon-bg-color: #2F394E;
    --deprecated-icon-bg-color-selected: #4F7CD1;
  }
}

/**
 * Modal Wrapper
 */

.nws-modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  visibility: hidden;
  /*transition: visibility 0s linear 0.25s, opacity 0.25s 0s;*/
  color: var(--wallet-selector-text-color, var(--text-color));
  font-family: Manrope, sans-serif;
  font-weight: 500;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nws-modal-wrapper .nws-modal-overlay {
  background: var(--wallet-selector-backdrop-bg, var(--backdrop-bg));
  height: 100%;
  width: 100%;
  position: absolute;
}

/**
 * Modal
 */

.nws-modal-wrapper .nws-modal {
  background: var(--wallet-selector-content-bg, var(--content-bg));
  width: 100%;
  max-width: 812px;
  height: 555px;
  border-radius: 16px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0px);
  transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  background-color: var(--wallet-selector-content-bg, var(--content-bg));
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.6;
  overflow: hidden;
  display: inline-flex;
}

.nws-modal-wrapper .nws-modal * {
  box-sizing: border-box;
}

.nws-modal-wrapper .nws-modal button {
  padding: 0.5em 1em;
  cursor: pointer;
  border: none;
}

/**
* Modal Left Side
*/

.nws-modal-wrapper .nws-modal .modal-left {
  width: 35%;
  border-right: 1px solid var(--wallet-selector-sidebar-border-color, var(--sidebar-border-color));
  padding: 32px 24px;
  height: 100%;
  overflow: auto;
}

.nws-modal-wrapper .nws-modal .modal-left .modal-left-title h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

.nws-modal-wrapper .nws-modal .modal-left::-webkit-scrollbar {
  width: 10px;
}

/**
 * Modal Wallet Options Section/Wrapper
 */

.nws-modal-wrapper .nws-modal .wallet-options-wrapper {
  margin-bottom: 20px;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .description {
  margin-top: 0;
  margin-bottom: 0;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list {
  margin: 0;
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.single-wallet {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  column-gap: 24px;
  padding: 12px;
  cursor: pointer;
}

.single-wallet:focus-within {
  outline: var(--wallet-option-outline-color) solid 2px;
}

.single-wallet .icon {
  height: 48px;
  width: auto;
}

.single-wallet .icon img {
  width: 100%;
  height: auto;
  max-width: 48px;
}

.single-wallet .content {
  width: 50%;
}

.single-wallet .content .name {
  font-family: inherit;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: #FFFFFF;
}

.single-wallet .content .description {
  font-family: inherit;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
}

.single-wallet .button-get {
  margin-left: auto;
  margin-right: 0;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar {
  border-radius: 8px;
  justify-content: flex-start;
  column-gap: 12px;
  cursor: pointer;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar:hover {
  background-color: var(--wallet-selector-wallet-option-bg-hover, var(--wallet-option-bg-hover));
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.selected-wallet {
  padding: 12px;
  background-color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
  outline: none;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.selected-wallet .content .title {
  color: #FFFFFF;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.deprecated-wallet .icon,
.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.deprecated-wallet .title {
  opacity: 0.4;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.deprecated-wallet {
  position: relative;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .warning-triangle {
  display: flex;
  position: absolute;
  top: 2px;
  left: 42px;
  background: var(--content-bg);
  border-top-left-radius: 63px;
  border-bottom-left-radius: 10px;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar:hover .warning-triangle {
  background-color: var(--deprecated-icon-bg-color);
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.selected-wallet.sidebar .warning-triangle {
  background-color: var(--deprecated-icon-bg-color-selected);
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .icon {
  width: 40px;
  height: 40px;
  background-color: #FFF;
  padding: 5px;
  border-radius: 5px;
  position: relative;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.connected-wallet .icon::before {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  background-color: var(--connected-green);
  border-radius: 50%;
  position: absolute;
  top: -8px;
  right: -8px;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.connected-wallet .icon::before {
  border: 3px solid var(--wallet-selector-content-bg, var(--content-bg));
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar.selected-wallet.connected-wallet .icon::before {
  border: 3px solid var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .content {
  height: 32px;
  width: auto;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .content .title {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
  /* identical to box height, or 171% */
  align-items: center;
  color: var(--wallet-selector-heading-color, var(--heading-color));
  margin-left: 10px;
}

.nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .content .description {
  display: none;
}

/**
* Modal Right Side
*/

.nws-modal-wrapper .nws-modal .modal-right {
  width: 65%;
  padding: 32px;
  overflow: auto;
}

.nws-modal-wrapper .nws-modal .modal-right::-webkit-scrollbar {
  width: 10px;
}

.nws-modal-wrapper .nws-modal .wallet-home-wrapper .get-wallet-wrapper,
.nws-modal-wrapper .nws-modal .wallet-home-wrapper .wallet-info-wrapper,
.nws-modal-wrapper .nws-modal .connecting-wrapper,
.nws-modal-wrapper .nws-modal .wallet-not-installed-wrapper,
.nws-modal-wrapper .nws-modal .switch-network-message-wrapper {
  margin-top: 91px;
  padding: 0 28px;
}

.nws-modal-wrapper .nws-modal .connecting-wrapper-err {
  margin-top: 45px;
  padding: 0 28px;
}

.nws-modal-wrapper .nws-modal .wallet-home-wrapper .get-wallet-wrapper {
  margin: 20px 0 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 10px;
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what {
  display: flex;
  align-content: center;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: 32px;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what + .wallet-what {
  margin-top: 50px;
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what .icon-side {
  width: 56px;
  height: 56px;
  padding: 8px;
  background: var(--gradient-dark-icon);
  border-radius: 12px;
  color: var(--what-wallet-icon-color);
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what .icon-side svg {
  opacity: 0.7;
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what .content-side {
  width: 100%;
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what .content-side h3 {
  margin: 0 auto 8px 0;
  font-family: inherit;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: var(--wallet-selector-text-color, var(--heading-color));
}

.nws-modal-wrapper .nws-modal .modal-right .wallet-what .content-side p {
  margin: 0;
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  word-break: break-word;
}

/**
 * Modal Header
 */

.nws-modal-wrapper .nws-modal .modal-right .nws-modal-header h3.middleTitle {
  text-align: center;
  margin: 4px auto;
  font-size: 18px;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

.nws-modal-wrapper .nws-modal .modal-right .nws-modal-body.get-wallet-body {
  padding-left: 32px;
  padding-right: 0;
  row-gap: 16px;
  margin-top: 64px;
}

.nws-modal-wrapper .nws-modal .nws-modal-body button.middleButton {
  background-color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
  font: inherit;
  border-radius: 4px;
  color: #FFFFFF;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  border-color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
  display: block;
  margin: 25px auto 12px auto;
  border: 0.1em solid var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
}

.nws-modal-wrapper .nws-modal .nws-modal-body button.get-wallet {
  margin: 4px 0;
  background-color: var(--wallet-selector-home-button-bg, var(--home-button-bg));
  border-radius: 4px;
  padding: 8px 24px;
  border-width: 0;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  font-family: inherit;
  color: #6494EE;
}

.nws-modal-wrapper .nws-modal .nws-modal-header {
  width: 100%;
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: flex-start;
}

.nws-modal-wrapper .nws-modal .nws-modal-header .close-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  cursor: pointer;
  height: 32px;
  width: 32px;
  padding: 0;
  background-color: var(--wallet-selector-close-button-bg-color, var(--close-button-bg-color));
  border-radius: 50px;
}

.nws-modal-wrapper .nws-modal .nws-modal-header .close-button svg {
  fill: var(--wallet-selector-close-button-fill-icon-color, var(--close-button-fill-icon-color));
}

.nws-modal-wrapper .nws-modal .back-button {
  background: transparent;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: block;
  /* vertical-align: middle; */
  border: none;
  padding: 4px
}

.nws-modal-wrapper .nws-modal .nws-modal-header-wrapper {
  display: flex;
  align-items: center;
}

.nws-modal-wrapper .nws-modal .nws-modal-header .close-button:active {
  background: transparent;
}

.nws-modal-wrapper .nws-modal .nws-modal-header .close-button svg {
  pointer-events: none;
}

.nws-modal-wrapper .nws-modal .nws-modal-header h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

.nws-modal-wrapper .nws-modal .action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nws-modal-wrapper .nws-modal .lang-selector-wrapper {
  position: absolute;
  bottom: 15px;
  right: 50px;
  display: none;
}

.nws-modal-wrapper .nws-modal .lang-selector {
  appearance: none;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjc1IDE5LjI1TDE2IDEyLjc1TDE5LjI1IDE5LjI1IiBzdHJva2U9IiNDMUMxQzEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTE0IDE3LjI1SDE4IiBzdHJva2U9IiNDMUMxQzEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTQuNzUgNi43NUgxMy4yNSIgc3Ryb2tlPSIjQzFDMUMxIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik05IDYuNVY0Ljc1IiBzdHJva2U9IiNDMUMxQzEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTExLjI1IDYuNzVDMTEuMjUgNi43NSAxMS4yNSA5LjI1IDkuMjUgMTEuMjVDNy4yNSAxMy4yNSA0Ljc1IDEzLjI1IDQuNzUgMTMuMjUiIHN0cm9rZT0iI0MxQzFDMSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTIuMjUgMTMuMjVDMTIuMjUgMTMuMjUgOS43NSAxMy4yNSA3Ljc1IDExLjI1QzcuMzQ1NTEgMTAuODQ1NSA2Ljc1IDkuNzUgNi43NSA5Ljc1IiBzdHJva2U9IiNDMUMxQzEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==") 5px center / 20px 20px no-repeat transparent;
  border: 0;
  cursor: pointer;
  font-size: 16px;
  height: 32px;
  outline: none;
  padding-right: 54px;
  position: relative;
  user-select: none;
  width: 54px;
  z-index: 1;
  text-indent: 54px;
}

.nws-modal-wrapper .nws-modal .lang-selector-wrapper::after {
  content: "";
  border-color: rgb(114, 114, 122);
  border-style: solid;
  border-width: 2px 2px 0 0;
  display: inline-block;
  position: absolute;
  right: 10px;
  top: calc(50% - 10px);
  transform: rotate(135deg) translateY(-50%);
  height: 7px;
  width: 7px;
}

/**
 * Modal Switch Network Message Section/Wrapper
 */


.nws-modal-wrapper .nws-modal .switch-network-message-wrapper .content .network-id {
  color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
}

/**
 * Modal Ledger Derivation Path Section/Wrapper
 */

.nws-modal-wrapper .nws-modal .derivation-path-wrapper {
  padding: 0 26px;
}

.nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-image {
  display: flex;
  justify-content: center;
  margin-top: 53px;
  margin-bottom: 40px;
}

.nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-description {
  font-size: 14px;
  text-align: center;
}

.nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-description p {
  margin: 14px 0;
}

.nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-description .specify-path {
  color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
  cursor: pointer;
}

.nws-modal-wrapper .nws-modal .derivation-path-wrapper .derivation-path-list {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 16px;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 91px;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper .display-path {
  background: var(--home-button-bg);
  color: #606060;
  padding: 16px;
  border-radius: 8px;
  letter-spacing: 1px;
  font-weight: 700;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper .change-path {
  background: var(--change-path-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  width: 63px;
  padding: 0 5px;
  border-radius: 8px;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper .change-path .path-value {
  width: 100%;
  text-align: center;
  font-weight: bold;
}

.nws-modal-wrapper .nws-modal .specify-path-wrapper p {
  margin: 14px;
}

.nws-modal-wrapper .nws-modal .specify-path-wrapper .path-description {
  font-size: 14px;
  margin-top: 24px;
  text-align: center;
}

.nws-modal-wrapper .nws-modal .specify-path-wrapper .what-link {
  font-size: 14px;
  text-align: center;
  color: var(--selected-wallet-bg);
  cursor: pointer;
}

.nws-modal-wrapper .nws-modal .specify-path-wrapper .what-link a {
  text-decoration: none;
  color: var(--selected-wallet-bg);
  font-size: 14px;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper .change-path .buttons-wrapper {
  display: flex;
  flex-direction: column;
}

.nws-modal-wrapper .specify-path-wrapper .change-path-wrapper .change-path .buttons-wrapper button {
  padding: 0;
  width: 23px;
  background-color: var(--home-button-bg);
  border: none;
}

.nws-modal-wrapper .nws-modal .no-accounts-found-wrapper {
  margin-top: 50px;
  font-size: 14px;
}

.nws-modal-wrapper .nws-modal .enter-custom-account {
  margin-top: 20px;
}

.nws-modal-wrapper .nws-modal .enter-custom-account p {
  text-align: center;
  font-size: 14px;
}

.nws-modal-wrapper .nws-modal .enter-custom-account .input-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 90px;
}

.nws-modal-wrapper .nws-modal .enter-custom-account .input-wrapper input {
  text-align: center;
  color: var(--wallet-selector-heading-color, var(--heading-color));
  border: 1px solid var(--confirm-button-bg-hover);
  padding: 6px 8px;
  border-radius: 50px;
}

/**
 * Modal Wallet ChooseLedgerAccountForm/Wrapper
 */

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper p {
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .button-wrapper {
  display: flex;
  justify-content: center;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .button-wrapper button {
  color: var(--selected-wallet-bg);
  font-weight: 600;
  background-color: transparent;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid var(--selected-wallet-bg);
  width: 78px;
  padding: 6px 8px;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .form {
  margin-top: 96px;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 10px;
  color: var(--text-color);
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control .account {
  border-bottom: 1px solid var(--sidebar-border-color);
  padding: 16px 0;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control .account input[type=checkbox] {
  width: 25px;
  -ms-transform: scale(2);
  -moz-transform: scale(2);
  -webkit-transform: scale(2);
  -o-transform: scale(2);
  transform: scale(1.7);
  padding: 10px;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control label {
  color: inherit;
}

.nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .action-buttons {
  justify-content: flex-end;
}

.nws-modal-wrapper .nws-modal .overview-wrapper p {
  font-size: 14px;
  text-align: center;
}

.nws-modal-wrapper .nws-modal .overview-wrapper .accounts {
  margin-top: 96px;
}

.nws-modal-wrapper .nws-modal .overview-wrapper .account {
  border-bottom: 1px solid var(--sidebar-border-color);
  padding: 16px 0;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

/*
  Connecting Wrapper Section/Wrapper
*/
.nws-modal-wrapper .nws-modal .connecting-wrapper .content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/**
 * Modal Wallet Not Installed Section/Wrapper
 */

.nws-modal-wrapper .wallet-not-installed-wrapper .refresh-link {
  color: #5f8afa;
  cursor: pointer;
}

.nws-modal-wrapper .wallet-not-installed-wrapper .wallet-data {
  display: flex;
  align-items: center;
}

.nws-modal-wrapper .wallet-not-installed-wrapper .wallet-data p {
  margin: 0 0 0 10px;
}

.nws-modal-wrapper .wallet-not-installed-wrapper p {
  margin: 16px 0;
}

.nws-modal-wrapper .wallet-not-installed-wrapper .wallet-data .wallet-icon-box {
  width: 40px;
  height: 40px;
}

.nws-modal-wrapper .wallet-not-installed-wrapper .wallet-data .wallet-icon-box img {
  width: 100%;
  height: auto;
}

.open {
  opacity: 1;
  visibility: visible;
  transition: visibility 0s linear 0s, opacity 0.25s 0s;
}

.nws-modal-wrapper .spinner {
  margin-right: 10px;
  --size: 160px;
  --border: 6px;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nws-modal-wrapper .spinner .icon {
  width: calc(var(--size) / 1.2);
  height: calc(var(--size) / 1.2);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.05) 0 10px 20px 0;
}

.nws-modal-wrapper .spinner img {
  width: 100%;
  height: auto;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 600px) {
  .nws-modal-wrapper .nws-modal-wrapper .nws-modal {
    width: 250px;
  }

  .nws-modal-wrapper .nws-modal-wrapper .nws-modal .derivation-path-wrapper .derivation-path-list input {
    max-width: 140px;
  }

  .nws-modal-wrapper .nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control {
    flex-direction: column;
  }

  .nws-modal-wrapper .nws-modal-wrapper .nws-modal .choose-ledger-account-form-wrapper .nws-form-control select {
    text-align: center;
  }

  .nws-modal-wrapper .nws-modal .wallet-home-wrapper .get-wallet-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

.nws-modal-wrapper .nws-modal-wrapper.dark-theme .spinner .icon {
  box-shadow: 0 10px 20px 0 rgba(255, 255, 255, 0.05);
}

@media (prefers-color-scheme: dark) {

  .nws-modal-wrapper .spinner .icon {
    box-shadow: 0 10px 20px 0 rgba(255, 255, 255, 0.05);
  }
}

@keyframes outAnimation {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    visibility: hidden;
  }
}

/**
* Modal Wallet Connecting Section/Wrapper
*/

.connecting-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
}

.connecting-wrapper .content .icon {
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  position: relative;
}

.connecting-wrapper .content .icon .green-dot {
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: var(--connected-green);
  top: -10px;
  right: -10px;
  border-radius: 50%;
  border: 5px solid var(--wallet-selector-content-bg, var(--content-bg));
}

.connecting-wrapper .content .icon img {
  width: 100%;
  height: auto;
}

.connecting-wrapper .content h3 {
  margin: 16px 0;
}

.connecting-wrapper .content .connecting-name {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--wallet-selector-heading-color, var(--heading-color));
}

.connecting-wrapper .content .connecting-message {
  font-size: 14px;
  margin-top: 16px;
}

.connecting-wrapper .content .connecting-details {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  align-items: center;
  margin-top: 40px;
}
.connecting-wrapper .content .connecting-details span {
  color: var(--wallet-selector-selected-wallet-bg, var(--selected-wallet-bg));
}
.connecting-wrapper .content .connecting-details .spinner {
  width: 25px;
  height: auto;
  animation: spinner 2s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection button {
  padding: 10px 24px;
  gap: 8px;
  background: var(--secondary-button-bg-color);
  border: 1px solid var(--secondary-button-border-color);
  border-radius: 4px;
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  color: var(--secondary-button-text-color);
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection .error-wrapper {
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  flex-direction: column;
  column-gap: 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  text-align: center;
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection .error {
  color: #CE5A6F;
  vertical-align: middle;
  align-items: center;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  flex-direction: row;
  column-gap: 12px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  text-align: center;
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection .error-wrapper .error svg {
  color: var(--wallet-selector-content-bg,var(--content-bg));
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection .error-wrapper p {
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 14px 0;
}

.nws-modal-wrapper .nws-modal .nws-modal-body .alert-message .connection .success {
  color: #4FD98F;
}

.nws-modal-wrapper .nws-modal .connecting-wrapper .content {
  padding: 25px;
}

.connecting-wrapper .content .connecting-details {
  margin-top: 20px;
}

.connecting-wrapper .wallet-connected-success {
  display: flex;
  align-items: center;
}

.connecting-wrapper .wallet-connected-success svg{
  color: var(--content-bg);
}

.connecting-wrapper .wallet-connected-success span {
  font-size: 14px;
  margin-left: 10px;
  color: var(--wallet-selector-connected-green, var(--connected-green));
}


.single-wallet-get {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex-grow: 1;
  padding: 14px;
  height: 100%;
  margin: auto;
  align-content: center;
  border: 1px solid var(--get-wallet-option-border-color);
  box-shadow: var(--get-wallet-option-box-shadow);
  border-radius: 8px;
  position: relative;
  background-color: var(--get-wallet-option-bg-color);
  cursor: pointer;
  margin-top: 0px;
}

.single-wallet-get:hover {
  background: var(--get-wallet-option-bg-color-hover);
}

.single-wallet-get:focus-within {
  outline: var(--get-wallet-outline-color) solid 2px;
}

.single-wallet-get .icon {
  min-width: 32px;
  max-height: 32px;
  margin-bottom: 8px;
  width: 32px;
  height: 32px;
  background-color: #FFF;
  padding: 5px;
  border-radius: 5px;
  position: relative;
}

.single-wallet-get .icon img {
  width: 100%;
  height: auto;
  max-width: 48px;
}

.single-wallet-get .title {
  font-family: inherit;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 24px;
  align-items: center;
  color: var(--heading-color);
  text-align: center;
}

.single-wallet-get .type {
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  margin-top: 0;
  color: var(--text-color);
  text-align: center;
}

.single-wallet-get .small-icon {
  position: absolute;
  top: 8px;
  right: 8px;
}

.single-wallet-get .small-icon svg {
  color: #4C5155;
}

.single-wallet-get:hover .small-icon svg {
  color: #4F7CD1;
}

.single-wallet-get .description {
  font-family: inherit;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
  align-items: center;
}


.single-wallet-get .button-get {
  margin-left: auto;
  margin-right: 0;
}

.connected-flag {
  color: var(--connected-green);
  border: 1px solid var(--connected-green);
  border-radius: 50px;
  padding: 3px 10px;
  display: flex;
  align-items: center;
}

.connected-flag::before {
  content: '';
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--connected-green);
  margin-right: 5px;
}

/************* Scan QR Code **********/
.scan-qr-code{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.scan-qr-code .qr-code > div:first-of-type {
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 16px;
  background: #fff;
}

.scan-qr-code .qr-code{
  height: calc(100% - 200px);
  border: 1px solid var(--wallet-selector-content-bg, var(--content-bg));
  border-radius: 4px;
  text-align: center;
  margin-top: 64px;
}

.scan-qr-code .qr-code svg{
  width: 239px;
  height: 239px;
}

.scan-qr-code .qr-code .copy-btn{
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--selected-wallet-bg);
  font-size: 14px;
}
.scan-qr-code .qr-code .copy-btn svg{
  margin-right: 5px;
  width: 24px;
  height: 24px;
}
.scan-qr-code .qr-code .notification{
  font-size: 14px;
}


.scan-qr-code .footer{
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding:24px;
  bottom: 0;
  font-size: 14px;
}

.scan-qr-code .footer .btn {
  background: var(--secondary-button-bg-color);
  color: var(--secondary-button-text-color);
  border: 1px solid var(--secondary-button-border-color);
  border-radius: 4px;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  padding: 8px 24px;
}

/************* Responsive and mobile **********/

@media (min-width: 577px) {
  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-body .what-wallet-mobile {
    display: none;
  }
  .scan-qr-code .footer {
    position: absolute;
  }
}

@media (min-width: 769px) {
  .button-spacing {
    margin: 90px
  }
}


@media (max-width: 768px) {

  .nws-modal-wrapper .nws-modal .wallet-home-wrapper .wallet-info-wrapper {
    margin-top: 45px;
  }

  .button-spacing {
    margin: 45px
  }


  .nws-modal-wrapper .nws-modal .modal-left {
    width: 40%;
    border-right: 1px solid var(--wallet-selector-sidebar-border-color, var(--sidebar-border-color));
    padding: 32px 16px;
    height: 100%;
    max-height: 70vh;
    overflow: auto;
  }

  .nws-modal-wrapper .nws-modal .modal-right {
    width: 60%;
    padding: 32px 16px;
    overflow: auto;
  }

  .nws-modal-wrapper .nws-modal .wallet-home-wrapper .wallet-info-wrapper {
    padding:  0 0 0 10px;
  }

  .nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-image {
    margin-top: 30px;
    margin-bottom: 35px;
  }
}


@media (max-width: 576px) {

  .nws-modal-wrapper .nws-modal .wallet-home-wrapper .get-wallet-wrapper,
  .nws-modal-wrapper .nws-modal .wallet-home-wrapper .wallet-info-wrapper,
  .nws-modal-wrapper .nws-modal .connecting-wrapper,
  .nws-modal-wrapper .nws-modal .wallet-not-installed-wrapper,
  .nws-modal-wrapper .nws-modal .switch-network-message-wrapper {
    margin-top: 20px;
  }

  .nws-modal-wrapper .nws-modal .modal-left .modal-left-title h2 {
    text-align: center;
  }

  .nws-modal-wrapper .wallet-not-installed-wrapper > p {
    margin: 20px 0px 30px 0px;
    max-width: 500px;
  }

  .nws-modal-wrapper .nws-modal .nws-modal-body button.get-wallet {
    background-color: var(--wallet-selector-home-button-bg, var(--content-bg));
  }

  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-body .what-wallet-hide {
    display: none;
  }

  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-body .what-wallet-mobile p {
    font-size: 14px;
    margin-bottom: 0;
    text-align: center;
    margin: auto;
  }



  .nws-modal-wrapper .nws-modal {
    width: 100%;
    display: block;
    overflow: auto;
    bottom: 0;
    height: 500px;
    background: var(--wallet-selector-mobile-bottom-section, var(--bottom-section));
    border-radius: 16px 16px 0px 0px;
  }

  .nws-modal-wrapper .nws-modal .modal-left {
    width: 100%;
    background-color: var(--wallet-selector-content-bg, var(--content-bg));
    height: auto;
    padding: 32px 12px;
  }

  .nws-modal-wrapper .nws-modal .modal-left .nws-modal-body {
    display: flex;
    overflow: auto;
  }

  .nws-modal-wrapper .nws-modal .modal-left .nws-modal-body .wallet-options-wrapper {
    margin: auto;
  }

  .nws-modal-wrapper .nws-modal .modal-right {
    width: 100%;
    background-color: var(--wallet-selector-mobile-bottom-section, var(--bottom-section));
  }

  .nws-modal-wrapper .nws-modal .connecting-wrapper .content {
    padding-top: 0;
  }

  .connecting-wrapper .content .icon .green-dot {
    border-color: var(--wallet-selector-mobile-bottom-section, var(--bottom-section));
  }

  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-header h3.middleTitle {
    text-align: center;
    font-size: 16px;
    margin: 4px auto;
  }
  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-header h3.middleTitle.-open{
    padding-right: 32px;
  }

  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-body .content {
    font-size: 14px;
    text-align: center;
    color: var(--mobile-text);
    margin: 0
  }

  .nws-modal-wrapper .nws-modal .modal-right .nws-modal-body {
    margin-top: 10px;
    padding: 0;
  }

  .nws-modal-wrapper .nws-modal .nws-modal-body button.middleButton {
    margin: 25px auto 12px auto;
  }

  .nws-modal-wrapper .nws-modal .modal-header {
    display: block;
    font-size: 18px;
    text-align: center;
  }

  .nws-modal-wrapper .nws-modal .nws-modal-header .close-button {
    position: absolute;
    right: 30px;
    top: 30px;
  }

  .nws-modal-wrapper .nws-modal .nws-modal-header h2 {
    font-size: 18px;
    text-align: center;
  }

  .nws-modal-wrapper .nws-modal .wallet-options-wrapper {
    margin-bottom: 0;
  }

  .nws-modal-wrapper .nws-modal .wallet-options-wrapper .description {
    display: none;
  }

  .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list {
    display: flex;
    overflow: auto;
    padding-block: 10px;
    grid-gap: 0;
    gap: 0;
  }

  .nws-modal-wrapper .nws-modal .info {
    display: none;
    width: 90px;
  }

  .single-wallet {
    display: block;
    min-width: 76px;
    max-width: 76px;
  }

  .single-wallet.sidebar .icon {
    width: 56px;
    height: 56px;
    margin: auto;
  }

  .single-wallet.sidebar .content {
    width: auto;
  }

  .nws-modal-wrapper .nws-modal .wallet-options-wrapper .options-list .single-wallet.sidebar .content .title {
    font-size: 12px;
    line-height: 16px;
    margin-top: 10px;
    text-align: center;
    margin-left: 0 !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .single-wallet.wallet-connect, .single-wallet.my-near-wallet {
    word-break: break-word;
  }

  .single-wallet-get:hover {
    background-color: #4F7CD129;
  }

  .nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-image,
  .nws-modal-wrapper .specify-path-wrapper .change-path-wrapper {
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .nws-modal-wrapper .nws-modal .derivation-path-wrapper .enter-derivation-path .ledger-description > p {
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .nws-modal-wrapper ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
    background: var(--backdrop-bg);
  }

  .nws-modal-wrapper ::-webkit-scrollbar-thumb:horizontal {
    background: var(--close-button-fill-icon-color);
    border-radius: 10px;
  }
}

`;
