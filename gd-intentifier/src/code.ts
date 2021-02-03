/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentRecommendationService from "./code/services/intent-recommendation-service";
import {IntentStylesService} from "./code/services/intent-styles-service";
import StyleTransformService from "./code/services/style-transform-service";

const textStyles = figma.getLocalTextStyles();
const paintStyles = figma.getLocalPaintStyles();

const intentStyles = new IntentStylesService({ textStyles, paintStyles });
const intentRecommendation = new IntentRecommendationService(intentStyles.getValidIntentStyles());
const styleTransform = new StyleTransformService({
    intentStyles,
});

function selectionToUIStyle(selectionRecommendations) {
    const presentation = Object.entries(selectionRecommendations).reduce((selectionMap, [nodeId, selectionStyles]) => {
        selectionMap[nodeId] = Object.entries(selectionStyles || {}).reduce((acc, [styleKey, styleList]) => {
            acc[styleKey] = styleList.map(style => styleTransform.toPresentation(style));

            return acc;
        }, {
            nodeId
        })

        return selectionMap;
    }, {});

    console.log(presentation);

    return presentation;
}

figma.showUI(__html__);

// TODO When to unbind event?
figma.on('selectionchange', () => {
    const selectionRecommendations = intentRecommendation.getRecommendedSelectionStyles(figma.currentPage.selection);
    const presentation = selectionToUIStyle(selectionRecommendations);

    figma.ui.postMessage({
        type: 'intent-recommendation-update',
        payload: presentation,
    });
})

