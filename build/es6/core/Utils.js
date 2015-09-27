/**
 * Utility pure functions
 */
export default class Utils {
    /**
     * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
     * @param value	The value to be re-mapped.
     * @param oldMin	The previous minimum value.
     * @param oldMax	The previous maximum value.
     * @param newMin	The new minimum value.
     * @param newMax	The new maximum value.
     * @return			The new value, mapped to the new range.
     */
    static map(value, oldMin, oldMax, newMin = 0, newMax = 1, clamp = false) {
        if (oldMin == oldMax)
            return newMin;
        var p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
        if (clamp)
            p = newMin < newMax ? this.clamp(p, newMin, newMax) : Utils.clamp(p, newMax, newMin);
        return p;
    }
    /**
     * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
     * @param value	The value to be clamped.
     * @param min		Minimum value allowed.
     * @param max		Maximum value allowed.
     * @return			The newly clamped value.
     */
    static clamp(value, min = 0, max = 1) {
        return value < min ? min : value > max ? max : value;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvVXRpbHMudHMiXSwibmFtZXMiOlsiVXRpbHMiLCJVdGlscy5tYXAiLCJVdGlscy5jbGFtcCJdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFDSDtJQUVDQTs7Ozs7Ozs7T0FRR0E7SUFDSEEsT0FBY0EsR0FBR0EsQ0FBQ0EsS0FBWUEsRUFBRUEsTUFBYUEsRUFBRUEsTUFBYUEsRUFBRUEsTUFBTUEsR0FBVUEsQ0FBQ0EsRUFBRUEsTUFBTUEsR0FBVUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBV0EsS0FBS0E7UUFDeEhDLEVBQUVBLENBQUNBLENBQUNBLE1BQU1BLElBQUlBLE1BQU1BLENBQUNBO1lBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBQ3BDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQTtRQUN0RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsR0FBR0EsTUFBTUEsR0FBR0EsTUFBTUEsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsRUFBRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDaEdBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO0lBQ1ZBLENBQUNBO0lBRUREOzs7Ozs7T0FNR0E7SUFDSEEsT0FBY0EsS0FBS0EsQ0FBQ0EsS0FBWUEsRUFBRUEsR0FBR0EsR0FBVUEsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBVUEsQ0FBQ0E7UUFDL0RFLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBO0lBQ3REQSxDQUFDQTtBQUNGRixDQUFDQTtBQUFBIiwiZmlsZSI6ImNvcmUvVXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogVXRpbGl0eSBwdXJlIGZ1bmN0aW9uc1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xyXG5cclxuXHQvKipcclxuXHQgKiBNYXBzIGEgdmFsdWUgZnJvbSBhIHJhbmdlLCBkZXRlcm1pbmVkIGJ5IG9sZCBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcywgdG8gYSBuZXcgcmFuZ2UsIGRldGVybWluZWQgYnkgbmV3IG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzLiBUaGVzZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcyBhcmUgcmVmZXJlbnRpYWw7IHRoZSBuZXcgdmFsdWUgaXMgbm90IGNsYW1wZWQgYnkgdGhlbS5cclxuXHQgKiBAcGFyYW0gdmFsdWVcdFRoZSB2YWx1ZSB0byBiZSByZS1tYXBwZWQuXHJcblx0ICogQHBhcmFtIG9sZE1pblx0VGhlIHByZXZpb3VzIG1pbmltdW0gdmFsdWUuXHJcblx0ICogQHBhcmFtIG9sZE1heFx0VGhlIHByZXZpb3VzIG1heGltdW0gdmFsdWUuXHJcblx0ICogQHBhcmFtIG5ld01pblx0VGhlIG5ldyBtaW5pbXVtIHZhbHVlLlxyXG5cdCAqIEBwYXJhbSBuZXdNYXhcdFRoZSBuZXcgbWF4aW11bSB2YWx1ZS5cclxuXHQgKiBAcmV0dXJuXHRcdFx0VGhlIG5ldyB2YWx1ZSwgbWFwcGVkIHRvIHRoZSBuZXcgcmFuZ2UuXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBtYXAodmFsdWU6bnVtYmVyLCBvbGRNaW46bnVtYmVyLCBvbGRNYXg6bnVtYmVyLCBuZXdNaW46bnVtYmVyID0gMCwgbmV3TWF4Om51bWJlciA9IDEsIGNsYW1wOkJvb2xlYW4gPSBmYWxzZSk6bnVtYmVyIHtcclxuXHRcdGlmIChvbGRNaW4gPT0gb2xkTWF4KSByZXR1cm4gbmV3TWluO1xyXG5cdFx0dmFyIHAgPSAoKHZhbHVlLW9sZE1pbikgLyAob2xkTWF4LW9sZE1pbikgKiAobmV3TWF4LW5ld01pbikpICsgbmV3TWluO1xyXG5cdFx0aWYgKGNsYW1wKSBwID0gbmV3TWluIDwgbmV3TWF4ID8gdGhpcy5jbGFtcChwLCBuZXdNaW4sIG5ld01heCkgOiBVdGlscy5jbGFtcChwLCBuZXdNYXgsIG5ld01pbik7XHJcblx0XHRyZXR1cm4gcDtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIENsYW1wcyBhIG51bWJlciB0byBhIHJhbmdlLCBieSByZXN0cmljdGluZyBpdCB0byBhIG1pbmltdW0gYW5kIG1heGltdW0gdmFsdWVzOiBpZiB0aGUgcGFzc2VkIHZhbHVlIGlzIGxvd2VyIHRoYW4gdGhlIG1pbmltdW0gdmFsdWUsIGl0J3MgcmVwbGFjZWQgYnkgdGhlIG1pbmltdW07IGlmIGl0J3MgaGlnaGVyIHRoYW4gdGhlIG1heGltdW0gdmFsdWUsIGl0J3MgcmVwbGFjZWQgYnkgdGhlIG1heGltdW07IGlmIG5vdCwgaXQncyB1bmNoYW5nZWQuXHJcblx0ICogQHBhcmFtIHZhbHVlXHRUaGUgdmFsdWUgdG8gYmUgY2xhbXBlZC5cclxuXHQgKiBAcGFyYW0gbWluXHRcdE1pbmltdW0gdmFsdWUgYWxsb3dlZC5cclxuXHQgKiBAcGFyYW0gbWF4XHRcdE1heGltdW0gdmFsdWUgYWxsb3dlZC5cclxuXHQgKiBAcmV0dXJuXHRcdFx0VGhlIG5ld2x5IGNsYW1wZWQgdmFsdWUuXHJcblx0ICovXHJcblx0cHVibGljIHN0YXRpYyBjbGFtcCh2YWx1ZTpudW1iZXIsIG1pbjpudW1iZXIgPSAwLCBtYXg6bnVtYmVyID0gMSk6bnVtYmVyIHtcclxuXHRcdHJldHVybiB2YWx1ZSA8IG1pbiA/IG1pbiA6IHZhbHVlID4gbWF4ID8gbWF4IDogdmFsdWU7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==