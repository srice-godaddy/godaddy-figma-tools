import {getDeltaE, getRGBDistance} from "./color";

export default function getSortedPaintStyles(needleColor: RGB, paintStyles: PaintStyle[]): PaintStyle[] {
    const rgb1 = [(needleColor?.r || 0) * 255, (needleColor?.g || 0) * 255, (needleColor?.b || 0) * 255];

    const weighedDistance = [...paintStyles].map(paintStyle => {
        const paint = paintStyle.paints?.[0];

        if (paint?.type !== 'SOLID') {
            return {
                paintStyle,
                distance: Infinity,
            };
        }

        const color = paint?.color;

        const rgb2 = [color.r * 255, color.g * 255, color.b * 255];

        const distance = getRGBDistance(rgb1, rgb2);
        const deltaE = getDeltaE(rgb1, rgb2)

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
