console.log(mapbox_token)
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwLXJkYiIsImEiOiJja3Uzbmxxa2wwcjcxMm9vNjZhczl3NGU2In0.NPuueRw5zgHWbI9S0Pn-AQ';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: [-74.5, 40], // starting position [lng, lat]
zoom: 9 // starting zoom
});