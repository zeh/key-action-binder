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
            this.value = 0;
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        GamepadAxisBinding.prototype.matchesGamepadButton = function (axisCode, gamepadLocation) {
            return this.axisCode == axisCode && (this.gamepadLocation == gamepadLocation || this.gamepadLocation == KeyActionBinder.GamepadLocations.ANY);
        };
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
            if (deadZone === void 0) { deadZone = 0.1; }
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
            /*
            var hasMatch:boolean;
            var isActivated:boolean = false;
            var newValue:number = 0;
            for (var i:number = 0; i < this.gamepadButtonBindings.length; i++) {
                if (this.gamepadButtonBindings[i].matchesGamepadButton(buttonCode, gamepadLocation)) {
                    hasMatch = true;
                    this.gamepadButtonBindings[i].isActivated = pressedState;
                    this.gamepadButtonBindings[i].value = valueState;

                    isActivated = isActivated || pressedState;
                    if (valueState > newValue) newValue = valueState;
                }
            }

            if (hasMatch) {
                if (isActivated && !this.gamepadButtonActivated) this.lastActivatedTime = Date.now();

                this.gamepadButtonActivated = isActivated;
                this.gamepadButtonValue = newValue;

                if (!this.gamepadButtonActivated) this.gamepadButtonConsumed = false;
            }
            */
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
    // TODO:
    // * Check navigator.getGamepads to see if gamepads are actually accessible without breaking
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleWJvYXJkQWN0aW9uQmluZGluZy50cyIsImNvcmUvR2FtZXBhZEFjdGlvbkJpbmRpbmcudHMiLCJjb3JlL0FjdGlvbi50cyIsImNvcmUvVXRpbHMudHMiLCJjb3JlL0tleWJvYXJkQXhpc0JpbmRpbmcudHMiLCJjb3JlL0dhbWVwYWRBeGlzQmluZGluZy50cyIsImNvcmUvQXhpcy50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLktleWJvYXJkQWN0aW9uQmluZGluZyIsIktBQi5LZXlib2FyZEFjdGlvbkJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBY3Rpb25CaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZyIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5jb25zdHJ1Y3RvciIsIktBQi5HYW1lcGFkQWN0aW9uQmluZGluZy5tYXRjaGVzR2FtZXBhZEJ1dHRvbiIsIktBQi5BY3Rpb24iLCJLQUIuQWN0aW9uLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGlvbi5iaW5kS2V5Ym9hcmQiLCJLQUIuQWN0aW9uLmJpbmRHYW1lcGFkIiwiS0FCLkFjdGlvbi5zZXRUb2xlcmFuY2UiLCJLQUIuQWN0aW9uLmNvbnN1bWUiLCJLQUIuQWN0aW9uLmludGVycHJldEtleURvd24iLCJLQUIuQWN0aW9uLmludGVycHJldEtleVVwIiwiS0FCLkFjdGlvbi5pbnRlcnByZXRHYW1lcGFkQnV0dG9uIiwiS0FCLkFjdGlvbi5pZCIsIktBQi5BY3Rpb24uYWN0aXZhdGVkIiwiS0FCLkFjdGlvbi52YWx1ZSIsIktBQi5BY3Rpb24uaXNXaXRoaW5Ub2xlcmFuY2VUaW1lIiwiS0FCLlV0aWxzIiwiS0FCLlV0aWxzLmNvbnN0cnVjdG9yIiwiS0FCLlV0aWxzLm1hcCIsIktBQi5VdGlscy5jbGFtcCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nIiwiS0FCLktleWJvYXJkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRBeGlzQmluZGluZy5tYXRjaGVzS2V5Ym9hcmRLZXlTdGFydCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleUVuZCIsIktBQi5LZXlib2FyZEF4aXNCaW5kaW5nLnZhbHVlIiwiS0FCLkdhbWVwYWRBeGlzQmluZGluZyIsIktBQi5HYW1lcGFkQXhpc0JpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuR2FtZXBhZEF4aXNCaW5kaW5nLm1hdGNoZXNHYW1lcGFkQnV0dG9uIiwiS0FCLkF4aXMiLCJLQUIuQXhpcy5jb25zdHJ1Y3RvciIsIktBQi5BeGlzLmJpbmRLZXlib2FyZCIsIktBQi5BeGlzLmJpbmRHYW1lcGFkIiwiS0FCLkF4aXMuaW50ZXJwcmV0S2V5RG93biIsIktBQi5BeGlzLmludGVycHJldEtleVVwIiwiS0FCLkF4aXMuaW50ZXJwcmV0R2FtZXBhZEF4aXMiLCJLQUIuQXhpcy5pZCIsIktBQi5BeGlzLnZhbHVlIiwiS2V5QWN0aW9uQmluZGVyIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN0cnVjdG9yIiwiS2V5QWN0aW9uQmluZGVyLnN0YXJ0IiwiS2V5QWN0aW9uQmluZGVyLnN0b3AiLCJLZXlBY3Rpb25CaW5kZXIuYWN0aW9uIiwiS2V5QWN0aW9uQmluZGVyLmF4aXMiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25BY3RpdmF0ZWQiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25EZWFjdGl2YXRlZCIsIktleUFjdGlvbkJpbmRlci5vbkFjdGlvblZhbHVlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5vbkRldmljZXNDaGFuZ2VkIiwiS2V5QWN0aW9uQmluZGVyLm9uUmVjZW50RGV2aWNlQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5pc1J1bm5pbmciLCJLZXlBY3Rpb25CaW5kZXIub25LZXlEb3duIiwiS2V5QWN0aW9uQmluZGVyLm9uS2V5VXAiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lcGFkQWRkZWQiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lcGFkUmVtb3ZlZCIsIktleUFjdGlvbkJpbmRlci5pbmNyZW1lbnRGcmFtZUNvdW50IiwiS2V5QWN0aW9uQmluZGVyLnVwZGF0ZUdhbWVwYWRzU3RhdGUiLCJLZXlBY3Rpb25CaW5kZXIucmVmcmVzaEdhbWVwYWRMaXN0IiwiS2V5QWN0aW9uQmluZGVyLmdldEJvdW5kRnVuY3Rpb24iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sV0FBVyxDQW1FakI7QUFuRUQsV0FBTyxXQUFXO0lBQUNBLElBQUFBLE9BQU9BLENBbUV6QkE7SUFuRWtCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUUzQkMsQUFHQUE7O1dBREdBO1lBQ1VBLFlBQVlBO1lBWXhCQyxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO1lBRW5IQSxTQWZZQSxZQUFZQTtnQkFFeEJDLHFFQUFxRUE7Z0JBQ3JFQSw2Q0FBNkNBO2dCQUU3Q0EsYUFBYUE7Z0JBQ0xBLGNBQVNBLEdBQVlBLEVBQUVBLENBQUNBO1lBVWhDQSxDQUFDQTtZQUdERCxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO1lBRTVHQSwwQkFBR0EsR0FBVkEsVUFBV0EsSUFBTUE7Z0JBQ2hCRSxF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Q0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzdCQSxDQUFDQTtJQWhhRG5CLFlBQVlBO0lBQ0VBLHVCQUFPQSxHQUFVQSxPQUFPQSxDQUFDQTtJQUV2Q0EsbUJBQW1CQTtJQUNMQSx3QkFBUUEsR0FBR0E7UUFDeEJBLEdBQUdBLEVBQUVBLFFBQVFBO1FBQ2JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLEVBQUVBO1FBQ1BBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFNBQVNBLEVBQUVBLEdBQUdBO1FBQ2RBLFNBQVNBLEVBQUVBLEdBQUdBO1FBQ2RBLFNBQVNBLEVBQUVBLENBQUNBO1FBQ1pBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEdBQUdBLEVBQUVBLEVBQUVBO1FBQ1BBLEtBQUtBLEVBQUVBLEVBQUVBO1FBQ1RBLEtBQUtBLEVBQUVBLEdBQUdBO1FBQ1ZBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEdBQUdBLEVBQUVBLEdBQUdBO1FBQ1JBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLEVBQUVBLEVBQUVBLEdBQUdBO1FBQ1BBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLE1BQU1BLEVBQUVBLEVBQUVBO1FBQ1ZBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLElBQUlBLEVBQUVBLEVBQUVBO1FBQ1JBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxFQUFFQTtRQUNaQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxRQUFRQSxFQUFFQSxHQUFHQTtRQUNiQSxVQUFVQSxFQUFFQSxHQUFHQTtRQUNmQSxjQUFjQSxFQUFFQSxHQUFHQTtRQUNuQkEsYUFBYUEsRUFBRUEsR0FBR0E7UUFDbEJBLGVBQWVBLEVBQUVBLEdBQUdBO1FBQ3BCQSxlQUFlQSxFQUFFQSxHQUFHQTtRQUNwQkEsUUFBUUEsRUFBRUEsR0FBR0E7UUFDYkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsU0FBU0EsRUFBRUEsRUFBRUE7UUFDYkEsT0FBT0EsRUFBRUEsRUFBRUE7UUFDWEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsTUFBTUEsRUFBRUEsR0FBR0E7UUFDWEEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsR0FBR0E7UUFDVkEsQ0FBQ0EsRUFBRUEsRUFBRUE7UUFDTEEsS0FBS0EsRUFBRUEsRUFBRUE7UUFDVEEsWUFBWUEsRUFBRUEsR0FBR0E7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLFdBQVdBLEVBQUVBLEdBQUdBO1FBQ2hCQSxNQUFNQSxFQUFFQSxFQUFFQTtRQUNWQSxTQUFTQSxFQUFFQSxHQUFHQTtRQUNkQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxLQUFLQSxFQUFFQSxHQUFHQTtRQUNWQSxLQUFLQSxFQUFFQSxFQUFFQTtRQUNUQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxFQUFFQSxFQUFFQSxFQUFFQTtRQUNOQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxDQUFDQSxFQUFFQSxFQUFFQTtRQUNMQSxZQUFZQSxFQUFFQSxFQUFFQTtRQUNoQkEsYUFBYUEsRUFBRUEsRUFBRUE7UUFDakJBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ0xBLENBQUNBLEVBQUVBLEVBQUVBO0tBQ0xBLENBQUNBO0lBRVlBLDRCQUFZQSxHQUFHQTtRQUM1QkEsR0FBR0EsRUFBRUEsUUFBUUE7UUFDYkEsUUFBUUEsRUFBRUEsQ0FBQ0E7UUFDWEEsSUFBSUEsRUFBRUEsQ0FBQ0E7UUFDUEEsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDUkEsTUFBTUEsRUFBRUEsQ0FBQ0E7S0FDVEEsQ0FBQ0E7SUFFWUEsZ0NBQWdCQSxHQUFHQTtRQUNoQ0EsR0FBR0EsRUFBRUEsUUFBUUE7S0FDYkEsQ0FBQ0E7SUFFWUEsOEJBQWNBLEdBQUdBO1FBQzlCQSxHQUFHQSxFQUFFQSxRQUFRQTtRQUNiQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNkQSxZQUFZQSxFQUFFQSxDQUFDQTtRQUNmQSxXQUFXQSxFQUFFQSxDQUFDQTtRQUNkQSxTQUFTQSxFQUFFQSxDQUFDQTtRQUNaQSxhQUFhQSxFQUFFQSxDQUFDQTtRQUNoQkEsY0FBY0EsRUFBRUEsQ0FBQ0E7UUFDakJBLG9CQUFvQkEsRUFBRUEsQ0FBQ0E7UUFDdkJBLHFCQUFxQkEsRUFBRUEsQ0FBQ0E7UUFDeEJBLE1BQU1BLEVBQUVBLENBQUNBO1FBQ1RBLEtBQUtBLEVBQUVBLENBQUNBO1FBQ1JBLGdCQUFnQkEsRUFBRUEsRUFBRUE7UUFDcEJBLGlCQUFpQkEsRUFBRUEsRUFBRUE7UUFDckJBLE9BQU9BLEVBQUVBLEVBQUVBO1FBQ1hBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLFNBQVNBLEVBQUVBLEVBQUVBO1FBQ2JBLFVBQVVBLEVBQUVBLEVBQUVBO0tBQ2RBLENBQUNBO0lBRVlBLDJCQUFXQSxHQUFHQTtRQUMzQkEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDZkEsWUFBWUEsRUFBRUEsQ0FBQ0E7UUFDZkEsYUFBYUEsRUFBRUEsQ0FBQ0E7UUFDaEJBLGFBQWFBLEVBQUVBLENBQUNBO0tBQ2hCQSxDQUFBQTtJQWlSRkEsc0JBQUNBO0FBQURBLENBbmFBLEFBbWFDQSxJQUFBIiwiZmlsZSI6ImtleS1hY3Rpb24tYmluZGVyLmpzIiwic291cmNlUm9vdCI6IkQ6L0Ryb3Bib3gvd29yay9naXRzL2tleS1hY3Rpb24tYmluZGVyLXRzLyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGxdfQ==