const config = require('./config.js');
const util = require('util');

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

var visualRecognition = new VisualRecognitionV3({
  version: config.watson.version,
  iam_apikey: config.watson.iam_apikey
});

const threshold = 0.6;

const watson = {

  classifyImage: function(image, classifierIds, cb) {

    var params = {
      classifier_ids: classifierIds,
      treshold: threshold
    };

    if (typeof image === 'string')
      params['url'] = image;
    else
      params['images_file'] = image;

    visualRecognition.classify(params, cb);
  },

  getClassifiers: function(fetchDetails = true, cb) {
    visualRecognition.listClassifiers({verbose: fetchDetails}, cb);
  },

  updateModel: function(posClassNames, posFiles, negFiles, classifierId, cb) {

    if (posClassNames.length !== posFiles.length) {
      console.log('Positive class name and file arrays must be of equal lengths');
      return;
    }

    var params = {
      classifier_id: classifierId,
      negative_examples: negFiles
    };

    for (var i=0; i < posClassNames.length; i++) {
      params[`${posClassNames[i]}_positive_example`] = posFiles[i];
    }

    visualRecognition.updateClassifier(params, cb);
  },

  downloadCoreMlModel: function(classifierId, cb) {
    visualRecognition.getCoreMlModel({classifier_id: classifierId}, cb);
  }

}

module.exports = watson;
