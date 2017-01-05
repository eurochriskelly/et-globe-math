Globe mathematics for a variable radius cartography. Depends on npm
geodesy module and provides logic required by ettools.


# Typical usage:
	
	Create a globe math object for a particular radius, e.g.:
	
	const GlobeMath = require('et-globe-math');
	const LatLon = GlobeMath.LatLon;
	const gmEarth      = new GlobeMath(6370);
	const gmEarthsMoon = new GlobeMath(6500);
	const apollo
	
	// distance between points on surface
	gm6500.surfaceDistanceBetween(london, madrid);
	
	gmMars.surfaceDistanceBetween(apollo11, apollo14);
	
# API

	// to be generated ...
