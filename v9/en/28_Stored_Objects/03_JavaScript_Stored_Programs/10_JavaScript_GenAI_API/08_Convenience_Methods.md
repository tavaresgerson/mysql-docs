#### 27.3.10.8 Convenience Methods

The GenAI API provides the convenience methods described in this section under the `ml` namespace. These methods act as wrappers for the `LLM` methods; rather than being invoked as `LLM` instance methods, they take the model ID as one of the options passed to them. `ml.generate()`") and `ml.rag()`") return only the text portions of the values returned by their LLM counterparts.

* ml.generate()")
* ml.embed()")
* ml.load()")
* ml.rag()")

##### ml.generate()

This method is a wrapper for `LLM.generate()`"). It loads the model specified by the *`model_id`* specified as one of the *`options`*, generates a response based on the prompt using this model, and returns the response. The default `model_id` (`"llama3.2-3b-instruct-v1"`) is used if one is not specified. Like the `LLM` method, `ml.generate()` supports two variants, one for a single invocation, and one for batch processing.

**Signature (single job)**

* ``` String ml.generate( String prompt, Object options )
  ```

**Arguments**

* *`prompt`*
  (`String`): The desired prompt
* *`options`*
  (`Object`) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with `LLM.generate()`")

**Return type**

* `String`: The text of the response

**Usage**

* ```
  //  Both invocations use "llama3.2-3b-instruct-v1" as the model_id

  let response = ml.generate("What is Mysql?", {max_tokens: 10})

  let response = ml.generate("What is Mysql?", {model_id: "llama3.2-3b-instruct-v1", max_tokens: 10})
  ```

**Signature (batch processing)**

* ``` undefined ml.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
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

  ml.generate(table, "input", "mlcorpus.predictions.response", {max_tokens: 10})
  ```

##### ml.embed()

This method is a wrapper for `LLM.embed()`"). Like the `LLM` method, it supports two variants, one for a single invocation, and one for batch processing.

**Signature (single job)**

* ``` Float32Array ml.embed( String query, Object options )
  ```

**Arguments**

* *`query`*
  (`String`): Text of a natural-language
  query
* *`options`*
  (`Object`) (default
  `{}`): The options employed for
  generation; these follow the same rules as the options
  used with `LLM.embed()`");
  the default `model_id` is
  `"all_minilm_l12_v2"`

**Return type**

* `Float32Array` (MySQL
  `VECTOR`): The embedding

**Usage**

* ```
  //  These produce the same result

  let embedding = ml.embed("What is Mysql?", {model_id: "all_minilm_l12_v2"})

  let embedding = ml.embed("What is Mysql?", {})
  ```

**Signature (batch processing)**

* ``` undefined ml.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
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

  ml.embed(table, "input", "mlcorpus.predictions.response",
          {model_id: "all_minilm_l12_v2"})
  ```

##### ml.load()

This static method loads an existing (and already trained) MySQL HeatWave AutoML model having the name specified. An error is thrown if model with the given name does not exist.

**Signature**

* ``` Object ml.load( String name )
  ```

**Arguments**

* *`name`*
  (`String`): The name of the model.

**Return type**

* `Object`: Any of
  `Classifier`,
  `Regressor`,
  `Forecaster`,
  `AnomalyDetector`, or
  `Recommender`, depending
  on the type of model loaded.

For more information, see
ML\_MODEL\_LOAD.

##### ml.rag()

This is a wrapper for
`LLM.rag()`"). Like the
`LLM` method, it supports two variants, one
for a single invocation, and one for batch processing.

**Signature (single job)**

* ```
  String ml.rag(
    String query,
    Object options
  )
  ```

**Arguments**

* *`query`* (`String`): Text of a natural-language query

* *`options`* (`Object`) (default `{}`): The options employed for generation; these follow the same rules as the options used with `LLM.rag()`"); the default `model_id` is `"llama3.2-3b-instruct-v1"`

**Return type**

* `String`: Response text

**Usage**

* ``` //  These produce the same result

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}})

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Signature (batch processing)**

* ```
  undefined ml.rag(
    Table inputTable,
    String inputColumn,
    String outputColumn,
    Object options
  )
  ```

**Arguments**

* *`inputTable`* (`Table`): Table to use for operations

* *`inputColumn`* (`String`): Name of column from *`inputTable`* to be embedded

* *`outputColumn`* (`String`): Name of column in which to store embeddings; this can be either a fully-qualified name of a column or the name of the column only; in the latter case, the input table and its schema are used to construct the fully-qualified name

* *`options`* (`Object`) (optional; default `{}`): An object containing the options used for embedding; see the description of `ML_EMBED_ROW` for available options

**Return type**

* `undefined`

**Usage**

* ``` let schema = session.getSchema("mlcorpus") let table = schema.getTable("genai_table")

  ml.rag(table, "input", "mlcorpus.predictions.response", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}});
  ```
