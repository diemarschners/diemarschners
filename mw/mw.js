console.log("Yep - mw.js is here!");

/* knowhow
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

Maps loading
check when uderstood https://gist.github.com/vbugarsk/2599379
https://hackernoon.com/lets-make-reusable-web-components-google-maps-8be7577d925

*/

let allmapcontainers = document.querySelectorAll('div[control=mymap]')
let mainNavLinks = document.querySelectorAll("nav ul li a");

const load = async (s) => {
  return new Promise(async r=>{
   for(i=0;i<document.scripts.length;i++)
     if(document.scripts[i].src == s) return r()
   let e = document.createElement('script')
   e.src = s 
   document.body.appendChild(e)
   e.onload = r
  })
}

const mymap = async (e) => {
    return new Promise(async r=>{
      await load('https://unpkg.com/leaflet@1.3.4/dist/leaflet.js');
      await load('https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.4.0/gpx.min.js');
      await load('https://api.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v1.0.1/Leaflet.fullscreen.min.js');
      //https://github.com/mpetazzoni/leaflet-gpx
      
      let mycenterlat = e.getAttribute("lat");
      let mycenterlng = e.getAttribute("lng");
      let mypath = e.getAttribute("path");
      let mytourpois = document.querySelectorAll(".poi"+e.getAttribute("tour"));


      let map = new L.Map(e, {center: new L.LatLng(mycenterlat,mycenterlng), zoom: 15}); 
      L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
          attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 21,
          id: 'outdoors-v9',
          accessToken: 'pk.eyJ1IjoibW1hcnNjaG5lciIsImEiOiJjamtwcmxnY24zYmcxM3dreGJvZmFsMnd6In0.FR5AxFvfzjK76Xu54-Xe-A'
      }).addTo(map);
      //L.control.layers(baseMaps, overlayMaps).addTo(map);

      let gpxtrack = new L.GPX(mypath, {
        async: true
      }).on("loaded", function(e) {
        map.fitBounds(e.target.getBounds());
      });
      map.addLayer(gpxtrack);
      map.addControl(new L.Control.Fullscreen());
    

      Array.from(mytourpois, e => {
        return new L.marker([e.getAttribute("lat"),e.getAttribute("lng")]).addTo(map).bindPopup(e.innerHTML);
      });

    r(map);
    })
  }
  
(async () => {
    for (var i = 0; i < allmapcontainers.length; i++)
      await mymap(allmapcontainers[i]);
  })();


// Sticky and Scroll
window.addEventListener("scroll", event => {
  let fromTop = window.scrollY;

  mainNavLinks.forEach(link => {
    let section = document.querySelector(link.hash);

    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      link.classList.add("current");
    } else {
      link.classList.remove("current");
    }
  });
});