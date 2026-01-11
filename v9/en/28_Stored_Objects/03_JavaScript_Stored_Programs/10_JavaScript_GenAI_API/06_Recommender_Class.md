#### 27.3.10.6 Recommender Class

* Recommender Constructor
* Recommender.train()")
* Recommender.fit()")
* Recommender.predictRatings()")
* Recommender.predictItems()")
* Recommender.predictUsers()")
* Recommender.predictSimilarItems()")
* Recommender.predictSimilarUsers()")
* Recommender.score()")
* Recommender.unload()")

This class encapsulates the recommendation task as described in Generate Recommendations. `Recommender` supports methods for loading, training, and unloading models, predicting labels, calculating probabilities, producing explainers, and related tasks.

An instance of `Recommender` has three accessible properties, listed here:

* `name` (`String`): The model name.

* `metadata` (`Object`): Model metadata stored in the model catalog. See Model Metadata.

* `trainOptions` (`Object`): The training options specified in the constructor.

##### Recommender Constructor

You can obtain an instance of `Recommender` by invoking its constructor, shown here:

**Signature**

* ``` new ml.Recommender( String name[, Object trainOptions] )
  ```

**Arguments**

* *`name`*
  (`String`): Unique identifier for this
  `Recommender`.
* *`trainOptions`*
  (`Object`)
  (*optional*): Training options; same as
  training options permitted for
  `sys.ML_TRAIN`.

**Return type**

* An instance of `Recommender`.

##### Recommender.train()

Trains and loads a new recommender. This method acts as a
wrapper for both `sys.ML_TRAIN`
and `sys.ML_MODEL_LOAD`, but is
specific to the AutoML recommendation task.

**Signature**

* ```
  Recommender.train(
    Table trainData,
    String users,
    String items,
    String ratings
  )
  ```

**Arguments**

* *`trainData`* (`Table`): A `Table` containing a training dataset. The maximum size of the table must not exceed 10 GB space, 100 million rows, or 1017 columns.

* *`users`* (`String`): List of one or more users.

* *`items`* (*`String`*): List of one or more items being rated.

* *`ratings`* (*`String`*): List of ratings.

**Return type**

* *None*.

##### Recommender.fit()

This is an alias for `train()`"), to which it is identical in all respects other than the method name. See Recommender.train()"), for more information.

##### Recommender.predictRatings()

This method predicts ratings for one or more samples, and provides two variants. The first of these predicts ratings over a table and stores them in an output table, while the second predicts the rating of a single sample of data and returns the rating to the caller. Both versions are covered in this section.

See also Generate Predictions for a Recommendation Model.

###### Version 1

Predicts ratings over an entire table and stores them in the specified output table. A wrapper for the MySQL HeatWave AutoML `ML_PREDICT_TABLE` routine.

**Signature**

* ``` Recommender.predictRatings( Table testData, Table outputTable[, Object options])
  ```

**Arguments**

* *`testData`*
  (`Table`): Table containing sample data.
* *`outputTable`*
  (`Table`): Table in which to store
  predicted ratings.
* *`options`*
  (`Object`)
  (*optional*): Options used for
  prediction.

**Return type**

* *None*.

###### Version 2

Returns the rating predicted for a single sample of data. This
is a wrapper for
`ML_PREDICT_ROW`.

**Signature**

