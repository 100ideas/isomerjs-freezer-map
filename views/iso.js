window.onload = function() {

  /*- create base geometry ------------------------------*/
    
  // import Isomer from 'isomer' // - KISS, no webpack
  
  let Isomer = window.Isomer
  let Shape = Isomer.Shape
  let Point = Isomer.Point
  let Path = Isomer.Path
  let Color = Isomer.Color
  
  let canvas = document.getElementById("art")
  let ctx = canvas.getContext('2d')
  let iso = new Isomer(canvas)
  // let iso = new Isomer(canvas)
  
  console.log("isofreezer.js loaded")
  
  /*- create base geometry ------------------------------*/
  let red = new Color(160, 60, 50)
  let blue = new Color(80, 80, 160)
  let blue_z = new Color(40,40,160,.2)
  let green = new Color(50, 160, 60)
  let green_z = new Color(50, 160, 60, 0.5)
  let highlightColor = new Color(255, 61, 127, 1)
  // let highlightColor = new Color(150, 61, 255, .75)
  // let highlightColor = new Color(0, 0, 60, 1)
  // let highlightColor = new Color(50, 200, 60, 0.7)
  
  // points
  let Pc = new Point(2,2,0)
  let Psel = new Point(2,-2,3)
  let Pdrawer = new Point(0.5,1,0.5)
  
  // selections
  let selPath = new Path([
    Point.ORIGIN,
    Point(0, 1, 0),
    Point(0, 1, 1),
    Point(0, 0, 1),
  ]).scale(new Point(0,0.35,0.55),1,0.6,0.4)
  
  // shapes
  let drawerBox = Shape.Prism(Point.ORIGIN, 1, 4, 1).scale(Pdrawer,0.85,1,0.85)
  let selBox = Shape.Prism(Point.ORIGIN, 1, 1, 1).scale(Pdrawer,0.75,1,0.75)
  let freezerBox = Shape.Prism(new Point(-0.5,0,-.75), 5, 4, 5.5)
  
  // axes
  // iso.add(Shape.Prism(Point.ORIGIN.translate(-.5,-.25,0), 20, .01, .01), blue) //x
  // iso.add(Shape.Prism(Point.ORIGIN.translate(-.5,-.25,0), .01, 20, .01), red)  //y
  
  
  /*- render -------------------------------------*/
  
  // coordinates of drawer/cubby selection - indexed from 1...4 [z,x,y]
  function drawIsoFreezer (sel = {z:3, x:1, y:3}) {
  
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // transform parameters for base selecton geometry 
    //   shrinks in xz plane to create spacing
    let sel_xyz = [sel.x - 2, sel.y - 6, sel.z]
    // let sel_xyz = {x: sel.x - 2, y: sel.y - 6, z: sel.z}
    
    // console.log(`sel: ${sel}`)
    // console.dir(sel)
    // console.log(`sel_xyz: ${sel_xyz}`)
    // console.dir(sel_xyz)

    // build 2d array of drawers - draw drawers by row, starting from 
    //   max_x position, bottom row first
    for (let i=3; i>=0; i--){
      let selScale, selTrans, selColor
      for (let j=0; j<4; j++){
        if (j === sel.z - 1 && i === sel.x - 1){
          selScale = 2
          selTrans = -3
          iso.add(drawerBox.scale(Pdrawer, 1.3, selScale+.05, 1.3).translate(i,selTrans-.10,j), highlightColor)
          iso.add(drawerBox.scale(Pdrawer, 1, selScale, 1).translate(i,selTrans,j), blue)
        } else {
          iso.add(drawerBox.scale(Pdrawer, 1, 1, 1).translate(i,0,j), red)
        }
        // iso.add(drawerBox.scale(Pdrawer, 1, selScale, 1).translate(i,selTrans,j), selColor)
      }
    }

    // drawer the freezer "volume" on top of drawers to shade them
    iso.add(freezerBox, blue_z)

    // highlight selection
    iso.add(drawerBox.translate(sel_xyz[0], -5, sel_xyz[2]), blue)
    // iso.add(drawerBox.translate(sel_xyz.x, -5, sel_xyz.z), blue)
    iso.add(selBox.translate(...sel_xyz), green)
    // iso.add(selBox.translate(sel_xyz.x, sel_xyz.y, sel_xyz.z), green)
    iso.add(selPath.translate(sel_xyz[0] + .05, sel_xyz[1], sel_xyz[2]), green)
  }
  
  drawIsoFreezer()
 
  window.drawIsoFreezer = drawIsoFreezer
  // window.drawIsoFreezer({z:3, x:1, y:2})
  
  window.freezerFun = function(repeat=false){
    
    let seqArr = []
    
    let genSeq = () =>  {
      for (let i=4; i>=1; i--){
        for (let j=4; j>=1; j--){
          for (let k=1; k<=4; k++){
           seqArr.push({z:i, x:j, y:k})
          }
        }
      }
    }
    
    genSeq()
    
    let timerId = setTimeout(function tick(dep=1) {
      console.log('tick: ' + dep);
      
      if (seqArr.length == 0){
        if (repeat) genSeq()
        else return
      }
      
      let tmpCoord = seqArr.pop()
      console.log(tmpCoord)
      drawIsoFreezer(tmpCoord)
      // drawIsoFreezer(seqArr.pop())
      dep++
      
      timerId = setTimeout(tick, 100, dep); // (*)
    }, 100);
    
  }
}