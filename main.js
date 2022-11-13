const canvas = document.querySelector('canvas');
const Width = window.innerWidth;
const Height = window.innerHeight;

canvas.width = Width;
canvas.height = Height;

const ctx = canvas.getContext('2d');

let GridIsOn = false;
let RangeIsOn = false;
let CohesionIsOn = true;
let AlignmentIsOn = true;
let SeparationIsOn = true;

let Racism = false; 

let DiffColorCount = 1.0; // By default, it is one, every boid is white
const Colors = ["white","red","green","blue","yellow"];
let range;
let Points = [];
let DeltaTime, CurrentTime, PrevTime = 0;

const FpsLocation = document.querySelector('#FPS')
const SwitchGrid = (num)=> {
    switch(num){
        case 1: GridIsOn ? GridIsOn = false : GridIsOn = true; break;
        case 2: RangeIsOn ? RangeIsOn = false : RangeIsOn = true; break;
        case 3: CreateBoids(+document.querySelector('#boidcount').value);break; 
        case 4: CohesionIsOn ? CohesionIsOn = false : CohesionIsOn = true; break;
        case 5: AlignmentIsOn ? AlignmentIsOn = false : AlignmentIsOn = true; break;
        case 6: SeparationIsOn ? SeparationIsOn = false : SeparationIsOn = true; break;
        case 7: DiffColorCount = document.querySelector('#colorcount').value; CreateRandomColors(); break;
        case 8: Racism ? Racism = false: Racism = true; DiffColorCount == 1 && alert('Racism only works with multiple colors'); break;;
    }
}

const CreateBoids = (num) => {
    //if(num != Points.length){

        if(Points.length < num)
            while(Points.length < num){
                const Index = Math.floor((Math.random() * DiffColorCount));
                Points.push(new Boid(Colors[Index >= DiffColorCount ? Index-1 : Index]));
            }
        else if(Points.length > num)
            Points.splice(num,Points.length)
        // else if(Points.length == num){
        //     const Size = Points.length;
        //     Points = [];
        //     CreateBoids(Size);
        // }       
    //}
}

const CreateRandomColors = () => {
    for(let point of Points){
        const Index = Math.floor((Math.random() * DiffColorCount));
        point.ColorValue = Colors[Index >= DiffColorCount ? Index-1 : Index];
    }
}

let MOUSE = {
    pos:new vec2(0,0),
    pressed:false,
    saved:false
}

addEventListener('mousedown',event=>{
    if(event.button == 0){
        MOUSE.pos.x = event.clientX;
        MOUSE.pos.y = event.clientY;
        //console.log(MOUSE.pos)
        //console.log(quadtree)
        MOUSE.pressed = true;
    }
})
addEventListener('mouseup',event=>{
    if(event.button == 0){
        MOUSE.pressed = false;
        MOUSE.saved = false;
    }
})


const boundrie = new Rect(Width / 2,Height / 2,Width / 2,Height / 2);
let quadtree = new QuadTree(boundrie,0,5,0);


CreateBoids(100);

let loop = () =>{
    // range.x = MOUSE.pos.x;
    // range.y = MOUSE.pos.y;
    CurrentTime = performance.now() / 1000.0;
    DeltaTime = CurrentTime - PrevTime;
    //console.log(DeltaTime)
    PrevTime = CurrentTime;

    FpsLocation.innerHTML = `Fps: ${(1.0 / DeltaTime).toFixed(2)}`
    // for(let i of Points){
    //     i.AddVelocity(DeltaTime);
    //     i.CheckCollision();
    // }

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,Width,Height);

    // if(MOUSE.pressed && !MOUSE.saved){
    //     quadtree.insert(new vec2(MOUSE.pos.x,MOUSE.pos.y));
    //     MOUSE.saved = true;
    // }

    quadtree = new QuadTree(boundrie,0,5,0);
    for(let i of Points){
        quadtree.insert(i);
    }

    GridIsOn && quadtree.show(ctx);

    for(let boid of Points){
       

        range = new Rect(boid.pos.x,boid.pos.y,25,25);
        if(RangeIsOn){
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.strokeWidth = 2;
        ctx.rect(range.x - range.w,range.y - range.h,range.w * 2,range.h * 2);
        ctx.stroke();
        ctx.closePath();
        }

        //let count = 0;
        let points = quadtree.query(range);
        //console.log(count)
        //boid.flock(points);
        SeparationIsOn && boid.Separation(points);
        AlignmentIsOn && boid.Alignment(points);
        CohesionIsOn && boid.Cohesion(points,Racism);

        boid.Update(DeltaTime);
        boid.Border(0,Width,0,Height);

        boid.Show(ctx);
        // for(let point of points){
        //     ctx.beginPath();
        //     ctx.fillStyle = 'red';
        //     ctx.arc(point.pos.x,point.pos.y,5,0,Math.PI * 2);
        //     ctx.fill();
        //     ctx.closePath();
        // }
    }
    requestAnimationFrame(loop)
}

loop();