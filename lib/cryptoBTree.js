/*
    a minimally invasive crypto based btree data structure
*/
const crypto = require('crypto');

class BTreeNode {
    constructor(t, leaf) {
        this.keys = Array(2 * t - 1).fill(null); // An array of keys
        this.t = t; // Minimum degree (defines the range for the number of keys)
        this.C = Array(2 * t).fill(null); // An array of child pointers
        this.n = 0; // Current number of keys
        this.leaf = leaf; // Is true when the node is a leaf, otherwise false
    }

    // A utility function to insert a new key in the subtree rooted with
    // this node. The assumption is that the node must be non-full when this
    // function is called
    insertNonFull(k) {
        const hash = crypto.createHash('sha256');
        hash.update(JSON.stringify(k));
        const digest = hash.digest('hex');
            
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
            if (this.C[i + 1].n === 2 * this.t - 1) {
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
        const z = new BTreeNode(y.t, y.leaf);
        z.n = this.t - 1;
        for (let j = 0; j < this.t - 1; j++) {
            z.keys[j] = y.keys[j + this.t];
        }
        if (!y.leaf) {
            for (let j = 0; j < this.t; j++) {
                z.C[j] = y.C[j + this.t];
            }
        }
        y.n = this.t - 1;
        for (let j = this.n; j > i; j--) {
            this.C[j + 1] = this.C[j];
        }
        this.C[i + 1] = z;
        for (let j = this.n - 1; j >= i; j--) {
            this.keys[j + 1] = this.keys[j];
        }
        this.keys[i] = y.keys[this.t - 1];
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

    // A function to search a key in the subtree rooted with this node
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
class BTree {
    constructor(t) {
        this.root = null; // Pointer to the root node
        this.t = t; // Minimum degree
    }

    // Function to traverse the tree
    traverse() {
        if (this.root !== null) {
            this.root.traverse();
        }
    }

    // Function to search a key in this tree
    search(k) {
        return this.root === null ? null : this.root.search(k);
    }

    // The main function that inserts a new key in this B-Tree
    insert(k) {
        if (this.root === null) {
            this.root = new BTreeNode(this.t, true);
            const hash = crypto.createHash('sha256');
            hash.update(JSON.stringify(k));
            const digest = hash.digest('hex');
            
            this.root.keys[0] = digest; // Insert key
            this.root.n = 1;
        } else {
            if (this.root.n === 2 * this.t - 1) {
                const s = new BTreeNode(this.t, false);
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
    BTree,
    BTreeNode
}
