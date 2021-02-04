import {IntentStylesService} from "./intent-styles-service";
import IntentRecommendationService from "./intent-recommendation-service";
import StyleTransformService from "./style-transform-service";

export default class IntentifierService {
    figmaInstance: PluginAPI;
    intentStyles: IntentStylesService;
    intentRecommendation: IntentRecommendationService;
    styleTransform: StyleTransformService;

    constructor(figmaInstance: PluginAPI) {
        this.figmaInstance = figmaInstance;

        const textStyles = this.figmaInstance.getLocalTextStyles();
        const paintStyles = this.figmaInstance.getLocalPaintStyles();

        this.intentStyles = new IntentStylesService({ textStyles, paintStyles });
        this.intentRecommendation = new IntentRecommendationService(this.intentStyles.getValidIntentStyles());
        this.styleTransform = new StyleTransformService(this.intentStyles);
    }

    transformRecommendationToUI(nodesMap) {
        const presentation = Object.entries(nodesMap).reduce((selectionMap, [nodeId, selectionStyles]) => {
            const selectionStyleEntries = Object.entries(selectionStyles || {});

            selectionMap.byNodeId[nodeId] = selectionStyleEntries.reduce((acc, [styleKey, styleList]) => {
                const isForeground = styleKey === 'textFillStyles';
                acc[styleKey] = styleList.map(style => this.styleTransform.toPresentation(style, isForeground));

                if (acc[styleKey].length) {
                    acc.hasRecommendations = true;
                    selectionMap.hasRecommendations = true;
                }

                return acc;
            }, {
                hasRecommendations: false,
                nodeId
            })

            return selectionMap;
        }, {
            hasRecommendations: false,
            byNodeId: {},
        });

        return presentation;
    }

    applyStylesToNode(nodeId: string, styleIds: StyleIdsType) {
        const node = figma.getNodeById(nodeId);

        if (!node) {
            return;
        }

        const styleIdEntries = Object.entries(styleIds);

        // Reset paint styles if we're sending other paint styles within `styleIds`.
        const resetPaintStyles = styleIdEntries.length > 0 &&
            styleIdEntries.every(([key, styleId]) => key !== 'textStyleId');

        if (resetPaintStyles) {
            (node as any).fillStyleId = '';
            (node as any).fills = [];

            (node as any).strokeStyleId = '';
            (node as any).strokes = [];
        }

        const isTextNode = node.type === 'TEXT';
        const isInstanceNode = node.type === 'INSTANCE';

        styleIdEntries.forEach(([key, styleId]) => {
            const isCustomTextFill = key === 'textFillStyleId';
            if (!isCustomTextFill) {
                node[key] = styleId;
            }

            if (isCustomTextFill && isTextNode) {
                (node as any).fillStyleId = styleId;

                return;
            }

            if (isInstanceNode) {
                const nodeChildren = (node as InstanceNode).children;
                const hasOnlyOneTextChild = nodeChildren.length === 1 && nodeChildren[0].type === 'TEXT';

                // Attempt to assign fillStyle on text node if it's the only child. POC for uxcore's Button component.
                if (hasOnlyOneTextChild) {
                    (nodeChildren[0] as any).fillStyleId = styleId;
                }
            }
        })
    }
}
