
/**
 * 
 * @param center
 * @param radius
 * @param color
 * @param brilliance
 * @returns
 */
function Sphere(center, radius, color, brilliance) {
	if (center.dimensions() == 3) {
		this.center = toHomogeneous(center);
	} else {
		this.center = center;
	}
	this.radius = radius;
	this.color = color;
	this.brilliance = brilliance;
}
