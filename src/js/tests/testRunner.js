/*
	Super simple test runner. Exposes the following global functions:
	 - `test`
	 - `it`
	 - `describe`

	The use is standard. `describe()` calls can be nested.
	All functions allow chaining `.only` so only that test (or group) runs.
	Pairs will with Michael Jackson's "expect" library.
*/

((global) => {
	// Private internals
	// --------------------------------

	// Easily allow collapsing/expanding entire tree of tests.
	const expandAll = true;

	// Types
	const TestType = Symbol('Test');
	const GroupType = Symbol('Group');

	// Test queue. Can include recursively nested groups of tests.
	let testQueue = [];

	// Override for `.only` variants.
	let testOverride = null;

	// Track number of tests run.
	let runTestCount = 0;

	// Run test and log output. Also handles groups.
	function runTest(test) {
		switch (test.type) {
			// Single test. We can just run it.
			case TestType:
				runTestCount++;
				try {
					test.testFn();
					console.log(
						`%cPASS%c ${test.name}`,
						'color: #fff; background-color: #01a54f; padding: 1px 6px; border-radius: 2px',
						'color: #01a54f;'
					);
				}
				catch(e) {
					console.log(
						`%cFAIL%c ${test.name}`,
						'color: #fff; background-color: #e50000; padding: 1px 6px; border-radius: 2px',
						'color: #e50000;'
					);
					console.error(e);
				}
				break;

			// Group of tests. Recursively run sub-tests with grouped output.
			case GroupType:
				expandAll ? console.group(test.name) : console.groupCollapsed(test.name);
				test.tests.forEach(runTest);
				console.groupEnd();
				break;

			default:
				throw new Error('Invalid object type');
		}

	}

	// Run all tests.
	// --------------------------------

	// Allow tests to be queued syncronously. They'll all run on the next event loop tick.
	setTimeout(() => {
		runTestCount = 0;
		let startTime = performance.now();
		if (testOverride) {
			console.log(
				'%cTest Runner: Hiding all but one test result.',
				'color: #700; background-color: #fdd; padding: 2px 10px; border-radius: 20px;'
			);
			runTest(testOverride);
		} else {
			testQueue.forEach(runTest);
		}
		const runTime = performance.now() - startTime;
		console.log(`Test Runner: Ran ${runTestCount} ${runTestCount === 1 ? 'test' : 'tests'} in ${runTime.toFixed(2)} ms.`);
	});


	// The public API.
	// --------------------------------
	function describe(name, queueTests) {
		const oldQueue = testQueue;
		testQueue = [];
		queueTests();
		oldQueue.push({ type: GroupType, name: name, tests: testQueue });
		testQueue = oldQueue;
	}

	describe.only = function describeOnly(name, queueTests) {
		const oldQueue = testQueue;
		testQueue = [];
		queueTests();
		testOverride = { type: GroupType, name: name, tests: testQueue };
		testQueue = oldQueue;
	};

	function test(name, testFn) {
		testQueue.push({ type: TestType, name, testFn });
	}

	test.only = function testOnly(name, testFn) {
		testOverride = { type: TestType, name, testFn };
	}

	// Expose API as globals.
	global.describe = describe;
	global.test = test;
	global.it = test;

})(window);




// Test the test runner.
// Try chaining `.only` to any of the tests below.
// --------------------------------

/*
it('it() is an alias of test()', () => {});
test('Tests can be isolated', () => {});
describe('or grouped.', () => {
	test('Test A', () => {});
	test('Test B', () => {});
});
test('A failed test...', () => {
	throw new Error('BUG')
});
test('...does not block other tests.', () => {});
describe('Groups', () => {
	describe('can be', () => {
		describe('deeply', () => {
			describe('nested.', () => {
				test('Test A', () => {});
				test('Test B', () => {});
			});
		});
	});
});
*/
