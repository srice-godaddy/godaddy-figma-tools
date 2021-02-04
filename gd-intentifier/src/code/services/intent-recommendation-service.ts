import getSortedPaintStyles from "../utils/get-sorted-paint-styles";
import getSortedTextStyles from "../utils/get-sorted-text-styles";
import { getParsedPaintName } from "../utils/get-paint-grouping";
import {IntentStylesService} from "./intent-styles-service";
import { isEmpty } from 'lodash';

type SupportedPaintStylesType = InstanceNode | EllipseNode | PolygonNode | RectangleNode | StarNode | VectorNode;

export default class IntentRecommendationService {
    figmaInstance: PluginAPI;
    intentStyles: IntentStylesService;
    textStyles: TextStyle[];
    paintStyles: PaintStyle[];
    backgroundStyles: PaintStyle[];
    foregroundStyles: PaintStyle[];
    styleIds: string[];

    constructor(figmaInstance: PluginAPI, intentStyles: IntentStylesService) {
        this.figmaInstance = figmaInstance;
        this.intentStyles = intentStyles;

        const { textStyles, paintStyles } = this.intentStyles.getValidIntentStyles();

        this.textStyles = textStyles;
        this.paintStyles = paintStyles;
        this.styleIds = [...textStyles, ...paintStyles].map(style => style.id);

        this.backgroundStyles = this.getBackgroundStyles();
        this.foregroundStyles = this.getForegroundStyles();
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
        fillStyles?: Array<PaintStyle>,
        textFillStyles?: Array<PaintStyle>,
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
        textFillStyles: Array<PaintStyle>,
        textStyles: Array<TextStyle>
    } {
        const hasValidTextStyle = this.isValidStyleId(node.textStyleId);
        const hasValidFillStyle = this.isValidStyleId(node.fillStyleId);

        if (hasValidTextStyle && hasValidFillStyle) {
            return null;
        }

        return {
            ...!hasValidTextStyle && {
                textStyles: getSortedTextStyles(node, this.textStyles),
            },
            ...!hasValidFillStyle && {
                textFillStyles: getSortedPaintStyles(node.fills?.[0]?.color, this.foregroundStyles)
            },
        };
    }

    isValidStyleId(styleId) {
        if (!styleId) {
            return false;
        }

        return this.styleIds.includes(styleId);
    }

    getIntentStyleFixes(selection: ReadonlyArray<SceneNode>) {
        return selection.reduce((accu, node: SceneNode) => {
            accu[node.id] = this.getNodeStyleFixes(node);

            return accu;
        }, {});
    }

    getNodeStyleFixes(node: SceneNode) {
        switch(node.type) {
            case "TEXT":
                return null;
            case "ELLIPSE":
            case "POLYGON":
            case "RECTANGLE":
            case "STAR":
            case "VECTOR":
            case "INSTANCE":
                const mainPaintStyleResponse = this.getMainPaintStyle(node);
                if (!mainPaintStyleResponse) {
                    return null;
                }

                const [mainPaintStyleKey, mainPaintStyle] = mainPaintStyleResponse;
                const relatedPaintStyles = this.intentStyles.getRelatedPaintStyles(mainPaintStyle);

                const shouldHaveFillStyle = !!relatedPaintStyles?.fillStyle?.id;
                const shouldHaveStrokeStyle = !!relatedPaintStyles?.strokeStyle?.id;

                const hasFillStyle = !isEmpty(node.fills);
                const hasStrokeStyle = !isEmpty(node.strokes);
                if (
                    shouldHaveFillStyle !== hasFillStyle ||
                    shouldHaveStrokeStyle !== hasStrokeStyle ||
                    (node.fillStyleId || null) !== (relatedPaintStyles?.fillStyle?.id || null) ||
                    (node.strokeStyleId || null) !== (relatedPaintStyles?.strokeStyle?.id || null)
                ) {
                    return relatedPaintStyles;
                }

                return null;
            default:
                return null;
        }
    }

    getMainPaintStyle(node): [string, PaintStyle] {
        const prioritizedPaintStyles = ['fillStyleId', 'strokeStyleId'];
        const mainPaintStyleKey = prioritizedPaintStyles
            .find(paintStyleIdKey => this.isValidStyleId(node[paintStyleIdKey]));

        if (!mainPaintStyleKey) {
            return null;
        }

        const paintStyle: PaintStyle = this.figmaInstance.getStyleById(node[mainPaintStyleKey]) as PaintStyle;

        return [mainPaintStyleKey, paintStyle];
    }
}
