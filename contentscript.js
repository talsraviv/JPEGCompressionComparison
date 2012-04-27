var log = function(a){console.log(a)};

//THIS RECEIVES BACK FROM BACKGROUND AT THE END OF THE CALCULATION
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.state.length){
            var original_vs_jpegmini = JSON.parse(request.state);
            //TODO: Process the state object and tell the user the size difference
            //REMEMBER THAT THE ORIGINAL AND JPEGMINI OBJECTS MAY NOT TOTALLY MATCH
            //SO ONLY CALCULATE URLS THEY HAVE IN COMMON
            var total_original_bytes = 0;
            var total_jpeg_mini_bytes = 0;
            for(var original_url in original_vs_jpegmini['original']){
                //IF we have a url appearing in both objects
                if (original_url in original_vs_jpegmini['jpegmini']){
                    total_original_bytes += original_vs_jpegmini['original'][original_url]
                    total_jpeg_mini_bytes += original_vs_jpegmini['jpegmini'][original_url]
                }
            }
            log(original_vs_jpegmini);
            alert('The difference in sizes is...' + total_original_bytes + ' vs ' + total_jpeg_mini_bytes);
        }
    }
);