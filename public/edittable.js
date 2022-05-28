/* eslint-disable curly */
/* eslint-disable eqeqeq */
const vscode = acquireVsCodeApi();
let oldindexs = [];
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
    let dbname = document.querySelector("#dbname").value;
    let oldtbname = document.querySelector("#tbname").getAttribute("data-oldtbname");
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
        let oldname = tr.querySelector(".name").getAttribute("data-oldname");
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
        if(name != "" && type != "" && tr.getAttribute("changed") !== null){ // 需要判定changed屬性存在
            _sqlpart = `ALTER TABLE \`${dbname}\`.\`${oldtbname}\` CHANGE COLUMN \`${oldname}\` \`${name}\` ${type}`;
            if(length != "") _sqlpart += `(${length})`;
            if(prop != "") _sqlpart += ` ${prop}`;
            _sqlpart += `${allowNull}`;
            if(def != "") _sqlpart += ` DEFAULT '${def}'`;
            _sqlpart += `${ai}`;
            if(comment != "") _sqlpart += ` COMMENT '${comment}'`;
            colsSql.push(_sqlpart);
        }
        if(index != ""){
            if(index == "PRIMARY"){
                primarykeys.push(`\`${name}\``); 
            }else{
                if(indexs[index] == undefined) indexs[index] = {};
                if(indexs[index][indexName] == undefined) indexs[index][indexName] = [];
                indexs[index][indexName].push(`\`${name}\``);
            }
        }
    });


    // 暫時禁用主鍵修改
    // colsSql.push(`ALTER TABLE \`${dbname}\`.\`${oldtbname}\` DROP PRIMARY KEY, ADD PRIMARY KEY (` + primarykeys.join(",") + `)`);

    for (const iname of oldindexs) {
        colsSql.push(`DROP INDEX \`${iname}\` ON \`${dbname}\`.\`${oldtbname}\``);
    }

    for (const indextype in indexs) {
        let indexNames = indexs[indextype];
        for (const indexname in indexNames) {
            let indexName = (indexname)?" `" + indexname + "`":"";
            colsSql.push(`ALTER TABLE \`${dbname}\`.\`${oldtbname}\` ADD ` + indextype + indexName + " (" + indexNames[indexname].join(",") + ")");
        }
    }

    if(tbname != oldtbname){
        colsSql.push(`RENAME TABLE \`${dbname}\`.\`${oldtbname}\` TO \`${dbname}\`.\`${tbname}\``);
    }

    colsSql.push(`ALTER TABLE \`${dbname}\`.\`${tbname}\` COMMENT '${tbcomment}'`);
    colsSql.push(`ALTER TABLE \`${dbname}\`.\`${tbname}\` CHARACTER SET = ${charset}, COLLATE = ${charsetOrder}`);
    
    vscode.postMessage({
        "tbname": tbname,
        "tbcomment": tbcomment,
        "charsetOrder": charsetOrder,
        "charset": charset,
        "colsSql": colsSql
    });
}

function reset(){
    initData();
}

var data = null;
window.addEventListener("message",(e)=>{
    data = e.data;
    initData();
});

function initData(){
    document.querySelector("#dbname").value = data.dbname;
    document.querySelector("#tbname").value = data.tinfos[0].TABLE_NAME;
    document.querySelector("#tbname").setAttribute("data-oldtbname",data.tinfos[0].TABLE_NAME);
    document.querySelector("#tbcomment").value = data.tinfos[0].TABLE_COMMENT;
    document.querySelector("#charset").value = data.tinfos[0].TABLE_COLLATION;
    document.querySelectorAll(`#charset .options span`).forEach(ele=>{
        ele.removeAttribute("selected");
    });
    document.querySelector(`#charset .options span[value="${data.tinfos[0].TABLE_COLLATION}"]`).setAttribute("selected","");
    document.querySelector("#charset").setAttribute("value",data.tinfos[0].TABLE_COLLATION);
    updateOptionDisplay(document.querySelector("#charset"));

    let rows =  data.cinfos;
    document.querySelector("#cols").innerHTML = "";
    for (const row of rows) {
        let types = row.Type.match(/^(\w+)(\(\d+?\))?\s?(\w+)?/);
        let type = types[1].toUpperCase();
        let length = (types[2] != undefined)?types[2].replace(/\D/g,""):"";
        let prop = (types[3] != undefined)?types[3].toUpperCase():"";
        let allowNull = (row.Null.toLowerCase() != "no")?" checked":"";
        let ai = (row.Extra.toLowerCase() == "auto_increment")?" checked":"";

        let index = "";
        let indexname = "";
        for (const ind of data.iinfos) {
            if(row.Field == ind.Column_name){
                if(ind.Key_name == "PRIMARY") {
                    index = "PRIMARY";
                    indexname = "";
                }else if(ind.Index_type == "FULLTEXT") {
                    index = "FULLTEXT";
                    indexname = ind.Key_name;
                }else if(ind.Non_unique == 0){
                    index = "UNIQUE";
                    indexname = ind.Key_name;
                }else{
                    index = "INDEX";
                    indexname = ind.Key_name;
                }
                if (indexname && !oldindexs.includes(indexname)){
                    oldindexs.push(indexname);
                }
                break;
            }
        }


        let template = document.createElement( 'template' );
        let range = document.createRange();
        range.selectNodeContents(template);
        let elem = range.createContextualFragment(`<tr>
            <td><input type="text" class="name" value="${row.Field}" data-oldname="${row.Field}"></td>
            <td><input type="text" class="type" list="typelist" value="${type}"></td>
            <td><input type="number" class="length" value="${length}"></td>
            <td><input type="text" class="default" value="${row.Default || ""}"></td>
            <td><input type="text" class="prop" list="proplist" value="${prop}"></td>
            <td><input type="checkbox" class="null" value="isNull"${allowNull}></td>
            <td><input type="checkbox" class="ai" value="ai"${ai}></td>
            <td><input type="index" class="index" list="indexlist" onchange="indexChange(this)" value="${index}"><input type="index" class="indexName" value="${indexname}" data-oldindexname="${indexname}"></td>
            <td><input type="text" class="comment" value="${row.Comment}"></td>
        </tr>`);
        elem.querySelectorAll("input").forEach(ele=>{
            ele.addEventListener("change",function(){
                this.parentElement.parentElement.setAttribute("changed","");
            });
            if(ele.className == "index"){
                indexChange(ele);
            }
        });
        document.querySelector("#cols").appendChild(elem);
    }
}