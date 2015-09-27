import KeyActionBinder from './KeyActionBinder';
import KeyboardActionBinding from './KeyboardActionBinding';
import GamepadActionBinding from './GamepadActionBinding';
/**
 * Information linking an action to a binding, and whether it's activated
 */
export default class Action {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    constructor(id) {
        this._id = id;
        this.timeLastActivation = 0;
        this.toleranceTime = 0;
        this.keyboardBindings = [];
        this.keyboardActivated = false;
        this.keyboardValue = 0;
        this.keyboardConsumed = false;
        this.gamepadButtonBindings = [];
        this.gamepadButtonActivated = false;
        this.gamepadButtonValue = 0;
        this.gamepadButtonConsumed = false;
    }
    bind(subject, location) {
        if (typeof subject === "number") {
            // Keyboard binding
            this.bindKeyboard(subject, location == undefined ? KeyActionBinder.KeyLocations.ANY : location);
        }
        else {
            // Gamepad binding
            this.bindGamepad(subject, location == undefined ? KeyActionBinder.GamepadLocations.ANY : location);
        }
        return this;
    }
    setTolerance(timeInSeconds) {
        this.toleranceTime = timeInSeconds * 1000;
        return this;
    }
    consume() {
        if (this.keyboardActivated)
            this.keyboardConsumed = true;
        if (this.gamepadButtonActivated)
            this.gamepadButtonConsumed = true;
    }
    interpretKeyDown(keyCode, keyLocation) {
        for (var i = 0; i < this.keyboardBindings.length; i++) {
            if (!this.keyboardBindings[i].isActivated && this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                // Activated
                this.keyboardBindings[i].isActivated = true;
                this.keyboardActivated = true;
                this.keyboardValue = 1;
                this.timeLastActivation = Date.now();
            }
        }
    }
    interpretKeyUp(keyCode, keyLocation) {
        var hasMatch;
        var isActivated = false;
        for (var i = 0; i < this.keyboardBindings.length; i++) {
            if (this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                if (this.keyboardBindings[i].isActivated) {
                    // Deactivated
                    this.keyboardBindings[i].isActivated = false;
                }
                hasMatch = true;
                isActivated = isActivated || this.keyboardBindings[i].isActivated;
            }
        }
        if (hasMatch) {
            this.keyboardActivated = isActivated;
            this.keyboardValue = this.keyboardActivated ? 1 : 0;
            if (!this.keyboardActivated)
                this.keyboardConsumed = false;
        }
    }
    interpretGamepadButton(buttonCode, gamepadLocation, pressedState, valueState) {
        var hasMatch;
        var isActivated = false;
        var newValue = 0;
        for (var i = 0; i < this.gamepadButtonBindings.length; i++) {
            if (this.gamepadButtonBindings[i].matchesGamepadButton(buttonCode, gamepadLocation)) {
                hasMatch = true;
                this.gamepadButtonBindings[i].isActivated = pressedState;
                this.gamepadButtonBindings[i].value = valueState;
                isActivated = isActivated || pressedState;
                if (valueState > newValue)
                    newValue = valueState;
            }
        }
        // TODO: I think this will fail if two buttons are used for the same action; values will be overwritten
        if (hasMatch) {
            if (isActivated && !this.gamepadButtonActivated)
                this.timeLastActivation = Date.now();
            this.gamepadButtonActivated = isActivated;
            this.gamepadButtonValue = newValue;
            if (!this.gamepadButtonActivated)
                this.gamepadButtonConsumed = false;
        }
    }
    // ================================================================================================================
    // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
    get id() {
        return this._id;
    }
    get activated() {
        return ((this.keyboardActivated && !this.keyboardConsumed) || (this.gamepadButtonActivated && !this.gamepadButtonConsumed)) && this.isWithinToleranceTime();
    }
    get value() {
        return this.isWithinToleranceTime() ? Math.max(this.keyboardConsumed ? 0 : this.keyboardValue, this.gamepadButtonConsumed ? 0 : this.gamepadButtonValue) : 0;
    }
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    bindKeyboard(keyCode, keyLocation) {
        // TODO: check if already present?
        this.keyboardBindings.push(new KeyboardActionBinding(keyCode, keyLocation));
    }
    bindGamepad(button, gamepadLocation) {
        // TODO: check if already present?
        this.gamepadButtonBindings.push(new GamepadActionBinding(button.index, gamepadLocation));
    }
    isWithinToleranceTime() {
        return this.toleranceTime <= 0 || this.timeLastActivation >= Date.now() - this.toleranceTime;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvcmUvQWN0aW9uLnRzIl0sIm5hbWVzIjpbIkFjdGlvbiIsIkFjdGlvbi5jb25zdHJ1Y3RvciIsIkFjdGlvbi5iaW5kIiwiQWN0aW9uLnNldFRvbGVyYW5jZSIsIkFjdGlvbi5jb25zdW1lIiwiQWN0aW9uLmludGVycHJldEtleURvd24iLCJBY3Rpb24uaW50ZXJwcmV0S2V5VXAiLCJBY3Rpb24uaW50ZXJwcmV0R2FtZXBhZEJ1dHRvbiIsIkFjdGlvbi5pZCIsIkFjdGlvbi5hY3RpdmF0ZWQiLCJBY3Rpb24udmFsdWUiLCJBY3Rpb24uYmluZEtleWJvYXJkIiwiQWN0aW9uLmJpbmRHYW1lcGFkIiwiQWN0aW9uLmlzV2l0aGluVG9sZXJhbmNlVGltZSJdLCJtYXBwaW5ncyI6Ik9BQU8sZUFBZSxNQUFNLG1CQUFtQjtPQUN4QyxxQkFBcUIsTUFBTSx5QkFBeUI7T0FDcEQsb0JBQW9CLE1BQU0sd0JBQXdCO0FBRXpEOztHQUVHO0FBQ0g7SUFtQkNBLG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFbkhBLFlBQVlBLEVBQVNBO1FBQ3BCQyxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNkQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLENBQUNBLENBQUNBO1FBQzVCQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUV2QkEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUMvQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDdkJBLElBQUlBLENBQUNBLGdCQUFnQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFFOUJBLElBQUlBLENBQUNBLHFCQUFxQkEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDaENBLElBQUlBLENBQUNBLHNCQUFzQkEsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDcENBLElBQUlBLENB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Q0E7UUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDbkVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0Esb0JBQW9CQSxDQUFDQSxVQUFVQSxFQUFFQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckZBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO2dCQUNoQkEsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxHQUFHQSxZQUFZQSxDQUFDQTtnQkFDekRBLElBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsR0FBR0EsVUFBVUEsQ0FBQ0E7Z0JBRWpEQSxXQUFXQSxHQUFHQSxXQUFXQSxJQUFJQSxZQUFZQSxDQUFDQTtnQkFDMUNBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLEdBQUdBLFFBQVFBLENBQUNBO29CQUFDQSxRQUFRQSxHQUFHQSxVQUFVQSxDQUFDQTtZQUNsREEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFREEsdUdBQXVHQTtRQUV2R0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUV0RkEsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxHQUFHQSxXQUFXQSxDQUFDQTtZQUMxQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUVuQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN0RUEsQ0FBQ0E7SUFDRkEsQ0FBQ0E7SUFHRFAsbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUVuSEEsSUFBV0EsRUFBRUE7UUFDWlEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7SUFDakJBLENBQUNBO0lBRURSLElBQVdBLFNBQVNBO1FBQ25CUyxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7SUFDN0pBLENBQUNBO0lBRURULElBQVdBLEtBQUtBO1FBQ2ZVLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLHFCQUFxQkEsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxxQkFBcUJBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDOUpBLENBQUNBO0lBR0RWLG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFM0dBLFlBQVlBLENBQUNBLE9BQWNBLEVBQUVBLFdBQWtCQTtRQUN0RFcsa0NBQWtDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxxQkFBcUJBLENBQUNBLE9BQU9BLEVBQUVBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO0lBQzdFQSxDQUFDQTtJQUVPWCxXQUFXQSxDQUFDQSxNQUFxQkEsRUFBRUEsZUFBc0JBO1FBQ2hFWSxrQ0FBa0NBO1FBQ2xDQSxJQUFJQSxDQUFDQSxxQkFBcUJBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLG9CQUFvQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBRUEsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDMUZBLENBQUNBO0lBRU1aLHFCQUFxQkE7UUFDM0JhLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGFBQWFBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLGtCQUFrQkEsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0E7SUFDOUZBLENBQUNBO0FBRUZiLENBQUNBO0FBQUEiLCJmaWxlIjoiY29yZS9BY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgS2V5QWN0aW9uQmluZGVyIGZyb20gJy4vS2V5QWN0aW9uQmluZGVyJztcclxuaW1wb3J0IEtleWJvYXJkQWN0aW9uQmluZGluZyBmcm9tICcuL0tleWJvYXJkQWN0aW9uQmluZGluZyc7XHJcbmltcG9ydCBHYW1lcGFkQWN0aW9uQmluZGluZyBmcm9tICcuL0dhbWVwYWRBY3Rpb25CaW5kaW5nJztcclxuXHJcbi8qKlxyXG4gKiBJbmZvcm1hdGlvbiBsaW5raW5nIGFuIGFjdGlvbiB0byBhIGJpbmRpbmcsIGFuZCB3aGV0aGVyIGl0J3MgYWN0aXZhdGVkXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb24ge1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBfaWQ6c3RyaW5nO1xyXG5cdHByaXZhdGUgdGltZUxhc3RBY3RpdmF0aW9uOm51bWJlcjtcclxuXHJcblx0cHJpdmF0ZSBrZXlib2FyZEJpbmRpbmdzOkFycmF5PEtleWJvYXJkQWN0aW9uQmluZGluZz47XHJcblx0cHJpdmF0ZSBrZXlib2FyZEFjdGl2YXRlZDpib29sZWFuO1xyXG5cdHByaXZhdGUga2V5Ym9hcmRWYWx1ZTpudW1iZXI7XHJcblx0cHJpdmF0ZSBrZXlib2FyZENvbnN1bWVkOmJvb2xlYW47XHJcblxyXG5cdHByaXZhdGUgZ2FtZXBhZEJ1dHRvbkJpbmRpbmdzOkFycmF5PEdhbWVwYWRBY3Rpb25CaW5kaW5nPjtcclxuXHRwcml2YXRlIGdhbWVwYWRCdXR0b25BY3RpdmF0ZWQ6Ym9vbGVhbjtcclxuXHRwcml2YXRlIGdhbWVwYWRCdXR0b25WYWx1ZTpudW1iZXI7XHJcblx0cHJpdmF0ZSBnYW1lcGFkQnV0dG9uQ29uc3VtZWQ6Ym9vbGVhbjtcclxuXHJcblx0cHJpdmF0ZSB0b2xlcmFuY2VUaW1lOm51bWJlcjtcdFx0XHRcdFx0XHRcdFx0XHRcdC8vIFRvbGVyYW5jZSBmb3IgYWN0aXZhdGlvbnMsIGluIG1zXHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcihpZDpzdHJpbmcpIHtcclxuXHRcdHRoaXMuX2lkID0gaWQ7XHJcblx0XHR0aGlzLnRpbWVMYXN0QWN0aXZhdGlvbiA9IDA7XHJcblx0XHR0aGlzLnRvbGVyYW5jZVRpbWUgPSAwO1xyXG5cclxuXHRcdHRoaXMua2V5Ym9hcmRCaW5kaW5ncyA9IFtdO1xyXG5cdFx0dGhpcy5rZXlib2FyZEFjdGl2YXRlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5rZXlib2FyZFZhbHVlID0gMDtcclxuXHRcdHRoaXMua2V5Ym9hcmRDb25zdW1lZCA9IGZhbHNlO1xyXG5cclxuXHRcdHRoaXMuZ2FtZXBhZEJ1dHRvbkJpbmRpbmdzID0gW107XHJcblx0XHR0aGlzLmdhbWVwYWRCdXR0b25BY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdHRoaXMuZ2FtZXBhZEJ1dHRvblZhbHVlID0gMDtcclxuXHRcdHRoaXMuZ2FtZXBhZEJ1dHRvbkNvbnN1bWVkID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBVQkxJQyBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHVibGljIGJpbmQoa2V5Q29kZTpudW1iZXIpOkFjdGlvbjtcclxuXHRwdWJsaWMgYmluZChrZXlDb2RlOm51bWJlciwga2V5TG9jYXRpb246bnVtYmVyKTpBY3Rpb247XHJcblx0cHVibGljIGJpbmQoYnV0dG9uOntpbmRleDpudW1iZXJ9KTpBY3Rpb247XHJcblx0cHVibGljIGJpbmQoYnV0dG9uOntpbmRleDpudW1iZXJ9LCBnYW1lcGFkTG9jYXRpb246bnVtYmVyKTpBY3Rpb247XHJcblx0cHVibGljIGJpbmQoc3ViamVjdDpudW1iZXJ8e2luZGV4Om51bWJlcn0sIGxvY2F0aW9uPzpudW1iZXIpOkFjdGlvbiB7XHJcblx0XHRpZiAodHlwZW9mIHN1YmplY3QgPT09IFwibnVtYmVyXCIpIHtcclxuXHRcdFx0Ly8gS2V5Ym9hcmQgYmluZGluZ1xyXG5cdFx0XHR0aGlzLmJpbmRLZXlib2FyZChzdWJqZWN0LCBsb2NhdGlvbiA9PSB1bmRlZmluZWQgPyBLZXlBY3Rpb25CaW5kZXIuS2V5TG9jYXRpb25zLkFOWSA6IGxvY2F0aW9uKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIEdhbWVwYWQgYmluZGluZ1xyXG5cdFx0XHR0aGlzLmJpbmRHYW1lcGFkKHN1YmplY3QsIGxvY2F0aW9uID09IHVuZGVmaW5lZCA/IEtleUFjdGlvbkJpbmRlci5HYW1lcGFkTG9jYXRpb25zLkFOWSA6IGxvY2F0aW9uKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHNldFRvbGVyYW5jZSh0aW1lSW5TZWNvbmRzOm51bWJlcik6QWN0aW9uIHtcclxuXHRcdHRoaXMudG9sZXJhbmNlVGltZSA9IHRpbWVJblNlY29uZHMgKiAxMDAwO1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgY29uc3VtZSgpOnZvaWQge1xyXG5cdFx0aWYgKHRoaXMua2V5Ym9hcmRBY3RpdmF0ZWQpIHRoaXMua2V5Ym9hcmRDb25zdW1lZCA9IHRydWU7XHJcblx0XHRpZiAodGhpcy5nYW1lcGFkQnV0dG9uQWN0aXZhdGVkKSB0aGlzLmdhbWVwYWRCdXR0b25Db25zdW1lZCA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW50ZXJwcmV0S2V5RG93bihrZXlDb2RlOm51bWJlciwga2V5TG9jYXRpb246bnVtYmVyKTp2b2lkIHtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMua2V5Ym9hcmRCaW5kaW5ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAoIXRoaXMua2V5Ym9hcmRCaW5kaW5nc1tpXS5pc0FjdGl2YXRlZCAmJiB0aGlzLmtleWJvYXJkQmluZGluZ3NbaV0ubWF0Y2hlc0tleWJvYXJkS2V5KGtleUNvZGUsIGtleUxvY2F0aW9uKSkge1xyXG5cdFx0XHRcdC8vIEFjdGl2YXRlZFxyXG5cdFx0XHRcdHRoaXMua2V5Ym9hcmRCaW5kaW5nc1tpXS5pc0FjdGl2YXRlZCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5rZXlib2FyZEFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5rZXlib2FyZFZhbHVlID0gMTtcclxuXHRcdFx0XHR0aGlzLnRpbWVMYXN0QWN0aXZhdGlvbiA9IERhdGUubm93KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBpbnRlcnByZXRLZXlVcChrZXlDb2RlOm51bWJlciwga2V5TG9jYXRpb246bnVtYmVyKTp2b2lkIHtcclxuXHRcdHZhciBoYXNNYXRjaDpib29sZWFuO1xyXG5cdFx0dmFyIGlzQWN0aXZhdGVkOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdGZvciAodmFyIGk6bnVtYmVyID0gMDsgaSA8IHRoaXMua2V5Ym9hcmRCaW5kaW5ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpZiAodGhpcy5rZXlib2FyZEJpbmRpbmdzW2ldLm1hdGNoZXNLZXlib2FyZEtleShrZXlDb2RlLCBrZXlMb2NhdGlvbikpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5rZXlib2FyZEJpbmRpbmdzW2ldLmlzQWN0aXZhdGVkKSB7XHJcblx0XHRcdFx0XHQvLyBEZWFjdGl2YXRlZFxyXG5cdFx0XHRcdFx0dGhpcy5rZXlib2FyZEJpbmRpbmdzW2ldLmlzQWN0aXZhdGVkID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGhhc01hdGNoID0gdHJ1ZTtcclxuXHRcdFx0XHRpc0FjdGl2YXRlZCA9IGlzQWN0aXZhdGVkIHx8IHRoaXMua2V5Ym9hcmRCaW5kaW5nc1tpXS5pc0FjdGl2YXRlZDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChoYXNNYXRjaCkge1xyXG5cdFx0XHR0aGlzLmtleWJvYXJkQWN0aXZhdGVkID0gaXNBY3RpdmF0ZWQ7XHJcblx0XHRcdHRoaXMua2V5Ym9hcmRWYWx1ZSA9IHRoaXMua2V5Ym9hcmRBY3RpdmF0ZWQgPyAxIDogMDtcclxuXHJcblx0XHRcdGlmICghdGhpcy5rZXlib2FyZEFjdGl2YXRlZCkgdGhpcy5rZXlib2FyZENvbnN1bWVkID0gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgaW50ZXJwcmV0R2FtZXBhZEJ1dHRvbihidXR0b25Db2RlOm51bWJlciwgZ2FtZXBhZExvY2F0aW9uOm51bWJlciwgcHJlc3NlZFN0YXRlOmJvb2xlYW4sIHZhbHVlU3RhdGU6bnVtYmVyKTp2b2lkIHtcclxuXHRcdHZhciBoYXNNYXRjaDpib29sZWFuO1xyXG5cdFx0dmFyIGlzQWN0aXZhdGVkOmJvb2xlYW4gPSBmYWxzZTtcclxuXHRcdHZhciBuZXdWYWx1ZTpudW1iZXIgPSAwO1xyXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgdGhpcy5nYW1lcGFkQnV0dG9uQmluZGluZ3MubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0aWYgKHRoaXMuZ2FtZXBhZEJ1dHRvbkJpbmRpbmdzW2ldLm1hdGNoZXNHYW1lcGFkQnV0dG9uKGJ1dHRvbkNvZGUsIGdhbWVwYWRMb2NhdGlvbikpIHtcclxuXHRcdFx0XHRoYXNNYXRjaCA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5nYW1lcGFkQnV0dG9uQmluZGluZ3NbaV0uaXNBY3RpdmF0ZWQgPSBwcmVzc2VkU3RhdGU7XHJcblx0XHRcdFx0dGhpcy5nYW1lcGFkQnV0dG9uQmluZGluZ3NbaV0udmFsdWUgPSB2YWx1ZVN0YXRlO1xyXG5cclxuXHRcdFx0XHRpc0FjdGl2YXRlZCA9IGlzQWN0aXZhdGVkIHx8IHByZXNzZWRTdGF0ZTtcclxuXHRcdFx0XHRpZiAodmFsdWVTdGF0ZSA+IG5ld1ZhbHVlKSBuZXdWYWx1ZSA9IHZhbHVlU3RhdGU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBUT0RPOiBJIHRoaW5rIHRoaXMgd2lsbCBmYWlsIGlmIHR3byBidXR0b25zIGFyZSB1c2VkIGZvciB0aGUgc2FtZSBhY3Rpb247IHZhbHVlcyB3aWxsIGJlIG92ZXJ3cml0dGVuXHJcblxyXG5cdFx0aWYgKGhhc01hdGNoKSB7XHJcblx0XHRcdGlmIChpc0FjdGl2YXRlZCAmJiAhdGhpcy5nYW1lcGFkQnV0dG9uQWN0aXZhdGVkKSB0aGlzLnRpbWVMYXN0QWN0aXZhdGlvbiA9IERhdGUubm93KCk7XHJcblxyXG5cdFx0XHR0aGlzLmdhbWVwYWRCdXR0b25BY3RpdmF0ZWQgPSBpc0FjdGl2YXRlZDtcclxuXHRcdFx0dGhpcy5nYW1lcGFkQnV0dG9uVmFsdWUgPSBuZXdWYWx1ZTtcclxuXHJcblx0XHRcdGlmICghdGhpcy5nYW1lcGFkQnV0dG9uQWN0aXZhdGVkKSB0aGlzLmdhbWVwYWRCdXR0b25Db25zdW1lZCA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBQ0NFU1NPUiBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBnZXQgaWQoKTpzdHJpbmcge1xyXG5cdFx0cmV0dXJuIHRoaXMuX2lkO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCBhY3RpdmF0ZWQoKTpib29sZWFuIHtcclxuXHRcdHJldHVybiAoKHRoaXMua2V5Ym9hcmRBY3RpdmF0ZWQgJiYgIXRoaXMua2V5Ym9hcmRDb25zdW1lZCkgfHwgKHRoaXMuZ2FtZXBhZEJ1dHRvbkFjdGl2YXRlZCAmJiAhdGhpcy5nYW1lcGFkQnV0dG9uQ29uc3VtZWQpKSAmJiB0aGlzLmlzV2l0aGluVG9sZXJhbmNlVGltZSgpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGdldCB2YWx1ZSgpOm51bWJlciB7XHJcblx0XHRyZXR1cm4gdGhpcy5pc1dpdGhpblRvbGVyYW5jZVRpbWUoKSA/IE1hdGgubWF4KHRoaXMua2V5Ym9hcmRDb25zdW1lZCA/IDAgOiB0aGlzLmtleWJvYXJkVmFsdWUsIHRoaXMuZ2FtZXBhZEJ1dHRvbkNvbnN1bWVkID8gMCA6IHRoaXMuZ2FtZXBhZEJ1dHRvblZhbHVlKSA6IDA7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cdC8vIFBSSVZBVEUgSU5URVJGQUNFIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0cHJpdmF0ZSBiaW5kS2V5Ym9hcmQoa2V5Q29kZTpudW1iZXIsIGtleUxvY2F0aW9uOm51bWJlcik6dm9pZCB7XHJcblx0XHQvLyBUT0RPOiBjaGVjayBpZiBhbHJlYWR5IHByZXNlbnQ/XHJcblx0XHR0aGlzLmtleWJvYXJkQmluZGluZ3MucHVzaChuZXcgS2V5Ym9hcmRBY3Rpb25CaW5kaW5nKGtleUNvZGUsIGtleUxvY2F0aW9uKSk7XHJcblx0fVxyXG5cclxuXHRwcml2YXRlIGJpbmRHYW1lcGFkKGJ1dHRvbjp7aW5kZXg6bnVtYmVyfSwgZ2FtZXBhZExvY2F0aW9uOm51bWJlcik6dm9pZCB7XHJcblx0XHQvLyBUT0RPOiBjaGVjayBpZiBhbHJlYWR5IHByZXNlbnQ/XHJcblx0XHR0aGlzLmdhbWVwYWRCdXR0b25CaW5kaW5ncy5wdXNoKG5ldyBHYW1lcGFkQWN0aW9uQmluZGluZyhidXR0b24uaW5kZXgsIGdhbWVwYWRMb2NhdGlvbikpO1xyXG5cdH1cclxuXHJcblx0cHVibGljIGlzV2l0aGluVG9sZXJhbmNlVGltZSgpOmJvb2xlYW4ge1xyXG5cdFx0cmV0dXJuIHRoaXMudG9sZXJhbmNlVGltZSA8PSAwIHx8IHRoaXMudGltZUxhc3RBY3RpdmF0aW9uID49IERhdGUubm93KCkgLSB0aGlzLnRvbGVyYW5jZVRpbWU7XHJcblx0fVxyXG5cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=