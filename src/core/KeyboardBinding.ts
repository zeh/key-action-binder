/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a keyboard event filter
	 */
	export class KeyboardBinding {

		// Properties
		public keyCode:number;
		public keyLocation:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(keyCode:number, keyLocation:number) {
			this.keyCode = keyCode;
			this.keyLocation = keyLocation;
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesKeyboardKey(keyCode:number, keyLocation:number): boolean {
			return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KEY_CODE_ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KEY_LOCATION_ANY);
		}

		// TODO: add modifiers?

		public matchesGamepadControl(controlId: String, gamepadIndex:number): boolean {
			return false;
		}
	}
}
