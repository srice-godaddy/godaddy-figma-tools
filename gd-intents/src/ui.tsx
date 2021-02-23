import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

class App extends React.Component {
    themeSelect: HTMLSelectElement


    constructor() {
        // @ts-ignore
        super();

        this.state = {
            loaded: false,
            themes: null
        };
    }

    themeSelectRef = (element: HTMLSelectElement) => {
        this.themeSelect = element;
    }

    onCreate = () => {
        this.setState({
            loaded: false
        });

        const themeId = parseInt(this.themeSelect.value);
        fetch('https://local.gasket.dev-godaddy.com:8443/api/v1/public/themes/' + themeId)
            .then(response => response.json())
            .then(themeData => {
                parent.postMessage({ pluginMessage: { type: 'create-styles', themeData } }, '*');
            });
    }

    onClearStyles = () => {
        parent.postMessage({ pluginMessage: { type: 'delete-all-styles' } }, '*');
    }

    componentDidMount() {
        const self = this;

        fetch('https://local.gasket.dev-godaddy.com:8443/api/v1/public/themes')
            .then(response => response.json())
            .then(themes => {
                self.setState({
                    loaded: true,
                    themes: themes
                });
            });
    }

    render() {
        let content = <div><p>Loading...</p></div>;

        // @ts-ignore
        if (this.state.loaded) {
            content = <div>
                <p>Pick a GoDaddy theme to work with:</p>
                <select name='theme' id='theme' ref={ this.themeSelectRef }>
                    {
                        // @ts-ignore
                        this.state.themes.map((value, index) => <option key={ index } value={ value.ID }>{ value.name }</option>)
                    }
                </select>
                <button id="create" onClick={this.onCreate}>Select Theme</button>

                <p>If you would like to go back to a clean slate, wipe all styles that are specifically in this file.</p>
                <button id="clear" onClick={this.onClearStyles}>Clear Styles</button>
            </div>;
        }

        return <div>
            <h2>GoDaddy Themes</h2>
            { content }
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
