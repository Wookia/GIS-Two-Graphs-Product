'use strict';

const ONE = "ONE";
const TWO = "TWO";
const RESULT = "RESULT";

const swal = require('sweetalert');
const Graphs = require('./graph.js').Graphs;

let gr;

function getData(type){
    let graph = gr.getGraph(type);
    let data = graph.graph;
    let headers = Object.keys(data);

    let result = "";
    let directed = gr.directed  ? 1 : 0;
    result = result + directed +"," + headers.toString() + "\n";
    for(let i in data){
        result = result + i + "," + Object.values(data[i]).toString() + "\n";
    }
    return result;
}

function initialize(){
    if(gr){
        gr.destroy();
    }
    gr = new Graphs(document.getElementById("directed").checked, document);
}

function applyLayout(type, name){
    let graph = gr.getGraph(type);
    graph.applyLayout(true, name);
}

window.onload = function(){
    
    const checkbox = document.getElementById('directed');

    checkbox.addEventListener('change', () => {
        swal({
            title: "Are you sure?",
            text: "Are you sure you want to change graphs type? It will remove all data.",
            icon: "warning",
            dangerMode: true,
            buttons: ["No", "Yes"]
          })
          .then(wantChange => {
            if (wantChange) {
                initialize();
            }
            else{
                document.getElementById("directed").checked = !document.getElementById("directed").checked;
            }
          });
    });

    const extended = document.getElementById('extended');
    extended.addEventListener('change', () => {
        if ( document.getElementById("ONE-card").classList.contains('s4') ){
            document.getElementById("ONE-card").classList.remove('s4');
            document.getElementById("ONE-card").classList.add('s6');
            document.getElementById("TWO-card").classList.remove('s4');
            document.getElementById("TWO-card").classList.add('s6');
            document.getElementById("RESULT-card").classList.remove('s4');
            document.getElementById("RESULT-card").classList.add('s12');
        }
        else{
            document.getElementById("ONE-card").classList.remove('s6');
            document.getElementById("ONE-card").classList.add('s4');
            document.getElementById("TWO-card").classList.remove('s6');
            document.getElementById("TWO-card").classList.add('s4');
            document.getElementById("RESULT-card").classList.remove('s12');
            document.getElementById("RESULT-card").classList.add('s4');
        }
        gr.resize();
    });
        
    initialize();
};

let ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('import-data', function (event, data) {
    let arrayData = CSVToArray(data.data, ',');
    if(arrayData[0][0] === "0" && gr.directed || arrayData[0][0] === "1" && !gr.directed){
        document.getElementById("directed").checked = arrayData[0][0] === "1";
        initialize();
    }
    else{
        gr.restartSingle(data.type);
    }
    let numberOfNodes = arrayData[0].length - 1;
    for(let i = 1; i <= numberOfNodes; i++){
        gr.addNode(data.type, null, 0, 0, true);
    }
    for(let i = 1; i <= numberOfNodes; i++){
        for(let j = 1; j <= numberOfNodes; j++){
            if(arrayData[i][j] === "1"){
                gr.addEdge(data.type, i - 1, j - 1);
            }
        }
    }
});

ipcRenderer.on('export-data', function (event, options) {
    ipcRenderer.send('save-data', {
        data: getData(options.type),
        fileName: options.fileName
    });
});

function CSVToArray( strData, strDelimiter ){
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec( strData )){
        var strMatchedDelimiter = arrMatches[ 1 ];
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            arrData.push( [] );
        }
        if (arrMatches[ 2 ]){
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            var strMatchedValue = arrMatches[ 3 ];
        }
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
}

module.exports.applyLayout = applyLayout;