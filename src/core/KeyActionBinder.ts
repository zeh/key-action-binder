/// <reference path="./../definitions/gamepad.d.ts" />
/// <reference path="./../libs/signals/SimpleSignal.ts" />
/// <reference path="Action.ts" />

/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
class KeyActionBinder {

	// Constants
	public static VERSION:String = "0.0.0";

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
		WINDOW_LEFT: 91,
		WINDOW_RIGHT: 92,
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

	public static GamepadButtons = {
		ANY: 81653811,
		FACE_1: 0, // Face (main) buttons
		FACE_2: 1,
		FACE_3: 2,
		FACE_4: 3,
		LEFT_SHOULDER: 4, // Top shoulder buttons
		RIGHT_SHOULDER: 5,
		LEFT_SHOULDER_BOTTOM: 6, // Bottom shoulder buttons
		RIGHT_SHOULDER_BOTTOM: 7,
		SELECT: 8,
		START: 9,
		LEFT_ANALOGUE_STICK: 10, // Analogue sticks (if depressible)
		RIGHT_ANALOGUE_STICK: 11,
		PAD_TOP: 12, // Directional (discrete) pad
		PAD_BOTTOM: 13,
		PAD_LEFT: 14,
		PAD_RIGHT: 15
	};

	public static GamepadAxes = {
		LEFT_ANALOGUE_HOR: 0,
		LEFT_ANALOGUE_VERT: 1,
		RIGHT_ANALOGUE_HOR: 2,
		RIGHT_ANALOGUE_VERT: 3
	}

	//public static const KEYBOARD_DEVICE:GameInputDevice = null;		// Set to null by default, since gamepads are non-null (and you can't create/subclass a GameInputDevice)

	// Properties
	private _isRunning:boolean;
	private _maintainPlayerPositions:boolean;														// Whether it tries to keep player positions or not
	private _recentDevice:Gamepad;																	// The most recent device that sent an event

	// Instances
	private actions:{ [index:string]:KAB.Action };													// All added actions, as a dictionary

	private _onActionActivated:zehfernando.signals.SimpleSignal<(action: string) => void>;
	private _onActionDeactivated:zehfernando.signals.SimpleSignal<(action: string) => void>;
	private _onActionValueChanged:zehfernando.signals.SimpleSignal<(action: string, value:number) => void>;
	private _onDevicesChanged:zehfernando.signals.SimpleSignal<() => void>;
	private _onRecentDeviceChanged:zehfernando.signals.SimpleSignal<(gamepad: Gamepad) => void>; // TODO: use a Gamepad wrapper?

	private gameInputDevices:Array<Gamepad>;
	private gameInputDeviceIds:Array<String>;

	private bindCache: any; // Should have been "{ [index: Function]: Function }", but that's not allowed.. maybe create a separate class later

