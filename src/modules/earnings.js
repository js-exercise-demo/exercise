let saveBooking = require('./saveBooking');
let allCharges = require('./loadAllCharge');

function getBookingRecords() {

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
  let bookSubtotal = {bookSubtotalA,bookSubtotalB,bookSubtotalC,bookSubtotalD};
  return bookSubtotal;
}

function getCancelRecords(){
  let cancelSiteA = [],cancelSiteB = [], cancelSiteC = [], cancelSiteD = [];
  let cancelArr = saveBooking.cancelArr;
  cancelArr.map((ele) => {
    switch (ele.site) {
      case 'A':
        cancelSiteA.push(ele);
        break;
      case 'B':
        cancelSiteB.push(ele);
        break;
      case 'C':
        cancelSiteC.push(ele);
        break;
      case 'D':
        cancelSiteD.push(ele);
        break;
    }
  });
  let cancelSubtotalA = getBookingSubTotal(cancelSiteA);
  let cancelChargeA = getCancelSubtotal(cancelSubtotalA);
  let cancelSubtotalB = getBookingSubTotal(cancelSiteB);
  let cancelChargeB = getCancelSubtotal(cancelSubtotalB);
  let cancelSubtotalC = getBookingSubTotal(cancelSiteC);
  let cancelChargeC = getCancelSubtotal(cancelSubtotalC);
  let cancelSubtotalD = getBookingSubTotal(cancelSiteD);
  let cancelChargeD = getCancelSubtotal(cancelSubtotalD);
  let cancelSubtotal = {bookSubtotalA:cancelChargeA,bookSubtotalB:cancelChargeB,bookSubtotalC:cancelChargeC,bookSubtotalD:cancelChargeD};
  return cancelSubtotal;
}

function getCancelSubtotal(cancelSubtotal) {
  let workingDays = [1,2,3,4,5];
  cancelSubtotal.map((ele) => {
    let week = new Date(ele.ele.date).getDay();
    if(workingDays.indexOf(week) != -1){
      ele.subTotal = ele.subTotal/2;
    }else{
      ele.subTotal = ele.subTotal/4;
    }
  });
  return cancelSubtotal;
}

function calculateSubtotal(start,end,ele,subTotal) {
  let time1 = parseInt(ele.date.slice(0,2));
  let time2 = parseInt(ele.date.slice(6,8))
  if(time1 <= start && end <= time2){
    subTotal = (end-start) * ele.price
  }else if(start >= time1 && start <= time2){
    subTotal += (time2 - start) * ele.price;
  }else if(end >= time1 && end <= time2){
    subTotal += (end - time1) * ele.price
  }else if (start <= time1 && end >= time2){
    subTotal += (time2 - time1) * ele.price;
  }
  return subTotal
}

function getBookingSubTotal(reverseArr){
  let reverseSubtotal = [];
  let workingDays = [1,2,3,4,5];
  reverseArr.map((ele) => {
    let subTotal = 0;
    let week = new Date(ele.date).getDay();
    let start = parseInt(ele.time.slice(0,2));
    let end = parseInt(ele.time.slice(6,8));
    if(workingDays.indexOf(week) != -1){
      allCharges[0].weekDays.map((ele) => {
        subTotal = calculateSubtotal(start,end,ele,subTotal);
      })
    }
    else{
      allCharges[1].weekends.map((ele) => {
        subTotal = calculateSubtotal(start,end,ele,subTotal)
      })
    }
    reverseSubtotal.push({ele,subTotal});
  });
  return reverseSubtotal;
}

function getSiteTotal(itemSubtotal) {
  let bookItemTotal = [];
  for (let props in itemSubtotal) {
    let total = 0;
    itemSubtotal[props].map((ele) => {
      total += ele.subTotal;
    });
    let site = props.slice(props.length-1,props.length);
    let  itemTotal = itemSubtotal[props];
    bookItemTotal.push({itemTotal,total,site});
  }
  return bookItemTotal;
}

function getSiteSubtotal(bookSubtotal,cancelSubtotal){
  for(let props in bookSubtotal){
    for(let temp in cancelSubtotal){
      if(props === temp){
        cancelSubtotal[temp].forEach((ele) => {
          bookSubtotal[props].push(ele);
        })
      }
    }
  }
  return bookSubtotal;
}

function sortBookSubtotal(reverseSubtotal){
  for(let props in reverseSubtotal){
   reverseSubtotal[props].sort((prve,next) => {
      let x = new Date(prve.ele.date +" " + prve.ele.time.slice(0,5));
      let start = x.getTime();
      let y = new Date(next.ele.date +" " + next.ele.time.slice(0,5));
     let end = y.getTime();
      return start - end;
    })
  }
  return reverseSubtotal;
}

function getCharge(bookItemTotal) {
  let charge = 0;
  bookItemTotal.map((ele) => {
    charge += ele.total;
  });
  return {bookItemTotal,charge};
}

function printCourtCharge(courtCharge) {
  let chargeText = `收入汇总
---
`;
  courtCharge.bookItemTotal.map((itemTotal,index) => {
    chargeText += `场地:${itemTotal.site}
`;
    itemTotal.itemTotal.map((itemSubtotal) => {
      let key = Object.keys(itemSubtotal.ele);
      if(key.length === 4){
        chargeText += `${itemSubtotal.ele.date} ${itemSubtotal.ele.time} ${itemSubtotal.subTotal}元
`
      }else{
        chargeText += `${itemSubtotal.ele.date} ${itemSubtotal.ele.time} 违约金 ${itemSubtotal.subTotal}元
`
      }
    });
    if(index === 3){
      chargeText += `小计:${itemTotal.total}元
`;
    }
    else{
      chargeText += `小计:${itemTotal.total}元
      
`;
    }
  });
  chargeText += `---
总计:${courtCharge.charge}元`;
  return chargeText;
}

function main() {
  let bookSubtotal = getBookingRecords();
  let cancelSubtotal = getCancelRecords();
  let reserveSubtotal = getSiteSubtotal(bookSubtotal,cancelSubtotal);
  let itemSubtotal = sortBookSubtotal(reserveSubtotal);
  let bookItemTotal = getSiteTotal(itemSubtotal);
  let courtCharge = getCharge(bookItemTotal);
  let chargeText = printCourtCharge(courtCharge);
  console.log(chargeText);
  return chargeText;
}

module.exports = {
  getBookingRecords,
  getCancelRecords,
  getSiteSubtotal,
  sortBookSubtotal,
  getSiteTotal,
  getCharge,
  printCourtCharge,
  main
};
