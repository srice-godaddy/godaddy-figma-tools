import * as React from 'react';
import StylePreview from "./style-preview";

export type IntentNodeFixesType = {
    items: any[]
}
export default function IntentNodeFixes({ items }) {
    const handleStylePreviewClick = React.useCallback((nodeId, styleIds) => {
        parent.postMessage({
            pluginMessage: {
                type: 'updateNodeStyle',
                nodeId,
                styleIds
            }
        }, '*')
    }, []);

    if (!items.length) {
        return null;
    }

    return (
        <div className='ui-intent-fixes'>
            <h2 className='ui-intent-fixes__heading'>Existing styles don't use complete intent set. Click on preview to fix.</h2>

            {items.map(item => (
                <StylePreview key={item.nodeId} {...item.fillStyle} onStylePreviewClick={(styleIds) => handleStylePreviewClick(item.nodeId, styleIds)}  />
            ))}
        </div>
    )
}
