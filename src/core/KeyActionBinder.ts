/// <reference path="./../libs/signals/SimpleSignal.ts" />
/// <reference path="Action.ts" />
/// <reference path="Axis.ts" />

/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
class KeyActionBinder {

	// Constants
	public static VERSION:String = "1.0.0";

	// Enums (Internal)
	public static KeyCodes = {
		ANY: 81653812,
		A: 65,
		ALT: 18,
		B: 66,
		BACKQUOTE: 192,
		BACKSLASH: 220,
		BACKSPACE: 8,
		C: 67,
		CAPS_LOCK: 20,
		COMMA: 188,
		CTRL: 17,
		D: 68,
		DELETE: 46,
		DOWN: 40,
		E: 69,
		END: 35,
		ENTER: 13,
		EQUAL: 187,
		ESCAPE: 27,
		F: 70,
		F1: 112,
		F10: 121,
		F11: 122,
		F12: 123,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		G: 71,
		H: 72,
		HOME: 36,
		I: 73,
		INSERT: 45,
		J: 74,
		K: 75,
		L: 76,
		LEFT: 37,
		LEFTBRACKET: 219,
		M: 77,
		MINUS: 189,
		N: 78,
		NUMBER_0: 48,
		NUMBER_1: 49,
		NUMBER_2: 50,
		NUMBER_3: 51,
		NUMBER_4: 52,
		NUMBER_5: 53,
		NUMBER_6: 54,
		NUMBER_7: 55,
		NUMBER_8: 56,
		NUMBER_9: 57,
		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		NUM_LOCK: 144,
		O: 79,
		P: 80,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PAUSE: 19,
		PERIOD: 190,
		Q: 81,
		QUOTE: 222,
		R: 82,
		RIGHT: 39,
		RIGHTBRACKET: 221,
		S: 83,
		SCROLL_LOCK: 145, // Test
		SELECT: 93, // Menu in windows
		SEMICOLON: 186,
		SHIFT: 16,
		SLASH: 191,
		SPACE: 32,
		T: 84,
		TAB: 9,
		U: 85,
		UP: 38,
		V: 86,
		W: 87,
		WINDOWS_LEFT: 91,
		WINDOWS_RIGHT: 92,
		X: 88,
		Y: 89,
		Z: 90
	};

	public static KeyLocations = {
		ANY: 81653813,
		STANDARD: 0,
		LEFT: 1,
		RIGHT: 2,
		NUMPAD: 3,
	};

	public static GamepadLocations = {
		ANY: 81653814,
	};

	public static GamepadButtons = {
		ANY: {index: 81653815},
		ACTION_DOWN: {index: 0},
		ACTION_RIGHT: {index: 1},
		ACTION_LEFT: {index: 2},
		ACTION_UP: {index: 3},
		LEFT_SHOULDER: {index: 4}, // Left shoulder button
		RIGHT_SHOULDER: {index: 5},
		LEFT_SHOULDER_BOTTOM: {index: 6}, // Left Trigger
		RIGHT_SHOULDER_BOTTOM: {index: 7},
		SELECT: {index: 8},
		START: {index: 9},
		STICK_LEFT_PRESS: {index: 10},
		STICK_RIGHT_PRESS: {index: 11},
		DPAD_UP: {index: 12},
		DPAD_DOWN: {index: 13},
		DPAD_LEFT: {index: 14},
		DPAD_RIGHT: {index: 15}
	};

	public static GamepadAxes = {
		STICK_LEFT_X: {index: 0},
		STICK_LEFT_Y: {index: 1},
		STICK_RIGHT_X: {index: 2},
		STICK_RIGHT_Y: {index: 3}
	}

	// Properties
	private _isRunning:boolean;
	private _maintainPlayerPositions:boolean;														// Whether it tries to keep player positions or not
	private _recentDevice:Gamepad;																	// The most recent device that sent an event // TODO: properly use this, duh

	// Instances
	private actions:{ [index:string]:KAB.Action };													// All added actions, as a dictionary
	private axes:{ [index:string]:KAB.Axis };														// All added axis, as a dictionary

