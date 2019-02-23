# Example - `random.js`
## Description
**WARNING: Do not run if you are sensitive to flashing lights**

Show all of the standard color values (except off) randomly on each button every half a second (configurable).


## Starting
- [Install Rocketry](../installation.md)
- Run in your terminal using the correct path
```bash
$ node ./example/random.js
```


---


## How to Use
Just run and don't look at the pretty colors too much.

### Changing the Interval
Assuming you input it as the 3rd argument (yay for lazily hard coding examples!), you can change the timer interval in milliseconds without editing the file. If you want to edit it, just change the constant named `ms`. I would be careful when using smaller intervals especially so if your device has some EPROM that can only handle 1,000,000 writes or you have epilepsy.
```bash
$ node ./example/random.js 1000
```



### Exiting
Exit the program using `ctrl + c` (interrupt) to reset the device and exit the program.
