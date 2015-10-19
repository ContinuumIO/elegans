define('charts/trisurface',[
    "components/legends",
    "utils/Delauney",
    "utils/utils",
    "utils/datasets",
    "utils/colorbrewer",
    "utils/range"
],function(Legends, Delauney, Utils, Datasets, colorbrewer, Range){
    function TriSurface(data, options){
	this.options = {
	    fill_colors: colorbrewer.Reds[6],
	    has_legend: true,
	};

	if(arguments.length > 1){
	    Utils.merge(this.options, options);
	}
 	this.dataset = new Datasets.Array(data);
	this.ranges = this.dataset.ranges;
    this.data =  data;
    }

    TriSurface.prototype.generateMesh = function(scales){
    var data = this.data;
	var geometry = new THREE.Geometry();

    var colors = [];
	var color_scale = d3.scale.linear()
	    .domain(this.ranges.y.divide(this.options.fill_colors.length))
	        .range(this.options.fill_colors);

    var vertices = new Array(data.z.length);
    for(var i = 0; i < data.z.length; i++){
        var vertx = scales.x(data.x[i]);
        var verty = scales.y(data.y[i]);
        var vertz = scales.z(data.z[i]);
        vertices[i] = [vertx, vertz];
		colors.push(new THREE.Color(color_scale(data.y[i])));
		geometry.vertices.push(new THREE.Vector3(vertx, verty, vertz));
    }

    var triangles = Delaunay.triangulate(vertices);

    for(var i = 0; i < Math.floor(triangles.length/3.0); i++){
      var tri = new THREE.Face3(triangles[3*i+2],
                                 triangles[3*i+1],
                                 triangles[3*i]);
      geometry.faces.push(tri);
      tri.vertexColors[0] = colors[triangles[3*i]];
      tri.vertexColors[1] = colors[triangles[3*i+1]];
      tri.vertexColors[2] = colors[triangles[3*i+2]];
    }

    var material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors,
        side: THREE.DoubleSide});
	this.mesh = new THREE.Mesh(geometry, material);

    }

    TriSurface.prototype.getDataRanges = function(){
	return this.ranges;
    }

    TriSurface.prototype.hasLegend = function(){
	return this.options.has_legend;
    }

    TriSurface.prototype.getLegend = function(){
	return Legends.generateContinuousLegend(this.ranges.z, this.options.fill_colors);
    }

    TriSurface.prototype.getMesh = function(){
	return this.mesh;
    };

    return TriSurface;
});
