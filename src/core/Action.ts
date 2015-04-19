/// <reference path="KeyboardActionBinding.ts" />
/// <reference path="GamepadActionBinding.ts" />

module KAB {
	/**
	 * Information linking an action to a binding, and whether it's activated
	 */
	export class Action {

		// Properties
		private _id:string;
		private timeLastActivation:number;

		private keyboardBindings:Array<KeyboardActionBinding>;
		private keyboardActivated:boolean;
		private keyboardValue:number;
		private keyboardConsumed:boolean;

		private gamepadButtonBindings:Array<GamepadActionBinding>;
		private gamepadButtonActivated:boolean;
		private gamepadButtonValue:number;
		private gamepadButtonConsumed:boolean;

		private toleranceTime:number;										// Tolerance for activations, in ms


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(id:string) {
			this._id = id;
			this.timeLastActivation = 0;
			this.toleranceTime = 0;

			this.keyboardBindings = [];
			this.keyboardActivated = false;
			this.keyboardValue = 0;
			this.keyboardConsumed = false;

			this.gamepadButtonBindings = [];
			this.gamepadButtonActivated = false;
			this.gamepadButtonValue = 0;
			this.gamepadButtonConsumed = false;
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public bindKeyboard(keyCode:number = KeyActionBinder.KeyCodes.ANY, keyLocation:number = KeyActionBinder.KeyLocations.ANY):Action {
			// TODO: check if already present?
			this.keyboardBindings.push(new KeyboardActionBinding(keyCode, keyLocation));
			return this;
		}

		public bindGamepad(buttonCode:number = KeyActionBinder.GamepadButtons.ANY, gamepadLocation:number = KeyActionBinder.GamepadLocations.ANY):Action {
			// TODO: check if already present?
			this.gamepadButtonBindings.push(new GamepadActionBinding(buttonCode, gamepadLocation));
			return this;
		}

		public setTolerance(timeInSeconds:number):Action {
			this.toleranceTime = timeInSeconds * 1000;
			return this;
		}

		public consume():void {
			if (this.keyboardActivated) this.keyboardConsumed = true;
			if (this.gamepadButtonActivated) this.gamepadButtonConsumed = true;
		}

		public interpretKeyDown(keyCode:number, keyLocation:number):void {
			for (var i:number = 0; i < this.keyboardBindings.length; i++) {
				if (!this.keyboardBindings[i].isActivated && this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
					// Activated
					this.keyboardBindings[i].isActivated = true;
					this.keyboardActivated = true;
					this.keyboardValue = 1;
					this.timeLastActivation = Date.now();
				}
			}
		}

		public interpretKeyUp(keyCode:number, keyLocation:number):void {
			var hasMatch:boolean;
			var isActivated:boolean = false;
			for (var i:number = 0; i < this.keyboardBindings.length; i++) {
				if (this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
					if (this.keyboardBindings[i].isActivated) {
						// Deactivated
						this.keyboardBindings[i].isActivated = false;
					}
					hasMatch = true;
					isActivated = isActivated || this.keyboardBindings[i].isActivated;
				}
			}

			if (hasMatch) {
				this.keyboardActivated = isActivated;
				this.keyboardValue = this.keyboardActivated ? 1 : 0;

				if (!this.keyboardActivated) this.keyboardConsumed = false;
			}
		}

		public interpretGamepadButton(buttonCode:number, gamepadLocation:number, pressedState:boolean, valueState:number):void {
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

			// TODO: I think this will fail if two buttons are used for the same action; values will be overwritten

			if (hasMatch) {
				if (isActivated && !this.gamepadButtonActivated) this.timeLastActivation = Date.now();

				this.gamepadButtonActivated = isActivated;
				this.gamepadButtonValue = newValue;

				if (!this.gamepadButtonActivated) this.gamepadButtonConsumed = false;
			}
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get id():string {
			return this._id;
		}

		public get activated():boolean {
			return ((this.keyboardActivated && !this.keyboardConsumed) || (this.gamepadButtonActivated && !this.gamepadButtonConsumed)) && this.isWithinToleranceTime();
		}

		public get value():number {
			return this.isWithinToleranceTime() ? Math.max(this.keyboardConsumed ? 0 : this.keyboardValue, this.gamepadButtonConsumed ? 0 : this.gamepadButtonValue) : 0;
		}


		// ================================================================================================================
		// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------

		public isWithinToleranceTime():boolean {
			return this.toleranceTime <= 0 || this.timeLastActivation >= Date.now() - this.toleranceTime;
		}

	}
}
