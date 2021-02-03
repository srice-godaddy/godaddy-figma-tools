import * as React from "react";
import {StyleIdsType} from "./intent-node-recommendations";

interface StylePreviewProps {
    name: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    font?: string;
    styleIds: StyleIdsType;
    onStylePreviewClick: (args: StyleIdsType) => void;
}

export default function StylePreview(props: StylePreviewProps) {
    const { color, backgroundColor, borderColor, font, onStylePreviewClick, styleIds, ...rest } = props;

    const [category, type] = rest.name.split('/');

    const memoizedStyle = React.useMemo(() => {
        return {
            color,
            backgroundColor,
            font,
            ...borderColor && {
                border: `2px solid ${borderColor}`
            }
        }
    }, [color, backgroundColor, borderColor, font]);

    return (
        <div className='ui-style-preview' style={memoizedStyle} onClick={() => onStylePreviewClick(styleIds)}>
            <div className='ui-style-preview__group'>{category}</div>
            <div className='ui-style-preview__type'>{type}</div>
        </div>
    )
}
