# TRU COMPONENTS Gamepad for micro:bit V2

MakeCode extension for controlling a TRU COMPONENTS gamepad using BBC micro:bit V2.

The extension supports seven digital buttons, a two-axis analog joystick, and differential motor control calculations.

## Features

- 7 digital buttons: UP, DOWN, LEFT, RIGHT, MODE, SELECT, Z
- Button press detection with software debouncing
- Analog joystick X and Y readings
- Joystick position as raw ADC values or percentages
- Adjustable joystick dead zone
- Differential drive calculations for two motors
- Motor speed and direction calculations
- Maximum motor speed configuration

## Hardware connections

Connect the gamepad to micro:bit V2 as follows:

| Gamepad signal | micro:bit pin |
|---|---|
| UP | P10 |
| DOWN | P8 |
| LEFT | P11 |
| RIGHT | P9 |
| MODE | P6 |
| SELECT | P7 |
| Z (joystick button) | P5 |
| Joystick X | P3 |
| Joystick Y | P4 |
| GND | GND |
| Power | 3V |

The digital buttons are active-low and require appropriate pull-up resistors.

**Important:** The extension disables the micro:bit LED matrix because several gamepad connections use shared pins.

## Installation

1. Open Microsoft MakeCode for micro:bit.
2. Create a new project.
3. Select **Extensions**.
4. Enter the repository address:

   `https://github.com/pawelkasprowicz/pxt-tru-gamepad`

5. Select the extension to add it to your project.

## Button example

```typescript
truGamepad.init()

truGamepad.onButtonPressed(truGamepad.Button.UP, function () {
    serial.writeLine("UP pressed")
})

truGamepad.onButtonPressed(truGamepad.Button.Z, function () {
    serial.writeLine("Joystick button pressed")
})
```

## Analog joystick

The joystick uses two analog inputs:

- X axis: P3
- Y axis: P4

The extension supports raw ADC readings and normalized joystick positions.

The joystick center is approximately 512 ADC units.

A configurable dead zone helps prevent unwanted movement around the center position.

## Differential motor control

The extension includes calculations for controlling two motors using a single joystick.

Motor assignment:

- M1: left motor
- M2: right motor

Movement:

| Joystick movement |