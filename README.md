# KeyActionBinder

KeyActionBinder tries to provide universal game input control for both keyboard and game controllers in JavaScript, independent of the game engine used, the browser, or the hardware platform it is running in.

While the browser already provides all the means for using keyboard and game input (via the [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/KeyboardEvent) and [Gamepad](https://developer.mozilla.org/en-US/docs/Web/Guide/API/Gamepad) APIs), KeyActionBinder tries to abstract those classes behind a straightforward, higher-level interface. It is meant to be simple but powerful, while solving some of the most common pitfalls involved with player input in JavaScript-based games.

Notice: this is still under development. It is based on my original [KeyActionBinder ActionScript library](https://github.com/zeh/key-action-binder), although with a different interface.


## Goals

 * Unified interface for keyboard and game controller input
 * Made to be fast: memory allocation is kept to a minimum, with no device references or instances to maintain
 * Abstract actual controls in favor of action ids: easier to configure key bindings through variables, with redundant input types (keyboard and gamepad)
 * Automatic bindings on any platform by working around browser limitations
 * Self-containment and independence from any other system or framework

## Usage

	<script src="key-action-binder.min.js"></script>

	// Create instance
	binder = new KeyActionBinder();
	
	// Setup as many action bindings as you want
	binder.action("move-left").addKeyboardBinding(KeyActionBinder.KeyCodes.LEFT);
	binder.action("move-right").addKeyboardBinding(KeyActionBinder.KeyCodes.RIGHT);
	binder.action("move-left").addGamepadButtonBinding(KeyActionBinder.GamepadButtons.DPAD_LEFT);
	binder.action("move-right").addGamepadButtonBinding(KeyActionBinder.GamepadButtons.DPAD_RIGHT);
	
	binder.action("jump").addKeyboardBinding(KeyActionBinder.KeyCodes.SPACE);
	binder.action("jump").addGamepadButtonBinding(KeyActionBinder.GamepadButtons.ACTION_DOWN);

	// Evaluate actions in the game loop
	function myGameLoop() {
		// Check whether the player should move
		if (binder.action("move-left").activated) {
			// Move left...
		} else if (binder.action("move-right").activated) {
			// Move right...
		}
		
		// Check whether an action should be performed
		if (playerIsOnGround && binder.action("jump").activated) {
			// Perform jump...

			// Consume the action, so the player has to press jump again to perform another jump
			binder.action("jump").consume();
		}
	}

## Tests/demos

 * TODO.


## Read more

 * TODO.


## License

KeyActionBinder uses the [MIT License](http://choosealicense.com/licenses/mit/). You can use this code in any project, whether of commercial nature or not. If you redistribute the code, the license (LICENSE.txt) must be present with it.


## To-do

 * Interpret gamepad axes
 * Proper documentation
 * Allow detecting "any" gamepad/keyboard key (for "press any key")
 * Allow complex sequence bindings with timing constraints (hadouken, etc)
 * More profiling and testing performance/bottlenecks/memory allocations (http://www.html5rocks.com/en/tutorials/webperformance/usertiming/)
 * Better demos
 * Test support for 2+ controllers
 * Automated tests
 * Add a fast path for gamepad status checking?