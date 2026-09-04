/*
    a minimally invasive crypto based btree data structure
    addon: with memory windows as storage
*/
const crypto = require('crypto');
const fs = require('fs');

// class Node {
//     constructor(key,hash){
//         this.key = key
//         this.hash = hash
//     }
// }

class BTreeNode {
    constructor(t, leaf, disk = false) {
        this.keys = Array(2 * t - 1).fill(null);    // An array of keys, TODO: make into a class of {key, hash}
        this.deg = t;                               // Minimum degree (defines the range for the number of keys)
        this.C = Array(2 * t).fill(null);           // An array of child pointers
        this.n = 0;                                 // Current number of keys
        this.leaf = leaf;                           // Is true when the node is a leaf, otherwise false
        this.dateTime = Date.now()                  // new: recency of added data, specifically before disk
        this.disk = disk                            // new: boolean to represent on disk
        
        /*
            start, read file from end and work backwards 
            filling up N number of nodes
        */
    }

    // A utility function to insert a new key in the subtree rooted with
    // this node. The assumption is that the node must be non-full when this
    // function is called
    insertNonFull(k) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(k));
        const digest = hash.digest('hex');
            
        /*
            update
            if this.n > 5
            flush: write to file with fs.appendFile
            
            store most recent half in tree
            prune from recent
        */
        
        let i = this.n - 1;
        if (this.leaf) {
            while (i >= 0 && this.keys[i] > digest) {
                this.keys[i + 1] = this.keys[i];
                i--;
            }
            
            this.keys[i + 1] = digest;
            this.n++;
        } else {
            while (i >= 0 && this.keys[i] > digest) {
                i--;
            }
            if (this.C[i + 1].n === 2 * this.deg - 1) {
                this.splitChild(i + 1, this.C[i + 1]);
                if (this.keys[i + 1] < digest) {
                    i++;
                }
            }
            this.C[i + 1].insertNonFull(k);
        }
    }

    // A utility function to split the child y of this node. i is the index of y in
    // the child array C[]. The Child y must be full when this function is called
    splitChild(i, y) {
        const z = new BTreeNode(y.deg, y.leaf);
        z.n = this.deg - 1;
        for (let j = 0; j < this.deg - 1; j++) {
            z.keys[j] = y.keys[j + this.deg];
        }
        if (!y.leaf) {
            for (let j = 0; j < this.deg; j++) {
                z.C[j] = y.C[j + this.deg];
            }
        }
        y.n = this.deg - 1;
        for (let j = this.n; j > i; j--) {
            this.C[j + 1] = this.C[j];
        }
        this.C[i + 1] = z;
        for (let j = this.n - 1; j >= i; j--) {
            this.keys[j + 1] = this.keys[j];
        }
        this.keys[i] = y.keys[this.deg - 1];
        this.n++;
    }

    // A function to traverse all nodes in a subtree rooted with this node
    traverse() {
        for (let i = 0; i < this.n; i++) {
            if (!this.leaf) {
                this.C[i].traverse();
            }
            console.log(this.keys[i]);
        }
        if (!this.leaf) {
            this.C[this.n].traverse();
        }
    }
    
    /*
        A function to traverse all nodes ON DISK in a subtree rooted with this node
        
        traverse memory, 
        once exhausted this.n, 
        dispose
        get batch, traverse, 
        get batch, traverse,
        until eof
        
        traverseDisk() {
            for (let i = 0; i < this.n; i++) {
                if (!this.leaf) {
                    this.C[i].traverse();
                }
                console.log(this.keys[i]);
            }
            if (!this.leaf) {
                this.C[this.n].traverse();
            }
        }
    */ 


    /*
        A function to search a key in the subtree rooted with this node
        
        search mem tree
        if returns null, 
        load in new tree from next batch of disk, search
        eof return null
    */
    
    search(k) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(k));
        const digest = hash.digest('hex');
        
        let i = 0;
        while (i < this.n && digest > this.keys[i]) {
            i++;
        }
        if (i < this.n && digest === this.keys[i]) {
            return this;
        }
        if (this.leaf) {
            return null;
        }
        return this.C[i].search(k);
    }
}

// A BTree
class MemBTree {
    constructor(t, memory = 200) {
        this.root = null;   // Pointer to the root node
        this.deg = t;       // Minimum degree
        this.mem = memory   // new: what is held in memory
        this.total = 0      // new: total number of nodes in tree
    }

    // Function to traverse the tree
    traverse() {
        if (this.root !== null) {
            this.root.traverse();
        }
    }
    
    /* 
        Function to traverse the tree
        on disk
    */
    // traverseDisk() {
    //     if (this.root !== null) {
    //         this.root.traverseDisk();
    //     }
    // }

    // Function to search a key in this tree
    search(k) {
        return this.root === null ? null : this.root.search(k);
    }

    // The main function that inserts a new key in this B-Tree
    insert(k) {
        this.total++
        if (this.root === null) {
            this.root = new BTreeNode(this.deg, true);
            const hash = crypto.createHash('sha256');
            hash.update(JSON.stringify(k));
            const digest = hash.digest('hex');
            
            this.root.keys[0] = digest; // Insert key
            this.root.n = 1;
        } else {
            if (this.root.n === 2 * this.deg - 1) {
                const s = new BTreeNode(this.deg, false);
                s.C[0] = this.root;
                s.splitChild(0, this.root);
                let i = 0;
                if (s.keys[0] < k) {
                    i++;
                }
                s.C[i].insertNonFull(k);
                this.root = s;
            } else {
                this.root.insertNonFull(k);
            }
        }
    }
}

module.exports = {
    MemBTree,
    BTreeNode
}
