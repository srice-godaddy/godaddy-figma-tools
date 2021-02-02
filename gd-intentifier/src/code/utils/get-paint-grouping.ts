import {camelCase} from "lodash";

const PAINT_TYPES = {
    'backgroundColor': 'fillStyleId',
    'borderColor': 'strokeStyleId',
    'foregroundColor': 'textStyleId',
}

export function getParsedPaintName(paintStyleName: string) {
    const [category, type] = paintStyleName.split('/');
    return [camelCase(category), camelCase(type)];
}


export function getPaintGrouping(paintStyleName: string) {
    const [category, type] = paintStyleName.split('/');
    return [camelCase(category), PAINT_TYPES[camelCase(type)] || camelCase(`unsupported ${type}`)];
}
