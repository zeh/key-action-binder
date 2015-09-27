import KeyActionBinder from './KeyActionBinder';

/**
 * Information on a gamepad event filter
 */
export default class GamepadActionBinding {

	// Properties
	public buttonCode:number;
	public gamepadLocation:number;

	public isActivated:boolean;
	public value:number;


	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	constructor(buttonCode:number, gamepadLocation:number) {
		this.buttonCode = buttonCode;
		this.gamepadLocation = gamepadLocation;
		this.isActivated = false;
		this.value = 0;
	}

	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	public matchesGamepadButton(buttonCode:number, gamepadLocation:number):boolean {
		return (this.buttonCode == buttonCode || this.buttonCode == KeyActionBinder.GamepadButtons.ANY.index) && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
	}
}
