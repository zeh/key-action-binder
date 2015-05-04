// Auto-generated file - do not modify!
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
            return (this.buttonCode == buttonCode || this.buttonCode == KeyActionBinder.GamepadButtons.ANY.index) && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
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
        Action.prototype.bind = function (subject, location) {
            if (typeof subject === "number") {
                // Keyboard binding
                this.bindKeyboard(subject, location == undefined ? KeyActionBinder.KeyLocations.ANY : location);
            }
            else {
                // Gamepad binding
                this.bindGamepad(subject, location == undefined ? KeyActionBinder.GamepadLocations.ANY : location);
            }
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
        Action.prototype.bindKeyboard = function (keyCode, keyLocation) {
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardActionBinding(keyCode, keyLocation));
        };
        Action.prototype.bindGamepad = function (button, gamepadLocation) {
            // TODO: check if already present?
            this.gamepadButtonBindings.push(new KAB.GamepadActionBinding(button.index, gamepadLocation));
        };
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
        Axis.prototype.bind = function (p1, p2, p3, p4, p5) {
            if (typeof p1 === "number") {
                // Keyboard binding
                this.bindKeyboard(p1, p2, p3 == undefined ? KeyActionBinder.KeyLocations.ANY : p3, p4 == undefined ? KeyActionBinder.KeyLocations.ANY : p4, p5 == undefined ? 0.15 : p5);
            }
            else {
                // Gamepad binding
                this.bindGamepad(p1, p2 == undefined ? 0.2 : p2, p3 == undefined ? KeyActionBinder.GamepadLocations.ANY : p3);
            }
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
                // Check keyboard values
                for (var i = 0; i < this.keyboardBindings.length; i++) {
                    val = this.keyboardBindings[i].value;
                    if (Math.abs(val) > Math.abs(bestValue)) {
                        bestValue = val;
                    }
                }
                // Check gamepad values
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
        // ================================================================================================================
        // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
        Axis.prototype.bindKeyboard = function (keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds) {
            // TODO: check if already present?
            this.keyboardBindings.push(new KAB.KeyboardAxisBinding(keyCodeA, keyCodeB, keyLocationA, keyLocationB, transitionTimeSeconds));
        };
        Axis.prototype.bindGamepad = function (axis, deadZone, gamepadLocation) {
            // TODO: check if already present?
            this.gamepadAxisBindings.push(new KAB.GamepadAxisBinding(axis.index, deadZone, gamepadLocation));
        };
        return Axis;
    })();
    KAB.Axis = Axis;
})(KAB || (KAB = {}));
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
        // For all gamepads...
        for (i = 0; i < gamepads.length; i++) {
            gamepad = gamepads[i];
            if (gamepad != null) {
                // ..and all actions...
                for (var iis in this.actions) {
                    action = this.actions[iis];
                    // ...interpret all gamepad buttons
                    buttons = gamepad.buttons;
                    l = buttons.length;
                    for (j = 0; j < l; j++) {
                        action.interpretGamepadButton(j, i, buttons[j].pressed, buttons[j].value);
                    }
                }
                // And in all axes...
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
        ANY: { index: 81653815 },
        ACTION_DOWN: { index: 0 },
        ACTION_RIGHT: { index: 1 },
        ACTION_LEFT: { index: 2 },
        ACTION_UP: { index: 3 },
        LEFT_SHOULDER: { index: 4 },
        RIGHT_SHOULDER: { index: 5 },
        LEFT_SHOULDER_BOTTOM: { index: 6 },
        RIGHT_SHOULDER_BOTTOM: { index: 7 },
        SELECT: { index: 8 },
        START: { index: 9 },
        STICK_LEFT_PRESS: { index: 10 },
        STICK_RIGHT_PRESS: { index: 11 },
        DPAD_UP: { index: 12 },
        DPAD_DOWN: { index: 13 },
        DPAD_LEFT: { index: 14 },
        DPAD_RIGHT: { index: 15 }
    };
    KeyActionBinder.GamepadAxes = {
        STICK_LEFT_X: { index: 0 },
        STICK_LEFT_Y: { index: 1 },
        STICK_RIGHT_X: { index: 2 },
        STICK_RIGHT_Y: { index: 3 }
    };
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQWN0aW9uQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEFjdGlvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvVXRpbHMudHMiLCJjb3JlL0tleWJvYXJkQXhpc0JpbmRpbmcudHMiLCJjb3JlL0dhbWVwYWRBeGlzQmluZGluZy50cyIsImNvcmUvQXhpcy50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQWN0aW9uQmluZGluZyIsIktBQi5LZXlib2FyZEFjdGlvbkJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBY3Rpb25CaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZyIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5iaW5kIiwiS0FCLkFjdGlvbi5zZXRUb2xlcmFuY2UiLCJLQUIuQWN0aW9uLmNvbnN1bWUiLCJLQUIuQWN0aW9uLmludGVycHJldEtleURvd24iLCJLQUIuQWN0aW9uLmludGVycHJldEtleVVwIiwiS0FCLkFjdGlvbi5pbnRlcnByZXRHYW1lcGFkQnV0dG9uIiwiS0FCLkFjdGlvbi5pZCIsIktBQi5BY3Rpb24uYWN0aXZhdGVkIiwiS0FCLkFjdGlvbi52YWx1ZSIsIktBQi5BY3Rpb24uYmluZEtleWJvYXJkIiwiS0FCLkFjdGlvbi5iaW5kR2FtZXBhZCIsIktBQi5BY3Rpb24uaXNXaXRoaW5Ub2xlcmFuY2VUaW1lIiwiS0FCLlV0aWxzIiwiS0FCLlV0aWxzLmNvbnN0cnVjdG9yIiwiS0FCLlV0aWxzLm1hcCIsIktBQi5VdGlscy5jbGFtcCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nIiwiS0FCLktleWJvYXJkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBeGlzQmluZGluZy5tYXRjaGVzS2V5Ym9hcmRLZXlTdGFydCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleUVuZCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLnZhbHVlIiwiS0FCLkdhbWVwYWRBeGlzQmluZGluZyIsIktBQi5HYW1lcGFkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuR2FtZXBhZEF4aXNCaW5kaW5nLm1hdGNoZXNHYW1lcGFkQXhpcyIsIktBQi5HYW1lcGFkQXhpc0JpbmRpbmcudmFsdWUiLCJLQUIuQXhpcyIsIktBQi5BeGlzLmNvbnN0cnVjdG9yIiwiS0FCLkF4aXMuYmluZCIsIktBQi5BeGlzLmludGVycHJldEtleURvd24iLCJLQUIuQXhpcy5pbnRlcnByZXRLZXlVcCIsIktBQi5BeGlzLmludGVycHJldEdhbWVwYWRBeGlzIiwiS0FCLkF4aXMuaWQiLCJLQUIuQXhpcy52YWx1ZSIsIktBQi5BeGlzLmJpbmRLZXlib2FyZCIsIktBQi5BeGlzLmJpbmRHYW1lcGFkIiwiS2V5QWN0aW9uQmluZGVyIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN0cnVjdG9yIiwiS2V5QWN0aW9uQmluZGVyLnN0YXJ0IiwiS2V5QWN0aW9uQmluZGVyLnN0b3AiLCJLZXlBY3Rpb25CaW5kZXIuYWN0aW9uIiwiS2V5QWN0aW9uQmluZGVyLmF4aXMiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25BY3RpdmF0ZWQiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25EZWFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvblZhbHVlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5vbkRldmljZXNDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uUmVjZW50RGV2aWNlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5pc1J1bm5pbmciLCJLZXlBY3Rpb25CaW5kZXIub25LZXlEb3duIiwiS2V5QWN0aW9uQmluZGVyLm9uS2V5VXAiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lcGFkQWRkZWQiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lcGFkUmVtb3ZlZCIsIktleUFjdGlvbkJpbmRlci5pbmNyZW1lbnRGcmFtZUNvdW50IiwiS2V5QWN0aW9uQmluZGVyLnVwZGF0ZUdhbWVwYWRzU3RhdGUiLCJLZXlBY3Rpb25CaW5kZXIucmVmcmVzaEdhbWVwYWRMaXN0IiwiS2V5QWN0aW9uQmluZGVyLmdldEJvdW5kRnVuY3Rpb24iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sV0FBVyxDQW1FakI7QUFuRUQsV0FBTyxXQUFXO0lBQUNBLElBQUFBLE9BQU9BLENBbUV6QkE7SUFuRWtCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUUzQkM7O1dBRUdBO1FBQ0hBO1lBWUNDLG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7WUFFbkhBO2dCQWJBQyxxRUFBcUVBO2dCQUNyRUEsNkNBQTZDQTtnQkFFN0NBLGFBQWFBO2dCQUNMQSxjQUFTQSxHQUFZQSxFQUFFQSxDQUFDQTtZQVVoQ0EsQ0FBQ0E7WUFHREQsbUhBQW1IQTtZQUNuSEEsbUhBQW1IQTtZQUU1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QVNBLEVBQUVBLEdBQUdBO1FBQ2RBLFNBQVNBLEVBQUVBLEdBQUdBO1FBQ2RBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ1pBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLEVBQUVBO1FBQ1BBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxVQUFVQSxFQUFFQSxHQUFHQTtRQUNmQSxjQUFjQSxFQUFFQSxHQUFHQTtRQUNuQkEsYUFBYUEsRUFBRUEsR0FBR0E7UUFDbEJBLGVBQWVBLEVBQUVBLEdBQUdBO1FBQ3BCQSxlQUFlQSxFQUFFQSxHQUFHQTtRQUNwQkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsU0FBU0EsRUFBRUEsRUFBRUE7UUFDYkEsT0FBT0EsRUFBRUEsRUFBRUE7UUFDWEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsTUFBTUEsRUFBRUEsR0FBR0E7UUFDWEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsWUFBWUEsRUFBRUEsR0FBR0E7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxTQUFTQSxFQUFFQSxHQUFHQTtRQUNkQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxFQUFFQSxFQUFFQSxFQUFFQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxZQUFZQSxFQUFFQSxFQUFFQTtRQUNoQkEsYUFBYUEsRUFBRUEsRUFBRUE7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO0tBQ0xBLENBQUNBO0lBRVlBLDRCQUFZQSxHQUFHQTtRQUM1QkEsR0FBR0EsRUFBRUEsUUFBUUE7UUFDYkEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDWEEsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDUEEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDUkEsTUFBTUEsRUFBRUEsQ0FBQ0E7S0FDVEEsQ0FBQ0E7SUFFWUEsZ0NBQWdCQSxHQUFHQTtRQUNoQ0EsR0FBR0EsRUFBRUEsUUFBUUE7S0FDYkEsQ0FBQ0E7SUFFWUEsOEJBQWNBLEdBQUdBO1FBQzlCQSxHQUFHQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxFQUFDQTtRQUN0QkEsV0FBV0EsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0E7UUFDdkJBLFlBQVlBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBO1FBQ3hCQSxXQUFXQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtRQUN2QkEsU0FBU0EsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0E7UUFDckJBLGFBQWFBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBO1FBQ3pCQSxjQUFjQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtRQUMxQkEsb0JBQW9CQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtRQUNoQ0EscUJBQXFCQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtRQUNqQ0EsTUFBTUEsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0E7UUFDbEJBLEtBQUtBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBO1FBQ2pCQSxnQkFBZ0JBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBO1FBQzdCQSxpQkFBaUJBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBO1FBQzlCQSxPQUFPQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxFQUFFQSxFQUFDQTtRQUNwQkEsU0FBU0EsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBRUEsRUFBRUEsRUFBQ0E7UUFDdEJBLFNBQVNBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLEVBQUNBO1FBQ3RCQSxVQUFVQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxFQUFFQSxFQUFDQTtLQUN2QkEsQ0FBQ0E7SUFFWUEsMkJBQVdBLEdBQUdBO1FBQzNCQSxZQUFZQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtRQUN4QkEsWUFBWUEsRUFBRUEsRUFBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsRUFBQ0E7UUFDeEJBLGFBQWFBLEVBQUVBLEVBQUNBLEtBQUtBLEVBQUVBLENBQUNBLEVBQUNBO1FBQ3pCQSxhQUFhQSxFQUFFQSxFQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxFQUFDQTtLQUN6QkEsQ0FBQUE7SUE4UUZBLHNCQUFDQTtBQUFEQSxDQWhhQSxBQWdhQ0EsSUFBQSIsImZpbGUiOiJrZXktYWN0aW9uLWJpbmRlci5qcyIsInNvdXJjZVJvb3QiOiJEOi9kcm9wYm94L3dvcmsvZ2l0cy9rZXktYWN0aW9uLWJpbmRlci10cy8iLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXX0=