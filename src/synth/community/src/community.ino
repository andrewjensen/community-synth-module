#define PIN D7
#define SEQUENCE_LENGTH 8

// STATE -----------------------------------------------------------------------

int _index = 0;
int _steps[8];

// LIFECYCLE -------------------------------------------------------------------

void setup() {
  pinMode(PIN, OUTPUT);

  // Initialize the steps
  for (int i = 0; i < SEQUENCE_LENGTH; i++) {
    _steps[i] = (i * 2) + 1; // TODO: something more reasonable
  }

  // RGB.control(true);

  Serial.begin(9600);
  Serial.println("Hello world!");

  Particle.subscribe("initialize", onInitialize);
  Particle.subscribe("set_step", onSetStep);

  Particle.publish("synth_connect");
}

void loop() {
  onClockSignal();
  delay(1000);
}

// INPUT SIGNAL HANDLERS -------------------------------------------------------

void onClockSignal() {
  advanceStep();
  int noteValue = _steps[_index];
  Serial.printf("Step %d: Note %d\n", _index, noteValue);
}

void advanceStep() {
  _index = ((_index + 1) % SEQUENCE_LENGTH);
}

// NETWORK EVENT HANDLERS ------------------------------------------------------

void onInitialize(const char *event, const char *data) {
  Serial.println("Initializing...");
  Serial.println(data);
}

void onSetStep(const char *event, const char *data) {
  Serial.println("handling set_step");
  if (strcmp(data, "on") == 0) {
    // Do stuff...
  } else if (strcmp(data, "off") == 0) {
    // Do stuff...
  }
}

// I/O HELPERS -----------------------------------------------------------------

void lightOn() {
  digitalWrite(PIN, HIGH);
}

void lightOff() {
  digitalWrite(PIN, LOW);
}

void colorBlue() {
  RGB.color(0, 0, 255);
}

void colorGreen() {
  RGB.color(0, 255, 0);
}

void colorOff() {
  RGB.color(0, 0, 0);
}
