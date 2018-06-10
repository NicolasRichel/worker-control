/**
 * A very basic workerfor test.
 */

// Handle Messages
self.onmessage = (e) => {
  console.log('Worker : I got a message : ', e.data);
};

// Handle Errors
self.onerror = (e) => {
  console.log('Worker : an error occurred : ', e.error);
};
