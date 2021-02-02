export default function getSortedTextStyles(node: TextNode, textStyles: TextStyle[]) {
    const fontSize = node.fontSize;
    const isNumericFontSize = typeof fontSize === 'number';

    const fontStyle = (node.fontName as FontName)?.style;

    return [...textStyles].sort((textStyleA, textStyleB) => {
        const fontStyleMatchesA = fontStyle === textStyleA.fontName.style;
        const fontStyleMatchesB = fontStyle === textStyleB.fontName.style;

        if (isNumericFontSize) {
            // @ts-ignore
            const differenceA = Math.abs(textStyleA.fontSize - fontSize);
            // @ts-ignore
            const differenceB = Math.abs(textStyleB.fontSize - fontSize);

            if (differenceA < differenceB) {
                return -1;
            }

            if (differenceA > differenceB) {
                return 1;
            }
        }

        if (fontStyleMatchesA) {
            return -1
        }

        if (fontStyleMatchesB) {
            return 1
        }

        return 0;
    })
}
