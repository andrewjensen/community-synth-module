#define PIN D7
#define OUTPUT_PIN DAC
#define SEQUENCE_LENGTH 8
#define VOLTAGE_MULTIPLIER 108

// STATE -----------------------------------------------------------------------

int _index = 0;
int _steps[8];

// LIFECYCLE -------------------------------------------------------------------

void setup() {
  pinMode(PIN, OUTPUT);

  // Initialize the steps
  _steps[0] = 0;
  _steps[1] = 7;
  _steps[2] = 12;
  _steps[3] = 7;
  _steps[4] = 0;
  _steps[5] = 4;
  _steps[6] = 7;
  _steps[7] = 4;

  // RGB.control(true);

  Serial.begin(9600);
  Serial.println("Hello world!");

  Particle.subscribe("initialize", onInitialize);
  Particle.subscribe("set_step", onSetStep);

  Particle.publish("synth_connect");
}

void loop() {
  int noteTime = 250;
  onClockSignal();
  delay(noteTime);
}

// INPUT SIGNAL HANDLERS -------------------------------------------------------

void onClockSignal() {
  advanceStep();
  int noteValue = _steps[_index];
  Serial.printf("Step %d: Note %d\n", _index, noteValue);
  sendNote(noteValue);
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

  // Copy the data into a new string so we can mutate it
  std::string temp = std::string(data);
  char *tokenized = const_cast<char*>(temp.c_str());

  int index = atoi(strtok(tokenized, " "));
  int value = atoi(strtok(NULL, " "));

  Serial.printf("Setting step %d to %d\n", index, value);
  _steps[index] = value;
}

// I/O HELPERS -----------------------------------------------------------------

void sendNote(int noteValue) {
  int voltage = noteValue * VOLTAGE_MULTIPLIER;
  Serial.printf("Sending value %d\n", voltage);
  analogWrite(OUTPUT_PIN, voltage);
}

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
