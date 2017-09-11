var saveBooking = require('./saveBooking');
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
      return false;
    }
    else if(reserveInformation.length === 4){
      if(saveBooking.saveBooing(input)){
        console.log("Success: the booking is accepted!");
        return true;
      }
      else{
        console.log("Error: the booking conflicts with existing bookings!");
        return false;
      }
    }
    else if(reserveInformation.length === 5){
      if(cancel.test(reserveInformation[4])){
        if(saveBooking.saveBooing(input)){
          console.log("Success: the booking is accepted!");
          return true;
        }
        else{
          console.log("Error: the booking being cancelled does not exist!");
          return false;
        }
      }
      else{
        console.log("Error: the booking is invalid!");
        return false;
      }
    }
    else{
      console.log("Error: the booking is invalid!");
      return false;
    }
  }

}

module.exports = verifyInput;
