import * as React from 'react';
import StylePreview from './style-preview';
import { useState } from 'react';

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
};

type IntentTextStyleType = {
    name: string;
    textStyleId: string;
    styleIds: StyleIdsType;
};

export type IntentNodeRecommendationType = {
    hasRecommendations: boolean;
    nodeId: string;
    fillStyles?: IntentFillStyleType[];
    textFillStyles?: IntentFillStyleType[];
    textStyles?: IntentTextStyleType[];
};

export default function IntentNodeRecommendations({
    nodeId,
    fillStyles,
    textFillStyles,
    textStyles,
}: IntentNodeRecommendationType) {
    const hasFillStyles = fillStyles?.length > 0;
    const hasTextFillStyles = textFillStyles?.length > 0;
    const hasTextStyles = textStyles?.length > 0;

    const recommendedStyleGroupsCount = [
        hasFillStyles,
        hasTextFillStyles,
        hasTextStyles,
    ].filter((isValid) => isValid).length;

    const [accordionsOpened, setAccordionsOpened] = useState({
        fillStyles: hasFillStyles && recommendedStyleGroupsCount === 1,
        textFillStyles: hasTextFillStyles && recommendedStyleGroupsCount === 1,
        textStyles: hasTextStyles && recommendedStyleGroupsCount === 1,
    });

    const handleStylePreviewClick = React.useCallback(
        (styleIds) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'updateNodeStyle',
                        nodeId,
                        styleIds,
                    },
                },
                '*'
            );
        },
        [nodeId]
    );

    const handleStylePreviewMouseEnter = React.useCallback(
        (styleIds) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'previewNodeStyle',
                        styleIds,
                        nodeId,
                    },
                },
                '*'
            );
        },
        [nodeId]
    );

    const handleStylePreviewMouseLeave = React.useCallback(
        (styleIds) => {
            parent.postMessage(
                {
                    pluginMessage: {
                        type: 'revertNodeStyle',
                        nodeId,
                    },
                },
                '*'
            );
        },
        [nodeId]
    );

    return (
        <div className="ui-intent-recommendations__node">
            {hasFillStyles && (
                <details
                    {...(accordionsOpened.fillStyles && {
                        open: true,
                    })}
                >
                    <summary>Fill style recommendations</summary>

                    <div className="ui-intent-recommendations__fill-styles">
                        <div className="ui-intent-recommendations__items">
                            {fillStyles.map((fillStyle, idx) => (
                                <StylePreview
                                    key={idx}
                                    {...fillStyle}
                                    onStylePreviewClick={(styleIds) => {
                                        setAccordionsOpened((currentState) => {
                                            return {
                                                ...currentState,
                                                fillStyles: false,
                                            };
                                        });

                                        handleStylePreviewClick(styleIds);
                                    }}
                                    onStylePreviewMouseEnter={
                                        handleStylePreviewMouseEnter
                                    }
                                    onStylePreviewMouseLeave={
                                        handleStylePreviewMouseLeave
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </details>
            )}

            {hasTextFillStyles && (
                <details
                    {...(accordionsOpened.textFillStyles && {
                        open: true,
                    })}
                >
                    <summary>Text fill style recommendations</summary>

                    <div className="ui-intent-recommendations__fill-styles">
                        <div className="ui-intent-recommendations__items">
                            {textFillStyles.map((fillStyle, idx) => (
                                <StylePreview
                                    key={idx}
                                    {...fillStyle}
                                    onStylePreviewClick={(styleIds) => {
                                        setAccordionsOpened((currentState) => {
                                            return {
                                                ...currentState,
                                                textFillStyles: false,
                                            };
                                        });

                                        handleStylePreviewClick(styleIds);
                                    }}
                                    onStylePreviewMouseEnter={
                                        handleStylePreviewMouseEnter
                                    }
                                    onStylePreviewMouseLeave={
                                        handleStylePreviewMouseLeave
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </details>
            )}

            {hasTextStyles && (
                <details
                    {...(accordionsOpened.textStyles && {
                        open: true,
                    })}
                >
                    <summary>Text style recommendations</summary>

                    <div className="ui-intent-recommendations__fill-styles">
                        <div className="ui-intent-recommendations__items">
                            {textStyles.map((textStyle, idx) => (
                                <StylePreview
                                    key={idx}
                                    {...textStyle}
                                    onStylePreviewClick={(styleIds) => {
                                        setAccordionsOpened((currentState) => {
                                            return {
                                                ...currentState,
                                                textStyles: false,
                                            };
                                        });

                                        handleStylePreviewClick(styleIds);
                                    }}
                                    onStylePreviewMouseEnter={
                                        handleStylePreviewMouseEnter
                                    }
                                    onStylePreviewMouseLeave={
                                        handleStylePreviewMouseLeave
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </details>
            )}
        </div>
    );
}
