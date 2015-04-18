/// <reference path="./../libs/signals/SimpleSignal.ts" />

/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
class KeyActionBinder {

	// Properties
	private _isRunning:boolean;
	private _maintainPlayerPositions: boolean;

	// Events
	private _onActionActivated:zehfernando.signals.SimpleSignal<(action:string) => void>;



	// ================================================================================================================
	// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

	KeyActionBinder() {
		
	}


	// ================================================================================================================
	// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

	// ================================================================================================================
	// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

	// ================================================================================================================
	// PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
	
}