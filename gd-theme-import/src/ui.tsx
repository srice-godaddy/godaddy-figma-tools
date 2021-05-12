import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

let currentThemeId = null;
onmessage = (event) => {
    currentThemeId = event.data.pluginMessage;
};

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
        // HARD CODING THIS FOR NOW = GODADDY THEME FROM UXP
        
        // Fetch an entire theme from this endpoint: fetch('https://theme-api.uxp.godaddy.com/v1/themes?alias=godaddy:brand')
        const themeId = this.themeSelect.value;
        fetch('http://localhost:8080/https://theme-api.uxp.godaddy.com/v1/themes?themeId=' + themeId)
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

        fetch('http://localhost:8080/https://theme-api.uxp.godaddy.com/v1/themes') // TODO: Remove the need for this cors proxy!
            .then(response => response.json())
            .then(themes => {
                self.setState({
                    loaded: true,
                    themes: themes.themes.sort(function(a, b) {
                        var nameA = a.alias.toUpperCase();
                        var nameB = b.alias.toUpperCase();
                        if (nameA.indexOf("GODADDY") == nameB.indexOf("GODADDY")){
                            if (nameA < nameB) {
                                return -1;
                            }
                            if (nameA > nameB) {
                                return 1;
                            }
                            return 0;
                        } else {
                            if (nameA.indexOf("GODADDY") == 0) {
                                return -1;
                            }
                            if (nameB.indexOf("GODADDY") == 0) {
                                return 1;
                            }
                        }
                    })
                });

                const currentID = currentThemeId;

                if (currentThemeId && themes.filter(theme => theme.id === currentID).length > 0) {
                    self.themeSelect.value = currentThemeId;
                }
            });
    }

    render() {
        let content = <p className='loading'>Loading...</p>;

        // @ts-ignore
        if (this.state.loaded) {
            content = <div>
                <p>Pick a theme to import:</p>
                <select name='theme' id='theme' ref={ this.themeSelectRef }>
                    {
                        // @ts-ignore
                        this.state.themes.map((value, index) => <option key={ index } value={ value.id }>{ value.alias }</option>)
                    }
                </select>
                <div className='button-container'>
                    <a href='https://themes.pts.godaddy.com/' target='_blank' className='link-button secondary' style={{marginLeft: '0'}}>Manage Themes</a>
                    <button id="clear" onClick={this.onClearStyles} className='secondary'>Clear Theme Styles</button>
                    <button id="create" onClick={this.onCreate} className='primary'>Select Theme</button>
                </div>

                <p style={{ marginTop: '25px', fontSize: '12px'}}><b>Note:</b> What to do if you don't see your theme here, or if a color is wrong? Just hit the "Manage Themes" link and you'll be able to correct it. Logging in with Okta required.</p>
            </div>;
        }

        return <div className='main'>
            { content }
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
