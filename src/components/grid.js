var paper = require('paper');

export default class Grid {
    constructor(paperInstance, canvas){
        this.paper = paperInstance
        this.canvas = canvas;
        this.bounds = paperInstance.view.bounds
        this.lineWidths = {
            thin : 0.25,
            thick: 0.75
        }

        // Draw template vertical line
        this.vgridline  = new paperInstance.Path.Line([this.bounds.x, this.bounds.y], [this.bounds.x, this.bounds.height]);
        this.vgridline.strokeColor = "5b5b5b"
        this.vgridline.strokeWidth = this.lineWidths.thin
        
        // Draw template horizontal line
        this.hgridline  = new paperInstance.Path([this.bounds.x, this.bounds.y], [this.bounds.width, this.bounds.y]);
        this.hgridline.strokeColor = "5b5b5b"
        this.hgridline.strokeWidth = this.lineWidths.thin

        console.log(paperInstance.view.bounds)

        // Draw vertical lines

        this.xmin = -10;
        this.xmax = 10;
        this.ymin = -5;
        this.ymax = 5;

        this.step = 1;
        this.bigstep = 5;
        
        // Draw vertical lines
        for(let i = this.xmin; i <= this.xmax; i+= this.step){
            // Create a clone of the line blueprint
            let clonedLine = this.vgridline.clone();
            // Set posiition to currnent i
            clonedLine.position.x = i;
            // If the position equals a bigstep, set line to thick
            if(clonedLine.position.x % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }
        }
        
        
        // Draw horizontal lines
        for(let i = this.ymin; i <= this.ymax; i+= this.step){
            let clonedLine = this.hgridline.clone();
            clonedLine.position.y = i;
            if(clonedLine.position.y % this.bigstep == 0) {
                clonedLine.strokeWidth = this.lineWidths.thick;
            }
        }
        
        //this.draw();
    }

    draw() {
        return new paper.Layer({
            children : [this.vgridline, this.hgridline],
            strokeColor : 'red'
    })
    }
}