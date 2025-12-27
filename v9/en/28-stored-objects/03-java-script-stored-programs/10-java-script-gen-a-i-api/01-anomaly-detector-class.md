#### 27.3.10.1 AnomalyDetector Class

* AnomalyDetector Constructor
* AnomalyDetector.train()")
* AnomalyDetector.fit()")
* AnomalyDetector.predict()")
* AnomalyDetector.score()")
* AnomalyDetector.unload()")

This class encapsulates the anomaly detection task as described in Detect Anomalies. `AnomalyDetector` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, and related tasks.

`AnomalyDetector` provides the following accessible properties:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor when creating an instance of `AnomalyDetector`.

##### AnomalyDetector Constructor

The `AnomalyDetector` class constructor is shown here:

**AnomalyDetector class constructor**

* ``` new ml.AnomalyDetector( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `AnomalyDetector`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; the
  same as the training options which can be used with
  `sys.ML_TRAIN`.

**Return type**

* An instance of `AnomalyDetector`.

##### AnomalyDetector.train()

Trains and loads a new anomaly detector. This method acts as a
wrapper for both `sys.ML_TRAIN`
and `sys.ML_MODEL_LOAD`, but is
specific to MySQL HeatWave AutoML anomaly detection.

**Signature**

* ```
  AnomalyDetector.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The table must not take up more than 10 GB space, or hold more than 100 million rows or more than 1017 columns.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values. The type used for this column cannot be `TEXT`.

**Return type**

* *None*.

##### AnomalyDetector.fit()

An alias for `train()`"), and identical to it in all respects other than name. See AnomalyDetector.train()"), for more information.

##### AnomalyDetector.predict()

This method predicts labels, acting as a wrapper for `sys.ML_PREDICT_ROW`.

Predicts a label for a single sample of data, and returns the label. See ML\_PREDICT\_ROW, for more information.

**Signature**

* ``` String AnomalyDetector.predict( Object sample[, Object options] )
  ```

**Arguments**

* *`sample`*
  (`Object`): Sample data. This argument
  must contain members that were used for training; extra
  members may be included, but these are ignored during
  prediction.
* *`options`*
  (`Object`)
  (*optional*): Set of one of more
  options.

**Return type**

* `String`.

##### AnomalyDetector.score()

This method serves as a JavaScript wrapper for
`sys.ML_SCORE`, returning the
score for the test data in the specified table and column. For
possible metrics, see Optimization and Scoring Metrics.

**Signature**

* ```
  score(
    Table testData,
    String targetColumnName,
    String metric[,
    Object options]
  )
  ```

**Arguments**

* *`testData`* (`Table`): Table containing test data to be scored; must contain the same columns as the training dataset.

* *`targetColumnName`* (`String`): Name of the target column containing ground truth values.

* *`metric`* (`String`): Name of the scoring metric to use. See Optimization and Scoring Metrics, for information about metrics which can be used for AutoML anomaly detection.

* *`options`* (`Object`) (*optional*): A set of options in JSON object format. See the description of `ML_SCORE` for more information.

**Return type**

* `Number`.

##### AnomalyDetector.unload()

This method is a wrapper for `sys.ML_MODEL_UNLOAD`, and Unloads the model.

**Signature**

* ``` AnomalyDetector.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.
