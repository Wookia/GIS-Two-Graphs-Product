'use strict';

const ONE = "ONE";
const TWO = "TWO";
const RESULT = "RESULT";

const cytoscape = require('cytoscape');

class Graphs{
    constructor(directed, document){
        this.graphOne = new Graph(ONE, this, directed, document);
        this.graphTwo = new Graph(TWO, this, directed, document);
        this.graphResult = new Graph(RESULT, this, directed, document);
        this.directed = directed;
        this.document = document;
    }

    restartSingle(name){
        if(name == ONE) {
            this.graphOne.destroy();
            this.graphOne = new Graph(ONE, this, this.directed, this.document);
        }
        if(name == TWO) {
            this.graphTwo.destroy();
            this.graphTwo = new Graph(TWO, this, this.directed, this.document);
        }
        this.graphResult.destroy();
        this.graphResult = new Graph(RESULT, this, this.directed, this.document);
    }

    resize(){
        this.graphOne.cy.resize();
        this.graphTwo.cy.resize();
        this.graphResult.cy.resize();
        this.graphOne.cy.fit();
        this.graphTwo.cy.fit();
        this.graphResult.cy.fit();
    }

    getGraph(name){
        if(name == ONE){
            return this.graphOne;
        }
        else if(name == TWO){
            return this.graphTwo;
        }
        else if(name == RESULT){
            return this.graphResult;
        }
    }

    destroy(){
        this.graphOne.destroy();
        this.graphTwo.destroy();
        this.graphResult.destroy();
    }

    getGraphs(to){
        let graph;
        let secondGraph;
        if(to == ONE){
            graph = this.graphOne;
            secondGraph = this.graphTwo;
        }
        else if(to == TWO){
            graph = this.graphTwo;
            secondGraph = this.graphOne;
        }
        return {graph: graph, secondGraph: secondGraph};
    }

    getName(to, name, key){
        if(to == ONE){
            return name+'_'+key;
        }
        else if(to == TWO){
            return key+'_'+name;
        }
    }

    addNode(graphName, name, x, y, isImport){
        let graphs = this.getGraphs(graphName);
        let graph = graphs.graph;
        let secondGraph = graphs.secondGraph;
        name = graph.addNode(name, x, y, isImport);
        let secondGraphMatrix = secondGraph.getGraph();
        for (let key in secondGraphMatrix){
            let newName = this.getName(graphName, name, key);
            this.graphResult.addNode(newName, 0, 0, isImport);
        }
        for (let key in secondGraphMatrix){
            let newName = this.getName(graphName, name, key);
            for(let subKey in secondGraphMatrix[key]){
                if(secondGraphMatrix[key][subKey]){
                    let secondName = this.getName(graphName, name, subKey);
                    this.graphResult.addEdge(newName, secondName);
                    if(!this.directed){
                        this.graphResult.addEdge(secondName, newName);
                    }
                }
            }
        }
    }

    deleteNode(graphName, name){
        let graphs = this.getGraphs(graphName);
        let graph = graphs.graph;
        let secondGraph = graphs.secondGraph;
        graph.deleteNode(name);
        for (let key in secondGraph.getGraph()){
            let newName = this.getName(graphName, name, key);
            this.graphResult.deleteNode(newName);
        }
    }

    addEdge(graphName, first, second){
        let graphs = this.getGraphs(graphName);
        let graph = graphs.graph;
        let secondGraph = graphs.secondGraph;
        graph.addEdge(first, second);
        if(!this.directed){
            graph.addEdge(second, first);  
        }
        for (let key in secondGraph.getGraph()){
            let firstName = this.getName(graphName, first, key)
            let secondName = this.getName(graphName, second, key)
            this.graphResult.addEdge(firstName, secondName)
            if(!this.directed){
                this.graphResult.addEdge(secondName, firstName)
            }
        }
    }

