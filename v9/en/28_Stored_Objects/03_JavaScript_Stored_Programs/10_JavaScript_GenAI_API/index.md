### 27.3.10 JavaScript GenAI API

27.3.10.1 AnomalyDetector Class

27.3.10.2 Classifier Class

27.3.10.3 Explainer Class

27.3.10.4 Forecaster Class

27.3.10.5 LLM Class

27.3.10.6 Recommender Class

27.3.10.7 Regressor Class

27.3.10.8 Convenience Methods

This section provides reference information for the GenAI API supported by JavaScript stored routines in the MLE Component.

This API enables the GenAI feature, with which you can perform natural-language searches using large language models (LLMs). A large language model is reflected in the JavaScript API as the `LLM` class and its attendant methods.

For more information about the GenAI feature, see:

* In the *MySQL HeatWave User Guide*: About MySQL HeatWave GenAI

* In the *MySQL AI User Guide*: About GenAI

GenAI is supported only with MySQL HeatWave and MySQL AI.

While MySQL provides SQL stored functions and procedures to invoke AutoML features, accessing these can be unintuitive for JavaScript developers. The JavaScript API described in this section acts as a wrapper which invokes these SQL stored programs.

The AutoML feature is supported only by MySQL HeatWave and MySQL AI, and thus the JavaScript API described here is supported when either MySQL HeatWave is enabled, or when MySQL AI is installed.

For more information about the AutoML feature, see:

* In the *MySQL HeatWave User Guide*: Train and Use Machine Learning Models

* In the *MySQL AI User Guide*: Training and Using Machine Learning Models
