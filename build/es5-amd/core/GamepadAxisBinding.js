define(["require", "exports", './KeyActionBinder', './Utils'], function (require, exports, KeyActionBinder_1, Utils_1) {
    /**
     * Information on a gamepad event filter
     */
    var GamepadAxisBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function GamepadAxisBinding(axisCode, deadZone, gamepadLocation) {
            this.axisCode = axisCode;
            this.deadZone = deadZone;
            this.gamepadLocation = gamepadLocation;
            this._value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        GamepadAxisBinding.prototype.matchesGamepadAxis = function (axisCode, gamepadLocation) {
            return this.axisCode == axisCode && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder_1.default.GamepadLocations.ANY);
        };
        Object.defineProperty(GamepadAxisBinding.prototype, "value", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                // The value is returned taking the dead zone into consideration
                if (this._value < 0) {
                    return Utils_1.default.map(this._value, -this.deadZone, -1, 0, -1, true);
                }
                else {
                    return Utils_1.default.map(this._value, this.deadZone, 1, 0, 1, true);
                }
            },
            set: function (newValue) {
                // The value is set raw
                this._value = newValue;
            },
            enumerable: true,
            configurable: true
        });
        return GamepadAxisBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamepadAxisBinding;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvR2FtZXBhZEF4aXNCaW5kaW5nLnRzIl0sIm5hbWVzIjpbIkdhbWVwYWRBeGlzQmluZGluZyIsIkdhbWVwYWRBeGlzQmluZGluZy5jb25zdHJ1Y3RvciIsIkdhbWVwYWRBeGlzQmluZGluZy5tYXRjaGVzR2FtZXBhZEF4aXMiLCJHYW1lcGFkQXhpc0JpbmRpbmcudmFsdWUiXSwibWFwcGluZ3MiOiI7SUFHQTs7T0FFRztJQUNIO1FBV0NBLG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBLDRCQUFZQSxRQUFlQSxFQUFFQSxRQUFlQSxFQUFFQSxlQUFzQkE7WUFDbkVDLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBO1lBQ3pCQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUN6QkEsSUFBSUEsQ0FBQ0EsZUFBZUEsR0FBR0EsZUFBZUEsQ0FBQ0E7WUFDdkNBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO1FBQ2pCQSxDQUFDQTtRQUVERCxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRTVHQSwrQ0FBa0JBLEdBQXpCQSxVQUEwQkEsUUFBZUEsRUFBRUEsZUFBc0JBO1lBQ2hFRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxRQUFRQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSxlQUFlQSxJQUFJQSxJQUFJQSxDQUFDQSxlQUFlQSxJQUFJQSx5QkFBZUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUMvSUEsQ0FBQ0E7UUFNREYsc0JBQVdBLHFDQUFLQTtZQUhoQkEsbUhBQW1IQTtZQUNuSEEsbUhBQW1IQTtpQkFFbkhBO2dCQUNDRyxnRUFBZ0VBO2dCQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3JCQSxNQUFNQSxDQUFDQSxlQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDaEVBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDUEEsTUFBTUEsQ0FBQ0EsZUFBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdEQSxDQUFDQTtZQUNGQSxDQUFDQTtpQkFFREgsVUFBaUJBLFFBQWVBO2dCQUMvQkcsdUJBQXVCQTtnQkFDdkJBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBO1lBQ3hCQSxDQUFDQTs7O1dBTEFIO1FBTUZBLHlCQUFDQTtJQUFEQSxDQTdDQSxBQTZDQ0EsSUFBQTtJQTdDRDt3Q0E2Q0MsQ0FBQSIsImZpbGUiOiJjb3JlL0dhbWVwYWRBeGlzQmluZGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBLZXlBY3Rpb25CaW5kZXIgZnJvbSAnLi9LZXlBY3Rpb25CaW5kZXInO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi9VdGlscyc7XHJcblxyXG4vKipcclxuICogSW5mb3JtYXRpb24gb24gYSBnYW1lcGFkIGV2ZW50IGZpbHRlclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXBhZEF4aXNCaW5kaW5nIHtcclxuXHJcblx0Ly8gUHJvcGVydGllc1xyXG5cdHB1YmxpYyBheGlzQ29kZTpudW1iZXI7XHJcblx0cHVibGljIGdhbWVwYWRMb2NhdGlvbjpudW1iZXI7XHJcblx0cHVibGljIGRlYWRab25lOm51bWJlcjtcclxuXHJcblx0cHVibGljIGlzQWN0aXZhdGVkOmJvb2xlYW47XHJcblx0cHJpdmF0ZSBfdmFsdWU6bnVtYmVyO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoYXhpc0NvZGU6bnVtYmVyLCBkZWFkWm9uZTpudW1iZXIsIGdhbWVwYWRMb2NhdGlvbjpudW1iZXIpIHtcclxuXHRcdHRoaXMuYXhpc0NvZGUgPSBheGlzQ29kZTtcclxuXHRcdHRoaXMuZGVhZFpvbmUgPSBkZWFkWm9uZTtcclxuXHRcdHRoaXMuZ2FtZXBhZExvY2F0aW9uID0gZ2FtZXBhZExvY2F0aW9uO1xyXG5cdFx0dGhpcy5fdmFsdWUgPSAwO1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIG1hdGNoZXNHYW1lcGFkQXhpcyhheGlzQ29kZTpudW1iZXIsIGdhbWVwYWRMb2NhdGlvbjpudW1iZXIpOmJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMuYXhpc0NvZGUgPT0gYXhpc0NvZGUgJiYgKHRoaXMuZ2FtZXBhZExvY2F0aW9uID09IGdhbWVwYWRMb2NhdGlvbiB8fCB0aGlzLmdhbWVwYWRMb2NhdGlvbiA9PSBLZXlBY3Rpb25CaW5kZXIuR2FtZXBhZExvY2F0aW9ucy5BTlkpO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBQ0NFU1NPUiBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBnZXQgdmFsdWUoKTpudW1iZXIge1xyXG5cdFx0Ly8gVGhlIHZhbHVlIGlzIHJldHVybmVkIHRha2luZyB0aGUgZGVhZCB6b25lIGludG8gY29uc2lkZXJhdGlvblxyXG5cdFx0aWYgKHRoaXMuX3ZhbHVlIDwgMCkge1xyXG5cdFx0XHRyZXR1cm4gVXRpbHMubWFwKHRoaXMuX3ZhbHVlLCAtdGhpcy5kZWFkWm9uZSwgLTEsIDAsIC0xLCB0cnVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBVdGlscy5tYXAodGhpcy5fdmFsdWUsIHRoaXMuZGVhZFpvbmUsIDEsIDAsIDEsIHRydWUpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTpudW1iZXIpIHtcclxuXHRcdC8vIFRoZSB2YWx1ZSBpcyBzZXQgcmF3XHJcblx0XHR0aGlzLl92YWx1ZSA9IG5ld1ZhbHVlO1xyXG5cdH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=