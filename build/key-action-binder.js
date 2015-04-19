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
            this._lastActivatedTime = 0;
            this.keyboardBindings = [];
            this.keyboardActivated = false;
            this.keyboardValue = 0;
            this.gamepadButtonBindings = [];
            this.gamepadButtonActivated = false;
            this.gamepadButtonValue = 0;
            this.consumed = false;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Action.prototype.addKeyboardBinding = function (keyCode, keyLocation) {
            if (keyCode === void 0) { keyCode = KeyActionBinder.KeyCodes.ANY; }
            if (keyLocation === void 0) { keyLocation = KeyActionBinder.KeyLocations.ANY; }
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardBinding(keyCode, keyLocation));
        };
        Action.prototype.addGamepadButtonBinding = function (buttonCode, gamepadLocation) {
            if (buttonCode === void 0) { buttonCode = KeyActionBinder.GamepadButtons.ANY; }
            if (gamepadLocation === void 0) { gamepadLocation = KeyActionBinder.GamepadLocations.ANY; }
            // TODO: check if already present?
            this.gamepadButtonBindings.push(new KAB.GamepadButtonBinding(buttonCode, gamepadLocation));
        };
        Action.prototype.addGamepadBinding = function () {
            console.error("Action.addGamepadBinding() not implemented yet");
        };
        Action.prototype.consume = function () {
            if (this.activated)
                this.consumed = true;
        };
        Action.prototype.interpretKeyDown = function (keyCode, keyLocation) {
            for (var i = 0; i < this.keyboardBindings.length; i++) {
                if (!this.keyboardBindings[i].isActivated && this.keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                    // Activated
                    this.keyboardBindings[i].isActivated = true;
                    this.keyboardActivated = true;
                    this.keyboardValue = 1;
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
                if (this.keyboardActivated)
                    this.consumed = false;
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
                this.gamepadButtonActivated = isActivated;
                this.gamepadButtonValue = newValue;
                if (this.gamepadButtonActivated)
                    this.consumed = false;
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
                return (this.keyboardActivated || this.gamepadButtonActivated) && !this.consumed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "value", {
            get: function () {
                return Math.max(this.keyboardValue, this.gamepadButtonValue);
            },
            enumerable: true,
            configurable: true
        });
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
        //gameInputDevices = new Vector.<GameInputDevice>();
        //gameInputDeviceIds = new Vector.<String>();
        //gameInputDeviceDefinitions = new Vector.<AutoGamepadInfo>();
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
    KeyActionBinder.prototype.action = function (id) {
        // Get an action, creating it if necessary
        if (!this.actions.hasOwnProperty(id)) {
            // Need to be created first!
            this.actions[id] = new KAB.Action(id);
        }
        return this.actions[id];
    };
    /**
     * Update the known state of all buttons/axis
     */
    KeyActionBinder.prototype.update = function () {
        // TODO: check controls to see if any has changed
        // TODO: move this outside? make it automatic (with requestAnimationFrame), or make it be called once per frame when any action is checked
        //console.time("check");
        // Check all buttons of all gamepads
        var gamepads = navigator.getGamepads();
        var gamepad;
        var i, j;
        var action;
        for (i = 0; i < gamepads.length; i++) {
            gamepad = gamepads[i];
            if (gamepad != null) {
                for (var iis in this.actions) {
                    // Interpret all buttons
                    action = this.actions[iis];
                    for (j = 0; j < gamepad.buttons.length; j++) {
                        //if (j == KeyActionBinder.GamepadButtons.PAD_LEFT) console.log("interpreting ", j, "/", gamepad.buttons.length, i, gamepad.buttons[j].pressed, gamepad.buttons[j].value);
                        action.interpretGamepadButton(j, i, gamepad.buttons[j].pressed, gamepad.buttons[j].value);
                    }
                }
            }
        }
        //console.timeEnd("check");
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
    KeyActionBinder.prototype.refreshGamepadList = function () {
        // The list of game devices has changed
        // TODO: implement _maintainPlayerPositions ? Apparently the browser already does something like that...
        console.log("List of gamepads refreshed, new list = " + navigator.getGamepads().length + " items");
        // Dispatch the signal
        this._onDevicesChanged.dispatch();
    };
    /**
     * Utility function: creates a function bound to "this". This is needed because the same reference needs to be used when removing listeners.
     */
    KeyActionBinder.prototype.getBoundFunction = function (func) {
        if (!this.bindCache.hasOwnProperty(func)) {
            this.bindCache[func] = func.bind(this);
        }
        return this.bindCache[func];
    };
    // Constants
    KeyActionBinder.VERSION = "0.0.0";
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
        WINDOW_LEFT: 91,
        WINDOW_RIGHT: 92,
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
        FACE_1: 0,
        FACE_2: 1,
        FACE_3: 2,
        FACE_4: 3,
        LEFT_SHOULDER: 4,
        RIGHT_SHOULDER: 5,
        LEFT_SHOULDER_BOTTOM: 6,
        RIGHT_SHOULDER_BOTTOM: 7,
        SELECT: 8,
        START: 9,
        LEFT_ANALOGUE_STICK: 10,
        RIGHT_ANALOGUE_STICK: 11,
        PAD_TOP: 12,
        PAD_BOTTOM: 13,
        PAD_LEFT: 14,
        PAD_RIGHT: 15
    };
    KeyActionBinder.GamepadAxes = {
        LEFT_ANALOGUE_HOR: 0,
        LEFT_ANALOGUE_VERT: 1,
        RIGHT_ANALOGUE_HOR: 2,
        RIGHT_ANALOGUE_VERT: 3
    };
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEJ1dHRvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQmluZGluZyIsIktBQi5LZXlib2FyZEJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZyIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5hZGRLZXlib2FyZEJpbmRpbmciLCJLQUIuQWN0aW9uLmFkZEdhbWVwYWRCdXR0b25CaW5kaW5nIiwiS0FCLkFjdGlvbi5hZGRHYW1lcGFkQmluZGluZyIsIktBQi5BY3Rpb24uY29uc3VtZSIsIktBQi5BY3Rpb24uaW50ZXJwcmV0S2V5RG93biIsIktBQi5BY3Rpb24uaW50ZXJwcmV0S2V5VXAiLCJLQUIuQWN0aW9uLmludGVycHJldEdhbWVwYWRCdXR0b24iLCJLQUIuQWN0aW9uLmlkIiwiS0FCLkFjdGlvbi5hY3RpdmF0ZWQiLCJLQUIuQWN0aW9uLnZhbHVlIiwiS2V5QWN0aW9uQmluZGVyIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN0cnVjdG9yIiwiS2V5QWN0aW9uQmluZGVyLnN0YXJ0IiwiS2V5QWN0aW9uQmluZGVyLnN0b3AiLCJLZXlBY3Rpb25CaW5kZXIuYWN0aW9uIiwiS2V5QWN0aW9uQmluZGVyLnVwZGF0ZSIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkRlYWN0aXZhdGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uVmFsdWVDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uRGV2aWNlc0NoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIub25SZWNlbnREZXZpY2VDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLmlzUnVubmluZyIsIktleUFjdGlvbkJpbmRlci5vbktleURvd24iLCJLZXlBY3Rpb25CaW5kZXIub25LZXlVcCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRBZGRlZCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRSZW1vdmVkIiwiS2V5QWN0aW9uQmluZGVyLnJlZnJlc2hHYW1lcGFkTGlzdCIsIktleUFjdGlvbkJpbmRlci5nZXRCb3VuZEZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFdBQVcsQ0FtRWpCO0FBbkVELFdBQU8sV0FBVztJQUFDQSxJQUFBQSxPQUFPQSxDQW1FekJBO0lBbkVrQkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7UUFFM0JDLEFBR0FBOztXQURHQTtZQUNVQSxZQUFZQTtZQVl4QkMsbUhBQW1IQTtZQUNuSEEsbUhBQW1IQTtZQUVuSEEsU0FmWUEsWUFBWUE7Z0JBRXhCQyxxRUFBcUVBO2dCQUNyRUEsNkNBQTZD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QUFFQSxFQUFFQTtRQUNQQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxTQUFTQSxFQUFFQSxHQUFHQTtRQUNkQSxTQUFTQSxFQUFFQSxHQUFHQTtRQUNkQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUNaQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxTQUFTQSxFQUFFQSxFQUFFQTtRQUNiQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxJQUFJQSxFQUFFQSxFQUFFQTtRQUNSQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxJQUFJQSxFQUFFQSxFQUFFQTtRQUNSQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxHQUFHQSxFQUFFQSxFQUFFQTtRQUNQQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxHQUFHQSxFQUFFQSxHQUFHQTtRQUNSQSxHQUFHQSxFQUFFQSxHQUFHQTtRQUNSQSxHQUFHQSxFQUFFQSxHQUFHQTtRQUNSQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxFQUFFQSxFQUFFQSxHQUFHQTtRQUNQQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxJQUFJQSxFQUFFQSxFQUFFQTtRQUNSQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxJQUFJQSxFQUFFQSxFQUFFQTtRQUNSQSxXQUFXQSxFQUFFQSxHQUFHQTtRQUNoQkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsRUFBRUE7UUFDWkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsVUFBVUEsRUFBRUEsR0FBR0E7UUFDZkEsY0FBY0EsRUFBRUEsR0FBR0E7UUFDbkJBLGFBQWFBLEVBQUVBLEdBQUdBO1FBQ2xCQSxlQUFlQSxFQUFFQSxHQUFHQTtRQUNwQkEsZUFBZUEsRUFBRUEsR0FBR0E7UUFDcEJBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLE9BQU9BLEVBQUVBLEVBQUVBO1FBQ1hBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLE1BQU1BLEVBQUVBLEdBQUdBO1FBQ1hBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLFlBQVlBLEVBQUVBLEdBQUdBO1FBQ2pCQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxXQUFXQSxFQUFFQSxHQUFHQTtRQUNoQkEsTUFBTUEsRUFBRUEsRUFBRUE7UUFDVkEsU0FBU0EsRUFBRUEsR0FBR0E7UUFDZEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDTkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsRUFBRUEsRUFBRUEsRUFBRUE7UUFDTkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsV0FBV0EsRUFBRUEsRUFBRUE7UUFDZkEsWUFBWUEsRUFBRUEsRUFBRUE7UUFDaEJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO0tBQ0xBLENBQUNBO0lBRVlBLDRCQUFZQSxHQUFHQTtRQUM1QkEsR0FBR0EsRUFBRUEsUUFBUUE7UUFDYkEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDWEEsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDUEEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDUkEsTUFBTUEsRUFBRUEsQ0FBQ0E7S0FDVEEsQ0FBQ0E7SUFFWUEsZ0NBQWdCQSxHQUFHQTtRQUNoQ0EsR0FBR0EsRUFBRUEsUUFBUUE7S0FDYkEsQ0FBQ0E7SUFFWUEsOEJBQWNBLEdBQUdBO1FBQzlCQSxHQUFHQSxFQUFFQSxRQUFRQTtRQUNiQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNUQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNUQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNUQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNUQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNoQkEsY0FBY0EsRUFBRUEsQ0FBQ0E7UUFDakJBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7UUFDdkJBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7UUFDeEJBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ1RBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ1JBLG1CQUFtQkEsRUFBRUEsRUFBRUE7UUFDdkJBLG9CQUFvQkEsRUFBRUEsRUFBRUE7UUFDeEJBLE9BQU9BLEVBQUVBLEVBQUVBO1FBQ1hBLFVBQVVBLEVBQUVBLEVBQUVBO1FBQ2RBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFNBQVNBLEVBQUVBLEVBQUVBO0tBQ2JBLENBQUNBO0lBRVlBLDJCQUFXQSxHQUFHQTtRQUMzQkEsaUJBQWlCQSxFQUFFQSxDQUFDQTtRQUNwQkEsa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUNyQkEsa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUNyQkEsbUJBQW1CQSxFQUFFQSxDQUFDQTtLQUN0QkEsQ0FBQUE7SUF1T0ZBLHNCQUFDQTtBQUFEQSxDQXpYQSxBQXlYQ0EsSUFBQSIsImZpbGUiOiJrZXktYWN0aW9uLWJpbmRlci5qcyIsInNvdXJjZVJvb3QiOiJEOi9Ecm9wYm94L3dvcmsvZ2l0cy9rZXktYWN0aW9uLWJpbmRlci10cy8iLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbF19