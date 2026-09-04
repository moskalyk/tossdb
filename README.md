## tossdb: hashed (mem btree)
current working version is just a'whole file read and write json

### progress
- [x] `/lib/cryptoBTree.js` is a key hashed b-tree insert and search
- [x] comments for merging current tossdb api with in-mem db and disk flushing
- [ ] implementation with `apnd` & `look` api and node / key hashes
- [ ] full comments implemented into 1.0.0 with load testing

## sources
- `crypto`: www.w3schools.com/nodejs/ref_hash.asp
- `btree inserts`: https://www.geeksforgeeks.org/dsa/insert-operation-in-b-tree/
- `btree intro`: https://www.geeksforgeeks.org/dsa/introduction-of-b-tree-2/
