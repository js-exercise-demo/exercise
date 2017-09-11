let verifyInput = require("../src/modules/verifyInput");
let saveBooking = require("../src/modules/saveBooking");
let earnings = require("../src/modules/earnings");
describe('badminton court', function () {

  it('should reverseInformation meet a criterion', function() {
    let input = 'U002 2017-08-01 19:00~22:00 A';
    expect(verifyInput(input)).toEqual(true)
  });

  it('should reverseInformation without repetition',function () {
    let input = 'U003 2017-08-01 18:00~20:00 A';
    expect(verifyInput(input)).toEqual(false);
  });

  it('should cancelInformation existed',function () {
    let input = 'U002 2017-08-01 19:00~22:00 A C';
    expect(verifyInput(input)).toEqual(true);
  });

  it('should reverse is date and time without repetition',function () {
    let input = 'U002 2017-08-01 19:00~22:00 A';
    expect(saveBooking.saveBooing(input)).toEqual(true);
  });

  it('should every site reserve information',function () {
    let expected = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 }],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    expect(earnings.getBookingRecords()).toEqual(expected);
  });

  it('should every site cancel information',function () {
    let expected = {
      bookSubtotalA:[{ ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100}],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    expect(earnings.getCancelRecords()).toEqual(expected);
  });

  it('should merge reverse and cancel information',function () {
    let bookSubtotal = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 }],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    let cancelSubtotal = {
      bookSubtotalA:[{ ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100}],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    let expected = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100}],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    expect(earnings.getSiteSubtotal(bookSubtotal,cancelSubtotal)).toEqual(expected)
  });

  it('should time is arranged in ascending order',function () {
    let reverses = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100},
        { ele: { userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }, subTotal: 200 }],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    let expected = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }, subTotal: 200 },
        { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100},],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    expect(earnings.sortBookSubtotal(reverses)).toEqual(expected);
  });

  it('should every site charge',function () {
    let reverses = {
      bookSubtotalA:[{ ele: { userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }, subTotal: 200 },
        { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' },subTotal:100},],
      bookSubtotalB:[],
      bookSubtotalC:[],
      bookSubtotalD:[]
    };
    let expected = [
      { itemTotal: [{ ele: Object({ userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }), subTotal: 200 },
       { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' }, subTotal: 100 } ],
        total: 500, site: 'A' },
      { itemTotal: [  ], total: 0, site: 'B' },
      { itemTotal: [  ], total: 0, site: 'C' },
      { itemTotal: [  ], total: 0, site: 'D' }];
    expect(earnings.getSiteTotal(reverses)).toEqual(expected);
  });

  it('should court total charge',function () {
    let reversesTotal = [
      { itemTotal: [{ ele: Object({ userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }), subTotal: 200 },
        { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
        { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' }, subTotal: 100 } ],
        total: 500, site: 'A' },
      { itemTotal: [  ], total: 0, site: 'B' },
      { itemTotal: [  ], total: 0, site: 'C' },
      { itemTotal: [  ], total: 0, site: 'D' }];
    let expected = {
      bookItemTotal:[
        { itemTotal: [{ ele: Object({ userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }), subTotal: 200 },
          { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
          { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' }, subTotal: 100 } ],
          total: 500, site: 'A' },
        { itemTotal: [  ], total: 0, site: 'B' },
        { itemTotal: [  ], total: 0, site: 'C' },
        { itemTotal: [  ], total: 0, site: 'D' }],
      charge:500
    };
    expect(earnings.getCharge(reversesTotal)).toEqual(expected);
  });

  it('should printText',function () {
    let courtCharge = {
      bookItemTotal:[
        { itemTotal: [{ ele: Object({ userId: 'U002', date: '2017-08-01', time: '13:00~15:00', site: 'A' }), subTotal: 200 },
          { ele: { userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A' }, subTotal: 200 },
          { ele:{ userId: 'U002', date: '2017-08-01', time: '19:00~22:00', site: 'A', cancel: 'C' }, subTotal: 100 } ],
          total: 500, site: 'A' },
        { itemTotal: [  ], total: 0, site: 'B' },
        { itemTotal: [  ], total: 0, site: 'C' },
        { itemTotal: [  ], total: 0, site: 'D' }],
      charge:500
    };
    let expected = `收入汇总
---
场地:A
2017-08-01 13:00~15:00 200元
2017-08-01 19:00~22:00 200元
2017-08-01 19:00~22:00 违约金 100元
小计:500元
      
场地:B
小计:0元
      
场地:C
小计:0元
      
场地:D
小计:0元
---
总计:500元`;
    expect(earnings.printCourtCharge(courtCharge)).toEqual(expected);
  })
});
