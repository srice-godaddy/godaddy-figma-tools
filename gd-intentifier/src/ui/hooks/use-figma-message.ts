import * as React from "react";

export default function useFigmaMessage(type, onMessage) {
    const callback = React.useCallback(event => {
        const message = event.data.pluginMessage;
        console.log({
            'useFigmaMessage': 'useFigmaMessage',
            selection: message.selection,
            firstSelection: message.selection?.[0],
            firstSelectionTextStyle: message.selection?.[0]?.textStyleId,
            eventData: event.data,
        })

        if (message.type === type) {
            onMessage(message);
        }
    }, [onMessage, type]);

    React.useEffect(() => {
        onmessage = callback;
    }, [callback]);
}