	private _onActionActivated:zehfernando.signals.SimpleSignal<(action:string) => void>;			// TODO: properly import modules to avoid using the whole identifier?
	private _onActionDeactivated:zehfernando.signals.SimpleSignal<(action:string) => void>;
	private _onActionValueChanged:zehfernando.signals.SimpleSignal<(action:string, value:number) => void>;
	private _onDevicesChanged:zehfernando.signals.SimpleSignal<() => void>;
	private _onRecentDeviceChanged:zehfernando.signals.SimpleSignal<(gamepad:Gamepad) => void>; // TODO: use a Gamepad wrapper?

	private bindCache:any;																			// Should have been "{ [index: Function]: Function }", but that's not allowed.. maybe create a separate class later

	private currentFrame:number;																	// Used to count update checks
	private lastFrameGamepadsChecked:number;														// Last frame where gamepad input was checked


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		this.bindCache = {};

		this._isRunning = false;
		this._maintainPlayerPositions = false;
		this.actions = {};
		this.axes = {};

		this._onActionActivated = new zehfernando.signals.SimpleSignal<(action:string) => void>();
		this._onActionDeactivated = new zehfernando.signals.SimpleSignal<(action:string) => void>();
		this._onActionValueChanged = new zehfernando.signals.SimpleSignal<(action:string, value:number) => void>();
		this._onDevicesChanged = new zehfernando.signals.SimpleSignal<() => void>();
		this._onRecentDeviceChanged = new zehfernando.signals.SimpleSignal<(gamepad:Gamepad) => void>();

		this.currentFrame = 0;
		this.lastFrameGamepadsChecked = 0;

		this.start();
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	/**
	 * Starts listening for input events.
	 *
	 * <p>This happens by default when a KeyActionBinder object is instantiated; this method is only useful if
	 * called after <code>stop()</code> has been used.</p>
	 *
	 * <p>Calling this method when a KeyActionBinder instance is already running has no effect.</p>
	 *
	 * @see #isRunning
	 * @see #stop()
	 */
	public start():void {
		if (!this._isRunning) {
			// Starts listening to keyboard events
			window.addEventListener("keydown", this.getBoundFunction(this.onKeyDown));
			//window.addEventListener("keypress", this.getBoundFunction(this.onKeyDown)); // this fires with completely unrelated key codes; TODO: investigate why
			window.addEventListener("keyup", this.getBoundFunction(this.onKeyUp));

			// Starts listening to device change events
			window.addEventListener("gamepadconnected", this.getBoundFunction(this.onGamepadAdded));
			window.addEventListener("gamepaddisconnected", this.getBoundFunction(this.onGamepadRemoved));

			this.refreshGamepadList();

			this._isRunning = true;

			this.incrementFrameCount();
		}
	}

	/**
	 * Stops listening for input events.
	 *
	 * <p>Action bindings are not lost when a KeyActionBinder instance is stopped; it merely starts ignoring
	 * all input events, until <code>start()<code> is called again.</p>
	 *
	 * <p>This method should always be called when you don't need a KeyActionBinder instance anymore, otherwise
	 * it'll be listening to events indefinitely.</p>
	 *
	 * <p>Calling this method when this a KeyActionBinder instance is already stopped has no effect.</p>
	 *
	 * @see #isRunning
	 * @see #start()
	 */
	public stop():void {
		if (this._isRunning) {
			// Stops listening to keyboard events
			window.removeEventListener("keydown", this.getBoundFunction(this.onKeyDown));
			window.removeEventListener("keyup", this.getBoundFunction(this.onKeyUp));

			// Stops listening to device change events
			window.removeEventListener("gamepadconnected", this.getBoundFunction(this.onGamepadAdded));
			window.removeEventListener("gamepaddisconnected", this.getBoundFunction(this.onGamepadRemoved));

			this._isRunning = false;
		}
	}

	/**
	 * Gets an action instance, creating it if necessary
	 */
	public action(id:string):KAB.Action {
		// Check gamepad state
		if (this.lastFrameGamepadsChecked < this.currentFrame) this.updateGamepadsState();

		// Create Action first if needed
		if (!this.actions.hasOwnProperty(id)) this.actions[id] = new KAB.Action(id);

		return this.actions[id];
	}

