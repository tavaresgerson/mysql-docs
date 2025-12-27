#### 27.3.10.1 Classe AnomalyDetector

* Construtor de AnomalyDetector
* AnomalyDetector.train()")
* AnomalyDetector.fit()")
* AnomalyDetector.predict()")
* AnomalyDetector.score()")
* AnomalyDetector.unload()")

Esta classe encapsula a tarefa de detecção de anomalias conforme descrito em Detectar Anomalias. O `AnomalyDetector` suporta métodos para carregar, treinar e descarregar modelos, prever rótulos, calcular probabilidades e tarefas relacionadas.

O `AnomalyDetector` fornece as seguintes propriedades acessíveis:

* `name` (`String`): O nome do modelo.

* `metadata` (`Object`): Metadados do modelo no catálogo de modelos. Consulte Metadados de Modelos.

* `trainOptions` (`Object`): As opções de treinamento especificadas no construtor ao criar uma instância de `AnomalyDetector`.

##### Construtor de AnomalyDetector

O construtor da classe `AnomalyDetector` é mostrado aqui:

**Construtor da classe AnomalyDetector**

* ``` new ml.AnomalyDetector( String name[, Object trainOptions] )
  ```

**Argumentos**

* *`name`*
  (`String`): Identificador único para este
  `AnomalyDetector`.
* *`trainOptions`*
  (`Object`)
  (*opcional*): Opções de treinamento; o
  mesmo que as opções de treinamento que podem ser usadas com
  `sys.ML_TRAIN`.

**Tipo de retorno**

* Uma instância de `AnomalyDetector`.

##### AnomalyDetector.train()

Treina e carrega um novo detector de anomalias. Este método atua como um
wrapper para tanto `sys.ML_TRAIN`
quanto `sys.ML_MODEL_LOAD`, mas é
específico para a detecção de anomalias MySQL HeatWave AutoML.

**Assinatura**

* ```
  AnomalyDetector.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Argumentos**

* *`trainData`* (`Table`): Uma `Table` contendo um conjunto de dados de treinamento. A tabela não pode ocupar mais de 10 GB de espaço ou conter mais de 100 milhões de linhas ou mais de 1017 colunas.

* *`targetColumnName`* (`String`): Nome da coluna de destino contendo os valores de verdade. O tipo usado para esta coluna não pode ser `TEXT`.

**Retorno**

* *Nenhum*.

##### AnomalyDetector.fit()

Um alias para `train()"), e idêntico a ele em todos os aspectos, exceto pelo nome. Consulte AnomalyDetector.train()"), para mais informações.

##### AnomalyDetector.predict()

Este método prevê rótulos, atuando como um wrapper para `sys.ML_PREDICT_ROW`.

Preve o rótulo para uma única amostra de dados e retorna o rótulo. Consulte ML\_PREDICT\_ROW, para mais informações.

**Assinatura**

* ``` String AnomalyDetector.predict( Object sample[, Object options] )
  ```

**Argumentos**

* *`sample`*
  (`Object`): Amostra de dados. Este argumento
  deve conter membros que foram usados para treinamento; membros extras podem ser incluídos, mas estes são ignorados durante a previsão.
* *`options`*
  (`Object` (*opcional*): Conjunto de uma ou mais
  opções.

**Tipo de retorno**

* `String`.

##### AnomalyDetector.score()

Este método serve como um wrapper em JavaScript para
`sys.ML_SCORE`, retornando o
pontuação para os dados de teste na tabela e coluna especificadas. Para possíveis métricas, consulte Métricas de Otimização e Pontuação.

**Assinatura**

* ```
  score(
    Table testData,
    String targetColumnName,
    String metric[,
    Object options]
  )
  ```

**Argumentos**

* *`testData`* (`Table`): Tabela contendo dados de teste a serem pontuados; deve conter as mesmas colunas que o conjunto de dados de treinamento.
* *`targetColumnName`* (`String`): Nome da coluna de destino contendo os valores de verdade.
* *`metric`* (`String`): Nome da métrica de pontuação a ser usada. Consulte Métricas de Otimização e Pontuação, para informações sobre métricas que podem ser usadas para detecção de anomalias AutoML.
* *`options`* (`Object` (*opcional*): Um conjunto de opções no formato de objeto JSON. Consulte a descrição de `ML_SCORE` para mais informações.

**Tipo de retorno**

* `Number`.

##### AnomalyDetector.unload()

Este método é um wrapper para `sys.ML_MODEL_UNLOAD`, e descarrega o modelo.

**Assinatura**

* ``` AnomalyDetector.unload()
  ```

**Argumentos**

* *`None`.

**Tipo de retorno**

* *`None`.