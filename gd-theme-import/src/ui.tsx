import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

let currentThemeId = null;
onmessage = (event) => {
    currentThemeId = event.data.pluginMessage;
};

class App extends React.Component {
    themeSelect: HTMLSelectElement

    constructor() {
        // @ts-ignore
        super();

        this.state = {
            loaded: false,
            themes: null
        };
    }

    themeSelectRef = (element: HTMLSelectElement) => {
        this.themeSelect = element;
    }

    onCreate = () => {
        this.setState({
            loaded: false
        });
        // HARD CODING THIS FOR NOW = GODADDY THEME FROM UXP
        
        // Fetch an entire theme from this endpoint: fetch('https://theme-api.uxp.godaddy.com/v1/themes?alias=godaddy:brand')
        const themeData = `
            {
                "root": {
                "values": {
                    "intents.ux.action.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.action.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },  
                    "intents.ux.action.borderRadius": {
                    "type": "static",
                    "value": "0"
                    },
                    "intents.ux.action.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.actionChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionCritical.backgroundColor": {
                    "type": "static",
                    "value": "#ae1302"
                    },
                    "intents.ux.actionCritical.borderColor": {
                    "type": "static",
                    "value": "#ae1302"
                    },
                    "intents.ux.actionCritical.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionCriticalChosen.backgroundColor": {
                    "type": "static",
                    "value": "#600801"
                    },
                    "intents.ux.actionCriticalChosen.borderColor": {
                    "type": "static",
                    "value": "#600801"
                    },
                    "intents.ux.actionCriticalChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionCriticalFocused.backgroundColor": {
                    "type": "static",
                    "value": "#ae1302"
                    },
                    "intents.ux.actionCriticalFocused.borderColor": {
                    "type": "static",
                    "value": "#ae1302"
                    },
                    "intents.ux.actionCriticalFocused.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionCriticalFocused.outlineColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionCriticalHovered.backgroundColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.ux.actionCriticalHovered.borderColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.ux.actionCriticalHovered.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionFocused.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.actionFocused.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.actionFocused.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.actionFocused.outlineColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.actionHovered.backgroundColor": {
                    "type": "static",
                    "value": "#f5f7f8"
                    },
                    "intents.ux.actionHovered.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.actionHovered.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionControl.backgroundColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControl.borderColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControl.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionControlChosen.backgroundColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlChosen.borderColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlChosen.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionControlFocused.backgroundColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlFocused.borderColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlFocused.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionControlFocused.outlineColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionControlHovered.backgroundColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlHovered.borderColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.actionControlHovered.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionPrimary.backgroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionPrimary.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionPrimary.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionPrimaryChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionPrimaryChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionPrimaryChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionPrimaryFocused.backgroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionPrimaryFocused.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionPrimaryFocused.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionPrimaryFocused.outlineColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.actionPrimaryHovered.backgroundColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.actionPrimaryHovered.borderColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.actionPrimaryHovered.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionSecondary.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionSecondary.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondary.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondaryChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionSecondaryChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.actionSecondaryChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionSecondaryFocused.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionSecondaryFocused.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondaryFocused.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondaryFocused.outlineColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondaryHovered.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.actionSecondaryHovered.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.actionSecondaryHovered.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.navigate.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigate.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigate.borderRadius": {
                    "type": "static",
                    "value": "0"
                    },
                    "intents.ux.navigate.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.navigateChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigateChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigateChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateFocused.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigateFocused.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigateFocused.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.navigateFocused.outlineColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigateHovered.backgroundColor": {
                    "type": "static",
                    "value": "#f5f7f8"
                    },
                    "intents.ux.navigateHovered.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.navigateHovered.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigatePrimary.backgroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigatePrimary.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigatePrimary.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigatePrimaryChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigatePrimaryChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigatePrimaryChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigatePrimaryFocused.backgroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigatePrimaryFocused.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigatePrimaryFocused.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigatePrimaryFocused.outlineColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.navigatePrimaryHovered.backgroundColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.navigatePrimaryHovered.borderColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.ux.navigatePrimaryHovered.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateSecondary.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateSecondary.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondary.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondaryChosen.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigateSecondaryChosen.borderColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.navigateSecondaryChosen.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateSecondaryFocused.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateSecondaryFocused.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondaryFocused.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondaryFocused.outlineColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondaryHovered.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.navigateSecondaryHovered.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.navigateSecondaryHovered.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.box.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.box.borderColor": {
                    "type": "static",
                    "value": "#d4dbe0"
                    },
                    "intents.ux.box.borderRadius": {
                    "type": "static",
                    "value": "4px"
                    },
                    "intents.ux.box.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.boxHighContrast.backgroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.boxHighContrast.borderColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    },
                    "intents.ux.boxHighContrast.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.boxHighContrastOverlay.backgroundColor": {
                    "type": "static",
                    "value": "rgba(0,0,0,0.85)"
                    },
                    "intents.ux.boxHighContrastOverlay.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.boxHighContrastOverlay.borderColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    },
                    "intents.ux.boxLowContrast.backgroundColor": {
                    "type": "static",
                    "value": "#f5f7f8"
                    },
                    "intents.ux.boxLowContrast.borderColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.ux.boxLowContrast.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.boxLowContrastOverlay.backgroundColor": {
                    "type": "static",
                    "value": "rgba(255,255,255,0.2)"
                    },
                    "intents.ux.boxLowContrastOverlay.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.boxLowContrastOverlay.borderColor": {
                    "type": "static",
                    "value": "#d4dbe0"
                    },
                    "intents.ux.control.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.control.borderColor": {
                    "type": "static",
                    "value": "#d4dbe0"
                    },
                    "intents.ux.control.borderRadius": {
                    "type": "static",
                    "value": "0"
                    },
                    "intents.ux.control.foregroundColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    },
                    "intents.ux.control.outlineColor": {
                    "type": "static",
                    "value": "#000"
                    },
                    "intents.ux.controlFocused.outlineColor": {
                    "type": "static",
                    "value": "#000"
                    },
                    "intents.ux.controlKnob.backgroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.controlKnob.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.controlVoid.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.controlVoid.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.ux.controlVoid.foregroundColor": {
                    "type": "static",
                    "value": "#767676"
                    },
                    "intents.ux.feedback.feedbackColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.feedback.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackCritical.feedbackColor": {
                    "type": "static",
                    "value": "#ffbbbb"
                    },
                    "intents.ux.feedbackCritical.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackHighContrastCritical.feedbackColor": {
                    "type": "static",
                    "value": "#ae1302"
                    },
                    "intents.ux.feedbackHighContrastCritical.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastHighlight.feedbackColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.ux.feedbackHighContrastHighlight.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastInfo.feedbackColor": {
                    "type": "static",
                    "value": "#613ea3"
                    },
                    "intents.ux.feedbackHighContrastInfo.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastInternal.feedbackColor": {
                    "type": "static",
                    "value": "#b4006c"
                    },
                    "intents.ux.feedbackHighContrastInternal.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastNeutral.feedbackColor": {
                    "type": "static",
                    "value": "#145fa9"
                    },
                    "intents.ux.feedbackHighContrastNeutral.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastPassive.feedbackColor": {
                    "type": "static",
                    "value": "#767676"
                    },
                    "intents.ux.feedbackHighContrastPassive.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastSuccess.feedbackColor": {
                    "type": "static",
                    "value": "#003a15"
                    },
                    "intents.ux.feedbackHighContrastSuccess.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighContrastWarning.feedbackColor": {
                    "type": "static",
                    "value": "#aa6d00"
                    },
                    "intents.ux.feedbackHighContrastWarning.onFeedbackColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.ux.feedbackHighlight.feedbackColor": {
                    "type": "static",
                    "value": "#a6fff8"
                    },
                    "intents.ux.feedbackHighlight.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackInfo.feedbackColor": {
                    "type": "static",
                    "value": "#d3c1f7"
                    },
                    "intents.ux.feedbackInfo.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackInternal.feedbackColor": {
                    "type": "static",
                    "value": "#fbd9ed"
                    },
                    "intents.ux.feedbackInternal.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackNeutral.feedbackColor": {
                    "type": "static",
                    "value": "#ddeaf8"
                    },
                    "intents.ux.feedbackNeutral.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackPassive.feedbackColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.ux.feedbackPassive.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackSuccess.feedbackColor": {
                    "type": "static",
                    "value": "#9fffb8"
                    },
                    "intents.ux.feedbackSuccess.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.feedbackWarning.feedbackColor": {
                    "type": "static",
                    "value": "#ffeea9"
                    },
                    "intents.ux.feedbackWarning.onFeedbackColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.ux.figure.figureColor0": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.figure.figureColor1": {
                    "type": "static",
                    "value": "#ef6c0f"
                    },
                    "intents.ux.figure.figureColor2": {
                    "type": "static",
                    "value": "#744bc4"
                    },
                    "intents.ux.figure.figureColor3": {
                    "type": "static",
                    "value": "#aa6d00"
                    },
                    "intents.ux.figure.figureColor4": {
                    "type": "static",
                    "value": "#1976d2"
                    },
                    "intents.ux.figure.figureColor5": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.ux.figure.figureColor6": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.ux.figure.figureColor7": {
                    "type": "static",
                    "value": "#ef6c0f"
                    },
                    "intents.ux.figure.figureColor8": {
                    "type": "static",
                    "value": "#744bc4"
                    },
                    "intents.ux.figure.figureColor9": {
                    "type": "static",
                    "value": "#aa6d00"
                    },
                    "intents.ux.figure.figureColor10": {
                    "type": "static",
                    "value": "#1976d2"
                    },
                    "intents.ux.figure.figureColor11": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.ux.text.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.text.fontSize": {
                    "type": "static",
                    "value": "1rem"
                    },
                    "intents.ux.text.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.text.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textAction.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textAction.fontSize": {
                    "type": "static",
                    "value": "1rem"
                    },
                    "intents.ux.textAction.fontWeight": {
                    "type": "static",
                    "value": "700"
                    },
                    "intents.ux.textAction.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textCaption.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textCaption.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.ux.textCaption.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.textCaption.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textHeading.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gd-sage'","'Times New Roman'","serif"]
                    },
                    "intents.ux.textHeading.fontSize": {
                    "type": "static",
                    "value": "2rem"
                    },
                    "intents.ux.textHeading.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.textHeading.lineHeight": {
                    "type": "static",
                    "value": "1.25"
                    },
                    "intents.ux.textInput.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textInput.fontSize": {
                    "type": "static",
                    "value": "1rem"
                    },
                    "intents.ux.textInput.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.textInput.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textLabel.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textLabel.fontSize": {
                    "type": "static",
                    "value": "1rem"
                    },
                    "intents.ux.textLabel.fontWeight": {
                    "type": "static",
                    "value": "700"
                    },
                    "intents.ux.textLabel.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textParagraph.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textParagraph.fontSize": {
                    "type": "static",
                    "value": "1rem"
                    },
                    "intents.ux.textParagraph.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.textParagraph.lineHeight": {
                    "type": "static",
                    "value": "1.5"
                    },
                    "intents.ux.textTitle.fontFamily": {
                    "type": "fontgroup",
                    "value": ["'gdsherpa'","Helvetica","Arial","sans-serif"]
                    },
                    "intents.ux.textTitle.fontSize": {
                    "type": "static",
                    "value": "1.375rem"
                    },
                    "intents.ux.textTitle.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.ux.textTitle.lineHeight": {
                    "type": "static",
                    "value": "1.25"
                    },
                    "intents.uxAlertInternal.borderColor": {
                    "type": "static",
                    "value": "#e20087"
                    },
                    "intents.uxAlertNeutral.borderColor": {
                    "type": "static",
                    "value": "#1976d2"
                    },
                    "intents.uxButtonHovered.backgroundColor": {
                    "type": "static",
                    "value": "#d8efef"
                    },
                    "intents.uxButtonHovered.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.uxCode.backgroundColor": {
                    "type": "static",
                    "value": "#f5f2f0"
                    },
                    "intents.uxCode.foregroundColor": {
                    "type": "static",
                    "value": "#000"
                    },
                    "intents.uxCode.tokenColor0": {
                    "type": "static",
                    "value": "#708090"
                    },
                    "intents.uxCode.tokenColor1": {
                    "type": "static",
                    "value": "#999"
                    },
                    "intents.uxCode.tokenColor2": {
                    "type": "static",
                    "value": "#905"
                    },
                    "intents.uxCode.tokenColor3": {
                    "type": "static",
                    "value": "#690"
                    },
                    "intents.uxCode.tokenColor4": {
                    "type": "static",
                    "value": "#9a6e3a"
                    },
                    "intents.uxCode.tokenColor5": {
                    "type": "static",
                    "value": "#07a"
                    },
                    "intents.uxCode.tokenColor6": {
                    "type": "static",
                    "value": "#DD4A68"
                    },
                    "intents.uxCode.tokenColor7": {
                    "type": "static",
                    "value": "#e90"
                    },
                    "intents.uxCollapsible.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxCollapsible.content.backgroundColor": {
                    "type": "static",
                    "value": "#f5f5f5"
                    },
                    "intents.uxCollapsible.title.fontSize": {
                    "type": "static",
                    "value": "1.2rem"
                    },
                    "intents.uxCollapsible.title.foregroundColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    },
                    "intents.uxCriteria.body.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxCriteria.description.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxCriteria.indicator.foregroundColor": {
                    "type": "static",
                    "value": "#aab7c2"
                    },
                    "intents.uxCriteria.item.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxCriteria.item.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxCriteriaSuccess.indicator.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxCriteriaSuccess.indicator.borderColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxDatepicker.date.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxDatepicker.dateHovered.backgroundColor": {
                    "type": "static",
                    "value": "#d8efef"
                    },
                    "intents.uxDatepicker.label.lineHeight": {
                    "type": "static",
                    "value": "2"
                    },
                    "intents.uxDropdown.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxDropdown.formControl.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxDropdown.formControlCritical.borderColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxDropdown.indicator.borderColor": {
                    "type": "static",
                    "value": "#f5f7f8"
                    },
                    "intents.uxDropdown.item.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxDropdown.item.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxDropdown.itemHovered.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.uxDropdown.title.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxDropdown.title.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxDropdown.title.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxFileUpload.backgroundColor": {
                    "type": "static",
                    "value": "#f5f5f5"
                    },
                    "intents.uxFileUpload.indicator.foregroundColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxFilters.borderColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxFilters.item.backgroundColor": {
                    "type": "static",
                    "value": "none"
                    },
                    "intents.uxFilters.item.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxFilters.item.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxFilters.itemChosen.backgroundColor": {
                    "type": "static",
                    "value": "#f5f7f8"
                    },
                    "intents.uxFilters.itemChosen.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.uxFilters.itemFocused.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxFilters.itemFocused.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.uxFilters.itemHovered.foregroundColor": {
                    "type": "static",
                    "value": "#09757a"
                    },
                    "intents.uxFilters.title.fontSize": {
                    "type": "static",
                    "value": ".75rem"
                    },
                    "intents.uxFilters.title.fontWeight": {
                    "type": "static",
                    "value": "900"
                    },
                    "intents.uxFilters.title.foregroundColor": {
                    "type": "static",
                    "value": "#767676"
                    },
                    "intents.uxFormElement.indicator.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxFormElement.indicator.foregroundColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxFormElementCritical.foregroundColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxFormElementSuccess.foregroundColor": {
                    "type": "static",
                    "value": "#00a63f"
                    },
                    "intents.uxMessageOverlay.body.borderColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxMessageOverlay.content.lineHeight": {
                    "type": "static",
                    "value": "normal"
                    },
                    "intents.uxModal.backdrop.backgroundColor": {
                    "type": "static",
                    "value": "rgba(245,245,245,0.9)"
                    },
                    "intents.uxPivot.description.fontSize": {
                    "type": "static",
                    "value": "1em"
                    },
                    "intents.uxPivot.description.foregroundColor": {
                    "type": "static",
                    "value": "#444"
                    },
                    "intents.uxPivot.title.fontSize": {
                    "type": "static",
                    "value": "1.423828125rem"
                    },
                    "intents.uxPivotChosen.borderColor": {
                    "type": "static",
                    "value": "#bac0c3"
                    },
                    "intents.uxPivotFocused.borderColor": {
                    "type": "static",
                    "value": "#bac0c3"
                    },
                    "intents.uxPivotHovered.borderColor": {
                    "type": "static",
                    "value": "#bac0c3"
                    },
                    "intents.uxProgressBar.backgroundColor": {
                    "type": "static",
                    "value": "#f4f8fc"
                    },
                    "intents.uxProgressBar.description.fontSize": {
                    "type": "static",
                    "value": "80%"
                    },
                    "intents.uxProgressBar.description.lineHeight": {
                    "type": "static",
                    "value": "normal"
                    },
                    "intents.uxProgressBar.item.fontSize": {
                    "type": "static",
                    "value": ".75rem"
                    },
                    "intents.uxProgressBar.meter.fontWeight": {
                    "type": "static",
                    "value": "700"
                    },
                    "intents.uxProgressBar.meterCritical.backgroundColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxProgressBar.meterCritical.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.uxProgressBar.meterInfo.backgroundColor": {
                    "type": "static",
                    "value": "#744bc4"
                    },
                    "intents.uxProgressBar.meterInfo.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.uxProgressBar.meterSuccess.backgroundColor": {
                    "type": "static",
                    "value": "#00a63f"
                    },
                    "intents.uxProgressBar.meterSuccess.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.uxProgressBar.meterWarning.backgroundColor": {
                    "type": "static",
                    "value": "#fed317"
                    },
                    "intents.uxProgressSteps.item.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxProgressSteps.item.fontSize": {
                    "type": "static",
                    "value": "1.25em"
                    },
                    "intents.uxProgressSteps.itemCompleted.backgroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxProgressSteps.itemCompleted.foregroundColor": {
                    "type": "static",
                    "value": "#fff"
                    },
                    "intents.uxProgressSteps.label.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxProgressSteps.label.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxProgressSteps.label.foregroundColor": {
                    "type": "static",
                    "value": "#aab7c2"
                    },
                    "intents.uxQuantitySelector.fontWeight": {
                    "type": "static",
                    "value": "700"
                    },
                    "intents.uxQuantitySelector.lineHeight": {
                    "type": "static",
                    "value": "normal"
                    },
                    "intents.uxSlider.indicator.backgroundColor": {
                    "type": "static",
                    "value": "#bac0c3"
                    },
                    "intents.uxSlider.item.fontSize": {
                    "type": "static",
                    "value": ".875rem"
                    },
                    "intents.uxSlider.tooltip.backgroundColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    },
                    "intents.uxSlider.tooltip.fontWeight": {
                    "type": "static",
                    "value": "700"
                    },
                    "intents.uxSpinner.backgroundColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxStars.item.foregroundColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxTabs.foregroundColor": {
                    "type": "static",
                    "value": "#111"
                    },
                    "intents.uxTabs.borderColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxTabs.item.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxTabs.item.lineHeight": {
                    "type": "static",
                    "value": "normal"
                    },
                    "intents.uxTabs.itemChosen.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxTabs.itemChosenHovered.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxTabs.itemHovered.foregroundColor": {
                    "type": "static",
                    "value": "#00a4a6"
                    },
                    "intents.uxTag.backgroundColor": {
                    "type": "static",
                    "value": "transparent"
                    },
                    "intents.uxTag.fontSize": {
                    "type": "static",
                    "value": "0.7023319615912209rem"
                    },
                    "intents.uxTagCritical.foregroundColor": {
                    "type": "static",
                    "value": "#600801"
                    },
                    "intents.uxTagHighlight.foregroundColor": {
                    "type": "static",
                    "value": "#004249"
                    },
                    "intents.uxTagInfo.backgroundColor": {
                    "type": "static",
                    "value": "#d8efef"
                    },
                    "intents.uxTagInfo.foregroundColor": {
                    "type": "static",
                    "value": "#004249"
                    },
                    "intents.uxTagNeutral.backgroundColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxTagSuccess.foregroundColor": {
                    "type": "static",
                    "value": "#003a15"
                    },
                    "intents.uxTelephoneInputCritical.borderColor": {
                    "type": "static",
                    "value": "#db1802"
                    },
                    "intents.uxText.caption.fontSize": {
                    "type": "static",
                    "value": ".8rem"
                    },
                    "intents.uxText.title.fontSize": {
                    "type": "static",
                    "value": "1.5rem"
                    },
                    "intents.uxToggle.body.borderColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxToggle.knob.backgroundColor": {
                    "type": "static",
                    "value": "#d6d6d6"
                    },
                    "intents.uxToggle.label.fontWeight": {
                    "type": "static",
                    "value": "500"
                    },
                    "intents.uxTooltip.backgroundColor": {
                    "type": "static",
                    "value": "#2b2b2b"
                    }
                }
                },
                "primitives": {
                "colors": {
                    "product": {
                    "dark": {
                        "color": "#aab7c2",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#bac0c3",
                        "contrast": "#111"
                    },
                    "light": {
                        "color": "#f4f8fc",
                        "contrast": "#111"
                    },
                    "faint": {
                        "color": "#f5f7f8",
                        "contrast": "#111"
                    },
                    "base": {
                        "color": "#d4dbe0",
                        "contrast": "#111"
                    }
                    },
                    "nav": {
                    "dark": {
                        "color": "#6d3209",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#ffcca9",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#fde9db",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#c4580c",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#ef6c0f",
                        "contrast": "#111"
                    }
                    },
                    "natural": {
                    "dark": {
                        "color": "#4f271c",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#fed9b4",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#fff1e1",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#a05932",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#bd8150",
                        "contrast": "#111"
                    }
                    },
                    "black": {
                    "dark": {
                        "color": "#000",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#111",
                        "contrast": "#fff"
                    }
                    },
                    "danger": {
                    "dark": {
                        "color": "#600801",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#ffbbbb",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#fadcd9",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#ae1302",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#db1802",
                        "contrast": "#fff"
                    }
                    },
                    "secondary": {
                    "dark": {
                        "color": "#0b3354",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#a9edff",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#ddeaf8",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#145fa9",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#1976d2",
                        "contrast": "#fff"
                    }
                    },
                    "gray": {
                    "dark": {
                        "color": "#2b2b2b",
                        "contrast": "#fff"
                    },
                    "midrange": {
                        "color": "#444",
                        "contrast": "#fff"
                    },
                    "light": {
                        "color": "#d6d6d6",
                        "contrast": "#111"
                    },
                    "faint": {
                        "color": "#f5f5f5",
                        "contrast": "#111"
                    },
                    "base": {
                        "color": "#767676",
                        "contrast": "#fff"
                    }
                    },
                    "public": false,
                    "white": {
                    "base": {
                        "color": "#fff",
                        "contrast": "#111"
                    }
                    },
                    "feature": {
                    "dark": {
                        "color": "#5b003b",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#ffb3e6",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#fbd9ed",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#b4006c",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#e20087",
                        "contrast": "#fff"
                    }
                    },
                    "primary-o": {
                    "dark": {
                        "color": "#004249",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#a6fff8",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#d8efef",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#09757a",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#00a4a6",
                        "contrast": "#fff"
                    }
                    },
                    "success": {
                    "dark": {
                        "color": "#003a15",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#9fffb8",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#d9f2e2",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#00782e",
                        "contrast": "#111"
                    },
                    "base": {
                        "color": "#00a63f",
                        "contrast": "#fff"
                    }
                    },
                    "warning": {
                    "dark": {
                        "color": "#aa6d00",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#ffeea9",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#fffae3",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#eab303",
                        "contrast": "#111"
                    },
                    "base": {
                        "color": "#fed317",
                        "contrast": "#111"
                    }
                    },
                    "secondary-o": {
                    "dark": {
                        "color": "#0b3354",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#a9edff",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#ddeaf8",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#145fa9",
                        "contrast": "#111"
                    },
                    "base": {
                        "color": "#1976d2",
                        "contrast": "#111"
                    }
                    },
                    "primary": {
                    "dark": {
                        "color": "#004249",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#a6fff8",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#d8efef",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#09757a",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#00a4a6",
                        "contrast": "#fff"
                    }
                    },
                    "info": {
                    "dark": {
                        "color": "#2f1c4c",
                        "contrast": "#fff"
                    },
                    "highlight": {
                        "color": "#d3c1f7",
                        "contrast": "#111"
                    },
                    "pastel": {
                        "color": "#e9e4f2",
                        "contrast": "#111"
                    },
                    "midrange": {
                        "color": "#613ea3",
                        "contrast": "#fff"
                    },
                    "base": {
                        "color": "#744bc4",
                        "contrast": "#fff"
                    }
                    }
                }
                }
            } `;
                  parent.postMessage({ pluginMessage: { type: 'create-styles', themeData } }, '*');
    }

