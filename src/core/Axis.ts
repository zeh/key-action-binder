/// <reference path="KeyboardAxisBinding.ts" />
/// <reference path="GamepadAxisBinding.ts" />

module KAB {
	/**
	 * Information linking an axis to a binding, and its value
	 */
	export class Axis {

		// Properties
		private _id:string;

		private keyboardBindings:Array<KeyboardAxisBinding>;

		private gamepadAxisBindings:Array<GamepadAxisBinding>;
		private gamepadAxisValue:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(id:string) {
			this._id = id;

			this.keyboardBindings = [];

			this.gamepadAxisBindings = [];
			this.gamepadAxisValue = 0;
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public bind(keyCodeA:number, keyCodeB:number):Axis;
		public bind(keyCodeA:number, keyCodeB:number, keyLocationA:number, keyLocationB:number):Axis;
		public bind(keyCodeA:number, keyCodeB:number, keyLocationA:number, keyLocationB:number, transitionTimeSeconds:number):Axis;
		public bind(axis:{index:number}):Axis;
		public bind(axis:{index:number}, deadZone:number):Axis;
		public bind(axis:{index:number}, deadZone:number, gamepadLocation:number):Axis;
		public bind(p1:any, p2?:number, p3?:number, p4?:number, p5?:number):Axis {
			if (typeof p1 === "number") {
				// Keyboard binding
				this.bindKeyboard(p1, p2, p3 == undefined ? KeyActionBinder.KeyLocations.ANY : p3, p4 == undefined ? KeyActionBinder.KeyLocations.ANY : p4, p5 == undefined ? 0.15 : p5);
			} else {
				// Gamepad binding
				this.bindGamepad(p1, p2 == undefined ? 0.2 : p2, p3 == undefined ? KeyActionBinder.GamepadLocations.ANY : p3);
			}
			return this;
		}

		public interpretKeyDown(keyCode:number, keyLocation:number):void {
			for (var i:number = 0; i < this.keyboardBindings.length; i++) {
				if (this.keyboardBindings[i].matchesKeyboardKeyStart(keyCode, keyLocation)) {
					this.keyboardBindings[i].value = -1;
				} else if (this.keyboardBindings[i].matchesKeyboardKeyEnd(keyCode, keyLocation)) {
					this.keyboardBindings[i].value = 1;
				}
			}
		}

		public interpretKeyUp(keyCode:number, keyLocation:number):void {
			for (var i:number = 0; i < this.keyboardBindings.length; i++) {
				if (this.keyboardBindings[i].matchesKeyboardKeyStart(keyCode, keyLocation)) {
					this.keyboardBindings[i].value = 0;
				} else if (this.keyboardBindings[i].matchesKeyboardKeyEnd(keyCode, keyLocation)) {
					this.keyboardBindings[i].value = 0;
				}
			}
		}

		public interpretGamepadAxis(axisCode:number, gamepadLocation:number, valueState:number):void {
			for (var i:number = 0; i < this.gamepadAxisBindings.length; i++) {
				if (this.gamepadAxisBindings[i].matchesGamepadAxis(axisCode, gamepadLocation)) {
					this.gamepadAxisBindings[i].value = valueState;
				}
			}
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get id():string {
			return this._id;
		}

		public get value():number {
			// Gets the highest value
			var bestValue:number = 0;
			var val:number;

			// Check keyboard values
			for (var i = 0; i < this.keyboardBindings.length; i++) {
				val = this.keyboardBindings[i].value;
				if (Math.abs(val) > Math.abs(bestValue)) {
					bestValue = val;
				}
			}

			// Check gamepad values
			for (var i = 0; i < this.gamepadAxisBindings.length; i++) {
				val = this.gamepadAxisBindings[i].value;
				if (Math.abs(val) > Math.abs(bestValue)) {
					bestValue = val;
				}
			}

			return bestValue;
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		private bindKeyboard(keyCodeA:number, keyCodeB:number, keyLocationA:number, keyLocationB:number, transitionTimeSeconds:number):void {
			// TODO: check if already present?
			this.keyboardBindings.push(new KeyboardAxisBinding(keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds));
		}

		private bindGamepad(axis:{index:number}, deadZone:number, gamepadLocation:number):void {
			// TODO: check if already present?
			this.gamepadAxisBindings.push(new GamepadAxisBinding(axis.index, deadZone, gamepadLocation));
		}
	}
}
