var sensor = require('node-dht-sensor');

module.exports = function (RED) {
    function DHTNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        this.sensor_version = Number(config.sensor_version);
        this.gpio_pin = Number(config.gpio_pin);
        const intervalMs = Number(config.read_interval);
        this.read_interval = Number.isFinite(intervalMs) && intervalMs >= 1000 ? intervalMs : null;

        const MAX_ATTEMPTS = 5;
        let timer = null;
        let active = true;

        function scheduleNext(delayMs) {
            if (!active || node.read_interval === null) {
                return;
            }
            clearTimeout(timer);
            timer = setTimeout(() => readSensor(), delayMs);
        }

        function readSensor(attempt = 1) {
            sensor.read(node.sensor_version, node.gpio_pin, (err, temperature, humidity) => {
                if (err) {
                    if (attempt < MAX_ATTEMPTS) {
                        node.status({ fill: "yellow", shape: "ring", text: `retry ${attempt}` });
                        return setTimeout(() => readSensor(attempt + 1), 2000);
                    }
                    node.status({ fill: "red", shape: "ring", text: "read failed" });
                    node.warn(`Failed to read DHT sensor on GPIO ${node.gpio_pin}`);
                    scheduleNext(node.read_interval);
                    return;
                }

                node.status({ fill: "green", shape: "dot", text: `${temperature.toFixed(1)}°C, ${humidity.toFixed(1)}%` });
                node.send({
                    payload: {
                        temperature: temperature,
                        humidity: humidity
                    },
                    topic: node.name || `dht/${node.gpio_pin}`
                });

                scheduleNext(node.read_interval);
            });
        }

        node.on("input", () => readSensor());
        node.on("close", () => {
            active = false;
            clearTimeout(timer);
        });

        scheduleNext(0);
    }

    RED.nodes.registerType("dht", DHTNode);
}