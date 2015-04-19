/// <reference path="KeyActionBinder.ts" />
/// <reference path="Utils.ts" />

module KAB {
	/**
	 * Information on a keyboard event filter
	 */
	export class KeyboardAxisBinding {

		// Properties
		public keyCodeA:number;
		public keyLocationA:number;

		public keyCodeB:number;
		public keyLocationB:number;

		public transitionTime:number;			// Time to transition values from 0 to 1, in ms (the actual transition time will be shorter, this is for the full range)

		private timeLastChange:number;			
		private previousValue:number;
		private targetValue:number;				// -1..1
		private currentTransitionTime:number;	// Time for the current change


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(keyCodeA:number, keyCodeB:number, keyLocationA:number, keyLocationB:number, transitionTimeSeconds:number) {
			this.keyCodeA = keyCodeA;
			this.keyLocationA = keyLocationA;
			this.keyCodeB = keyCodeB;
			this.keyLocationB = keyLocationB;

			this.transitionTime = transitionTimeSeconds * 1000;

			this.timeLastChange = 0;
			this.targetValue = this.previousValue = 0;
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public matchesKeyboardKeyStart(keyCode:number, keyLocation:number):boolean {
			return (this.keyCodeA == keyCode || this.keyCodeA == KeyActionBinder.KeyCodes.ANY) && (this.keyLocationA == keyLocation || this.keyLocationA == KeyActionBinder.KeyLocations.ANY);
		}

		public matchesKeyboardKeyEnd(keyCode:number, keyLocation:number):boolean {
			return (this.keyCodeB == keyCode || this.keyCodeB == KeyActionBinder.KeyCodes.ANY) && (this.keyLocationB == keyLocation || this.keyLocationB == KeyActionBinder.KeyLocations.ANY);
		}


		// ================================================================================================================
		// ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------

		public get value():number {
			// TODO: this is linear.. add some easing?
			return Utils.map(Date.now(), this.timeLastChange, this.timeLastChange + this.currentTransitionTime, this.previousValue, this.targetValue);
		}

		public set value(newValue:number) {
			this.previousValue = this.value;
			this.targetValue = newValue;
			this.currentTransitionTime = Utils.map(Math.abs(this.targetValue - this.previousValue), 0, 1, 0, this.transitionTime);
			this.timeLastChange = Date.now();
		}
	}
}