    onClearStyles = () => {
        parent.postMessage({ pluginMessage: { type: 'delete-all-styles' } }, '*');
    }

    componentDidMount() {
        const self = this;

        fetch('http://localhost:8080/https://theme-api.uxp.godaddy.com/v1/themes') // TODO: Remove the need for this cors proxy!
            .then(response => response.json())
            .then(themes => {
                self.setState({
                    loaded: true,
                    themes: themes.themes
                });

                const currentID = currentThemeId;

                if (currentThemeId && themes.filter(theme => theme.id === currentID).length > 0) {
                    self.themeSelect.value = currentThemeId;
                }
            });
    }

    render() {
        let content = <p className='loading'>Loading...</p>;

        // @ts-ignore
        if (this.state.loaded) {
            content = <div>
                <p>Pick a theme to import:</p>
                <select name='theme' id='theme' ref={ this.themeSelectRef }>
                    {
                        // @ts-ignore
                        this.state.themes.map((value, index) => <option key={ index } value={ value.id }>{ value.alias }</option>)
                    }
                </select>
                <div className='button-container'>
                    <a href='https://themes.pts.godaddy.com/' target='_blank' className='link-button secondary' style={{marginLeft: '0'}}>Manage Themes</a>
                    <button id="clear" onClick={this.onClearStyles} className='secondary'>Clear Theme Styles</button>
                    <button id="create" onClick={this.onCreate} className='primary'>Select Theme</button>
                </div>

                <p style={{ marginTop: '25px', fontSize: '12px'}}><b>Note:</b> What to do if you don't see your theme here, or if a color is wrong? Just hit the "Manage Themes" link and you'll be able to correct it. Logging in with Okta required.</p>
            </div>;
        }

        return <div className='main'>
            { content }
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
