/**
 * Created by Davy on 17/02/2015.
 */
var getPixels = require('get-pixels');
var ndarray = require("ndarray");

getPixels('../upload/red.jpg', "image/jpeg", function(err, pixels){
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

       console.log(ledData);
   }
});