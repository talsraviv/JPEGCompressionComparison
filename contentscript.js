//THIS RECEIVES BACK FROM BACKGROUND AT THE END OF THE CALCULATION
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if (request.state.length){
            var state = JSON.parse(request.state);
            //TODO: Process the state object and tell the user the size difference
            alert('The difference in sizes is...');
        }
    }
);