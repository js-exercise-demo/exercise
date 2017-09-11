let readline = require('readline');
let verifyInput = require('./modules/verifyInput');
let earnings = require('./modules/earnings');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
    if(input != ""){
      verifyInput(input);
    }
    else {
      earnings.main();
      rl.close()
    }
});
