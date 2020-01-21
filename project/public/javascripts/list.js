// public/javascripts/main.js
var res_id = prompt('Res_id를 입력해주세요.', '');

var load = function() {
	var httpRequest = new XMLHttpRequest()
	httpRequest.onload = function(data) {
    // process response
    if (httpRequest.status == 200) {
        // parse JSON data
        var json_data = JSON.parse(httpRequest.response);
		var text = "";
		json_data.forEach(function(item){
			text +="<div class='book_title'>"+"예약자명 : "+item.guest_name+"</div>"})
    } else {
        console.error('Error!');
    }
		document.getElementById("list").innerHTML = text;
};
	httpRequest.open('GET', '/list_load?item='+res_id)
	httpRequest.send()
}

document.addEventListener('DOMContentLoaded', function() {
  // code
	load();
})
