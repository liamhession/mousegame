`mousegame` is an interactive demo for introducing students to the concept of the client-server relationship that websites use, as well as some basic javascript scripting. I usually bill the demo with a name along the lines of "Hacking Web Games", as the breakthrough realization I'm hoping to lead the students to is that they are able to change the mouse of another player.

###Setup instructions for running the demo on a Mac. 
You will first have to enable your computer to act as a local server. If you need help with that, look through the instructions for your specific version of OS X [here](https://discussions.apple.com/docs/DOC-3083). After that's done: 
1. Clone this project into the `WebServer/Documents` directory
2. Determine your computer's IP address on the network by running `bash getIP.sh`
3. Run `node js/server.js`
4. Students visit `YOU.R.IP/mousegame`

DEMO script:
Everyone's mouse shows up on each others' screen because every time you move your "mouse", its position is sent through to my server, which then relays its current position and id to every other player.


