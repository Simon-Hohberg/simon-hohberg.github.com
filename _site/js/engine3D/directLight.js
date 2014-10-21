
function DirectLight(position, color, intensity, attenuation) {
	this.position = toHomogeneous(position);
	this.color = color;
	this.intensity = intensity;
	this.attenuation = attenuation;
}