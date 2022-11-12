class Boid{
    constructor(ColorValue){
        this.maxForce = 0.1;
        this.Speed = 2.0;
        this.pos = new vec2(Math.random() * Width,Math.random() * Height);
        this.vel = new vec2(Math.random() * 2 - 1, Math.random() * 2 - 1);
        this.vel.Normalise();
        this.acc = new vec2(0,0);
        this.vel.Mul(this.Speed)
        this.ColorValue = ColorValue;
    }


    Show(ctx){
        ctx.beginPath();
        ctx.fillStyle = this.ColorValue;
        let NormalDir = new vec2(this.vel.x,this.vel.y);
        NormalDir.Normalise();
        let SideDir = new vec2(-NormalDir.y,NormalDir.x);
        //console.log(SideDir)
        ctx.moveTo(this.pos.x + NormalDir.x * 10, this.pos.y + NormalDir.y * 10);
        ctx.lineTo(this.pos.x - SideDir.x * 10, this.pos.y - SideDir.y * 10);
        //ctx.lineTo(this.pos.x - NormalDir.x * 5, this.pos.y - NormalDir.y * 5);
        ctx.lineTo(this.pos.x + SideDir.x * 10, this.pos.y + SideDir.y * 10);
        ctx.lineTo(this.pos.x + NormalDir.x * 10, this.pos.y + NormalDir.y * 10);
        //ctx.arc(this.pos.x,this.pos.y,5,0,Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    Update(dt){
        //this.vel.Mul(dt);
        this.pos.Add(this.vel);
        this.vel.Add(new vec2((Math.random() * 2 -1)*0.05,(Math.random() * 2 -1)*0.05))
        //this.acc.Mul(dt);
        this.vel.Add(this.acc);

        this.acc = new vec2(0,0);
    }

    Separation(OtherBoids){
        if(!OtherBoids.length > 0)
        return;

        let SepForce = new vec2(0,0);

        for(let boid of OtherBoids){
            let d = new vec2(boid.pos.x,boid.pos.y);
            d.Sub(this.pos);
            let SepMag = -(20.0 / d.Length());

            d.Normalise();
            d.Mul(SepMag);
            SepForce.Add(d);
        }
       
        //SepForce.Div(OtherBoids.length);

        SepForce.Mul(this.maxForce);
        SepForce.Clamp(this.Speed);
        
        //console.log(SepForce);
        this.acc.Add(SepForce);
    }

    Alignment(OtherBoids){
        if(!OtherBoids.length > 0)
            return;
    
        let avgDir = new vec2(0,0);
        for(let other of OtherBoids){
            avgDir.Add(other.vel);
        }

        avgDir.Div(OtherBoids.length);
        avgDir.Normalise();
        avgDir.Mul(this.Speed);
        avgDir.Sub(this.vel);
        
        avgDir.Clamp(this.maxForce);
        
        this.acc.Add(avgDir);

        //console.log(new vec2(avg.x,avg.y))
    }
    Cohesion(OtherBoids){
        if(!OtherBoids.length > 0)
        return;

        let avgPos = new vec2(0,0);

        for(let Boid of OtherBoids){
            avgPos.Add(Boid.pos);
        }
        avgPos.Div(OtherBoids.length)
        avgPos.Sub(this.pos);

        // Force.Normalise();
        // Force.Mul(this.Speed);
        //console.log(Force)
        avgPos.Clamp(this.maxForce);

        this.acc.Add(avgPos);
    }

    flock(OtherBoids){
        this.Separation(OtherBoids);
        this.Alignment(OtherBoids);
        this.Cohesion(OtherBoids); 
    }

    Border(minw,maxw,minh,maxh){
        if(this.pos.x < minw)
            this.pos.x = maxw;
        if(this.pos.x > maxw)
        this.pos.x = minw;   

        if(this.pos.y < minh)
            this.pos.y = maxh;
        if(this.pos.y > maxh)
        this.pos.y = minh;  
    }
}