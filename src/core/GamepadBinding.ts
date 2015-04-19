/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a gamepad event filter
	 */
	export class GamepadBinding {

		// Properties
		public controlId:string;
		public gamepadIndex:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(controlId:string, gamepadIndex:number) {
			this.controlId = controlId;
			this.gamepadIndex = gamepadIndex;
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesKeyboardKey(keyCode:string, keyLocation:number): boolean {
			return false;
		}

		public matchesGamepadControl(controlId: String, gamepadIndex:number): boolean {
			return this.controlId == controlId && (this.gamepadIndex == gamepadIndex || this.gamepadIndex == KeyActionBinder.GamepadButtons.ANY);
		}
	}
}
