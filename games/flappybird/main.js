var gameScore = 0;

class firstPage extends Phaser.Scene {
    constructor() {
        super({ key: 'firstPage' });
    }
    preload() { 
        this.load.image('bg1', 'assets/bgLayer1.png');
        this.load.image('bg2', 'assets/bgLayer2.png');
        this.load.image('kv', 'assets/kv.png');
        this.load.image('btn', 'assets/btn.png');
    }
    create() { 
        const width = this.scale.width;
        const height = this.scale.height;
        this.add.image(width * 0.5, height * 0.5, 'bg1').setScale(1.4);
        this.add.image(width * 0.5, height * 0.5, 'bg2').setScale(1.4);
        this.add.image(width * 0.5, height * 0.3, 'kv').setScale(.35);
        this.add.image(width * 0.5, height * 0.7, 'btn').setScale(.35).setInteractive()
        .on('pointerdown', () => this.nextPage());;
    }
    nextPage(){
        this.scene.start('mainState')
    }
};

// Create our 'main' state that will contain the game
class mainState extends Phaser.Scene {
    constructor() {
        super({ key: 'mainState' });
    }
    preload() { 
        // Load the bird sprite
        this.load.image('ufo', 'assets/ufo.png');
        this.load.image('pipe', 'assets/asteroid.png');
        this.load.image('bg1', 'assets/bgLayer1.png');
        this.load.image('bg2', 'assets/bgLayer2.png');
        this.load.image('bg3', 'assets/bgLayer3.png');
    }
    create() { 
        // Change the background color of the game to blue
        this.cameras.main.setBackgroundColor('#71c5cf');
        
        const width = this.scale.width;
        const height = this.scale.height;

        this.add.image(width * 0.5, height * 0.5, 'bg1').setScale(1.4);
        this.add.image(width * 0.5, height * 0.5, 'bg2').setScale(1.4);
        
        // Create an empty group
        this.pipes = this.physics.add.group();
        
        // Display the bird at the position x=100 and y=245
        this.bird = this.physics.add.sprite(100, 245, 'ufo').setScale(.3);
        this.physics.add.overlap(this.bird, this.pipes, this.restartGame, null, this);
        
        // Add physics to the bird
        this.bird.body.gravity.y = 1000;  
        
        this.timer = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });
        
        // Call the 'jump' function when the spacekey is hit
        var spaceKey = this.input.keyboard.addKey('SPACE');
        
        // Add a listener to the space key
        spaceKey.on('down', function(event) {
            this.jump();
        }, this);

        // Assuming you want to handle touch events as well.
        // For touch input in Phaser 3, you typically listen to pointer events.

        // Add a listener to the global input manager for pointer down events
        this.input.on('pointerdown', function(event) {
            this.jump();
        }, this);
        
        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
    }
    update() {
        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        if (this.bird.y < 0 || this.bird.y > 490) {
            this.restartGame();
        }
    }
    // Make the bird jump 
    jump() {
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -350;
    }
    // Restart the game
    restartGame() {
        // Reset the scene or game state to restart the game
        this.scene.start("scorePage"); // In Phaser 3, this restarts the current scene
    }
    addOnePipe(x, y) {
        // Create a pipe at the position x and y
        let pipe = this.physics.add.sprite(x, y, 'pipe'); // Create sprite and enable physics in one step
    
        // Add the pipe to our previously created group
        this.pipes.add(pipe);
        
        // Log to the console to check if the function is called
        console.log("Pipe added at:", x, y);
    
        // Add velocity to the pipe to make it move left
        pipe.setVelocityX(-200); // Velocity in Phaser 3 is set using setVelocityX
        
        // Log to the console to check if the velocity is applied
        console.log("Pipe velocity:", pipe.body.velocity.x);
    
        // Automatically kill the pipe when it's no longer visible 
        //pipe.setCollideWorldBounds(true); // Enable collision with world bounds
        pipe.outOfBoundsKill = true; // Automatic destruction when out of bounds
    }
    
    addRowOfPipes() {
        // Randomly pick a number between 1 and 5
        // This will be the hole position
        let hole = Phaser.Math.Between(1, 5);
    
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (let i = 0; i < 8; i++) {
            if (i !== hole && i !== hole + 1) {
                this.addOnePipe(400, i * 60 + 35); // Adjusted to the screen width
            }
        }
    
        this.score += 1;
        this.labelScore.setText(this.score); // Update text using setText method in Phaser 3
        gameScore = this.score;
    }
};

class scorePage extends Phaser.Scene {
    constructor() {
        super({ key: 'scorePage' });
    }
    preload() { 
        
        this.load.image('btn2', 'assets/btn2.png');
    }
    create() { 
        const width = this.scale.width;
        const height = this.scale.height;
        this.add.image(width * 0.5, height * 0.5, 'bg1').setScale(1.4);
        this.add.image(width * 0.5, height * 0.5, 'bg2').setScale(1.4);
        this.add.image(width * 0.5, height * 0.3, 'kv').setScale(.35);
        this.add.image(width * 0.5, height * 0.9, 'btn2').setScale(.35).setInteractive()
        .on('pointerdown', () => this.nextPage());;



        var scoreIntro = {
            x: width * 0.37,
            y: height * 0.5,
            text: 'Your Score is:',
            style: {
              fontSize: '20px',
              fontFamily: 'font1',
              color: '#fff',
              align: 'center'
            }
          };
      
      
        var title = this.make.text(scoreIntro);


        var scoreIntro = {
            x: width * 0.45,
            y: height * 0.6,
            text: gameScore,
            style: {
              fontSize: '100px',
              fontFamily: 'font1',
              color: '#fff',
              textAlign: 'center'
            }
          };
      
      
        var title = this.make.text(scoreIntro);


    }
    nextPage(){
        this.scene.start('mainState')
    }
};
// Initialize Phaser, and create a 400px by 490px game
var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { x: 2 },
            debug: false
        }
    },
    scene: [firstPage, mainState, scorePage]
};

var game = new Phaser.Game(config);
