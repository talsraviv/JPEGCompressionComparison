var log = function(a){console.log(a)};

//THIS RECEIVES BACK FROM BACKGROUND AT THE END OF THE CALCULATION
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.state.length){
            //This is what the background gave us
            var original_vs_jpegmini = JSON.parse(request.state);

            var total_original_bytes = 0;
            var total_jpeg_mini_bytes = 0;

            //Calculate totals
            for(var original_url in original_vs_jpegmini['original']){
                //IF we have a url appearing in both objects that we can compare
                if (original_url in original_vs_jpegmini['jpegmini']){
                    //ADD IT TO BOTH SUMS
                    total_original_bytes += original_vs_jpegmini['original'][original_url]
                    total_jpeg_mini_bytes += original_vs_jpegmini['jpegmini'][original_url]
                }
            }
            log(original_vs_jpegmini);

            alert('The difference in sizes is...' + total_original_bytes + ' vs ' + total_jpeg_mini_bytes);
        }
    }
);