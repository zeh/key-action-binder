define(["require", "exports"], function (require, exports) {
    /**
     * Utility pure functions
     */
    var Utils = (function () {
        function Utils() {
        }
        /**
         * Maps a value from a range, determined by old minimum and maximum values, to a new range, determined by new minimum and maximum values. These minimum and maximum values are referential; the new value is not clamped by them.
         * @param value	The value to be re-mapped.
         * @param oldMin	The previous minimum value.
         * @param oldMax	The previous maximum value.
         * @param newMin	The new minimum value.
         * @param newMax	The new maximum value.
         * @return			The new value, mapped to the new range.
         */
        Utils.map = function (value, oldMin, oldMax, newMin, newMax, clamp) {
            if (newMin === void 0) { newMin = 0; }
            if (newMax === void 0) { newMax = 1; }
            if (clamp === void 0) { clamp = false; }
            if (oldMin == oldMax)
                return newMin;
            var p = ((value - oldMin) / (oldMax - oldMin) * (newMax - newMin)) + newMin;
            if (clamp)
                p = newMin < newMax ? this.clamp(p, newMin, newMax) : Utils.clamp(p, newMax, newMin);
            return p;
        };
        /**
         * Clamps a number to a range, by restricting it to a minimum and maximum values: if the passed value is lower than the minimum value, it's replaced by the minimum; if it's higher than the maximum value, it's replaced by the maximum; if not, it's unchanged.
         * @param value	The value to be clamped.
         * @param min		Minimum value allowed.
         * @param max		Maximum value allowed.
         * @return			The newly clamped value.
         */
        Utils.clamp = function (value, min, max) {
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 1; }
            return value < min ? min : value > max ? max : value;
        };
        return Utils;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Utils;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvVXRpbHMudHMiXSwibmFtZXMiOlsiVXRpbHMiLCJVdGlscy5jb25zdHJ1Y3RvciIsIlV0aWxzLm1hcCIsIlV0aWxzLmNsYW1wIl0sIm1hcHBpbmdzIjoiO0lBQUE7O09BRUc7SUFDSDtRQUFBQTtRQTRCQUMsQ0FBQ0E7UUExQkFEOzs7Ozs7OztXQVFHQTtRQUNXQSxTQUFHQSxHQUFqQkEsVUFBa0JBLEtBQVlBLEVBQUVBLE1BQWFBLEVBQUVBLE1BQWFBLEVBQUVBLE1BQWlCQSxFQUFFQSxNQUFpQkEsRUFBRUEsS0FBcUJBO1lBQTNERSxzQkFBaUJBLEdBQWpCQSxVQUFpQkE7WUFBRUEsc0JBQWlCQSxHQUFqQkEsVUFBaUJBO1lBQUVBLHFCQUFxQkEsR0FBckJBLGFBQXFCQTtZQUN4SEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsTUFBTUEsSUFBSUEsTUFBTUEsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxHQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQTtZQUN0RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQUNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUdBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLEVBQUVBLE1BQU1BLEVBQUVBLE1BQU1BLENBQUNBLENBQUNBO1lBQ2hHQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNWQSxDQUFDQTtRQUVERjs7Ozs7O1dBTUdBO1FBQ1dBLFdBQUtBLEdBQW5CQSxVQUFvQkEsS0FBWUEsRUFBRUEsR0FBY0EsRUFBRUEsR0FBY0E7WUFBOUJHLG1CQUFjQSxHQUFkQSxPQUFjQTtZQUFFQSxtQkFBY0EsR0FBZEEsT0FBY0E7WUFDL0RBLE1BQU1BLENBQUNBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEtBQUtBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3REQSxDQUFDQTtRQUNGSCxZQUFDQTtJQUFEQSxDQTVCQSxBQTRCQ0EsSUFBQTtJQTVCRDsyQkE0QkMsQ0FBQSIsImZpbGUiOiJjb3JlL1V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFV0aWxpdHkgcHVyZSBmdW5jdGlvbnNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuXHJcblx0LyoqXHJcblx0ICogTWFwcyBhIHZhbHVlIGZyb20gYSByYW5nZSwgZGV0ZXJtaW5lZCBieSBvbGQgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMsIHRvIGEgbmV3IHJhbmdlLCBkZXRlcm1pbmVkIGJ5IG5ldyBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlcy4gVGhlc2UgbWluaW11bSBhbmQgbWF4aW11bSB2YWx1ZXMgYXJlIHJlZmVyZW50aWFsOyB0aGUgbmV3IHZhbHVlIGlzIG5vdCBjbGFtcGVkIGJ5IHRoZW0uXHJcblx0ICogQHBhcmFtIHZhbHVlXHRUaGUgdmFsdWUgdG8gYmUgcmUtbWFwcGVkLlxyXG5cdCAqIEBwYXJhbSBvbGRNaW5cdFRoZSBwcmV2aW91cyBtaW5pbXVtIHZhbHVlLlxyXG5cdCAqIEBwYXJhbSBvbGRNYXhcdFRoZSBwcmV2aW91cyBtYXhpbXVtIHZhbHVlLlxyXG5cdCAqIEBwYXJhbSBuZXdNaW5cdFRoZSBuZXcgbWluaW11bSB2YWx1ZS5cclxuXHQgKiBAcGFyYW0gbmV3TWF4XHRUaGUgbmV3IG1heGltdW0gdmFsdWUuXHJcblx0ICogQHJldHVyblx0XHRcdFRoZSBuZXcgdmFsdWUsIG1hcHBlZCB0byB0aGUgbmV3IHJhbmdlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgbWFwKHZhbHVlOm51bWJlciwgb2xkTWluOm51bWJlciwgb2xkTWF4Om51bWJlciwgbmV3TWluOm51bWJlciA9IDAsIG5ld01heDpudW1iZXIgPSAxLCBjbGFtcDpCb29sZWFuID0gZmFsc2UpOm51bWJlciB7XHJcblx0XHRpZiAob2xkTWluID09IG9sZE1heCkgcmV0dXJuIG5ld01pbjtcclxuXHRcdHZhciBwID0gKCh2YWx1ZS1vbGRNaW4pIC8gKG9sZE1heC1vbGRNaW4pICogKG5ld01heC1uZXdNaW4pKSArIG5ld01pbjtcclxuXHRcdGlmIChjbGFtcCkgcCA9IG5ld01pbiA8IG5ld01heCA/IHRoaXMuY2xhbXAocCwgbmV3TWluLCBuZXdNYXgpIDogVXRpbHMuY2xhbXAocCwgbmV3TWF4LCBuZXdNaW4pO1xyXG5cdFx0cmV0dXJuIHA7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDbGFtcHMgYSBudW1iZXIgdG8gYSByYW5nZSwgYnkgcmVzdHJpY3RpbmcgaXQgdG8gYSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlczogaWYgdGhlIHBhc3NlZCB2YWx1ZSBpcyBsb3dlciB0aGFuIHRoZSBtaW5pbXVtIHZhbHVlLCBpdCdzIHJlcGxhY2VkIGJ5IHRoZSBtaW5pbXVtOyBpZiBpdCdzIGhpZ2hlciB0aGFuIHRoZSBtYXhpbXVtIHZhbHVlLCBpdCdzIHJlcGxhY2VkIGJ5IHRoZSBtYXhpbXVtOyBpZiBub3QsIGl0J3MgdW5jaGFuZ2VkLlxyXG5cdCAqIEBwYXJhbSB2YWx1ZVx0VGhlIHZhbHVlIHRvIGJlIGNsYW1wZWQuXHJcblx0ICogQHBhcmFtIG1pblx0XHRNaW5pbXVtIHZhbHVlIGFsbG93ZWQuXHJcblx0ICogQHBhcmFtIG1heFx0XHRNYXhpbXVtIHZhbHVlIGFsbG93ZWQuXHJcblx0ICogQHJldHVyblx0XHRcdFRoZSBuZXdseSBjbGFtcGVkIHZhbHVlLlxyXG5cdCAqL1xyXG5cdHB1YmxpYyBzdGF0aWMgY2xhbXAodmFsdWU6bnVtYmVyLCBtaW46bnVtYmVyID0gMCwgbWF4Om51bWJlciA9IDEpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdmFsdWUgPCBtaW4gPyBtaW4gOiB2YWx1ZSA+IG1heCA/IG1heCA6IHZhbHVlO1xyXG5cdH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=