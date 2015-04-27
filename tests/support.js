var test = require('tape');

test('Gamepad support', function (t) {
	t.plan(1);
    t.equal(typeof(navigator) != "undefined" && typeof navigator.getGamepads == "function", true);
});