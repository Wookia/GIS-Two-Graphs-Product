FIRST = "ONE"
SECOND = "TWO"

class Graphs():
    def __init__(self, directed):
        self.graphOne = {}
        self.graphTwo = {}
        self.resultGraph = {}
        self.directed = directed

    def printMatrix(self, graph):
        for key in graph:
            line = ""
            for secondKey in graph[key]:
                line = line + " " + str(graph[key][secondKey])
            print(line)
        print("")

    def printMatrixs(self):
        self.printMatrix(self.graphOne)
        self.printMatrix(self.graphTwo)
        self.printMatrix(self.resultGraph)

    def getGraphs(self, to):
        if(to == FIRST):
            graph = self.graphOne
            secondGraph = self.graphTwo
        elif(to == SECOND):
            graph = self.graphTwo
            secondGraph = self.graphOne
        return graph, secondGraph

    def getName(self, to, name, key):
        if(to == FIRST):
            return str(name)+'_'+str(key)
        elif(to == SECOND):
            return str(key)+'_'+str(name)
        
    def addEdge(self, to, first, second):
        graph, secondGraph = self.getGraphs(to)
        graph[first][second] = 1
        if (self.directed != True):
            graph[second][first] = 1
        
        for key in secondGraph:
            firstName = self.getName(to, first, key)
            secondName = self.getName(to, second, key)
            self.resultGraph[firstName][secondName] = 1
            self.resultGraph[secondName][firstName] = 1

    def addVertex(self, to, name):
        graph, secondGraph = self.getGraphs(to)
        graph[name] = {x: 0 for x in range(len(graph))}
        for key in graph:
            graph[key][name] = 0
        
        #adding vertexes to resul
        for key in secondGraph:
            newName = self.getName(to, name, key)
            self.resultGraph[newName] = {key: 0 for key in self.resultGraph}
            for subKey in self.resultGraph:
                self.resultGraph[subKey][newName] = 0

graphs = Graphs(False)
graphs.addVertex(FIRST, 0)
graphs.addVertex(SECOND, 0)


graphs.addVertex(FIRST, 1)
graphs.addVertex(SECOND, 1)



graphs.printMatrixs()

graphs.addEdge(FIRST, 0, 1)

graphs.addEdge(SECOND, 0, 1)

graphs.printMatrixs()