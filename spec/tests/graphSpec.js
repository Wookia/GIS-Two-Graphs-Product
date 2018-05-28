'use strict';
let rewire = require("rewire");


describe("Graph /  ", () => {
    let target;
    let Graphs;
    let cytoscapeMock = function(){
        return {
            on: function(){}
        };
    };
    //let windowMock = {};
    beforeEach(() => {
        target = rewire("../../graph.js");
        target.__set__("cytoscape", cytoscapeMock);
        //target.__set__("window", windowMock);
    });
    describe("unit tests ", () => {
        it('should check if graph initialized', (done) =>{
            Graphs = new target.Graphs(false, {
                getElementById: () => 1
            });
            done();
        });
})
});