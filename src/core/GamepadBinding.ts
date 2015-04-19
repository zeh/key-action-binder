/// <reference path="IBinding.ts" />
/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a gamepad event filter
	 */
	export class GamepadBinding implements IBinding {

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
			return this.controlId == controlId && (this.gamepadIndex == gamepadIndex || this.gamepadIndex == KeyActionBinder.GAMEPAD_INDEX_ANY);
		}
	}
}
