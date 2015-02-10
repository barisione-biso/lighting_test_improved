
/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({
	
    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

		// set the default horizontal & vertical speed (accel vector)
		this.body.setVelocity(3, 3);
		
		// set the display to follow our position on both axis
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		
		// set the entity body collision type
		this.body.collisionType=me.collision.types.PLAYER_OBJECT;
		
		//Player will collide with all the objects *filter level all_object*
		this.body.setCollisionMask(me.collision.types.ALL_OBJECT );
		
		// ensure the player is updated even when outside of the viewport
		this.alwaysUpdate = true;

		// define a basic walking animation (using all frames)
		this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5]);
		// define a standing animation (using the first frame)
		this.renderable.addAnimation("stand",  [0]);
		// set the standing animation as default
		this.renderable.setCurrentAnimation("stand");
		
		this.vulnerable=true;
		this.doingDamage=false;
		// disable gravity
		this.gravity = 0;
		
		this.facingTop=true;
    },
    /**
     * update the entity
     */
    update : function (dt) {
	
		this.doingDamage=false;
		this.isMovingX=false;
		this.isMovingY=false;
		if (me.input.isKeyPressed('left')) {
			
			if(this.renderable.angle!=0){
				this.renderable.flipX(true);
			}else{
				if(this.facingTop){
					this.renderable.angle=1.57079633;
					this.renderable.flipX(false);
				}else{
					this.renderable.angle=1.57079633;//90 Degrees to radians
					this.renderable.flipX(true);
				}
			}
			
			// update the entity velocity
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}
			this.isMovingX=true;
		} else if (me.input.isKeyPressed('right')) {
			if(this.renderable.angle!=0){
				this.renderable.flipX(false);
			}else{
				if(this.facingTop){
					this.renderable.angle=1.57079633;
					this.renderable.flipX(true);
				}else{
					this.renderable.angle=1.57079633;
					this.renderable.flipX(false);
				}
			}
			
			// update the entity velocity
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}
			this.isMovingX=true;
		} 
		
		else if (me.input.isKeyPressed('up')) {
			
			if(this.renderable.angle != 0){
				this.renderable.angle=0;
			}
			this.renderable.flipY(false);
			this.facingTop=true;
			
			// update the entity velocity
			this.body.vel.y = -this.body.accel.y * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}	
			this.isMovingY=true;
			this.facingTop=true;
		}else if (me.input.isKeyPressed('down')) {
			
			if(this.renderable.angle != 0){
				this.renderable.angle=0;
			}
			this.renderable.flipY(true);
			this.facingTop=false;
			// update the entity velocity
			this.body.vel.y = this.body.accel.y * me.timer.tick;
			// change to the walking animation
			if (!this.renderable.isCurrentAnimation("walk")) {
				this.renderable.setCurrentAnimation("walk");
			}	
			this.isMovingY=true;
			this.facingTop=false;
		} 
		
		
		if(!this.isMovingX) {
			this.body.vel.x = 0;
		}
		if(!this.isMovingY){	
			this.body.vel.y = 0;
		}
		if(!this.isMovingX && !this.isMovingY){
			// change to the standing animation
			this.renderable.setCurrentAnimation("stand");		
		}
		// apply physics to the body (this moves the entity)
		this.body.update(dt);

		// handle collisions against other shapes
		me.collision.check(this); //This method invokes as callback "this.onCollision" when a collision is found

		// return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     * If the LightEntity exists on the room, it moves it along the player.
     */
    onCollision : function (response, other) {
		var collision=false;		
        switch (response.b.body.collisionType) {
			case me.collision.types.ACTION_OBJECT:
				break;
			case me.collision.types.WORLD_SHAPE:
				other.pos.x = this.pos.x + this.body.width / 2;
				other.pos.y = this.pos.y + this.body.height / 2;
				// Do not respond to the platform (pass through)
				return false;
				break;
			case me.collision.types.ENEMY_OBJECT:
				return true; //react to the collision
				break;
			
			default:
				// Do not respond to other objects (e.g. coins)
				return false;
		  }
		  // Make the object solid
		  return true;
	}
});


game.LightEntity = me.Entity.extend({
	init: function(x, y, settings) {
		//overwrite specs
		x=0;
		y=0;
		settings.width=c.WIDTH;
		settings.height=c.HEIGHT;
		// call the constructor
		this._super(me.Entity, 'init', [x, y , settings]);
		
		// set the entity body collision type
		this.body.collisionType = me.collision.types.WORLD_SHAPE; 
		// filter collision detection with collision enemies
		this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
		
		
	},
	// manage the enemy movement
	update: function(dt) {
		// apply physics to the body (this moves the entity)
		this.body.update(dt);
		// return true if we moved or if the renderable was updated
		return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
	},
	onCollision : function (response, other) {
		return false;
	},
	
	draw: function(){
		//As seen in http://jsfiddle.net/gamealchemist/pgb3bhxj/
		var context=me.CanvasRenderer.getContext();
		var gdest = context.globalCompositeOperation;

		context.save();
		context.globalCompositeOperation = 'lighter';
		var rnd = 0.05; //* Math.sin(1.1 * Date.now() / 1000);
		var radius = 160;
		radius = radius * (1 + rnd);

		var startAngle=0;
		var endAngle=2 * Math.PI;
		var radialGradient = context.createRadialGradient(this.pos.x, this.pos.y, 0, this.pos.x, this.pos.y, radius);
		radialGradient.addColorStop(0.0, '#BB9');
		radialGradient.addColorStop(0.2 + rnd, '#AA8');
		radialGradient.addColorStop(0.7 + rnd, '#330');
		radialGradient.addColorStop(0.90, '#110');
		radialGradient.addColorStop(1, '#000');
		context.fillStyle = radialGradient;
		context.beginPath();
		context.arc(this.pos.x, this.pos.y, radius, startAngle, endAngle);
		context.lineTo(this.pos.x, this.pos.y);
		context.fill();
		context.restore();
		
		return true;
		
	}
});
