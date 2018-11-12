////////////////////////////////////////////////////////////////////////
// rewrite and modification of tensorflow person-segmentation masking//
//////////////////////////////////////////////////////////////////////

// major code sources:
// *https://github.com/tensorflow/tfjs-models/tree/master/person-segmentation
// *https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas


var outputStride = 16;
var flipHorizontal = false;
var segmentationThreshold = 0.5;
const canvas1 = document.getElementById('output1');
var ctx1 = canvas1.getContext('2d');
const canvas2 = document.getElementById('output2');
var ctx2 = canvas2.getContext('2d');
const videoWidth = 640;
const videoHeight = 480;
var segmentation = 0;

// The video element on the page to display the webcam
let video = document.getElementById('thevideo');

//hide video Feeds
document.getElementById('thevideo').style.display = 'none';
document.getElementById('output1').style.display = 'none';

// Constraints - what do we want?
let constraints = { audio: false, video: true }

// Prompt the user for permission, get the stream
navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    video.width = videoWidth;
    video.height = videoHeight;
    video.srcObject = stream;
    video.onloadedmetadata = function(e) {
            video.play();
            runModel();
    };
})
.catch(function(err) {
    alert(err);
});

//preload the personSegmentation from prediction to speed up process
var loaded = personSegmentation.load();

// mask the video feed based on segmentation data
async function maskVideo(segmentation) {
    ctx1.drawImage(video, 0, 0, videoWidth, videoHeight);

    let frame = ctx1.getImageData(0, 0, videoWidth, videoHeight);
    let l = frame.data.length/4;
    for (let i = 0; i < l; i++) {
        if (segmentation[i] == 0) {
            frame.data[i*4] = 255;
            frame.data[i*4 + 1] = 255;
            frame.data[i*4 + 2] = 255;
        }
    }
    ctx2.putImageData(frame, 0, 0);
};

// main function in cascade-mode
async function runModel() {
    loaded.then(function(net){
      return net.estimatePersonSegmentation(video, flipHorizontal, 8, segmentationThreshold)
  }).then(function(segmentation){
      maskVideo(segmentation);
      // loops the function in a browser-sustainable way
      requestAnimationFrame(runModel);
    });
}
