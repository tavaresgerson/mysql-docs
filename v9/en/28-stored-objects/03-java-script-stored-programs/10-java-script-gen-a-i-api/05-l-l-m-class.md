#### 27.3.10.5 LLM Class

* LLM Constructor
* LLM.unload()")
* LLM.generate()")
* LLM.embed()")
* LLM.rag()")

This class represents a large language model. Members accessible from instances of this class are listed here:

* `name` (`String`): The name of the model

* `options` (`Object`): The model's configuration options

* `isLoaded` (`Boolean`): `true` if the model is loaded, `false` if it is not

##### LLM Constructor

The LLM class has the constructor shown here:

**LLM class constructor**

* ``` LLM( String name, Object options )
  ```

**Arguments**

* *`name`*
  (`String`): the name of the model
* *`options`*
  (`Object`) (default
  `{}`): an object containing the options
  used by this instance

**Return type**

* An instance of `LLM`

**Usage**

* ```
  let model = LLM("llama3.2-3b-instruct-v1", {max_tokens: 10})
  ```

`LLM` provides methods for creating embeddings, generating responses, and performing Retrieval Augmented Generation. The API also provides convenience methods; see Section 27.3.10.8, “Convenience Methods”. Both versions of these methods support variants of the methods for performing single jobs and batch processing.

##### LLM.unload()

Unloads the model that was loaded in the constructor. This is optional, but recommended, since doing so can reduce memory usage; after unloading, any subsequent attempt to use the instance raises an error.

**Signature**

* ``` undefined LLM.unload()
  ```

**Arguments**

* *None*

**Return type**

* `undefined`

**Usage**

* ```
  model.unload()
  ```

##### LLM.generate()

This method acts as a wrapper for `ML_GENERATE`, and generates a response using the prompt and options provided for the loaded model. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Object LLM.generate( String prompt, Object options )
  ```

**Arguments**

* *`prompt`*
  (`String`): prompt to be used for text
  generation
* *`options`*
  (`Object`) (default
  `{}`): an object containing the options
  used by this instance; see the description of
  `ML_GENERATE` for available
  options

**Return type**

* `Object`: The structure is similar to
  that of `ML_GENERATE`.

**Usage**

* ```
  let response = model.generate("What is MySql?", {"top_k": 2})
  ```

**Signature (batch processing)**

* ``` undefined LLM.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  `ML_EMBED_ROW` for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.generate(table, "input", "mlcorpus.predictions.response")
  ```

##### LLM.embed()

This method is a wrapper for `ML_EMBED_ROW`, and generates an embedding whose type corresponds to the MySQL `VECTOR` type. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Float32Array LLM.embed( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): The text to be embedded
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  `ML_EMBED_ROW` for available
  options

**Return type**

* `Float32Array` (MySQL
  `VECTOR`): The embedding

**Usage**

* ```
  let embedding = model.embed("What is MySql?")
  ```

**Signature (batch processing)**

* ``` undefined LLM.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  `ML_EMBED_ROW` for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  // Using fully-qualified output column name

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "mlcorpus.predictions.response")

  // Using output column name only; constructs the fully-qualfied name
  // "mlcorpus.genai_table.response"

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "response")
  ```

##### LLM.rag()

This method performs Retrieval Augmented Generation for a given query using the loaded genAI model, acting as a wrapper for `ML_RAG`. It supports two variants, one for a single invocation, and one for batch processing; both of these are described in the next few paragraphs.

**Signature (single job)**

* ``` Object LLM.rag( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): The text to be used for
  content retrieval and generation
* *`options`* (Object) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with `LLM.generate()`")

**Return type**

* `Object`: The structure is similar to
  that of the object returned by
  `ML_RAG`.

**Usage**

* ```
  let result = model.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Signature (batch processing)**

* ``` undefined LLM.rag( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Arguments**

* *`inputTable`*
  (`Table`): Table to use for operations
* *`inputColumn`*
  (`String`): Name of column from
  *`inputTable`* to be embedded
* *`outputColumn`*
  (`String`): Name of column in which to
  store embeddings; this can be either a fully-qualified
  name of a column or the name of the column only; in the
  latter case, the input table and its schema are used to
  construct the fully-qualified name
* *`options`*
  (`Object`) (optional; default
  `{}`): An object containing the options
  used for embedding; see the description of
  `ML_EMBED_ROW` for available
  options

**Return type**

* `undefined`

**Usage**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.rag(table, "input", "mlcorpus.predictions.response",
    {schema: ["vector_store"], n_citations: 1})
  ```
