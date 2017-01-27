'use strict';

const { Component, h, render } = preact;

class App extends Component {
  render() {
    return (
      h('div', { className: 'App' },
        h('h1', null, 'Community Synth Module')
      )
    );
  }
}

render(h(App), document.body);
