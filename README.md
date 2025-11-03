# node-red-contrib-dht-libgpiod

A Node-RED node for using the DHT11 and DHT22 sensors via libgpiod. Compatible with Raspberry Pi 5.

### Installation

This node directly depends on [node-dht-sensor](https://www.npmjs.com/package/node-dht-sensor). Please install it according to the instructions listed there.

Then you can install this node
```bash
npm install @thehighestbit/node-red-contrib-libgpiod
```

### Configuration

* Sensor type - If the sensor is DHT11 or DHT22
* GPIO - GPIO pin number to which the data out of the sensor is connected
* Interval (ms) - Optional interval between sensor reads.