/**
 * Created by Davy on 17/02/2015.
 */
    var ffmpeg       = require('ffmpeg');
    var getPixels   = require('get-pixels');
    var ndarray     = require("ndarray");

var ledData = new Buffer((400*3)+3);

try {
    new ffmpeg('../upload/red.mp4', function (err, video) {
        if (!err) {
            video.fnExtractFrameToJPG('../upload/red', {
                frame_rate : 25,
                size: 107+'x'+48,
                file_name : 'Screen_%i'
            }, function (error, files) {
                if (!error)

                var newFiles = files.toString().split(',');

                for(var i = 1, len = newFiles.length; i<len; i++){
                    getPixels(newFiles[i], "image/jpeg", function(err, pixels){
                        if(err){
                            console.log(err);
                        }
                        else
                        {
                            var array = ndarray(pixels.data, pixels.shape, pixels.stride, pixels.offset);
                            var pixel = [];
                            var offset = 3;
                            var linesPerPin = 48/8;
                            var xbegin;
                            var xend;
                            var xinc;

                            for (var y = 0; y <linesPerPin; y++)
                            {
                                if((y&1)==(0)){
                                    xbegin = 0;
                                    xend = 107;
                                    xinc = 1;
                                }
                                else
                                {
                                    xbegin = 106;
                                    xend = -1;
                                    xinc = -1;
                                }
                                for(var x = xbegin; x!=xend; x+=xinc)
                                {
                                    for(var ii = 0; ii<8; ii++)
                                    {
                                        //Pixels from left to right, rows to down, RGB
                                        pixel[ii] = (array.get(ii,x,1)<<16)|(array.get(ii,x,0)<<8)|array.get(ii,x,2);
                                    }

                                    for(var mask = 0x800000; mask != 0; mask >>= 1)
                                    {
                                        var b = 0;
                                        for (var iii=0; iii<8;iii++)
                                        {
                                            if((pixel[iii] & mask) !=0) {
                                                b |= (1 << iii);
                                                console.log(b);
                                            }
                                        }
                                        ledData[offset++] = b;
                                    }
                                }

                                ledData[0] = '*';
                                var usec =((1000000.0 / 25) * 0.75);
                                var byte = usec & 0xff;

                                ledData[1] = byte;
                                ledData[2] = (byte >>8);

                                console.log(ledData.readUInt32BE(3));
                            }
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

var sortstring = function (a, b)    {
    a = a.toLowerCase();
    b = b.toLowerCase();
    if (a < b) return 1;
    if (a > b) return -1;
    return 0;
};