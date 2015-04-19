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
            this._keyboardBindings = new Array();
            this._gamepadButtonBindings = new Array();
            this._activated = false;
            this._consumed = false;
            this._value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Action.prototype.addKeyboardBinding = function (keyCode, keyLocation) {
            if (keyCode === void 0) { keyCode = KeyActionBinder.KeyCodes.ANY; }
            if (keyLocation === void 0) { keyLocation = KeyActionBinder.KeyLocations.ANY; }
            // TODO: check if already present?
            this._keyboardBindings.push(new KAB.KeyboardBinding(keyCode, keyLocation));
        };
        Action.prototype.addGamepadButtonBinding = function (buttonCode, gamepadLocation) {
            if (buttonCode === void 0) { buttonCode = KeyActionBinder.GamepadButtons.ANY; }
            if (gamepadLocation === void 0) { gamepadLocation = KeyActionBinder.GamepadLocations.ANY; }
            // TODO: check if already present?
            this._gamepadButtonBindings.push(new KAB.GamepadButtonBinding(buttonCode, gamepadLocation));
        };
        Action.prototype.addGamepadBinding = function () {
            console.error("Action.addGamepadBinding() not implemented yet");
        };
        Action.prototype.consume = function () {
            if (this._activated)
                this._consumed = true;
        };
        Action.prototype.interpretKeyDown = function (keyCode, keyLocation) {
            for (var i = 0; i < this._keyboardBindings.length; i++) {
                if (!this._keyboardBindings[i].isActivated && this._keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                    // Activated
                    this._keyboardBindings[i].isActivated = true;
                    this._activated = true;
                }
            }
            this._value = this._activated ? 1 : 0;
        };
        Action.prototype.interpretKeyUp = function (keyCode, keyLocation) {
            var isActivated = false;
            for (var i = 0; i < this._keyboardBindings.length; i++) {
                if (this._keyboardBindings[i].isActivated && this._keyboardBindings[i].matchesKeyboardKey(keyCode, keyLocation)) {
                    // Deactivated
                    this._keyboardBindings[i].isActivated = false;
                }
                isActivated = isActivated || this._keyboardBindings[i].isActivated;
            }
            // TODO: also check gamepads for activation
            this._activated = isActivated;
            this._value = this._activated ? 1 : 0;
            if (this._activated)
                this._consumed = false; // TODO: make this more self-contained
        };
        Action.prototype.interpretGamepadButton = function (buttonCode, gamepadLocation, pressedState, valueState) {
            var isActivated = false;
            var newValue = 0;
            for (var i = 0; i < this._gamepadButtonBindings.length; i++) {
                if (this._gamepadButtonBindings[i].matchesGamepadButton(buttonCode, gamepadLocation)) {
                    this._gamepadButtonBindings[i].isActivated = pressedState;
                    this._gamepadButtonBindings[i].value = valueState;
                    isActivated = isActivated || pressedState;
                    if (valueState > newValue)
                        newValue = valueState;
                }
            }
            // TODO: combine this with keyboatd state
            this._activated = isActivated;
            this._value = newValue;
            if (this._activated)
                this._consumed = false; // TODO: make this more self-contained
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
                return this._activated && !this._consumed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "value", {
            get: function () {
                return this._value;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEJ1dHRvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQmluZGluZyIsIktBQi5LZXlib2FyZEJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZyIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQnV0dG9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5hZGRLZXlib2FyZEJpbmRpbmciLCJLQUIuQWN0aW9uLmFkZEdhbWVwYWRCdXR0b25CaW5kaW5nIiwiS0FCLkFjdGlvbi5hZGRHYW1lcGFkQmluZGluZyIsIktBQi5BY3Rpb24uY29uc3VtZSIsIktBQi5BY3Rpb24uaW50ZXJwcmV0S2V5RG93biIsIktBQi5BY3Rpb24uaW50ZXJwcmV0S2V5VXAiLCJLQUIuQWN0aW9uLmludGVycHJldEdhbWVwYWRCdXR0b24iLCJLQUIuQWN0aW9uLmlkIiwiS0FCLkFjdGlvbi5hY3RpdmF0ZWQiLCJLQUIuQWN0aW9uLnZhbHVlIiwiS2V5QWN0aW9uQmluZGVyIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN0cnVjdG9yIiwiS2V5QWN0aW9uQmluZGVyLnN0YXJ0IiwiS2V5QWN0aW9uQmluZGVyLnN0b3AiLCJLZXlBY3Rpb25CaW5kZXIuYWN0aW9uIiwiS2V5QWN0aW9uQmluZGVyLnVwZGF0ZSIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkRlYWN0aXZhdGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uVmFsdWVDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uRGV2aWNlc0NoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIub25SZWNlbnREZXZpY2VDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLmlzUnVubmluZyIsIktleUFjdGlvbkJpbmRlci5vbktleURvd24iLCJLZXlBY3Rpb25CaW5kZXIub25LZXlVcCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRBZGRlZCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRSZW1vdmVkIiwiS2V5QWN0aW9uQmluZGVyLnJlZnJlc2hHYW1lcGFkTGlzdCIsIktleUFjdGlvbkJpbmRlci5nZXRCb3VuZEZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFdBQVcsQ0FtRWpCO0FBbkVELFdBQU8sV0FBVztJQUFDQSxJQUFBQSxPQUFPQSxDQW1FekJBO0lBbkVrQkEsV0FBQUEsT0FBT0EsRUFBQ0EsQ0FBQ0E7UUFFM0JDLEFBR0FBOztXQURHQTtZQUNVQSxZQUFZQTtZQVl4QkMsbUhBQW1IQTtZQUNuSEEsbUhBQW1IQTtZQUVuSEEsU0FmWUEsWUFBWUE7Z0JBRXhCQyxxRUFBcUVBO2dCQUNyRUEsNkNBQTZD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UUFDVkEsTUFBTUEsRUFBRUEsRUFBRUE7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsSUFBSUEsRUFBRUEsRUFBRUE7UUFDUkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsTUFBTUEsRUFBRUEsRUFBRUE7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsSUFBSUEsRUFBRUEsRUFBRUE7UUFDUkEsV0FBV0EsRUFBRUEsR0FBR0E7UUFDaEJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFVBQVVBLEVBQUVBLEdBQUdBO1FBQ2ZBLGNBQWNBLEVBQUVBLEdBQUdBO1FBQ25CQSxhQUFhQSxFQUFFQSxHQUFHQTtRQUNsQkEsZUFBZUEsRUFBRUEsR0FBR0E7UUFDcEJBLGVBQWVBLEVBQUVBLEdBQUdBO1FBQ3BCQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxTQUFTQSxFQUFFQSxFQUFFQTtRQUNiQSxPQUFPQSxFQUFFQSxFQUFFQTtRQUNYQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxNQUFNQSxFQUFFQSxHQUFHQTtRQUNYQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxZQUFZQSxFQUFFQSxHQUFHQTtRQUNqQkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsV0FBV0EsRUFBRUEsR0FBR0E7UUFDaEJBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLFNBQVNBLEVBQUVBLEdBQUdBO1FBQ2RBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ05BLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEVBQUVBLEVBQUVBLEVBQUVBO1FBQ05BLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFdBQVdBLEVBQUVBLEVBQUVBO1FBQ2ZBLFlBQVlBLEVBQUVBLEVBQUVBO1FBQ2hCQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtLQUNMQSxDQUFDQTtJQUVZQSw0QkFBWUEsR0FBR0E7UUFDNUJBLEdBQUdBLEVBQUVBLFFBQVFBO1FBQ2JBLFFBQVFBLEVBQUVBLENBQUNBO1FBQ1hBLElBQUlBLEVBQUVBLENBQUNBO1FBQ1BBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ1JBLE1BQU1BLEVBQUVBLENBQUNBO0tBQ1RBLENBQUNBO0lBRVlBLGdDQUFnQkEsR0FBR0E7UUFDaENBLEdBQUdBLEVBQUVBLFFBQVFBO0tBQ2JBLENBQUNBO0lBRVlBLDhCQUFjQSxHQUFHQTtRQUM5QkEsR0FBR0EsRUFBRUEsUUFBUUE7UUFDYkEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDVEEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDVEEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDVEEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDVEEsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDaEJBLGNBQWNBLEVBQUVBLENBQUNBO1FBQ2pCQSxvQkFBb0JBLEVBQUVBLENBQUNBO1FBQ3ZCQSxxQkFBcUJBLEVBQUVBLENBQUNBO1FBQ3hCQSxNQUFNQSxFQUFFQSxDQUFDQTtRQUNUQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUNSQSxtQkFBbUJBLEVBQUVBLEVBQUVBO1FBQ3ZCQSxvQkFBb0JBLEVBQUVBLEVBQUVBO1FBQ3hCQSxPQUFPQSxFQUFFQSxFQUFFQTtRQUNYQSxVQUFVQSxFQUFFQSxFQUFFQTtRQUNkQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxTQUFTQSxFQUFFQSxFQUFFQTtLQUNiQSxDQUFDQTtJQUVZQSwyQkFBV0EsR0FBR0E7UUFDM0JBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7UUFDcEJBLGtCQUFrQkEsRUFBRUEsQ0FBQ0E7UUFDckJBLGtCQUFrQkEsRUFBRUEsQ0FBQ0E7UUFDckJBLG1CQUFtQkEsRUFBRUEsQ0FBQ0E7S0FDdEJBLENBQUFBO0lBc09GQSxzQkFBQ0E7QUFBREEsQ0F4WEEsQUF3WENBLElBQUEiLCJmaWxlIjoia2V5LWFjdGlvbi1iaW5kZXIuanMiLCJzb3VyY2VSb290IjoiRDovRHJvcGJveC93b3JrL2dpdHMva2V5LWFjdGlvbi1iaW5kZXItdHMvIiwic291cmNlc0NvbnRlbnQiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGxdfQ==