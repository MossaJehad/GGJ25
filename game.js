const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 720 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
let platforms, score1 = 0, score2 = 0;

function preload() {
    this.load.image('sky', './assets/Cloudes/1.png');
    this.load.image('cloude', './assets/Cloudes/2.png');
    this.load.image('platform', 'https://labs.phaser.io/assets/sprites/platform.png');
    this.load.spritesheet('dude', 
        './assets/Dude_Monster/Dude_Monster.png', 
        { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('idle',
        './assets/Dude_Monster/Dude_Monster_Idle_4.png',
        { frameWidth: 64, frameHeight: 64 } 
    );
    
    this.load.spritesheet('walk',
        './assets/Dude_Monster/Dude_Monster_Walk_6.png',
        { frameWidth: 64, frameHeight: 64 } 
    );
    
    this.load.spritesheet('jump',
        './assets/Dude_Monster/Dude_Monster_Jump_8.png',
        { frameWidth: 64, frameHeight: 64 }
    );
    const img = new Image();
    img.src = './assets/Dude_Monster/Dude_Monster_Idle_4.png';
    img.onload = () => console.log(`Width: ${img.width}, Height: ${img.height}`);

} 

function create() {
    const skyImage = this.add.image(window.innerWidth/2, window.innerHeight/2, 'sky');
    const cloudeImage = this.add.image(window.innerWidth/2, window.innerHeight/2, 'cloude');
    
    skyImage.setScale(window.innerWidth / skyImage.width);
    cloudeImage.setScale(window.innerWidth / cloudeImage.width);
    platforms = this.physics.add.staticGroup();
    
    platforms.create(window.innerWidth/2, window.innerHeight - 50, 'platform').setScale(4).refreshBody();
    platforms.create(200, 500, 'platform').setScale(0.5).refreshBody();
    platforms.create(600, 400, 'platform').setScale(0.5).refreshBody();
    platforms.create(400, 300, 'platform').setScale(0.5).refreshBody();
    platforms.create(800, 200, 'platform').setScale(0.5).refreshBody();

    this.player1 = this.physics.add.sprite(100, 450, 'dude');
    this.player2 = this.physics.add.sprite(150, 450, 'dude');
    
    [this.player1, this.player2].forEach(player => {
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setSize(24, 42);
        player.body.setOffset(4, 6);
    });
    
    this.player2.setTint(0xff8888);

    this.physics.add.collider([this.player1, this.player2], platforms);

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('idle', {
            start: 0,
            end: 3,
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('walk', {
            start: 0,
            end: 5,
        }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('jump', {
            start: 0,
            end: 7,
        }),
        frameRate: 10,
        repeat: 0
    });
    

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
        'W': Phaser.Input.Keyboard.KeyCodes.W,
        'A': Phaser.Input.Keyboard.KeyCodes.A,
        'S': Phaser.Input.Keyboard.KeyCodes.S,
        'D': Phaser.Input.Keyboard.KeyCodes.D
    });
}

function update() {
    handlePlayerMovement(this.player1, {
        left: this.cursors.left,
        right: this.cursors.right,
        jump: this.cursors.up
    });

    handlePlayerMovement(this.player2, {
        left: this.wasd.A,
        right: this.wasd.D,
        jump: this.wasd.W
    });
}

function handlePlayerMovement(player, controls) {
    if (controls.left.isDown) {
        player.setVelocityX(-300);
        player.anims.play('walk', true);
        player.flipX = true;
    } else if (controls.right.isDown) {
        player.setVelocityX(300);
        player.anims.play('walk', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.play('idle', true);
    }

    if (player.anims && player.anims.get('jump')) {
        player.anims.play('jump');
    }
}

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});