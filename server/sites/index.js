var socket = io();

function valueChange(item){
	var obj = new Object();
	obj.item = item.id;
	obj.value = item.checked;
	socket.emit('cmd',obj);
	console.log("Sent : " + JSON.stringify(obj));
}
function httpGetAsync(theUrl, callback) { 
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(JSON.parse(xmlHttp.responseText));
	}
	xmlHttp.open("GET", theUrl, true); // true for asynchronous
	xmlHttp.send(null);
}

window.onload = function() {
	var dataTemp = [];
	var dataHumd = [];
	var Chart = new CanvasJS.Chart("ChartContainer", {
		zoomEnabled: true, // Dùng thuộc tính có thể zoom vào graph
		title: {
			text: "Temprature & Humidity" // Viết tiêu đề cho graph
		},
		toolTip: { // Hiển thị cùng lúc 2 trường giá trị nhiệt độ, độ ẩm trên graph
			shared: true
		},
		axisX: {
			title: "chart updates every 2 secs" // Chú thích cho trục X
		},
		data: [{
			// Khai báo các thuộc tính của dataTemp và dataHumd
			type: "line", // Chọn kiểu dữ liệu đường
			xValueType: "dateTime", // Cài đặt kiểu giá trị tại trục X là thuộc tính thời gian
			showInLegend: true, // Hiển thị "temp" ở mục chú thích (legend items)
			name: "temp",
			dataPoints: dataTemp // Dữ liệu hiển thị sẽ lấy từ dataTemp
			},
			{
			type: "line",
			xValueType: "dateTime",
			showInLegend: true,
			name: "humd",
			dataPoints: dataHumd
		}],
	});
	var yHumdVal = 0; // Biến lưu giá trị độ ẩm (theo trục Y)
	var yTempVal = 0; // Biến lưu giá trị nhiệt độ (theo trục Y)
	var updateInterval = 2000; // Thời gian cập nhật dữ liệu 2000ms = 2s
	var time = new Date(); // Lấy thời gian hiện tại

	var updateChart = function() {
		httpGetAsync('/get', function(data) {
			// Gán giá trị từ localhost:8000/get vào textbox để hiển thị
			document.getElementById("temp").value = data[0].temp;
			document.getElementById("humd").value = data[0].humd;

			// Xuất ra màn hình console trên browser giá trị nhận được từ localhost:8000/get
			console.log(data);
			// Cập nhật thời gian và lấy giá trị nhiệt độ, độ ẩm từ server
			time.setTime(time.getTime() + updateInterval);
			yTempVal = parseInt(data[0].temp);
			yHumdVal = parseInt(data[0].humd);
			dataTemp.push({ // cập nhât dữ liệu mới từ server
			x: time.getTime(),
			y: yTempVal
			});
			dataHumd.push({
			x: time.getTime(),
			y: yHumdVal
			});
			Chart.render(); // chuyển đổi dữ liệu của của graph thành mô hình đồ họa
		});
	};
	updateChart(); // Chạy lần đầu tiên
	setInterval(function() { // Cập nhật lại giá trị graph sau thời gian updateInterval
		updateChart()
	}, updateInterval);
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
