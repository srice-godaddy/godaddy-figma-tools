/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentRecommendationService from "./code/services/intent-recommendation-service";
import {IntentStylesService} from "./code/services/intent-styles-service";

const textStyles = figma.getLocalTextStyles();
const paintStyles = figma.getLocalPaintStyles();
const intentStylesService = new IntentStylesService({ textStyles, paintStyles });
const intentRecommendationService = new IntentRecommendationService(intentStylesService.getValidIntentStyles());

console.log({ paintStyles: paintStyles.map(style => style.name), textStyles: textStyles.map(style => style.name) });

figma.showUI(__html__);

// TODO When to unbind event?
figma.on('selectionchange', () => {
    const selectionRecommendations = intentRecommendationService.getRecommendedSelectionStyles(figma.currentPage.selection);

    console.log({
        selection: figma.currentPage.selection,
        selectionRecommendations
    });
})
