#### 27.3.10.6 Classe de Recomendação

* Construtor de Recomendação
* Recomendação.train()")
* Recomendação.fit()")
* Recomendação.predictRatings()")
* Recomendação.predictItems()")
* Recomendação.predictUsers()")
* Recomendação.predictSimilarItems()")
* Recomendação.predictSimilarUsers()")
* Recomendação.score()")
* Recomendação.unload()")

Esta classe encapsula a tarefa de recomendação conforme descrito em Gerar Recomendações. `Recomendação` suporta métodos para carregar, treinar e descarregar modelos, prever rótulos, calcular probabilidades, produzir explicadores e tarefas relacionadas.

Uma instância de `Recomendação` tem três propriedades acessíveis, listadas aqui:

* `nome` (`String`): O nome do modelo.

* `metadata` (`Objeto`): Metadados do modelo armazenados no catálogo do modelo. Veja Metadados do Modelo.

* `opçõesDeTreinamento` (`Objeto`): As opções de treinamento especificadas no construtor.

##### Construtor de Recomendação

Você pode obter uma instância de `Recomendação` invocando seu construtor, mostrado aqui:

**Assinatura**

* ``` new ml.Recommender( String name[, Object trainOptions] )
  ```

**Argumentos**

* *`nome`*
  (`String`): Identificador único para este
  `Recomendação`.
* *`opçõesDeTreinamento`*
  (`Objeto`)
  (*opcional*): Opções de treinamento; as mesmas que
  permitidas para `sys.ML_TRAIN`.

**Tipo de retorno**

* Uma instância de `Recomendação`.

##### Recomendação.train()

Treina e carrega um novo recomendador. Este método atua como um
wrapper para tanto `sys.ML_TRAIN`
quanto `sys.ML_MODEL_LOAD`, mas é
específico para a tarefa de recomendação AutoML.

**Assinatura**

* ```
  Recommender.train(
    Table trainData,
    String users,
    String items,
    String ratings
  )
  ```

**Argumentos**

* *`dadosDeTreinamento`* (`Tabela`): Uma `Tabela` contendo um conjunto de dados de treinamento. O tamanho máximo da tabela não deve exceder 10 GB de espaço, 100 milhões de linhas ou 1017 colunas.

* *`usuários`* (`String`): Lista de um ou mais usuários.

* `items`* (*`String`*): Lista de um ou mais itens sendo avaliados.

* `ratings`* (*`String`*): Lista de avaliações.

**Tipo de retorno**

* `None`.

##### Recommender.fit()

Este é um alias para `train()"), que é idêntico a ele em todos os aspectos, exceto pelo nome do método. Consulte Recommender.train()"), para obter mais informações.

##### Recommender.predictRatings()

Este método prevê avaliações para uma ou mais amostras e oferece duas variantes. A primeira prevê avaliações em uma tabela e as armazena em uma tabela de saída, enquanto a segunda prevê a avaliação de uma única amostra de dados e retorna a avaliação ao solicitante. Ambas as versões são abordadas nesta seção.

Consulte também Gerar Previsões para um Modelo de Recomendação.

###### Versão 1

Previsão de avaliações em uma tabela inteira e armazena-as na tabela de saída especificada. Um wrapper para a rotina MySQL HeatWave AutoML `ML_PREDICT_TABLE`.

**Assinatura**

* ``` Recommender.predictRatings( Table testData, Table outputTable[, Object options])
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela contendo dados de amostra.
* *`outputTable`*
  (`Table`): Tabela na qual os
  avaliações previstas serão armazenadas.
* *`options`*
  (`Object`)
  (*opcional*): Opções usadas para
  previsão.

**Tipo de retorno**

* `None`.

###### Versão 2

Retorna a avaliação prevista para uma única amostra de dados. Este
é um wrapper para
`ML_PREDICT_ROW`.

**Assinatura**

