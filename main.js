var gpio = require('rpi-gpio'),
    fs   = require('fs');

var pin         = 12,
    period      = 5000,
    threshold   = 50,
    filePath    = '/sys/class/thermal/thermal_zone0/temp',
    isFirstTime = true;

gpio.setup(pin, gpio.DIR_OUT, loop);

function loop() {
    setTimeout(function () {
        isFirstTime = false;

        var temp = getCPUTemp(),
            fanState = temp > threshold;

        console.log(
            '%s. CPU temperature: %s°C, fan %s.',
            new Date().toISOString(),
            Math.round(temp * 10) / 10,
            fanState ? 'enabled' : 'disabled'
        );

        gpio.write(pin, fanState, loop);
    }, isFirstTime ? 1000 : period);
}

function getCPUTemp() {
    return fs.readFileSync(filePath, {encoding: 'utf8'}) / 1000;
}
