function getFontType(weight) {
    const weights = {
        100: 'Thin',
        300: 'Light',
        400: 'Regular',
        500: 'Medium',
        600: 'Semibold',
        700: 'Bold'
        
    };    
    return weights[weight] ? weights[weight] : 'Regular';
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16)/255,
      g: parseInt(result[2], 16)/255,
      b: parseInt(result[3], 16)/255
    } : null;
}

function rgbaToFigma(rgba) {
  
    var result = /^rgba\(([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\)$/i.exec(rgba);
    return result ? {
      r: parseInt(result[1])/255,
      g: parseInt(result[2])/255,
      b: parseInt(result[3])/255,
      a: parseFloat(result[4])
    } : null;
}

function textColor (color){
    const myColor = color.color;
    if (color.opacity != null) {
        myColor.opacity = color.opacity; 
    } else {
        myColor.opacity = 1;
    }
    /*return (((myColor.r*255*299)+(myColor.g*255*587)+(myColor.b*255*114))/1000 >= 128 || myColor.opacity < 0.5)? [<SolidPaint>({
        type: 'SOLID',
        color: <RGB>({
            r: 0,
            g: 0,
            b: 0
        }) 
    })]: [<SolidPaint>({
        type: 'SOLID',
        color: <RGB>({
            r: 1,
            g: 1,
            b: 1
        }) 
    })];*/
    return [<SolidPaint>({
        type: 'SOLID',
        color: <RGB>({
            r: 0,
            g: 0,
            b: 0
        }) 
    })];
}


function upperCase ( p1 ){ // This might need to be (match, p1, offset, string) or some variant of that.
    return p1.toUpperCase();
}

function friendlyName(name){   
    // Create our friendly name

    return name.replace(/intents\.ux\./,'Global Intents/')
    .replace(/intents/,'Local Intents')
    .replace(/\./g, "/") // Dots to slashes
    .replace(/font.*$|lineHeight$/,'') // Type styles
    .replace(/([A-Z])(?!olor)/g, ' $1') // Add a space before capital letters (unless Color)
    .replace(/\/([a-z]*) /, '/$1/') // convert namespace to a directory for local intents
    .replace(/\/([a-tv-z])|^([a-tv-z])|\/(u)(?!x)|^(u)(?!x)/g, upperCase) // Convert from pascalCase to Title Case
    .replace(/ (Chosen|Focused|Hovered|Pressed|Dragged|Primary|Secondary|Tertiary|High Contrast|Highlight|Completed|Low Contrast|Info|Internal|Neutral|Passive|Success|Warning|Critical|Premium)/g, '/$1') // Add a / before state modifiers
    .replace(/Action\/Control/, 'ActionControl') //Put actionControl back together because it's its own thing.
    .replace(/Text\/(Action|Caption|Heading|Input|Label|Paragraph|Title)/g, '$1') // Put text styles in a directory
    .replace(/^ /,'');
}

function oldFriendlyName(name){
    //OLD version - for upgrading
    return name.replace(/intents\.ux\./,'Intents_ux/')
    .replace(/intents/,'Intents (component)')
    .replace(/\./g, "/") // Dots to slashes
    .replace(/_/g, ".") // Underscore back to dot (intents.ux)
    .replace(/font.*$|lineHeight$/,'') // Type styles
    .replace(/([A-Z])(?!olor)/g, ' $1') // Add a space before capital letters (unless Color)
    .replace('ux ','ux') // remove spaces after lowercase 'ux'
    .replace(/\/([a-tv-z])|^([a-tv-z])|\/(u)(?!x)|^(u)(?!x)/g, upperCase) // Convert from pascalCase to Title Case
    .replace(/ (Chosen|Focused|Hovered|Primary|Secondary|Tertiary|High Contrast|Highlight|Completed|Low Contrast|Info|Internal|Neutral|Passive|Success|Warning|Critical)/g, '/$1') // Add a / before state modifiers
    .replace(/Text (Action|Caption|Heading|Input|Label|Paragraph|Title)/g, '$1') // Put text styles in a directory
    .replace(/^ /,'');
}


function transformThemeJson (themeData){
    const intents = {
        color: [],
        text: {},
    }

    const intentKeys = Object.keys(themeData.themes[0].data.root.values);
    for (const key in intentKeys) {
        const thisIntent = themeData.themes[0].data.root.values[intentKeys[key]];
        const thisStyle = {
            name: intentKeys[key],
            type: null,
            friendlyName: null,
            value: null,
        }
        
        if (thisIntent.value.indexOf('#') >= 0) { // Colors with hex values
            // We've found a color!
            thisStyle.type = 'color';
            thisStyle.value = <SolidPaint>({
                    type: 'SOLID',
                    color: <RGB>(hexToRgb(thisIntent.value)),
                });
            thisStyle.friendlyName = friendlyName(thisStyle.name);
            intents.color.push(thisStyle);
        } else if (thisIntent.value.indexOf('rgba') >= 0) { // Colors with opacity values
            const rgba = rgbaToFigma(thisIntent.value);
            thisStyle.type = 'color';
            thisStyle.value = <SolidPaint>({
                type: 'SOLID',
                color: <RGB>({
                    r: rgba.r,
                    g: rgba.g,
                    b: rgba.b
                }),
                opacity: rgba.a,
            });
            thisStyle.friendlyName = friendlyName(thisStyle.name);
            intents.color.push(thisStyle);
         } else if (thisIntent.value.indexOf('transparent') >= 0) { // Transparent colors
            thisStyle.type = 'color';
            thisStyle.value = <SolidPaint>({
                type: 'SOLID',
                color: <RGB>({
                    r: 0,
                    g: 0,
                    b: 0
                }),
                opacity: 0,
            });
            thisStyle.friendlyName = friendlyName(thisStyle.name);
            intents.color.push(thisStyle);
        } else if (thisStyle.name.indexOf("font") >= 0 || thisStyle.name.indexOf('lineHeight') >= 0 ) { // Handle text tokens (bit by bit)
            const thisTypeAttr = thisStyle.name.replace(/^.*(font.*|lineHeight)/,'$1');
            thisStyle.name = thisStyle.name.replace(/(\.font.*|\.lineHeight)/,'');
            if (typeof(intents.text[thisStyle.name])==='undefined'){
                intents.text[thisStyle.name] = {
                    name: thisStyle.name,
                    friendlyName: friendlyName(thisStyle.name),
                    value: { // Set defaults in case they're not set elsewhere
                        size: 16, //We can't default this either... need to set to zero and then scan through and assign to ux.text's value
                        weight: 400, //We can't default this. Need to set to zero and then scan through and assign to ux.text's value.
                        lineHeight: null,
                        font: 'GD Sherpa',
                    },
                };
            }

            switch (thisTypeAttr) {

                case "fontFamily":
                    intents.text[thisStyle.name].value.font = thisIntent.value[0].replace(/\"/g, '');

                    // Fix for proper font names
                    if (intents.text[thisStyle.name].value.font == "gdsherpa") {
                        intents.text[thisStyle.name].value.font = "GD Sherpa";
                    } else if (intents.text[thisStyle.name].value.font == "gd-sage") {
                        intents.text[thisStyle.name].value.font = "GD Sage";
                    }
                    
                    break;
                case "fontSize":
                    if (thisIntent.value.indexOf("px") >=0 ) {
                        intents.text[thisStyle.name].value.size = parseFloat(thisIntent.value.replace('px', ''));
                    } else if (thisIntent.value.indexOf("%") >=0) {
                        intents.text[thisStyle.name].value.size = (parseFloat(thisIntent.value.replace(/%/, '')) / 100) * 16;
                    }

                    else {
                        intents.text[thisStyle.name].value.size = parseFloat(thisIntent.value.replace(/r?em/, '')) * 16; // Assumes Rem's and Ems are 16-px based.
                    }
                    break;
                case "fontWeight":
                    intents.text[thisStyle.name].value.weight = thisIntent.value;
                    break;
                case "lineHeight":
                    intents.text[thisStyle.name].value.lineHeight = (intents.text[thisStyle.name].value.lineHeight=="normal")? null : parseFloat(thisIntent.value);
                    break;
                default:
                    break;
            }
        } else {
            console.log("Unknown Intent: "+thisStyle.name);
        }
    }
    // Process through font sizes

    const textMultiplier = 1.125;
    const textKeys = Object.keys(intents.text);
    const maxPositive = 6;
    const maxNegative = 2;
    for (let key = 0; key < textKeys.length; key++)
    {
        let thisIntent = intents.text[textKeys[key]];
        
        if (thisIntent.name.indexOf("intents.ux.") >=0) // If this is non-component default text style
        {

            for (let i=0;i<=maxPositive;i++){
                intents.text[thisIntent.name+(i)] = {
                    name: thisIntent.name+i,
                    friendlyName: thisIntent.friendlyName + "/" + i,
                    value: { 
                        font: thisIntent.value.font,
                        weight: thisIntent.value.weight,
                        size: i > 0 ? intents.text[thisIntent.name+(i-1)].value.size * textMultiplier : thisIntent.value.size,
                        lineHeight: thisIntent.value.lineHeight,
                    }
                }
            }
            for (let i = -1 ; i >= 0 - maxNegative ; i--){
                intents.text[thisIntent.name+i] = {
                    name: thisIntent.name+(i),
                    friendlyName: thisIntent.friendlyName + "/" + i,
                    value: {
                        font: thisIntent.value.font,
                        weight: thisIntent.value.weight,
                        size: intents.text[thisIntent.name+(i+1)].value.size / textMultiplier,
                        lineHeight: thisIntent.value.lineHeight,
                    }
                }
            }
        }
    }
    return intents;

}

function createFramesForThemes(themeArray, parent){
    let newFrame = parent.findChildren((e)=> {return e.name == themeArray[0] })[0]
    if (!newFrame){
        newFrame = figma.createFrame();
        newFrame.name = themeArray[0];
        newFrame.paddingLeft = 64;
        newFrame.paddingRight = 0;
        newFrame.paddingTop = 0;
        newFrame.paddingBottom =0;
        newFrame.primaryAxisSizingMode = "AUTO";
        newFrame.counterAxisSizingMode = "AUTO";
        newFrame.counterAxisAlignItems = "MIN";
        newFrame.layoutMode = "VERTICAL";
        newFrame.itemSpacing = 8;
        parent.appendChild(newFrame);
    }
    themeArray.shift();
    if (themeArray.length > 0) {
        return createFramesForThemes(themeArray, newFrame);
    } else {
        return newFrame;
    }
}

export async function loadTheme(themeData) {
    const intents = transformThemeJson(themeData);
    const paintStyles = figma.getLocalPaintStyles();
    const textStyles = figma.getLocalTextStyles();
    const styleMap = {};
    const styleUsed = {};

    // Set up a page to display our intent values
    const thisDocument = figma.root;
    const intentsPages = thisDocument.findChildren( (e)=> {return e.name == "Theme" });
    let intentsPage;
    if (intentsPages.length == 1) {
        intentsPage = intentsPages[0];
    } else if (intentsPages.length == 0){
        intentsPage = figma.createPage();
        intentsPage.name = "Theme";
    } else {
        figma.notify("Multiple Theme Pages Detected. Using first one.")
        intentsPage = intentsPages[0];
    }
    figma.currentPage = intentsPage;

    // Set up our intents frame and text and color frames if they don't exist
    if (intentsPage.findChildren((e)=> {return e.name == "Theme" }).length == 0){
        const newFrame = figma.createFrame();
        newFrame.name = "Theme";
        newFrame.itemSpacing = 40;
        newFrame.layoutMode = "VERTICAL";
        newFrame.layoutGrow = 1;
        newFrame.primaryAxisSizingMode = "AUTO"; 
        newFrame.counterAxisSizingMode = "AUTO";
        intentsPage.appendChild(newFrame);
    }
    const intentsFrame = intentsPage.findChildren((e)=> {return e.name == "Theme" })[0];

    if (intentsFrame.findChildren((e)=> {return e.name == "Color Intents" }).length == 0){
        const newFrame = figma.createFrame();
        newFrame.name = "Color Intents";
        newFrame.itemSpacing = 24;
        newFrame.layoutMode = "HORIZONTAL";
        newFrame.primaryAxisSizingMode = "AUTO"; 
        newFrame.counterAxisSizingMode = "AUTO";
        newFrame.paddingTop = 64;
        newFrame.paddingRight = 64;
        newFrame.paddingBottom = 64;
        intentsFrame.appendChild(newFrame);
    }
    if (intentsFrame.findChildren((e)=> {return e.name == "Text Intents" }).length == 0){
        const newFrame = figma.createFrame();
        newFrame.name = "Text Intents";
        newFrame.itemSpacing = 24;
        newFrame.layoutMode = "HORIZONTAL";
        newFrame.primaryAxisSizingMode = "AUTO"; 
        newFrame.counterAxisSizingMode = "AUTO"; 
        newFrame.paddingTop = 64;
        newFrame.paddingRight = 64;
        newFrame.paddingBottom = 64;
        intentsFrame.appendChild(newFrame);
    }

    const textIntentsFrame = intentsFrame.findChildren((e)=> {return e.name == "Text Intents" })[0];
    const colorIntentsFrame = intentsFrame.findChildren((e)=> {return e.name == "Color Intents" })[0];

    for (const paintStyle of paintStyles) {
        styleMap[paintStyle.name] = paintStyle;
        
        // Handle Aliases: Description = only the intent name currently
        /*if (typeof(intents.color[paintStyle.description])!=='undefined')
        {
            paintStyle.paints = [intents.color[paintStyle.description].colorIntent.value];
        }*/
    }

    for (const textStyle of textStyles) {
        styleMap[textStyle.name] = textStyle;
/*
        // Handle Aliases: Description = only the intent name currently
        if (typeof(intents.text[textStyle.description])!=='undefined')
        {
            const fontStyle = getFontType(intents.text[textStyle.description].value.weight);
            await figma.loadFontAsync({ family: intents.text[textStyle.description].value.font, style: fontStyle });

            textStyle.fontName = <FontName>({
                family: intents.text[textStyle.description].value.font,
                style: fontStyle
            });
           textStyle.fontSize = intents.text[textStyle.description].value.size;
            if (intents.text[textStyle.description].value.lineHeight){
                styleMap[intents.text[textStyle.description].friendlyName].lineHeight = <LineHeight>({
                    value: intents.text[textStyle.description].value.lineHeight * 100,
                    unit: 'PERCENT'
                });       
            }
        }*/
    }

    for (const colorIntent of intents.color) {
        
        let framesArray = colorIntent.friendlyName.split('/');
        framesArray.shift();
        const styleFrame = createFramesForThemes(framesArray,colorIntentsFrame);
        styleFrame.counterAxisAlignItems = "CENTER";
        styleFrame.primaryAxisSizingMode = "AUTO";
        styleFrame.counterAxisSizingMode = "AUTO";
        styleFrame.layoutMode = "HORIZONTAL";
        styleFrame.itemSpacing = 8;

        let colorFrame = styleFrame.findChild((e) => {return e.name == "Intent Style"});
        if (!colorFrame) {
            colorFrame = figma.createFrame();
            colorFrame.name="Intent Style";
            colorFrame.resize(64,64);
            colorFrame.cornerRadius = 32;
            styleFrame.appendChild(colorFrame);
        }

        

        // Handle Name Upgrades

        if (styleMap[oldFriendlyName(colorIntent.name)]){
            styleMap[oldFriendlyName(colorIntent.name)].name = colorIntent.friendlyName;
            styleMap[colorIntent.friendlyName] = styleMap[oldFriendlyName(colorIntent.name)];
        }

        if (styleMap[colorIntent.friendlyName]){
            //If we've got an existing intent, let's just make sure it maps
            styleMap[colorIntent.friendlyName].paints = [colorIntent.value];
            
            colorFrame.fillStyleId = styleMap[colorIntent.friendlyName].id;

        } else {
            //If we've got a new intent:
            const colorStyle = figma.createPaintStyle();
            colorStyle.name = colorIntent.friendlyName;
            colorStyle.description = colorIntent.name;
            colorStyle.paints = [colorIntent.value]; // Currently only supports a single value here, so no multi-color intents yet
            styleMap[colorIntent.friendlyName] = colorStyle;
            //styleFrame.fillStyleId = colorStyle.id;
            colorFrame.fillStyleId = colorStyle.id;
        }
        

        // Add intent name (engineers)
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        
        let textFrame = styleFrame.findChild((e) => {return e.name == "Intent Names"});
        if(!textFrame){
            textFrame = figma.createFrame();
            textFrame.counterAxisAlignItems = "MIN";
            textFrame.primaryAxisSizingMode= "AUTO";
            textFrame.counterAxisSizingMode= "AUTO";
            textFrame.layoutMode = "VERTICAL";
            textFrame.itemSpacing = 8;
            textFrame.name = "Intent Names";
            styleFrame.appendChild(textFrame);
        }

        let textLabel = textFrame.findChild((e) => {return e.name == "Intent Name"});
        if (!textLabel){
            textLabel = figma.createText();
            textLabel.fontName = { family: "Roboto", style: "Regular" };
            textLabel.name = "Intent Name";
            textFrame.appendChild(textLabel);
        }
        textLabel.characters = colorIntent.name;
        textLabel.fills = textColor(colorIntent.value);
        
        // Add intent name (designers)
        textLabel = textFrame.findChild((e) => {return e.name == "Friendly Name"});
        if (!textLabel){
            textLabel = figma.createText();
            textLabel.fontName = { family: "Roboto", style: "Regular" };
            textLabel.characters = colorIntent.friendlyName;
            textLabel.name = "Friendly Name";
            textFrame.appendChild(textLabel);
        }
        textLabel.fills = textColor(colorIntent.value);

        styleUsed[colorIntent.friendlyName] = 1;
    }

    const textKeys = Object.keys(intents.text);

    for (var i=0; i<textKeys.length; i++) {
        const textIntent = intents.text[textKeys[i]];
        const fontStyle = getFontType(textIntent.value.weight);
        try {
            await figma.loadFontAsync({ family: textIntent.value.font, style: fontStyle });
            await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // Load Figma's default font as a backup
            
            //Upgrade layer
            if (styleMap[oldFriendlyName(textIntent.name)]){
                styleMap[oldFriendlyName(textIntent.name)].name = textIntent.friendlyName;
                styleMap[textIntent.friendlyName] = styleMap[oldFriendlyName(textIntent.name)];
            }
            
            if (!styleMap[textIntent.friendlyName]) {
                const textStyle = figma.createTextStyle();
                textStyle.name = textIntent.friendlyName;
                textStyle.description = textIntent.name;
    
                styleMap[textIntent.friendlyName] = textStyle;
                styleMap[textIntent.friendlyName].fontName = <FontName>({
                    family: textIntent.value.font,
                    style: fontStyle
                });
                styleMap[textIntent.friendlyName].fontSize = textIntent.value.size;
                if (textIntent.value.lineHeight){
                    styleMap[textIntent.friendlyName].lineHeight = <LineHeight>({
                        value: textIntent.value.lineHeight * 100,
                        unit: 'PERCENT'
                    });       
                }
                //styleMap[textStyle.name].id = textStyle.id;
            }
            let framesArray = textIntent.friendlyName.split('/');
            framesArray.shift();
            const styleFrame = createFramesForThemes(framesArray,textIntentsFrame);
            styleFrame.itemSpacing = 8;

            // Add intent name (engineers)
            let textLabel = styleFrame.findChild((e) => {return e.name == "Intent Name"});
            if (!textLabel){
                textLabel = figma.createText();
                textLabel.name = "Intent Name";
                styleFrame.appendChild(textLabel);
            }
            textLabel.characters = textIntent.name;
            textLabel.textStyleId = styleMap[textIntent.friendlyName].id;
            
            // Add intent name (designers)
            textLabel = styleFrame.findChild((e) => {return e.name == "Friendly Name"});
            if (!textLabel){
                textLabel = figma.createText();
                textLabel.name = "Friendly Name";
                styleFrame.appendChild(textLabel);
            }
            textLabel.characters = textIntent.friendlyName;
            textLabel.textStyleId = styleMap[textIntent.friendlyName].id;
            
            styleUsed[textIntent.friendlyName] = 1;
        } catch (e) {
            console.log(e);
        }
        
    }

    // Clean up styles. Remove non-intents styles
    for (const paintStyle of paintStyles) {
        if (paintStyle.name.indexOf("Intents") < 0 || styleUsed[paintStyle.name]) {
            continue;
        }

        paintStyle.remove();
    }

    for (const textStyle of textStyles) {
        if (textStyle.name.indexOf("Intents") < 0 || styleUsed[textStyle.name]) {
            continue;
        }

        textStyle.remove();
    }
}
