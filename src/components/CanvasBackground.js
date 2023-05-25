export default class CanvasBackground {
    constructor(paperInstance){
        this.paper = paperInstance
        // Set up layer
        this.gridLayer = this.paper.project.layers['background-layer']
        // Activate Layer
        this.gridLayer.activate()
        this.gridLayer.applyMatrix = false;

        // Widths
        this.lineWidths = {
            thin : 1,
            thick: 2,
            verythick: 3
        }
        this.colors = {
            lines : '#248fe8'
        }

        // Page Padding
        this.padding = 60

        // Coordinates limits
        this.xmin = -400;
        this.xmax =  400;
        this.ymin = -200;      
        this.ymax =  200;

        // Step configs ( same in x and y direction!!! )
        this.step = 20;

        this.draw();
        
        // Rasterizing the background was in the plans, but it looks too bad
        /*
        // Rasterize for performance
        this.gridlayer_raster = this.gridLayer.rasterize()

        // Remove all vectors
        this.gridLayer.removeChildren();

        // Add only the raster
        this.gridLayer.addChild(this.gridlayer_raster)
        */
    }

    draw(){
        // White Background
        this.background = new this.paper.Path.Rectangle({
            from:   [this.xmin -this.padding,    this.ymin-this.padding],
            to:     [this.xmax +this.padding,    this.ymax+this.padding],
            fillColor  : "white",
            shadowBlur : 8,
            shadowColor: new this.paper.Color(0, 0, 0),
            shadowOffset: new this.paper.Point([8,-8]),
            strokeColor: "black",
            strokeWidth: this.lineWidths.verythick
        })
        // Template vertical line
        this.vgridline = new this.paper.Path.Line({
            from:           [0, this.ymax],
            to:             [0, -this.ymax],              // remember: y axis is reverted
            strokeColor:    this.colors.lines,
            strokeWidth:    this.lineWidths.thin
        })
        // Template horizontal line
        this.hgridline = new this.paper.Path.Line({
            from:           [this.xmin, 0],
            to:             [this.xmax, 0],
            strokeColor:    this.colors.lines,
            strokeWidth:    this.lineWidths.thin
        })
        // Draw vertical lines
        for(let i = this.xmin; i <= this.xmax; i+= this.step){
            let clonedLine = this.vgridline.clone()
            clonedLine.position.x = i;
        }
        
        // Draw horizontal lines
        for(let i = this.ymin; i <=this.ymax; i+=this.step){
            let clonedLine = this.hgridline.clone()
            clonedLine.position.y = -i;
        }

        // Remove template lines
        this.vgridline.remove();
        this.hgridline.remove();
    }
}