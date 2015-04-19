module KAB {
	/**
	 * Common interface for all kinds of binding
	 */
	export interface IBinding {
		matchesKeyboardKey(keyCode:string, keyLocation:number):boolean;
		matchesGamepadControl(controlId:string, gamepadIndex:number):boolean;
	}
}
