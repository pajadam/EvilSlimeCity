var playState = {

	resetState: function(){
	 	isDead = false;
	 	hasWon = false;
	 },

	chooseLevel: function(){
		if(game.global.gameLevel == 1){
			return new Level1(); 
		}
	},

	create: function() {	
		level = this.chooseLevel();
		this.resetState();
		collisionsHandler = new CollisionsHandler();

		level.createBackground(game);
		level.addStartingText(game);

		this.initPlayer();
		this.initPlatforms();
		this.initEmitters();
		this.initLava();
		this.initRain();

		cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(player);
	},

	update: function() {  

		// collisios
	 	collisionsHandler.update();

		// animations
	 	player.animations.play('stand');
	 	lava.forEachAlive(function(item) {
       	 	item.animations.play('stand');
		}, this);

	 	
	 	// preventing "free move"
	    player.body.velocity.x = 0;
	    // controls
	    if (cursors.left.isDown){
	        player.body.velocity.x = -150;
	    }
	    else if (cursors.right.isDown){
	        player.body.velocity.x = 150;
	    }
	    // jump!
	    if (cursors.up.isDown && player.body.touching.down){
	    	game.add.tween(player).to( { angle: 360 }, 600, Phaser.Easing.Linear.None, true);

	    	game.sound.play('jump');
	        player.body.velocity.y = -150;

	        emitter.x = player.x;
    		emitter.y = player.y + 5;
			emitter.start(true, 2000, null, 20);
	    }

	    // overlaps
	    game.physics.arcade.overlap(player, lava, this.killPlayer, null, this);
	},

	killPlayer: function(){
	 	if(!hasWon){
	 		this.shakeCamera();
	 		emitter2.x = player.x + 15;
    		emitter2.y = player.y + 25;
			emitter2.start(true, 600, null, 600);

	 		isDead = true;
		 	game.sound.play('splash-death');
		 	player.kill();
		 	setTimeout(function(){
		 		game.state.start('play');
			}, 600);
	 	}
	 },

	 shakeCamera: function(){
	 	game.camera.shake(0.01, 300);
	 },

	initPlayer: function(){
		player = game.add.sprite(level.playerStartingX, level.playerStartingY, 'monster1');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('stand', [0, 1, 2], 5, true);
		game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
   		player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
	 },

	 initPlatforms: function(){
		platforms = game.add.group();
        platforms.enableBody = true;
        level.addPlatforms(platforms);
        platforms.forEachAlive(function(item) {
        	item.body.immovable = true;
		}, this);
	 },

	 initEmitters: function(){
	 	emitter = game.add.emitter(0, 0, 100);
   		emitter.makeParticles('particle');
		emitter.gravity = 200;

		emitter2 = game.add.emitter(0, 0, 100);
   		emitter2.makeParticles('particle2');
		emitter2.gravity = 50;
		emitter2.setScale(1.0, 0, 1.0, 0, 2000);
	 },

	 initLava: function(){
	 	lava = game.add.group();
        lava.enableBody = true;
        level.addLava(lava);
        lava.forEachAlive(function(item) {
       	 	item.body.immovable = true;
       	 	item.animations.add('stand', [0, 1], 2, true);
		}, this);
	 },

	 initRain: function(){
		game.global.rainSound.play();

	 	rainEmitter = game.add.emitter(game.world.centerX, 0, 400);
        rainEmitter.width = game.world.width;
        rainEmitter.angle = -3;
        rainEmitter.makeParticles('rain');

		rainEmitter.minParticleScale = 0.1;
		rainEmitter.maxParticleScale = 0.5;

		rainEmitter.setYSpeed(300, 500);
		rainEmitter.setXSpeed(-5, 5);

		rainEmitter.minRotation = 0;
		rainEmitter.maxRotation = 0;

		rainEmitter.start(false, 800, 5, 0);
	 },

};