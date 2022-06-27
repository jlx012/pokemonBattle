const game = document.getElementById('canvas')
const ctx = game.getContext('2d')
const startButton = document.querySelector('#start')
const restartButton = document.querySelector('#restart')

// canvas size
game.width = 1200
game.height = 800

// gravity variable to determine speed of gravity
const gravity = 0.5
// 4 locations for where the fireballs will spawn randomly
const randomProjectileSpawn = [50, 250, 450, 650]
// empty array to push pikachu projectiles
let pikaProjectiles = []
// empty array to push charizard projectiles
let charizardProjectiles = []
// timer variable to determine how often to spawn projectile
let timer = 0
// status of whether the game is active or not
let gameStatus = true

// This what creates our pikachu
class Pikachu {
    constructor() {
        // where our pikachu will spawn at start of the game
        this.position = {
            x: 50,
            y: 600,
        }
        // this will be the speed at how fast are pikachu moves, default is 0 but will have speeds in wasd
        this.speed = {
            x: 0,
            y: 0,
        }
        // loading our pikachu image
        const image = new Image()
        image.src = 'images/game-images/pikachumain.png'
        // creating our pikachus lives
        const lives = 3

        this.lives = lives
        this.image = image
        this.width = image.width * 0.075
        this.height = image.height * 0.075
    }
    // this is what draws our pikachu onto the canvas
    character() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    // this is what constantly updates our pikachu
    update() {
        this.position.x += this.speed.x
        this.position.y += this.speed.y
        this.character()
        if (this.position.y + this.height + this.speed.y <= game.height) {
            this.speed.y += gravity
        } else { this.speed.y = 0  
        }
        this.lives
    }
}
const pikachu = new Pikachu()

// creating our thunderbolt projectile for our pikachu
class pikaProjectile {
    constructor({position, speed}) {
        this.position = position
        this.speed = speed

        const image = new Image()
        image.src = 'images/game-images/lightningbolt.png'
        // how much damage the projectile will do
        const dmg = 1

        this.dmg = dmg
        this.image = image
        this.width = image.width * 0.1
        this.height = image.height * 0.1
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}

// creating projectile for the charizard
class charizardProjectile {
    constructor({position, speed}) {
        this.position = position
        this.speed = speed

        const image = new Image()
        image.src = 'images/game-images/fireball.png'
        // how much damage the projectile will do
        const dmg = 1

        this.dmg = dmg
        this.image = image
        this.width = image.width * 0.35
        this.height = image.height * 0.35
    }
    draw() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.draw()
        this.position.x += this.speed.x
        this.position.y += this.speed.y
    }
}

