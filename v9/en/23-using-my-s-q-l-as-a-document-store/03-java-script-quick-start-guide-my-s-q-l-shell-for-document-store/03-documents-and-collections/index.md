### 22.3.3 Documents and Collections

22.3.3.1 Create, List, and Drop Collections

22.3.3.2 Working with Collections

22.3.3.3 Find Documents

22.3.3.4 Modify Documents

22.3.3.5 Remove Documents

22.3.3.6 Create and Drop Indexes

When you are using MySQL as a Document Store, collections are containers within a schema that you can create, list, and drop. Collections contain JSON documents that you can add, find, update, and remove.

The examples in this section use the `countryinfo` collection in the `world_x` schema. For instructions on setting up the `world_x` schema, see Section 22.3.2, “Download and Import world_x Database”.

#### Documents

In MySQL, documents are represented as JSON objects. Internally, they are stored in an efficient binary format that enables fast lookups and updates.

* Simple document format for JavaScript:

  ```
  {field1: "value", field2 : 10, "field 3": null}
  ```

An array of documents consists of a set of documents separated by commas and enclosed within `[` and `]` characters.

* Simple array of documents for JavaScript:

  ```
  [{"Name": "Aruba", "Code:": "ABW"}, {"Name": "Angola", "Code:": "AGO"}]
  ```

MySQL supports the following JavaScript value types in JSON documents:

* numbers (integer and floating point)
* strings
* boolean (False and True)
* null
* arrays of more JSON values
* nested (or embedded) objects of more JSON values

#### Collections

Collections are containers for documents that share a purpose and possibly share one or more indexes. Each collection has a unique name and exists within a single schema.

The term schema is equivalent to a database, which means a group of database objects as opposed to a relational schema, used to enforce structure and constraints over data. A schema does not enforce conformity on the documents in a collection.

In this quick-start guide:

* Basic objects include:

  <table summary="Objects to use interactively in MySQL Shell"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Object form</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>db</code></td> <td><code>db</code> is a global variable assigned to the current active schema. When you want to run operations against the schema, for example to retrieve a collection, you use methods available for the <code>db</code> variable.</td> </tr><tr> <td><code>db.getCollections()</code></td> <td>db.getCollections() returns a list of collections in the schema. Use the list to get references to collection objects, iterate over them, and so on.</td> </tr></tbody></table>

* Basic operations scoped by collections include:

  <table summary="CRUD operations available in X DevAPI"><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Operation form</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>db.<em><code>name</code></em>.add()</code></td> <td>The add() method inserts one document or a list of documents into the named collection.</td> </tr><tr> <td><code>db.<em><code>name</code></em>.find()</code></td> <td>The find() method returns some or all documents in the named collection.</td> </tr><tr> <td><code>db.<em><code>name</code></em>.modify()</code></td> <td>The modify() method updates documents in the named collection.</td> </tr><tr> <td><code>db.<em><code>name</code></em>.remove()</code></td> <td>The remove() method deletes one document or a list of documents from the named collection.</td> </tr></tbody></table>

#### Related Information

* See Working with Collections for a general overview.

* CRUD EBNF Definitions provides a complete list of operations.
