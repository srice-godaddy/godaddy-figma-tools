import { camelCase } from 'lodash';

const PAINT_TYPES = {
    backgroundColor: 'fillStyle',
    borderColor: 'strokeStyle',
    foregroundColor: 'textFillStyle',
    feedbackColor: 'fillStyle',
    onFeedbackColor: 'textFillStyle',
};

export function getParsedPaintName(paintStyleName: string) {
    const [category, type] = paintStyleName.split('/');
    return [camelCase(category), camelCase(type)];
}

export function getPaintGrouping(paintStyleName: string) {
    const [category, type] = paintStyleName.split('/');
    return [
        camelCase(category),
        PAINT_TYPES[camelCase(type)] || camelCase(`unsupported ${type}`),
    ];
}
