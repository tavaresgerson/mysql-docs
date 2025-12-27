## 27.7 JSON Duality Views

27.7.1 Creating JSON Duality Views

27.7.2 DML Operations on JSON Duality Views (MySQL Enterprise Edition)

27.7.3 JSON Duality View Metadata

MySQL 9.5 supports JSON duality views. Also known as JSON relational duality views, these objects are stored queries that when invoked produce a set of values in JSON format. In effect, a JSON duality view acts as a virtual JSON document, or as a collection of virtual JSON documents.

With JSON duality views, you can establish a mapping between relational tables and a hierarchical multi-level JSON document, effectively unifying structured (relational) and semi-structured (JSON) data. This allows you to harness the strength of both models (perfect synergy of JSON models with REST APIs, and referential integrity of relational models), and gives your applications the option to read and write using either data model.

The discussion in the next few sections describes the syntax for creating, altering, and dropping JSON duality views, shows some examples of how to use them, and provides information about obtaining related metadata.

DML operations on JSON duality views are supported only on MySQL Enterprise Edition. See Section 27.7.2, “DML Operations on JSON Duality Views (MySQL Enterprise Edition)”"), for more information.
