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

    const handleStylePreviewClick = React.useCallback((styleIds) => {
        parent.postMessage({
            pluginMessage: {
                type: 'updateNodeStyle',
                nodeId,
                styleIds
            }
        }, '*')
    }, [nodeId])

    return (
        <div className='ui-intent-recommendations__node'>
            {hasFillStyles && (
                <div className='ui-intent-recommendations__fill-styles'>
                    <h2>Fill style recommendations</h2>

                    <div className='ui-intent-recommendations__items'>
                        {fillStyles.map((fillStyle, idx) => (
                            <StylePreview key={idx} {...fillStyle} onStylePreviewClick={handleStylePreviewClick}/>
                        ))}
                    </div>
                </div>
            )}

            {hasTextFillStyles && (
                <div className='ui-intent-recommendations__fill-styles'>
                    <h2>Text fill style recommendations</h2>

                    <div className='ui-intent-recommendations__items'>
                        {textFillStyles.map((fillStyle, idx) => (
                            <StylePreview key={idx} {...fillStyle} onStylePreviewClick={handleStylePreviewClick}/>
                        ))}
                    </div>
                </div>
            )}

            {hasTextStyles && (
                <div className='ui-intent-recommendations__fill-styles'>
                    <h2>Text style recommendations</h2>

                    <div className='ui-intent-recommendations__items'>
                        {textStyles.map((textStyle, idx) => (
                            <StylePreview key={idx} {...textStyle} onStylePreviewClick={handleStylePreviewClick}/>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
