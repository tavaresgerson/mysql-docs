#### 27.3.10.4 Classe de Previsora

* Construtor de Previsora
* Forecaster.train()")
* Forecaster.fit()")
* Forecaster.predict()")
* Forecaster.score()")
* Forecaster.unload()")

Esta classe encapsula a tarefa de previsão, conforme descrito em Gerar Previsões. O `Forecaster` suporta métodos para carregar, treinar e descarregar modelos, prever rótulos e tarefas relacionadas.

Cada instância do `Forecaster` tem três propriedades acessíveis, listadas aqui:

* `name` (`String`): O nome do modelo.

* `metadata` (`Object`): Metadados do modelo armazenados no catálogo do modelo. Veja Metadados do Modelo.

* `trainOptions` (`Object`): As opções de treinamento especificadas no construtor ao criar esta instância.

##### Construtor de Forecaster

Você pode obter uma instância do `Forecaster` invocando seu construtor, mostrado aqui:

**Assinatura**

* ``` new ml.Forecaster( String name[, Object trainOptions] )
  ```

**Argumentos**

* *`name`*
  (`String`): Identificador único para este
  `Forecaster`.
* *`trainOptions`*
  (`Object`)
  (*opcional*): Opções de treinamento; estas
  são as mesmas que as opções de treinamento usadas com
  `sys.ML_TRAIN`.

**Tipo de retorno**

* Uma instância de `Forecaster`.

##### Forecaster.train()

Treina e carrega uma nova previsão. Este método atua como um wrapper
para tanto `sys.ML_TRAIN` quanto
`sys.ML_MODEL_LOAD`, mas é
específico para a previsão do MySQL HeatWave AutoML.

**Assinatura**

* ```
  Forecaster.train(
    Table trainData,
    String index,
    Array[String] endogenousVariables[,
    Array[String] exogenousVariables]
  )
  ```

**Argumentos**

* *`trainData`* (`Table`): Uma `Table` contendo um conjunto de dados de treinamento. A tabela não deve ocupar mais de 10 GB de espaço, ou conter mais de 100 milhões de linhas ou mais de 1017 colunas.

* *`index`* (`String`): Nome da coluna de destino contendo os valores de verdade. Isso não deve ser uma coluna `TEXT`.

* *`endogenousVariables`* (`Array[String]`): O nome ou nomes da(s) coluna(s) a serem previstas.

* `exogenousVariables`* (`Array[String]`): O nome ou os nomes da(s) coluna(s) de variáveis independentes e preditoras, que não foram previstas.

**Tipo de retorno**

* Não retorna um valor. Após invocar este método, você pode observar seus efeitos selecionando as tabelas `MODEL_CATALOG` e `model_object_catalog`, conforme descrito nos exemplos fornecidos na documentação do MySQL HeatWave.

##### Forecaster.fit()

Um alias para `train()`"), e idêntico a ele em todos os aspectos, exceto pelo nome do método. Consulte Forecaster.train()"), para mais informações.

##### Forecaster.predict()

Este método prevê rótulos e tem duas variantes, uma das quais prevê rótulos a partir de dados encontrados na tabela indicada e os armazena em uma tabela de saída; essa variante do `predict()` atua como um wrapper JavaScript para `sys.ML_PREDICT_TABLE`. A outra variante deste método é um wrapper para `sys.ML_PREDICT_ROW`, e prevê um rótulo para um único conjunto de dados de amostra e o retorna ao chamador. Ambas as versões são mostradas aqui.

###### Versão 1

Previsão de rótulos, salvando-os na tabela de saída especificada pelo usuário.

**Assinatura**

* ``` Forecaster.predict( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados de teste.
* *`outputTable`*
  (`Table`): Tabela na qual os rótulos serão armazenados. A saída escrita na tabela usa o mesmo
  conteúdo e formato que a gerada pela rotina AutoML
  `ML_PREDICT_TABLE`.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções no formato JSON. Para mais informações, consulte
  ML\_PREDICT\_TABLE.

**Tipo de retorno**

* *Nenhum*. (Insere em uma tabela de destino.)

###### Versão 2

Previsão de um rótulo para uma única amostra de dados e retorna-o.
Consulte ML\_PREDICT\_ROW, para mais informações sobre o tipo e o formato do valor retornado.

**Assinatura**

* ```
  String Forecaster.predict(
    Object sample
  )
  ```

**Argumentos**

* `sample` (`Objeto`): Dados de amostra contendo membros que foram usados para o treinamento; membros extras podem ser incluídos, mas são ignorados durante a previsão.

**Tipo de retorno**

* `String`. Consulte a documentação da `ML_PREDICT_ROW` para obter detalhes.

##### Forecaster.score()

Retorna a pontuação para os dados de teste na tabela e coluna indicadas, usando a métrica especificada. Para os possíveis valores de métrica e seus efeitos, consulte Métricos de Otimização e Pontuação.

`score()` é um wrapper JavaScript para `sys.ML_SCORE`.

**Assinatura**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Argumentos**

* `testData`
  (`Tabela`): Tabela que
  contém os dados de teste. A tabela deve conter as mesmas
  colunas que o conjunto de dados de treinamento.
* `targetColumnName`
  (`String`): Nome da coluna de destino
  que contém os valores de verdade.
* `metric`
  (`String`): Nome da métrica de pontuação.
  Consulte Métricos de Otimização e Pontuação, para
  informações sobre métricas que podem ser usadas para a previsão
  MySQL HeatWave AutoML.
* `options`
  (`Objeto`)
  (*opcional*): Um conjunto de opções no formato chave-valor JSON. Para mais informações, consulte ML\_SCORE.

**Tipo de retorno**

* `Número`.

##### Forecaster.unload()

Descarrega o modelo. Este método é um wrapper para
`sys.ML_MODEL_UNLOAD`; consulte a descrição desta rotina na documentação do MySQL HeatWave AutoML para mais informações.

**Assinatura**

* ```
  Forecaster.unload()
  ```

**Argumentos**

* `None`.

**Tipo de retorno**

* `None`.