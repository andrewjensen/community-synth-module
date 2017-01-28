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

const INITIAL_STEPS = [
  36,
  40,
  43,
  48,
  60,
  64,
  67,
  72,
];

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

    // This is the step that changed!
    if (action === CHANGE_INC) return increment(step);
    else if (action === CHANGE_DEC) return decrement(step);
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

    this.state = {
      steps: INITIAL_STEPS
    };
  }

  _onChangeStep(index, action) {
    this.setState({
      steps: updateSteps(this.state.steps, index, action)
    });
  }

  render() {
    const { steps } = this.state;
    return (
      h('div', { className: 'App' },
        h(Header),
        h(Sequencer, { steps, onChangeStep: this._onChangeStep })
      )
    );
  }
}

const Header = (props) => {
  return (
    h('div', { className: 'Header' },
      h('h1', null, 'Community Synth Module')
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
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_INC) }, '^'),
      h('div', { className: 'Step-label' }, name),
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_DEC) }, 'v')
    )
  );
};

const StepButton = (props) => {
  const { children, onClick } = props;
  return (
    h('div', { className: 'StepButton', onClick }, children)
  );
};

render(h(App), document.body);
