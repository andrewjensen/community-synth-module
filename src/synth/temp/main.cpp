#include <iostream>

#define SEQUENCE_LENGTH 8

using namespace std;

int main() {

  int values[8];
  char text[] = "10 20 30 40 50 60 70 80";
  char *input = text;

  cout << "Hello world" << endl;

  cout << "Input: " << input << endl;

  int index = 0;
  char *step;
  step = strtok(input, " ");
  while (step != NULL) {
    cout << "\tStep " << index << ": " << step << endl;
    values[index] = atoi(step);
    index++;
    step = strtok(NULL, " ");
  }

  cout << "Parsed steps:" << endl;

  for (int i = 0; i < SEQUENCE_LENGTH; i++) {
    cout << "\tStep " << i << ": " << values[i] << endl;
  }

  return 0;
}
