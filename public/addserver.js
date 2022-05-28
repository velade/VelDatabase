const vscode = acquireVsCodeApi();
function addServer(){
    let dbtype = document.querySelector("#dbtype").getAttribute("value");
    let label = document.querySelector("#label").value;
    let host = document.querySelector("#host").value;
    let port = document.querySelector("#port").value;
    let user = document.querySelector("#user").value;
    let password = document.querySelector("#password").value;

    vscode.postMessage({"dbtype":dbtype,"label":label,"host":host,"port":port,"user":user,"password":password});
}