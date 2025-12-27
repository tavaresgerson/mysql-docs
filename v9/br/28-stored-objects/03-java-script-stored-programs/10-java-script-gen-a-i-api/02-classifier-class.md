#### 27.3.10.2 Classe Classificadora

* Construtor da Classificadora
* Classifier.train()")
* Classifier.fit()")
* Classifier.predict()")
* Classifier.predictProba()")
* Classifier.score()")
* Classifier.explain()")
* Classifier.getExplainer()")
* Classifier.unload()")

Esta classe encapsula a tarefa de classificação conforme descrito em Treinar um Modelo. O `Classifier` suporta métodos para carregar, treinar e descarregar modelos, prever rótulos, calcular probabilidades, produzir explicadores e tarefas relacionadas.

Uma instância do `Classifier` tem três propriedades acessíveis, listadas aqui:

* `name` (`String`): O nome do modelo.

* `metadata` (`Object`): Metadados do modelo armazenados no catálogo do modelo. Veja Metadados do Modelo.

* `trainOptions` (`Object`): As opções de treinamento especificadas no construtor.

##### Construtor da Classificadora

Você pode obter uma instância do `Classifier` invocando seu construtor, mostrado aqui:

**Assinatura**

* ``` new ml.Classifier( String name[, Object trainOptions] )
  ```

**Argumentos**

* *`name`*
  (`String`): Identificador único para esta
  `Classificadora`.
* *`trainOptions`*
  (`Object`)
  (*opcional*): Opções de treinamento; estas
  são as mesmas que as opções de treinamento usadas com
  `sys.ML_TRAIN`.

**Tipo de retorno**

* Uma instância do `Classifier`.

Também é possível obter um
`Classifier` invocando
`ml.load()"). Veja
ml.load()"), para mais informações.

##### Classifier.train()

Treina e carrega um novo classificador. Este método atua como um
wrapper para tanto `sys.ML_TRAIN`
quanto `sys.ML_MODEL_LOAD`, mas é
específico para a tarefa de classificação MySQL HeatWave AutoML.

**Assinatura**

* ```
  Classifier.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Argumentos**

* *`trainData`* (`Table`): Uma `Table` contendo um conjunto de dados de treinamento. A tabela não deve ocupar mais de 10 GB de espaço, ou conter mais de 100 milhões de linhas ou mais de 1017 colunas.

* `targetColumnName` (`String`): Nome da coluna de destino que contém os valores de verdade. O tipo usado para essa coluna não pode ser `TEXT`.

**Tipo de retorno**

* `None`.

##### Classifier.fit()

Um alias para `train()"), e idêntico a ele em todos os aspectos, exceto pelo nome do método. Consulte Classifier.train()"), para mais informações.

##### Classifier.predict()

Este método prevê rótulos; tem duas variantes, uma das quais prevê rótulos a partir de dados encontrados na tabela indicada e os armazena em uma tabela de saída; esta é uma wrapper para `sys.ML_PREDICT_TABLE`. A outra variante deste método atua como uma wrapper para `sys.ML_PREDICT_ROW`, e prevê um rótulo para um único conjunto de dados de amostra e o retorna ao chamador. Ambas as versões do `predict()` são mostradas aqui.

###### Versão 1

Preveê rótulos e os armazena na tabela de saída especificada.

**Assinatura**

* ``` Classifier.predict( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados de teste.
* *`outputTable`*
  (`Table`): Tabela
  na qual os rótulos serão armazenados. O conteúdo e o formato da saída são os mesmos gerados por `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções no formato JSON. Consulte ML\_PREDICT\_TABLE,
  para mais informações.

**Tipo de retorno**

* `None`. (Insere na
  *`outputTable`; consulte
  ML\_PREDICT\_ROW.)

###### Versão 2

Preveê um rótulo para um único conjunto de dados de amostra e o retorna.
Consulte ML\_PREDICT\_ROW, para mais
informações.

**Assinatura**

* ```
  String Classifier.predict(
    Object sample
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Dados de amostra. Este argumento deve conter membros que foram usados para o treinamento; membros extras podem ser incluídos, mas estes são ignorados durante a previsão.

**Tipo de retorno**

* `String`. Consulte a documentação do `ML_PREDICT_ROW` para mais informações.

##### Classifier.predictProba()

Obtém as probabilidades para todas as classes dos dados de amostra passados. Como a versão de um argumento do `predict()`"), este método é um wrapper para `sys.ML_PREDICT_ROW`, mas, ao contrário do `predict()`, o `predictProba()` retorna apenas as probabilidades.

**Assinatura**

* ``` Classifier.predict( Object sample )
  ```

**Argumentos**

* *`sample`*
  (`Object`): Dados de amostra, na forma de um
  objeto JSON. Como na versão de um argumento do
  `Classifier.predict()`"),
  este argumento deve conter membros que foram usados para
  treinamento; membros extras podem ser incluídos, mas
  estes são ignorados durante a previsão.

**Tipo de retorno**

* `Object`. As probabilidades para os
  dados de amostra, no formato JSON.

##### Classifier.score()

Retorna a pontuação para os dados de teste na tabela e
coluna indicadas. Para os possíveis valores de métricas e seus efeitos, consulte
Métricas de Otimização e Pontuação.

Este método serve como um wrapper JavaScript para
`sys.ML_SCORE`.

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

* *`testData`* (`Table`): Tabela contendo dados de teste a serem pontuados; esta tabela deve conter as mesmas colunas que o conjunto de dados de treinamento.

* *`targetColumnName`* (`String`): Nome da coluna de destino contendo valores de verdade.

* *`metric`* (`String`): Nome da métrica de pontuação. Consulte
Métricas de Otimização e Pontuação, para informações sobre as métricas compatíveis com a classificação AutoML.

* *`options`* (`Object`) (*opcional*): Um conjunto de opções no formato JSON. Consulte a descrição de `ML_SCORE` para mais informações.

**Tipo de retorno**

* `Number`.

##### Classifier.explain()

Dado uma `Table` contendo um conjunto de dados rotulado, treinado e o nome de uma coluna de tabela contendo valores de verdade, este método retorna o novo explaneiro treinado.

Este método serve como um wrapper para a rotina `sys.ML_EXPLAIN` do MySQL HeatWave AutoML; consulte a descrição dessa rotina para obter mais informações.

**Assinatura**

* ``` explain( Table data, String targetColumnName[, Object options] )
  ```

**Argumentos**

* *`data`*
  (`Table`): Uma tabela
  que contém dados treinados.
* *`targetColumnName`*
  (`String`): O nome da coluna
  que contém os valores de verdade.
* *`options`*
  (`Object`)
  (*opcional*): Um conjunto de parâmetros opcionais, no formato JSON.

**Tipo de retorno**

* *`None`. Adiciona um explicativo de modelo ao catálogo do modelo; consulte ML_EXPLAIN para obter mais informações.

##### Classifier.getExplainer()

Retorna um explicativo para este classificador, se existir.

**Assinatura**

* ```
  Object Classifier.getExplainer()
  ```

**Argumentos**

* *`None`.

**Tipo de retorno**

* `Object`

##### Classifier.unload()

Descarrega o modelo. Este método é um wrapper para `sys.ML_MODEL_UNLOAD`.

**Assinatura**

* ``` Classifier.unload()
  ```

**Argumentos**

* *`None`.

**Tipo de retorno**

* `undefined`