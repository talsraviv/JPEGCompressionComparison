//THIS RECEIVES BACK FROM BACKGROUND AT THE END OF THE CALCULATION
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.state.length){
            var state = JSON.parse(request.state);
            //TODO: Process the state object and tell the user the size difference
            //REMEMBER THAT THE ORIGINAL AND JPEGMINI OBJECTS MAY NOT TOTALLY MATCH
            //SO ONLY CALCULATE URLS THEY HAVE IN COMMON
            alert('The difference in sizes is...');
            console.log(state);
        }
    }
);