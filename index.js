function importCDN(url){
  try{
    const requestOptions = {
      method: "GET",
      redirect: "follow"
    };
    
    fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => eval(result))
      .catch((error) => console.error(error));
  }
  catch(e){
    console.error("Error while importing JS by CDN. Error package: " + url)
  }
}

let template = `
<bar>CODE_LANG</bar>
<content>
  <ol>
    CONTENT_CODE
  </ol>
</content>
<button>RUN</button>
<console></console>
`.replaceAll("\n","").replaceAll("  ","");

function createCodes(){
  //get all
  window.code = Array.from(document.getElementsByTagName("code"))

  //convert to objects
  for(let c in code){
    code[c] = new codes[code[c].getAttribute("lang")](code[c].innerHTML, code[c].getAttribute("lib"), code[c], c);
  }

  //create elements
  for(let c in code){
    code[c].target.innerHTML = template.replace("CODE_LANG","<img style='height:20px;' src='" + code[c].image + "'>").replace("CONTENT_CODE",code[c].cntNList.join(""));
    code[c].target.children[2].onclick = code[c].run;
    hljs.highlightElement(code[c].target.children[1])
  }
}

codes = {};
codes.JS = class{
  constructor(cnt, lib=[], target, id){
    this.image = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg";
    this.cnt = cnt.replaceAll("  ","");
    this.rnCnt = this.cnt.replaceAll("console.log(","ConsoleLog(" + id + ",")
    if(this.cnt.startsWith("\n")){
      this.cnt = this.cnt.replace("\n","")
    }
    if(this.cnt.endsWith("\n")){
      let t = this.cnt.split("\n");
      t.pop()
      this.cnt = t.join("\n")
    }
    this.cntList = this.cnt.split("\n");
    this.cntNList = []
    for(let c in this.cntList){
      this.cntNList.push("<li>" + this.cntList[c] + "</li>");
    }
    this.lib = lib;
    this.lang = "JS";
    this.target = target;
    this.target.id = id;
  }
  run(e){
    let th = code[e.target.parentNode.id];
    th.target.children[3].innerHTML = "";
    for(let l in th.lib){
      importCDN(lib[l])
    }
    ConsoleLog(th.target.id, eval(th.rnCnt));
  }
}

function ConsoleLog(id, txt){
  code[id].target.children[3].innerHTML += "<br>" + txt;
}
