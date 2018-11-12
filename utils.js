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

var loaded = personSegmentation.load();

async function getIndex(segmentation) {
    ctx1.drawImage(video, 0, 0, videoWidth, videoHeight);

    let frame = ctx1.getImageData(0, 0, videoWidth, videoHeight);
    let l = frame.data.length/4;
    //console.log(l)
    for (let i = 0; i < l; i++) {
        //console.log(segmentation[i])
        if (segmentation[i] == 0) {
            //console.log(segmentation[i])
            frame.data[i*4] = 255;
            frame.data[i*4 + 1] = 255;
            frame.data[i*4 + 2] = 255;
            //ctx2.putImageData(ctx1.getImageData(w,h,1, 1), w , h)
        }
    }
    // let l = frame.data.length / 4;
    //
    // for (let i = 0; i < l; i++) {
    //   let r = frame.data[i * 4 + 0];
    //   let g = frame.data[i * 4 + 1];
    //   let b = frame.data[i * 4 + 2];
    //   if (g > 10 && r > 10 && b < 43)
    //     frame.data[i * 4 + 3] = 0;
    // }
    ctx2.putImageData(frame, 0, 0);
    //     };
    // };
    // counter = 1;
    // console.log("loaded index");
    // //console.log(indexVideoImage);
    // var indexLength = 307200;
    // console.log(indexLength);
    // console.log(segmentation)
    // for (let i = 0; i < indexLength; i++ ) {
    //     if (segmentation[i] = 1) {
    //         console.log(segmentation[i]);
    //         //ctx.putImageData(ctx.getImageData(w,h,1, 1), w , h)
    //     } else {
    //         console.log('no');
    //     }
    // };
};

// // playing with the values
// //var video = {width: 10, height: 10}
// async function cutAvatar() {
//     console.log(segmentation);
//     // indexed.then(function(whatever) {
//     //     return addImageToCanvas();
//     // });
//     // console.log(indexVideoImage[1000]);
//     // console.log(indexVideoImage[1000][0]);
//     //ctx.putImageData(ctx.getImageData(0,0,videoWidth, videoHeight), 0 , 0)
//             // indexVideoImage[index].width = w;
//             // indexVideoImage[index].height = h;
//             //console.log(segmentation[index]);
//             // if (segmentation[index] == 1) {
//             //     console.log('yes');
//             //     ctx.putImageData(ctx.getImageData(w,h,1, 1), w , h)
//     //     };
//     // };
// };
//             // if (segmentation[index] == 0) {
//             //     ctx.putImageData()
//             // }
//     // let new_segments = segmentation;
//     // for (let i=0; i < segmentation.length; i++) {
//     //     if (new_segments[i] == 1) {
//     //       ctx.putImageData(ctx.getImageData(0,0,videoWidth, videoHeight), 0 , 0);
//     //   };
//     // };
//     // if(1) ctx.getImageData(w,h,1,1);
//     //     };
//     // };
// //};

async function runModel() {
    loaded.then(function(net){
      return net.estimatePersonSegmentation(video, flipHorizontal, 8, segmentationThreshold)
  }).then(function(segmentation){
      getIndex(segmentation);
      //console.log(segmentation);
      //personSegmentation.drawBodyMaskOnCanvas(
             //video, segmentation, canvas);
      // display alternate image
      // let new_segments = segmentation;
      // for (let i=0; i < new_segments.length; i++) {
      //     if (new_segments[i] == 1) {
      //       new_segments[i] = 255;
      //   };
      // }
      //console.log(new_segments);
      //console.log(base64)
      // img = new Image();
      // //img.src = "data:image/png;base64," + base64;
      // console.log(img)
      // var ctx = canvas.getContext('2d');
      // function drawSegments () {
      //   ctx.putImageData(new_segments, 0, 0);
      //   ctx.drawImage(img, 0, 0)
      //   //img.style.display = 'none';
      // };
      // drawSegments()
      requestAnimationFrame(runModel);
    });
}
