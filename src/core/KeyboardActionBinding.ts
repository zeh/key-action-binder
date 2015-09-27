import KeyActionBinder from './KeyActionBinder';

/**
 * Information on a keyboard event filter
 */
export default class KeyboardActionBinding {

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

	public matchesKeyboardKey(keyCode:number, keyLocation:number):boolean {
		return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KeyCodes.ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KeyLocations.ANY);
	}
}
