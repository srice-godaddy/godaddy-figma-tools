import {IntentStylesService} from "./intent-styles-service";
import {figmaSolidPaintToRgb} from "../utils/color";
import {StyleIdsType} from "../../ui/components/intent-node-recommendations";

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

function getFontWeight(fontStyle) {
    const weights = {
        'Light': 300,
        'Regular': 400,
        'Medium': 500,
        'Semibold': 600,
        'Bold': 700,
    };

    return weights[fontStyle] ? weights[fontStyle] : 400;
}

export default class StyleTransformService {
    intentStyles: IntentStylesService;

    constructor(config) {
        this.intentStyles = config.intentStyles;
    }

    toPresentation(style: PaintStyle | TextStyle, isForeground = false) {
        if (style.type === 'PAINT') {
            const styleIds: StyleIdsType = {};
            const stylePaint = ((style as PaintStyle)?.paints?.[0] as SolidPaint);

            if (!isForeground) {
                const { strokeStyle, textFillStyle } = this.intentStyles.getRelatedPaintStyles(style);

                const strokePaint = ((strokeStyle as PaintStyle)?.paints?.[0] as SolidPaint);
                const colorPaint = ((textFillStyle as PaintStyle)?.paints?.[0] as SolidPaint);

                const isSolidStrokeColor = strokePaint?.type === 'SOLID';
                const isSolidPaintColor = colorPaint?.type === 'SOLID';

                styleIds.fillStyleId = style.id;

                if (isSolidStrokeColor) {
                    styleIds.strokeStyleId = strokeStyle.id;
                }

                if (isSolidPaintColor) {
                    styleIds.textFillStyleId = textFillStyle.id;
                }

                return {
                    name: style.name,
                    backgroundColor: stylePaint?.type === 'SOLID' ? `rgb(${figmaSolidPaintToRgb(stylePaint).join(', ')})` : 'transparent',
                    styleIds,
                    ...isSolidStrokeColor && {
                        borderColor: `rgb(${figmaSolidPaintToRgb(strokePaint).join(', ')})`,
                    },
                    ...isSolidPaintColor && {
                        color: `rgb(${figmaSolidPaintToRgb(colorPaint).join(', ')})`,
                    }
                }
            }

            return {
                name: style.name,
                styleIds: {
                    fillStyleId: style.id,
                },
                ...stylePaint?.type === 'SOLID' && {
                    color: `rgb(${figmaSolidPaintToRgb(stylePaint).join(', ')})`,
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
                fontFamily: `${family}, sans-serif`,
                fontSize: `${fontSize}px`,
                fontWeight: getFontWeight(fontStyle),
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
