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

		public bindKeyboard(keyCodeA:number, keyCodeB:number, keyLocationA:number = KeyActionBinder.KeyLocations.ANY, keyLocationB:number = KeyActionBinder.KeyLocations.ANY, transitionTimeSeconds:number = 0.15):Axis {
			// TODO: check if already present?
			this.keyboardBindings.push(new KeyboardAxisBinding(keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds));
			return this;
		}

		public bindGamepad(axisCode:number, deadZone:number = 0.1, gamepadLocation:number = KeyActionBinder.GamepadLocations.ANY):Axis {
			// TODO: check if already present?
			this.gamepadAxisBindings.push(new GamepadAxisBinding(axisCode, deadZone, gamepadLocation));
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
			/*
			var hasMatch:boolean;
			var isActivated:boolean = false;
			var newValue:number = 0;
			for (var i:number = 0; i < this.gamepadButtonBindings.length; i++) {
				if (this.gamepadButtonBindings[i].matchesGamepadButton(buttonCode, gamepadLocation)) {
					hasMatch = true;
					this.gamepadButtonBindings[i].isActivated = pressedState;
					this.gamepadButtonBindings[i].value = valueState;

					isActivated = isActivated || pressedState;
					if (valueState > newValue) newValue = valueState;
				}
			}

			if (hasMatch) {
				if (isActivated && !this.gamepadButtonActivated) this.lastActivatedTime = Date.now();

				this.gamepadButtonActivated = isActivated;
				this.gamepadButtonValue = newValue;

				if (!this.gamepadButtonActivated) this.gamepadButtonConsumed = false;
			}
			*/
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

			return bestValue;
		}
	}
}
