// Declare variables for the song, FFT analysis, amplitude, and frequency bands
let song; // The sound file variable
let fft; // Fast Fourier Transform object for frequency analysis
let amplitude; // Object to analyze volume
let bass, mid, treble; // Variables to store energy for different frequency bands

let songStarted = false; // Flag to track whether the song has started

// Preload function to load the sound file before setup
function preload() {
  song = loadSound('music.mp3'); // Load the sound file
}

// Setup function to initialize the canvas, p5 objects
function setup() {
  createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window

  // Create an Amplitude object to analyze volume
  amplitude = new p5.Amplitude();
  amplitude.setInput(song); // Set the input for volume analysis to the loaded sound

  // Create an FFT object to analyze the frequency spectrum
  fft = new p5.FFT();
  fft.setInput(song); // Set the input for frequency analysis to the loaded sound
}

// Draw function, called continuously, to update and display visuals
function draw() {
  // Set background color with low alpha for a trailing effect
  background(255, 10);

  // Get the current volume level of the song
  let level = amplitude.getLevel();

  // Analyze the frequency spectrum and get energy for different bands
  let spectrum = fft.analyze();
  bass = fft.getEnergy("bass");
  mid = fft.getEnergy("mid");
  treble = fft.getEnergy("treble");

  // Analyze the frequency spectrum and draw a dynamic wave
  let dynamicWaveSpectrum = fft.analyze();
  drawDynamicWave(dynamicWaveSpectrum);

  // Check if the mouse is pressed and the song hasn't started yet
  if (mouseIsPressed && !songStarted) {
    song.play(); // Start playing the song
    songStarted = true; // Update the flag
  }

  // You can add other visual elements or effects here if desired
}

// Function to draw a dynamic wave based on the frequency spectrum
function drawDynamicWave(spectrum) {
  // Center the drawing on the screen
  translate(width / 2, height / 2);

  // Set the style for the dynamic wave
  noFill();
  stroke(50);
  strokeWeight(2);

  // Begin drawing the shape of the dynamic wave
  beginShape();
  for (let i = 0; i < spectrum.length; i++) {
    
    // Map the frequency value to the vertical position
    let freqValue = map(spectrum[i], 0, 255, -height / 5, height / 4);
    let x = map(i, 0, spectrum.length, 0, width);

    // Introduce a secondary sine function to control the amplitude
    let snakeAmplitude = height / 200 * sin(frameCount * 0.02);

    // Calculate y position with the snake-like undulation
      let y = height / 2 + freqValue * sin(frameCount * 0.01 + x * 0.01 + snakeAmplitude) +
          freqValue * 0.5 * cos(frameCount * 0.02 + x * 0.02 + snakeAmplitude);

    // Adjust the vertex positions based on the translation
    vertex(x - width / 2, y - height / 2);
  }
  // End the shape
  endShape();
}
