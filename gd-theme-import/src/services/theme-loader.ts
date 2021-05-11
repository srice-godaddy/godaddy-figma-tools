function getColorArray(color) {
    if (color.alpha === 0) {
        return [];
    }

    return [
        <SolidPaint>({
            type: 'SOLID',
            color: <RGB>({
                r: color.red / 255,
                g: color.green / 255,
                b: color.blue / 255
            }),
            opacity: color.alpha / 255
        })
    ];
}

function getFontType(weight) {
    const weights = {
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
  
    var result = /^rgba\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3}),([0-9\.]*)\)$/i.exec(rgba);
    return result ? {
      r: parseInt(result[1])/255,
      g: parseInt(result[2])/255,
      b: parseInt(result[3])/255,
      a: parseFloat(result[4])
    } : null;
}

// Create our friendly name
function friendlyName(name){
    function upperCase ( p1 ){ // This might need to be (match, p1, offset, string) or some variant of that.
        return p1.toUpperCase();
    }
    return "Intents/" + name.replace(/intents\.ux\.?/,'') // Trim off the beginning bits
    .replace(/\./g, "/") // Dots to slashes
    .replace(/font.*$|lineHeight$/,'') // Type styles
    .replace('Color','') // Color is redundant on color attributes in Figma
    .replace(/([A-Z])/g, ' $1') // Add a space before capital letters
    .replace(/\/([a-z])|^([a-z])/g, upperCase) // Convert from pascalCase to Title Case
    .replace(/ (Chosen|Focused|Hovered|Primary|Secondary|Tertiary|High Contrast|Highlight|Completed|Low Contrast|Info|Internal|Neutral|Passive|Success|Warning|Critical)/g, '/$1') // Add a / before state modifiers
    .replace(/Text (Action|Caption|Heading|Input|Label|Paragraph|Title)/g, '$1') // Put text styles in a directory
    .replace(/^ /,'');
}

function transformThemeJson (themeData){
    const intents = {
        color: [],
        text: {},
    }
    const theme = JSON.parse(themeData);
    const intentKeys = Object.keys(theme.root.values);
    for (const key in intentKeys) {
        const thisIntent = theme.root.values[intentKeys[key]];
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
                        size: 16,
                        weight: 400,
                        lineHeight: null,
                        font: 'GD Sherpa',
                    },
                };
            }

            switch (thisTypeAttr) {

                case "fontFamily":
                    intents.text[thisStyle.name].value.font = thisIntent.value[0].replace(/\'/g, '');

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
        }
    }
    return intents;

}

export async function loadTheme(themeData) {
    const intents = transformThemeJson(themeData);
    const paintStyles = figma.getLocalPaintStyles();
    const textStyles = figma.getLocalTextStyles();
    const styleMap = {};
    const styleUsed = {};

    for (const paintStyle of paintStyles) {
        styleMap[paintStyle.name] = paintStyle;
    }

    for (const textStyle of textStyles) {
        styleMap[textStyle.name] = textStyle;
    }

    for (const colorIntent of intents.color) {
        if (!styleMap[colorIntent.name]) {
            const colorStyle = figma.createPaintStyle();
            colorStyle.name = colorIntent.friendlyName;
            colorStyle.description = colorIntent.name;
            colorStyle.paints = [colorIntent.value]; // Currently only supports a single value here, so no multi-color intents yet

            styleMap[colorIntent.name] = colorStyle;
        }
        styleUsed[colorIntent.name] = 1;
    }

    const textKeys = Object.keys(intents.text);

    for (var i=0; i<textKeys.length; i++) {
        const textIntent = intents.text[textKeys[i]];
        if (!styleMap[textIntent.friendlyName]) {
            const textStyle = figma.createTextStyle();
            textStyle.name = textIntent.friendlyName;
            textStyle.description = textIntent.name;

            styleMap[textStyle.name] = textStyle;
        }

        const fontStyle = getFontType(textIntent.value.weight);
        await figma.loadFontAsync({ family: textIntent.value.font, style: fontStyle });

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
        styleUsed[textIntent.friendlyName] = 1;
    }

    for (const paintStyle of paintStyles) {
        if (styleUsed[paintStyle.name]) {
            continue;
        }

        paintStyle.remove();
    }

    for (const textStyle of textStyles) {
        if (styleUsed[textStyle.name]) {
            continue;
        }

        textStyle.remove();
    }
}

export function deleteAllStyles() {
    const paintStyles = figma.getLocalPaintStyles();

    for (const style of paintStyles) {
        style.remove();
    }

    const textStyles = figma.getLocalTextStyles();

    for (const style of textStyles) {
        style.remove();
    }
}
