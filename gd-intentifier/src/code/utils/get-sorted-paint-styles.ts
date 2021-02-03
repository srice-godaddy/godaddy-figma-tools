import { figmaRgbToRgb, getDeltaE, getRGBDistance } from "./color";

export default function getSortedPaintStyles(needleColor: RGB, paintStyles: PaintStyle[]): PaintStyle[] {
    const rgb1 = figmaRgbToRgb(needleColor);

    const weighedDistance = [...paintStyles].map(paintStyle => {
        const paint = paintStyle.paints?.[0];

        if (paint?.type !== 'SOLID') {
            return {
                paintStyle,
                distance: Infinity,
                deltaE: Infinity
            };
        }

        const rgb2 = figmaRgbToRgb(paint.color);

        const distance = getRGBDistance(rgb1, rgb2);
        const deltaE = getDeltaE(rgb1, rgb2);

        return {
            paintStyle,
            distance,
            deltaE
        };
    }).sort(function compareDistances(paintStyleDistance1, paintStyleDistance2) {
        return paintStyleDistance1.deltaE - paintStyleDistance2.deltaE
    });

    return weighedDistance.map(paintStyleWithDistance => paintStyleWithDistance.paintStyle);
}
