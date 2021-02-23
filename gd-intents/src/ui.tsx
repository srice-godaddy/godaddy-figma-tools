import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

declare function require(path: string): any;

class App extends React.Component {
    onCreate = () => {
        parent.postMessage({ pluginMessage: { type: 'create-styles' } }, '*');
    }

    onClearStyles = () => {
        parent.postMessage({ pluginMessage: { type: 'delete-all-styles' } }, '*');
    }

    onCancel = () => {
        parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
    }

    render() {
        return <div>
            <h2>Intent Styles</h2>
            <p>Use this plugin to create all intent styles from the Pro theme.</p>
            <button id="create" onClick={this.onCreate}>Create</button>
            <button id="clear" onClick={this.onClearStyles}>Clear Styles</button>
            <button id="cancel" onClick={this.onCancel}>Cancel</button>
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
