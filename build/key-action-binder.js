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
            return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KeyCodes.ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KeyLocations.ANY);
        };
        return KeyboardActionBinding;
    })();
    KAB.KeyboardActionBinding = KeyboardActionBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyActionBinder.ts" />
var KAB;
(function (KAB) {
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
            return (this.buttonCode == buttonCode || this.buttonCode == KeyActionBinder.GamepadButtons.ANY) && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
        };
        return GamepadActionBinding;
    })();
    KAB.GamepadActionBinding = GamepadActionBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyboardActionBinding.ts" />
/// <reference path="GamepadActionBinding.ts" />
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
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Action.prototype.bindKeyboard = function (keyCode, keyLocation) {
            if (keyCode === void 0) { keyCode = KeyActionBinder.KeyCodes.ANY; }
            if (keyLocation === void 0) { keyLocation = KeyActionBinder.KeyLocations.ANY; }
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardActionBinding(keyCode, keyLocation));
            return this;
        };
        Action.prototype.bindGamepad = function (buttonCode, gamepadLocation) {
            if (buttonCode === void 0) { buttonCode = KeyActionBinder.GamepadButtons.ANY; }
            if (gamepadLocation === void 0) { gamepadLocation = KeyActionBinder.GamepadLocations.ANY; }
            // TODO: check if already present?
            this.gamepadButtonBindings.push(new KAB.GamepadActionBinding(buttonCode, gamepadLocation));
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
                    this.timeLastActivation = Date.now();
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
            // TODO: I think this will fail if two buttons are used for the same action; values will be overwritten
            if (hasMatch) {
                if (isActivated && !this.gamepadButtonActivated)
                    this.timeLastActivation = Date.now();
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
            return this.toleranceTime <= 0 || this.timeLastActivation >= Date.now() - this.toleranceTime;
        };
        return Action;
    })();
    KAB.Action = Action;
})(KAB || (KAB = {}));
var KAB;
(function (KAB) {
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
    KAB.Utils = Utils;
})(KAB || (KAB = {}));
/// <reference path="KeyActionBinder.ts" />
/// <reference path="Utils.ts" />
var KAB;
(function (KAB) {
    /**
     * Information on a keyboard event filter
     */
    var KeyboardAxisBinding = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function KeyboardAxisBinding(keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds) {
            this.keyCodeA = keyCodeA;
            this.keyLocationA = keyLocationA;
            this.keyCodeB = keyCodeB;
            this.keyLocationB = keyLocationB;
            this.transitionTime = transitionTimeSeconds * 1000;
            this.timeLastChange = NaN;
            this.targetValue = this.previousValue = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        KeyboardAxisBinding.prototype.matchesKeyboardKeyStart = function (keyCode, keyLocation) {
            return (this.keyCodeA == keyCode || this.keyCodeA == KeyActionBinder.KeyCodes.ANY) && (this.keyLocationA == keyLocation || this.keyLocationA == KeyActionBinder.KeyLocations.ANY);
        };
        KeyboardAxisBinding.prototype.matchesKeyboardKeyEnd = function (keyCode, keyLocation) {
            return (this.keyCodeB == keyCode || this.keyCodeB == KeyActionBinder.KeyCodes.ANY) && (this.keyLocationB == keyLocation || this.keyLocationB == KeyActionBinder.KeyLocations.ANY);
        };
        Object.defineProperty(KeyboardAxisBinding.prototype, "value", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                // TODO: this is linear.. add some easing?
                if (isNaN(this.timeLastChange))
                    return this.targetValue;
                return KAB.Utils.map(Date.now(), this.timeLastChange, this.timeLastChange + this.currentTransitionTime, this.previousValue, this.targetValue, true);
            },
            set: function (newValue) {
                if (newValue != this.targetValue) {
                    this.previousValue = this.value;
                    this.targetValue = newValue;
                    this.currentTransitionTime = KAB.Utils.map(Math.abs(this.targetValue - this.previousValue), 0, 1, 0, this.transitionTime);
                    this.timeLastChange = Date.now();
                }
            },
            enumerable: true,
            configurable: true
        });
        return KeyboardAxisBinding;
    })();
    KAB.KeyboardAxisBinding = KeyboardAxisBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyActionBinder.ts" />
