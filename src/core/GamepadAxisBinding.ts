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
		private _value:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(axisCode:number, deadZone:number, gamepadLocation:number) {
			this.axisCode = axisCode;
			this.deadZone = deadZone;
			this.gamepadLocation = gamepadLocation;
			this._value = 0;
		}

		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesGamepadAxis(axisCode:number, gamepadLocation:number):boolean {
			return this.axisCode == axisCode && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get value():number {
			// The value is returned taking the dead zone into consideration
			if (this._value < 0) {
				return Utils.map(this._value, -this.deadZone, -1, 0, -1, true);
			} else {
				return Utils.map(this._value, this.deadZone, 1, 0, 1, true);
			}
		}

		public set value(newValue:number) {
			// The value is set raw
			this._value = newValue;
		}
	}
}
