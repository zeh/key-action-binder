﻿/// <reference path="KeyboardBinding.ts" />
/// <reference path="GamepadButtonBinding.ts" />

module KAB {
	/**
	 * Information linking an action to a binding, and whether it's activated
	 */
	export class Action {

		// Properties
		private _id:string;
		private _lastActivatedTime:number;

		private _keyboardBindings:Array<KeyboardBinding>;
		private _gamepadButtonBindings:Array<GamepadButtonBinding>;

		private _activated:boolean;
		private _consumed:boolean;
		private _value:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(id:string) {
			this._id = id;
			this._lastActivatedTime = 0;

			this._keyboardBindings = new Array<KeyboardBinding>();
			this._gamepadButtonBindings = new Array<GamepadButtonBinding>();

			this._activated = false;
			this._consumed = false;
			this._value = 0;
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public addKeyboardBinding(keyCode:number = KeyActionBinder.KeyCodes.ANY, keyLocation:number = KeyActionBinder.KeyLocations.ANY):void {
			// TODO: check if already present?
			this._keyboardBindings.push(new KeyboardBinding(keyCode, keyLocation));
		}

		public addGamepadButtonBinding(buttonCode:number = KeyActionBinder.GamepadButtons.ANY, gamepadLocation:number = KeyActionBinder.GamepadLocations.ANY):void {
			// TODO: check if already present?
			this._gamepadButtonBindings.push(new GamepadButtonBinding(buttonCode, gamepadLocation));
		}

		public addGamepadBinding():void {
			console.error("Action.addGamepadBinding() not implemented yet");
		}

		public consume():void {
			if (this._activated) this._consumed = true;
		}

		public interpretKeyDown(keyCode:number, keyLocation:number):void {
			for (var i:number = 0; i < this._keyboardBindings.length; i++) {
				if (!this._keyboardBindings[i].isActivated && this._keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
					// Activated
					this._keyboardBindings[i].isActivated = true;
					this._activated = true;
				}
			}
			this._value = this._activated ? 1 : 0;
		}

		public interpretKeyUp(keyCode:number, keyLocation:number):void {
			var isActivated:boolean = false;
			for (var i:number = 0; i < this._keyboardBindings.length; i++) {
				if (this._keyboardBindings[i].isActivated && this._keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
					// Deactivated
					this._keyboardBindings[i].isActivated = false;
				}
				isActivated = isActivated || this._keyboardBindings[i].isActivated;
			}
			// TODO: also check gamepads for activation
			this._activated = isActivated;
			this._value = this._activated ? 1 : 0;
			if (this._activated) this._consumed = false; // TODO: make this more self-contained
		}

		public interpretGamepadButton(buttonCode:number, gamepadLocation:number, pressedState:boolean, valueState:number):void {
			var isActivated:boolean = false;
			var newValue:number = 0;
			for (var i:number = 0; i < this._gamepadButtonBindings.length; i++) {
				if (this._gamepadButtonBindings[i].matchesGamepadButton(buttonCode, gamepadLocation)) {
					this._gamepadButtonBindings[i].isActivated = pressedState;
					this._gamepadButtonBindings[i].value = valueState;

					isActivated = isActivated || pressedState;
					if (valueState > newValue) newValue = valueState;
				}
			}

			// TODO: combine this with keyboatd state
			this._activated = isActivated;
			this._value = newValue;
			if (this._activated) this._consumed = false; // TODO: make this more self-contained
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get id():string {
			return this._id;
		}

		public get activated():boolean {
			return this._activated && !this._consumed;
		}

		public get value():number {
			return this._value;
		}
	}
}