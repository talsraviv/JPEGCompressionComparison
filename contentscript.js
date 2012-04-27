/*
var original_url_and_size = {
    'http://google.com/google.jpg': 300
};
*/

//Intercept every IMG request

//Calculate HEADER content-length

//Calculate URL








/**********************************************/


//For every url, convert it to jpegMINI Dan URL
//http://www.logostage.com/logos/Google.png => http://jpegmini.com/convert?url=http://www.logostage.com/logos/Google.png

//var new_url = "http://jpegmini.com/convert?url=" + old_url

//For every url, make a AJAX HEAD request and save Content-length
var xhr = new XMLHttpRequest();
xhr.open('HEAD', 'http://www.logostage.com/logos/Google.png', true);
xhr.onreadystatechange = function(){
    if ( xhr.readyState == 4 ) {
        if ( xhr.status == 200 ) {
            alert('Size in bytes: ' + xhr.getResponseHeader('Content-Length'));
        } else {
            alert('ERROR');
        }
    }
};
xhr.send(null);




/*
 var jpegmini_url_and_size = {
 'http://google.com/google.jpg': 30
 };
*/
