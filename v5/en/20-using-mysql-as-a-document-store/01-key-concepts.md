## 19.1 Key Concepts

This section explains the concepts introduced as part of using MySQL as a document store.

### Document

A Document is a set of key and value pairs, as represented by a JSON object. A Document is represented internally using the MySQL binary JSON object, through the JSON MySQL datatype. The values of fields can contain other documents, arrays, and lists of documents.

```sql
{
    "GNP": 4834,
    "_id": "00005de917d80000000000000023",
    "Code": "BWA",
    "Name": "Botswana",
    "IndepYear": 1966,
    "geography": {
        "Region": "Southern Africa",
        "Continent": "Africa",
        "SurfaceArea": 581730
    },
    "government": {
        "HeadOfState": "Festus G. Mogae",
        "GovernmentForm": "Republic"
    },
    "demographics": {
        "Population": 1622000,
        "LifeExpectancy": 39.29999923706055
    }
}
```

### Collection

A Collection is a container that may be used to store Documents in a MySQL database.

### CRUD Operations

Create, Read, Update and Delete (CRUD) operations are the four basic operations that can be performed on a database Collection or Table. In terms of MySQL this means:

* Create a new entry (insertion or addition)
* Read entries (queries)
* Update entries
* Delete entries

### X Plugin

The MySQL Server plugin which enables communication using X Protocol. Supports clients that implement X DevAPI and enables you to use MySQL as a document store.

### X Protocol

A protocol to communicate with a MySQL Server running X Plugin. X Protocol supports both CRUD and SQL operations, authentication via SASL, allows streaming (pipelining) of commands and is extensible on the protocol and the message layer.