* ```
  Object Recommender.predictRatings(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Data sample. Refer to Generate Predictions for a Recommendation Model, for format and other information.

* *`options`* (`Object`) (*optional*): One or more options, as described under Options for Generating Predictions, in the MySQL HeatWave AutoML documentation.

**Return type**

* `Object`. See Generate Predictions for Ratings and Rankings, for details.

##### Recommender.predictItems()

This method predicts items for users, as described in Generate Predictions for a Recommendation Model. Like other Recommender prediction methods, predictItems() exists in two versions. The first predicts items over an entire table of users and stores the predictions in an output table, while the second predicts items for a single sample of data. Both versions are described in this section.

###### Version 1

Predicts items over a table of users and stores the predictions in an output table; JavaScript wrapper for `ML_PREDICT_TABLE`.

**Signature**

* ``` Recommender.predictItems( Table testData, Table outputTable[, Object options])
  ```

**Arguments**

* *`testData`*
  (`Table`): Table
  containing data.
* *`outputTable`*
  (`Table`): Table for storing predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions; see
  Options for Generating Predictions,
  for more information about possible options.

**Return type**

* *None*.

###### Version 2

Predicts items for a single sample of user data. This form of
the method is a wrapper for
`ML_PREDICT_ROW`.

**Signature**

* ```
  Object Recommender.predictItems(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; a set of predictions.

##### Recommender.predictUsers()

Depending on which version of the method is called, `predictUsers()` either predicts users over an entire table of items and stores them in an output table, or predicts users for a single set of sample item data and returns the result as an object. (See Generate Predictions for a Recommendation Model.) Both versions are described in the following paragraphs.

###### Version 1

Predicts users over a table of items and stores them in an output table. A wrapper for `ML_PREDICT_TABLE` specific to AutoML user prediction.

**Signature**

* ``` Recommender.predictUsers( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): Table
  containing item data.
* *`outputTable`*
  (`Table`): Table for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions; see
  Options for Generating Predictions,
  for information about possible options.

**Return type**

* *None*.

###### Version 2

Predicts users for a single sample of item data and returns
the result; a JavaScript wrapper for the MySQL HeatWave AutoML
`ML_PREDICT_ROW` routine,
intended for user prediction.

**Signature**

* ```
  Object Recommender.predictUsers(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; this is a set of user predictions in JavaScript object format.

##### Recommender.predictSimilarItems()

From items given, predict similar items. Two variants of this method are supported, as described in the rest of this section: the first predicts similar items for an entire table containing items, and stores the predictions in an output table; the other returns a set of predicted similar items for a single set of items.

predictSimilarItems(Table testData, Table outputTable[, Object options]) predicts similar items over the whole table of items and stores them in outputTable. Refer to docs for more information.

predictSimilarItems(Object sample[, Object options]) -> Object predicts similar items from the single item. Refer to docs for more information.

###### Version 1

Predicts similar items over a table of items and stores the predicted items in an output table. A wrapper for `ML_PREDICT_TABLE` specific to AutoML the recommendation task for user prediction.

**Signature**

* ``` Recommender.predictSimilarItems( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): Table which
  contains item data.
* *`outputTable`*
  (`Table`): Table used for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions. For information about the options
  available, see
  Options for Generating Predictions.

**Return type**

* *None*.

###### Version 2

This version of `predictSimilarUsers()`
predicts similar items for a single sample of item data and
returns the result; a JavaScript wrapper for the MySQL HeatWave AutoML
`ML_PREDICT_ROW` routine,
intended for recommendation for similar item prediction.

**Signature**

* ```
  Object Recommender.predictSimilarItems(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; a set of predicted similar items.

##### Recommender.predictSimilarUsers()

Predicts similar users from a given set of users (see Generate Predictions for a Recommendation Model). Two versions of this method are supported; both are described in this section.

###### Version 1

Options for Generating Predictions

**Signature**

* ``` predictSimilarUsers( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): Table which
  contains item data.
* *`outputTable`*
  (`Table`): Table used for storing user
  predictions.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when making predictions. For information about the options
  available, see
  Options for Generating Predictions.

**Return type**

* *None*.

###### Version 2

Predicts similar users from a sample and returns the
predictions to the caller.

**Signature**

* ```
  Object predictSimilarUsers(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): Sample item data.

* *`options`* (`Object`) (*optional*): One or more options to employ when making predictions.

**Return type**

* `Object`; this is a set of predicted similar users.

##### Recommender.score()

Returns the score for the test data in the indicated table and column. For possible metrics and their effects, see Optimization and Scoring Metrics.

This method serves as a JavaScript wrapper for the MySQL HeatWave AutoML `sys.ML_SCORE` routine.

**Signature**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Arguments**

* *`testData`*
  (`Table`): Table
  containing test data to be scored; this table must contain
  the same columns as the training dataset.
* *`targetColumnName`*
  (`String`): Name of the target column
  containing ground truth values.
* *`metric`*
  (`String`): Name of the scoring metric.
  See Optimization and Scoring Metrics, for
  information about the metrics compatible with AutoML
  recommendation.
* *`options`*
  (`Object`)
  (*optional*): A set of options in JSON
  format. See the description of
  `ML_SCORE` for more
  information.

**Return type**

* `Number`.

##### Recommender.unload()

Unloads the model. This method is a JavaScript wrapper for
`sys.ML_MODEL_UNLOAD`; see the
description of this function in the MySQL HeatWave AutoML documentation
for related information.

**Signature**

* ```
  Recommender.unload()
  ```

**Arguments**

* *None*.

**Return type**

* *None*.
