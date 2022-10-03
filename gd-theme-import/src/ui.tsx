import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

let currentThemeId = null;
let currentThemeEnv = null;
onmessage = (event) => {
    currentThemeId = event.data.pluginMessage.theme;
    currentThemeEnv = event.data.pluginMessage.themeEnv;
};

const tempTheme = `{
    "root": {
      "values": {
        "intents.ux.action.borderRadius": {
          "type": "static",
          "value": "6px"
        },
        "intents.ux.textAction.fontSize": {
          "type": "static",
          "value": "1rem"
        },
        "intents.ux.textAction.fontWeight": {
          "type": "static",
          "value": "500"
        },
        "intents.ux.textAction.lineHeight": {
          "type": "static",
          "value": "1"
        },
        "intents.ux.textInput.lineHeight": {
          "type": "static",
          "value": "1"
        },
        "intents.ux.actionSecondary.borderColor": {
          "type": "static",
          "value": "#8995A9"
        },
        "intents.ux.actionSecondaryChosen.backgroundColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryChosen.borderColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryChosen.foregroundColor": {
          "type": "static",
          "value": "#fff"
        },
        "intents.ux.actionSecondaryFocused.borderColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryFocused.foregroundColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryFocused.outlineColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryHovered.backgroundColor": {
          "type": "static",
          "value": "#fff"
        },
        "intents.ux.actionSecondaryHovered.borderColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.actionSecondaryHovered.foregroundColor": {
          "type": "static",
          "value": "#09757A"
        },
        "intents.ux.control.borderRadius": {
          "type": "static",
          "value": "6px"
        },
        "intents.ux.textInput.fontSize": {
          "type": "static",
          "value": "1rem"
        },
        "intents.ux.textLabel.fontSize": {
          "type": "static",
          "value": "0.875rem"
        },
        "intents.ux.textLabel.fontWeight": {
          "type": "static",
          "value": "500"
        },
        "intents.uxFormElement.label.foregroundColor": {
          "type": "static",
          "value": "#767676"
        },
        "intents.uxFormElement.checkboxChosen.backgroundColor": {
          "type": "static",
          "value": "#1BDBDB"
        },
        "intents.uxFormElement.checkboxChosen.foregroundColor": {
          "type": "static",
          "value": "#111"
        }
      }
    }
  }`;


class App extends React.Component {
    themeSelect: HTMLSelectElement
    envSelect: HTMLSelectElement

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
    envSelectRef = (element: HTMLSelectElement) => {
      this.envSelect = element;
    }

    onEnvSelect = () => {
      // Do Nothing :D
    }

    onCreate = () => {
        this.setState({
            loaded: false
        });

        const themeId = this.themeSelect.value;
        fetch(`https://theme-api.uxp.godaddy.com/v1/themes?themeId=${themeId}`) 
            .then(response => response.json())
            .then(themeData => {
                /*themeData = { themes:
                    [{data: JSON.parse(tempTheme)}]
                };*/
                parent.postMessage({ pluginMessage: { type: 'create-styles', themeData } }, '*');
            });
    }

    fetchThemes = () => {
      const self = this;

      fetch(`https://theme-api.uxp.godaddy.com/v1/themes`)
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

    componentDidMount() {
        this.fetchThemes();
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
                <p>Pick an environment (currently does nothing):</p>
                <select name='env' id='env' ref={ this.envSelectRef } onChange={this.onEnvSelect}>
                  <option value="prod">Production</option>
                  <option value="test">Test</option>
                  <option value="dev">Dev</option>
                </select>
                <div className='button-container'>
                    <button id="create" onClick={this.onCreate} className='primary'>Select Theme</button>
                </div>

              </div>;
        }

        return <div className='main'>
            { content }
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
