### 27.3.10 JavaScript GenAI API

[27.3.10.1 AnomalyDetector Class](srjsapi-anomalydetector.html)

[27.3.10.2 Classifier Class](srjsapi-classifier.html)

[27.3.10.3 Explainer Class](srjsapi-explainer.html)

[27.3.10.4 Forecaster Class](srjsapi-forecaster.html)

[27.3.10.5 LLM Class](srjsapi-llm.html)

[27.3.10.6 Recommender Class](srjsapi-recommender.html)

[27.3.10.7 Regressor Class](srjsapi-regressor.html)

[27.3.10.8 Convenience Methods](srjsapi-convenience-methods.html)

This section provides reference information for the GenAI API
supported by JavaScript stored routines in the MLE Component.

This API enables the GenAI feature, with which you can perform
natural-language searches using large language models (LLMs). A
large language model is reflected in the JavaScript API as the
`LLM` class and its attendant methods.

For more information about the GenAI feature, see:

* In the *MySQL HeatWave User Guide*:
  [About MySQL HeatWave GenAI](/doc/heatwave/en/mys-hw-genai-overview.html)

* In the *MySQL AI User Guide*:
  [About GenAI](/doc/mysql-ai/en/mys-ai-genai-overview.html)

GenAI is supported only with MySQL HeatWave and MySQL AI.

While MySQL provides SQL stored functions and procedures to invoke
AutoML features, accessing these can be unintuitive for JavaScript
developers. The JavaScript API described in this section acts as a
wrapper which invokes these SQL stored programs.

The AutoML feature is supported only by MySQL HeatWave and MySQL AI, and
thus the JavaScript API described here is supported when either
MySQL HeatWave is enabled, or when MySQL AI is installed.

For more information about the AutoML feature, see:

* In the *MySQL HeatWave User Guide*:
  [Train and Use Machine Learning Models](/doc/heatwave/en/mys-hwaml-machine-learning.html)

* In the *MySQL AI User Guide*:
  [Training and Using Machine Learning Models](/doc/mysql-ai/en/myai-ml-machine-learning.html)