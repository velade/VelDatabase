/* eslint-disable curly */
/* eslint-disable eqeqeq */
const vscode = acquireVsCodeApi();
function addCol(){
    let template = document.createElement( 'template' );
    let range = document.createRange();
    range.selectNodeContents(template);
    let elem = range.createContextualFragment(`<tr>
    <td><input type="text" class="name"></td>
    <td><input type="text" class="type" list="typelist" value="INT"></td>
    <td><input type="number" class="length"></td>
    <td><input type="text" class="default"></td>
    <td><input type="text" class="prop" list="proplist"></td>
    <td><input type="checkbox" class="null" value="isNull"></td>
    <td><input type="checkbox" class="ai" value="ai"></td>
    <td><input type="index" class="index" list="indexlist" onchange="indexChange(this)"><input type="index" class="indexName"></td>
    <td><input type="text" class="comment"></td>
</tr>`);
    document.querySelector("#cols").appendChild(elem);
}

function indexChange(th){
    if(th.value == "PRIMARY" || th.value == ""){
        th.removeAttribute("data-half");
    }else{
        th.setAttribute("data-half","");
    }
}

function submit(){
    let tbname = document.querySelector("#tbname").value;
    let tbcomment = document.querySelector("#tbcomment").value;
    let charsetOrder = document.querySelector("#charset").getAttribute("value");
    let charset = "";
    if(charsetOrder != ""){
        let chars = charsetOrder.split("_");
        charset = chars[0];
    }
    let colsSql = [];
    let cols = document.querySelectorAll("#cols tr");
    let primarykeys = [];
    let indexs = {};
    cols.forEach((tr)=>{
        let name = tr.querySelector(".name").value;
        let type = tr.querySelector(".type").value;
        let length = tr.querySelector(".length").value;
        let def = tr.querySelector(".default").value;
        let prop = tr.querySelector(".prop").value;
        let allowNull = tr.querySelector(".null").checked?" NULL":" NOT NULL";
        let ai = tr.querySelector(".ai").checked?" AUTO_INCREMENT":"";
        let comment = tr.querySelector(".comment").value;
        let index = tr.querySelector(".index").value;
        let indexName = tr.querySelector(".indexName").value;
        
        let _sqlpart = "";
        if(name != "" && type != ""){
            _sqlpart = `\`${name}\` ${type}`;
            if(length != "") _sqlpart += `(${length})`;
            if(prop != "") _sqlpart += ` ${prop}`;
            _sqlpart += `${allowNull}`;
            if(def != "") _sqlpart += ` DEFAULT '${def}'`;
            _sqlpart += `${ai}`;
            if(comment != "") _sqlpart += ` COMMENT '${comment}'`;
            colsSql.push(_sqlpart);
            if(index != ""){
                if(index == "PRIMARY"){
                    primarykeys.push(`\`${name}\``); 
                }else{
                    if(indexs[index] == undefined) indexs[index] = {};
                    if(indexs[index][indexName] == undefined) indexs[index][indexName] = [];
                    indexs[index][indexName].push(`\`${name}\``);
                }
            }
        }
    });

    if(primarykeys.length > 0){
        colsSql.push("PRIMARY KEY (" + primarykeys.join(",") + ")");
    }
    for (const indextype in indexs) {
        let indexNames = indexs[indextype];
        for (const indexname in indexNames) {
            let indexName = (indexname)?" `" + indexname + "`":"";
            colsSql.push(indextype + indexName + " (" + indexNames[indexname].join(",") + ")");
        }
    }
    
    vscode.postMessage({
        "tbname": tbname,
        "tbcomment": tbcomment,
        "charsetOrder": charsetOrder,
        "charset": charset,
        "colsSql": colsSql.join(",")
    });
}