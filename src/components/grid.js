export default class Grid {
    constructor(paperInstance, canvas){
        this.paper = paperInstance
        this.canvas = canvas;
        this.bounds = this.paper.view.bounds
        
        // Set up layer
        this.gridLayer = new this.paper.Layer();
        this.gridLayer.applyMatrix = false;
        this.gridLayer.matrix = new this.paper.Matrix(1,0,0,-1,0,0);

        // Widths
        this.lineWidths = {
            thin : 0.25,
            thick: 0.75,
            verythick: 2
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
    }

    draw(){
        // Template vertical line
        this.vgridline = new this.paper.Path.Line({
            from:           [this.bounds.x, this.bounds.y],
            to:             [this.bounds.x, this.bounds.height],
            strokeColor:    "5b5b5b",
            strokeWidth:    this.lineWidths.thin
        })
        // Create Symbol
        this.vgridline_s = new this.paper.SymbolDefinition(this.vgridline)

        // Template horizontal line
        this.hgridline = new this.paper.Path.Line({
            from:           [this.bounds.x, this.bounds.y],
            to:             [this.bounds.width, this.bounds.y],
            strokeColor:    "5b5b5b",
            strokeWidth:    this.lineWidths.thin
        })
        // Create Symbol
        this.hgridline_s = new this.paper.SymbolDefinition(this.hgridline)
        
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
            if(clonedLine.position.x == 0) {
                clonedLine.strokeWidth = this.lineWidths.verythick;
            }

            // If the position equals a bigstep, set line to thick
            else if(clonedLine.position.x % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }

            // Since we are here, draw the step indicators
            let stepIndicator = this.paper.Path.Line({
                from:   [i, 0.15],
                to:     [i,-0.15],
                strokeWidth: this.lineWidths.thick,
                strokeColor: "black"
            })
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

            if(clonedLine.position.y == 0) {
                clonedLine.strokeWidth = this.lineWidths.verythick;
            }
            else if(clonedLine.position.y % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }

            // Since we are here, draw the step indicators
            let stepIndicator = this.paper.Path.Line({
                from:   [0.15, i],
                to:     [-0.15, i],
                strokeWidth: this.lineWidths.thick,
                strokeColor: "black"
            })
        }
    }
}