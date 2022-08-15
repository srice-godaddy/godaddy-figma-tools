import { mapLocalIntent } from './local-intents';

export async function aliasStyles(isFinal = true) {
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

    // Styles loaded - now time to apply the intents
    const aliasKeys = Object.keys(aliasMap);
    for (var i=0; i<aliasKeys.length; i++){
        const alias = aliasMap[aliasKeys[i]];
        const styleJSON = alias.description.match(/{({.*})}/);
        if (styleJSON){
            const styleData = JSON.parse(styleJSON[1]);

            if (!intentMap[styleData.aliasIntent]){
                // If not a known intent, check if it's an unused local intent and remap it
                styleData.aliasIntent = mapLocalIntent(styleData.aliasIntent);
            }
            if (intentMap[styleData.aliasIntent]){
                //If we've got an alias the resolves to something
                
                //IF is Color Style
                if (alias.type == 'PAINT'){
                    alias.paints = intentMap[styleData.aliasIntent].paints;
                } else if (alias.type == 'TEXT'){
                    if(!styleData.overrideFontWeight){
                        try{
                            await figma.loadFontAsync({
                                family: intentMap[styleData.aliasIntent].fontName.family,
                                style: intentMap[styleData.aliasIntent].fontName.style
                            });
                        } catch (e){
                            console.log(e);
                        }
                        alias.fontName = <FontName>({
                            family: intentMap[styleData.aliasIntent].fontName.family,
                            style: intentMap[styleData.aliasIntent].fontName.style
                        });
                    } else {
                        try {
                            await figma.loadFontAsync({
                                family: intentMap[styleData.aliasIntent].fontName.family,
                                style: alias.fontName.style
                            });
                        } catch (e){
                            console.log(e);
                        }
                        alias.fontName = <FontName>({
                            family: intentMap[styleData.aliasIntent].fontName.family,
                            style: alias.fontName.style
                        });
                    }
                    if (!styleData.overrideFontSize){
                        alias.fontSize = intentMap[styleData.aliasIntent].fontSize;
                    }
                    if (!styleData.overrideTextCase){
                        alias.textCase = intentMap[styleData.aliasIntent].textCase;
                    }
                    if (!styleData.overrideTextDecoration){
                        alias.textDecoration = intentMap[styleData.aliasIntent].textDecoration;
                    }
                    if (!styleData.overrideLetterSpacing){
                        alias.letterSpacing = intentMap[styleData.aliasIntent].letterSpacing;
                    }
                    if (!styleData.overrideLineHeight){
                        alias.lineHeight = intentMap[styleData.aliasIntent].lineHeight;
                    }
                    if (!styleData.overrideTextCase){
                        alias.textCase = intentMap[styleData.aliasIntent].textCase;
                    }
                    if (!styleData.overrideParagraphSpacing){
                        alias.paragraphSpacing = intentMap[styleData.aliasIntent].paragraphSpacing;
                    }
                    if (!styleData.overrideParagraphIndent){
                        alias.paragraphIndent = intentMap[styleData.aliasIntent].paragraphIndent;
                    }
                }
            }
        }
    }
    if (isFinal){
        figma.closePlugin();
    } else {
        return true;
    }
}