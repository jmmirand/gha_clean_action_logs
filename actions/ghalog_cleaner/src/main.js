const core = require('@actions/core')
 
const inputText = "test limpiar logs ";
const numOfRepeats = parseInt(core.getInput('num_logs'));
 
let outputText = ""
let i;
for (i = 0; i < numOfRepeats; i++) {
    outputText += inputText;
}
 
core.setOutput('output_text', outputText)
