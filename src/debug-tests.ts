// DEBUG_TESTS just servers as a static bit of code we dump
// into a dummy pack and run with every action run, the idea
// being that there will always be at least one test present
// and able to run. Lacking this a badly supplied test
// can make the test fail to start and BDS to operate
// in its normal manner.
export const DEBUG_TESTS: string = `import * as GameTest from "@minecraft/server-gametest";

GameTest.register("debugtests", "always_fail", (_test) => {})
  .maxTicks(50)
  .tag(GameTest.Tags.suiteDebug);
GameTest.register("debugtests", "always_succeed", (test) => {
  test.runAfterDelay(40, () => {
    test.succeed();
  });
})
  .maxTicks(50)
  .tag(GameTest.Tags.suiteDebug);`

export const DEBUG_TEST_TAG: string = 'debugtests'