	// TODO:
	// * Check navigator.getGamepads to see if gamepads are actually accessible


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor() {
		this.bindCache = {};

		this._isRunning = false;
		this._maintainPlayerPositions = false;
		this.actions = {};

		this._onActionActivated = new zehfernando.signals.SimpleSignal<(action: string) => void>();
		this._onActionDeactivated = new zehfernando.signals.SimpleSignal<(action: string) => void>();
		this._onActionValueChanged = new zehfernando.signals.SimpleSignal<(action: string, value: number) => void>();
		this._onDevicesChanged = new zehfernando.signals.SimpleSignal<() => void>();
		this._onRecentDeviceChanged = new zehfernando.signals.SimpleSignal<(gamepad: Gamepad) => void>();

		this.gameInputDevices = [];
		this.gameInputDeviceIds = [];

		//gameInputDevices = new Vector.<GameInputDevice>();
		//gameInputDeviceIds = new Vector.<String>();
		//gameInputDeviceDefinitions = new Vector.<AutoGamepadInfo>();

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
			window.addEventListener("gamepadconnected", this.getBoundFunction(this.onGameInputDeviceAdded));
			window.addEventListener("gamepaddisconnected", this.getBoundFunction(this.onGameInputDeviceRemoved));

			this.refreshGameInputDeviceList();

			this._isRunning = true;
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
			window.removeEventListener("gamepadconnected", this.getBoundFunction(this.onGameInputDeviceAdded));
			window.removeEventListener("gamepaddisconnected", this.getBoundFunction(this.onGameInputDeviceRemoved));

			this.gameInputDevices.length = 0;
			this.gameInputDeviceIds.length = 0;
			//removeGameInputDeviceEvents();

			this._isRunning = false;
		}
	}

	public action(id:string):KAB.Action {
		// Get an action, creating it if necessary
		if (!this.actions.hasOwnProperty(id)) {
			// Need to be created first!
			this.actions[id] = new KAB.Action(id);
		}

		return this.actions[id];
	}

	/**
	 * Update the known state of all buttons/axis
	 */
	public update():void {
		// TODO: check controls to see if any has changed
		// TODO: move this outside? make it automatic (with requestAnimationFrame), or make it be called once per frame when any action is checked

		// Check all buttons of all gamepads
		
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

	private onKeyDown(e: KeyboardEvent):void {
		for (var iis in this.actions) {
			this.actions[iis].interpretKeyDown(e.keyCode, e.location);
		}
	}

	private onKeyUp(e: KeyboardEvent):void {
		for (var iis in this.actions) {
			this.actions[iis].interpretKeyUp(e.keyCode, e.location);
		}
	}

	private onGameInputDeviceAdded(e: GamepadEvent):void {
		console.error("NOT IMPLEMENTED: onGameInputDeviceAdded");
	}

	private onGameInputDeviceRemoved(e: GamepadEvent):void {
		console.error("NOT IMPLEMENTED: onGameInputDeviceRemoved");
	}


	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

	private refreshGameInputDeviceList():void {
		// The list of game devices has changed

		if (false) {
		//if (this._maintainPlayerPositions && gameInputDeviceIds != null) {
			// TODO: implement this
			/*
			// Will try to maintain player positions:
			// * A removed device will continue to exist in the list (as a null device), unless it's the latest device
			// * An added device will try to be added to its previously existing position, if one can be found
			// * If a previously existing position cannot be found, the device takes the first available position

			var gamepadPosition: int;

			// Creates a list of all the new ids
			var newGamepadIds: Vector.<String> = new Vector.<String>();
			var newGamepads: Vector.<GameInputDevice> = new Vector.<GameInputDevice>();
			for (i = 0; i < GameInput.numDevices; i++) {
				if (GameInput.getDeviceAt(i) != null) {
					newGamepadIds.push(GameInput.getDeviceAt(i).id);
					newGamepads.push(GameInput.getDeviceAt(i));
				}
			}

			// Create a list of available slots for insertion
			var availableSlots: Vector.<int> = new Vector.<int>();

			// First, check for removed items
			// Goes backward, so it can remove items from the list
			var isEndPure: Boolean = true;
			i = gameInputDeviceIds.length - 1;
			while (i >= 0) {
				gamepadPosition = newGamepadIds.indexOf(gameInputDeviceIds[i]);
				if (gamepadPosition < 0) {
					// This device id doesn't exist in the new list, therefore it's removed
					if (isEndPure) {
						// But since it's in the end of the list, actually remove it
						gameInputDeviceIds.splice(i, 1);
					} else {
						// It's in the middle of the list, so just mark that spot as available
						availableSlots.push(i);
					}
				} else {
					// This device id exists in the list, so ignore and assume it's not in the end anymore
					isEndPure = false;
				}
				i--;
			}

			// Now, add new items that are not in the list
			for (i = 0; i < newGamepadIds.length; i++) {
				gamepadPosition = gameInputDeviceIds.indexOf(newGamepadIds[i]);
				if (gamepadPosition < 0) {
					// This gamepad is not in the list, so add it
					if (availableSlots.length > 0) {
						// Add it in the first available slot
						gameInputDeviceIds.push(newGamepadIds[availableSlots[0]]);
						availableSlots.splice(0, 1);
					} else {
						// No more slots availabloe, add it at the end
						gameInputDeviceIds.push(newGamepadIds[i]);
					}
				}
			}

			// Now that gameInputDeviceIds is correct, just create the list of references
			gameInputDevices.length = gameInputDeviceIds.length;
			gameInputDeviceDefinitions.length = gameInputDeviceIds.length;
			for (i = 0; i < gameInputDeviceIds.length; i++) {
				gamepadPosition = newGamepadIds.indexOf(gameInputDeviceIds[i]);
				if (gamepadPosition < 0) {
					// A spot for a gamepad that was just removed
					gameInputDevices[i] = null;
					gameInputDeviceDefinitions[i] = null;
				} else {
					// A normal game input device
					gameInputDevices[i] = newGamepads[gamepadPosition];
					gameInputDeviceDefinitions[i] = findGamepadInfo(newGamepads[gamepadPosition]);
				}
			}
			*/
		} else {
			// Full refresh: create a new list of devices
			var gamepads: Array<Gamepad> = navigator.getGamepads();

			this.gameInputDevices.length = gamepads.length;
			this.gameInputDeviceIds.length = gamepads.length;
			//this.gameInputDeviceDefinitions.length = GameInput.numDevices; // TODO: clear this if not needed, since browser

			// This check is necessary because empty gamepads are left behind when removed
			// TODO: test this to see if it's actually needed to keep track of the devices
			for (var i = 0; i < gamepads.length; i++) {
				if (this.gameInputDevices[i] != null) {
					this.gameInputDevices[i] = gamepads[i];
					this.gameInputDeviceIds[i] = gamepads[i].id;
					//gameInputDeviceDefinitions[i] = findGamepadInfo(gameInputDevices[i]); // TODO: clear this if not needed, since the browser already maps it
				} else {
					this.gameInputDeviceIds[i] = null;
					//gameInputDeviceDefinitions[i] = null; // TODO: clear this if not needed, since the browser already maps it
				}
			}
		}

		// Dispatch the signal
		this._onDevicesChanged.dispatch();
	}

	/**
	 * Utility function: creates a function bound to "this". This is needed because the same reference needs to be used when removing listeners.
	 */
	private getBoundFunction(func:any): EventListener {
		if (!this.bindCache.hasOwnProperty(func)) {
			this.bindCache[func] = func.bind(this);
		}
		return this.bindCache[func];
	}
	
}