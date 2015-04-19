/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information on a gamepad event filter
	 */
	export class GamepadAxisBinding {

		// Properties
		public axisCode:number;
		public gamepadLocation:number;
		public deadZone:number;

		public isActivated:boolean;
		public value:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(axisCode:number, deadZone:number, gamepadLocation:number) {
			this.axisCode = axisCode;
			this.deadZone = deadZone;
			this.gamepadLocation = gamepadLocation;
			this.value = 0;
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesGamepadButton(axisCode:number, gamepadLocation:number):boolean {
			return this.axisCode == axisCode && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
		}
	}
}
