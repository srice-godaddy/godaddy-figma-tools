export async function aliasStyles() {
    const paintStyles = figma.getLocalPaintStyles();
    const textStyles = figma.getLocalTextStyles();
    const intentMap = {};
    const aliasMap = [];
    // Set up a page to display our intent values
    const thisDocument = figma.root;

    // Load the styles
    for (const paintStyle of paintStyles) {
        
        const styleData = JSON.parse(paintStyle.description.match(/{{.*}}/)[0])

        if (styleData.intentName){
            intentMap[styleData.intentName] = paintStyle;
        } else if (styleData.aliasIntent) {
            aliasMap.push(paintStyle);
        }
    }
    for (const textStyle of textStyles) {
        
        const styleData = JSON.parse(textStyle.description.match(/{{.*}}/)[0])

        if (styleData.intentName){
            intentMap[styleData.intentName] = textStyle;
        } else if (styleData.aliasIntent) {
            aliasMap.push(textStyle);
        }
    }

    for (var i=0;i++;i<aliasMap.length){
        const styleData = JSON.parse(aliasMap[i].description.match(/{{.*}}/)[0]);

        //IF is Color Style
        //apply color style stuff

        //If is Text Style
        //apply text style stuff, skipping overrides (typically for weight)

    }


}
