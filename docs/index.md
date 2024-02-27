---
theme: ["air", "alt", "wide"]
toc: false
---

# Boston 311 Dashboard

An overview of [Boston's 311 Constituent Service Center](https://www.boston.gov/departments/boston-311) request [data for 2024](https://data.boston.gov/dataset/311-service-requests/resource/dff4d804-5031-443a-8409-8344efd0e5c8), which is kindly made available under the [Public Domain Dedication and License v1.0](http://opendatacommons.org/licenses/pddl/1.0/).

```js
const parseMDY = d3.timeParse("%Y-%m-%d %H:%M:%S");
const data = await aq.fromArrow(
  await FileAttachment("data/2024.parquet").parquet())
  .derive({ open_dt: aq.escape(d => parseMDY(d.open_dt)),
            closed_dt: aq.escape(d => parseMDY(d.closed_dt)) });

const pctOntime = data.rollup({
  freq: (d) => aq.op.mean(d.on_time == "ONTIME"),
});

const ctStatus = data.groupby("case_status").count();

const avgClosure = data
  .filter((d) => d.case_status == "Closed")
  .derive({ avg: aq.escape((d) => d3.timeDay.count(d.open_dt, d.closed_dt)) })
  .rollup({ avg: aq.op.mean("avg") });

const requests = FileAttachment("data/311_2024.geojson").json();
```

```js
/* Inputs.table([...data]) */
/* display([...data]); */
```

<div class="grid grid-cols-4" style="margin-top: 2rem;">
  <div class="card">
    <h2>Total 311 Requests</h2>
    <span class="big">${d3.format(",")([...data].length)}</span>
  </div>
  <div class="card">
    <h2>Percent Closed On-Time</h2>
    <span class="big">${d3.format(".0%")([...pctOntime][0]['freq'])}</span>
  </div>
  <div class="card">
    <h2>Open Requests</h2>
    <span class="big">${d3.format(",")([...ctStatus][1]['count'])}</span>
  </div>
  <div class="card">
    <h2>Avg Time to Close Request</h2>
    <span class="big">${d3.format(".1f")([...avgClosure][0]['avg'])} days</span>
  </div>

</div>

  <div class="card">
  <h2>Daily 311 Requests</h2>
  <h3>Total, 2024</h3>
  <div>${resize((width) =>
      Plot.plot({
        width,
        x: {interval: "day", label: null},
        y: {grid: true, label: "Requests"},
        marks: [
            Plot.lineY(data, Plot.groupX({y:"count"},{x: "open_dt",curve: "basis", tip: true})),
          Plot.ruleY([0])
        ]
      })
  )}</div>
  </div>

<div class = "card">
<h2>311 Requests Mapped</h2>
  <h3>Click on a request for more information</h3>
<div id = "map" style = "height: 400px">
</div>
<div>

<!-- <div class="grid grid-cols-2" style="">
<div class="card">
<h2>Case Status</h2>
<h3>Total, 2024</h3>
 ${resize((width) =>
    Plot.plot({
      width,
      x: {label: "Status"},
      y: {grid: true, label: "Requests"},
      marks: [
          Plot.barY(data, Plot.groupX({y:"count"},{x: "case_status",curve: "basis"})),
        Plot.ruleY([0])
      ]
    })
)}
</div>
</div> -->

```js
const div = document.getElementById("map");

const map = new mapboxgl.Map({
  container: div,
  accessToken:
    "pk.eyJ1IjoiaGVyc2hndXB0YSIsImEiOiJja3o1MXVuZjQwbWxnMm9ua2Rwc2Y5d2tpIn0.KVLDa3UW_yb4l_WkxZYDSQ",
  style: "mapbox://styles/mapbox/streets-v12",
  center: [-71.0850612, 42.3432998],
  zoom: 11,
});

map.on("load", () => {
  map.addSource("requests", {
    type: "geojson",
    data: requests,
  });
  map.addLayer({
    id: "requests-point",
    type: "circle",
    source: "requests",
    minzoom: 10,
    paint: {
      "circle-radius": {
        base: 2,
        stops: [
          [12, 4],
          [14, 8],
        ],
      },
      "circle-stroke-color": "white",
      "circle-color": [
        "match",
        ["get", "case_status"],
        "Open",
        "#50C878",
        "Closed",
        "#C1E1C1",
        "#CCC",
      ],
      "circle-stroke-width": 1,
    },
  });
});

map.on("click", "requests-point", (event) => {
  new mapboxgl.Popup()
    .setLngLat(event.features[0].geometry.coordinates)
    .setHTML(
      `<strong>${event.features[0].properties.case_title}</strong><br>Location: ${event.features[0].properties.location}<br>Date Opened: ${event.features[0].properties.open_dt}<br>Status: ${event.features[0].properties.case_status}`
    )
    .addTo(map);
});

invalidation.then(() => map.remove());
```
