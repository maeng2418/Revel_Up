// public/javascripts/main.js

var load = function() {
	var httpRequest = new XMLHttpRequest()
	httpRequest.onload = function(data) {
    // process response
    if (httpRequest.status == 200) {
        // parse JSON data
        var json_data = JSON.parse(httpRequest.response);
		console.log(json_data);
		var text = "";
		json_data.forEach(function(item){
			text +=
				"<a id='show_detail' href='/detail?item="+item._id+"'>"
				+"<div class='res_card'>"+item.res_name+"</div>"
				+"<div class='img_card'>"
				+"<img class='res_img' src='"+item.image+"'></img>"
				+"</div>"
				+"<div class='address_card'>"+item.address+"</div>"
				+"</div></a>"
			
		})
		document.getElementById("res_info").innerHTML = text;

    } else {
        console.error('Error!');
    }
};
	httpRequest.open('GET', '/load')
	httpRequest.send()
}

document.addEventListener('DOMContentLoaded', function() {
  // code
	load();
})
