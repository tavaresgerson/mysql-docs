### 27.3.10 API GenAI de JavaScript

27.3.10.1 Classe AnomalyDetector

27.3.10.2 Classe Classifier

27.3.10.3 Classe Explainer

27.3.10.4 Classe Forecaster

27.3.10.5 Classe LLM

27.3.10.6 Classe Recommender

27.3.10.7 Classe Regressor

27.3.10.8 Métodos de conveniência

Esta seção fornece informações de referência para a API GenAI suportada por rotinas armazenadas em JavaScript no Componente MLE.

Esta API habilita o recurso GenAI, com o qual você pode realizar pesquisas de linguagem natural usando modelos de linguagem grandes (LLMs). Um modelo de linguagem grande é refletido na API JavaScript como a classe `LLM` e seus métodos associados.

Para mais informações sobre o recurso GenAI, consulte:

* No *Guia do Usuário MySQL HeatWave*: Sobre o GenAI MySQL HeatWave

* No *Guia do Usuário MySQL AI*: Sobre o GenAI

O GenAI é suportado apenas com MySQL HeatWave e MySQL AI.

Embora o MySQL forneça funções e procedimentos armazenados em SQL para invocar recursos do AutoML, acessar esses recursos pode ser pouco intuitivo para desenvolvedores de JavaScript. A API JavaScript descrita nesta seção atua como um wrapper que invoca esses programas armazenados em SQL.

O recurso AutoML é suportado apenas pelo MySQL HeatWave e pelo MySQL AI, e, portanto, a API JavaScript descrita aqui é suportada quando o MySQL HeatWave está habilitado ou quando o MySQL AI está instalado.

Para mais informações sobre o recurso AutoML, consulte:

* No *Guia do Usuário MySQL HeatWave*: Treinar e Usar Modelos de Aprendizado de Máquina

* No *Guia do Usuário MySQL AI*: Treinar e Usar Modelos de Aprendizado de Máquina