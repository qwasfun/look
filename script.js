var dom = document.getElementById("chart-container");
var myChart = echarts.init(dom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
var app = {};

var option;

const labelFont = "bold 12px Sans-serif";

option = {
  animation: true,
  color: "red",
  title: {
    left: "center",
    text: "人数统计",
  },
  legend: {
    top: 30,
  },
  tooltip: {
    // triggerOn: "none",
    transitionDuration: 0,
    confine: true,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "rgba(255,255,255,0.9)",
    textStyle: {
      fontSize: 12,
      color: "#333",
    },
    position: function (pos, params, el, elRect, size) {
      const obj = {
        top: 60,
      };
      obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      return obj;
    },
  },
  axisPointer: {
    link: [
      {
        xAxisIndex: [0],
      },
    ],
  },
  dataZoom: [
    {
      type: "slider",
      realtime: false,
      start: 1,
      end: 100,
      top: 65,
      height: 20,
      handleIcon:
        "path://M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
      handleSize: "120%",
    },
  ],
  xAxis: [
    {
      type: "category",
      data: [],
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#777" } },
      min: "dataMin",
      max: "dataMax",
      axisPointer: {
        show: true,
        type: "line",
        label: { show: true },
        triggerTooltip: true,
      },
    },
  ],
  yAxis: [
    {
      scale: true,
      splitNumber: 2,
      axisLine: { lineStyle: { color: "#777" } },
      splitLine: { show: true },
      axisTick: { show: false },
      axisLabel: {
        inside: true,
        formatter: "{value}\n",
      },
    },
  ],
  grid: [
    {
      left: 20,
      right: 20,
      top: 150,
      height: 300,
    },
  ],

  series: [
    {
      name: "人数",
      type: "line",
      data: [],
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 1,
      },
    },
  ],
};

if (option && typeof option === "object") {
  myChart.setOption(option);
}
function fetchData() {
  const dataURL = "./data/shixin.txt";
  fetch(dataURL)
    .then((res) => {
      return res.text();
    })
    .then((data) => {
      entry = data.split("\n");
      entry.pop();
      let dates = [];

      let volumes = [];
      for (let i = 0; i < entry.length; i++) {
        dates[i] = entry[i].split(/\s+/, 2)[0];
        volumes[i] = entry[i].split(/\s+/, 2)[1];
      }

      option.xAxis[0].data = dates;
      option.series[0].data = volumes;

      console.log("option", option);

      if (option && typeof option === "object") {
        myChart.setOption(option);
      }
    });
}

fetchData();
window.addEventListener("resize", myChart.resize);
