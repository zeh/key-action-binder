var zehfernando;
(function (zehfernando) {
    var signals;
    (function (signals) {
        /**
         * @author zeh fernando
         */
        var SimpleSignal = (function () {
            // ================================================================================================================
            // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
            function SimpleSignal() {
                // Super-simple signals class inspired by Robert Penner's AS3Signals:
                // http://github.com/robertpenner/as3-signals
                // Properties
                this.functions = [];
            }
            // ================================================================================================================
            // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
            SimpleSignal.prototype.add = function (func) {
                if (this.functions.indexOf(func) == -1) {
                    this.functions.push(func);
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.remove = function (func) {
                this.ifr = this.functions.indexOf(func);
                if (this.ifr > -1) {
                    this.functions.splice(this.ifr, 1);
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.removeAll = function () {
                if (this.functions.length > 0) {
                    this.functions.length = 0;
                    return true;
                }
                return false;
            };
            SimpleSignal.prototype.dispatch = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var functionsDuplicate = this.functions.concat();
                for (var i = 0; i < functionsDuplicate.length; i++) {
                    functionsDuplicate[i].apply(undefined, args);
                }
            };
            Object.defineProperty(SimpleSignal.prototype, "numItems", {
                // ================================================================================================================
                // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
                get: function () {
                    return this.functions.length;
                },
                enumerable: true,
                configurable: true
            });
            return SimpleSignal;
        })();
        signals.SimpleSignal = SimpleSignal;
    })(signals = zehfernando.signals || (zehfernando.signals = {}));
})(zehfernando || (zehfernando = {}));
/// <reference path="KeyActionBinder.ts" />
var KAB;
(function (KAB) {
    /**
     * Information on a keyboard event filter
     */
    var KeyboardBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function KeyboardBinding(keyCode, keyLocation) {
            this.keyCode = keyCode;
            this.keyLocation = keyLocation;
            this.isActivated = false;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        // TODO: add modifiers?
        KeyboardBinding.prototype.matchesKeyboardKey = function (keyCode, keyLocation) {
            return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KeyCodes.ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KeyLocations.ANY);
        };
        return KeyboardBinding;
    })();
    KAB.KeyboardBinding = KeyboardBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyActionBinder.ts" />
var KAB;
(function (KAB) {
    /**
     * Information on a gamepad event filter
     */
    var GamepadButtonBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function GamepadButtonBinding(buttonCode, gamepadLocation) {
            this.buttonCode = buttonCode;
            this.gamepadLocation = gamepadLocation;
            this.isActivated = false;
            this.value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        GamepadButtonBinding.prototype.matchesGamepadButton = function (buttonCode, gamepadLocation) {
            return (this.buttonCode == buttonCode || this.buttonCode == KeyActionBinder.GamepadButtons.ANY) && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
        };
        return GamepadButtonBinding;
    })();
    KAB.GamepadButtonBinding = GamepadButtonBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyboardBinding.ts" />
/// <reference path="GamepadButtonBinding.ts" />
var KAB;
(function (KAB) {
    /**
     * Information linking an action to a binding, and whether it's activated
     */
    var Action = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function Action(id) {
            this._id = id;
            this.lastActivatedTime = 0;
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
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Action.prototype.addKeyboardBinding = function (keyCode, keyLocation) {
            if (keyCode === void 0) { keyCode = KeyActionBinder.KeyCodes.ANY; }
            if (keyLocation === void 0) { keyLocation = KeyActionBinder.KeyLocations.ANY; }
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardBinding(keyCode, keyLocation));
            return this;
        };
        Action.prototype.addGamepadButtonBinding = function (buttonCode, gamepadLocation) {
            if (buttonCode === void 0) { buttonCode = KeyActionBinder.GamepadButtons.ANY; }
            if (gamepadLocation === void 0) { gamepadLocation = KeyActionBinder.GamepadLocations.ANY; }
            // TODO: check if already present?
            this.gamepadButtonBindings.push(new KAB.GamepadButtonBinding(buttonCode, gamepadLocation));
            return this;
        };
        Action.prototype.setTolerance = function (timeInSeconds) {
            this.toleranceTime = timeInSeconds * 1000;
            return this;
        };
        Action.prototype.consume = function () {
            if (this.keyboardActivated)
                this.keyboardConsumed = true;
            if (this.gamepadButtonActivated)
                this.gamepadButtonConsumed = true;
        };
        Action.prototype.interpretKeyDown = function (keyCode, keyLocation) {
            for (var i = 0; i < this.keyboardBindings.length; i++) {
                if (!this.keyboardBindings[i].isActivated && this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                    // Activated
                    this.keyboardBindings[i].isActivated = true;
                    this.keyboardActivated = true;
                    this.keyboardValue = 1;
                    this.lastActivatedTime = Date.now();
                }
            }
        };
        Action.prototype.interpretKeyUp = function (keyCode, keyLocation) {
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
        };
        Action.prototype.interpretGamepadButton = function (buttonCode, gamepadLocation, pressedState, valueState) {
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
            if (hasMatch) {
                if (isActivated && !this.gamepadButtonActivated)
                    this.lastActivatedTime = Date.now();
                this.gamepadButtonActivated = isActivated;
                this.gamepadButtonValue = newValue;
                if (!this.gamepadButtonActivated)
                    this.gamepadButtonConsumed = false;
            }
        };
        Object.defineProperty(Action.prototype, "id", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "activated", {
            get: function () {
                return ((this.keyboardActivated && !this.keyboardConsumed) || (this.gamepadButtonActivated && !this.gamepadButtonConsumed)) && this.isWithinToleranceTime();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "value", {
            get: function () {
                return this.isWithinToleranceTime() ? Math.max(this.keyboardConsumed ? 0 : this.keyboardValue, this.gamepadButtonConsumed ? 0 : this.gamepadButtonValue) : 0;
            },
            enumerable: true,
            configurable: true
        });
        // ================================================================================================================
        // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
        Action.prototype.isWithinToleranceTime = function () {
            return this.toleranceTime <= 0 || this.lastActivatedTime >= Date.now() - this.toleranceTime;
        };
        return Action;
    })();
    KAB.Action = Action;
})(KAB || (KAB = {}));
/// <reference path="./../definitions/gamepad.d.ts" />
/// <reference path="./../libs/signals/SimpleSignal.ts" />
/// <reference path="Action.ts" />
/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
var KeyActionBinder = (function () {
    // TODO:
    // * Check navigator.getGamepads to see if gamepads are actually accessible
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function KeyActionBinder() {
        this.bindCache = {};
        this._isRunning = false;
        this._maintainPlayerPositions = false;
        this.actions = {};
        this._onActionActivated = new zehfernando.signals.SimpleSignal();
        this._onActionDeactivated = new zehfernando.signals.SimpleSignal();
        this._onActionValueChanged = new zehfernando.signals.SimpleSignal();
        this._onDevicesChanged = new zehfernando.signals.SimpleSignal();
        this._onRecentDeviceChanged = new zehfernando.signals.SimpleSignal();
        this.currentFrame = 0;
        this.lastFrameGamepadsChecked = 0;
        this.start();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    /**
     * Starts listening for input events.
     *
     * <p>This happens by default when a KeyActionBinder object is instantiated; this method is only useful if
     * called after <code>stop()</code> has been used.</p>
     *
     * <p>Calling this method when a KeyActionBinder instance is already running has no effect.</p>
     *
     * @see #isRunning
     * @see #stop()
     */
    KeyActionBinder.prototype.start = function () {
        if (!this._isRunning) {
            // Starts listening to keyboard events
            window.addEventListener("keydown", this.getBoundFunction(this.onKeyDown));
            //window.addEventListener("keypress", this.getBoundFunction(this.onKeyDown)); // this fires with completely unrelated key codes; TODO: investigate why
            window.addEventListener("keyup", this.getBoundFunction(this.onKeyUp));
            // Starts listening to device change events
            window.addEventListener("gamepadconnected", this.getBoundFunction(this.onGamepadAdded));
            window.addEventListener("gamepaddisconnected", this.getBoundFunction(this.onGamepadRemoved));
            this.refreshGamepadList();
            this._isRunning = true;
            this.incrementFrameCount();
        }
    };
    /**
     * Stops listening for input events.
     *
     * <p>Action bindings are not lost when a KeyActionBinder instance is stopped; it merely starts ignoring
     * all input events, until <code>start()<code> is called again.</p>
     *
     * <p>This method should always be called when you don't need a KeyActionBinder instance anymore, otherwise
     * it'll be listening to events indefinitely.</p>
     *
     * <p>Calling this method when this a KeyActionBinder instance is already stopped has no effect.</p>
     *
     * @see #isRunning
     * @see #start()
     */
    KeyActionBinder.prototype.stop = function () {
        if (this._isRunning) {
            // Stops listening to keyboard events
            window.removeEventListener("keydown", this.getBoundFunction(this.onKeyDown));
            window.removeEventListener("keyup", this.getBoundFunction(this.onKeyUp));
            // Stops listening to device change events
            window.removeEventListener("gamepadconnected", this.getBoundFunction(this.onGamepadAdded));
            window.removeEventListener("gamepaddisconnected", this.getBoundFunction(this.onGamepadRemoved));
            this._isRunning = false;
        }
    };
    /**
     * Gets an action instance, creating it if necessary
     */
    KeyActionBinder.prototype.action = function (id) {
        // Get an action, creating it if necessary
        if (this.lastFrameGamepadsChecked < this.currentFrame) {
            // Need to re-check gamepad state
            this.updateGamepadsState();
        }
        if (!this.actions.hasOwnProperty(id)) {
            // Need to be created first!
            this.actions[id] = new KAB.Action(id);
        }
        return this.actions[id];
    };
    Object.defineProperty(KeyActionBinder.prototype, "onActionActivated", {
        // ================================================================================================================
        // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
        get: function () {
            return this._onActionActivated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyActionBinder.prototype, "onActionDeactivated", {
        get: function () {
            return this._onActionDeactivated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyActionBinder.prototype, "onActionValueChanged", {
        get: function () {
            return this._onActionValueChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyActionBinder.prototype, "onDevicesChanged", {
        get: function () {
            return this._onDevicesChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyActionBinder.prototype, "onRecentDeviceChanged", {
        get: function () {
            return this._onRecentDeviceChanged;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(KeyActionBinder.prototype, "isRunning", {
        /**
         * Whether this KeyActionBinder instance is running, or not. This property is read-only.
         *
         * @see #start()
         * @see #stop()
         */
        get: function () {
            return this._isRunning;
        },
        enumerable: true,
        configurable: true
    });
    // ================================================================================================================
    // EVENT INTERFACE ------------------------------------------------------------------------------------------------
    KeyActionBinder.prototype.onKeyDown = function (e) {
        for (var iis in this.actions) {
            this.actions[iis].interpretKeyDown(e.keyCode, e.location);
        }
    };
    KeyActionBinder.prototype.onKeyUp = function (e) {
        for (var iis in this.actions) {
            this.actions[iis].interpretKeyUp(e.keyCode, e.location);
        }
    };
    KeyActionBinder.prototype.onGamepadAdded = function (e) {
        this.refreshGamepadList();
    };
    KeyActionBinder.prototype.onGamepadRemoved = function (e) {
        this.refreshGamepadList();
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    KeyActionBinder.prototype.incrementFrameCount = function () {
        if (this._isRunning) {
            this.currentFrame++;
            window.requestAnimationFrame(this.incrementFrameCount.bind(this));
        }
    };
    /**
     * Update the known state of all buttons/axis
     */
    KeyActionBinder.prototype.updateGamepadsState = function () {
        //console.time("check");
        // Check all buttons of all gamepads
        var gamepads = navigator.getGamepads();
        var gamepad;
        var i, j;
        var action;
        var buttons;
        var l;
        for (i = 0; i < gamepads.length; i++) {
            gamepad = gamepads[i];
            if (gamepad != null) {
                for (var iis in this.actions) {
                    // ...interpret all buttons
                    action = this.actions[iis];
                    buttons = gamepad.buttons;
                    l = buttons.length;
                    for (j = 0; j < l; j++) {
                        action.interpretGamepadButton(j, i, buttons[j].pressed, buttons[j].value);
                    }
                }
            }
        }
        this.lastFrameGamepadsChecked = this.currentFrame;
        //console.timeEnd("check");
    };
    KeyActionBinder.prototype.refreshGamepadList = function () {
        // The list of game devices has changed
        // TODO: implement _maintainPlayerPositions ? Apparently the browser already does something like that...
        console.log("List of gamepads refreshed, new list = " + navigator.getGamepads().length + " items");
        // Dispatch the signal
        this._onDevicesChanged.dispatch();
    };
    /**
     * Utility function: creates a function bound to "this".
     * This needs to be stored because the same reference needs to be used when removing listeners.
     */
    KeyActionBinder.prototype.getBoundFunction = function (func) {
        if (!this.bindCache.hasOwnProperty(func)) {
            this.bindCache[func] = func.bind(this);
        }
        return this.bindCache[func];
    };
    // Constants
    KeyActionBinder.VERSION = "1.0.0";
    // Enums (Internal)
    KeyActionBinder.KeyCodes = {
        ANY: 81653812,
        A: 65,
        ALT: 18,
        B: 66,
        BACKQUOTE: 192,
        BACKSLASH: 220,
        BACKSPACE: 8,
        C: 67,
        CAPS_LOCK: 20,
        COMMA: 188,
        CTRL: 17,
        D: 68,
        DELETE: 46,
        DOWN: 40,
        E: 69,
        END: 35,
        ENTER: 13,
        EQUAL: 187,
        ESCAPE: 27,
        F: 70,
        F1: 112,
        F10: 121,
        F11: 122,
        F12: 123,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        G: 71,
        H: 72,
        HOME: 36,
        I: 73,
        INSERT: 45,
        J: 74,
        K: 75,
        L: 76,
        LEFT: 37,
        LEFTBRACKET: 219,
        M: 77,
        MINUS: 189,
        N: 78,
        NUMBER_0: 48,
        NUMBER_1: 49,
        NUMBER_2: 50,
        NUMBER_3: 51,
        NUMBER_4: 52,
        NUMBER_5: 53,
        NUMBER_6: 54,
        NUMBER_7: 55,
        NUMBER_8: 56,
        NUMBER_9: 57,
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        NUM_LOCK: 144,
        O: 79,
        P: 80,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PAUSE: 19,
        PERIOD: 190,
        Q: 81,
        QUOTE: 222,
        R: 82,
        RIGHT: 39,
        RIGHTBRACKET: 221,
        S: 83,
        SCROLL_LOCK: 145,
        SELECT: 93,
        SEMICOLON: 186,
        SHIFT: 16,
        SLASH: 191,
        SPACE: 32,
        T: 84,
        TAB: 9,
        U: 85,
        UP: 38,
        V: 86,
        W: 87,
        WINDOWS_LEFT: 91,
        WINDOWS_RIGHT: 92,
        X: 88,
        Y: 89,
        Z: 90
    };
    KeyActionBinder.KeyLocations = {
        ANY: 81653813,
        STANDARD: 0,
        LEFT: 1,
        RIGHT: 2,
        NUMPAD: 3,
    };
    KeyActionBinder.GamepadLocations = {
        ANY: 81653814,
    };
    KeyActionBinder.GamepadButtons = {
        ANY: 81653815,
        ACTION_DOWN: 0,
        ACTION_RIGHT: 1,
        ACTION_LEFT: 2,
        ACTION_UP: 3,
        LEFT_SHOULDER: 4,
        RIGHT_SHOULDER: 5,
        LEFT_SHOULDER_BOTTOM: 6,
        RIGHT_SHOULDER_BOTTOM: 7,
        SELECT: 8,
        START: 9,
        STICK_LEFT_PRESS: 10,
        STICK_RIGHT_PRESS: 11,
        DPAD_UP: 12,
        DPAD_DOWN: 13,
        DPAD_LEFT: 14,
        DPAD_RIGHT: 15
    };
    KeyActionBinder.GamepadAxes = {
        STICK_LEFT_X: 0,
        STICK_LEFT_Y: 1,
        STICK_RIGHT_X: 2,
        STICK_RIGHT_Y: 3
    };
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEJ1dHRvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQmluZGluZyIsIktBQi5LZXlib2FyZEJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZyIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5hZGRLZXlib2FyZEJpbmRpbmciLCJLQUIuQWN0aW9uLmFkZEdhbWVwYWRCdXR0b25CaW5kaW5nIiwiS0FCLkFjdGlvbi5zZXRUb2xlcmFuY2UiLCJLQUIuQWN0aW9uLmNvbnN1bWUiLCJLQUIuQWN0aW9uLmludGVycHJldEtleURvd24iLCJLQUIuQWN0aW9uLmludGVycHJldEtleVVwIiwiS0FCLkFjdGlvbi5pbnRlcnByZXRHYW1lcGFkQnV0dG9uIiwiS0FCLkFjdGlvbi5pZCIsIktBQi5BY3Rpb24uYWN0aXZhdGVkIiwiS0FCLkFjdGlvbi52YWx1ZSIsIktBQi5BY3Rpb24uaXNXaXRoaW5Ub2xlcmFuY2VUaW1lIiwiS2V5QWN0aW9uQmluZGVyIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN0cnVjdG9yIiwiS2V5QWN0aW9uQmluZGVyLnN0YXJ0IiwiS2V5QWN0aW9uQmluZGVyLnN0b3AiLCJLZXlBY3Rpb25CaW5kZXIuYWN0aW9uIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uQWN0aXZhdGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uRGVhY3RpdmF0ZWQiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25WYWx1ZUNoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIub25EZXZpY2VzQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5vblJlY2VudERldmljZUNoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIuaXNSdW5uaW5nIiwiS2V5QWN0aW9uQmluZGVyLm9uS2V5RG93biIsIktleUFjdGlvbkJpbmRlci5vbktleVVwIiwiS2V5QWN0aW9uQmluZGVyLm9uR2FtZXBhZEFkZGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uR2FtZXBhZFJlbW92ZWQiLCJLZXlBY3Rpb25CaW5kZXIuaW5jcmVtZW50RnJhbWVDb3VudCIsIktleUFjdGlvbkJpbmRlci51cGRhdGVHYW1lcGFkc1N0YXRlIiwiS2V5QWN0aW9uQmluZGVyLnJlZnJlc2hHYW1lcGFkTGlzdCIsIktleUFjdGlvbkJpbmRlci5nZXRCb3VuZEZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFdBQVcsQ0FtRWpCO0FBbkVELFdBQU8sV0FBVztJQUFDQSxJQUFBQSxPQUFPQSxDQW1FekJBO0lBbkVrQkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7UUFFM0JDLEFBR0FBOztXQURHQTtZQUNVQSxZQUFZ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LEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLEVBQUVBO1FBQ1BBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxVQUFVQSxFQUFFQSxHQUFHQTtRQUNmQSxjQUFjQSxFQUFFQSxHQUFHQTtRQUNuQkEsYUFBYUEsRUFBRUEsR0FBR0E7UUFDbEJBLGVBQWVBLEVBQUVBLEdBQUdBO1FBQ3BCQSxlQUFlQSxFQUFFQSxHQUFHQTtRQUNwQkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsU0FBU0EsRUFBRUEsRUFBRUE7UUFDYkEsT0FBT0EsRUFBRUEsRUFBRUE7UUFDWEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsTUFBTUEsRUFBRUEsR0FBR0E7UUFDWEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsWUFBWUEsRUFBRUEsR0FBR0E7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxTQUFTQSxFQUFFQSxHQUFHQTtRQUNkQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxFQUFFQSxFQUFFQSxFQUFFQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxZQUFZQSxFQUFFQSxFQUFFQTtRQUNoQkEsYUFBYUEsRUFBRUEsRUFBRUE7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO0tBQ0xBLENBQUNBO0lBRVlBLDRCQUFZQSxHQUFHQTtRQUM1QkEsR0FBR0EsRUFBRUEsUUFBUUE7UUFDYkEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDWEEsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDUEEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDUkEsTUFBTUEsRUFBRUEsQ0FBQ0E7S0FDVEEsQ0FBQ0E7SUFFWUEsZ0NBQWdCQSxHQUFHQTtRQUNoQ0EsR0FBR0EsRUFBRUEsUUFBUUE7S0FDYkEsQ0FBQ0E7SUFFWUEsOEJBQWNBLEdBQUdBO1FBQzlCQSxHQUFHQSxFQUFFQSxRQUFRQTtRQUNiQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNkQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNmQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNkQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUNaQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNoQkEsY0FBY0EsRUFBRUEsQ0FBQ0E7UUFDakJBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7UUFDdkJBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7UUFDeEJBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ1RBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ1JBLGdCQUFnQkEsRUFBRUEsRUFBRUE7UUFDcEJBLGlCQUFpQkEsRUFBRUEsRUFBRUE7UUFDckJBLE9BQU9BLEVBQUVBLEVBQUVBO1FBQ1hBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLFVBQVVBLEVBQUVBLEVBQUVBO0tBQ2RBLENBQUNBO0lBRVlBLDJCQUFXQSxHQUFHQTtRQUMzQkEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDZkEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDZkEsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDaEJBLGFBQWFBLEVBQUVBLENBQUNBO0tBQ2hCQSxDQUFBQTtJQTZQRkEsc0JBQUNBO0FBQURBLENBL1lBLEFBK1lDQSxJQUFBIiwiZmlsZSI6ImtleS1hY3Rpb24tYmluZGVyLmpzIiwic291cmNlUm9vdCI6IkQ6L0Ryb3Bib3gvd29yay9naXRzL2tleS1hY3Rpb24tYmluZGVyLXRzLyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXX0=