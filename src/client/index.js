'use strict';

const { Component, h, render } = preact;

const INITIAL_STEPS = [
  64,
  64,
  64,
  64,
  64,
  64,
  64,
  64,
];

const CHANGE_INC = 'CHANGE_INC';
const CHANGE_DEC = 'CHANGE_DEC';

function noteName(midiValue) {
  return 'C3';
}

class App extends Component {
  constructor(props) {
    super(props);

    this._onChangeStep = this._onChangeStep.bind(this);

    this.state = {
      steps: INITIAL_STEPS
    };
  }

  _onChangeStep(index, mode) {
    console.log('change step:', index, mode);
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
