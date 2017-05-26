import React from 'react'
import ReactDOM from 'react-dom'
import FPS from './component/fps'
import css from './main.scss'

// Init Bootstrap CSS and JS globally
require('bootstrap/dist/css/bootstrap.css');
require('bootstrap');

// Component for initializing the canvas and WebGL
class Canvas extends React.Component {
    render() {
        return <canvas id="canvas" height="480" width="720" className={css.canvas}></canvas>;
    }
    componentDidMount() {
        // With the canvas now rendered, init WebGL by requiring it
        const gl = require('./gl').gl;
        if (!gl) {
            throw new Error('WebGL is unavailable');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // Canvas should never be re-rendered after initialization
        return false;
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // True if WebGL has been already initialized
            glInitialized: false,
            // True if the main loop has already been initialized
            mainLoopInitialized: false,

            // The last time FPS was changed
            prevTime: Date.now(),
            // The number of frames rendered since 'prevTime'
            frames: 0,
            // The calculated FPS
            fps: 0
        }
    }
    render() {
        // Render the canvas in order to init WebGL before rendering any other components
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        {this.state.glInitialized ? <FPS fps={this.state.fps}/> : ""}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        <Canvas/>
                    </div>
                    <div className='col-md-4'>
                        <span>TODO</span>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        // At this point, canvas has been rendered so WebGL is initialized
        this.setState({glInitialized: true});
    }
    componentDidUpdate() {
        // Only do main loop setup logic once
        if (this.state.mainLoopInitialized) {
            return;
        }
        this.setState({mainLoopInitialized: true});

        // Start the main loop, which will also handle FPS calculation
        const mainLoop = require('./main-loop');
        mainLoop.begin(this);
    }
}

ReactDOM.render(<Main/>, document.getElementById('main'));