/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentRecommendationService from "./code/services/intent-recommendation-service";
import {IntentStylesService} from "./code/services/intent-styles-service";
import StyleTransformService from "./code/services/style-transform-service";
import {isEmpty} from 'lodash';

const textStyles = figma.getLocalTextStyles();
const paintStyles = figma.getLocalPaintStyles();

const intentStyles = new IntentStylesService({ textStyles, paintStyles });
const intentRecommendation = new IntentRecommendationService(intentStyles.getValidIntentStyles());
const styleTransform = new StyleTransformService({
    intentStyles,
});

function selectionToUIPresentation(selectionRecommendations) {
    const presentation = Object.entries(selectionRecommendations).reduce((selectionMap, [nodeId, selectionStyles]) => {
        const selectionStyleEntries = Object.entries(selectionStyles || {});

        selectionMap.byNodeId[nodeId] = selectionStyleEntries.reduce((acc, [styleKey, styleList]) => {
            const isForeground = styleKey === 'textFillStyles';
            acc[styleKey] = styleList.map(style => styleTransform.toPresentation(style, isForeground));

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

    console.log(presentation);

    return presentation;
}

figma.showUI(__html__, {width: 480, height: 640});

// TODO When to unbind event?
figma.on('selectionchange', () => {
    const selectionRecommendations = intentRecommendation.getRecommendedSelectionStyles(figma.currentPage.selection);
    const presentation = selectionToUIPresentation(selectionRecommendations);

    console.log({
        selectionRecommendations, presentation
    })

    figma.ui.postMessage({
        type: 'intentRecommendationUpdate',
        payload: presentation,
    });
})

type CustomMsgType = {
    type: 'updateNodeStyle',
    nodeId: 'string',
    styleIds: {
        fillStyleId?: string;
        textFillStyleId?: string;
        textStyleId?: string;
    }
}

figma.ui.onmessage = (msg: CustomMsgType) => {
    if (msg.type === 'updateNodeStyle') {
        const { nodeId, styleIds = {} } = msg;

        const node = figma.getNodeById(nodeId);
        console.log({
            node, styleIds
        })
        if (node) {
            Object.entries(styleIds).forEach(([key, styleId]) => {
                const isCustomTextFill = key === 'textFillStyleId';
                if (!isCustomTextFill) {
                    node[key] = styleId;
                }

                if (node.type === 'TEXT') {
                    node.fillStyleId = styleId;
                }

                if (node.type === 'INSTANCE') {
                    const hasOnlyOneTextChild = node.children.length === 1 && node.children[0].type === 'TEXT';
                    if (hasOnlyOneTextChild) {
                        (node.children[0] as TextNode).fillStyleId = styleId;
                    }
                }
            })
        }
    }
}
