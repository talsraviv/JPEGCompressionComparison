//make life easier for us to debug by shortening the name of the console log function
var log = function(a){console.log(a)};

delete localStorage.state; //reset

//INITIALIZE OUR MAIN STATE OBJECT FOR KEEPING TRACK OF ALL DATA WE COLLECT
state = {
    //looks like this
    //UNIQUE KEY: tab.id + "_" + url
    //VALUE: {original: {original_img_url: size...}, jpegmini:{jpegmini_img_url: size...}}
};

last_request_globally_began = 0;

//FOR EVERY SINGLE IMAGE CHROME DOWNLOADS ANYWHERE, STORE IT IN OUR STATE VARIABLE
chrome.webRequest.onResponseStarted.addListener(
    function(details) {

        var content_length;
        for (var i = 0; i<details.responseHeaders.length; i++){
            try{
                if (details.responseHeaders[i].name === 'Content-Length'){
                    content_length = details.responseHeaders[i].value;
                }
            }
            catch (e){}
        }

        //NEXT GET THE URL OF THE ENTIRE TAB TO USE IN OUR STATE
        if (details.tabId >= 0){ //Ignore background requests
            chrome.tabs.get(details.tabId, function(tab){
                var tabURL = tab.url;
                //FIRST CREATE UNIQUE KEY TO STORE THIS TAB'S DATA
                var key = details.tabId + '_' + tabURL;
                //NEXT, IF FIRST TIME, CREATE EMPTY TEMPLATE FOR STORING IMAGE INFO
                if (!state[key]) state[key] = {
                    original: {/* will contain... url: bytes, url: bytes*/},
                    jpegmini: {/* will contain... url: bytes, url: bytes*/}
                };
                //FINALLY SAVE THE DATA FOR THE SINGLE IMAGE WE JUST PROCESSED
                state[key]['original'][details.url] = content_length;
                localStorage.state = JSON.stringify(state);

                //NOW FIGURE OUT IF DONE OR IF OTHER IMAGES STILL LOADING

                var request_began = (new Date()).getTime();
                last_request_globally_began = request_began;
                setTimeout(function(this_request_began){
                    //wait a few seconds to let other requests begin - assuming no image starts more than 3 seconds after the last
                    //IF another request has NOT begun since
                    return function(){
                        if (this_request_began === last_request_globally_began){
                            log('Completed loading original images');
                            //Now we know this was the last image
                            calculate_jpeg_mini(key, function(){
                                //when this is done, log the state
                                log('DONE')
                                log(JSON.parse(localStorage.state));
                                chrome.tabs.sendRequest(tab.id, {state:localStorage.state});
                            });
                        }
                    }
                }(request_began), 6000);
            });
        }
        return {};
    },
    { //ONLY LOOK AT IMAGE REQUESTS FROM ANY SOURCE
        types: ["image"],
        urls: ["<all_urls>"]
    },
    [
        "responseHeaders"
    ]
);

function calculate_jpeg_mini(key, callback){ //callback is called when done
    log('calculating jpeg mini version');
    var request_counter = 0;
    var outstanding_requests = {};
    var original_urls_and_sizes = state[key]['original'];
    for (var url in original_urls_and_sizes){
        //TODO: For every url, convert it to jpegMINI Dan URL
        //for example: http://www.logostage.com/logos/Google.png => http://jpegmini.com/convert?url=http://www.logostage.com/logos/Google.png
        //var new_url = "http://jpegmini.com/convert?url=" + old_url
        var jpegMiniURL = url; //PLACEHOLDER
        var request_id = 'request_number_' + (request_counter++);
        outstanding_requests[request_id] = 'true';
        log('Made ' + request_id)
        log(outstanding_requests)
        //For every url, make a AJAX HEAD request and save Content-length
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', jpegMiniURL, true);
        xhr.onreadystatechange = function(this_xhr, request_id){
            return function(event){
                if ( this_xhr.readyState == 4 ) {
                    if ( this_xhr.status == 200 ) {
                        //log(this_xhr)
                        //Save the value of the jpegMini size
                        state[key]['jpegmini'][jpegMiniURL] = this_xhr.getResponseHeader('Content-Length');
                        localStorage.state = JSON.stringify(state);
                    } else {
                        //log(this_xhr)
                        //error
                    }
                    log('Received ' + request_id)
                    //delete outstanding_requests[request_id];
                    log(outstanding_requests);
                    //TODO: Call callback() for the rest of the program to return to the contentscript
                }
            };
        }(xhr, request_id);
        xhr.send(null);
    }
}

