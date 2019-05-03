


function buildComplex(points, epsilon) {
    // var epsilon = 0.2;

    if(points.length == 0) {
        return [];
    }

    var dim = points[0].coords.length;

    function d2(p1, p2) {
        var sum = 0;
        for(var i = 0; i < dim; i++) {
            sum += (p1[i] - p2[i])**2;
        }
        return sum;
    }


    var n = points.length;
    var simplices = [];

    // We only consider 0, 1, 2, simplices
    // Add all vertices as 0 simplices
    for(var i = 0; i < n; i++) {
        simplices.push([i]);
    }

    // Compute 1 simplices
    for(var i = 0; i < n; i++) {
        for(var j = i+1; j < n; j++) {
            // Balls intersect iff dist <= 2epsilon iff dist^2 <= 4epsilon^2
            // var x = point.coords[0]
            if (d2(points[i].coords, points[j].coords) <= 4*epsilon*epsilon) {
                simplices.push([i, j]);
            }
        }
    }

    // Compute 2 simplices
    for(var i = 0; i < n; i++) {
        for(var j = i+1; j < n; j++) {
            if(d2(points[i].coords, points[j].coords) > 4*epsilon*epsilon) {
                continue;
            }
            
            nextSimplex:
            for(var k = j+1; k < n; k++) {

                var circles = [i, j, k];
                for (var ii = 0; ii < circles.length; ii++) {
                    for (var jj = ii+1; jj < circles.length; jj++) {
                        var circle1 = circles[ii];
                        var circle2 = circles[jj];
                        var x1 = points[circle1].coords[0];
                        var y1 = points[circle1].coords[1];
                        var x2 = points[circle2].coords[0];
                        var y2 = points[circle2].coords[1];
                        var dx = x2-x1;
                        var dy = y2-y1;
                        var d = Math.sqrt(dx*dx + dy*dy);
                        if(d > 2*epsilon) {
                            continue; // no circle intersection
                        }

                        var a = (d*d)/(2*d);
                        var h = Math.sqrt(epsilon*epsilon-a*a);
                        var xm = x1 + a*dx/d;
                        var ym = y1 + a*dy/d;
                        var xs1 = xm + h*dy/d;
                        var ys1 = ym - h*dx/d;
                        var xs2 = xm - h*dy/d;
                        var ys2 = ym + h*dx/d;

                        var kk;
                        if(ii == 0 && jj == 1) {
                            kk = 2;
                        } else if(ii == 0 && jj == 2) {
                            kk = 1;
                        } else if(ii == 1 && jj == 2) {
                            kk = 0;
                        }
                        var circle3 = points[circles[kk]];
                        if ((d2([xs1, ys1], circle3.coords) <= epsilon*epsilon) || (d2([xs2, ys2], circle3.coords) <= epsilon*epsilon)) {
                            simplices.push([i, j, k]);
                            continue nextSimplex;
                        }
                    }
                }
                // Balls intersect iff dist <= 2epsilon iff dist^2 <= 4epsilon^2
                // var x = point.coords[0]

                // if (d2(points[i].coords, points[j].coords) <= 4*epsilon*epsilon) {
                //     simplices.push([i, j]);
                // }
            }
            
        }
    }

    // simplices.push([0, 1, 2]);

    return simplices;
}