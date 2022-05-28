/* eslint-disable curly */
/* eslint-disable eqeqeq */
const vscode = acquireVsCodeApi();
let colCount = 0;
function reset(){
    initData();
}

var data = null;
window.addEventListener("message",(e)=>{
    data = e.data;
    initData();
});

function initData(){
    // 初始化呈現區域
    document.querySelector("#rows").textContent = "";
    // 讀取範圍
    document.querySelector(".range").textContent = (data.range[0] + 1) + "-" + Math.min((data.range[1] + data.range[0]),data.rowNum) + "/" + data.rowNum;
    // 讀取表頭
    if(document.querySelectorAll("#cols th").length == 0){
        let cols = data.cinfos;
        let thStr = "<tr>";
        colCount = cols.length;
        for (const col of cols) {
            thStr += `<th data-orderby="None" data-field="${col.Field}"><span>${col.Field}</span><span class="subth">${col.Comment}</span>
            <svg height='16' width='16' xmlns='http://www.w3.org/2000/svg'>
                <g transform='translate(-533 -97)'>
                    <path class="ColorScheme-Text" d='M546 107l-5-5-5 5z' fill='currentColor'/>
                </g>
            </svg>
            </th>`;
        }
        thStr += `<th data-orderby="None" class="not-col">移除</th></tr>`;
        let template = document.createElement( 'template' );
        let range = document.createRange();
        range.selectNodeContents(template);
        let elem = range.createContextualFragment(thStr);
        elem.querySelectorAll("th:not(.not-col)").forEach(ele=>{
            ele.addEventListener("click",function(){
                let _this = this;
                let orderby = _this.getAttribute("data-orderby");
                if(orderby == "None" || orderby == "DESC"){
                    document.querySelectorAll("th:not(.not-col)").forEach(el=>{
                        if(el != _this) el.setAttribute("data-orderby","None");
                    });
                    this.setAttribute("data-orderby","ASC");
                }else{
                    document.querySelectorAll("th:not(.not-col)").forEach(el=>{
                        if(el != _this) el.setAttribute("data-orderby","None");
                    });
                    this.setAttribute("data-orderby","DESC");
                }
                // 重新獲取排序後數據
                let args = {"command":"append"};
                let orderCol = document.querySelector("th:not([data-orderby=None]):not(.not-col)");
                if(orderCol){
                    args.order = `\`${orderCol.getAttribute("data-field")}\` ${orderCol.getAttribute("data-orderby")}`;
                }
                args.from = 0;
                vscode.postMessage(args);
            });
        });
        document.querySelector("#cols").appendChild(elem);
    }

    // 讀取數據
    for (const ri in data.rows) {
        let row = data.rows[ri];
        let template2 = document.createElement( 'template' );
        let range2 = document.createRange();
        range2.selectNodeContents(template2);
        let dataRow = "<tr data-index=" + ri + ">";
        for (let i = 0; i < colCount; i++) {
            let cla = document.querySelectorAll("th")[i].getAttribute("data-field");
            dataRow += `<td><input type="text" data-class="${cla}" data-oriData="${row[cla]}" value="${row[cla]}"></td>`;
        }
        dataRow += `<td><input type="checkbox" class="removeRow" value="${ri}"></td></tr>`;
        let elem2 = range2.createContextualFragment(dataRow);
        elem2.querySelectorAll("input").forEach(ele2=>{
            ele2.addEventListener("change",function(){
                this.parentElement.parentElement.setAttribute("changed","");
            });
        });
        document.querySelector("#rows").appendChild(elem2);
    }
}

function addCol(){
    let template = document.createElement( 'template' );
    let range = document.createRange();
    range.selectNodeContents(template);
    let emptyRow = "<tr data-index=\"new\" changed>";
    for (let i = 0; i < colCount; i++) {
        let cla = document.querySelectorAll("th")[i].getAttribute("data-field");
        emptyRow += `<td><input type="text" data-oriData="" data-class="${cla}"></td>`;
    }
    emptyRow += `<td><input type="checkbox" onchange="removeEmpty(this)"></td></tr>`;
    let elem = range.createContextualFragment(emptyRow);
    document.querySelector("#rows").appendChild(elem);
}

