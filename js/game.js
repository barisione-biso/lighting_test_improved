/* Game namespace */
 /* Constants */
    window.c = {
        "DEBUG"     : false,
        "WIDTH"     : 640,
        "HEIGHT"    : 480
    };

var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        life: 3,
        key_1: false,
        lastLevel: "room_1"
    },

	// Run on page load.
    "onload" : function () {
		// Initialize the video.
		if (!me.video.init("screen",  me.video.CANVAS, c.WIDTH, c.HEIGHT, true, 'auto')) {
			alert("Your browser does not support HTML5 canvas.");
			return;
		}

		// add "#debug" to the URL to enable the debug Panel
		if (document.location.hash === "#debug") {
			window.onReady(function () {
				me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
			});
		}

		// Initialize the audio.
		me.audio.init("mp3,ogg");
		
		// Set a callback to run when loading is complete.
		me.loader.onload = this.loaded.bind(this);

		// Load the resources.
		me.loader.preload(game.resources);

		// Initialize melonJS and display a loading screen.
		me.state.change(me.state.LOADING);
	
		// Game engine settings.
		me.sys.gravity = 0;
	},
	/* ---
	 
	callback when everything is loaded
	 Run on game resources loaded.
	---  */
    "loaded" : function () {
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new game.PlayScreen());

		// set a global fading transition for the screen
		me.state.transition("fade", "#FFFFFF", 500);
		// register our entities in the object pool
		me.pool.register("mainPlayer", game.PlayerEntity);
		me.pool.register("LightEntity", game.LightEntity);
		
		// enable the keyboard
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.A, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');
		me.input.bindKey(me.input.KEY.D, 'right');
		me.input.bindKey(me.input.KEY.UP, 'up');
		me.input.bindKey(me.input.KEY.W, 'up');
		me.input.bindKey(me.input.KEY.DOWN, 'down');
		me.input.bindKey(me.input.KEY.S, 'down');

		me.input.bindKey(me.input.KEY.X, "jump", true);

		// start the game 
		me.state.change(me.state.PLAY); 
    },
    
    "restart": function(){
		
		this.data.score=0;
		this.data.life=3;
		this.data.key_1=false;
		this.data.lastLevel="room_1";
		
        me.state.change(me.state.PLAY);
	}
};
