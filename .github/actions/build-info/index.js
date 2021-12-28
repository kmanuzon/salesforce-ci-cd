const core = require('@actions/core');
const github = require('@actions/github');

/*
try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
*/


const main = async() => {
  /*
  const token = core.

  const query = {

  };

  const octokit = new GitHub(token);
  */

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);


  core.notice('Something happened that you might want to know about.', { title: 'Foo Bar' });
};



main().catch((error) => core.setFailed(error.message));
