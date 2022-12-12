
var video = document.querySelector("#videoElement");
var mathStuff = {
  height:0,
  width:0,
  frameRate:0,
  rawRedBuffer:[],
  rawGreenBuffer:[],
  rawBlueBuffer:[],
  // sampleSize:20,
  sampleSize:256,
  // sampleSize:256*2,
  averageRed: 0,
  averageGreen: 0,
  averageBlue: 0,
  oscillations: [[],[],[]],
  ticks: 0,
}
const canvas = document.querySelector('#frameBuffer');
const ctx = canvas.getContext('2d');


function observationLoop(){
  mathStuff.rawGreenBuffer.push(getFrameGreen())
  console.log('data in')
  // console.log('data in', mathStuff.rawGreenBuffer[mathStuff.rawGreenBuffer.length-1])
  mathStuff.ticks += 1
  if(mathStuff.rawGreenBuffer.length < mathStuff.sampleSize){
    return
  }
  let totals = columnSum(mathStuff.rawGreenBuffer)
  // console.log(totals)
  let totalR = totals[0]
  let totalG = totals[1]
  let totalB = totals[2]
  // let totalR = mathStuff.rawGreenBuffer.reduce((a,b)=>a[0]+b[0], 0)
  // let totalG = mathStuff.rawGreenBuffer.reduce((a,b)=>a[1]+b[1], 0)
  // let totalB = mathStuff.rawGreenBuffer.reduce((a,b)=>a[2]+b[2], 0)
  console.log(totalR, totalG, totalB)
  mathStuff.averageRed = totalR/mathStuff.rawGreenBuffer.length
  mathStuff.averageGreen = totalG/mathStuff.rawGreenBuffer.length
  mathStuff.averageBlue = totalB/mathStuff.rawGreenBuffer.length
  console.log(mathStuff.averageRed, mathStuff.averageGreen, mathStuff.averageBlue)
  // console.log(mathStuff.rawGreenBuffer.length)
  findOscillations()
  if(mathStuff.ticks>(mathStuff.sampleSize+50)){
    console.log(mathStuff.oscillations);
    clearInterval(intervalTrackID);
  }
  // math stuffs
  mathStuff.rawGreenBuffer.shift()
}

function columnSum(arrayTwoD){
  let outputs = [0,0,0];
  for(let i = 0; i<arrayTwoD.length; i++){
    outputs[0] += arrayTwoD[i][0]
    outputs[1] += arrayTwoD[i][1]
    outputs[2] += arrayTwoD[i][2]
    // console.log(outputs)
  }  return outputs
}

function getFrameGreen(){
  // console.log(video.videoWidth)
  // console.log(video.srcObject.width)
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  let greenSum = 0;
  let redSum = 0;
  let blueSum = 0;
  ctx.drawImage(video, 0, 0, width, height);
  let pixels = ctx.getImageData(0,0, width, height);
  for(let i = 0; i<pixels.data.length; i+=4){
    let red =pixels.data[i+0];
    redSum += red
    let green =pixels.data[i+1];
    greenSum += green
    let blue =pixels.data[i+2];
    blueSum += blue
  }
  return [redSum, greenSum, blueSum]
}

function findOscillations(){
  for(let i = 0; i<mathStuff.rawGreenBuffer.length; i++){
    mathStuff.oscillations[0][i] = mathStuff.rawGreenBuffer[i][0]-mathStuff.averageRed
    mathStuff.oscillations[1][i] = mathStuff.rawGreenBuffer[i][1]-mathStuff.averageGreen
    mathStuff.oscillations[2][i] = mathStuff.rawGreenBuffer[i][2]-mathStuff.averageBlue
  }
}

function export_array(numbers){
  console.log(numbers.join(', '))
}

if (navigator.mediaDevices.getUserMedia) {
  console.log('getting user media')
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      console.log(stream)
      var track = stream.getVideoTracks()[0]
      console.log(track)
      console.log(track.getConstraints())
      console.log(track.getSettings())
      var trackSettings = track.getSettings()
      mathStuff.height = trackSettings.height
      mathStuff.width = trackSettings.width
      mathStuff.frameRate = trackSettings.frameRate
      console.log(mathStuff)
      video.srcObject = stream;
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

let intervalTrackID = setInterval(observationLoop, 33) 

/*
math facts:
 30fps -> once every ~33 ms
 60 bpm -> once every second
 I would like several cycles so it's got to be at least 5~10 seconds of data
 5000 ms of data means ~150 frames
 256 frames would be 256/30= ~8.5 seconds
 set it up to do either 256 frames or 512, see what feels better

  
*/ 