// creating charizard boss
class Charizard {
    constructor() {
        this.position = {
            x: 600,
            y: 0,
        }
    
        const image = new Image()
        image.src = 'images/game-images/charizardboss.png'
        // HP for our charizard
        const hp = 100

        this.hp = hp
        this.image = image
        this.width = image.width * 0.26
        this.height = image.height * 0.34
    }
    character() {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update() {
        this.character() 
        this.hp
    }
    fireball(charizardProjectiles) {
        charizardProjectiles.push(new charizardProjectile( {
            position: {
                x: 600,
                y: randomProjectileSpawn[Math.floor(Math.random() * randomProjectileSpawn.length)]
            },
            speed: {
                x: -4.25,
                y: 0
            }
        }))
    }
}
const charizard = new Charizard()

// creating a platform onto the canvas
class Platform {
    constructor(x, y) {
        this.position = {
            x,
            y
        }
        this.width = 200
        this.height = 10
    }
    draw() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
// this is what actually makes the official 2 platforms in the game
const platforms = [new Platform(350, 200), new Platform(50, 400), new Platform(350, 600)]

// this is what constantly loops through the game making it function
function loop() {
    // if statement for win / lose condition for the game
    if (pikachu.lives === 0) {
        gameStatus = false;
        ctx.clearRect(400, 5, 450, 60)
        ctx.font = '50px Ariel'
        ctx.fillText('You Lose!', 500, 50)
        return
      } else if (charizard.hp === 0) {
            gameStatus = false;
            ctx.clearRect(400, 5, 450, 60)
            ctx.font = '50px Ariel'
            ctx.fillText('You Win!', 500, 50)
            return
      }
    
    requestAnimationFrame(loop) 
    ctx.clearRect(0, 0, game.width, game.height)
    pikachu.update()
    charizard.update()
    // detection code for when projectile impacts with charizard
    pikaProjectiles.forEach((projectile, index) => {
        if(projectile.position.x + projectile.width >= charizard.position.x + charizard.width / 2) {
            pikaProjectiles.splice(index, 1);
            charizard.hp -= projectile.dmg;
            console.log(charizard.hp) 
        }
        projectile.update()
    })
    // detection code for when projectile impacts with pikachu or goes off screen
    charizardProjectiles.forEach((projectile, index) => {
        if (projectile.position.x + projectile.width <= 0) {
            setTimeout(() => {
                charizardProjectiles.splice(index, 1)
            })
        }
        if (projectile.position.x - projectile.width / 4  <= pikachu.position.x && 
        projectile.position.x + projectile.width / 4 >= pikachu.position.x &&
        projectile.position.y + projectile.height / 1.75 >= pikachu.position.y &&
        projectile.position.y - projectile.height / 1.75 <= pikachu.position.y) {
            charizardProjectiles.splice(index, 1);
            pikachu.lives -= projectile.dmg;     
            console.log(pikachu.lives)     
        } else {
            projectile.update()
        }
    })

    // if statement for when charizard hits 50% health, he starts shooting projectiles faster
    if (charizard.hp > 50) {
        if (timer % 100 === 0) {
            charizard.fireball(charizardProjectiles)
        }
    } else if (charizard.hp <= 50) {
        ctx.font = '50px Ariel'
        ctx.fillText('Charizard is furious!', 400, 50)
        if (timer % 50 === 0) {
            charizard.fireball(charizardProjectiles)
        }
    }


    
    platforms.forEach(platform => {
        platform.draw()
    })
    platforms.forEach(platform => {
        if (pikachu.position.y + pikachu.height <= platform.position.y && 
            pikachu.position.y + pikachu.height + pikachu.speed.y >= platform.position.y && 
            pikachu.position.x + pikachu.width >= platform.position.x && 
            pikachu.position.x <= platform.position.x + platform.width) {
            pikachu.speed.y = 0
        } 
    })
    timer++
}

// this is what causes are pikachu to move on the canvas
function movementHandlerDown({keyCode}) {
    if (gameStatus.notActive) return

    switch (keyCode) {
        // up
        case (87):
        case (38):
             pikachu.speed.y = -15
            break
        // left
        case (65):
        case (37):
            pikachu.speed.x = -5
            break
        // down
        case (83):
        case (40):
            pikachu.speed.y += 0
            break
        // right
        case (68):
        case (39):
            pikachu.speed.x = 5
            break   
        // space
        case (32):
            // this is what fires the thunderbolt everytime we hit space bar
            pikaProjectiles.push(new pikaProjectile({
                position: {
                    x: pikachu.position.x + pikachu.height,
                    y: pikachu.position.y + pikachu.width / 2
                },
                speed: {
                    x: 4,
                    y: 0
                }
            }))
    }
}

// this is what stops our pikachus movement when we let go of wasd key
function movementHandlerUp({keyCode}) {
    switch (keyCode) {
        case (87):
        case (38):
             pikachu.speed.y -= 0
            break
        case (65):
        case (37):
            pikachu.speed.x = 0
            break
        case (83):
        case (40):
            pikachu.speed.y += 0
            break
        case (68):
        case (39):
            pikachu.speed.x = 0
            break   
        case (32):
            break
    }
}

// this is the function to restart game and reset everything
function restartGame() {
    if (gameStatus === false ) {
        pikachu.position = {
            x: 50,
            y: 600
        }
        pikachu.lives = 3
        charizard.hp = 100
        pikaProjectiles = []
        charizardProjectiles = []
        gameStatus = true
        loop()
    }
}

// this is the function to start our game
function startGame() {
    if (gameStatus && timer === 0) {
        loop()
    }
}
// how we call our start game function when clicking start game button
startButton.addEventListener('click', startGame)
// how we call our restart game function when clicking restart game button
restartButton.addEventListener('click', restartGame)

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('keydown', movementHandlerDown) 
    document.addEventListener('keyup', movementHandlerUp) 
})


