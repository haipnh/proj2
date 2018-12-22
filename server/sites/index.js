var socket = io();

function MakeJSON(index){
   var output = document.getElementById("SliderVal"+index);
   var obj = new Object(); 
	obj.Thing = index;
	obj.Value = output.innerHTML;	
   return obj;
}

function SyncSlider(index){
   var slider = document.getElementById("Slider"+index);
   var checked = document.getElementById("Switch"+index).checked;
   if(checked)   
      slider.value = 100;
   else 
      slider.value = 0;
}

function SyncSwitch(index){
   var sw = document.getElementById("Switch"+index);
   var value = document.getElementById("Slider"+index).value;
   if(value<50)   sw.checked = false;
   if(value>=50)  sw.checked = true;      
}

function SyncOutput(index){
   var slider =  document.getElementById("Slider"+index);
   var output = document.getElementById("SliderVal"+index);
   output.innerHTML = slider.value;   
}

function SliderOnInput(item){
   var slider =  document.getElementById(item.id);
   var index = item.id.replace( /^\D+/g, ''); // Extracting number only from string
   SyncOutput(index);
}

function SliderOnChange(item){
   var slider =  document.getElementById(item.id);
   var index = item.id.replace( /^\D+/g, ''); // Extracting number only from string
   SyncSwitch(index, slider.value);
   var obj = MakeJSON(index);
   socket.emit('cmd', obj);	
	console.log("Sent : " + JSON.stringify(obj));
}

function SwitchOnChange(item){
   var index = item.id.replace( /^\D+/g, ''); // Extracting number only from string
   SyncSlider(index);
   SyncOutput(index);
   var obj = MakeJSON(index);
   socket.emit('cmd', obj);	
	console.log("Sent : " + JSON.stringify(obj));
}

window.onload = function() {
   var i;
   for(i=1;i<=4;i++){
      SyncOutput(i);
   }
   
   var canvas = document.getElementById("canvas");
	
   var data = {
      labels: [],
      datasets: [
         {
            label: "Temparature",
            fontColor: "#fff",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(255,99,71,1)",
            borderColor: "rgba(255,99,71,1)",

            pointBorderColor: "rgba(255,99,71,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(255,99,71,1)",
            pointHoverBorderColor: "rgba(255,255,255,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [],
         },
         {
            label: "Humidity",
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(75,192,192,1)",

            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(255,255,255,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 5,
            data: [],
         }
      ]
   };

   var option = {
      legend: {
            display: true,
            labels: {
                fontColor: '#000'
            }
        },      
      showLines: true
   };
   
   var myLineChart = Chart.Line(canvas,{
      data:data,
      options:option
   });
   
   setInterval(function(){
      addData();
   }, 1000);
   
   function addData(){
      if(myLineChart.data.datasets[0].data.length == 10){
         myLineChart.data.datasets[0].data.shift();
         
      }
      if(myLineChart.data.datasets[1].data.length == 10){
         myLineChart.data.datasets[1].data.shift();
      }
      if(myLineChart.data.labels.length == 10){
         myLineChart.data.labels.shift();
      }
      myLineChart.data.datasets[0].data.push(getRandomInt(28,32));
      myLineChart.data.datasets[1].data.push(getRandomInt(60,70));
      myLineChart.data.labels.push(new Date().toLocaleString());
      myLineChart.update();
   }
   
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




