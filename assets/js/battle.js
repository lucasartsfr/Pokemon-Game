
// Battle Animation
const battleBg = new Image();
battleBg.src = "assets/img/battleBackground2.png";
const battleBackground = new Sprite({
    position : {
        x : 0,
        y : 0
    },
    image : battleBg
})

// Me Animation
let pokemonSprite;
let enemySprite;
let renderedSpritesBattle = [enemySprite, pokemonSprite]
let battleAnimationId;
let queue;


// Init Battle
function InitBattle(){    
    document.querySelector('.FightBox').style.display = "block";
    document.getElementById('myBar').style.width = "100%";
    document.getElementById('enemyBar').style.width = "100%";    
    document.querySelector('.FightContainer').replaceChildren();

    document.getElementById('enemyName').textContent = Monsters.EnemyChara.name;
    document.getElementById('myName').textContent = Monsters.Character.name;

    pokemonSprite = new Monster(Monsters.Character);
    enemySprite = new Monster(Monsters.EnemyChara);
    renderedSpritesBattle = [enemySprite, pokemonSprite];
    queue = []

    // Dynamic Attack
    pokemonSprite.attacks.forEach((attack) =>{
        const ButtonAttack = `<div class="ButtonAttack" data-atk="${attack.name}">${attack.name}<span class="TypeAtk ${attack.type}">${attack.type}</span></div>`;
        const FightContainer = document.querySelector('.FightContainer').insertAdjacentHTML( 'beforeend', ButtonAttack );
    })

    // Attack Event Listener
    document.querySelectorAll('.ButtonAttack').forEach(button =>{
        button.addEventListener('click', (e) =>{
            const Name = e.currentTarget.getAttribute("data-atk"); // Get Atk Name

            // My Attack
            pokemonSprite.attack({
                attack : AttackList[Name], // Attack From List
                recipient : enemySprite, // Enemy
                renderedSpritesBattle
            })

            // End if Enemy Dead
            if(enemySprite.health <=0) {
                queue.push(() =>{ enemySprite.dead() })
                endBattleTransition()
            }
            
            // Random Attack Enemy
            const randomIndex = Math.floor(Math.random() * enemySprite.attacks.length);
            const randomAttack = enemySprite.attacks[randomIndex];

            // Enemy Attack Queue add
            queue.push(() =>{
                enemySprite.attack({
                    attack : AttackList[randomAttack.name],
                    recipient : pokemonSprite,
                    renderedSpritesBattle
                })
            })


        })
    })

}


// Start Battale
function animateBattle(){
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw()
    renderedSpritesBattle.forEach((sprite) =>{ sprite.draw() })
}
// InitBattle()
// animateBattle()

// End Battle and Go back to World
function endBattleTransition(){
    queue.push(() =>{
        gsap.to('.transition',{
            opacity : 1,
            onComplete : () => {
                cancelAnimationFrame(battleAnimationId);
                animate();
                gsap.to('.transition',{
                    opacity : 0
                })
                document.querySelector('.FightBox').style.display = "none";
                document.querySelector('.MessageContainer').style.display = "none";
                battle.start = false;    
                
                audio.Vicotry.stop();           
                audio.Map.play();
                
            }
        })
    })
}



document.querySelector('.MessageContainer').addEventListener('click', (e) =>{
    
    // If I am Dead Check
    if(pokemonSprite.health <=0) {
        queue.push(() =>{ pokemonSprite.dead() })
        console.log('You are K.O!')
        endBattleTransition()
    }


    // Queue Enemy Attack
    if(queue?.length > 0 && battle.start){
        console.log("here")
        queue[0](); // Enemy Attack
        queue.shift(); // Remove Attack
    }
    // Hide Dialog Box
    else{
        e.currentTarget.style.display = "none"
    }    
})