import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './ui.css';

class App extends React.Component {
    transitionSelect: HTMLSelectElement

    constructor() {
        // @ts-ignore
        super();

        this.state = {
            loaded: true,
            transitions: ["Fluid"],
            currentSelection: "Fluid",
        };
    }

    transitionSelectRef = (element: HTMLSelectElement) => {
        this.transitionSelect = element;
    }

    onSelected = () => {
        parent.postMessage({ pluginMessage: { type: 'create-transitions', value: this.state.currentSelection } }, '*');
    }
    handleChange = (e) => {
        this.setState({currentSelection: e.target.value});
    }

    render() {
        let content = <p className='loading'>Loading...</p>;

        // @ts-ignore
        if (this.state.loaded) {
            content = <div>
                <p>Select a transition style to apply to selected elements and their children:</p>
                <select name='transition' id='transition' onChange={this.handleChange} ref={ this.transitionSelectRef }>
                    {
                        // @ts-ignore
                        this.state.transitions.map((value, index) => <option key={ index } value={ value }>{ value }</option>)
                    }
                </select>
                <div className='button-container'>
                    <button id="selectTransitions" onClick={this.onSelected} className='primary'>Select Transition</button>
                </div>
            </div>;
        }

        return <div className='main'>
            { content }
        </div>;
    }
}

ReactDOM.render(<App />, document.getElementById('react-app'));
