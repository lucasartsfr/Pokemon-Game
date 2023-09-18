// Class for Sprite
class Sprite{
    constructor({
        position, 
        image,        
        frames = {max : 1, hold : 20}, 
        sprites = {}, 
        animate = false,         
        rotation = 0
    }){
        this.position = position
        this.frames = {...frames, val : 0, elapsed : 0}
        this.image = new Image()
        this.image.onload = () =>{
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }
        this.image.src = image.src       
        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation

    }
    // Draw Method
    draw(){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.position.x + this.width/2, this.position.y + this.height/2)
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x - this.width/2, -this.position.y - this.height/2)
        ctx.drawImage(
            this.image, // Image
            this.frames.val * this.width, // Crop X
            0, // Crop Y
            this.image.width / this.frames.max, // Crop End X
            this.image.height, // Crop End Y
            this.position.x,
            this.position.y,
            this.image.width/this.frames.max, this.image.height 
        );
        ctx.restore();
        
        // To Move
        if(this.animate){
            if(this.frames.max > 1){
                this.frames.elapsed++;
            }    
            if(this.frames.elapsed % this.frames.hold === 0){
                if(this.frames.val < this.frames.max - 1) this.frames.val += 1           
                else this.frames.val = 0;
            }    
        }
        // Default position when colide
        else{
            this.frames.val = 0;
        }

            
    }

   
}


class Monster extends Sprite {

    constructor({        
        position, 
        image,        
        frames = {max : 1, hold : 20}, 
        sprites = {}, 
        animate = false,         
        rotation = 0,
        isEnemy = false, 
        name,         
        type = "", 
        attacks,
        PV
    }){
        super({
            position, 
            image,        
            frames, 
            sprites, 
            animate,         
            rotation,
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.type = type
        this.attacks = attacks
    }

    attack({attack, recipient, renderedSpritesBattle}){

        // Type attack
        const Factor = 0 || parseInt(Object.keys(Types[attack.type]).find(effect => {
            return Types[attack.type][effect].includes( recipient.type );
        }));
        // Dialog Message
        const dialog = document.querySelector('.MessageContainer');
        dialog.style.display = "block"
        dialog.textContent =  `${this.name} utilise ${attack.name} et ${Effective[Factor]}`

        const healthBar = (this.isEnemy) ? '#myBar' : '#enemyBar';
        const movementDistance = (this.isEnemy) ? -20 : 20;
        const rotate = (this.isEnemy) ? -2.2 : 1;
        
        recipient.health -= (attack.damage * Factor)
        // Attack
        if(AttackList.List.includes(attack["name"])){
            const timeline = gsap.timeline();          
            timeline.to(this.position, {
                x : this.position.x - movementDistance,      
            }).to(this.position, {
                x : this.position.x + movementDistance*2,            
                duration : .1,
                // Enemy Get Hit
                onComplete : () => {
                    gsap.to(healthBar,{
                        width : recipient.health + "%"
                    })
                    gsap.to(recipient.position, {
                        x : recipient.position.x + 10,
                        duration : .08,
                        yoyo : true,
                        repeat : 5,
                    })
                    gsap.to(recipient, {
                        opacity : 0,
                        yoyo : true,
                        duration : .08,
                        repeat : 5,
                    })
                }
            })
            .to(this.position, {
                x : this.position.x
            })
        }
   

      audio.AttackHit.play()
        
    }


    dead(){
        // Message KO
        const dialog = document.querySelector('.MessageContainer');
        dialog.style.display = "block"
        dialog.textContent =  `${this.name} est K.O ! `

        gsap.to(this.position, {
            y : this.position.y + 20
        })
        gsap.to(this, {
            opacity : 0
        })       
        audio.Vicotry.play();
        audio.Battle.stop();
    }
}

// Class for Boundary
class Boundary{
    static width = 48;
    static height = 48;
    constructor({position, val}){
        this.position = position;
        this.width = 48;
        this.height = 48;
        this.val = val
    }

    drawSquare(){
        ctx.fillStyle = "rgba(0,0,0,0.0)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}