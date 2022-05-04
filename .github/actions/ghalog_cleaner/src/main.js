const github = require('@actions/github');
const core = require('@actions/core')

 
const owner = process.env.GITHUB_REPOSITORY_OWNER
const repo = process.env.GITHUB_REPOSITORY.replace(owner + "/","")

console.log("RepoName = " + owner + "/" + repo)



// Recupero los parametros de la acción 
const numOfRepeats = parseInt(core.getInput('num_runs'));
const myToken = core.getInput('myToken');

// Funcion que me va permitir dos ejecuciones de workflows
// Compara las fechas de ulitma actualizacion
function compareRuns(a, b) {
  return b["date"] - a["date"];
}

async function run() {

    const octokit = github.getOctokit(myToken)

    // Lista de Workflows del Repo 
    const { data: listWorkflows } = await octokit.rest.actions.listRepoWorkflows({
      owner: owner,
      repo: repo,
    });

    lstRuns = []
    for (const [i, v] of listWorkflows["workflows"].entries()) {
      wfName = v["name"]
      wfPath = v["path"]
      wId = v["id"]

      // Lista Ejecuciones por workflows
      const { data: listWorkflowRuns } = await octokit.rest.actions.listWorkflowRuns({
        owner: owner,
        repo: repo,
        workflow_id: wId
      });

      // console.log(listWorkflowRuns)

      // Agrupo todoas las Ejecuciones , si fuera necesario aplico filtro.
      for (const [iR, vR] of listWorkflowRuns["workflow_runs"].entries()) {
          newRun = {}
          newRun["id"] = vR["id"]
          updatedDate = new Date (vR["updated_at"])
          newRun["date"] = updatedDate
          newRun["updated_date"] = updatedDate
          createdDate = new Date (vR["created_at"])
          newRun["created_date"] = createdDate
          newRun["run_number"] = vR["run_number"]
          newRun["name"] = vR["name"]
          newRun["head_branch"] = vR["head_branch"]
          

          newRun["workflow_name"] = wfName
          newRun["workflow_path"] = wfPath
          newRun["workflow_id"] = wId
          lstRuns.push(newRun)
      }
    }

    // Ordeno por fecha las ejecuciones
    lstRuns.sort(compareRuns)

    // Borro todas las ejecuciones a partir de la n-esima ejecucion
    //console.log(lstRuns)

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

        console.log("deleted run_number: " + v["run_number"])
        console.log("Title: " + v["name"])
        console.log("Branch: " + v["head_branch"])
        console.log("Created date: " + v["created_date"] )
        console.log("Updated date: " + v["updated_date"] )
        console.log("")

      }

    }

}

run();
