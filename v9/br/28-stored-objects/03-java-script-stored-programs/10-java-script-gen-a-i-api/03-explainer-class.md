#### 27.3.10.3 Classe Explicativa

Esta classe é uma abstração do modelo explicativo do AutoML, conforme descrito em Gerar Explicações de Modelos. Não possui um construtor explícito, mas sim é obtida invocando `Classifier.getExplainer()`") ou `Regressor.getExplainer()`").

`Explainer` expõe um único método, `explain()`, em duas versões, ambas descritas nesta seção.

##### Explainer.explain()

###### Versão 1

Esta forma de `explain()` é um wrapper JavaScript para `ML_EXPLAIN_TABLE`, e explica os dados de treinamento de uma tabela dada, usando quaisquer opções fornecidas, e colocando os resultados em uma tabela de saída.

**Assinatura**

* ``` Explainer.explain( Table testData, Table outputTable[, Object options] )
  ```

**Argumentos**

* *`testData`*
  (`Table`): Tabela
  contendo dados a serem explicados.
* *`outputTable`*
  (`Table`): Tabela
  usada para armazenar
  resultados.
* *`options`*
  (`Object`)
  (*opcional*): Conjunto de opções a serem usadas
  ao explicar. Para mais informações, consulte
  Gerar Explicações de Previsões para uma Tabela.

**Tipo de retorno**

* *Nenhum*. (Insere em uma tabela.)

###### Versão 2

Explica uma amostra contendo dados de treinamento, que deve conter
membros usados no treinamento; membros extras são ignorados. Esta forma
de `explain()` é um wrapper para
`ML_EXPLAIN_ROW`.

**Assinatura**

* ```
  explain(
    Object sample[,
    Object options]
  )
  ```

**Argumentos**

* *`sample`* (`Object`): Uma amostra contendo dados de treinamento.

* *`options`* (`Object`) (*opcional*): Opções a serem usadas; consulte Gerar Explicações de Previsões para uma Linha de Dados, para mais informações.

**Tipo de retorno**

* *Nenhum*.