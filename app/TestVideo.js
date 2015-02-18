/**
 * Created by Davy on 17/02/2015.
 */
    var ffmpeg       = require('ffmpeg');
    var getPixels   = require('get-pixels');
    var ndarray     = require("ndarray");

try {
    new ffmpeg('../upload/test.mp4', function (err, video) {
        if (!err) {
            video.fnExtractFrameToJPG('../upload/test', {
                frame_rate : 25,
                size: 175+'x'+100,
                file_name : '%i'
            }, function (error, files) {
                if (!error)
                    console.log('Frames: ' + files);

                var newFiles = files.toString().split(',');
                for(var i = 1, len = newFiles.length; i<len; i++){
                    getPixels(newFiles[i], "image/jpeg", function(err, pixels){
                        if(err){
                            console.log(err);
                        }
                        else
                        {
                            var array = ndarray(pixels.data, pixels.shape, pixels.stride, pixels.offset);
                            var ledData = [];

                            for(var i = 0, len = pixels.shape[0]; i< len; i++)
                            {
                                for(var ii = 0, lenn = pixels.shape[1]; ii<lenn; ii++)
                                {
                                    ledData.push([array.get(ii,i,0),array.get(ii,i,1),array.get(ii,i,2)]);
                                }
                            }

                            console.log('px');
                        }
                    });
                }
            });
        } else {
            console.log('Error: ' + err);
        }
    });
} catch (e) {
    console.log(e.code);
    console.log(e.msg);
}