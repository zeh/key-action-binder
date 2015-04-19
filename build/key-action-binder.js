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
            return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KEY_CODE_ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KEY_LOCATION_ANY);
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
    var GamepadBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function GamepadBinding(controlId, gamepadIndex) {
            this.controlId = controlId;
            this.gamepadIndex = gamepadIndex;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        GamepadBinding.prototype.matchesKeyboardKey = function (keyCode, keyLocation) {
            return false;
        };
        GamepadBinding.prototype.matchesGamepadControl = function (controlId, gamepadIndex) {
            return this.controlId == controlId && (this.gamepadIndex == gamepadIndex || this.gamepadIndex == KeyActionBinder.GAMEPAD_INDEX_ANY);
        };
        return GamepadBinding;
    })();
    KAB.GamepadBinding = GamepadBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyboardBinding.ts" />
/// <reference path="GamepadBinding.ts" />
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
            this._gamepadBindings = new Array();
            this._activated = false;
            this._consumed = false;
            this._value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Action.prototype.addKeyboardBinding = function (keyCode, keyLocation) {
            if (keyCode === void 0) { keyCode = KeyActionBinder.KEY_CODE_ANY; }
            if (keyLocation === void 0) { keyLocation = KeyActionBinder.KEY_LOCATION_ANY; }
            // TODO: check if already present?
            this._keyboardBindings.push(new KAB.KeyboardBinding(keyCode, keyLocation));
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
        this.gameInputDevices = [];
        this.gameInputDeviceIds = [];
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
            window.addEventListener("keyup", this.getBoundFunction(this.onKeyUp));
            // Starts listening to device change events
            window.addEventListener("gamepadconnected", this.getBoundFunction(this.onGameInputDeviceAdded));
            window.addEventListener("gamepaddisconnected", this.getBoundFunction(this.onGameInputDeviceRemoved));
            this.refreshGameInputDeviceList();
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
            window.removeEventListener("gamepadconnected", this.getBoundFunction(this.onGameInputDeviceAdded));
            window.removeEventListener("gamepaddisconnected", this.getBoundFunction(this.onGameInputDeviceRemoved));
            //gameInputDevices.length = 0;
            //gameInputDeviceDefinitions.length = 0;
            //removeGameInputDeviceEvents();
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
        // Check all buttons of all gamepads
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
    KeyActionBinder.prototype.onGameInputDeviceAdded = function (e) {
        console.error("NOT IMPLEMENTED: onGameInputDeviceAdded");
    };
    KeyActionBinder.prototype.onGameInputDeviceRemoved = function (e) {
        console.error("NOT IMPLEMENTED: onGameInputDeviceRemoved");
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    KeyActionBinder.prototype.refreshGameInputDeviceList = function () {
        // The list of game devices has changed
        if (false) {
        }
        else {
            // Full refresh: create a new list of devices
            var gamepads = navigator.getGamepads();
            this.gameInputDevices.length = gamepads.length;
            this.gameInputDeviceIds.length = gamepads.length;
            for (var i = 0; i < gamepads.length; i++) {
                if (this.gameInputDevices[i] != null) {
                    this.gameInputDevices[i] = gamepads[i];
                    this.gameInputDeviceIds[i] = gamepads[i].id;
                }
                else {
                    this.gameInputDeviceIds[i] = null;
                }
            }
        }
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
    //public static const KEYBOARD_DEVICE:GameInputDevice = null;		// Set to null by default, since gamepads are non-null (and you can't create/subclass a GameInputDevice)
    KeyActionBinder.GAMEPAD_INDEX_ANY = 81653811;
    KeyActionBinder.KEY_CODE_ANY = 81653812;
    KeyActionBinder.KEY_LOCATION_ANY = 81653813;
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQmluZGluZyIsIktBQi5LZXlib2FyZEJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQmluZGluZyIsIktBQi5HYW1lcGFkQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQmluZGluZy5tYXRjaGVzS2V5Ym9hcmRLZXkiLCJLQUIuR2FtZXBhZEJpbmRpbmcubWF0Y2hlc0dhbWVwYWRDb250cm9sIiwiS0FCLkFjdGlvbiIsIktBQi5BY3Rpb24uY29uc3RydWN0b3IiLCJLQUIuQWN0aW9uLmFkZEtleWJvYXJkQmluZGluZyIsIktBQi5BY3Rpb24uYWRkR2FtZXBhZEJpbmRpbmciLCJLQUIuQWN0aW9uLmNvbnN1bWUiLCJLQUIuQWN0aW9uLmludGVycHJldEtleURvd24iLCJLQUIuQWN0aW9uLmludGVycHJldEtleVVwIiwiS0FCLkFjdGlvbi5pZCIsIktBQi5BY3Rpb24uYWN0aXZhdGVkIiwiS0FCLkFjdGlvbi52YWx1ZSIsIktleUFjdGlvbkJpbmRlciIsIktleUFjdGlvbkJpbmRlci5jb25zdHJ1Y3RvciIsIktleUFjdGlvbkJpbmRlci5zdGFydCIsIktleUFjdGlvbkJpbmRlci5zdG9wIiwiS2V5QWN0aW9uQmluZGVyLmFjdGlvbiIsIktleUFjdGlvbkJpbmRlci51cGRhdGUiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25BY3RpdmF0ZWQiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25EZWFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvblZhbHVlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5vbkRldmljZXNDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uUmVjZW50RGV2aWNlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5pc1J1bm5pbmciLCJLZXlBY3Rpb25CaW5kZXIub25LZXlEb3duIiwiS2V5QWN0aW9uQmluZGVyLm9uS2V5VXAiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lSW5wdXREZXZpY2VBZGRlZCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVJbnB1dERldmljZVJlbW92ZWQiLCJLZXlBY3Rpb25CaW5kZXIucmVmcmVzaEdhbWVJbnB1dERldmljZUxpc3QiLCJLZXlBY3Rpb25CaW5kZXIuZ2V0Qm91bmRGdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxXQUFXLENBbUVqQjtBQW5FRCxXQUFPLFdBQVc7SUFBQ0EsSUFBQUEsT0FBT0EsQ0FtRXpCQTtJQW5Fa0JBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRTNCQyxBQUdBQTs7V0FER0E7WUFDVUEsWUFBWUE7WUFZeEJDLG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7WUFFbkhBLFNBZllBLFlBQVlBO2dCQUV4QkMscUVBQXFFQTtnQkFDckVBLDZDQUE2Q0E7Z0JBRTdDQSxhQUFhQTtnQkFDTEEsY0FBU0EsR0FB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