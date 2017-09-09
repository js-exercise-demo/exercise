var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
    if(input != ""){
      verifyInput(input);
    }
    else {
      console.log("aa");
      rl.close()
    }
});

function verifyInput(input){
  let reserveInformation = input.trim().split(" ");

  if(reserveInformation.length < 4){
    console.log("Error: the booking is invalid!");
  }
  else{

    let userId = /[U]\d{3}/;
    let date = /^\d{4}-\d{2}-\d{2}$/;
    let time = /^([0][9]|[1][0-9]|[2][0-2]):([0]{2})~([0][9]|[1][0-9]|[2][0-2]):([0]{2})$/;
    let start = parseInt(reserveInformation[2].slice(0,2));
    let end = parseInt(reserveInformation[2].slice(6,8));
    let site = /[A,B,C,D]{1}/;
    let cancel = /[C]{1}/;

    if(!userId.test(reserveInformation[0]) || !date.test(reserveInformation[1]) || !time.test(reserveInformation[2]) ||
      !(start < end) || !site.test(reserveInformation[3])){
      console.log("Error: the booking is invalid!");
    }
    else if(reserveInformation.length === 4){
      console.log("Success: the booking is accepted!");
    }
    else if(reserveInformation.length === 5){
      if(cancel.test(reserveInformation[4])){
        console.log("Success: the booking is accepted!");
      }
      else{
        console.log("Error: the booking is invalid!");
      }
    }
    else{
      console.log("Error: the booking is invalid!");
    }
  }

}
