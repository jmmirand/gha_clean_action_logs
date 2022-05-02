const github = require('@actions/github');
const core = require('@actions/core')
 
const inputText = "test limpiar logs ";
const numOfRepeats = parseInt(core.getInput('num_logs'));

async function run() {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // myToken: ${{ secrets.GITHUB_TOKEN }}
    // https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret
    const myToken = core.getInput('myToken');

    const octokit = github.getOctokit(myToken)

    // You can also pass in additional options as a second parameter to getOctokit
    // const octokit = github.getOctokit(myToken, {userAgent: "MyActionVersion1"});

    const { data: pullRequest } = await octokit.rest.pulls.get({
        owner: 'jmmirand',
        repo: 'gha_clean_action_logs',
        pull_number: º,
        mediaType: {
          format: 'diff'
        }
    });

    console.log(pullRequest);
}

run();




let outputText = ""
let i;
for (i = 0; i < numOfRepeats; i++) {
    outputText += inputText;
}


try {

  

  core.debug('Inside try block');
  
  core.warning('test Warning');

  core.info('INFO Output to the actions build log')

  core.notice('This is a message that will also emit an annotation')
}
catch (err) {
  core.error(`Error ${err}, action may still succeed though`);
}

 
core.setOutput('output_text', outputText)
