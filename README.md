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

The digital buttons are active-low and require appropriate external pull-up resistors.

**Important:** The extension disables the micro:bit LED matrix because several gamepad connections use shared pins.

## Installation

1. Open Microsoft MakeCode for micro:bit.
2. Create a new project.
3. Select **Extensions**.
4. Enter the repository address:

   https://github.com/pawelkasprowicz/pxt-tru-gamepad

5. Select the extension to add it to your project.

## Button example

The following example detects button presses and sends messages to the USB serial console.

```typescript
truGamepad.init()

truGamepad.onButtonPressed(truGamepad.Button.UP, function () {
    serial.writeLine("UP pressed")
})

truGamepad.onButtonPressed(truGamepad.Button.Z, function () {
    serial.writeLine("Joystick button pressed")
})
```

### Supported buttons

| Button | Description |
|---|---|
| UP | Directional button UP |
| DOWN | Directional button DOWN |
| LEFT | Directional button LEFT |
| RIGHT | Directional button RIGHT |
| MODE | MODE button |
| SELECT | SELECT button |
| Z | Analog joystick push button |

Button press events include software debouncing to reduce unwanted multiple detections.

## Analog joystick

The joystick uses two analog inputs:

- X axis: P3
- Y axis: P4

The extension supports:

- Raw ADC readings (0–1023)
- Normalized joystick positions (-100% to +100%)
- Adjustable dead zone

The joystick center is approximately 512 ADC units.

### Joystick directions

| Movement | X axis | Y axis |
|---|---|---|
| Center | 0% | 0% |
| Forward | 0% | Positive |
| Backward | 0% | Negative |
| Left | Negative | 0% |
| Right | Positive | 0% |

A configurable dead zone helps prevent unwanted movement around the center position.

The default dead zone used during testing was 10%.

## Differential motor control

The extension includes calculations for controlling two motors using a single joystick.

Motor assignment:

- M1: left motor
- M2: right motor

### Movement

| Joystick movement | Left motor (M1) | Right motor (M2) |
|---|---|---|
| Forward | Forward | Forward |
| Backward | Backward | Backward |
| Left | Backward | Forward |
| Right | Forward | Backward |
| Center | Stop | Stop |

### Differential steering

The extension calculates motor speeds using the joystick X and Y axes.

Basic steering equations:

```text
Left motor  = Y + X
Right motor = Y - X
```

The resulting motor speeds are limited to the configured maximum range.

### Motor speed values

Signed motor speed:

```text
-255 = maximum reverse speed
   0 = motor stopped
+255 = maximum forward speed
```

Unsigned motor speed:

```text
0–255
```

Motor direction can be determined separately from the speed value.

The maximum motor speed can be configured.

### Motor driver compatibility

The calculated motor speeds can be used with external motor drivers.

The extension was designed with the possibility of using the Cytron REKA:BIT motor controller.

Expected motor assignment:

- REKA:BIT M1 = left motor
- REKA:BIT M2 = right motor

**Important:** Physical motor control using REKA:BIT has not yet been tested.

The extension currently provides motor control calculations. Actual motor driver integration requires additional testing.

## Testing status

The extension has been tested using BBC micro:bit V2.

### Tested functions

| Function | Status |
|---|---|
| Digital button detection | PASS |
| Button press events | PASS |
| Software debouncing | PASS - initial tests |
| Analog joystick X axis | PASS |
| Analog joystick Y axis | PASS |
| Joystick dead zone | PASS |
| Differential motor calculations | PASS |
| Signed motor speed calculations | PASS |
| USB serial debugging | PASS |

### Hardware testing

The following tests have been completed:

- All seven digital buttons were detected correctly.
- Each button generated one press event during the final test.
- No unexpected button events were observed during the final test.
- Analog joystick readings were verified.
- Joystick center readings were approximately 512.
- Differential steering calculations were verified using USB serial output.

### Not yet tested

- Physical motor control using Cytron REKA:BIT
- Long-term operation
- Compatibility with other motor controllers
- Operation under different electrical conditions

**Motor control calculations have been tested using USB serial output, but actual motor operation has not yet been verified.**

## Known limitations

- Designed for BBC micro:bit V2.
- The micro:bit LED matrix is disabled.
- Several micro:bit pins are reserved for the gamepad.
- External pull-up resistors are required for the digital buttons.
- Physical motor control has not yet been verified.

## Feedback and contributions

Community testing is welcome!

If you find a bug, have an improvement suggestion, or successfully test the extension with a motor driver, please open a GitHub Issue.

You can report:

- Hardware compatibility
- Button detection problems
- Joystick behavior
- Motor control test results
- Suggestions for additional MakeCode blocks
- Improvements to the documentation

GitHub Issues:

https://github.com/pawelkasprowicz/pxt-tru-gamepad/issues

Contributions and test results are appreciated.

## License

This project is licensed under the MIT License.

Copyright (c) 2026 Paweł Kasprowicz

See the LICENSE file for details.

## Author

Paweł Kasprowicz

GitHub: https://github.com/pawelkasprowicz

## Project status

Initial public version.

The gamepad buttons, analog joystick and differential motor calculations have been tested.

Additional hardware testing and community feedback are welcome.