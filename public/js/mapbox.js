const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoidGVhcm9mZW5lbXkiLCJhIjoiY2tpZjEzaGlhMGg0ajJxbGIxdHliZjFobyJ9.Go48fK_eK-4qyj5S5C9y6w';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/tearofenemy/ckilqxp6h25ut17s73kkfn55j',
    scrollZoom: false
});


const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    new mapboxgl.Popup({
        offset: 30
    })
                .setLngLat(loc.coordinates)
                .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
                .addTo(map);

    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});