// Event
window.addEventListener('keydown', (e) =>{

    // Move Key
    if(e.key == "ArrowUp" || e.key == "ArrowLeft" ||e.key == "ArrowRight" ||e.key == "ArrowDown"){
        keys[e.key].pressed = true;
        lastKey = e.key
    }

    // Enter Key
    if(e.key === "Enter"){     
        Interact()        
    }
})

// When release the key
window.addEventListener('keyup', (e) =>{
    if(e.key == "ArrowUp" || e.key == "ArrowLeft" ||e.key == "ArrowRight" ||e.key == "ArrowDown"){
        keys.Press = false;
        keys[e.key].pressed = false
    }   
})

// Click to launch music
window.addEventListener('click', () =>{
    !initPage && audio.Map.play();
    initPage = true
})



// Gameboy Touch Events
document.querySelector('.dpad').addEventListener('touchstart', (e) => {
    console.log(e.target.id)
    keys[e.target.id].pressed = true;
    lastKey = e.target.id
})
document.querySelector('.dpad').addEventListener('touchend', (e) => {
    keys[e.target.id].pressed = false;
})
document.getElementById('Enter').addEventListener('touchstart', (e) => {
    Interact()
})


// Interaction Dialog
function Interact(){
    const String = itemColide.toString();

    // If It's pokeball
    if(String.includes('POKEBALL')){
        if(!Inventory.includes(String)){
            Inventory.push(String);
            audio.Item.play()
        }                        
        console.log(Inventory)
    }
    // If Nothing (Just Walk)
    if(String.includes('Nothing')){
        ShowMessage(MessageList[String].message + Inventory.length+".")
        console.log('Nothing')
    }
    // 
    else{            
        ShowMessage(MessageList[String].message);
        console.log("Event", String)
    }
}

