let bookingArr = [];
let cancelArr = [];
function saveBooing(input){

  let reserveInformation = input.trim().split(" ");
  let userId = reserveInformation[0];
  let date = reserveInformation[1];
  let time = reserveInformation[2];
  let site = reserveInformation[3];
  let start = parseInt(reserveInformation[2].slice(0,2));
  let end = parseInt(reserveInformation[2].slice(6,8));
  let cancel = reserveInformation[4];
  let tag;
  if(reserveInformation.length === 4){
    if(bookingArr.length === 0){
      bookingArr.push({userId,date,time,site});
      tag = "true";
    }else{
      const sameDateArr = bookingArr.filter((ele) => {
        return date === ele.date && site === ele.site;
      });
      if(sameDateArr.length === 0){
        bookingArr.push({userId,date,time,site});
        tag = 'true';
      }
      else{
        for(var i = 0; i < sameDateArr.length; i++) {
          if (date == sameDateArr[i].date) {
            let startTime = parseInt(sameDateArr[i].time.slice(0, 2));
            let endTime = parseInt(sameDateArr[i].time.slice(6, 8));
            if (end <= startTime || endTime <= start) {
              bookingArr.push({userId, date, time, site});
              tag = 'true';
            } else {
              tag = 'false';
            }
          }
        }
      }
    }
  }
  else{
        for(let i = 0; i < bookingArr.length; i++){
          if(userId === bookingArr[i].userId && date === bookingArr[i].date && time === bookingArr[i].time && site === bookingArr[i].site ){
            bookingArr.splice(i,1);
            tag = 'true';
            cancelArr.push({userId,date,time,site,cancel});
            break;
          }
          // else{
          //   tag = "false"
          // }
        }

    }
    return tag;
}

module.exports = {
  saveBooing,
  bookingArr,
  cancelArr
};
