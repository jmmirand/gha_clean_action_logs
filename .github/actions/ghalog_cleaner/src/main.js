const core = require('@actions/core')
 
const inputText = "test limpiar logs ";
const numOfRepeats = parseInt(core.getInput('num_logs'));
 
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
