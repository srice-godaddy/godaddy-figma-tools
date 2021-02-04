/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentifierService from "./code/services/intentifier-service";

const PLUGIN_DIMENSIONS = {
    WIDTH: 480,
    HEIGHT: 640,
    HEIGHT_COLLAPSED: 100,
}

const intentifier = new IntentifierService(figma);

function handleSelectionChange() {
    const selection = figma.currentPage.selection;
    const recommendations = intentifier.intentRecommendation.getRecommendedSelectionStyles(selection);
    const fixes = intentifier.intentRecommendation.getIntentStyleFixes(selection);

    const recommendationsUI = intentifier.transformRecommendationToUI(recommendations);
    const fixesUI = intentifier.transformFixesToUI(fixes);

    // We're allowing just a single element to get into selection for now.
    // TODO Figure out how to support multiple element selection.
    const shouldHaveExpandedHeight = recommendationsUI.hasRecommendations && Object.keys(recommendationsUI.byNodeId).length === 1;
    figma.ui.resize(PLUGIN_DIMENSIONS.WIDTH, shouldHaveExpandedHeight? PLUGIN_DIMENSIONS.HEIGHT : PLUGIN_DIMENSIONS.HEIGHT_COLLAPSED);

    figma.ui.postMessage({
        type: 'intentRecommendationUpdate',
        payload: {
            recommendations: recommendationsUI,
            fixes: fixesUI,
        },
    });
}

figma.showUI(__html__, {
    width: PLUGIN_DIMENSIONS.WIDTH,
    height: PLUGIN_DIMENSIONS.HEIGHT_COLLAPSED
});

// TODO When to unbind event?
figma.on('selectionchange', handleSelectionChange)

type CustomMsgType = {
    type: 'updateNodeStyle';
    nodeId: 'string';
    styleIds: StyleIdsType;
    refreshUI: boolean;
}

figma.ui.onmessage = (msg: CustomMsgType) => {
    if (msg.type === 'updateNodeStyle') {
        const { nodeId, styleIds = {}, refreshUI = false } = msg;

        intentifier.applyStylesToNode(nodeId, styleIds);

        if (refreshUI) {
            handleSelectionChange();
        }
    }
}
