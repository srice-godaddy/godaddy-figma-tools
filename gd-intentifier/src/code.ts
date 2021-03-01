/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import IntentifierService from './code/services/intentifier-service';

for (const font of figma.getLocalTextStyles()) {
    figma.loadFontAsync(font.fontName);
}

const PLUGIN_DIMENSIONS = {
    WIDTH: 480,
    HEIGHT: 640,
    HEIGHT_COLLAPSED: 100,
};

const intentifier = new IntentifierService(figma);

function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    } else if (
        type === 'undefined' ||
        type === 'number' ||
        type === 'string' ||
        type === 'boolean'
    ) {
        return val;
    } else if (type === 'object') {
        if (val instanceof Array) {
            return val.map((x) => clone(x));
        } else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        } else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}

function handleSelectionChange() {
    const selection = figma.currentPage.selection;
    const recommendations = intentifier.intentRecommendation.getRecommendedSelectionStyles(
        selection
    );
    const fixes = intentifier.intentRecommendation.getIntentStyleFixes(
        selection
    );

    const recommendationsUI = intentifier.transformRecommendationToUI(
        recommendations
    );
    const fixesUI = intentifier.transformFixesToUI(fixes);

    // We're allowing just a single element to get into selection for now.
    // TODO Figure out how to support multiple element selection.
    const shouldHaveExpandedHeight =
        recommendationsUI.hasRecommendations &&
        Object.keys(recommendationsUI.byNodeId).length === 1;
    figma.ui.resize(
        PLUGIN_DIMENSIONS.WIDTH,
        shouldHaveExpandedHeight
            ? PLUGIN_DIMENSIONS.HEIGHT
            : PLUGIN_DIMENSIONS.HEIGHT_COLLAPSED
    );

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
    height: PLUGIN_DIMENSIONS.HEIGHT_COLLAPSED,
});

// TODO When to unbind event?
figma.on('selectionchange', handleSelectionChange);

const temporaryStylesStore = {};

type CustomMsgType =
    | {
          type: 'updateNodeStyle';
          nodeId: string;
          styleIds: StyleIdsType;
          refreshUI: boolean;
      }
    | {
          type: 'previewNodeStyle';
          nodeId: string;
          styleIds: StyleIdsType;
      }
    | {
          type: 'revertNodeStyle';
          nodeId: string;
      };

figma.ui.onmessage = (msg: CustomMsgType) => {
    if (msg.type === 'updateNodeStyle') {
        const { nodeId, styleIds = {}, refreshUI = true } = msg;

        intentifier.applyStylesToNode(nodeId, styleIds);

        delete temporaryStylesStore[nodeId];

        if (refreshUI) {
            handleSelectionChange();
        }
    }

    if (msg.type === 'previewNodeStyle') {
        const { nodeId, styleIds = {} } = msg;

        const node = figma.getNodeById(nodeId) as any;

        if (!node) {
            return;
        }

        temporaryStylesStore[nodeId] = {
            ...(typeof node.fills !== 'undefined' && {
                fills: clone(node.fills),
                fillStyleId: node.fillStyleId,
            }),
            ...(typeof node.strokes !== 'undefined' && {
                strokes: clone(node.strokes),
                strokeStyleId: node.strokeStyleId,
            }),
            ...(typeof node.textStyleId !== 'undefined' && {
                fontSize: node.fontSize,
                fontName: clone(node.fontName),
                textCase: node.textCase,
                textDecoration: node.textDecoration,
                letterSpacing: clone(node.letterSpacing),
                lineHeight: clone(node.lineHeight),
                textStyleId: node.textStyleId,
            }),
            ...(node.type === 'INSTANCE' &&
                typeof node.children !== 'undefined' &&
                node.children.length === 1 &&
                node.children[0].type === 'TEXT' && {
                    children: [
                        {
                            fills: clone(node.children[0].fills),
                            fillsStyleId: node.children[0].fillStyleId,
                        },
                    ],
                }),
        };

        intentifier.applyStylesToNode(nodeId, styleIds);
    }

    if (msg.type === 'revertNodeStyle') {
        const { nodeId } = msg;

        const node = figma.getNodeById(nodeId);

        if (!node) {
            return;
        }

        const originalStyles = temporaryStylesStore[nodeId];

        // Style might not exist if we ran "updateNodeStyle" before this event was fired.
        if (!originalStyles) {
            return;
        }

        Object.entries(originalStyles).forEach(([key, value]) => {
            if (key !== 'children') {
                node[key] = value;

                return;
            }

            const childSettings = value[0];
            try {
                Object.entries(childSettings).forEach(
                    ([nestedKey, nestedValue]) => {
                        (node as any).children[0][nestedKey] = clone(
                            nestedValue
                        );
                    }
                );
            } catch (err) {
                // Code above throws an error even though it executes just fine.
            }
        });

        delete temporaryStylesStore[nodeId];
    }
};
