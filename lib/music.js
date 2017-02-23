const Music = (function() {

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

  return {
    noteName,
  };
})();

if (typeof module !== 'undefined') {
  module.exports = Music;
}
