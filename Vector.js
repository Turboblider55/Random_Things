class vec2{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    Add(v){
        this.x += v.x;
        this.y += v.y;
    }

    Sub(v){
        this.x -= v.x;
        this.y -= v.y;
    }

    Mul(s){
        this.x *= s;
        this.y *= s;
    }

    Div(d){
        this.x /= d;
        this.y /= d;
    }

    Length(){
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    Normalise(){
        let l = this.Length();
        this.Div(l);
    }

    Dot(v){
        return (this.x * v.x + this.y * v.y);
    }

    Cross(v){
        return (this.x * v.y - this.y * v.x);
    }

    Clamp(num){
        if(this.Length() > num ){
            this.Normalise();
            this.Mul(num);
        }
    }
    
}