[![Build Status](https://travis-ci.org/zeh/key-action-binder.ts.svg?branch=master)](https://travis-ci.org/zeh/key-action-binder.ts)

# KeyActionBinder

KeyActionBinder aims to provide universal game input control for both keyboard and game controllers in JavaScript. It works independently of the game engine, the browser, or the hardware platform it is running in.


## Goals

 * Having a clear, easy to use interface.
 * Minimizing the amount of support logic needed in a game loop.
 * Providing support for typical game functionality such as button press time tolerance, dead zone protection, and others.
 * Requiring no device or control references to store.
 * Working around browser limitations where appropriate (and possible).
 * Self-containment and independence from any other system, framework, or game engine.
 * Auto-management of gamepad order for sensible party/multi-player support.


## Quick usage

Include one of the [build files](https://github.com/zeh/key-action-binder.ts/tree/master/build):

	<script src="key-action-binder.min.js"></script>

Create a `KeyActionBinder` instance:

	var binder = new KeyActionBinder();

Setup actions with as many bindings as you want:

	binder.action("move-left")
		.bind(KeyActionBinder.KeyCodes.LEFT)
		.bind(KeyActionBinder.GamepadButtons.DPAD_LEFT);

	binder.action("move-right")
		.bind(KeyActionBinder.KeyCodes.RIGHT)
		.bind(KeyActionBinder.GamepadButtons.DPAD_RIGHT);

	binder.action("jump")
		.bind(KeyActionBinder.KeyCodes.SPACE)
		.bind(KeyActionBinder.GamepadButtons.ACTION_DOWN);

Then, evaluate the actions inside your game loop:

	function myGameLoop() {
		// Check whether the player should move
		if (binder.action("move-left").activated) {
			// (...code for moving left...)
		} else if (binder.action("move-right").activated) {
			// (...code for moving right...)
		}

		if (playerIsOnGround && binder.action("jump").activated) {
			// (...code for performing jump...)
		}
	}

Read more about the project in the [https://github.com/zeh/key-action-binder.ts/wiki](wiki).