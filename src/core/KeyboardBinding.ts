/// <reference path="IBinding.ts" />
/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a keyboard event filter
	 */
	export class KeyboardBinding implements IBinding {

		// Properties
		public keyCode:string;
		public keyLocation:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(keyCode:string, keyLocation:number) {
			this.keyCode = keyCode;
			this.keyLocation = keyLocation;
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesKeyboardKey(keyCode:string, keyLocation:number): boolean {
			return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KEY_CODE_ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KEY_LOCATION_ANY);
		}

		// TODO: add modifiers?

		public matchesGamepadControl(controlId: String, gamepadIndex:number): boolean {
			return false;
		}
	}
}
