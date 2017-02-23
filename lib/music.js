const Music = (function() {
  'use strict';

  const NOTE_VALUE_MIN = 0;
  const NOTE_VALUE_MAX = 24;
  const NOTES_PER_OCTAVE = 12;
  const NOTE_NAMES = [
    'C', 'C#',
    'D', 'D#',
    'E',
    'F', 'F#',
    'G', 'G#',
    'A', 'A#',
    'B'
  ];

  const MODES = {
    'Chromatic': {
      allowed: [
        true, true,
        true, true,
        true,
        true, true,
        true, true,
        true, true,
        true
      ]
    },
    'Major': {
      allowed: [
        true, false,
        true, false,
        true,
        true, false,
        true, false,
        true, false,
        true
      ]
    },
    'Minor': {
      allowed: [
        true, false,
        true, true,
        false,
        true, false,
        true, true,
        false, true,
        false
      ]
    },
    'Pentatonic': {
      allowed: [
        true, false,
        true, false,
        true,
        false, false,
        true, false,
        true, false,
        false
      ]
    },
  };

  function noteName(midiValue) {
    const name = NOTE_NAMES[midiValue % NOTES_PER_OCTAVE];
    const octave = Math.floor(midiValue / NOTES_PER_OCTAVE);
    const result = name + octave;
    return result;
  }

  function increment(noteValue, mode) {
    const surrounding = getSurroundingNotes(noteValue, mode);
    const incremented = surrounding.higherNote;

    if (incremented > NOTE_VALUE_MAX) return noteValue;

    return incremented;
  }

  function decrement(noteValue, mode) {
    const surrounding = getSurroundingNotes(noteValue, mode);
    const decremented = surrounding.lowerNote;

    if (decremented < NOTE_VALUE_MIN) return noteValue;

    return decremented;
  }

  /**
   * Returns {lowerNote, higherNote}
   */
  function getSurroundingNotes(noteValue, mode) {
    const allowedNotes = MODES[mode].allowed;

    let lowerNote = noteValue - 1;
    while (!isAllowed(lowerNote, allowedNotes)) {
      lowerNote--;
    }

    let higherNote = noteValue + 1;
    while (!isAllowed(higherNote, allowedNotes)) {
      higherNote++;
    }

    return {
      lowerNote,
      higherNote,
    };
  }

  function isAllowed(noteValue, allowedNotes) {
    const valueInOctave = (noteValue + NOTES_PER_OCTAVE) % NOTES_PER_OCTAVE;
    return allowedNotes[valueInOctave];
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
