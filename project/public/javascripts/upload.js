var fileCount = 0;
function getData() {
    if (fileCount >= 5) {
		alert("파일은 최대 5개까지 올릴 수 있어요");
            return;
    }
    var html = "";
    var file = document.querySelector('#file').files[0];
    var fr = new FileReader();
    fr.fileName = file.name;
    fr.number = fileCount;
    var div = document.createElement('div');
    div.className = "data_item";
    fr.onload = function (e) {
		html += "<input type='hidden' name='img_data' value='"+ e.target.result+"'>";
        html += '<b>'+ e.target.fileName + '</b><input type="image" class="delete_img" onClick="delete_file(this)" src="/images/224.png"></br>';
        div.innerHTML = html;
	}
    fr.readAsDataURL(file);
	document.querySelector("#data").appendChild(div);
    fileCount++;
}

function delete_file(obj) {
    alert("파일을 삭제하시겠습니까?");
    obj.parentNode.remove();
}
