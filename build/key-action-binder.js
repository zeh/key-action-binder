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
/// <reference path="./../libs/signals/SimpleSignal.ts" />
/**
 * Provides universal input control for game controllers and keyboard
 * More info: https://github.com/zeh/key-action-binder.ts
 *
 * @author zeh fernando
 */
var KeyActionBinder = (function () {
    function KeyActionBinder() {
    }
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    KeyActionBinder.prototype.KeyActionBinder = function () {
    };
    return KeyActionBinder;
})();

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiLCJjb3JlL0tleUFjdGlvbkJpbmRlci50cyJdLCJuYW1lcyI6WyJ6ZWhmZXJuYW5kbyIsInplaGZlcm5hbmRvLnNpZ25hbHMiLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbCIsInplaGZlcm5hbmRvLnNpZ25hbHMuU2ltcGxlU2lnbmFsLmNvbnN0cnVjdG9yIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuYWRkIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwucmVtb3ZlIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwucmVtb3ZlQWxsIiwiemVoZmVybmFuZG8uc2lnbmFscy5TaW1wbGVTaWduYWwuZGlzcGF0Y2giLCJ6ZWhmZXJuYW5kby5zaWduYWxzLlNpbXBsZVNpZ25hbC5udW1JdGVtcyIsIktleUFjdGlvbkJpbmRlciIsIktleUFjdGlvbkJpbmRlci5jb25zdHJ1Y3RvciIsIktleUFjdGlvbkJpbmRlci5LZXlBY3Rpb25CaW5kZXIiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sV0FBVyxDQW9FakI7QUFwRUQsV0FBTyxXQUFXO0lBQUNBLElBQUFBLE9BQU9BLENBb0V6QkE7SUFwRWtCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUUzQkMsQUFHQUE7O1dBREdBO1lBQ1VBLFlBQVlBO1lBWXhCQyxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO1lBRW5IQSxTQWZZQSxZQUFZQTtnQkFFeEJDLHFFQUFxRUE7Z0JBQ3JFQSw2Q0FBNkNBO2dCQUU3Q0EsYUFBYUE7Z0JBQ0xBLGNBQVNBLEdBQVlBLEVBQUVBLENBQUNBO2dCQVUvQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDckJBLENBQUNBO1lBR0RELG1IQUFtSEE7WUFDbkhBLG1IQUFtSEE7WUFFNUdBLDBCQUFHQSxHQUFWQSxVQUFXQSxJQUFNQTtnQkFDaEJFLEVB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