define(["require", "exports", './KeyActionBinder'], function (require, exports, KeyActionBinder_1) {
    /**
     * Information on a gamepad event filter
     */
    var GamepadActionBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function GamepadActionBinding(buttonCode, gamepadLocation) {
            this.buttonCode = buttonCode;
            this.gamepadLocation = gamepadLocation;
            this.isActivated = false;
            this.value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        GamepadActionBinding.prototype.matchesGamepadButton = function (buttonCode, gamepadLocation) {
            return (this.buttonCode == buttonCode || this.buttonCode == KeyActionBinder_1.default.GamepadButtons.ANY.index) && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder_1.default.GamepadLocations.ANY);
        };
        return GamepadActionBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GamepadActionBinding;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvR2FtZXBhZEFjdGlvbkJpbmRpbmcudHMiXSwibmFtZXMiOlsiR2FtZXBhZEFjdGlvbkJpbmRpbmciLCJHYW1lcGFkQWN0aW9uQmluZGluZy5jb25zdHJ1Y3RvciIsIkdhbWVwYWRBY3Rpb25CaW5kaW5nLm1hdGNoZXNHYW1lcGFkQnV0dG9uIl0sIm1hcHBpbmdzIjoiO0lBRUE7O09BRUc7SUFDSDtRQVVDQSxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRW5IQSw4QkFBWUEsVUFBaUJBLEVBQUVBLGVBQXNCQTtZQUNwREMsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsVUFBVUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLGVBQWVBLENBQUNBO1lBQ3ZDQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUN6QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBRURELG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFNUdBLG1EQUFvQkEsR0FBM0JBLFVBQTRCQSxVQUFpQkEsRUFBRUEsZUFBc0JBO1lBQ3BFRSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSx5QkFBZUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEsZUFBZUEsSUFBSUEsSUFBSUEsQ0FBQ0EsZUFBZUEsSUFBSUEseUJBQWVBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDcE5BLENBQUNBO1FBQ0ZGLDJCQUFDQTtJQUFEQSxDQTFCQSxBQTBCQ0EsSUFBQTtJQTFCRDswQ0EwQkMsQ0FBQSIsImZpbGUiOiJjb3JlL0dhbWVwYWRBY3Rpb25CaW5kaW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEtleUFjdGlvbkJpbmRlciBmcm9tICcuL0tleUFjdGlvbkJpbmRlcic7XHJcblxyXG4vKipcclxuICogSW5mb3JtYXRpb24gb24gYSBnYW1lcGFkIGV2ZW50IGZpbHRlclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZXBhZEFjdGlvbkJpbmRpbmcge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHVibGljIGJ1dHRvbkNvZGU6bnVtYmVyO1xyXG5cdHB1YmxpYyBnYW1lcGFkTG9jYXRpb246bnVtYmVyO1xyXG5cclxuXHRwdWJsaWMgaXNBY3RpdmF0ZWQ6Ym9vbGVhbjtcclxuXHRwdWJsaWMgdmFsdWU6bnVtYmVyO1xyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIENPTlNUUlVDVE9SIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0Y29uc3RydWN0b3IoYnV0dG9uQ29kZTpudW1iZXIsIGdhbWVwYWRMb2NhdGlvbjpudW1iZXIpIHtcclxuXHRcdHRoaXMuYnV0dG9uQ29kZSA9IGJ1dHRvbkNvZGU7XHJcblx0XHR0aGlzLmdhbWVwYWRMb2NhdGlvbiA9IGdhbWVwYWRMb2NhdGlvbjtcclxuXHRcdHRoaXMuaXNBY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMudmFsdWUgPSAwO1xyXG5cdH1cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIG1hdGNoZXNHYW1lcGFkQnV0dG9uKGJ1dHRvbkNvZGU6bnVtYmVyLCBnYW1lcGFkTG9jYXRpb246bnVtYmVyKTpib29sZWFuIHtcclxuXHRcdHJldHVybiAodGhpcy5idXR0b25Db2RlID09IGJ1dHRvbkNvZGUgfHwgdGhpcy5idXR0b25Db2RlID09IEtleUFjdGlvbkJpbmRlci5HYW1lcGFkQnV0dG9ucy5BTlkuaW5kZXgpICYmICh0aGlzLmdhbWVwYWRMb2NhdGlvbiA9PSBnYW1lcGFkTG9jYXRpb24gfHwgdGhpcy5nYW1lcGFkTG9jYXRpb24gPT0gS2V5QWN0aW9uQmluZGVyLkdhbWVwYWRMb2NhdGlvbnMuQU5ZKTtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9