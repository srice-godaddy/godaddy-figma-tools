import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
import useFigmaMessage from "./ui/hooks/use-figma-message";

declare function require(path: string): any

function App() {
    const [selection, setSelection] = React.useState(null);

    const onSelectionChange = (message) => setSelection(message.selection);
    const selectionMessage = useFigmaMessage('selectionChange', onSelectionChange);

    React.useEffect(() => {
        if (selection) {
            console.log(selection[0]?.textStyleId);
        }
    }, [selection]);

    function getSelection() {
        parent.postMessage({ pluginMessage: { type: 'get-selection' } }, '*')
    }

    return (
        <div>
            <h2>Intentifier</h2>

            <button onClick={getSelection}>Get selection</button>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('react-app'))
