#define PIN D7

// STATE -----------------------------------------------------------------------

int mode = 0;
int rgbState = 0;

// LIFECYCLE -------------------------------------------------------------------

void setup() {
  pinMode(PIN, OUTPUT);

  RGB.control(true);

  Serial.begin(9600);

  Serial.println("Hello world!");

  Particle.subscribe("set_state", onMessage);
}

void loop() {
  onClockSignal();
  delay(1000);
}

// INPUT SIGNAL HANDLERS -------------------------------------------------------

void onClockSignal() {
  Serial.println("Clock signal received!");
  rgbState = !rgbState;
  if (rgbState) {
    if (mode) {
      colorBlue();
    } else {
      colorGreen();
    }
  } else {
    colorOff();
  }
}

// NETWORK EVENT HANDLERS ------------------------------------------------------

void onMessage(const char *event, const char *data) {
  if (strcmp(event, "set_state") == 0) {
    handleSetState(data);
  }
}

void handleSetState(const char *data) {
  Serial.println("handling set_state");
  if (strcmp(data, "on") == 0) {
    mode = 1;
  } else if (strcmp(data, "off") == 0) {
    mode = 0;
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
