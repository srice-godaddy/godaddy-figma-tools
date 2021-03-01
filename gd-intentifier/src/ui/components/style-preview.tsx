import * as React from 'react';
import classNames from 'classnames';
import { StyleIdsType } from './intent-node-recommendations';

interface StylePreviewProps {
    name: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    font?: string;
    styleIds: StyleIdsType;
    onStylePreviewClick: (args: StyleIdsType) => void;
    onStylePreviewMouseEnter: (args: StyleIdsType) => void;
    onStylePreviewMouseLeave: (args: StyleIdsType) => void;
}

export default function StylePreview(props: StylePreviewProps) {
    const {
        name,
        borderColor,
        styleIds,
        onStylePreviewClick,
        onStylePreviewMouseEnter,
        onStylePreviewMouseLeave,
        ...cssProps
    } = props;

    const [category, type] = name.includes('/')
        ? name.split('/')
        : `${name}/Preview Text`.split('/');

    const memoizedStyle = React.useMemo(() => {
        return {
            ...cssProps,
            ...(borderColor && {
                border: `2px solid ${borderColor}`,
            }),
        };
    }, [cssProps, borderColor]);

    return (
        <div
            className={classNames('ui-style-preview', {
                'ui-style-preview--checkboard':
                    (!styleIds.textStyleId && !memoizedStyle.backgroundColor) ||
                    memoizedStyle.backgroundColor === 'transparent',
            })}
            style={memoizedStyle}
            onClick={() => onStylePreviewClick(styleIds)}
            {...(onStylePreviewMouseEnter && {
                onMouseEnter: () => onStylePreviewMouseEnter(styleIds),
            })}
            {...(onStylePreviewMouseLeave && {
                onMouseLeave: () => onStylePreviewMouseLeave(styleIds),
            })}
        >
            <div className='ui-style-preview-parent'>
                <div className="ui-style-preview__group">{category}</div>
                <div className="ui-style-preview__type">{type}</div>
            </div>
        </div>
    );
}
