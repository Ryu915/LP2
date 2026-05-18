#include<iostream>
#include<vector>
using namespace std;

class Graph{
    int graph_size = 0;
    vector<vector<int>> graph;

    void add_edge(int u, int v) {
        graph[u].push_back(v);
        graph[v].push_back(u);
    }

    public:
    Graph(int graph_size){
        graph.resize(graph_size);
    }

    void get_edge() {
        int u, v;
        char isContinue = 'y';
        while(isContinue == 'y') {
            cout << "Enter edges: " << endl;
            cin >> u >> v;
            add_edge(u, v);
            cout << "\nContinue? (y/n)" << endl;
            cin >> isContinue;
        }
        cout << "\nEdges recieved." << endl;
    }

    void display(){
        int node = 0;
        for (auto neighbors: graph) {
            cout << node << ":";
            for (auto neighbor: neighbors) {
                cout << neighbor << ", ";
            }
            cout << endl;
            node++;
        }
    }
};

int main() {
    Graph g1(5);

    g1.get_edge();

    g1.display();
}