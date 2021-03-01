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

export async function loadTheme(themeData) {
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

    for (const colorIntent of themeData.intents.color) {
        if (!styleMap[colorIntent.name]) {
            const colorStyle = figma.createPaintStyle();
            colorStyle.name = colorIntent.name;
            colorStyle.paints = [];

            styleMap[colorIntent.name] = colorStyle;
        }

        styleMap[colorIntent.name].paints = getColorArray(colorIntent);
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
