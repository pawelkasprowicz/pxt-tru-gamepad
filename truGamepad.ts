//% color="#008080" icon="\uf11b" block="TRU Gamepad"
namespace truGamepad {

    // ==========================================
    // PRZYCISKI
    // ==========================================

    export enum Button {
        //% block="UP"
        UP = 0,
        //% block="DOWN"
        DOWN = 1,
        //% block="LEFT"
        LEFT = 2,
        //% block="RIGHT"
        RIGHT = 3,
        //% block="MODE"
        MODE = 4,
        //% block="SELECT"
        SELECT = 5,
        //% block="Z"
        Z = 6
    }

    // ==========================================
    // OSIE JOYSTICKA
    // ==========================================

    export enum Axis {
        //% block="X"
        X = 0,
        //% block="Y"
        Y = 1
    }

    // ==========================================
    // SILNIKI
    // ==========================================

    export enum Motor {
        //% block="lewy (M1)"
        Left = 0,
        //% block="prawy (M2)"
        Right = 1
    }

    export enum Direction {
        //% block="do przodu"
        Forward = 0,
        //% block="do tylu"
        Backward = 1
    }

    let deadZone = 10
    let maxMotorSpeed = 255

    // ==========================================
    // MAPOWANIE PINOW
    // ==========================================

    function buttonPin(button: Button): DigitalPin {

        switch (button) {

            case Button.UP:
                return DigitalPin.P10

            case Button.DOWN:
                return DigitalPin.P8

            case Button.LEFT:
                return DigitalPin.P11

            case Button.RIGHT:
                return DigitalPin.P9

            case Button.MODE:
                return DigitalPin.P6

            case Button.SELECT:
                return DigitalPin.P7

            case Button.Z:
                return DigitalPin.P5
        }

        return DigitalPin.P10
    }

    // ==========================================
    // INICJALIZACJA
    // ==========================================

    //% block="inicjalizuj gamepad"
    //% weight=100
    export function init(): void {

        // Wylaczenie matrycy LED
        led.enable(false)

        // Gamepad posiada wlasne rezystory
        // podciagajace.

        pins.setPull(DigitalPin.P10, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P8, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P11, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P9, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P6, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P7, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P5, PinPullMode.PullNone)

        basic.pause(100)
    }

    // ==========================================
    // ODCZYT PRZYCISKOW
    // ==========================================

    //% block="czy przycisk %button jest nacisniety"
    //% weight=90
    export function isPressed(button: Button): boolean {

        let pin = buttonPin(button)

        return pins.digitalReadPin(pin) == 0
    }

    // ==========================================
    // ZDARZENIE NACISNIECIA
    // ==========================================

    //% block="po nacisnieciu przycisku %button"
    //% weight=89
    export function onButtonPressed(
        button: Button,
        handler: () => void
    ): void {

        control.inBackground(function () {

            // Stabilizacja po uruchomieniu
            basic.pause(100)

            // Stan poczatkowy przycisku
            let stableState = isPressed(button)
            let lastReading = stableState
            let lastChangeTime = input.runningTime()

            while (true) {

                let reading = isPressed(button)

                if (reading != lastReading) {

                    lastReading = reading
                    lastChangeTime = input.runningTime()
                }

                // Eliminacja drgan stykow 30 ms
                if (input.runningTime() - lastChangeTime >= 30) {

                    if (reading != stableState) {

                        stableState = reading

                        // Zdarzenie tylko po nacisnieciu
                        if (stableState) {
                            handler()
                        }
                    }
                }

                basic.pause(5)
            }
        })
    }

    // ==========================================
    // JOYSTICK - WARTOSCI SUROWE
    // ==========================================

    //% block="joystick %axis wartosc surowa"
    //% weight=80
    export function joystickRaw(axis: Axis): number {

        if (axis == Axis.X) {
            return pins.analogReadPin(AnalogPin.P3)
        }

        return pins.analogReadPin(AnalogPin.P4)
    }

    // ==========================================
    // MARTWA STREFA
    // ==========================================

    //% block="ustaw martwa strefe joysticka na %value procent"
    //% value.min=0 value.max=40 value.defl=10
    //% weight=79
    export function setDeadZone(value: number): void {

        deadZone = Math.constrain(value, 0, 40)
    }

    // ==========================================
    // PRZELICZANIE OSI
    // ==========================================

    function convertAxis(raw: number): number {

        let value = Math.round((raw - 512) * 100 / 511)

        value = Math.constrain(value, -100, 100)

        if (Math.abs(value) <= deadZone) {
            return 0
        }

        if (value > 0) {
            return Math.round(
                (value - deadZone) * 100 / (100 - deadZone)
            )
        }

        return Math.round(
            (value + deadZone) * 100 / (100 - deadZone)
        )
    }

    // ==========================================
    // JOYSTICK - WARTOSCI PROCENTOWE
    // ==========================================

    //% block="joystick %axis wartosc -100 do 100"
    //% weight=78
    export function joystickPercent(axis: Axis): number {

        return convertAxis(joystickRaw(axis))
    }

    // ==========================================
    // MAKSYMALNA PREDKOSC SILNIKOW
    // ==========================================

    //% block="ustaw maksymalna predkosc silnikow %speed"
    //% speed.min=0 speed.max=255 speed.defl=255
    //% weight=70
    export function setMaxMotorSpeed(speed: number): void {

        maxMotorSpeed = Math.constrain(speed, 0, 255)
    }

    // ==========================================
    // MIESZANIE ROZNICOWE SILNIKOW
    // ==========================================

    function calculateMotor(motor: Motor): number {

        let x = joystickPercent(Axis.X)
        let y = joystickPercent(Axis.Y)

        // Y dodatnie = przod
        // X dodatnie = skret w prawo

        let left = y + x
        let right = y - x

        let maximum = Math.max(
            100,
            Math.max(Math.abs(left), Math.abs(right))
        )

        left = left * 100 / maximum
        right = right * 100 / maximum

        let value = 0

        if (motor == Motor.Left) {
            value = left
        } else {
            value = right
        }

        return Math.round(value * maxMotorSpeed / 100)
    }

    // ==========================================
    // PREDKOSC SILNIKA ZE ZNAKIEM
    // ==========================================

    //% block="joystick predkosc silnika %motor (-255 do 255)"
    //% weight=65
    export function motorSigned(motor: Motor): number {

        return calculateMotor(motor)
    }

    // ==========================================
    // PREDKOSC SILNIKA 0..255
    // ==========================================

    //% block="joystick predkosc silnika %motor (0 do 255)"
    //% weight=64
    export function motorSpeed(motor: Motor): number {

        return Math.abs(calculateMotor(motor))
    }

    // ==========================================
    // KIERUNEK SILNIKA
    // ==========================================

    //% block="joystick kierunek silnika %motor"
    //% weight=63
    export function motorDirection(motor: Motor): Direction {

        if (calculateMotor(motor) < 0) {
            return Direction.Backward
        }

        return Direction.Forward
    }
}