var KAB;
(function (KAB) {
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
            return this.axisCode == axisCode && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
        };
        Object.defineProperty(GamepadAxisBinding.prototype, "value", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                // The value is returned taking the dead zone into consideration
                if (this._value < 0) {
                    return KAB.Utils.map(this._value, -this.deadZone, -1, 0, -1, true);
                }
                else {
                    return KAB.Utils.map(this._value, this.deadZone, 1, 0, 1, true);
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
    KAB.GamepadAxisBinding = GamepadAxisBinding;
})(KAB || (KAB = {}));
/// <reference path="KeyboardAxisBinding.ts" />
/// <reference path="GamepadAxisBinding.ts" />
var KAB;
(function (KAB) {
    /**
     * Information linking an axis to a binding, and its value
     */
    var Axis = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function Axis(id) {
            this._id = id;
            this.keyboardBindings = [];
            this.gamepadAxisBindings = [];
            this.gamepadAxisValue = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        Axis.prototype.bindKeyboard = function (keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds) {
            if (keyLocationA === void 0) { keyLocationA = KeyActionBinder.KeyLocations.ANY; }
            if (keyLocationB === void 0) { keyLocationB = KeyActionBinder.KeyLocations.ANY; }
            if (transitionTimeSeconds === void 0) { transitionTimeSeconds = 0.15; }
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardAxisBinding(keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds));
            return this;
        };
        Axis.prototype.bindGamepad = function (axisCode, deadZone, gamepadLocation) {
            if (deadZone === void 0) { deadZone = 0.2; }
            if (gamepadLocation === void 0) { gamepadLocation = KeyActionBinder.GamepadLocations.ANY; }
            // TODO: check if already present?
            this.gamepadAxisBindings.push(new KAB.GamepadAxisBinding(axisCode, deadZone, gamepadLocation));
            return this;
        };
        Axis.prototype.interpretKeyDown = function (keyCode, keyLocation) {
            for (var i = 0; i < this.keyboardBindings.length; i++) {
                if (this.keyboardBindings[i].matchesKeyboardKeyStart(keyCode, keyLocation)) {
                    this.keyboardBindings[i].value = -1;
                }
                else if (this.keyboardBindings[i].matchesKeyboardKeyEnd(keyCode, keyLocation)) {
                    this.keyboardBindings[i].value = 1;
                }
            }
        };
        Axis.prototype.interpretKeyUp = function (keyCode, keyLocation) {
            for (var i = 0; i < this.keyboardBindings.length; i++) {
                if (this.keyboardBindings[i].matchesKeyboardKeyStart(keyCode, keyLocation)) {
                    this.keyboardBindings[i].value = 0;
                }
                else if (this.keyboardBindings[i].matchesKeyboardKeyEnd(keyCode, keyLocation)) {
                    this.keyboardBindings[i].value = 0;
                }
            }
        };
        Axis.prototype.interpretGamepadAxis = function (axisCode, gamepadLocation, valueState) {
            for (var i = 0; i < this.gamepadAxisBindings.length; i++) {
                if (this.gamepadAxisBindings[i].matchesGamepadAxis(axisCode, gamepadLocation)) {
                    this.gamepadAxisBindings[i].value = valueState;
                }
            }
        };
        Object.defineProperty(Axis.prototype, "id", {
            // ================================================================================================================
            // ACCESSOR INTERFACE ---------------------------------------------------------------------------------------------
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Axis.prototype, "value", {
            get: function () {
                // Gets the highest value
                var bestValue = 0;
                var val;
                for (var i = 0; i < this.keyboardBindings.length; i++) {
                    val = this.keyboardBindings[i].value;
                    if (Math.abs(val) > Math.abs(bestValue)) {
                        bestValue = val;
                    }
                }
                for (var i = 0; i < this.gamepadAxisBindings.length; i++) {
                    val = this.gamepadAxisBindings[i].value;
                    if (Math.abs(val) > Math.abs(bestValue)) {
                        bestValue = val;
                    }
                }
                return bestValue;
            },
            enumerable: true,
            configurable: true
        });
        return Axis;
    })();
    KAB.Axis = Axis;
})(KAB || (KAB = {}));
/// <reference path="./../definitions/gamepad.d.ts" />
/// <reference path="./../libs/signals/SimpleSignal.ts" />
/// <reference path="Action.ts" />
/// <reference path="Axis.ts" />
/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
var KeyActionBinder = (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    function KeyActionBinder() {
        this.bindCache = {};
        this._isRunning = false;
        this._maintainPlayerPositions = false;
        this.actions = {};
        this.axes = {};
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
        // Check gamepad state
        if (this.lastFrameGamepadsChecked < this.currentFrame)
            this.updateGamepadsState();
        // Create Action first if needed
        if (!this.actions.hasOwnProperty(id))
            this.actions[id] = new KAB.Action(id);
        return this.actions[id];
    };
    /**
     * Gets an axis instance, creating it if necessary
     */
    KeyActionBinder.prototype.axis = function (id) {
        // Check gamepad state
        if (this.lastFrameGamepadsChecked < this.currentFrame)
            this.updateGamepadsState();
        // Create Axis first if needed
        if (!this.axes.hasOwnProperty(id))
            this.axes[id] = new KAB.Axis(id);
        return this.axes[id];
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
        for (var iis in this.actions)
            this.actions[iis].interpretKeyDown(e.keyCode, e.location);
        for (var iis in this.axes)
            this.axes[iis].interpretKeyDown(e.keyCode, e.location);
    };
    KeyActionBinder.prototype.onKeyUp = function (e) {
        for (var iis in this.actions)
            this.actions[iis].interpretKeyUp(e.keyCode, e.location);
        for (var iis in this.axes)
            this.axes[iis].interpretKeyUp(e.keyCode, e.location);
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
        var i, j, l;
        var action;
        var buttons;
        var axis;
        var axes;
        for (i = 0; i < gamepads.length; i++) {
            gamepad = gamepads[i];
            if (gamepad != null) {
                for (var iis in this.actions) {
                    action = this.actions[iis];
                    // ...interpret all gamepad buttons
                    buttons = gamepad.buttons;
                    l = buttons.length;
                    for (j = 0; j < l; j++) {
                        action.interpretGamepadButton(j, i, buttons[j].pressed, buttons[j].value);
                    }
                }
                for (var iis in this.axes) {
                    axis = this.axes[iis];
                    // ...and all gamepad axes
                    axes = gamepad.axes;
                    l = axes.length;
                    for (j = 0; j < l; j++) {
                        axis.interpretGamepadAxis(j, i, axes[j]);
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
        //console.log("List of gamepads refreshed, new list = " + navigator.getGamepads().length + " items");
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQWN0aW9uQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEFjdGlvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvVXRpbHMudHMiLCJjb3JlL0tleWJvYXJkQXhpc0JpbmRpbmcudHMiLCJjb3JlL0dhbWVwYWRBeGlzQmluZGluZy50cyIsImNvcmUvQXhpcy50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQWN0aW9uQmluZGluZyIsIktBQi5LZXlib2FyZEFjdGlvbkJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBY3Rpb25CaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZyIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5iaW5kS2V5Ym9hcmQiLCJLQUIuQWN0aW9uLmJpbmRHYW1lcGFkIiwiS0FCLkFjdGlvbi5zZXRUb2xlcmFuY2UiLCJLQUIuQWN0aW9uLmNvbnN1bWUiLCJLQUIuQWN0aW9uLmludGVycHJldEtleURvd24iLCJLQUIuQWN0aW9uLmludGVycHJldEtleVVwIiwiS0FCLkFjdGlvbi5pbnRlcnByZXRHYW1lcGFkQnV0dG9uIiwiS0FCLkFjdGlvbi5pZCIsIktBQi5BY3Rpb24uYWN0aXZhdGVkIiwiS0FCLkFjdGlvbi52YWx1ZSIsIktBQi5BY3Rpb24uaXNXaXRoaW5Ub2xlcmFuY2VUaW1lIiwiS0FCLlV0aWxzIiwiS0FCLlV0aWxzLmNvbnN0cnVjdG9yIiwiS0FCLlV0aWxzLm1hcCIsIktBQi5VdGlscy5jbGFtcCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nIiwiS0FCLktleWJvYXJkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBeGlzQmluZGluZy5tYXRjaGVzS2V5Ym9hcmRLZXlTdGFydCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleUVuZCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLnZhbHVlIiwiS0FCLkdhbWVwYWRBeGlzQmluZGluZyIsIktBQi5HYW1lcGFkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuR2FtZXBhZEF4aXNCaW5kaW5nLm1hdGNoZXNHYW1lcGFkQXhpcyIsIktBQi5HYW1lcGFkQXhpc0JpbmRpbmcudmFsdWUiLCJLQUIuQXhpcyIsIktBQi5BeGlzLmNvbnN0cnVjdG9yIiwiS0FCLkF4aXMuYmluZEtleWJvYXJkIiwiS0FCLkF4aXMuYmluZEdhbWVwYWQiLCJLQUIuQXhpcy5pbnRlcnByZXRLZXlEb3duIiwiS0FCLkF4aXMuaW50ZXJwcmV0S2V5VXAiLCJLQUIuQXhpcy5pbnRlcnByZXRHYW1lcGFkQXhpcyIsIktBQi5BeGlzLmlkIiwiS0FCLkF4aXMudmFsdWUiLCJLZXlBY3Rpb25CaW5kZXIiLCJLZXlBY3Rpb25CaW5kZXIuY29uc3RydWN0b3IiLCJLZXlBY3Rpb25CaW5kZXIuc3RhcnQiLCJLZXlBY3Rpb25CaW5kZXIuc3RvcCIsIktleUFjdGlvbkJpbmRlci5hY3Rpb24iLCJLZXlBY3Rpb25CaW5kZXIuYXhpcyIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvbkRlYWN0aXZhdGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uVmFsdWVDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uRGV2aWNlc0NoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIub25SZWNlbnREZXZpY2VDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLmlzUnVubmluZyIsIktleUFjdGlvbkJpbmRlci5vbktleURvd24iLCJLZXlBY3Rpb25CaW5kZXIub25LZXlVcCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRBZGRlZCIsIktleUFjdGlvbkJpbmRlci5vbkdhbWVwYWRSZW1vdmVkIiwiS2V5QWN0aW9uQmluZGVyLmluY3JlbWVudEZyYW1lQ291bnQiLCJLZXlBY3Rpb25CaW5kZXIudXBkYXRlR2FtZXBhZHNTdGF0ZSIsIktleUFjdGlvbkJpbmRlci5yZWZyZXNoR2FtZXBhZExpc3QiLCJLZXlBY3Rpb25CaW5kZXIuZ2V0Qm91bmRGdW5jdGlvbiJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxXQUFXLENBbUVqQjtBQW5FRCxXQUFPLFdBQVc7SUFBQ0EsSUFBQUEsT0FBT0EsQ0FtRXpCQTtJQW5Fa0JBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRTNCQyxBQUdBQTs7V0FER0E7WUFDVUEsWUFBWUE7WUFZeEJDLG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7WUFFbkhBLFNBZllBLFlBQVlBO2dCQUV4QkMscUVBQXFFQTtnQkFDckVBLDZDQUE2Q0E7Z0JBRTdDQSxhQUFhQTtnQkFDTEEsY0FBU0EsR0FBWUEsRUFBRUEsQ0FBQ0E7WUFVaENBLENBQUNBO1lBR0RELG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7WUFFNUdBLDBCQUFH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R0EsRUFBRUEsRUFBRUE7UUFDUEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsTUFBTUEsRUFBRUEsRUFBRUE7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsR0FBR0EsRUFBRUEsR0FBR0E7UUFDUkEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsRUFBRUEsRUFBRUEsR0FBR0E7UUFDUEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsSUFBSUEsRUFBRUEsRUFBRUE7UUFDUkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsTUFBTUEsRUFBRUEsRUFBRUE7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsSUFBSUEsRUFBRUEsRUFBRUE7UUFDUkEsV0FBV0EsRUFBRUEsR0FBR0E7UUFDaEJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEVBQUVBO1FBQ1pBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFFBQVFBLEVBQUVBLEdBQUdBO1FBQ2JBLFVBQVVBLEVBQUVBLEdBQUdBO1FBQ2ZBLGNBQWNBLEVBQUVBLEdBQUdBO1FBQ25CQSxhQUFhQSxFQUFFQSxHQUFHQTtRQUNsQkEsZUFBZUEsRUFBRUEsR0FBR0E7UUFDcEJBLGVBQWVBLEVBQUVBLEdBQUdBO1FBQ3BCQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxTQUFTQSxFQUFFQSxFQUFFQTtRQUNiQSxPQUFPQSxFQUFFQSxFQUFFQTtRQUNYQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxNQUFNQSxFQUFFQSxHQUFHQTtRQUNYQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxZQUFZQSxFQUFFQSxHQUFHQTtRQUNqQkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsV0FBV0EsRUFBRUEsR0FBR0E7UUFDaEJBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLFNBQVNBLEVBQUVBLEdBQUdBO1FBQ2RBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ05BLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEVBQUVBLEVBQUVBLEVBQUVBO1FBQ05BLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFlBQVlBLEVBQUVBLEVBQUVBO1FBQ2hCQSxhQUFhQSxFQUFFQSxFQUFFQTtRQUNqQkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7S0FDTEEsQ0FBQ0E7SUFFWUEsNEJBQVlBLEdBQUdBO1FBQzVCQSxHQUFHQSxFQUFFQSxRQUFRQTtRQUNiQSxRQUFRQSxFQUFFQSxDQUFDQTtRQUNYQSxJQUFJQSxFQUFFQSxDQUFDQTtRQUNQQSxLQUFLQSxFQUFFQSxDQUFDQTtRQUNSQSxNQUFNQSxFQUFFQSxDQUFDQTtLQUNUQSxDQUFDQTtJQUVZQSxnQ0FBZ0JBLEdBQUdBO1FBQ2hDQSxHQUFHQSxFQUFFQSxRQUFRQTtLQUNiQSxDQUFDQTtJQUVZQSw4QkFBY0EsR0FBR0E7UUFDOUJBLEdBQUdBLEVBQUVBLFFBQVFBO1FBQ2JBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ2RBLFlBQVlBLEVBQUVBLENBQUNBO1FBQ2ZBLFdBQVdBLEVBQUVBLENBQUNBO1FBQ2RBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ1pBLGFBQWFBLEVBQUVBLENBQUNBO1FBQ2hCQSxjQUFjQSxFQUFFQSxDQUFDQTtRQUNqQkEsb0JBQW9CQSxFQUFFQSxDQUFDQTtRQUN2QkEscUJBQXFCQSxFQUFFQSxDQUFDQTtRQUN4QkEsTUFBTUEsRUFBRUEsQ0FBQ0E7UUFDVEEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDUkEsZ0JBQWdCQSxFQUFFQSxFQUFFQTtRQUNwQkEsaUJBQWlCQSxFQUFFQSxFQUFFQTtRQUNyQkEsT0FBT0EsRUFBRUEsRUFBRUE7UUFDWEEsU0FBU0EsRUFBRUEsRUFBRUE7UUFDYkEsU0FBU0EsRUFBRUEsRUFBRUE7UUFDYkEsVUFBVUEsRUFBRUEsRUFBRUE7S0FDZEEsQ0FBQ0E7SUFFWUEsMkJBQVdBLEdBQUdBO1FBQzNCQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNmQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNmQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNoQkEsYUFBYUEsRUFBRUEsQ0FBQ0E7S0FDaEJBLENBQUFBO0lBOFFGQSxzQkFBQ0E7QUFBREEsQ0FoYUEsQUFnYUNBLElBQUEiLCJmaWxlIjoia2V5LWFjdGlvbi1iaW5kZXIuanMiLCJzb3VyY2VSb290IjoiRDovRHJvcGJveC93b3JrL2dpdHMva2V5LWFjdGlvbi1iaW5kZXItdHMvIiwic291cmNlc0NvbnRlbnQiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF19