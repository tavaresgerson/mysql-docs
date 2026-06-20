#### 27.3.10.3 Explainer Class

This class is an abstraction of the AutoML explainer model as described in Generate Model Explanations. It has no explicit constructor, but rather is obtained by invoking `Classifier.getExplainer()`") or `Regressor.getExplainer()`").

`Explainer` exposes a single method, `explain()`, in two variants, both of which are described in this section.

##### Explainer.explain()

###### Version 1

This form of `explain()` is a JavaScript wrapper for `ML_EXPLAIN_TABLE`, and explains the training data from a given table using any supplied options, and placing the results in an output table.

**Signature**

* ``` Explainer.explain( Table testData, Table outputTable[, Object options] )
  ```

**Arguments**

* *`testData`*
  ([`Table`](srjsapi-table.html "27.3.6.5 Table Object")): Table
  containing data to be explained.
* *`outputTable`*
  (`Table`): Table used for storing
  results.
* *`options`*
  (`Object`)
  (*optional*): Set of options to use
  when explaining. For more information, see
  [Generate Prediction Explanations for a Table](/doc/heatwave/en/mys-hwaml-explanations-ml-explain-table.html).

**Return type**

* *None*. (Inserts into a table.)

###### Version 2

Explains a sample containing training data, which must contain
members used in training; extra members are ignored. This form
of `explain()` is a wrapper for
[`ML_EXPLAIN_ROW`](/doc/heatwave/en/mys-hwaml-ml-explain-row.html).

**Signature**

* ```
  explain(
    Object sample[,
    Object options]
  )
  ```

**Arguments**

* *`sample`* (`Object`): A sample containing training data.

* *`options`* (`Object`) (*optional*): Options to be used; see Generate Prediction Explanations for a Row of Data, for more information.

**Return type**

* *None*.