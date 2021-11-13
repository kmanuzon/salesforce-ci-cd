@IsTest
private class SampleTest
{
	@IsTest
	static void itShouldRunSampleTest()
	{
		// given
		insert new Continuous_Integration__c();

		// when
		List<Continuous_Integration__c> records = [SELECT Id FROM Continuous_Integration__c];

		// then
		System.assertEquals(false, records.isEmpty());
	}

	@IsTest
	static void itShouldDoSomethi()
	{
		// given

		// when
		SampleClass.doSomething();

		// then
	}
}
