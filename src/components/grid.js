export default class Grid {
    constructor(paperInstance){
        this.paper = paperInstance
        
        // Set up layer
        this.gridLayer = new this.paper.Layer();
        this.gridLayer.name = "grid-layer"
        this.gridLayer.matrix = new this.paper.Matrix(1,0,0,-1,0,0);
        this.gridLayer.applyMatrix = false;
        this.gridLayer.center = [0,0]
        this.gridLayer.scale(40)

        // Widths
        this.lineWidths = {
            thin : 1,
            thick: 2,
            verythick: 3
        }
        this.colors = {
            lines : '#248fe8',
            stepIndicators: "black"
        }

        // Page Padding
        this.padding =1.5

        // Coordinates limits
        this.xmin = -10;
        this.xmax = 10;
        this.ymin = -5;      
        this.ymax = 5;       

        // Step configs ( same in x and y direction!!! )
        this.step = 1;
        this.bigstep = 5;

        this.draw();
        
        // Rasterize for performance
        // this.gridlayer_raster = this.gridLayer.rasterize(4500);
        //console.log(this.gridlayer_raster)

        // Remove first layer
        // this.gridLayer.remove();
    }

    draw(){
        // White Background
        this.background = new this.paper.Path.Rectangle({
            from:   [this.xmin -this.padding,    this.ymin-this.padding],
            to:     [this.xmax +this.padding,    this.ymax+this.padding],
            fillColor  : "white",
            shadowBlur : 0.2,
            shadowColor: new this.paper.Color(0, 0, 0),
            shadowOffset: new this.paper.Point([0.1,0.1]),
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
        this.vgridline.remove();
        this.hgridline.remove();
    }
}