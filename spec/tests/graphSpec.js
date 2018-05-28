'use strict';
let rewire = require("rewire");


describe("Graph /  ", () => {
    let target, Graphs, one, two, result;
    let cytoscapeMock = function(){
        return {
            on: function(){},
            add: function(){
                return {
                    on: function(){}
                }
            },
            layout: function(){
                return {
                    run: function(){}
                }
            },
            $id: function(){},
            remove: function(){}
        };
    };
    
    beforeAll(() => {
        target = rewire("../../graph.js");
        target.__set__("cytoscape", cytoscapeMock);
    });

    describe("unit tests for graph", () => {

        beforeAll(() => {
            Graphs = new target.Graphs(false, {
                getElementById: () => 1
            });
            one = Graphs.getGraph("ONE");
            two = Graphs.getGraph("TWO");
            result = Graphs.getGraph("RESULT");
        })

        it('should add node to graph one', (done) => {

            Graphs.addNode("ONE", null, 0, 0, false);
            expect(one.graph[0]).toEqual({0: 0});

            Graphs.addNode("ONE", null, 0, 0, false);
            expect(one.graph[0]).toEqual({0: 0, 1: 0});
            expect(one.graph[1]).toEqual({0: 0, 1: 0});
            expect(Object.keys(result.graph).length).toBe(0);
            done();
        });
        it('should add edge to graph one', (done) => {

            Graphs.addEdge("ONE", 0, 1);
            expect(one.graph[0]).toEqual({0: 0, 1: 1});
            expect(one.graph[1]).toEqual({0: 1, 1: 0});
            done();
        });
        it('should add node to graph two', (done) => {

            Graphs.addNode("TWO", null, 0, 0, false);
            expect(two.graph[0]).toEqual({0: 0});

            expect(result.graph["0_0"]).toEqual({"0_0": 0, "1_0": 1});
            expect(result.graph["1_0"]).toEqual({"0_0": 1, "1_0": 0});
            
            Graphs.addNode("TWO", null, 0, 0, false);
            expect(two.graph[0]).toEqual({0: 0, 1: 0});
            expect(two.graph[1]).toEqual({0: 0, 1: 0});

            
            expect(result.graph["0_0"]).toEqual({"0_0": 0, "1_0": 1, "0_1": 0, "1_1": 0});
            expect(result.graph["0_1"]).toEqual({"0_0": 0, "1_0": 0, "0_1": 0, "1_1": 1});
            expect(result.graph["1_0"]).toEqual({"0_0": 1, "1_0": 0, "0_1": 0, "1_1": 0});
            expect(result.graph["1_1"]).toEqual({"0_0": 0, "1_0": 0, "0_1": 1, "1_1": 0});

            done();
        });
        it('should add edge to graph two', (done) => {

            Graphs.addEdge("TWO", 0, 1);
            expect(two.graph[0]).toEqual({0: 0, 1: 1});
            expect(two.graph[1]).toEqual({0: 1, 1: 0});

            expect(result.graph["0_0"]).toEqual({"0_0": 0, "1_0": 1, "0_1": 1, "1_1": 0});
            expect(result.graph["0_1"]).toEqual({"0_0": 1, "1_0": 0, "0_1": 0, "1_1": 1});
            expect(result.graph["1_0"]).toEqual({"0_0": 1, "1_0": 0, "0_1": 0, "1_1": 1});
            expect(result.graph["1_1"]).toEqual({"0_0": 0, "1_0": 1, "0_1": 1, "1_1": 0});
            done();
        });

        it('should remove edge from graph two', (done) => {

            Graphs.deleteEdge("TWO", 0, 1);
            expect(two.graph[1]).toEqual({0: 0, 1: 0});
            expect(two.graph[1]).toEqual({0: 0, 1: 0});

            expect(result.graph["0_0"]).toEqual({"0_0": 0, "1_0": 1, "0_1": 0, "1_1": 0});
            expect(result.graph["0_1"]).toEqual({"0_0": 0, "1_0": 0, "0_1": 0, "1_1": 1});
            expect(result.graph["1_0"]).toEqual({"0_0": 1, "1_0": 0, "0_1": 0, "1_1": 0});
            expect(result.graph["1_1"]).toEqual({"0_0": 0, "1_0": 0, "0_1": 1, "1_1": 0});
            done();
        });
        it('should remove node from graph one', (done) => {
            
            Graphs.deleteNode("ONE", 1);
            expect(one.graph[0]).toEqual({0: 0});

            expect(result.graph["0_0"]).toEqual({"0_0": 0, "0_1": 0});
            expect(result.graph["0_1"]).toEqual({"0_0": 0, "0_1": 0});
            done();
        });
    })
});