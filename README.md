[![Build Status](https://travis-ci.org/zeh/key-action-binder.ts.svg?branch=master)](https://travis-ci.org/zeh/key-action-binder.ts)

# KeyActionBinder

KeyActionBinder tries to provide universal game input control for both keyboard and game controllers in JavaScript, independent of the game engine used, the browser, or the hardware platform it is running in.

While the browser already provides all the means for using keyboard and game input (via the [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent) and [Gamepad](https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad) APIs), KeyActionBinder tries to abstract those classes behind a straightforward, higher-level interface. It is meant to be simple but powerful, while solving some of the most common pitfalls involved with player input in JavaScript-based games.

Notice: this is still under development. It is based on my original [KeyActionBinder ActionScript library](https://github.com/zeh/key-action-binder), although with a different interface (and more features).


## Goals

 * Having a clear, easy to use interface
 * Making the game loop code as small as possible by wrapping actual gamepad and keyboard input logic behind action and axis string ids (created at setup)
 * Allowing easy setup of typical game-like functionality such as button press time tolerance, axis transition speeds, dead zone protection, etc
 * Having no device or control references to maintain or store
 * Working around browser limitations where appropriate (and possible) to provide a consistent experience
 * Self-containment and independence from any other system, framework, or game engine
 * Auto-management of gamepad order for sensible party/multi-player support

## Usage

Include the file:

	<script src="key-action-binder.min.js"></script>

Create an instance:

	binder = new KeyActionBinder();

Setup actions with as many bindings as you want:

	// Simple binding, keyboard
	binder.action("move-left").bindKeyboard(KeyActionBinder.KeyCodes.LEFT);
	binder.action("move-right").bindKeyboard(KeyActionBinder.KeyCodes.RIGHT);
	
	// Simple binding, gamepad
	binder.action("move-left").bindGamepad(KeyActionBinder.GamepadButtons.DPAD_LEFT);
	binder.action("move-right").bindGamepad(KeyActionBinder.GamepadButtons.DPAD_RIGHT);

	// Actions can be chained for simpler use
	binder.action("fire")
		.bindKeyboard(KeyActionBinder.KeyCodes.ENTER)
		.bindGamepad(KeyActionBinder.GamepadButtons.ACTION_LEFT);

Some actions can have a tolerance time (in seconds), so when checking if an action is active, it also checks if it has just been pressed:

	binder.action("jump")
		.bindKeyboard(KeyActionBinder.KeyCodes.SPACE)
		.bindGamepad(KeyActionBinder.GamepadButtons.ACTION_DOWN)
		.setTolerance(0.05); // To prevent a player from hitting the jump button while still in the air

Then, evaluate the actions inside your game loop:

	function myGameLoop() {
		// Check whether the player should move
		if (binder.action("move-left").activated) {
			// (...code for moving left...)
		} else if (binder.action("move-right").activated) {
			// (...code for moving right...)
		}
	}

Actions can be "consumed" so they only work once when pressed:

	function myGameLoop() {
		if (playerIsOnGround && binder.action("jump").activated) {
			// (...code for performing jump...)

			// Make sure the player has to release and press jump again to perform another jump
			binder.action("jump").consume();
		}
	}

You can also use the axis for movements, including simulating an axis with keyboard keys:
	
	// You can also use the axis for movement instead:
	binder.axis("move-x")
		.bindGamepad(KeyActionBinder.GamepadAxes.STICK_LEFT_X)
		.bindKeyboard(KeyActionBinder.KeyCodes.LEFT, KeyActionBinder.KeyCodes.RIGHT);
		
	function myGameLoop() {
		var speedScaleX = binder.axis("move-x").value; // Value will be a number between -1 and 1
		player.x += speedScaleX * maximumSpeed;
	}

## Tests/demos

 * TODO.


## Read more

 * TODO.


## License

KeyActionBinder uses the [MIT License](http://choosealicense.com/licenses/mit/). You can use this code in any project, whether of commercial nature or not. If you redistribute the code, the license (LICENSE.txt) must be present with it.


## To-do

 * Test:
   * support for 2+ controllers
   * Actions bound to several different keys/gamepad buttons at the same time
   * If maintainPlayerPositions is necessary

 * Allow complex sequence bindings with timing constraints (hadouken, etc)
   * Certain commands in the sequence should be interchangeable (http://wiki.shoryuken.com/The_King_of_Fighters_XIII/Game_Elements/Command_Interpreter)
   * Leniency for simultaneous presses, e.g, punch + kick
   * Check backwards? Check if the last button in the sequence was pressed, and if so, travel backwards in a buffer to see if the whole sequence was pressed

 * Axis-simulating gamepad button binds (like keyboard axis)
 * Proper documentation
 * Allow detecting "any" gamepad/keyboard key (for "press any key")
 * More profiling and testing performance/bottlenecks/memory allocations (http://www.html5rocks.com/en/tutorials/webperformance/usertiming/)
 * Better demos
 * Expose recent device
 * Check navigator.getGamepads to see if gamepads are actually accessible without breaking
 * Automated tests (tsUnit?)
 * Adopt some CI service (https://ci.testling.com/guide/quick_start) (https://ci.testling.com/zeh/key-action-binder.ts) (https://travis-ci.org/) (http://stackoverflow.com/questions/13412211/using-travis-ci-for-client-side-javascript-libraries) (https://coveralls.io/)
 * Allow key combinations (modifiers)?
 * Add a fast path for gamepad status checking?
 * Something for "duration" of an action? so the player can do stronger/longer jumps, etc
 * Ways to clear/remove actions
 * Use LET instead of vars