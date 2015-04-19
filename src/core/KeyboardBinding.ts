/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a keyboard event filter
	 */
	export class KeyboardBinding {

		// Properties
		public keyCode:number;
		public keyLocation:number;

		public isActivated:boolean;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(keyCode:number, keyLocation:number) {
			this.keyCode = keyCode;
			this.keyLocation = keyLocation;
			this.isActivated = false;
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		// TODO: add modifiers?
		public matchesKeyboardKey(keyCode:number, keyLocation:number): boolean {
			return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KeyCodes.ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KeyLocations.ANY);
		}
	}
}