    deleteEdge(graphName, first, second){
        let graphs = this.getGraphs(graphName);
        let graph = graphs.graph;
        let secondGraph = graphs.secondGraph;
        graph.deleteEdge(first, second);
        if(!this.directed){
            graph.deleteEdge(second, first);  
        }
        for (let key in secondGraph.getGraph()){
            let firstName = this.getName(graphName, first, key)
            let secondName = this.getName(graphName, second, key)
            this.graphResult.deleteEdge(firstName, secondName)
            if(!this.directed){
                this.graphResult.deleteEdge(secondName, firstName)
            }
        }
    }

}

class Graph{
    constructor(type, graphs, directed, document){
        let self = this;

        this.type = type;
        this.graphs = graphs;
        this.iterator = 0;
        this.graph = {};
        this.maxX = 100;
        this.maxY = 0;
        this.cy  = cytoscape({
            container: document.getElementById(type),
            userZoomingEnabled: false,
            style: [{
                selector: 'node',
                style: {
                    'content': 'data(id)'
                }
            },{
                selector: 'edge',
                style: {
                    'curve-style': directed ? 'bezier' : 'haystack',
                    'target-arrow-shape': directed ? 'triangle' : 'none'
                }
            }]
        });
        if(type != RESULT){

            this.cy.on('tap', function(event){
                var evtTarget = event.target;
                if( evtTarget === self.cy ){
                    delete self.selected;
                    self.graphs.addNode(type, null, event.position.x, event.position.y);
                } 
                else {
                    if(!self.selected){
                        self.selected = evtTarget;
                    }
                    else{
                        self.graphs.addEdge(type, self.selected.id(), evtTarget.id());
                        delete self.selected;
                    }
                }
            });
        }

        this.cy.on('add', 'node, edge', function(){
            self.cy.edges().unselect();
            self.cy.nodes().unselect();
            delete self.selected;
        })

        this.cy.on('cxttap', function(event){
            var evtTarget = event.target;
            if( evtTarget === self.cy ){
                delete self.selected;
                self.cy.edges().unselect();
                self.cy.nodes().unselect();
            }
        });
    }

    destroy(){
        this.cy.destroy();
    }

    applyLayout(isImport, name){
        if(this.type == RESULT || isImport){
            let layout = this.cy.layout({
                name: name ? name : (this.layout ? this.layout : 'grid')
            });

            layout.run();
        }
        if(this.type == RESULT && name){
            this.layout = name;
        }
    }

    getGraph(){
        return this.graph;
    }

    addNode(name, x, y, isImport){
        let self = this;
        if(this.type != RESULT){
            
        }
        if(!name){
            name = this.iterator;
        }
        this.iterator++;
        if(!x && !y){
            var x = 20 + (Math.random() * (this.maxX - 20))
            var y = this.maxY + 50;
        }
        let addedNode = this.cy.add({
            group: "nodes",
            data: { id: name },
            position: { x: x, y: y }
        });

        addedNode.on('cxttap', function(event){
            var node = event.target;
            self.graphs.deleteNode(self.type, node.id());
        });

        if(x > this.maxX){
            this.maxX = x;
        }
        if(y > this.maxY){
            this.maxY = y;
        }
        let tempKey = {};
        for (let key in this.graph){
            tempKey[key] = 0;
        }
        this.graph[name] = tempKey;
        for (let key in this.graph){
            this.graph[key][name] = 0;
        }
        this.applyLayout(isImport);
        return name;
    }

    deleteNode(name){
        this.cy.remove(this.cy.$id(name));
        delete this.graph[name];
        for (let key in this.graph){
            delete this.graph[key][name];
        }
        this.applyLayout();
    }

    addEdge(from, to){
        let self = this;
        this.graph[from][to] = 1;
        let addedEdge = this.cy.add({
            group: "edges", 
            data: { 
                id: "e"+from+"_"+to,
                source: from,
                target: to 
            } 
        })

        addedEdge.on('cxttap', function(event){
            var node = event.target;
            self.graphs.deleteEdge(self.type, node.source().id(), node.target().id());
        });
    }

    deleteEdge(from, to){
        this.graph[from][to] = 0;
        this.cy.remove(this.cy.$id("e"+from+"_"+to));
    }
}

module.exports.Graphs = Graphs;