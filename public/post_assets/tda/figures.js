/*
Configurations and utility functions for figures
*/

// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if(typeof require != "undefined") {
 // hack for loading from generator
 var d3 = require('./d3.min.js')
 var visualize = require('./visualize.js').visualize
 var tsnejs = require('./tsne.js')
 var demoConfigs = require('./demo-configs.js')
 var distanceMatrix = demoConfigs.distanceMatrix
 var Point = demoConfigs.Point
}

var FIGURES = {
  width: 150,
  height: 150,
  downscaleWidth: 300,
  downscaleHeight: 300,
}

function getPoints(demo, params) {
  if(!params) {
    params = [demo.options[0].start]
    if(demo.options[1]) params.push(demo.options[1].start)
    if(demo.options[2]) params.push(demo.options[2].start)
    if(demo.options[3]) params.push(demo.options[3].start)
    if(demo.options[4]) params.push(demo.options[4].start)
    if(demo.options[5]) params.push(demo.options[5].start)

  }
  var points = demo.generator.apply(null, params);
  return points;
}
function renderDemoInitial(demo, params, canvas) {
  visualize(points, [], canvas, null, null)
}



function demoMaker(points, canvas, options, stepCb) {
  var demo = {};

  // var tsne = new tsnejs.tSNE(options);
  // var dists = distanceMatrix(points);
  // tsne.initDataDist(dists);

  function redraw(epsilon) {
    // update the solution and render
    // var solution = tsne.getSolution().map(function(coords, i) {
    //   return new Point(coords, points[i].color);
    // });
    var complex = buildComplex(points, epsilon);

    visualize(points, complex, canvas, ""); //removed message
  }

  demo.destroy = function() {
    delete demo;
  }

  demo.redraw = redraw;

  redraw(options.epsilon);
  return demo;
}

if(typeof module != "undefined") module.exports = {
  demoMaker: demoMaker,
  runDemoSync: runDemoSync,
  getPoints: getPoints,
  FIGURES: FIGURES
}