	/**
	 * Gets an axis instance, creating it if necessary
	 */
	public axis(id:string):KAB.Axis {
		// Check gamepad state
		if (this.lastFrameGamepadsChecked < this.currentFrame) this.updateGamepadsState();

		// Create Axis first if needed
		if (!this.axes.hasOwnProperty(id)) this.axes[id] = new KAB.Axis(id);

		return this.axes[id];
	}


	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	public get onActionActivated() {
		return this._onActionActivated;
	}

	public get onActionDeactivated() {
		return this._onActionDeactivated;
	}

	public get onActionValueChanged() {
		return this._onActionValueChanged;
	}

	public get onDevicesChanged() {
		return this._onDevicesChanged;
	}

	public get onRecentDeviceChanged() {
		return this._onRecentDeviceChanged;
	}

	/**
	 * Whether this KeyActionBinder instance is running, or not. This property is read-only.
	 *
	 * @see #start()
	 * @see #stop()
	 */
	public get isRunning(): boolean {
		return this._isRunning;
	}


	// ================================================================================================================
	// EVENT INTERFACE ------------------------------------------------------------------------------------------------

	private onKeyDown(e:KeyboardEvent):void {
		for (var iis in this.actions) this.actions[iis].interpretKeyDown(e.keyCode, e.location);
		for (var iis in this.axes) this.axes[iis].interpretKeyDown(e.keyCode, e.location);
	}

	private onKeyUp(e:KeyboardEvent):void {
		for (var iis in this.actions) this.actions[iis].interpretKeyUp(e.keyCode, e.location);
		for (var iis in this.axes) this.axes[iis].interpretKeyUp(e.keyCode, e.location);
	}

	private onGamepadAdded(e:GamepadEvent):void {
		this.refreshGamepadList();
	}

	private onGamepadRemoved(e:GamepadEvent):void {
		this.refreshGamepadList();
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	private incrementFrameCount():void {
		if (this._isRunning) {
			this.currentFrame++;
			window.requestAnimationFrame(this.incrementFrameCount.bind(this));
		}
	}

	/**
	 * Update the known state of all buttons/axis
	 */
	public updateGamepadsState():void {
		//console.time("check");

		// Check all buttons of all gamepads
		var gamepads = navigator.getGamepads();
		var gamepad:Gamepad;
		var i:number, j:number, l:number;
		var action:KAB.Action;
		var buttons:GamepadButton[];
		var axis:KAB.Axis;
		var axes:number[];

		// For all gamepads...
		for (i = 0; i < gamepads.length; i++) {
			gamepad = gamepads[i];
			if (gamepad != null) {
				// ..and all actions...
				for (var iis in this.actions) {
					action = this.actions[iis];

					// ...interpret all gamepad buttons
					buttons = gamepad.buttons;
					l = buttons.length;
					for (j = 0; j < l; j++) {
						action.interpretGamepadButton(j, i, buttons[j].pressed, buttons[j].value);
					}
				}

				// And in all axes...
				for (var iis in this.axes) {
					axis = this.axes[iis];

					// ...and all gamepad axes
					axes = gamepad.axes;
					l = axes.length;
					for (j = 0; j < l; j++) {
						axis.interpretGamepadAxis(j, i, axes[j]);
					}
				}
			}
		}

		this.lastFrameGamepadsChecked = this.currentFrame;

		//console.timeEnd("check");
	}

	private refreshGamepadList():void {
		// The list of game devices has changed

		// TODO: implement _maintainPlayerPositions ? Apparently the browser already does something like that...
		//console.log("List of gamepads refreshed, new list = " + navigator.getGamepads().length + " items");

		// Dispatch the signal
		this._onDevicesChanged.dispatch();
	}

	/**
	 * Utility function: creates a function bound to "this".
	 * This needs to be stored because the same reference needs to be used when removing listeners.
	 */
	private getBoundFunction(func:any): EventListener {
		if (!this.bindCache.hasOwnProperty(func)) {
			this.bindCache[func] = func.bind(this);
		}
		return this.bindCache[func];
	}
}