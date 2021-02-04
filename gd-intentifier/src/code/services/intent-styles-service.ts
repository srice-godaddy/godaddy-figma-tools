import INTENT_CATEGORIES from "../constants/intent-categories";
import {getPaintGrouping} from "../utils/get-paint-grouping";

interface IGroupedPaintStyles {
    [groupName: string]: {
        fillStyle?: PaintStyle,
        strokeStyle?: PaintStyle,
        textFillStyle?: PaintStyle,
    }
}

export class IntentStylesService {
    textStyles: TextStyle[];
    paintStyles: PaintStyle[];
    groupedPaintStyles: IGroupedPaintStyles;
    groupedPaintStyleKeys: string[];
    validIntentCategories: Array<string>;

    constructor(config) {
        const { textStyles, paintStyles } = config;

        this.validIntentCategories = Object.values(INTENT_CATEGORIES).map(intent => intent.toLowerCase());

        this.textStyles = this.filterStyles<TextStyle>(textStyles);
        this.paintStyles = this.filterStyles<PaintStyle>(paintStyles);
        this.groupedPaintStyles = this.groupPaintStyles();
        this.groupedPaintStyleKeys = Object.keys(this.groupedPaintStyles);
    }

    getValidIntentStyles(): { textStyles: TextStyle[], paintStyles: PaintStyle[], groupedPaintStyles: IGroupedPaintStyles } {
        return {
            textStyles: this.textStyles,
            paintStyles: this.paintStyles,
            groupedPaintStyles: this.groupedPaintStyles,
        }
    }

    private filterStyles<P>(styles: Array<P>) {
        return styles.filter(style => {
            const firstWord = (style as unknown as BaseStyle).name.match(/^([\w]+)/g)[0].toLowerCase();

            return this.validIntentCategories.includes(firstWord);
        })
    }

    private groupPaintStyles(): IGroupedPaintStyles {
        return this.paintStyles.reduce((acc, paintStyle) => {
            const [category, type] = getPaintGrouping(paintStyle.name);

            if (category) {
                if (typeof acc[category] === 'undefined') {
                    acc[category] = {};
                }

                acc[category][type] = paintStyle;
            }

            return acc;
        }, {});
    }

    getRelatedPaintStyles(paintStyle: PaintStyle) {
        const [category] = getPaintGrouping(paintStyle.name);

        const matchedKey = this.groupedPaintStyleKeys.find(key => key === category);

        return this.groupedPaintStyles[matchedKey];
    }
}
