import * as React from "react";

export default function useFigmaMessage(type, onMessage) {
    const callback = React.useCallback(event => {
        const message = event.data.pluginMessage;
        console.log(event);
        if (message.type === type) {
            onMessage(message);
        }
    }, [onMessage, type]);

    React.useEffect(() => {
        onmessage = callback;
    }, [callback]);
}
