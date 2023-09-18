// Canvas Init
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 768;
canvas.height = 768;

const mapWidth = 114;//70;
const mapHeight = 88; //40

const offSet = {x : -1980, y : -1982};
// Keys Pressed
const keys = {
    ArrowUp : { pressed : false},
    ArrowDown : { pressed : false},
    ArrowLeft : { pressed : false},
    ArrowRight : { pressed : false}
}
let lastKey = '';
let animationId;
let initPage = false;
let itemColide = "Nothing";
let messageShow = false;
let fightZone = false;
const fps = 60;
let movePx = 1.5; // Distance Character move in PX

// Background Image
const image = new Image();
image.src = 'assets/img/SoulSilver.png';
const background = new Sprite({position : { x : offSet.x, y : offSet.y}, image : image})

// foreGround Image
const foregroundImage = new Image();
foregroundImage.src = 'assets/img/SoulSilverForeground.png';
const foreground = new Sprite({position : { x : offSet.x, y : offSet.y}, image : foregroundImage})

// Player Images
const playerImageDown = new Image();
playerImageDown.src = "assets/img/playerDown.png";
const playerImageUp = new Image();
playerImageUp.src = "assets/img/playerUp.png";
const playerImageLeft = new Image();
playerImageLeft.src = "assets/img/playerLeft.png";
const playerImageRight = new Image();
playerImageRight.src = "assets/img/playerRight.png";
const SpritePlayerDimensions = {
    width : 176, // Width of Image
    height : 65, // Height of Image
    img : 4 // Number of Sprite
}
// Create Sprite Player 
const player = new Sprite({
    position : {
        x : canvas.width/2 - SpritePlayerDimensions.width/4/2,
        y : canvas.height/2 - SpritePlayerDimensions.height/2
    },
    image : playerImageDown,
    frames : { max : SpritePlayerDimensions.img, hold : 20},
    sprites : {
        up : playerImageUp,
        down : playerImageDown,
        left : playerImageLeft,
        right : playerImageRight
    }
})

// Collision Array for limit map
let collisionMap = [], boundaries = [];
Mapper(collisionMap, 1, boundaries, collisions);

// Battle Array for Zone fight
let battleMap = [], battleZonesBoundaries = [];
Mapper(battleMap, "BZ", battleZonesBoundaries, battleZone);

// Pokeball Array for CS
let PokeballMap = [], PokeballBoundaries = [];
Mapper(PokeballMap, "POKEBALL", PokeballBoundaries, Pokeball);

// Mix Pokeball and Boundary to Loop Only once
boundaries = [...boundaries, ...PokeballBoundaries];

// Animation
const movables = [background, ...boundaries, foreground, ...battleZonesBoundaries,]; // Add item to move on Canvas
const battle = {start : false}

// Collide Function
function rectangularCollision(rec1, rec2){
    return( 
        rec1.position.x + rec1.width>= rec2.position.x &&
        rec1.position.x <= rec2.position.x + rec2.width &&
        rec1.position.y  <= rec2.position.y + rec2.height &&
        rec1.position.y + rec1.height >= rec2.position.y
    )
}

// Battel Zone start
function handleBattleZone() {
    for (let i = 0; i < battleZonesBoundaries.length; i++) {
        const zones = battleZonesBoundaries[i];
        const overlapArea = (Math.min(player.position.x + player.width, zones.position.x + zones.width) - Math.max(player.position.x, zones.position.x)) *
                            (Math.min(player.position.y + player.height, zones.position.y + zones.height) - Math.max(player.position.y, zones.position.y));
        const Calc = rectangularCollision(player, zones) && overlapArea > (player.width * player.height) / 3;
        
        // Detect Zone Fight
        if (Calc) {   
            fightZone = true;
            if(Math.random() < 0.01){
                console.log('Battle Start');
                // End animation Loop
                window.cancelAnimationFrame(animationId);
                // Animation
                startBattle();
                break;
            }      
        }
    }
}


// Start Battle
function startBattle() {
    battle.start = true;
    audio.Map.stop();
    audio.Battle.play();

    gsap.to('.transition', {
        opacity: 1,
        repeat: 3,
        yoyo: true,
        duration: 0.4,
        onComplete() {
            gsap.to('.transition', {
                opacity: 1,
                duration: 0.4,
                onComplete() {
                    InitBattle();
                    animateBattle();
                    gsap.to('.transition', {
                        opacity: 0,
                        duration: 0.4,
                    })
                }
            })
        }
    });
}


// Animate
function animate(){
    animationId = window.requestAnimationFrame(animate);

    // Draw
    background.draw();   
    boundaries.forEach(boundary =>{ boundary.drawSquare();})
    battleZonesBoundaries.forEach(zones =>{ zones.drawSquare(); })
    PokeballBoundaries.forEach(balls =>{ balls.drawSquare(); })

    player.draw()
    foreground.draw()

    // Store
    let moving = true;
    player.animate = false;

    // Battle Zone  
    if( battle.start ) return

    // Any Button ---- BATTLE
    if(keys['ArrowDown'].pressed || keys['ArrowUp'].pressed || keys['ArrowLeft'].pressed || keys['ArrowRight'].pressed){
        fightZone = false
        handleBattleZone();    
    }

    // Move
    if (lastKey && keys[lastKey].pressed) {
        const directionMap = {
            ArrowUp: { image: player.sprites.up, positionChange: { x: 0, y: movePx } },
            ArrowDown: { image: player.sprites.down, positionChange: { x: 0, y: -movePx } },
            ArrowLeft: { image: player.sprites.left, positionChange: { x: movePx, y: 0 } },
            ArrowRight: { image: player.sprites.right, positionChange: { x: -movePx, y: 0 } }
        };

        const moveInfo = directionMap[lastKey];

        player.animate = true;
        player.image = moveInfo.image;

        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            const newPosition = {
                x: boundary.position.x + moveInfo.positionChange.x,
                y: boundary.position.y + moveInfo.positionChange.y
            };

            if (rectangularCollision(player, { ...boundary, position: newPosition })) {
                itemColide = boundaries[i].val;
                moving = false;
                player.animate = false;
                break;
            }
            else{
                itemColide = (fightZone) ? "BZ" : "Nothing";
            }
        }

        if (moving) {
            movables.forEach(toMove => {
                toMove.position.x += moveInfo.positionChange.x;
                toMove.position.y += moveInfo.positionChange.y;
            });
        }
    }
    
}
animate()

function ShowMessage(message){
    document.querySelector('.MessageContainer').style.display = "block";
    document.querySelector('.MessageContainer').textContent = message;
    // Hide Message
    if(messageShow){
        document.querySelector('.MessageContainer').style.display = "none";
    }
    messageShow =! messageShow
}


function Mapper(arrayMap, egal, bound, dataArray){
    for(let i = 0; i < dataArray.length; i += mapWidth){
        arrayMap.push(dataArray.slice(i, i + mapWidth));
    }
    for (let index = 0; index < arrayMap.length; index++) {
        const row = arrayMap[index];
        for (let jindex = 0; jindex < row.length; jindex++) {
            const number = row[jindex];
            const Check = (typeof number === "string") ? (number.startsWith(egal)) : number === egal;
            if (Check) {
                bound.push(new Boundary({
                    position: {
                        x: jindex * Boundary.width + offSet.x,
                        y: index * Boundary.height + offSet.y
                    },
                    val: number
                }));
            }
        }
    }
}