import * as React from "react";
import StylePreview from "./style-preview";

export type StyleIdsType = {
    fillStyleId?: string;
    textFillStyleId?: string;
    textStyleId?: string;
    strokeStyleId?: string;
};

type IntentFillStyleType = {
    name: string;
    fillStyleId: string;
    textFillStyleId?: string;
    backgroundColor: string;
    color?: string;
    styleIds: StyleIdsType;
}

type IntentTextStyleType = {
    name: string;
    textStyleId: string;
    styleIds: StyleIdsType;
}

export type IntentNodeRecommendationType = {
    hasRecommendations: boolean;
    nodeId: string;
    fillStyles?: IntentFillStyleType[];
    textFillStyles?: IntentFillStyleType[];
    textStyles?: IntentTextStyleType[];
}

export default function IntentNodeRecommendations({nodeId, fillStyles, textFillStyles, textStyles}: IntentNodeRecommendationType) {
    const hasFillStyles = fillStyles?.length > 0;
    const hasTextFillStyles = textFillStyles?.length > 0;
    const hasTextStyles = textStyles?.length > 0;

    const recommendedStyleGroupsCount = [hasFillStyles, hasTextFillStyles, hasTextStyles].filter(isValid => isValid).length;

    const handleStylePreviewClick = React.useCallback((styleIds) => {
        parent.postMessage({
            pluginMessage: {
                type: 'updateNodeStyle',
                nodeId,
                styleIds
            }
        }, '*')
    }, [nodeId]);

    return (
        <div className='ui-intent-recommendations__node'>
            {hasFillStyles && (
                <details {...recommendedStyleGroupsCount <= 1 && {
                    open: true
                }}>
                    <summary>Fill style recommendations</summary>

                    <div className='ui-intent-recommendations__fill-styles'>
                        <div className='ui-intent-recommendations__items'>
                            {fillStyles.map((fillStyle, idx) => (
                                <StylePreview key={idx} {...fillStyle} onStylePreviewClick={handleStylePreviewClick}/>
                            ))}
                        </div>
                    </div>
                </details>
            )}

            {hasTextFillStyles && (
                <details  {...recommendedStyleGroupsCount <= 1 && {
                    open: true
                }}>
                    <summary>Text fill style recommendations</summary>

                    <div className='ui-intent-recommendations__fill-styles'>
                        <div className='ui-intent-recommendations__items'>
                            {textFillStyles.map((fillStyle, idx) => (
                                <StylePreview key={idx} {...fillStyle} onStylePreviewClick={handleStylePreviewClick}/>
                            ))}
                        </div>
                    </div>

                </details>
            )}

            {hasTextStyles && (
                <details {...recommendedStyleGroupsCount <= 1 && {
                    open: true
                }}>
                    <summary>Text style recommendations</summary>

                    <div className='ui-intent-recommendations__fill-styles'>
                        <div className='ui-intent-recommendations__items'>
                            {textStyles.map((textStyle, idx) => (
                                <StylePreview key={idx} {...textStyle} onStylePreviewClick={handleStylePreviewClick}/>
                            ))}
                        </div>
                    </div>
                </details>
            )}
        </div>
    )
}
