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
/// <reference path="IBinding.ts" />
var KAB;
(function (KAB) {
    /**
     * Information linking an action to a binding, and whether it's activated
     */
    var BindingInfo = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function BindingInfo(action, binding) {
            if (action === void 0) { action = ""; }
            if (binding === void 0) { binding = null; }
            this.action = action;
            this.binding = binding;
            this.isActivated = false;
            this.lastActivatedTime = 0;
        }
        return BindingInfo;
    })();
    KAB.BindingInfo = BindingInfo;
})(KAB || (KAB = {}));
/// <reference path="IBinding.ts" />
/// <reference path="BindingInfo.ts" />
/// <reference path="KeyActionBinder.ts" />
var KAB;
(function (KAB) {
    /**
     * Information listing all activated bindings of a given action
     */
    var ActivationInfo = (function () {
        // ================================================================================================================
        // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
        function ActivationInfo() {
            this.activations = new Array();
            this.activationGamepadIndexes = new Array();
            this.sensitiveValues = {};
            this.sensitiveValuesGamepadIndexes = {};
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        ActivationInfo.prototype.addActivation = function (bindingInfo, gamepadIndex) {
            if (gamepadIndex === void 0) { gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
            this.activations.push(bindingInfo);
            this.activationGamepadIndexes.push(gamepadIndex);
        };
        ActivationInfo.prototype.removeActivation = function (bindingInfo) {
            this.iix = this.activations.indexOf(bindingInfo);
            if (this.iix > -1) {
                this.activations.splice(this.iix, 1);
                this.activationGamepadIndexes.splice(this.iix, 1);
            }
        };
        ActivationInfo.prototype.getNumActivations = function (timeToleranceSeconds, gamepadIndex) {
            if (timeToleranceSeconds === void 0) { timeToleranceSeconds = 0; }
            if (gamepadIndex === void 0) { gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
            // If not time-sensitive, just return it
            if ((timeToleranceSeconds <= 0 && gamepadIndex < 0) || this.activations.length == 0)
                return this.activations.length;
            // Otherwise, actually check for activation time and gamepad index
            this.iit = Date.now() - timeToleranceSeconds * 1000;
            this.iic = 0;
            for (this.iii = 0; this.iii < this.activations.length; this.iii++) {
                if ((timeToleranceSeconds <= 0 || this.activations[this.iii].lastActivatedTime >= this.iit) && (gamepadIndex < 0 || this.activationGamepadIndexes[this.iii] == gamepadIndex))
                    this.iic++;
            }
            return this.iic;
        };
        ActivationInfo.prototype.resetActivations = function () {
            this.activations.length = 0;
            this.activationGamepadIndexes.length = 0;
        };
        ActivationInfo.prototype.addSensitiveValue = function (actionId, value, gamepadIndex) {
            if (gamepadIndex === void 0) { gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
            this.sensitiveValues[actionId] = value;
            this.sensitiveValuesGamepadIndexes[actionId] = gamepadIndex;
        };
        ActivationInfo.prototype.getValue = function (gamepadIndex) {
            if (gamepadIndex === void 0) { gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
            this.iiv = NaN;
            for (var iis in this.sensitiveValues) {
                // NOTE: this may be a problem if two different axis control the same action, since -1 is not necessarily better than +0.5
                if ((gamepadIndex < 0 || this.sensitiveValuesGamepadIndexes[iis] == gamepadIndex) && (isNaN(this.iiv) || Math.abs(this.sensitiveValues[iis]) > Math.abs(this.iiv))) {
                    this.iiv = this.sensitiveValues[iis];
                }
            }
            if (isNaN(this.iiv))
                return this.getNumActivations(0, gamepadIndex) == 0 ? 0 : 1;
            return this.iiv;
        };
        return ActivationInfo;
    })();
    KAB.ActivationInfo = ActivationInfo;
})(KAB || (KAB = {}));
/// <reference path="IBinding.ts" />
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
        }
        // ================================================================================================================
        // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
        KeyboardBinding.prototype.matchesKeyboardKey = function (keyCode, keyLocation) {
            return (this.keyCode == keyCode || this.keyCode == KeyActionBinder.KEY_CODE_ANY) && (this.keyLocation == keyLocation || this.keyLocation == KeyActionBinder.KEY_LOCATION_ANY);
        };
        // TODO: add modifiers?
        KeyboardBinding.prototype.matchesGamepadControl = function (controlId, gamepadIndex) {
            return false;
        };
        return KeyboardBinding;
    })();
    KAB.KeyboardBinding = KeyboardBinding;
})(KAB || (KAB = {}));
/// <reference path="IBinding.ts" />
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
/// <reference path="./../definitions/gamepad.d.ts" />
/// <reference path="./../libs/signals/SimpleSignal.ts" />
/// <reference path="ActivationInfo.ts" />
/// <reference path="BindingInfo.ts" />
/// <reference path="KeyboardBinding.ts" />
/// <reference path="GamepadBinding.ts" />
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
        this.bindings = new Array();
        this.actionsActivations = {};
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
    /**
     * Adds an action bound to a keyboard key. When a key with the given <code>keyCode</code> is pressed, the
     * desired action is activated. Optionally, keys can be restricted to a specific <code>keyLocation</code>.
     *
     * @param action		An arbitrary String id identifying the action that should be dispatched once this
     *						key combination is detected.
     * @param keyCode		The code of a key, as expressed in AS3's Keyboard constants.
     * @param keyLocation	The code of a key's location, as expressed in AS3's KeyLocation constants. If the
     *						default value is passed, the key location is never taken into
     *						consideration when detecting whether the passed action should be fired.
     *
     * <p>Examples:</p>
     *
     * <pre>
     * // Left arrow key to move left
     * myBinder.addKeyboardActionBinding("move-left", Keyboard.LEFT);
     *
     * // SPACE key to jump
     * myBinder.addKeyboardActionBinding("jump", Keyboard.SPACE);
     *
     * // Any SHIFT key to shoot
     * myBinder.addKeyboardActionBinding("shoot", Keyboard.SHIFT);
     *
     * // Left SHIFT key to boost
     * myBinder.addKeyboardActionBinding("boost", Keyboard.SHIFT, KeyLocation.LEFT);
     * </pre>
     *
     * @see flash.ui.Keyboard
     * @see #isActionActivated()
     * @see #removeKeyboardActionBinding()
     */
    KeyActionBinder.prototype.addKeyboardActionBinding = function (action, keyCode, keyLocation) {
        if (keyCode === void 0) { keyCode = KeyActionBinder.KEY_CODE_ANY; }
        if (keyLocation === void 0) { keyLocation = KeyActionBinder.KEY_LOCATION_ANY; }
        // Create a binding to be verified later
        this.bindings.push(new KAB.BindingInfo(action, new KAB.KeyboardBinding(keyCode, keyLocation)));
        this.prepareAction(action);
    };
    /**
     * Removes an action bound to a keyboard key.
     *
     * @param action		An arbitrary String id identifying the action that should be dispatched once this
     *						key combination is detected.
     * @param keyCode		The code of a key, as expressed in AS3's Keyboard constants.
     * @param keyLocation	The code of a key's location, as expressed in AS3's KeyLocation constants. If the
     *						default value is passed, the key location is never taken into
     *						consideration when detecting whether the passed action should be fired.
     *
     * @see flash.ui.Keyboard
     * @see #addGamepadActionBinding()
     */
    KeyActionBinder.prototype.removeKeyboardActionBinding = function (action, keyCode, keyLocation) {
        if (keyCode === void 0) { keyCode = KeyActionBinder.KEY_CODE_ANY; }
        if (keyLocation === void 0) { keyLocation = KeyActionBinder.KEY_LOCATION_ANY; }
        var bindingsToRemove = new Array();
        this.bindings.forEach(function (bindingInfo, i) {
            if (bindingInfo.action == action) {
                var keyboardBinding = bindingInfo.binding;
                if (keyboardBinding != null && keyboardBinding.keyCode == keyCode && keyboardBinding.keyLocation == keyLocation) {
                    // Store the binding to remove later, and fake a deactivate event
                    bindingsToRemove[bindingsToRemove.length] = bindingInfo;
                }
            }
        });
        bindingsToRemove.forEach(function (bindingInfo, i) {
            this.bindings.splice(this.bindings.indexOf(bindingInfo), 1);
        });
        this.consumeAction(action);
    };
    /**
     * Adds an action bound to a game controller button, trigger, or axis. When a control of id
     * <code>controlId</code> is pressed, the desired action can be activated, and its value changes.
     * Optionally, keys can be restricted to a specific game controller location.
     *
     * @param action		An arbitrary String id identifying the action that should be dispatched once this
     *						input combination is detected.
     * @param controlId		The id code of a GameInput control, as an String. Use one of the constants from
     *						<code>GamepadControls</code>.
     * @param gamepadIndex	The int of the gamepad that you want to restrict this action to. Use 0 for the
     *						first gamepad (player 1), 1 for the second one, and so on. If the default value
     *						is passed, the gamepad index is never taken into consideration when detecting
     *						whether the passed action should be fired.
     *
     * <p>Examples:</p>
     *
     * <pre>
     * // Direction pad left to move left
     * myBinder.addGamepadActionBinding("move-left", GamepadControls.DPAD_LEFT);
     *
     * // Action button "down" (O in the OUYA, Cross in the PS3, A in the XBox 360) to jump
     * myBinder.addGamepadActionBinding("jump", GamepadControls.ACTION_DOWN);
     *
     * // L1/LB to shoot, on any controller
     * myBinder.addGamepadActionBinding("shoot", GamepadControls.LB);
     *
     * // L1/LB to shoot, on the first controller only
     * myBinder.addGamepadActionBinding("shoot-player-1", GamepadControls.LB, 0);
     *
     * // L2/LT to shoot, regardless of whether it is sensitive or not
     * myBinder.addGamepadActionBinding("shoot", GamepadControls.LT);
     *
     * // L2/LT to accelerate, depending on how much it is pressed (if supported)
     * myBinder.addGamepadActionBinding("accelerate", GamepadControls.LT);
    .*
     * // Direction pad left to move left or right
     * myBinder.addGamepadActionBinding("move-sides", GamepadControls.STICK_LEFT_X);
     * </pre>
     *
     * @see GamepadControls
     * @see #isActionActivated()
     * @see #getActionValue()
     * @see #removeGamepadActionBinding()
     */
    KeyActionBinder.prototype.addGamepadActionBinding = function (action, controlId, gamepadIndex) {
        if (gamepadIndex === void 0) { gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
        // Create a binding to be verified later
        this.bindings.push(new KAB.BindingInfo(action, new KAB.GamepadBinding(controlId, gamepadIndex)));
        this.prepareAction(action);
    };
    /**
     * Removes an action bound to a game controller button, trigger, or axis.
     *
     * @param action		An arbitrary String id identifying the action that should be no longer bound.
     * @param controlId		The id code of a GameInput control, as an String. Use one of the constants from
     *						<code>GamepadControls</code>.
     * @param gamepadIndex	The int of the gamepad that you want to restrict this action to. Use 0 for the
     *						first gamepad (player 1), 1 for the second one, and so on. If the default value
     *						is passed, the gamepad index is never taken into consideration when detecting
     *						whether the passed action should be fired.
     *
     * @see GamepadControls
     * @see #addGamepadActionBinding()
     */
    KeyActionBinder.prototype.removeGamepadActionBinding = function (action, controlId, __gamepadIndex) {
        if (__gamepadIndex === void 0) { __gamepadIndex = KeyActionBinder.GAMEPAD_INDEX_ANY; }
        var bindingsToRemove = new Array();
        this.bindings.forEach(function (bindingInfo, i) {
            if (bindingInfo.action == action) {
                var gamepadBinding = bindingInfo.binding;
                if (gamepadBinding != null && gamepadBinding.controlId == controlId && gamepadBinding.gamepadIndex == gamepadIndex) {
                    // Store the binding to remove later, and fake a deactivate event
                    bindingsToRemove[bindingsToRemove.length] = bindingInfo;
                }
            }
        });
        bindingsToRemove.forEach(function (bindingInfo, i) {
            this.bindings.splice(this.bindings.indexOf(bindingInfo), 1);
        });
        this.consumeAction(action);
    };
    /**
     * Consumes an action, causing all current activations and values attached to it to be reset. This is
     * the same as simulating the player releasing the button that activates an action. It is useful to
     * force players to re-activate some actions, such as a jump action (otherwise keeping the jump button
     * pressed would allow the player to jump nonstop).
     *
     * @param action		The id of the action you want to consume.
     *
     * <p>Examples:</p>
     *
     * <pre>
     * // On jump, consume the jump
     * if (isTouchingSurface && myBinder.isActionActivated("jump")) {
     *     myBinder.consumeAction("jump");
     *     player.performJump();
     * }
     * </pre>
     *
     * @see GamepadControls
     * @see #isActionActivated()
     */
    KeyActionBinder.prototype.consumeAction = function (action) {
        // Deactivates all current actions of an action (forcing a button to be pressed again)
        if (this.actionsActivations.hasOwnProperty(action))
            this.actionsActivations[action].resetActivations();
    };
    /**
     * Update the known state of all buttons/axis
     */
    KeyActionBinder.prototype.update = function () {
        // TODO: check controls to see if any has changed
        // TODO: move this outside? make it automatic (with requestAnimationFrame), or make it be called once per frame when any action is checked
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
        console.error("NOT IMPLEMENTED: onKeyDown");
    };
    KeyActionBinder.prototype.onKeyUp = function (e) {
        console.error("NOT IMPLEMENTED: onKeyUp");
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
    KeyActionBinder.KEY_CODE_ANY = "any";
    KeyActionBinder.KEY_LOCATION_ANY = 81653813;
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0JpbmRpbmdJbmZvLnRzIiwiY29yZS9BY3RpdmF0aW9uSW5mby50cyIsImNvcmUvS2V5Ym9hcmRCaW5kaW5nLnRzIiwiY29yZS9HYW1lcGFkQmluZGluZy50cyIsImNvcmUvS2V5QWN0aW9uQmluZGVyLnRzIl0sIm5hbWVzIjpbInplaGZlcm5hbmRvIiwiemVoZmVybmFuZG8uc2lnbmFscyIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuY29uc3RydWN0b3IiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5hZGQiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5yZW1vdmVBbGwiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5kaXNwYXRjaCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLm51bUl0ZW1zIiwiS0FCIiwiS0FCLkJpbmRpbmdJbmZvIiwiS0FCLkJpbmRpbmdJbmZvLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGl2YXRpb25JbmZvIiwiS0FCLkFjdGl2YXRpb25JbmZvLmNvbnN0cnVjdG9yIiwiS0FCLkFjdGl2YXRpb25JbmZvLmFkZEFjdGl2YXRpb24iLCJLQUIuQWN0aXZhdGlvbkluZm8ucmVtb3ZlQWN0aXZhdGlvbiIsIktBQi5BY3RpdmF0aW9uSW5mby5nZXROdW1BY3RpdmF0aW9ucyIsIktBQi5BY3RpdmF0aW9uSW5mby5yZXNldEFjdGl2YXRpb25zIiwiS0FCLkFjdGl2YXRpb25JbmZvLmFkZFNlbnNpdGl2ZVZhbHVlIiwiS0FCLkFjdGl2YXRpb25JbmZvLmdldFZhbHVlIiwiS0FCLktleWJvYXJkQmluZGluZyIsIktBQi5LZXlib2FyZEJpbmRpbmcuY29uc3RydWN0b3IiLCJLQUIuS2V5Ym9hcmRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5LZXlib2FyZEJpbmRpbmcubWF0Y2hlc0dhbWVwYWRDb250cm9sIiwiS0FCLkdhbWVwYWRCaW5kaW5nIiwiS0FCLkdhbWVwYWRCaW5kaW5nLmNvbnN0cnVjdG9yIiwiS0FCLkdhbWVwYWRCaW5kaW5nLm1hdGNoZXNLZXlib2FyZEtleSIsIktBQi5HYW1lcGFkQmluZGluZy5tYXRjaGVzR2FtZXBhZENvbnRyb2wiLCJLZXlBY3Rpb25CaW5kZXIiLCJLZXlBY3Rpb25CaW5kZXIuY29uc3RydWN0b3IiLCJLZXlBY3Rpb25CaW5kZXIuc3RhcnQiLCJLZXlBY3Rpb25CaW5kZXIuc3RvcCIsIktleUFjdGlvbkJpbmRlci5hZGRLZXlib2FyZEFjdGlvbkJpbmRpbmciLCJLZXlBY3Rpb25CaW5kZXIucmVtb3ZlS2V5Ym9hcmRBY3Rpb25CaW5kaW5nIiwiS2V5QWN0aW9uQmluZGVyLmFkZEdhbWVwYWRBY3Rpb25CaW5kaW5nIiwiS2V5QWN0aW9uQmluZGVyLnJlbW92ZUdhbWVwYWRBY3Rpb25CaW5kaW5nIiwiS2V5QWN0aW9uQmluZGVyLmNvbnN1bWVBY3Rpb24iLCJLZXlBY3Rpb25CaW5kZXIudXBkYXRlIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uQWN0aXZhdGVkIiwiS2V5QWN0aW9uQmluZGVyLm9uQWN0aW9uRGVhY3RpdmF0ZWQiLCJLZXlBY3Rpb25CaW5kZXIub25BY3Rpb25WYWx1ZUNoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIub25EZXZpY2VzQ2hhbmdlZCIsIktleUFjdGlvbkJpbmRlci5vblJlY2VudERldmljZUNoYW5nZWQiLCJLZXlBY3Rpb25CaW5kZXIuaXNSdW5uaW5nIiwiS2V5QWN0aW9uQmluZGVyLm9uS2V5RG93biIsIktleUFjdGlvbkJpbmRlci5vbktleVVwIiwiS2V5QWN0aW9uQmluZGVyLm9uR2FtZUlucHV0RGV2aWNlQWRkZWQiLCJLZXlBY3Rpb25CaW5kZXIub25HYW1lSW5wdXREZXZpY2VSZW1vdmVkIiwiS2V5QWN0aW9uQmluZGVyLnJlZnJlc2hHYW1lSW5wdXREZXZpY2VMaXN0IiwiS2V5QWN0aW9uQmluZGVyLmdldEJvdW5kRnVuY3Rpb24iXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sV0FBVyxDQW1FakI7QUFuRUQsV0FBTyxXQUFXO0lBQUNBLElBQUFBLE9BQU9BLENBbUV6QkE7SUFuRWtCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUUzQkMsQUFHQUE7O1dBREdBO1lBQ1VBLFlBQVlBO1lBWXhCQyxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO1lBRW5IQSxTQWZZQSxZQUFZQTtnQkFFeEJDLHFFQUFxRUE7Z0JBQ3JFQSw2Q0FBNkNBO2dCQUU3Q0EsYUFBYUE7Z0JBQ0xBLGNBQVNBLEdBQVlBLEVBQUVBLENBQUNBO1lBVWhDQSxDQUFDQTtZQUdERCxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO1lBRTVHQSwwQkFBR0EsR0FBVkEsVUFBV0EsSUFBTUE7Z0JBQ2hCRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDeENBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUMxQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7Z0JBQ2JBLENBQUNBO2dCQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNkQSxDQUFDQTtZQUVNRiw2QkFBTUEsR0FBYkEsVUFBY0EsSUFBTUE7Z0JBQ25CRyxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDeENBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNuQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ25DQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDYkEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2RBLENBQUNBO1lBRU1ILGdDQUFTQSxHQUFoQkE7Z0JBQ0NJLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMvQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQzFCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDYkEsQ0FBQ0E7Z0JBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2RBLENBQUNBO1lBRU1KLCtCQUFRQSxHQUFmQTtnQkFBZ0JLLGNBQWFBO3FCQUFiQSxXQUFhQSxDQUFiQSxzQkFBYUEsQ0FBYkEsSUFBYUE7b0JBQWJBLDZCQUFhQTs7Z0JBQzVCQSxJQUFJQSxrQkFBa0JBLEdBQW1CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDakVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLGtCQUFrQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzNEQSxrQkFBa0JBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO2dCQUM5Q0EsQ0FBQ0E7WUFDRkEsQ0FBQ0E7WUFNREwsc0JBQVdBLGtDQUFRQTtnQkFIbkJBLG1IQUFtSEE7Z0JBQ25IQSxtSEFBbUhBO3FCQUVuSEE7b0JBQ0NNLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO2dCQUM5QkEsQ0FBQ0E7OztlQUFBTjtZQUNGQSxtQkFBQ0E7UUFBREEsQ0E3REFELEFBNkRDQyxJQUFBRDtRQTdEWUEsb0JBQVlBLEdBQVpBLFlBNkRaQSxDQUFBQTtJQUNGQSxDQUFDQSxFQW5Fa0JELE9BQU9BLEdBQVBBLG1CQUFPQSxLQUFQQSxtQkFBT0EsUUFtRXpCQTtBQUFEQSxDQUFDQSxFQW5FTSxXQUFXLEtBQVgsV0FBVyxRQW1FakI7QUNuRUEsb0NBQW9DO0FBRXJDLElBQU8sR0FBRyxDQXVCVDtBQXZCRCxXQUFPLEdBQUcsRUFBQyxDQUFDO0lBQ1hTLEFBR0FBOztPQURHQTtRQUNVQSxXQUFXQTtRQVN2QkMsbUhBQW1IQTtRQUNuSEEsbUhBQW1IQTtRQUVuSEEsU0FaWUEsV0FBV0EsQ0FZWEEsTUFBa0JBLEVBQUVBLE9BQXVCQTtZQUEzQ0Msc0JBQWtCQSxHQUFsQkEsV0FBa0JBO1lBQUVBLHVCQUF1QkEsR0FBdkJBLGNBQXVCQTtZQUN0REEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0E7WUFDckJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLE9BQU9BLENBQUNBO1lBQ3ZCQSxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUN6QkEsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7UUFDRkQsa0JBQUNBO0lBQURBLENBbEJBRCxBQWtCQ0MsSUFBQUQ7SUFsQllBLGVBQVdBLEdBQVhBLFdBa0JaQSxDQUFBQTtBQUNGQSxDQUFDQSxFQXZCTSxHQUFHLEtBQUgsR0FBRyxRQXVCVDtBQ3pCQSxvQ0FBb0M7QUFDckMsdUNBQXVDO0FBQ3ZDLDJDQUEyQztBQUUzQyxJQUFPLEdBQUcsQ0FpRlQ7QUFqRkQsV0FBTyxHQUFHLEVBQUMsQ0FBQztJQUNYQSxBQUdBQTs7T0FER0E7UUFDVUEsY0FBY0E7UUFnQjFCRyxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRW5IQSxTQW5CWUEsY0FBY0E7WUFvQnpCQyxJQUFJQSxDQUFDQSxXQUFXQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFtQkEsQ0FBQ0E7WUFDaERBLElBQUlBLENBQUNBLHdCQUF3QkEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBVUEsQ0FBQ0E7WUFDcERBLElBQUlBLENBQUNBLGVBQWVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQzFCQSxJQUFJQSxDQUFDQSw2QkFBNkJBLEdBQUdBLEVBQUVBLENBQUNBO1FBQ3pDQSxDQUFDQTtRQUdERCxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRTVHQSxzQ0FBYUEsR0FBcEJBLFVBQXFCQSxXQUEyQkEsRUFBRUEsWUFBdURBO1lBQXZERSw0QkFBdURBLEdBQXZEQSxlQUFzQkEsZUFBZUEsQ0FBQ0EsaUJBQWlCQTtZQUN4R0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDbERBLENBQUNBO1FBRU1GLHlDQUFnQkEsR0FBdkJBLFVBQXdCQSxXQUEyQkE7WUFDbERHLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLENBQUNBO1lBQ2pEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkJBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNuREEsQ0FBQ0E7UUFDRkEsQ0FBQ0E7UUFFTUgsMENBQWlCQSxHQUF4QkEsVUFBeUJBLG9CQUErQkEsRUFBRUEsWUFBdURBO1lBQXhGSSxvQ0FBK0JBLEdBQS9CQSx3QkFBK0JBO1lBQUVBLDRCQUF1REEsR0FBdkRBLGVBQXNCQSxlQUFlQSxDQUFDQSxpQkFBaUJBO1lBQ2hIQSxBQUNBQSx3Q0FEd0NBO1lBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxvQkFBb0JBLElBQUlBLENBQUNBLElBQUlBLFlBQVlBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLE1BQU1BLElBQUlBLENBQUNBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNwSEEsQUFDQUEsa0VBRGtFQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsR0FBR0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNwREEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDYkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ25FQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxvQkFBb0JBLElBQUlBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLGlCQUFpQkEsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxZQUFZQSxDQUFDQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDMUxBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBO1FBQ2pCQSxDQUFDQTtRQUVNSix5Q0FBZ0JBLEdBQXZCQTtZQUNDSyxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM1QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUMxQ0EsQ0FBQ0E7UUFFTUwsMENBQWlCQSxHQUF4QkEsVUFBeUJBLFFBQWVBLEVBQUVBLEtBQVlBLEVBQUVBLFlBQXVEQTtZQUF2RE0sNEJBQXVEQSxHQUF2REEsZUFBc0JBLGVBQWVBLENBQUNBLGlCQUFpQkE7WUFDOUdBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBO1lBQ3ZDQSxJQUFJQSxDQUFDQSw2QkFBNkJBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLFlBQVlBLENBQUNBO1FBQzdEQSxDQUFDQTtRQUVNTixpQ0FBUUEsR0FBZkEsVUFBZ0JBLFlBQXVEQTtZQUF2RE8sNEJBQXVEQSxHQUF2REEsZUFBc0JBLGVBQWVBLENBQUNBLGlCQUFpQkE7WUFDdEVBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1lBQ2ZBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0Q0EsQUFDQUEsMEhBRDBIQTtnQkFDMUhBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFlBQVlBLEdBQUdBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLDZCQUE2QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BLQSxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDdENBLENBQUNBO1lBQ0ZBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLENBQUNBLEVBQUVBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ2pGQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7UUFDRlAscUJBQUNBO0lBQURBLENBNUVBSCxBQTRFQ0csSUFBQUg7SUE1RVlBLGtCQUFjQSxHQUFkQSxjQTRFWkEsQ0FBQUE7QUFDRkEsQ0FBQ0EsRUFqRk0sR0FBRyxLQUFILEdBQUcsUUFpRlQ7QUNyRkEsb0NBQW9DO0FBQ3JDLDJDQUEyQztBQUUzQyxJQUFPLEdBQUcsQ0FnQ1Q7QUFoQ0QsV0FBTyxHQUFHLEVBQUMsQ0FBQztJQUNYQSxBQUdBQTs7T0FER0E7UUFDVUEsZUFBZUE7UUFPM0JXLG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBLFNBVllBLGVBQWVBLENBVWZBLE9BQWNBLEVBQUVBLFdBQWtCQTtZQUM3Q0MsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsT0FBT0EsQ0FBQ0E7WUFDdkJBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLFdBQVdBLENBQUNBO1FBQ2hDQSxDQUFDQTtRQUVERCxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRTVHQSw0Q0FBa0JBLEdBQXpCQSxVQUEwQkEsT0FBY0EsRUFBRUEsV0FBa0JBO1lBQzNERSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxJQUFJQSxPQUFPQSxJQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxJQUFJQSxlQUFlQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxXQUFXQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxJQUFJQSxlQUFlQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBO1FBQy9LQSxDQUFDQTtRQUVERix1QkFBdUJBO1FBRWhCQSwrQ0FBcUJBLEdBQTVCQSxVQUE2QkEsU0FBaUJBLEVBQUVBLFlBQW1CQTtZQUNsRUcsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFDRkgsc0JBQUNBO0lBQURBLENBM0JBWCxBQTJCQ1csSUFBQVg7SUEzQllBLG1CQUFlQSxHQUFmQSxlQTJCWkEsQ0FBQUE7QUFDRkEsQ0FBQ0EsRUFoQ00sR0FBRyxLQUFILEdBQUcsUUFnQ1Q7QUNuQ0Esb0NBQW9DO0FBQ3JDLDJDQUEyQztBQUUzQyxJQUFPLEdBQUcsQ0E4QlQ7QUE5QkQsV0FBTyxHQUFHLEVBQUMsQ0FBQztJQUNYQSxBQUdBQTs7T0FER0E7UUFDVUEsY0FBY0E7UUFPMUJlLG1IQUFtSEE7UUFDbkhBLG1IQUFtSEE7UUFFbkhBLFNBVllBLGNBQWNBLENBVWRBLFNBQWdCQSxFQUFFQSxZQUFtQkE7WUFDaERDLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLFNBQVNBLENBQUNBO1lBQzNCQSxJQUFJQSxDQUFDQSxZQUFZQSxHQUFHQSxZQUFZQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7UUFFREQsbUhBQW1IQTtRQUNuSEEsbUhBQW1IQTtRQUU1R0EsMkNBQWtCQSxHQUF6QkEsVUFBMEJBLE9BQWNBLEVBQUVBLFdBQWtCQTtZQUMzREUsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFTUYsOENBQXFCQSxHQUE1QkEsVUFBNkJBLFNBQWlCQSxFQUFFQSxZQUFtQkE7WUFDbEVHLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLElBQUlBLFNBQVNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLFlBQVlBLElBQUlBLElBQUlBLENBQUNBLFlBQVlBLElBQUlBLGVBQWVBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBQ0E7UUFDcklBLENBQUNBO1FBQ0ZILHFCQUFDQTtJQUFEQSxDQXpCQWYsQUF5QkNlLElBQUFmO0lBekJZQSxrQkFBY0EsR0FBZEEsY0F5QlpBLENBQUFBO0FBQ0ZBLENBQUNBLEVBOUJNLEdBQUcsS0FBSCxHQUFHLFFBOEJUO0FDakNELHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsMENBQTBDO0FBQzFDLHVDQUF1QztBQUN2QywyQ0FBMkM7QUFDM0MsMENBQTBDO0FBRTFDLEFBTUE7Ozs7O0dBREc7SUFDRyxlQUFlO0lBK0JwQm1CLFFBQVFBO0lBQ1JBLDJFQUEyRUE7SUFHM0VBLG1IQUFtSEE7SUFDbkhBLG1IQUFtSEE7SUFFbkhBLFNBdENLQSxlQUFlQTtRQXVDbkJDLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBO1FBRXBCQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN4QkEsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUN0Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsS0FBS0EsRUFBbUJBLENBQUNBO1FBQzdDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLEVBQUVBLENBQUNBO1FBRTdCQSxJQUFJQSxDQUFDQSxrQkFBa0JBLEdBQUdBLElBQUlBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLEVBQTRCQSxDQUFDQTtRQUMzRkEsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxHQUFHQSxJQUFJQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxZQUFZQSxFQUE0QkEsQ0FBQ0E7UUFDN0ZBLElBQUlBLENBQUNBLHFCQUFxQkEsR0FBR0EsSUFBSUEsV0FBV0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsWUFBWUEsRUFBMkNBLENBQUNBO1FBQzdHQSxJQUFJQSxDQUFDQSxpQkFBaUJBLEdBQUdBLElBQUlBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLEVBQWNBLENBQUNBO1FBQzVFQSxJQUFJQSxDQUFDQSxzQkFBc0JBLEdBQUdBLElBQUlBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLFlBQVlBLEVBQThCQSxDQUFDQTtRQUVqR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUMzQkEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUU3QkEsQUFJQUEsb0RBSm9EQTtRQUNwREEsNkNBQTZDQTtRQUM3Q0EsOERBQThEQTtRQUU5REEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7SUFDZEEsQ0FBQ0E7SUFFREQsbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUVuSEE7Ozs7Ozs7Ozs7T0FVR0E7SUFDSUEsK0JBQUtBLEdBQVpBO1FBQ0NFLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3RCQSxBQUNBQSxzQ0FEc0NBO1lBQ3RDQSxNQUFNQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUVBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsT0FBT0EsRUFBRUEsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV0RUEsQUFDQUEsMkNBRDJDQTtZQUMzQ0EsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxrQkFBa0JBLEVBQUVBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoR0EsTUFBTUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxxQkFBcUJBLEVBQUVBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esd0JBQXdCQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUVyR0EsSUFBSUEsQ0FBQ0EsMEJBQTBCQSxFQUFFQSxDQUFDQTtZQUVsQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsSUFBSUEsQ0FBQ0E7UUFDeEJBLENBQUNBO0lBQ0ZBLENBQUNBO0lBRURGOzs7Ozs7Ozs7Ozs7O09BYUdBO0lBQ0lBLDhCQUFJQSxHQUFYQTtRQUNDRyxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNyQkEsQUFDQUEscUNBRHFDQTtZQUNyQ0EsTUFBTUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxTQUFTQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBO1lBQzdFQSxNQUFNQSxDQUFDQSxtQkFBbUJBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFekVBLEFBQ0FBLDBDQUQwQ0E7WUFDMUNBLE1BQU1BLENBQUNBLG1CQUFtQkEsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbkdBLE1BQU1BLENBQUNBLG1CQUFtQkEsQ0FBQ0EscUJBQXFCQSxFQUFFQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLHdCQUF3QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFeEdBLEFBSUFBLDhCQUo4QkE7WUFDOUJBLHdDQUF3Q0E7WUFDeENBLGdDQUFnQ0E7WUFFaENBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3pCQSxDQUFDQTtJQUNGQSxDQUFDQTtJQUVESDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BOEJHQTtJQUNJQSxrREFBd0JBLEdBQS9CQSxVQUFnQ0EsTUFBYUEsRUFBRUEsT0FBNkNBLEVBQUVBLFdBQXFEQTtRQUFwR0ksdUJBQTZDQSxHQUE3Q0EsVUFBaUJBLGVBQWVBLENBQUNBLFlBQVlBO1FBQUVBLDJCQUFxREEsR0FBckRBLGNBQXFCQSxlQUFlQSxDQUFDQSxnQkFBZ0JBO1FBQ2xKQSxBQUNBQSx3Q0FEd0NBO1FBQ3hDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQSxlQUFlQSxDQUFDQSxPQUFPQSxFQUFFQSxXQUFXQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMvRkEsSUFBSUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7SUFDNUJBLENBQUNBO0lBRURKOzs7Ozs7Ozs7Ozs7T0FZR0E7SUFDSUEscURBQTJCQSxHQUFsQ0EsVUFBbUNBLE1BQWFBLEVBQUVBLE9BQTZDQSxFQUFFQSxXQUFxREE7UUFBcEdLLHVCQUE2Q0EsR0FBN0NBLFVBQWlCQSxlQUFlQSxDQUFDQSxZQUFZQTtRQUFFQSwyQkFBcURBLEdBQXJEQSxjQUFxQkEsZUFBZUEsQ0FBQ0EsZ0JBQWdCQTtRQUNySkEsSUFBSUEsZ0JBQWdCQSxHQUEwQkEsSUFBSUEsS0FBS0EsRUFBbUJBLENBQUNBO1FBRTNFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxXQUFXQSxFQUFFQSxDQUFDQTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksZUFBZSxHQUE0QyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNuRixFQUFFLENBQUMsQ0FBQyxlQUFlLElBQUksSUFBSSxJQUFJLGVBQWUsQ0FBQyxPQUFPLElBQUksT0FBTyxJQUFJLGVBQWUsQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztvQkFDakgsQUFDQSxpRUFEaUU7b0JBQ2pFLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQztnQkFHekQsQ0FBQztZQUNGLENBQUM7UUFDRixDQUFDLENBQUNBLENBQUNBO1FBRUhBLGdCQUFnQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsVUFBVUEsV0FBV0EsRUFBRUEsQ0FBQ0E7WUFDaEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDQSxDQUFDQTtRQUVIQSxJQUFJQSxDQUFDQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtJQUM1QkEsQ0FBQ0E7SUFFREw7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EyQ0dBO0lBQ0lBLGlEQUF1QkEsR0FBOUJBLFVBQStCQSxNQUFhQSxFQUFFQSxTQUFnQkEsRUFBRUEsWUFBdURBO1FBQXZETSw0QkFBdURBLEdBQXZEQSxlQUFzQkEsZUFBZUEsQ0FBQ0EsaUJBQWlCQTtRQUN0SEEsQUFDQUEsd0NBRHdDQTtRQUN4Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsR0FBR0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsU0FBU0EsRUFBRUEsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakdBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUVETjs7Ozs7Ozs7Ozs7OztPQWFHQTtJQUNJQSxvREFBMEJBLEdBQWpDQSxVQUFrQ0EsTUFBYUEsRUFBRUEsU0FBZ0JBLEVBQUVBLGNBQXlEQTtRQUF6RE8sOEJBQXlEQSxHQUF6REEsaUJBQXdCQSxlQUFlQSxDQUFDQSxpQkFBaUJBO1FBQzNIQSxJQUFJQSxnQkFBZ0JBLEdBQTBCQSxJQUFJQSxLQUFLQSxFQUFtQkEsQ0FBQ0E7UUFDM0VBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLFVBQVVBLFdBQVdBLEVBQUVBLENBQUNBO1lBQzdDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxjQUFjLEdBQTBDLFdBQVcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hGLEVBQUUsQ0FBQyxDQUFDLGNBQWMsSUFBSSxJQUFJLElBQUksY0FBYyxDQUFDLFNBQVMsSUFBSSxTQUFTLElBQUksY0FBYyxDQUFDLFlBQVksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDO29CQUNwSCxBQUNBLGlFQURpRTtvQkFDakUsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDO2dCQUd6RCxDQUFDO1lBQ0YsQ0FBQztRQUNGLENBQUMsQ0FBQ0EsQ0FBQ0E7UUFFSEEsZ0JBQWdCQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxXQUFXQSxFQUFFQSxDQUFDQTtZQUNoRCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM3RCxDQUFDLENBQUNBLENBQUNBO1FBRUhBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO0lBQzVCQSxDQUFDQTtJQUVEUDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkdBO0lBQ0lBLHVDQUFhQSxHQUFwQkEsVUFBcUJBLE1BQWFBO1FBQ2pDUSxBQUNBQSxzRkFEc0ZBO1FBQ3RGQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLGNBQWNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsZ0JBQWdCQSxFQUFFQSxDQUFDQTtJQUN4R0EsQ0FBQ0E7SUFHRFI7O09BRUdBO0lBQ0lBLGdDQUFNQSxHQUFiQTtRQUNDUyxpREFBaURBO1FBQ2pEQSwwSUFBMElBO0lBQzNJQSxDQUFDQTtJQU1EVCxzQkFBV0EsOENBQWlCQTtRQUg1QkEsbUhBQW1IQTtRQUNuSEEsbUhBQW1IQTthQUVuSEE7WUFDQ1UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQTtRQUNoQ0EsQ0FBQ0E7OztPQUFBVjtJQUVEQSxzQkFBV0EsZ0RBQW1CQTthQUE5QkE7WUFDQ1csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esb0JBQW9CQSxDQUFDQTtRQUNsQ0EsQ0FBQ0E7OztPQUFBWDtJQUVEQSxzQkFBV0EsaURBQW9CQTthQUEvQkE7WUFDQ1ksTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EscUJBQXFCQSxDQUFDQTtRQUNuQ0EsQ0FBQ0E7OztPQUFBWjtJQUVEQSxzQkFBV0EsNkNBQWdCQTthQUEzQkE7WUFDQ2EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7OztPQUFBYjtJQUVEQSxzQkFBV0Esa0RBQXFCQTthQUFoQ0E7WUFDQ2MsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0Esc0JBQXNCQSxDQUFDQTtRQUNwQ0EsQ0FBQ0E7OztPQUFBZDtJQVFEQSxzQkFBV0Esc0NBQVNBO1FBTnBCQTs7Ozs7V0FLR0E7YUFDSEE7WUFDQ2UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7UUFDeEJBLENBQUNBOzs7T0FBQWY7SUFHREEsbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUUzR0EsbUNBQVNBLEdBQWpCQSxVQUFrQkEsQ0FBZ0JBO1FBQ2pDZ0IsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsNEJBQTRCQSxDQUFDQSxDQUFDQTtJQUM3Q0EsQ0FBQ0E7SUFFT2hCLGlDQUFPQSxHQUFmQSxVQUFnQkEsQ0FBZ0JBO1FBQy9CaUIsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsMEJBQTBCQSxDQUFDQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFFT2pCLGdEQUFzQkEsR0FBOUJBLFVBQStCQSxDQUFlQTtRQUM3Q2tCLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLHlDQUF5Q0EsQ0FBQ0EsQ0FBQ0E7SUFDMURBLENBQUNBO0lBRU9sQixrREFBd0JBLEdBQWhDQSxVQUFpQ0EsQ0FBZUE7UUFDL0NtQixPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSwyQ0FBMkNBLENBQUNBLENBQUNBO0lBQzVEQSxDQUFDQTtJQUVEbkIsbUhBQW1IQTtJQUNuSEEsbUhBQW1IQTtJQUUzR0Esb0RBQTBCQSxHQUFsQ0E7UUFDQ29CLHVDQUF1Q0E7UUFFdkNBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO1FBOEVaQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNQQSxBQUNBQSw2Q0FENkNBO2dCQUN6Q0EsUUFBUUEsR0FBbUJBLFNBQVNBLENBQUNBLFdBQVdBLEVBQUVBLENBQUNBO1lBRXZEQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO1lBQy9DQSxJQUFJQSxDQUFDQSxrQkFBa0JBLENBQUNBLE1BQU1BLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBO1lBS2pEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDMUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3RDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN2Q0EsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQTtnQkFFN0NBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDUEEsSUFBSUEsQ0FBQ0Esa0JBQWtCQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQTtnQkFFbkNBLENBQUNBO1lBQ0ZBLENBQUNBO1FBQ0ZBLENBQUNBO1FBRURBLEFBQ0FBLHNCQURzQkE7UUFDdEJBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7SUFDbkNBLENBQUNBO0lBRURwQjs7T0FFR0E7SUFDS0EsMENBQWdCQSxHQUF4QkEsVUFBeUJBLElBQVFBO1FBQ2hDcUIsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBQ3hDQSxDQUFDQTtRQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM3QkEsQ0FBQ0E7SUF0ZURyQixZQUFZQTtJQUNFQSx1QkFBT0EsR0FBVUEsT0FBT0EsQ0FBQ0E7SUFFdkNBLHVLQUF1S0E7SUFFekpBLGlDQUFpQkEsR0FBVUEsUUFBUUEsQ0FBQ0E7SUFDcENBLDRCQUFZQSxHQUFVQSxLQUFLQSxDQUFDQTtJQUM1QkEsZ0NBQWdCQSxHQUFVQSxRQUFRQSxDQUFDQTtJQWllbERBLHNCQUFDQTtBQUFEQSxDQTFlQSxBQTBlQ0EsSUFBQSIsImZpbGUiOiJrZXktYWN0aW9uLWJpbmRlci5qcyIsInNvdXJjZVJvb3QiOiJEOi9Ecm9wYm94L3dvcmsvZ2l0cy9rZXktYWN0aW9uLWJpbmRlci10cy8iLCJzb3VyY2VzQ29udGVudCI6W251bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsXX0=