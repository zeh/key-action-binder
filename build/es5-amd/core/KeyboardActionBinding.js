define(["require", "exports", './KeyActionBinder'], function (require, exports, KeyActionBinder_1) {
    /**
     * Information on a keyboard event filter
     */
    var KeyboardActionBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function KeyboardActionBinding(keyCode, keyLocation) {
            this.keyCode = keyCode;
            this.keyLocation = keyLocation;
            this.isActivated = false;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        KeyboardActionBinding.prototype.matchesKeyboardKey = function (keyCode, keyLocation) {
            return (this.keyCode == keyCode || this.keyCode == KeyActionBinder_1.default.KeyCodes.ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder_1.default.KeyLocations.ANY);
        };
        return KeyboardActionBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyboardActionBinding;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvS2V5Ym9hcmRBY3Rpb25CaW5kaW5nLnRzIl0sIm5hbWVzIjpbIktleWJvYXJkQWN0aW9uQmluZGluZyIsIktleWJvYXJkQWN0aW9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktleWJvYXJkQWN0aW9uQmluZGluZy5tYXRjaGVzS2V5Ym9hcmRLZXkiXSwibWFwcGluZ3MiOiI7SUFFQTs7T0FFRztJQUNIO1FBU0NBLG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBLCtCQUFZQSxPQUFjQSxFQUFFQSxXQUFrQkE7WUFDN0NDLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxXQUFXQSxDQUFDQTtZQUMvQkEsSUFBSUEsQ0FBQ0EsV0FBV0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDMUJBLENBQUNBO1FBR0RELG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFNUdBLGtEQUFrQkEsR0FBekJBLFVBQTBCQSxPQUFjQSxFQUFFQSxXQUFrQkE7WUFDM0RFLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLElBQUlBLE9BQU9BLElBQUlBLElBQUlBLENBQUNBLE9BQU9BLElBQUlBLHlCQUFlQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSx5QkFBZUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDL0tBLENBQUNBO1FBQ0ZGLDRCQUFDQTtJQUFEQSxDQXpCQSxBQXlCQ0EsSUFBQTtJQXpCRDsyQ0F5QkMsQ0FBQSIsImZpbGUiOiJjb3JlL0tleWJvYXJkQWN0aW9uQmluZGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLZXlBY3Rpb25CaW5kZXIgZnJvbSAnLi9LZXlBY3Rpb25CaW5kZXInO1xyXG5cclxuLyoqXHJcbiAqIEluZm9ybWF0aW9uIG9uIGEga2V5Ym9hcmQgZXZlbnQgZmlsdGVyXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLZXlib2FyZEFjdGlvbkJpbmRpbmcge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHVibGljIGtleUNvZGU6bnVtYmVyO1xyXG5cdHB1YmxpYyBrZXlMb2NhdGlvbjpudW1iZXI7XHJcblxyXG5cdHB1YmxpYyBpc0FjdGl2YXRlZDpib29sZWFuO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3Ioa2V5Q29kZTpudW1iZXIsIGtleUxvY2F0aW9uOm51bWJlcikge1xyXG5cdFx0dGhpcy5rZXlDb2RlID0ga2V5Q29kZTtcclxuXHRcdHRoaXMua2V5TG9jYXRpb24gPSBrZXlMb2NhdGlvbjtcclxuXHRcdHRoaXMuaXNBY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgbWF0Y2hlc0tleWJvYXJkS2V5KGtleUNvZGU6bnVtYmVyLCBrZXlMb2NhdGlvbjpudW1iZXIpOmJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuICh0aGlzLmtleUNvZGUgPT0ga2V5Q29kZSB8fCB0aGlzLmtleUNvZGUgPT0gS2V5QWN0aW9uQmluZGVyLktleUNvZGVzLkFOWSkgJiYgKHRoaXMua2V5TG9jYXRpb24gPT0ga2V5TG9jYXRpb24gfHwgdGhpcy5rZXlMb2NhdGlvbiA9PSBLZXlBY3Rpb25CaW5kZXIuS2V5TG9jYXRpb25zLkFOWSk7XHJcblx0fVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==