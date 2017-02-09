#define PIN D7

// LIFECYCLE -------------------------------------------------------------------

void setup() {
  pinMode(PIN, OUTPUT);

  Particle.subscribe("set_state", onMessage);

  lightOn();
  delay(250);
  lightOff();
  delay(250);
  lightOn();
  delay(250);
  lightOff();
  delay(250);
  lightOn();
  delay(250);
  lightOff();
}

void loop() {
}

// NETWORK EVENT HANDLERS ------------------------------------------------------

void onMessage(const char *event, const char *data) {
  if (strcmp(event, "set_state") == 0) {
    handleSetState(data);
  }
}

void handleSetState(const char *data) {
  if (strcmp(data, "on") == 0) {
    lightOn();
  } else if (strcmp(data, "off") == 0) {
    lightOff();
  }
}

// I/O HELPERS -----------------------------------------------------------------

void lightOn() {
  digitalWrite(PIN, HIGH);
}

void lightOff() {
  digitalWrite(PIN, LOW);
}
