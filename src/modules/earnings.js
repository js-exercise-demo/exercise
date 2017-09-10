let saveBooking = require('./saveBooking');
let allCharges = require('./loadAllCharge');

function getBookingRecords() {
  let bookSubtotal = [];
  let bookingSiteA = [],bookingSiteB = [],bookingSiteC = [],bookingSiteD = [];
  let bookingArr = saveBooking.bookingArr;
  bookingArr.map((ele) => {
    switch(ele.site){
      case 'A':
        bookingSiteA.push(ele);break;
      case 'B':
        bookingSiteB.push(ele);break;
      case 'C':
        bookingSiteC.push(ele);break;
      case 'D':
        bookingSiteD.push(ele);break;
    }
  });
  let bookSubtotalA = getBookingSubTotal(bookingSiteA);

  let bookSubtotalB = getBookingSubTotal(bookingSiteB);
  let bookSubtotalC = getBookingSubTotal(bookingSiteC);
  let bookSubtotalD = getBookingSubTotal(bookingSiteD);
  bookSubtotal.push({bookSubtotalA,bookSubtotalB,bookSubtotalC,bookSubtotalD});
  console.log(bookSubtotalA,bookSubtotal);
}

function getBookingSubTotal(reverseArr){
  let reverseSubtotal = [];
  let workingDays = [1,2,3,4,5];
  reverseArr.map((ele) => {
    let subTotal = 0;
    let week = new Date(ele.date).getDay();
    let start = parseInt(ele.time.slice(0,2));
    let end = parseInt(ele.time.slice(6,8));
    if(JSON.stringify(workingDays).indexOf(week) != -1){
      allCharges[0].weekDays.map((ele) => {
        let startTime = parseInt(ele.date.slice(0,2));
        let endTime = parseInt(ele.date.slice(6,8));
        if(startTime <= start && end <= endTime){
          subTotal = (end-start) * ele.price
        }else if(start>= startTime && start <= endTime){
          subTotal += (endTime - start) * ele.price;
        }else if(end >= startTime && end <= endTime){
            subTotal += (end - startTime) * ele.price
        }else if (start <= startTime && end >= endTime){
          subTotal += (endTime - startTime) * ele.price;
        }
      })
    }
    else{
      allCharges[1].weekends.map((ele) => {
        let time1 = parseInt(ele.date.slice(0,2));
        let time2 = parseInt(ele.date.slice(6,8));
        if(time1 <= start && end <= time2){
          subTotal = (end-start) * ele.price
        }else if(start >= time1 && start <= time2){
          subTotal += (time2 - start) * ele.price;
        }else if(end >= time1 && end <= time2){
          subTotal += (end - time1) * ele.price
        }else if (start <= time1 && end >= time2){
          subTotal += (time2 - time1) * ele.price;
        }
      })
    }
    reverseSubtotal.push({ele,subTotal});
  });
  return reverseSubtotal;
}

function getSiteCharge(bookSubtotal){
  let charge = 0;
  bookSubtotal.map((ele) => {
    charge += ele.subTotal;
  })
  return {bookSubtotal,charge};
}
module.exports = getBookingRecords;
