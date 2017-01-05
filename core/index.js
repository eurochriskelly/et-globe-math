'use strict';

const G = require('geodesy');
const $ = JSON.stringify;

class ETGlobeMath {
    
    constructor (radius) {
	this.radius = radius;
	this._LatLon = G.LatLonSpherical;
    }

    // direction is inferred (p1 -> p2)
    lengthenByKm(pFrom, pTo, byKm) {
	this._assertLatLon([pFrom, pTo]);
	const dist = pFrom.distanceTo(pTo, this.radius);
	const frac = (dist + (byKm * 1000))/dist;
	const newPoint = pFrom.intermediatePointTo(pTo, frac);
	return newPoint;
    }

    // direction is inferred (p1 -> p2)
    shortenByKm(pFrom, pTo, byKm) {
	this._assertLatLon([pFrom, pTo]);
	const dist = pFrom.distanceTo(pTo, this.radius);
	if (dist < byKm) ERR('E_DIST_TO_SHORT', 'Cannot shorten a distance that is smaller than amount to be shortened.');
	const frac = (dist - (byKm * 1000))/dist;
	const newPoint = pFrom.intermediatePointTo(pTo, frac);
	return newPoint;
    }

    // distance between 2 points on this sphere
    distanceAlongTrack(pList) {
	if (!Array.isArray(pList)) {
	    throw new ERR('expected-array', 'Track must be defined as array of points');
	}
	return pList.reduce((p, n) => {
	    this._assertLatLon(n, 'in distance along track.');
	    if (p[0]) {
		this._assertLatLon(n, 'distance along track has previous data.');
		p[1] += p[0].distanceTo(n, this.radius);
	    }
	    p[0] = n;
	    return p;
	}, [null, 0])[1];
    }

    // distance from any point to some create circle
    crossTrackDistance(from, pStart, pEnd) {
	this._assertLatLon([from, pStart, pEnd]);
	return from.crossTrackDistanceTo(pStart, pEnd, this.radius);
    }
    
    distance(p1, p2) {
	this._assertLatLon([p1, p2]);	    
	return p1.distanceTo(p2, this.radius);
    }

    // recurves a point to a point on a different sphere
    recurveToRadius(pt, pCentroid, radius) {
	this._assertLatLon([pt, pCentroid]);
	var p3 =0, p4 =0;
	return new ETGlobeMath.LatLon(p3, p4);
    }

    /**
     * Accurate 3d centroid of a boundary line on sphere.
     * Algorithm based on :http://www.jennessent.com/downloads/graphics_shapes_poster_full.pdf
     *
     */
    getCentroid (boundary, radius) {
        
        var i, edge, mag, next_triang,
            corner1, corner2, common_corner,
            tridata, totalArea, centroid;

        tridata = [];
        // use north pole as common corner
        common_corner = new THREE.Vector3(0, 0, radius);
        centroid = new THREE.Vector3(0, 0, 0);
        // For each edge in the boundary. Calculate the centroid and area
        // with another
        for (i = 1 ; i < boundary.length; i+=1) {
            edge = [boundary[i-1], boundary[i]];
            corner1 = polar2xyz(edge[0][0], edge[0][0], radius);
            corner2 = polar2xyz(edge[1][0], edge[1][1], radius);
            next_triang = {
                area : _getSurfaceTriangleArea(corner1, corner2, common_corner, radius),
                centroid : _getSurfaceTriangleCentroid(corner1, corner2, common_corner, radius)
            };
            console.log(next_triang);
            tridata.push(next_triang);
        }

        // The area of the surface is given by the sum of the triangles.
        // The centroid is weighted by the area.
        tridata.forEach(function (t) {
            totalArea += t.area;
            centroid.x += t.centroid.x;
            centroid.y += t.centroid.y;
            centroid.z += t.centroid.z;
        });

        // average weighted position (outside loop for performance)
        centroid.x /= tridata.length;
        centroid.y /= tridata.length;
        centroid.z /= tridata.length;

        // project point to surface of sphere
        mag = centroid.length();
        centroid.x /= mag;
        centroid.y /= mag;
        centroid.z /= mag;

        return centroid;
    }

    _assertLatLon (pts, msg) {
	if (Array.isArray(pts)) {
	    pts.forEach(p => {
		if (!p.distanceTo) ERR('invalid-point', `Not a valid point: ${p}. ${msg||''}`);
	    });
	}
	else {
	    if (!pts.distanceTo) ERR('invalid-point', `Not a valid point: ${pts}. ${msg||''}`);
	}
	
    }
}

ETGlobeMath.LatLon = G.LatLonSpherical;

module.exports = ETGlobeMath;

function ERR (name, message) {
    const e = new Error(message);
    e.name = name;
    throw e;
}
