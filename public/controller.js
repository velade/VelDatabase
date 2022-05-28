/* eslint-disable curly */
/* eslint-disable eqeqeq */
document.querySelectorAll(".select").forEach(ele=>{
    updateOptionDisplay(ele);
});

document.querySelectorAll(".select").forEach(ele=>{
    ele.addEventListener("click",function(e){
        if(this.getAttribute("data-coll") == "yes"){
            document.body.style.overflow = "hidden";
            let optionsHeight = window.getComputedStyle(this.querySelector(".options")).height;
            let optionHeight = window.getComputedStyle(this.querySelector(".options > span")).height;
            let options = this.querySelectorAll(".options > span");
            let optionindex = 0;
            for (const i in options) {
                if(options[i].getAttribute("selected") !== null){
                    optionindex = i;
                    break;
                }
            }
            let subTop = parseFloat(optionHeight) * optionindex;
            this.querySelector(".options").setAttribute("style","top:0;");
            this.setAttribute("data-coll","no");
            this.setAttribute("style",`top: -${subTop}px; height:${optionsHeight}`);
        }else{
            document.body.style.overflow = "";
            let optionHeight = window.getComputedStyle(this.querySelector(".options > span")).height;
            let options = this.querySelectorAll(".options > span");
            let optionindex = 0;
            for (const i in options) {
                if(options[i].getAttribute("selected") !== null){
                    optionindex = i;
                    break;
                }
            }
            let subTop = parseFloat(optionHeight) * optionindex;
            this.querySelector(".options").setAttribute("style",`top:-${subTop}px;`);
            this.setAttribute("data-coll","yes");
            this.setAttribute("style",`top: 0; height:${optionHeight}`);
        }
    });
});

function updateOptionDisplay(ele){
    let optionHeight = window.getComputedStyle(ele.querySelector(".options > span")).height;
    let options = ele.querySelectorAll(".options > span");
    let optionindex = 0;
    for (const i in options) {
        if(options[i].getAttribute("selected") !== null){
            optionindex = i;
            break;
        }
    }
    let subTop = parseFloat(optionHeight) * optionindex;
    ele.querySelector(".options").setAttribute("style",`top:-${subTop}px;`);
    ele.setAttribute("data-coll","yes");
    ele.setAttribute("style",`top: 0; height:${optionHeight}`);
}
document.querySelectorAll(".select").forEach(ele=>{
    ele.addEventListener("wheel",function(e){
        let nowoption = this.querySelector(".options > span[selected]");
        if(e.wheelDeltaY > 0){
            let prevoption = nowoption.previousElementSibling;
            if(prevoption == null) return;
            let value = prevoption.getAttribute("value");
            nowoption.removeAttribute("selected");
            prevoption.setAttribute("selected","");
            prevoption.parentElement.parentElement.setAttribute("value",value);
        }else{
            let nextoption = nowoption.nextElementSibling;
            if(nextoption == null) return;
            let value = nextoption.getAttribute("value");
            nowoption.removeAttribute("selected");
            nextoption.setAttribute("selected","");
            nextoption.parentElement.parentElement.setAttribute("value",value);
        }
        if(this.getAttribute("data-coll") == "yes"){
            let optionHeight = window.getComputedStyle(this.querySelector(".options > span")).height;
            let options = this.querySelectorAll(".options > span");
            let optionindex = 0;
            for (const i in options) {
                if(options[i].getAttribute("selected") !== null){
                    optionindex = i;
                    break;
                }
            }
            let subTop = parseFloat(optionHeight) * optionindex;
            this.querySelector(".options").setAttribute("style",`top:-${subTop}px;`);
        }else{
            let optionsHeight = window.getComputedStyle(this.querySelector(".options")).height;
            let optionHeight = window.getComputedStyle(this.querySelector(".options > span")).height;
            let options = this.querySelectorAll(".options > span");
            let optionindex = 0;
            for (const i in options) {
                if(options[i].getAttribute("selected") !== null){
                    optionindex = i;
                    break;
                }
            }
            let subTop = parseFloat(optionHeight) * optionindex;
            this.setAttribute("style",`top:-${subTop}px;height:${optionsHeight}`);
        }
    });
});

document.querySelectorAll(".select > .options > span").forEach(ele=>{
    ele.addEventListener("click",function(e){
        let value = this.getAttribute("value");
        let options = this.parentElement.parentElement.querySelectorAll(".options > span");
    
        this.parentElement.parentElement.setAttribute("value",value);
    
        for (const i in options) {
            if(options[i].tagName != undefined && options[i].getAttribute("selected") !== null){
                options[i].removeAttribute("selected");
            }
            if(options[i].tagName != undefined && options[i].getAttribute("value") == value){
                options[i].setAttribute("selected","");
            }
        }
    });
});