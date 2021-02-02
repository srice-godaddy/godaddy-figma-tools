import getSortedPaintStyles from "../utils/get-sorted-paint-styles";
import getSortedTextStyles from "../utils/get-sorted-text-styles";
import { getParsedPaintName } from "../utils/get-paint-grouping";

type SupportedPaintStylesType = InstanceNode | EllipseNode | PolygonNode | RectangleNode | StarNode | VectorNode;

export default class IntentRecommendationService {
    textStyles: TextStyle[];
    paintStyles: PaintStyle[];
    backgroundStyles: PaintStyle[];
    foregroundStyles: PaintStyle[];
    styleIds: string[];

    constructor(config) {
        const { textStyles, paintStyles } = config;

        this.textStyles = textStyles;
        this.paintStyles = paintStyles;
        this.styleIds = [...textStyles, ...paintStyles].map(style => style.id);

        this.backgroundStyles = this.getBackgroundStyles();
        this.foregroundStyles = this.getForegroundStyles();

        console.log({background: this.backgroundStyles, foreground: this.foregroundStyles})
    }

    getBackgroundStyles() {
        return this.paintStyles.filter(style => {
            const [, type] = getParsedPaintName(style.name);
            return ['backgroundColor', 'feedbackColor'].includes(type);
        });
    }

    getForegroundStyles() {
        return this.paintStyles.filter(style => {
            const [, type] = getParsedPaintName(style.name);
            return ['foregroundColor', 'feedbackColor', 'onFeedbackColor'].includes(type);
        });
    }

    getRecommendedSelectionStyles(selection: ReadonlyArray<SceneNode>): { [id: string]: Array<TextStyle|PaintStyle> } {
        return selection.reduce((accu, node: SceneNode) => {
            accu[node.id] = this.getRecommendedStyles(node);

            return accu;
        }, {});
    }

    getRecommendedStyles(node: SceneNode): {
        fillStyles: Array<PaintStyle>,
        textStyles?: Array<TextStyle>
    } | null {
        switch(node.type) {
            case "TEXT":
                return this.getRecommendedTextStyles(node);
            case "ELLIPSE":
            case "POLYGON":
            case "RECTANGLE":
            case "STAR":
            case "VECTOR":
            case "INSTANCE":
                return this.getRecommendedPaintStyles(node);
            default:
                return null;
        }
    }

    getRecommendedPaintStyles(node: SupportedPaintStylesType): {
        fillStyles: Array<PaintStyle>,
    } {
        if (this.isValidStyleId(node.fillStyleId)) {
            return null;
        }

        const sortedPaintStyles = getSortedPaintStyles(node.fills?.[0]?.color, this.backgroundStyles);
        return {
            fillStyles: sortedPaintStyles
        };
    }

    getRecommendedTextStyles(node: TextNode): {
        fillStyles: Array<PaintStyle>,
        textStyles: Array<TextStyle>
    } {
        if (this.isValidStyleId(node.textStyleId)) {
            return null;
        }

        const sortedTextStyles = getSortedTextStyles(node, this.textStyles);
        const sortedPaintStyles = getSortedPaintStyles(node.fills?.[0]?.color, this.foregroundStyles);

        return {
            textStyles: sortedTextStyles,
            fillStyles: sortedPaintStyles
        };
    }

    isValidStyleId(styleId) {
        if (!styleId) {
            return false;
        }

        return this.styleIds.includes(styleId);
    }
}
