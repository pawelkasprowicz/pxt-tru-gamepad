// ==========================================
// TRU COMPONENTS GAMEPAD
// TEST 7 PRZYCISKOW
// ==========================================

truGamepad.init()

serial.writeLine("========================")
serial.writeLine("TRU GAMEPAD - TEST")
serial.writeLine("========================")
serial.writeLine("Naciskaj przyciski")

truGamepad.onButtonPressed(truGamepad.Button.UP, function () {
    serial.writeLine("PRZYCISK: UP")
})

truGamepad.onButtonPressed(truGamepad.Button.DOWN, function () {
    serial.writeLine("PRZYCISK: DOWN")
})

truGamepad.onButtonPressed(truGamepad.Button.LEFT, function () {
    serial.writeLine("PRZYCISK: LEFT")
})

truGamepad.onButtonPressed(truGamepad.Button.RIGHT, function () {
    serial.writeLine("PRZYCISK: RIGHT")
})

truGamepad.onButtonPressed(truGamepad.Button.MODE, function () {
    serial.writeLine("PRZYCISK: MODE")
})

truGamepad.onButtonPressed(truGamepad.Button.SELECT, function () {
    serial.writeLine("PRZYCISK: SELECT")
})

truGamepad.onButtonPressed(truGamepad.Button.Z, function () {
    serial.writeLine("PRZYCISK: Z")
})