#### 27.3.10.7 Classe Regressor

* Construtor de Regressor
* Regressor.train()")
* Regressor.fit()")
* Regressor.predict()")
* Regressor.score()")
* Regressor.explain()")
* Regressor.getExplainer()")
* Regressor.unload()")

Esta classe é semelhante à `Classifier` e `Forecaster` na medida em que representa um modelo de treinamento do AutoML, mas encapsula a tarefa de regressão conforme descrito na documentação do MySQL HeatWave (veja Treinar um Modelo).

O `Regressor` suporta métodos para carregar, treinar e descarregar modelos, prever rótulos, calcular probabilidades, produzir explicadores e tarefas relacionadas; também possui três propriedades de instância acessíveis, listadas aqui:

* `name` (`String`): O nome do modelo.

* `metadata` (`Object`): Metadados do modelo armazenados no catálogo do modelo. Veja Metadados do Modelo.

* `trainOptions` (`Object`): As opções de treinamento especificadas no construtor (mostradas a seguir).

##### Construtor de Regressor

Para obter uma instância do `Regressor`, simplesmente invocando seu construtor, mostrado aqui:

**Assinatura**

* ``` new ml.Regressor( String name[, Object trainOptions] )
  ```

**Argumentos**

* *`name`*
  (`String`): Identificador único para esta
  instância do `Regressor`.
* *`trainOptions`*
  (`Object`)
  (*opcional*): Opções de treinamento. Estas
  são as mesmas usadas com
  `sys.ML_TRAIN`.

**Tipo de retorno**

* Uma instância de `Regressor`.

##### Regressor.train()

Treina e carrega um novo regressor, atuando como um wrapper para
`sys.ML_TRAIN` e
`sys.ML_MODEL_LOAD`, específicos para
a tarefa de regressão do AutoML.

**Assinatura**

* ```
  Regressor.train(
    Table trainData,
    String targetColumnName
  )
  ```

**Argumentos**

* *`trainData`* (`Table`): Uma `Table` que contém um conjunto de dados de treinamento. A tabela não deve exceder 10 GB de tamanho, ou conter mais de 100 milhões de linhas ou mais de 1017 colunas.

* `targetColumnName` (`String`): Nome da coluna de destino que contém os valores de verdade; colunas `TEXT` não são suportadas para esse propósito.

**Tipo de retorno**

* `undefined`.

##### Regressor.fit()

Este é apenas um alias para `train()"). Em todos os aspectos, exceto pelos nomes, os dois métodos são idênticos. Consulte Regressor.train()"), para mais informações.

##### Regressor.predict()

Este método prevê rótulos. `predict()` tem duas variantes, listadas aqui:

* Armazena rótulos previstos a partir de dados encontrados na tabela indicada e os armazena em uma tabela de saída; um wrapper para `sys.ML_PREDICT_TABLE`.

* Um wrapper para `sys.ML_PREDICT_ROW`; prevê um rótulo para um único conjunto de dados de amostra e o retorna ao chamador.

Ambas as versões de `predict()` são mostradas nesta seção.

###### Versão 1

Esta versão de `predict()` prevê rótulos, depois os salva em uma tabela de saída especificada ao invocar o método.

**Assinatura**

* ``` Regressor.predict( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Uma tabela
  contendo dados de teste.
* *`outputTable`*
  (`Table`): Uma tabela para armazenar os
  rótulos previstos. O conteúdo e o formato da saída são
  os mesmos daqueles produzidos por
  `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções no formato JSON
  `ML_PREDICT_TABLE`,
  para mais informações.

**Tipo de retorno**

* `undefined`.

###### Versão 2

Preve um rótulo para um único conjunto de dados de amostra, e o retorna ao chamador. Consulte `ML_PREDICT_ROW`,
para mais informações.

**Assinatura**

* ```
  String Regressor.predict(
    Object sample
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Dados de amostra. Este argumento *deve* conter membros que foram usados para treinamento; embora membros extras possam ser incluídos, esses são ignorados para fins de previsão.

**Tipo de retorno**

* `String`. Consulte `ML_PREDICT_ROW`.

Retorna a pontuação para os dados de teste na tabela e coluna indicados pelo usuário, usando uma métrica especificada; um wrapper JavaScript para `sys.ML_SCORE`.

**Assinatura**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados de teste a serem pontuados; essa tabela deve conter
  as mesmas colunas que o conjunto de dados de treinamento.
* *`targetColumnName`*
  (`String`): O nome da coluna de destino
  contendo valores de verdade.
* *`metric`*
  (`String`): Nome da métrica de pontuação a
  ser empregada. A seção de Métodos de Otimização e Pontuação
  fornece informações sobre métricas compatíveis com a
  tarefa de regressão do AutoML.
* *`options`*
  (`Object`)
  (*opcional*): Um conjunto de opções, como chaves
  e valores, no formato JSON. Veja a descrição de
  `ML_SCORE` para mais
  informações.

**Tipo de retorno**

* `Number`.

##### Regressor.explain()

Este método recebe uma `Table`
contendo um conjunto de dados treinado e o nome de uma coluna
de tabela contendo valores de verdade, e retorna o explaneiro
novamente treinado; um wrapper para a rotina MySQL HeatWave
`sys.ML_EXPLAIN`.

**Assinatura**

* ```
  explain(
    Table data,
    String targetColumnName[,
    Object options]
  )
  ```

**Argumentos**

* *`data`* (`Table`): Tabela contendo dados treinados.

* *`targetColumnName`* (`String`): Nome da coluna contendo valores de verdade.

* *`options`* (`Object`) (*opcional*): Conjunto de parâmetros opcionais, no formato JSON.

**Retorno**

* Adiciona um explaneiro de modelo ao catálogo de modelos; não retorna um valor. Veja ML_EXPLAIN, para mais informações.

##### Regressor.getExplainer()

Retorna um explaneiro para este `Regressor`.

**Assinatura**

* ``` Object Regressor.getExplainer()
  ```

**Argumentos**

* *Nenhum*.

**Retorno**

* `Object`

##### Regressor.unload()

Descarrega o modelo. Este método é um wrapper para
`sys.ML_MODEL_UNLOAD`.

**Assinatura**

* ```
  Regressor.unload()
  ```

**Argumentos**

* *Nenhum*.

**Tipo de retorno**

* `undefined`