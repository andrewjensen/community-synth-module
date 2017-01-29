'use strict';

const { Component, h, render } = preact;

const NOTES_PER_OCTAVE = 12;
const NOTE_NAMES = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
];

const INITIAL_STEPS = [0, 0, 0, 0, 0, 0, 0, 0];

const CHANGE_INC = 'CHANGE_INC';
const CHANGE_DEC = 'CHANGE_DEC';

function noteName(midiValue) {
  const name = NOTE_NAMES[midiValue % NOTES_PER_OCTAVE];
  const octave = Math.floor(midiValue / NOTES_PER_OCTAVE);
  const result = name + octave;
  return result;
}

function updateSteps(steps, index, action) {
  return steps.map((step, i) => {
    if (i !== index) return step;

    return updateStep(step, action);
  });
}

function updateStep(value, action) {
  if (action === CHANGE_INC) return increment(value);
  else if (action === CHANGE_DEC) return decrement(value);
}

// TODO: combine with updateSteps() ?
function updateStepsFromServer(steps, index, value) {
  return steps.map((step, i) => {
    if (i !== index) return step;

    return value;
  });
}

function increment(noteValue) {
  return noteValue + 1;
}

function decrement(noteValue) {
  return noteValue - 1;
}

class App extends Component {
  constructor(props) {
    super(props);

    this._onChangeStep = this._onChangeStep.bind(this);

    const socket = this.socket = io();

    socket.on('connect', () => {
      socket.emit('client:initialize');
    });

    socket.on('server:initialize', (state) => {
      this.setState({
        loaded: true,
        steps: state.steps
      });
    });

    socket.on('server:step:set', (data) => {
      const index = data.step;
      const value = data.value;
      this.setState({
        steps: updateStepsFromServer(this.state.steps, index, value)
      })
    });

    socket.on('server:devices', (devices) => {
      this.setState({ devices });
    });

    this.state = {
      loaded: false,
      steps: INITIAL_STEPS,
      devices: 0,
    };
  }

  _onChangeStep(index, action) {
    const newSteps = updateSteps(this.state.steps, index, action);
    this.socket.emit('client:step:set', {
      step: index,
      value: newSteps[index]
    });
    this.setState({
      steps: newSteps
    });
  }

  render() {
    const { loaded, steps, devices } = this.state;
    if (loaded) {
      return (
        h('div', { className: 'App' },
          h(Header),
          h(Sequencer, { steps, onChangeStep: this._onChangeStep }),
          h(Footer, { devices })
        )
      );
    } else {
      return (
        h('div', { className: 'App' },
          h(LoadingScreen)
        )
      );

    }
  }
}

const Header = (props) => {
  return (
    h('div', { className: 'Header' },
      h('div', { className: 'Header-title' }, 'Community')
    )
  );
};

const Sequencer = (props) => {
  const { steps, onChangeStep } = props;
  return (
    h('div', { className: 'Sequencer' },
      (steps.map((step, index) => (
        h(Step, { step, index, onChangeStep })
      )))
    )
  );
};

const Step = (props) => {
  const { step, index, onChangeStep } = props;
  const name = noteName(step);
  return (
    h('div', { className: 'Step' },
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_INC) }, '+'),
      h('div', { className: 'Step-label' }, name),
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_DEC) }, '-')
    )
  );
};

const StepButton = (props) => {
  const { children, onClick } = props;
  return (
    h('div', { className: 'StepButton', onClick }, children)
  );
};

const LoadingScreen = (props) => {
  return (
    h('div', { className: 'LoadingScreen' },
      h('h1', null, 'Loading...')
    )
  );
};

const Footer = (props) => {
  const { devices } = props;
  return (
    h('div', { className: 'Footer' },
      h('div', { className: 'Footer-info' },
        'Devices connected: ',
        h('em', null, `${devices}`)
      ),
      h('div', { className: 'Footer-author' }, 'A crazy idea by Andrew Jensen')
    )
  );
}

render(h(App), document.body);
