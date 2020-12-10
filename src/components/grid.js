export default class Grid {
    constructor(paperInstance, canvas){
        this.paper = paperInstance
        this.canvas = canvas;
        this.bounds = this.paper.view.bounds
        
        // Set up layer
        this.gridLayer = new this.paper.Layer();
        this.gridLayer.name = " Grid 1 "
        this.gridLayer.applyMatrix = false;
        this.gridLayer.matrix = new this.paper.Matrix(1,0,0,-1,0,0);

        // Widths
        this.lineWidths = {
            thin : 0.5,
            thick: 1,
            verythick: 2
        }

        this.colors = {
            lines : "black",
            stepIndicators: "black"
        }

        // Coordinates limits
        this.xmin = -10;
        this.xmax = 10;
        this.ymin = -5;
        this.ymax = 5;

        // Step configs ( same in x and y direction!!! )
        this.step = 1;
        this.bigstep = 5;

        this.draw();

        // Create new layer
        this.gridLayer2 = new this.paper.Layer()
        this.gridLayer2.name = "Grid 2 "
        
        // Rasterize for performance
        this.gridlayer_raster = this.gridLayer.rasterize(4500);
        console.log(this.gridlayer_raster)

        // Remove first layer
        this.gridLayer.remove();
    }

    draw(){
        // Template vertical line
        this.vgridline = new this.paper.Path.Line({
            from:           [this.bounds.x, this.bounds.y],
            to:             [this.bounds.x, this.bounds.height],
            strokeColor:    this.colors.lines,
            strokeWidth:    this.lineWidths.thin
        })

        // Create Symbol
        this.vgridline_s = new this.paper.SymbolDefinition(this.vgridline)

        // Template horizontal line
        this.hgridline = new this.paper.Path.Line({
            from:           [this.bounds.x, this.bounds.y],
            to:             [this.bounds.width, this.bounds.y],
            strokeColor:    this.colors.lines,
            strokeWidth:    this.lineWidths.thin
        })
        // Create Symbol
        this.hgridline_s = new this.paper.SymbolDefinition(this.hgridline)

        // Template vertical step indicator
        this.vstepIndicator = this.paper.Path.Line({
            from:   [0, 0.2],
            to:     [0,-0.2],
            strokeWidth: this.lineWidths.thick,
            strokeColor: this.colors.stepIndicators
        })
        // Create Symbol
        this.vstepIndicator_s = new this.paper.SymbolDefinition(this.vstepIndicator);

        // Template horizontal step indicator
        this.hstepIndicator = this.paper.Path.Line({
            from:   [-0.2, 0],
            to:     [0.2,0],
            strokeWidth: this.lineWidths.thick,
            strokeColor: this.colors.stepIndicators
        })
        // Create Symbol
        this.hstepIndicator_s = new this.paper.SymbolDefinition(this.hstepIndicator);
        
        // Draw vertical lines (see inside for step indicators)
        for(let i = this.xmin; i <= this.xmax; i+= this.step){
            // Create a clone of the line blueprint
            let clonedLine = new this.paper.SymbolItem(this.vgridline_s)
            // Set position to currnent i
            clonedLine.position.x = i;

            // Write the number
            /*
            let number = new this.paper.PointText({
                point: [clonedLine.position.x + 0.1, 0.0 + 0.3],
                content: i,
                fontSize: 0.25,
                fillColor: "red"
            })*/
            //console.log(number)
            
            // If x position equals 0, set line to very thick
            /*
            if(clonedLine.position.x == 0) {
                clonedLine.strokeWidth = this.lineWidths.verythick;
            }*/

            // If the position equals a bigstep, set line to thick
            /*
            else if(clonedLine.position.x % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }*/

            // Since we are here, draw the step indicators
            let stepIndicator = new this.paper.SymbolItem(this.vstepIndicator_s)
            stepIndicator.position = [i,0]
        }
        
        // Draw horizontal lines (see inside for set indicators)
        for(let i = this.ymin; i <= this.ymax; i+= this.step){
            let clonedLine = new this.paper.SymbolItem(this.hgridline_s)
            clonedLine.position.y = i;

            // Write the number
            /*
            let number = new this.paper.PointText({
                point: [0 + 0.1, clonedLine.position.y + 0.3],
                content: -i,
                fontSize: 0.25,
                fillColor: "red"
            })
            console.log(number)*/
            /*
            if(clonedLine.position.y == 0) {
                clonedLine.strokeWidth = this.lineWidths.verythick;
            }
            else if(clonedLine.position.y % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }*/

            // Since we are here, draw the step indicators
            let stepIndicator = new this.paper.SymbolItem(this.hstepIndicator_s)
            stepIndicator.position = [0,i]  
        }
    }
}