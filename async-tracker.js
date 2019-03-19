const eventLoopTracker = require('./event-loop-tracker');
const worker = require('worker_threads')
eventLoopTracker.enable();

const timeout = 0;

if (worker.isMainThread) {
  module.exports = function workerBuddy (script) {
  }
}



const sleep = (ms=0) => new Promise(resolve => setTimeout(resolve, ms))
//async function main() {
//  await sleep()
//  await sleep()
//  await sleep()
//  await sleep()
//  await sleep()
//}
//main()

process.nextTick(() => {
  function doLog () {
    console.log("hello world")
  }
  doLog()
  doLog()
  process.nextTick(() => {
    doLog()
    doLog()
    console.log("he's my guuuuuyyyyy")
  })
})

//setTimeout(() => {
//  //await sleep(100)
//  console.log('OUT: tick 0')
//  //setTimeout(() => {
//    //console.log('OUT: tick 1')
//  //}, timeout);
//
//  //setTimeout(() => {
//  //  setTimeout(() => {
//  //    setTimeout(() => {
//  //      setTimeout(async () => {
//  //        //console.log('OUT: tick 3')
//  //      }, timeout);
//  //      //console.log('OUT: tick 3')
//  //    }, timeout);
//  //    //console.log('OUT: tick 3')
//  //  }, timeout);
//  //  //console.log('OUT: tick 2')
//  //}, timeout);
//}, timeout);
