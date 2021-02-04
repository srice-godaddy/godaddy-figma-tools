/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentifierService from "./code/services/intentifier-service";

const intentifier = new IntentifierService(figma);

figma.showUI(__html__, { width: 480, height: 100 });

// TODO When to unbind event?
figma.on('selectionchange', () => {
    const selectionRecommendations = intentifier.intentRecommendation.getRecommendedSelectionStyles(figma.currentPage.selection);
    const presentation = intentifier.transformRecommendationToUI(selectionRecommendations);

    // We're allowing just a single element to get into selection for now.
    // TODO Figure out how to support multiple element selection.
    const shouldHaveExpandedHeight = presentation.hasRecommendations && Object.keys(presentation.byNodeId).length === 1;
    figma.ui.resize(480, shouldHaveExpandedHeight? 640 : 100)

    figma.ui.postMessage({
        type: 'intentRecommendationUpdate',
        payload: presentation,
    });
})

type CustomMsgType = {
    type: 'updateNodeStyle',
    nodeId: 'string',
    styleIds: StyleIdsType
}

figma.ui.onmessage = (msg: CustomMsgType) => {
    if (msg.type === 'updateNodeStyle') {
        const { nodeId, styleIds = {} } = msg;

        intentifier.applyStylesToNode(nodeId, styleIds);
    }
}
