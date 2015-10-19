define([
    "components/stage",
    "quick/base",
    "charts/trisurface",
    "utils/utils"
],function(Stage, Base, TriSurface, Utils){

    function TriSurfacePlot(selection){
	selection.each(function(data){
	    var stage = new Stage(this);
	    stage.add(new TriSurface(data, options));
	    stage.render();
	});
    }

    TriSurfacePlot.fill_colors = function(_){
	this.options.fill_colors = _;
	options = this.options;
	return this;
    }

    TriSurfacePlot.has_legend = function(_){
	this.options.has_legend = _;
	options = this.options;
	return this;
    }

    Utils.mixin(TriSurfacePlot, Base);

    return TriSurfacePlot;
});