* ```
  Object Recommender.predictRatings(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Amostra de dados. Consulte Gerar Previsões para um Modelo de Recomendação, para obter o formato e outras informações.

* *`options`* (`Object`) (*opcional*): Uma ou mais opções, conforme descrito em Opções para Gerar Previsões, na documentação do MySQL HeatWave AutoML.

**Tipo de retorno**

* `Object`. Consulte Gerar Previsões para Avaliações e Classificações, para detalhes.

##### Recommender.predictItems()

Este método prevê itens para os usuários, conforme descrito em Gerar Previsões para um Modelo de Recomendação. Como outros métodos de previsão de recomendadores, o predictItems() existe em duas versões. A primeira prevê itens sobre uma tabela inteira de usuários e armazena as previsões em uma tabela de saída, enquanto a segunda prevê itens para uma única amostra de dados. Ambas as versões são descritas nesta seção.

###### Versão 1

Previsa itens sobre uma tabela de usuários e armazena as previsões em uma tabela de saída; wrapper em JavaScript para `ML_PREDICT_TABLE`.

**Assinatura**

* ``` Recommender.predictItems( Table testData, Table outputTable[, Object options])
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados.
* *`outputTable`*
  (`Table`): Tabela para armazenar previsões.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções a serem usadas
  ao fazer previsões; veja
  Options for Generating Predictions,
  para mais informações sobre as opções possíveis.

**Tipo de retorno**

* *Nenhum*.

###### Versão 2

Previsa itens para uma única amostra de dados de usuários. Esta forma
do método é um wrapper para
`ML_PREDICT_ROW`.

**Assinatura**

