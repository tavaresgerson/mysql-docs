#### 27.3.10.7 Regressor Class

* Regressor Constructor
* Regressor.train()")
* Regressor.fit()")
* Regressor.predict()")
* Regressor.score()")
* Regressor.explain()")
* Regressor.getExplainer()")
* Regressor.unload()")

This class is similar to `Classifier` and `Forecaster` in that it represents an AutoML training model, but encapsulates the regression task as described in the MySQL HeatWave documentation (see Train a Model).

`Regressor` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, producing explainers, and related tasks; it also has three accessible instance properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor (shown following).

##### Regressor Constructor

To obtain an instance of `Regressor`, simply invoke its constructor, shown here:

**Signature**

* ``` new ml.Regressor( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  instance of `Regressor`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options. These
  are the same as those used with
  `sys.ML_TRAIN`.

**Return type**

* An instance of `Regressor`.

##### Regressor.train()

Trains and loads a new regressor, acting as a wrapper for
`sys.ML_TRAIN` and
`sys.ML_MODEL_LOAD`, specific to
the AutoML regression task.

**Signature**

* ```
  Regressor.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` which contains a training dataset. The table must not exceed 10 GB in size, or contain more than 100 million rows or more than 1017 columns.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values; `TEXT` columns are not supported for this purpose.

**Return type**

* `undefined`.

##### Regressor.fit()

This is merely an alias for `train()`"). In all respects except for their names, the two methods are identical. See Regressor.train()"), for more information.

##### Regressor.predict()

This method predicts labels. `predict()` has two variants, listed here:

* Stores labels predicted from data found in the indicated table and stores them in an output table; a wrapper for `sys.ML_PREDICT_TABLE`.

* A wrapper for `sys.ML_PREDICT_ROW`; predicts a label for a single set of sample data and returns it to the caller.

Both versions of `predict()` are shown in this section.

###### Version 1

This version of `predict()` predicts labels, then saves them in an output table specified when invoking the method.

**Signature**

* ``` Regressor.predict( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): A table
  containing test data.
* *`outputTable`*
  (`Table`): A table for storing the
  predicted labels. The output's content and format are
  the same as for that produced by
  `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*optional*): Set of options in JSON
  format. See ML\_PREDICT\_TABLE,
  for more information.

**Return type**

* `undefined`.

###### Version 2

Predicts a label for a single sample of data, and returns it
to the caller. See ML\_PREDICT\_ROW,
for more information.

**Signature**

* ```
  String Regressor.predict(
    Object sample
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data. This argument *must* contain members that were used for training; while extra members may be included, these are ignored for purposes of prediction.

**Return type**

* `String`. See ML\_PREDICT\_ROW.

##### Regressor.score()

Returns the score for the test data in the table and column indicated by the user, using a specified metric; a JavaScript wrapper for `sys.ML_SCORE`.

**Signature**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): Table
  containing test data to be scored; this table must contain
  the same columns as the training dataset.
* *`targetColumnName`*
  (`String`): The name of the target column
  containing ground truth values.
* *`metric`*
  (`String`): Name of the scoring metric to
  be employed. Optimization and Scoring Metrics,
  provides information about metrics compatible with the
  AutoML regression task.
* *`options`*
  (`Object`)
  (*optional*): A set of options, as keys
  and values, in JSON format. See the description of
  `ML_SCORE` for more
  information.

**Return type**

* `Number`.

##### Regressor.explain()

This method takes a `Table`
containing a labeled, trained dataset and the name of a table
column containing ground truth values, and returns the newly
trained explainer; a wrapper for the MySQL HeatWave
`sys.ML_EXPLAIN` routine.

**Signature**

* ```
  explain(
    Table data,
    String targetColumnName[,
    Object options]
  )
  ```

**Arguments**

* *`data`* (`Table`): Table containing trained data.

* *`targetColumnName`* (`String`): Name of column containing ground truth values.

* *`options`* (`Object`) (*optional*): Set of optional parameters, in JSON format.

**Return type**

* Adds a model explainer to the model catalog; does not return a value. See ML\_EXPLAIN, for more information.

##### Regressor.getExplainer()

Returns an explainer for this `Regressor`.

**Signature**

* ``` Object Regressor.getExplainer()
  ```

**Arguments**

* *None*.

**Return type**

* `Object`

##### Regressor.unload()

Unloads the model. This method is a wrapper for
`sys.ML_MODEL_UNLOAD`.

**Signature**

* ```
  Regressor.unload()
  ```

**Arguments**

* *None*.

**Return type**

* `undefined`
