/// <reference path="IBinding.ts" />
/// <reference path="BindingInfo.ts" />
/// <reference path="KeyActionBinder.ts" />

module KAB {
	/**
	 * Information listing all activated bindings of a given action
	 */
	export class ActivationInfo {

		// Properties
		private activations:Array<KAB.BindingInfo>;			// All activated bindings
		private activationGamepadIndexes:Array<number>;		// Gamepad that activated that binding
		private sensitiveValues:{ [index:string]:number };
		private sensitiveValuesGamepadIndexes:{ [index:string]:number };

		// Temp vars to avoid garbage collection
		private iiv:number;									// Value buffer
		private iix:number;									// Search index
		private iit:number;									// Time
		private iii:number;									// Iterator
		private iic:number;									// Count


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor() {
			this.activations = new Array<KAB.BindingInfo>();
			this.activationGamepadIndexes = new Array<number>();
			this.sensitiveValues = {};
			this.sensitiveValuesGamepadIndexes = {};
		}


		// ================================================================================================================
		// PUBLIC INTERFACE -----------------------------------------------------------------------------------------------

		public addActivation(bindingInfo:KAB.BindingInfo, gamepadIndex:number = KeyActionBinder.GAMEPAD_INDEX_ANY):void {
			this.activations.push(bindingInfo);
			this.activationGamepadIndexes.push(gamepadIndex);
		}

		public removeActivation(bindingInfo:KAB.BindingInfo):void {
			this.iix = this.activations.indexOf(bindingInfo);
			if (this.iix > -1) {
				this.activations.splice(this.iix, 1);
				this.activationGamepadIndexes.splice(this.iix, 1);
			}
		}

		public getNumActivations(timeToleranceSeconds:number = 0, gamepadIndex:number = KeyActionBinder.GAMEPAD_INDEX_ANY):number {
			// If not time-sensitive, just return it
			if ((timeToleranceSeconds <= 0 && gamepadIndex < 0) || this.activations.length == 0) return this.activations.length;
			// Otherwise, actually check for activation time and gamepad index
			this.iit = Date.now() - timeToleranceSeconds * 1000;
			this.iic = 0;
			for (this.iii = 0; this.iii < this.activations.length; this.iii++) {
				if ((timeToleranceSeconds <= 0 || this.activations[this.iii].lastActivatedTime >= this.iit) && (gamepadIndex < 0 || this.activationGamepadIndexes[this.iii] == gamepadIndex)) this.iic++;
			}
			return this.iic;
		}

		public resetActivations():void {
			this.activations.length = 0;
			this.activationGamepadIndexes.length = 0;
		}

		public addSensitiveValue(actionId:string, value:number, gamepadIndex:number = KeyActionBinder.GAMEPAD_INDEX_ANY):void {
			this.sensitiveValues[actionId] = value;
			this.sensitiveValuesGamepadIndexes[actionId] = gamepadIndex;
		}

		public getValue(gamepadIndex:number = KeyActionBinder.GAMEPAD_INDEX_ANY):Number {
			this.iiv = NaN;
			for (var iis in this.sensitiveValues) {
				// NOTE: this may be a problem if two different axis control the same action, since -1 is not necessarily better than +0.5
				if ((gamepadIndex < 0 || this.sensitiveValuesGamepadIndexes[iis] == gamepadIndex) && (isNaN(this.iiv) || Math.abs(this.sensitiveValues[iis]) > Math.abs(this.iiv))) {
					this.iiv = this.sensitiveValues[iis];
				}
			}
			if (isNaN(this.iiv)) return this.getNumActivations(0, gamepadIndex) == 0 ? 0 : 1;
			return this.iiv;
		}
	}
}