* ```
  Object Recommender.predictItems(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Amostra de dados.

* *`options`* (`Object`) (*opcional*): Uma ou mais opções a serem empregadas ao fazer previsões.

**Tipo de retorno**

* `Object`; um conjunto de previsões.

##### Recommender.predictUsers()

Dependendo da versão do método chamada, o `predictUsers()` prevê usuários sobre uma tabela inteira de itens e os armazena em uma tabela de saída, ou prevê usuários para um único conjunto de dados de amostra de itens e retorna o resultado como um objeto. (Veja Gerar Previsões para um Modelo de Recomendação.) Ambas as versões são descritas nos parágrafos seguintes.

###### Versão 1

Prediz usuários sobre uma tabela de itens e os armazena em uma tabela de saída. Um wrapper para a rotina específica do AutoML de MySQL `ML_PREDICT_TABLE` para previsão de usuário.

**Assinatura**

* ``` Recommender.predictUsers( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados de itens.
* *`outputTable`*
  (`Table`): Tabela para armazenar previsões de usuário.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções a serem usadas
  ao fazer previsões; consulte
  Opções para Gerar Previsões,
  para informações sobre as opções possíveis.

**Tipo de retorno**

* *Nenhum*.

###### Versão 2

Prediz usuários para uma única amostra de dados de itens e retorna
o resultado; um wrapper em JavaScript para a rotina MySQL HeatWave AutoML
`ML_PREDICT_ROW`,
destinado à previsão de usuário.

**Assinatura**

* ```
  Object Recommender.predictUsers(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Amostra de dados de itens.

* *`options`* (`Object`) (*opcional*): Uma ou mais opções a serem empregadas ao fazer previsões.

**Tipo de retorno**

* `Object`; este é um conjunto de previsões de usuário no formato de objeto JavaScript.

##### Recommender.predictSimilarItems()

A partir de itens dados, previna itens semelhantes. Duas variantes deste método são suportadas, conforme descrito no restante desta seção: a primeira previne itens semelhantes para uma tabela inteira contendo itens, e armazena as previsões na tabela de saída; a outra retorna um conjunto de itens previstos semelhantes para um único conjunto de itens.

predictSimilarItems(Table testData, Table outputTable[, Object options]) previne itens semelhantes sobre toda a tabela de itens e os armazena em outputTable. Consulte a documentação para mais informações.

predictSimilarItems(Object sample[, Object options]) -> Object previne itens semelhantes a partir do único item. Consulte a documentação para mais informações.

###### Versão 1

Prediz itens semelhantes em uma tabela de itens e armazena os itens previstos em uma tabela de saída. Um wrapper para a função `ML_PREDICT_TABLE` específico para o AutoML da tarefa de recomendação para previsão de usuário.

**Assinatura**

* ``` Recommender.predictSimilarItems( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela que
  contem dados de itens.
* *`outputTable`*
  (`Table`): Tabela usada para armazenar previsões de usuário.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções a serem usadas
  ao fazer previsões. Para informações sobre as opções
  disponíveis, consulte
  Opções para Gerar Previsões.

**Tipo de retorno**

* *Nenhum*.

###### Versão 2

Esta versão de `predictSimilarUsers()`
prediz itens semelhantes para uma única amostra de dados de itens
e retorna o resultado; um wrapper em JavaScript para a rotina MySQL HeatWave AutoML
`ML_PREDICT_ROW`,
destinada para recomendação de previsão de itens semelhantes.

**Assinatura**

* ```
  Object Recommender.predictSimilarItems(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Amostra de dados de itens.

* *`options`* (`Object`) (*opcional*): Uma ou mais opções a serem empregadas ao fazer previsões.

**Tipo de retorno**

* `Object`; um conjunto de itens semelhantes previstos.

##### Recommender.predictSimilarUsers()

Prediz usuários semelhantes a partir de um conjunto dado de usuários (consulte Gerar Previsões para um Modelo de Recomendação). Duas versões deste método são suportadas; ambas são descritas nesta seção.

###### Versão 1

Opções para Gerar Previsões

**Assinatura**

* ``` predictSimilarUsers( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela que
  contem dados de itens.
* *`outputTable`*
  (`Table`): Tabela usada para armazenar previsões de usuário.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções a serem usadas
  ao fazer previsões. Para informações sobre as opções
  disponíveis, consulte
  Opções para Gerar Previsões.

**Tipo de retorno**

* *Nenhum*.

###### Versão 2

Prediz usuários semelhantes a partir de uma amostra e retorna as previsões para o chamador.

**Assinatura**

* ```
  Object predictSimilarUsers(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Objeto`): Dados do item da amostra.

* *`options`* (`Objeto`) (*opcional*): Uma ou mais opções para usar ao fazer previsões.

**Tipo de retorno**

* `Objeto`; este é um conjunto de usuários semelhantes previstos.

##### Recommender.score()

Retorna a pontuação para os dados de teste na tabela e coluna indicadas. Para métricas possíveis e seus efeitos, consulte Métricas de Otimização e Pontuação.

Este método serve como um wrapper JavaScript para a rotina `sys.ML_SCORE` do MySQL HeatWave AutoML.

**Assinatura**

* ``` score( Table testData, String targetColumnName, String metric[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Tabela`): Tabela
  contendo dados de teste a serem pontuados; esta tabela deve conter
  as mesmas colunas que o conjunto de dados de treinamento.
* *`targetColumnName`*
  (`String`): Nome da coluna de destino
  contendo valores de verdade.
* *`metric`*
  (`String`): Nome da métrica de pontuação.
  Consulte Métricas de Otimização e Pontuação, para
  informações sobre as métricas compatíveis com a recomendação do AutoML.
* *`options`*
  (`Objeto`)
  (*opcional*): Um conjunto de opções em formato JSON
  Consulte a descrição de
  `ML_SCORE` para mais
  informações.

**Tipo de retorno**

* `Número`.

##### Recommender.unload()

Descarrega o modelo. Este método é um wrapper JavaScript para
`sys.ML_MODEL_UNLOAD`; consulte a
descrição desta função na documentação do MySQL HeatWave AutoML
para informações relacionadas.

**Assinatura**

* ```
  Recommender.unload()
  ```

**Argumentos**

* *`None`.

**Tipo de retorno**

* *`None`.