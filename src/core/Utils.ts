module KAB {
	/**
	 * Utility pure functions
	 */
	export class Utils {

		/**
		 * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
		 * @param value	The value to be re-mapped.
		 * @param oldMin	The previous minimum value.
		 * @param oldMax	The previous maximum value.
		 * @param newMin	The new minimum value.
		 * @param newMax	The new maximum value.
		 * @return			The new value, mapped to the new range.
		 */
		public static map(value:number, oldMin:number, oldMax:number, newMin:number = 0, newMax:number = 1, clamp:Boolean = false):number {
			if (oldMin == oldMax) return newMin;
			var p = ((value-oldMin) / (oldMax-oldMin) * (newMax-newMin)) + newMin;
			if (clamp) p = newMin < newMax ? this.clamp(p, newMin, newMax) : Utils.clamp(p, newMax, newMin);
			return p;
		}

		/**
		 * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
		 * @param value	The value to be clamped.
		 * @param min		Minimum value allowed.
		 * @param max		Maximum value allowed.
		 * @return			The newly clamped value.
		 */
		public static clamp(value:number, min:number = 0, max:number = 1):number {
			return value < min ? min : value > max ? max : value;
		}
	}
}
