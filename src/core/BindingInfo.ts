/// <reference path="IBinding.ts" />

module KAB {
	/**
	 * Information linking an action to a binding, and whether it's activated
	 */
	export class BindingInfo {

		// Properties
		public action:string;
		public binding:IBinding;
		public isActivated:boolean;
		public lastActivatedTime:number;


		// ================================================================================================================
		// CONSTRUCTOR ----------------------------------------------------------------------------------------------------

		constructor(action:string = "", binding:IBinding = null) {
			this.action = action;
			this.binding = binding;
			this.isActivated = false;
			this.lastActivatedTime = 0;
		}
	}
}
