export function loadDocIntents() {
    const paintStyles = figma.getLocalPaintStyles();
    const textStyles = figma.getLocalTextStyles();
    const intentMap = {};
    const aliasMap = {};
    // Load the styles
    for (const paintStyle of paintStyles) {
        const styleJSON = paintStyle.description.match(/{({.*})}/);
        if (styleJSON){
            const styleData = JSON.parse(styleJSON[1])
            if(styleData){
                if (styleData.intentName){
                    intentMap[styleData.intentName] = paintStyle;
                } else if (styleData.aliasIntent) {
                    aliasMap[paintStyle.id] = paintStyle;
                }
            }
        }
    }
    
    for (const textStyle of textStyles) {
        const styleJSON = textStyle.description.match(/{({.*})}/);
        if (styleJSON){
            const styleData = JSON.parse(styleJSON[1]);
            if(styleData){
                if (styleData.intentName){
                    intentMap[styleData.intentName] = textStyle;
                } else if (styleData.aliasIntent) {
                    aliasMap[textStyle.id] = textStyle;                    
                }
            }
        }
    }
    return {
        intents: intentMap,
        aliases: aliasMap
    };
}