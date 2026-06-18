#### 27.3.10.1 AnomalyDetector Class

* [AnomalyDetector Constructor](srjsapi-anomalydetector.html#srjsapi-anomalydetector-constructor "AnomalyDetector Constructor")
* [AnomalyDetector.train()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-train "AnomalyDetector.train()")
* [AnomalyDetector.fit()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-fit "AnomalyDetector.fit()")
* [AnomalyDetector.predict()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-predict "AnomalyDetector.predict()")
* [AnomalyDetector.score()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-score "AnomalyDetector.score()")
* [AnomalyDetector.unload()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-unload "AnomalyDetector.unload()")

This class encapsulates the anomaly detection task as described
in [Detect Anomalies](/doc/heatwave/en/mys-hwaml-anomaly-detection.html).
`AnomalyDetector` supports methods for loading,
training, and unloading models, predicting labels, calculating
probabilities, and related tasks.

`AnomalyDetector` provides the following
accessible properties:

* `name` (`String`): The
  model name.

* `metadata` (`Object`):
  Model metadata in the model catalog. See
  [Model Metadata](/doc/heatwave/en/mys-hwaml-ml-model-metadata.html).

* `trainOptions` (`Object`):
  The training options specified in the constructor when
  creating an instance of `AnomalyDetector`.

##### AnomalyDetector Constructor

The `AnomalyDetector` class constructor is
shown here:

**AnomalyDetector class constructor**

* ```
  new ml.AnomalyDetector(
    String name[,
    Object trainOptions]
  )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `AnomalyDetector`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; the
  same as the training options which can be used with
  [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html).

**Return type**

* An instance of `AnomalyDetector`.

##### AnomalyDetector.train()

Trains and loads a new anomaly detector. This method acts as a
wrapper for both [`sys.ML_TRAIN`](/doc/heatwave/en/mys-hwaml-ml-train.html)
and [`sys.ML_MODEL_LOAD`](/doc/heatwave/en/mys-hwaml-ml-model-load.html), but is
specific to MySQL HeatWave AutoML anomaly detection.

**Signature**

* ```
  AnomalyDetector.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Arguments**

* *`trainData`*
  (`Table`): A
  [`Table`](srjsapi-table.html "27.3.6.5 Table Object") containing a
  training dataset. The table must not take up more than 10
  GB space, or hold more than 100 million rows or more than
  1017 columns.

* *`targetColumnName`*
  (`String`): Name of the target column
  containing ground truth values. The type used for this
  column cannot be [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types").

**Return type**

* *None*.

##### AnomalyDetector.fit()

An alias for
[`train()`](srjsapi-anomalydetector.html#srjsapi-anomalydetector-train "AnomalyDetector.train()"), and
identical to it in all respects other than name. See
[AnomalyDetector.train()](srjsapi-anomalydetector.html#srjsapi-anomalydetector-train "AnomalyDetector.train()"), for more
information.

##### AnomalyDetector.predict()

This method predicts labels, acting as a wrapper for
[`sys.ML_PREDICT_ROW`](/doc/heatwave/en/mys-hwaml-ml-predict-row.html).

Predicts a label for a single sample of data, and returns the
label. See [ML\_PREDICT\_ROW](/doc/heatwave/en/mys-hwaml-ml-predict-row.html), for
more information.

**Signature**

* ```
  String AnomalyDetector.predict(
    Object sample[,
    Object options]
  )
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
[`sys.ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html), returning the
score for the test data in the specified table and column. For
possible metrics, see [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html).

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

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing test data to be scored; must contain the same
  columns as the training dataset.

* *`targetColumnName`*
  (`String`): Name of the target column
  containing ground truth values.

* *`metric`*
  (`String`): Name of the scoring metric to
  use. See [Optimization and Scoring Metrics](/doc/heatwave/en/mys-hwaml-ml-metrics.html), for
  information about metrics which can be used for AutoML
  anomaly detection.

* *`options`*
  (`Object`)
  (*optional*): A set of options in JSON
  object format. See the description of
  [`ML_SCORE`](/doc/heatwave/en/mys-hwaml-ml-score.html) for more
  information.

**Return type**

* `Number`.

##### AnomalyDetector.unload()

This method is a wrapper for
[`sys.ML_MODEL_UNLOAD`](/doc/heatwave/en/mys-hwaml-ml-model-unload.html), and
Unloads the model.

**Signature**

* ```
  AnomalyDetector.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.