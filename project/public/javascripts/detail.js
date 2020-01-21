// public/javascripts/main.js
var item = document.location.href.split("?")[1];
var item2 = item.split("=")[1];
var load = function() {
	var httpRequest = new XMLHttpRequest()
	httpRequest.onload = function(data) {
    // process response
    if (httpRequest.status == 200) {
        // parse JSON data
        var json_data = JSON.parse(httpRequest.response);
		console.log(json_data);
		var detail_image = json_data[0].image;
		var detail_name = json_data[0].res_name;
		var detail_address = json_data[0].address;
		var detail_time = json_data[0].running_time;
		var detail_contact = json_data[0].contact;
		var detail_like = json_data[0].like;
			

    } else {
        console.error('Error!');
    }
	document.getElementById("detail_image").innerHTML = "<img id='detail_img' src='"+detail_image+"'></img>";
	document.getElementById("detail_name").append(detail_name);
	document.getElementById("detail_address").append(detail_address);
	document.getElementById("detail_time").append(detail_time);
	document.getElementById("detail_contact").append(detail_contact);
	document.getElementById("detail_like").append(detail_like);
};
	httpRequest.open('GET', '/load_detail?'+item)
	httpRequest.send()
}

document.addEventListener('DOMContentLoaded', function() {
  // code
	load();
	console.log(item);
})

function book() {
	window.location.href='/book?item='+item2;
}
