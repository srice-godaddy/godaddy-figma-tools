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
      b: parseInt(result[3], 16/255)
    } : null;
}

function transformThemeJson (themeData){
    const intents = {
        color: [],
        text: [],
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
        
        if (thisIntent.value.indexOf("#") > 0 || thisIntent.value.indexOf("transparent") > 0){
            // We've found a color!
            thisStyle.type = "color";
            thisStyle.value = <SolidPaint>({
                    type: 'SOLID',
                    color: <RGB>(hexToRgb(thisIntent.value)),
                    // opacity: color.alpha / 255 // Not dealing with opacity yet
                })
        } // Not handling non-colors yet!

        // Create our friendly name
        function upperCase ( p1 ){ // This might need to be (match, p1, offset, string) or some variant of that.
            return p1.toUpperCase;
        }
        thisStyle.friendlyName = intentKeys[key].replace(/\./g, "/").replace("Color","").replace("intents.ux.","").replace(/([A-Z])/g, upperCase);

        if (thisStyle.type == "color") {
            intents.color.push(thisIntent);
        } // Not handling "else!""
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
            colorStyle.paints = colorIntent.value;

            styleMap[colorIntent.name] = colorStyle;
        }

        //styleMap[colorIntent.name].paints = getColorArray(colorIntent);
        styleUsed[colorIntent.name] = 1;
    }

    for (const textIntent of themeData.intents.text) {
        if (!styleMap[textIntent.name]) {
            const textStyle = figma.createTextStyle();
            textStyle.name = textIntent.name;

            styleMap[textStyle.name] = textStyle;
        }

        const fontStyle = getFontType(textIntent.weight);
        await figma.loadFontAsync({ family: textIntent.font, style: fontStyle });

        styleMap[textIntent.name].fontName = <FontName>({
            family: textIntent.font,
            style: fontStyle
        });
        styleMap[textIntent.name].fontSize = textIntent.size;
        styleMap[textIntent.name].lineHeight = <LineHeight>({
            value: textIntent.lineHeight * 100,
            unit: 'PERCENT'
        });
        styleUsed[textIntent.name] = 1;
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
