const github = require('@actions/github');
const core = require('@actions/core')
 
const inputText = "test limpiar logs ";
const numOfRepeats = parseInt(core.getInput('num_logs'));

// Funcion que me va permitir dos ejecuciones de workflows
// Compara las fechas de ulitma actualizacion
function compareRuns(a, b) {
  return b["date"] - a["date"];
}

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
        pull_number: 1,
        mediaType: {
          format: 'diff'
        }
    });

    console.log(pullRequest);

    // Lista de Workflows del Repo 
    const { data: listWorkflows } = await octokit.rest.actions.listRepoWorkflows({
      owner: 'jmmirand',
      repo: 'gha_clean_action_logs',
    });

    lstRuns = []
    for (const [i, v] of listWorkflows["workflows"].entries()) {
      wfName = v["name"]
      wfPath = v["path"]
      wId = v["id"]

      // Lista Ejecuciones por workflows
      const { data: listWorkflowRuns } = await octokit.rest.actions.listWorkflowRuns({
        owner: 'jmmirand',
        repo: 'gha_clean_action_logs',
        workflow_id: wId
      });


      // Agrupo todoas las Ejecuciones
      for (const [iR, vR] of listWorkflowRuns["workflow_runs"].entries()) {
          newRun = {}
          newRun["id"] = vR["id"]
          updatedDate = new Date (vR["updated_at"])
          newRun["date"] = updatedDate
          newRun["workflow_name"] = wfName
          newRun["workflow_path"] = wfPath
          newRun["workflow_id"] = wId
          lstRuns.push(newRun)
      }
    }

    // Ordeno por fecha las ejecuciones
    lstRuns.sort(compareRuns)

    // Borro todas las ejecuciones a partir de la n-esima ejecucion
    console.log(lstRuns)

    // Agrupo todoas las Ejecuciones
    iPos = 0 ;
    for (const [i, v] of lstRuns.entries()) {
      iPos = iPos + 1
      if (iPos > 10) {
        const { data: deletedWorkflowRun } = await octokit.rest.actions.deleteWorkflowRun({
          owner: 'jmmirand',
          repo: 'gha_clean_action_logs',
          run_id: v["id"]
        });       
        console.log("deleted log " + iPos + " / " + i)
        console.log("date: " + v["date"] )
      }

    }

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
