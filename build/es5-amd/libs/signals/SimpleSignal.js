define(["require", "exports"], function (require, exports) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleSignal;
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnMvc2lnbmFscy9TaW1wbGVTaWduYWwudHMiXSwibmFtZXMiOlsiU2ltcGxlU2lnbmFsIiwiU2ltcGxlU2lnbmFsLmNvbnN0cnVjdG9yIiwiU2ltcGxlU2lnbmFsLmFkZCIsIlNpbXBsZVNpZ25hbC5yZW1vdmUiLCJTaW1wbGVTaWduYWwucmVtb3ZlQWxsIiwiU2ltcGxlU2lnbmFsLmRpc3BhdGNoIiwiU2ltcGxlU2lnbmFsLm51bUl0ZW1zIl0sIm1hcHBpbmdzIjoiO0lBQUE7O09BRUc7SUFDSDtRQVlDQSxtSEFBbUhBO1FBQ25IQSxtSEFBbUhBO1FBRW5IQTtZQWJBQyxxRUFBcUVBO1lBQ3JFQSw2Q0FBNkNBO1lBRTdDQSxhQUFhQTtZQUNMQSxjQUFTQSxHQUFZQSxFQUFFQSxDQUFDQTtRQVVoQ0EsQ0FBQ0E7UUFHREQsbUhBQW1IQTtRQUNuSEEsbUhBQW1IQTtRQUU1R0EsMEJBQUdBLEdBQVZBLFVBQVdBLElBQU1BO1lBQ2hCRSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUMxQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7WUFDYkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFFTUYsNkJBQU1BLEdBQWJBLFVBQWNBLElBQU1BO1lBQ25CRyxJQUFJQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN4Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ25CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBQ2JBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1FBQ2RBLENBQUNBO1FBRU1ILGdDQUFTQSxHQUFoQkE7WUFDQ0ksRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDMUJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1lBQ2JBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1FBQ2RBLENBQUNBO1FBRU1KLCtCQUFRQSxHQUFmQTtZQUFnQkssY0FBYUE7aUJBQWJBLFdBQWFBLENBQWJBLHNCQUFhQSxDQUFiQSxJQUFhQTtnQkFBYkEsNkJBQWFBOztZQUM1QkEsSUFBSUEsa0JBQWtCQSxHQUFtQkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7WUFDakVBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQVVBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLGtCQUFrQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQzNEQSxrQkFBa0JBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQzlDQSxDQUFDQTtRQUNGQSxDQUFDQTtRQU1ETCxzQkFBV0Esa0NBQVFBO1lBSG5CQSxtSEFBbUhBO1lBQ25IQSxtSEFBbUhBO2lCQUVuSEE7Z0JBQ0NNLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBO1lBQzlCQSxDQUFDQTs7O1dBQUFOO1FBQ0ZBLG1CQUFDQTtJQUFEQSxDQTdEQSxBQTZEQ0EsSUFBQTtJQTdERDtrQ0E2REMsQ0FBQSIsImZpbGUiOiJsaWJzL3NpZ25hbHMvU2ltcGxlU2lnbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBhdXRob3IgemVoIGZlcm5hbmRvXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGVTaWduYWw8RiBleHRlbmRzIEZ1bmN0aW9uPiB7XHJcblxyXG5cdC8vIFN1cGVyLXNpbXBsZSBzaWduYWxzIGNsYXNzIGluc3BpcmVkIGJ5IFJvYmVydCBQZW5uZXIncyBBUzNTaWduYWxzOlxyXG5cdC8vIGh0dHA6Ly9naXRodWIuY29tL3JvYmVydHBlbm5lci9hczMtc2lnbmFsc1xyXG5cclxuXHQvLyBQcm9wZXJ0aWVzXHJcblx0cHJpdmF0ZSBmdW5jdGlvbnM6QXJyYXk8Rj4gPSBbXTtcclxuXHJcblx0Ly8gVGVtcCB2YXJpYWJsZXNcclxuXHRwcml2YXRlIGlmcjpudW1iZXI7XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gQ09OU1RSVUNUT1IgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHR9XHJcblxyXG5cclxuXHQvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblx0Ly8gUFVCTElDIElOVEVSRkFDRSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRwdWJsaWMgYWRkKGZ1bmM6Rik6Ym9vbGVhbiB7XHJcblx0XHRpZiAodGhpcy5mdW5jdGlvbnMuaW5kZXhPZihmdW5jKSA9PSAtMSkge1xyXG5cdFx0XHR0aGlzLmZ1bmN0aW9ucy5wdXNoKGZ1bmMpO1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblxyXG5cdHB1YmxpYyByZW1vdmUoZnVuYzpGKTpib29sZWFuIHtcclxuXHRcdHRoaXMuaWZyID0gdGhpcy5mdW5jdGlvbnMuaW5kZXhPZihmdW5jKTtcclxuXHRcdGlmICh0aGlzLmlmciA+IC0xKSB7XHJcblx0XHRcdHRoaXMuZnVuY3Rpb25zLnNwbGljZSh0aGlzLmlmciwgMSk7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHJcblx0cHVibGljIHJlbW92ZUFsbCgpOmJvb2xlYW4ge1xyXG5cdFx0aWYgKHRoaXMuZnVuY3Rpb25zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0dGhpcy5mdW5jdGlvbnMubGVuZ3RoID0gMDtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRwdWJsaWMgZGlzcGF0Y2goLi4uYXJnczphbnlbXSk6dm9pZCB7XHJcblx0XHR2YXIgZnVuY3Rpb25zRHVwbGljYXRlOkFycmF5PEZ1bmN0aW9uPiA9IHRoaXMuZnVuY3Rpb25zLmNvbmNhdCgpO1xyXG5cdFx0Zm9yICh2YXIgaTpudW1iZXIgPSAwOyBpIDwgZnVuY3Rpb25zRHVwbGljYXRlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGZ1bmN0aW9uc0R1cGxpY2F0ZVtpXS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHQvLyBBQ0NFU1NPUiBJTlRFUkZBQ0UgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHB1YmxpYyBnZXQgbnVtSXRlbXMoKTpudW1iZXIge1xyXG5cdFx0cmV0dXJuIHRoaXMuZnVuY3Rpb25zLmxlbmd0aDtcclxuXHR9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9