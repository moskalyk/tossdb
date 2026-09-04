const { BTree } = require('./lib/cryptoBTree.js')
const { MemBTree } = require('./cryptoMemBTree.js')

;(() => {
    
    // Driver program to test above functions
    const t = new BTree(3); // A B-Tree with a minimum degree of 3
    t.insert(10);
    t.insert(20);
    t.insert(5);
    t.insert(6);
    t.insert(12);
    t.insert(30);
    t.insert(7);
    t.insert(17);

    console.log("Traversal of the constructed tree is ");
    t.traverse();
    console.log();

    let key = 6;
    if (t.search(key) !== null) {
        console.log("Present");
    } else {
        console.log("Not Present");
    }

    key = 15;
    if (t.search(key) !== null) {
        console.log("Present");
    } else {
        console.log("Not Present");
    }
    
    console.log()
    const m = new MemBTree(3)
    
    console.log(m)
    
    m.insert(48);
    key = 48
    
    if (m.search(key) !== null) {
        console.log("Present");
    } else {
        console.log("Not Present");
    }
    
    m.traverse()
    // m.traverseDisk()
    
    /*
        set memory factor
        test load insert
        test load search
        test speed search O(logn)
        test speed search O(n)
    */
})()
