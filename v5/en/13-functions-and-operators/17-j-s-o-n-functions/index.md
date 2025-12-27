## 12.17 JSON Functions

12.17.1 JSON Function Reference

12.17.2 Functions That Create JSON Values

12.17.3 Functions That Search JSON Values

12.17.4 Functions That Modify JSON Values

12.17.5 Functions That Return JSON Value Attributes

12.17.6 JSON Utility Functions

The functions described in this section perform operations on JSON values. For discussion of the `JSON` data type and additional examples showing how to use these functions, see Section 11.5, “The JSON Data Type”.

For functions that take a JSON argument, an error occurs if the argument is not a valid JSON value. Arguments parsed as JSON are indicated by *`json_doc`*; arguments indicated by *`val`* are not parsed.

Functions that return JSON values always perform normalization of these values (see Normalization, Merging, and Autowrapping of JSON Values), and thus orders them. *The precise outcome of the sort is subject to change at any time; do not rely on it to be consistent between releases*.

Unless otherwise indicated, the JSON functions were added in MySQL 5.7.8.

A set of spatial functions for operating on GeoJSON values is also available. See Section 12.16.11, “Spatial GeoJSON Functions”.
