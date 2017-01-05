'use strict';

const ETGlobeMath = require('./index');
const LatLon = ETGlobeMath.LatLon;

describe ('geometry on spheres of variable sizes', () => {

    describe ('smoke tests', () => {

	it ('runs', function () {});

	// temporary test
	it ('checks base library', done => {

	    var p1 = new LatLon(0,5.3324234322342342);
	    var p2 = new LatLon(3,15.3324234322342342);

	    // expect API
	    // console.log(Object.keys(expect(1)));
	    expect(p1.distanceTo(p2)).toBeGreaterThan(1000000);
	    expect(p2.bearingTo(p1)).toBeGreaterThan(253);
	    expect(p1.bearingTo(p2)).toBeLessThan(74);
	    
	    done();
	});
    });

    describe ('real examples', () => {
	const EARTH_RADIUS = 6370.0;
	const MOON_RADIUS  = 1737.0;
	
	it ('calculates distances on earth', done => {
	    const gmath = new ETGlobeMath(EARTH_RADIUS);
	    
	    var pLondon = new LatLon(51.5, 0.12);
	    var pParis = new LatLon(48.85, 2.35);

	    const dist = gmath.distance(pLondon, pParis);

	    // actual distance: approx 340km
	    expect(dist).toBeGreaterThan(330);
	    expect(dist).toBeLessThan(350);

	    done();
	});

	it ('calculates distances on the moon', done => {
	    const gmath = new ETGlobeMath(MOON_RADIUS);
	    
	    var pApollo11 = new LatLon(0.68, 23.43);
	    var pApollo14= new LatLon(-3.67, -17.46);

	    const dist = gmath.distance(pApollo11, pApollo14);
	    expect(dist).toBeGreaterThan(1240);
	    expect(dist).toBeLessThan(1250);

	    done();
	});
    });

    describe ('shape handling on sphere surface', () => {

	it ('finds centroid of shape', done => {
	    console.log(Object.keys(gm));
	    const gmath = new ETGlobeMath();
	    
	    gmath.getCentroid();
	    done();
	});

    });

    describe ('distance lengthening and shortening', () => {
	it ('increases the distance between 2 points along great circle', changeLen.bind(null, 6000, 1));
	it ('increases the distance between 2 points on smaller radius', changeLen.bind(null, 3000, 1));
	it ('fails to increase the distance between 2 points on much smaller radius', () => {
	    // can't be smaller on such a small radius globe
	    try {
		changeLen.call(null, 200, 1, () => {});
	    }
	    catch (e) {
		expect(e.name).toBe('Error');
	    }
	    
	});
	it ('decreases the distance between 2 points along great circle', changeLen.bind(null, 6000, -1));

	function changeLen(rad, amount, done) {
	    const g = new ETGlobeMath(rad);
	    
	    let p1 = new LatLon(0, 0);
	    let p2 = new LatLon(0, 1);

	    if (amount < 0 ) {
		let pExtended = g.shortenByKm(p1, p2, amount);
		var dist1 = p1.distanceTo(p2, rad);
		var dist2 = p1.distanceTo(pExtended, rad);
		expect(dist2 - dist1).toBeGreaterThan(0);
		const comp = `${amount*1000}`;
		expect((dist1 - dist2).toFixed(0)).toBe(comp);
	    }
	    else {
		let pExtended = g.lengthenByKm(p1, p2, amount);
		console.log(pExtended);
		var dist1 = p1.distanceTo(p2, rad);
		var dist2 = p1.distanceTo(pExtended, rad);
		
		expect(dist2 - dist1).toBeGreaterThan(0);
		const comp = `${amount*1000}`;
		//console.log(`COMP: ${dist2 - dist1}`);
		expect((dist2 - dist1).toFixed(0)).toBe(comp);
	    } 


	    done();
	}
    });

    describe ('movement along great circles in spheres of different radii', () => {
	it ('is farther away on a larger sphere due to less curvature', done => {

	    const gm6000 = new ETGlobeMath(6000);
	    const gm5000 = new ETGlobeMath(5000);
	    
	    const p1 = new LatLon(0, 0);
	    const p2 = new LatLon(0, 1);
	    
	    const dist_onBiggerSphere = gm6000.distance(p1, p2);
	    const dist_onSmallerSphere = gm5000.distance(p1, p2);
	    console.log(dist_onSmallerSphere);

 	    expect(dist_onBiggerSphere - dist_onSmallerSphere).toBeGreaterThan(0);
	    done();
	});
    });
    
});
