const Music = (function() {

  const NOTE_VALUE_MIN = 0;
  const NOTE_VALUE_MAX = 24;
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

  function noteName(midiValue) {
    const name = NOTE_NAMES[midiValue % NOTES_PER_OCTAVE];
    const octave = Math.floor(midiValue / NOTES_PER_OCTAVE);
    const result = name + octave;
    return result;
  }

  function increment(noteValue, mode) {
    const incremented = noteValue + 1;

    if (incremented > NOTE_VALUE_MAX) return noteValue;

    return incremented;
  }

  function decrement(noteValue, mode) {
    const decremented = noteValue - 1;

    if (decremented < NOTE_VALUE_MIN) return noteValue;

    return decremented;
  }

  return {
    noteName,
    increment,
    decrement,
  };
})();

if (typeof module !== 'undefined') {
  module.exports = Music;
}