function removeEmpty(th){
    if(th.checked){
        setTimeout((th)=>{
            if(th.checked){
                th.parentElement.parentElement.remove();
            }
        },1000,th);
    }
}

function dataPrev(){
    let step = data.range[1];
    let args = {"command":"append"};
    let orderCol = document.querySelector("th:not([data-orderby=None]):not(.not-col)");
    if(orderCol){
        args.order = `\`${orderCol.getAttribute("data-field")}\` ${orderCol.getAttribute("data-orderby")}`;
    }
    let from = data.range[0] - step;
    if(from < 0){
        from = 0;
    }
    args.from = from;
    vscode.postMessage(args);
}

function dataNext(){
    let step = data.range[1];
    let args = {"command":"append"};
    let orderCol = document.querySelector("th:not([data-orderby=None]):not(.not-col)");
    if(orderCol){
        args.order = `\`${orderCol.getAttribute("data-field")}\` ${orderCol.getAttribute("data-orderby")}`;
    }
    let from = data.range[0] + step;
    if(from >= data.rowNum){
        from = data.rowNum - (data.rowNum % step);
    }
    args.from = from;
    vscode.postMessage(args);
}

// 編輯部份邏輯
/*
- 原始數據留存
- 數據獲取
- 比對原始數據（驗證）
- 過期提示
- 一致後全字段條件更新
- 更新數據條目統計
*/

function submit() {
    let changedRows = document.querySelectorAll("tbody tr[changed]");
    let subdata = {"command":"save","updateRows":[],"delRows":[],"addRows":[]};
    for (const changedRow of changedRows) {
        let oldData = {};
        let newData = {};
        let fields = changedRow.querySelectorAll("input");
        for (const field of fields) {
            if(field.getAttribute("data-oriData") !== null){
                oldData[field.getAttribute("data-class")] = field.getAttribute("data-oriData");
                newData[field.getAttribute("data-class")] = field.value;
            }
        }

        if(changedRow.getAttribute("data-index") == "new"){
            for (const rowinfo of data.cinfos) {
                if(rowinfo.Extra.toLowerCase() == "auto_increment" && newData[rowinfo.Field] == ""){
                    delete newData[rowinfo.Field];
                }
            }
            let fs = Object.keys(newData);
            let vs = Object.values(newData);
            subdata.addRows.push(`INSERT INTO \`${data.dbname}\`.\`${data.tbname}\` (\`${fs.join("`,`")}\`) VALUES ('${vs.join("','")}')`);
        }else if(changedRow.querySelector(".removeRow").checked){
            let fs = Object.keys(oldData);
            let vs = Object.values(oldData);
            let whereStr = new Array();
            for (const fi in fs) {
                let v = (vs[fi] !== undefined)?vs[fi]:null;
                if(v !== null){
                    whereStr.push(`${fs[fi]}='${v}'`);
                }
            }
            whereStr = whereStr.join(" AND ");
            subdata.delRows.push(`DELETE FROM \`${data.dbname}\`.\`${data.tbname}\` WHERE ${whereStr}`);
        }else{
            let ofs = Object.keys(oldData);
            let ovs = Object.values(oldData);
            let whereStr = new Array();
            for (const fi in ofs) {
                let ov = (ovs[fi] !== undefined)?ovs[fi]:null;
                if(ov !== null){
                    whereStr.push(`${ofs[fi]}='${ov}'`);
                }
            }
            whereStr = whereStr.join(" AND ");

            let nfs = Object.keys(newData);
            let nvs = Object.values(newData);
            let updateStr = new Array();
            for (const fi in nfs) {
                let nv = (nvs[fi] !== undefined)?nvs[fi]:null;
                if(nv !== null){
                    updateStr.push(`${nfs[fi]}='${nv}'`);
                }
            }
            updateStr = updateStr.join(", ");

            subdata.updateRows.push(`UPDATE \`${data.dbname}\`.\`${data.tbname}\` SET ${updateStr} WHERE ${whereStr}`);
        }
    }
    vscode.postMessage(subdata);
}