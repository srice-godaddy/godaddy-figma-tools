import {IntentStylesService} from "./intent-styles-service";
import {figmaSolidPaintToRgb} from "../utils/color";

const TextCaseTransform = {
    ORIGINAL: 'none',
    UPPER: 'uppercase',
    LOWER: 'lowercase',
    TITLE: 'capitalize',
}

const TextDecorationTransform = {
    NONE: 'none',
    UNDERLINE: 'underline',
    STRIKETHROUGH: 'line-through',
}

export default class StyleTransformService {
    intentStyles: IntentStylesService;

    constructor(config) {
        this.intentStyles = config.intentStyles;
    }

    toPresentation(style: PaintStyle | TextStyle, as: 'fillPaint' | 'textFillPaint' = 'fillPaint') {
        if (style.type === 'PAINT') {
            const stylePaint = ((style as PaintStyle)?.paints?.[0] as SolidPaint);

            if (as === 'fillPaint') {
                const { strokeStyle, textFillStyle } = this.intentStyles.getRelatedPaintStyles(style);

                const strokePaint = ((strokeStyle as PaintStyle)?.paints?.[0] as SolidPaint);
                const colorPaint = ((textFillStyle as PaintStyle)?.paints?.[0] as SolidPaint);

                return {
                    name: style.name,
                    backgroundColor: stylePaint?.type === 'SOLID' ? `rgb(${figmaSolidPaintToRgb(stylePaint).join(', ')})` : 'transparent',
                    fillStyleId: style.id,
                    ...strokePaint?.type === 'SOLID' && {
                        border: `1px solid rgb(${figmaSolidPaintToRgb(strokePaint).join(', ')})`,
                        strokeStyleId: strokeStyle.id,
                    },
                    ...colorPaint?.type === 'SOLID' && {
                        color: `rgb(${figmaSolidPaintToRgb(colorPaint).join(', ')})`,
                        textFillStyleId: textFillStyle.id,
                    }
                }
            }

            if (as === 'textFillPaint') {
                return {
                    name: style.name,
                    ...stylePaint?.type === 'SOLID' && {
                        color: `rgb(${figmaSolidPaintToRgb(stylePaint).join(', ')})`,
                        fillStyleId: style.id,
                    }
                }
            }
        }

        if (style.type === 'TEXT') {
            const {
                name,
                fontSize,
                fontName: { family, style: fontStyle },
                lineHeight,
                letterSpacing,
                textCase,
                textDecoration
            } = (style as unknown as TextStyle & {
                lineHeight: {
                    readonly value: number
                    readonly unit: "PIXELS" | "PERCENT"
                }
            });

            return {
                name,
                font: `${fontStyle} ${fontSize}px '${family}', sans-serif`,
                letterSpacing: letterSpacing.unit === 'PIXELS' ? `${letterSpacing.value}px` : `${letterSpacing.value}%`,
                textTransform: TextCaseTransform[textCase],
                textDecoration: TextDecorationTransform[textDecoration],
                ...lineHeight?.value && {
                    lineHeight: lineHeight.unit === 'PIXELS' ? `${lineHeight.value}px` : lineHeight.value
                },
                textStyleId: style.id,
            }
        }

        return {
            name
        };
    }
}
