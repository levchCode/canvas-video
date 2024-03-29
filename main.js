let video;
let poseNet;
let poses = [];
let skeletons = [];
let recorder;

function setup() {
  width = 640
  height = 480

  var c = createCanvas(width, height);
  c.id("sample")
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  
  //video.hide();

  const canvas = document.getElementById('sample')
  recorder = new CanvasRecorder(canvas, {
    disableLogs: false
  });
  
}

function modelReady() {
  console.log('Model Loaded');
}

function draw() {
  //image(video, 0, 0, width, height);
  background(255)
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

// The nested try blocks will be simplified when Chrome 47 moves to Stable
function startRecording() {
  recorder.record();
}


function stopRecording() {
  recorder.stop(function(blob) {
    var url = URL.createObjectURL(blob);
    window.open(url);
});
}
