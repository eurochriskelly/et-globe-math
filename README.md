Globe mathematics for a variable radius cartography. Depends on npm
geodesy module and provides logic required by ettools.


# Typical usage:
	
	Create a globe math object for a particular radius, e.g.:

    const EARTH_RADIUS = 6370.0;
	const gmEarth = new ETGlobeMath(EARTH_RADIUS);
	
	const pLondon   = new LatLon(51.5, 0.12);
	const pParis    = new LatLon(48.85, 2.35);
	
    const dist = gmEarth.distance(pLondon, pParis);
	console.log(dist); // ~330 km;
    const roundTripDist = gmEarth.distanceAlongTrack([pLondon, pParis, pNewYork, pLondon]);
	console.log(roundTripDist); // ~6000 km;

    const MOON_RADIUS  = 1737.0;
	const gmMoon  = new ETGlobeMath(MOON_RADIUS);

    const pApollo11 = new LatLon(0.68, 23.43);
	const pApollo14 = new LatLon(-3.67, -17.46);
	
	// distance between landing sites
    const dist = gmMoon.distance(pApollo11, pApollo14);
	console.log(dist); // approx 1245 km
	
# API

	// to be generated ...
