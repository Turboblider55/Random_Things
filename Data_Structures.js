class Rect{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    contains(pos){
        return (pos.x > this.x - this.w && pos.x < this.x + this.w && pos.y > this.y - this.h && pos.y < this.y + this.h);
    }

    intersect(otherrect){
        return ((this.y - this.h <= otherrect.y + otherrect.h || this.y + this.h <= otherrect.y - otherrect.h)
                && 
                (this.x - this.w <= otherrect.x + otherrect.w || this.x + this.w <= otherrect.x - otherrect.w)
                );
    }
}

// class Ball{
//     constructor(pos,vel,rad){
//         this.pos = pos;
//         this.vel = vel;
//         this.rad = rad;
//     }

//     AddVelocity(dt){
//         this.pos.x += this.vel.x * dt;
//         this.pos.y += this.vel.y * dt;
//     }

//     CheckCollision(){
//         if(this.pos.x - this.rad < 0 || this.pos.x + this.rad > Width)
//             this.vel.x *= -1.0;
//         if(this.pos.y - this.rad < 0 || this.pos.y + this.rad > Height)
//             this.vel.y *= -1.0;        
//     }
// }

class QuadTree{
    constructor(boundries, capacity, maxDepth,currDepth){
        this.boundries = boundries;
        this.capacity = capacity;
        this.maxDepth = maxDepth;
        this.currDepth = currDepth;
        this.Data = [];
        this.divided = false;
        this.Children = [];
    }

    subdivide(){
        let tl = new Rect(this.boundries.x - this.boundries.w / 2,this.boundries.y - this.boundries.h / 2,this.boundries.w / 2,this.boundries.h / 2);
        this.Children.push(new QuadTree(tl,this.capacity,this.maxDepth,(this.currDepth + 1)));
        let tr = new Rect(this.boundries.x + this.boundries.w / 2,this.boundries.y - this.boundries.h / 2,this.boundries.w / 2,this.boundries.h / 2);
        this.Children.push(new QuadTree(tr,this.capacity,this.maxDepth,(this.currDepth + 1)));
        let bl = new Rect(this.boundries.x - this.boundries.w / 2,this.boundries.y + this.boundries.h / 2,this.boundries.w / 2,this.boundries.h / 2);
        this.Children.push(new QuadTree(bl,this.capacity,this.maxDepth,(this.currDepth + 1)));
        let br = new Rect(this.boundries.x + this.boundries.w / 2,this.boundries.y + this.boundries.h / 2,this.boundries.w / 2,this.boundries.h / 2);
        this.Children.push(new QuadTree(br,this.capacity,this.maxDepth,(this.currDepth + 1)));

        this.divided = true;
    }

    query(range,list){
        if(!list){
            list = [];
        }

        if(!this.boundries.intersect(range))
            return;


        if(this.Children.length != 0){
            for(let child of this.Children){
                child.query(range,list);
            }
        }
        else{
            for(let dat of this.Data){
                //window.count++;
                if(range.contains(dat.pos) && (range.x != dat.pos.x && range.y != dat.pos.y))
                    list.push(dat);
            }
        }
        return list;
    }
    insert(Element){
        if(!this.boundries.contains(Element.pos)){
            return false;
        }

            if(!this.divided){
                if(this.currDepth < this.maxDepth){
                    if(this.Data.length < this.capacity ){
                        this.Data.push(Element);
                    }
                    else if(!this.divided){
                        this.subdivide();

                        this.Data.push(Element);
                        for(let data of this.Data){
                            for(let child of this.Children){
                                child.insert(data);
                            }
                        }
                        this.Data.splice(0,this.Data.length);
                    }
                } 
                else{ 
                        // let contains = this.Data.indexOf(pos);
                        // if(contains != -1){
                        //     this.Data[contains] = pos;
                        // }else
                            this.Data.push(Element);
                            
                }

            }
            else{
                for(let child of this.Children){
                    child.insert(Element);
                }
            }
    }

    show(ctx){
        if(this.divided){
            for(let child of this.Children){
                child.show(ctx);
            }
        }
        else{
            ctx.beginPath();
            ctx.strokeStyle = 'white';
            ctx.strokeWidth = 2;
            ctx.rect(this.boundries.x - this.boundries.w,this.boundries.y - this.boundries.h,this.boundries.w * 2,this.boundries.h * 2);
            if(this.Data.length > 0){
                ctx.fillStyle = `hsl(${32 * this.Data.length},100%,50%)`;
                //ctx.fillStyle = 'green';
                ctx.fill()
            }
            ctx.stroke();
            ctx.closePath();

            // for(let point of this.Data){
            //     ctx.beginPath();
            //     ctx.fillStyle = 'white';
            //     ctx.arc(point.pos.x,point.pos.y,5,0,Math.PI*2);
            //     ctx.fill();
            //     ctx.closePath();
            // }
        }
    }
}
