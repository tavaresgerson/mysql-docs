#### 27.3.10.8 Métodos de conveniência

A API GenAI fornece os métodos de conveniência descritos nesta seção sob o namespace `ml`. Esses métodos atuam como wrappers para os métodos `LLM`; em vez de serem invocados como métodos de instância de `LLM`, eles aceitam o ID do modelo como uma das opções passadas a eles. `ml.generate()`) e `ml.rag()`) retornam apenas as partes de texto dos valores retornados por seus equivalentes `LLM`.

* ml.generate()`)
* ml.embed()`)
* ml.load()`)
* ml.rag()`)

##### ml.generate()

Este método é um wrapper para `LLM.generate()"). Ele carrega o modelo especificado pelo *`model_id`* especificado como uma das *`options`*, gera uma resposta com base no prompt usando este modelo e retorna a resposta. O `model_id` padrão (`"llama3.2-3b-instruct-v1"`) é usado se um não for especificado. Como o método `LLM`, `ml.generate()` suporta duas variantes, uma para uma única invocação e outra para processamento em lote.

**Assinatura (um único trabalho)**

* ``` String ml.generate( String prompt, Object options )
  ```

**Argumentos**

* *`prompt`*
  (`String`): O prompt desejado
* *`options`*
  (`Objeto`) (padrão
  `{}`) : As opções empregadas para
  geração; essas seguem as mesmas regras que as opções
  usadas com `LLM.generate()`)

**Tipo de retorno**

* `String` : O texto da resposta

**Uso**

* ```
  //  Both invocations use "llama3.2-3b-instruct-v1" as the model_id

  let response = ml.generate("What is Mysql?", {max_tokens: 10})

  let response = ml.generate("What is Mysql?", {model_id: "llama3.2-3b-instruct-v1", max_tokens: 10})
  ```

**Assinatura (processamento em lote)**

* ``` undefined ml.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Argumentos**

* `inputTable`
  (`Tabela`): Tabela a ser usada para operações
* `inputColumn`
  (`String`): Nome da coluna da
  * `inputTable`* a ser incorporada
* `outputColumn`
  (`String`): Nome da coluna onde os
  incorporados serão armazenados; pode ser
  qualquer nome de coluna, completo ou
  simples; no último caso, a tabela de
  entrada e seu esquema são usados para
  construir o nome completo
* `options`
  (`Objeto`) (opcional; padrão
  `{}`): Um objeto contendo as opções
  usadas para incorporação; veja a
  descrição de `ML_EMBED_ROW` para
  opções disponíveis

**Tipo de retorno**

* `undefined`

**Uso**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  ml.generate(table, "input", "mlcorpus.predictions.response", {max_tokens: 10})
  ```

##### ml.embed()

Este método é um wrapper para `LLM.embed()"). Como o método `LLM`, ele suporta duas variantes, uma para uma única invocação e outra para processamento em lote.

**Assinatura (um único trabalho)**

* ``` Float32Array ml.embed( String query, Object options )
  ```

**Argumentos**

* *`query`*
  (`String`): Texto de uma consulta
  de linguagem natural
* *`options`*
  (`Objeto`) (padrão
  `{}`): As opções empregadas para
  geração; seguem as mesmas regras que as
  opções usadas com `LLM.embed()");
  o `id_modelo` padrão é
  `"all_minilm_l12_v2"`

**Tipo de retorno**

* `Float32Array` (MySQL
  `VECTOR`): O incorporação

**Uso**

* ```
  //  These produce the same result

  let embedding = ml.embed("What is Mysql?", {model_id: "all_minilm_l12_v2"})

  let embedding = ml.embed("What is Mysql?", {})
  ```

**Assinatura (processamento em lote)**

* ``` undefined ml.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Argumentos**

* `inputTable`
  (`Tabela`): Tabela a ser usada para operações
* `inputColumn`
  (`String`): Nome da coluna da
  `inputTable` a ser incorporada
* `outputColumn`
  (`String`): Nome da coluna onde os
  incorporados serão armazenados; isso pode ser
  um nome de coluna totalmente qualificado ou
  apenas o nome da coluna; no último caso, a
  tabela de entrada e seu esquema são usados para
  construir o nome totalmente qualificado
* `options`
  (`Objeto`) (opcional; padrão
  `{}`) : Um objeto contendo as opções
  usadas para incorporação; veja a descrição
  de `ML_EMBED_ROW` para opções
  disponíveis

**Tipo de retorno**

* `undefined`

**Uso**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  ml.embed(table, "input", "mlcorpus.predictions.response",
          {model_id: "all_minilm_l12_v2"})
  ```

##### ml.load()

Este método estático carrega um modelo existente (e já treinado) do MySQL HeatWave AutoML com o nome especificado. Um erro é lançado se o modelo com o nome fornecido não existir.

**Assinatura**

* ``` Object ml.load( String name )
  ```

**Argumentos**

* *`name`*
  (`String`): O nome do modelo.

**Tipo de retorno**

* `Object`: Qualquer um de
  `Classifier`,
  `Regressor`,
  `Forecaster`,
  `AnomalyDetector`, ou
  `Recommender`, dependendo
  do tipo de modelo carregado.

Para mais informações, consulte
ML_MODEL_LOAD.

##### ml.rag()

Este é um wrapper para
`LLM.rag()"). Como o método
`LLM`, ele suporta duas variantes, uma
para uma única invocação e uma para
processamento em lote.

**Assinatura (um único trabalho)**

* ```
  String ml.rag(
    String query,
    Object options
  )
  ```

**Argumentos**

* *`query`* (`String`): Texto de uma consulta de
  linguagem natural

* *`options`* (`Objeto`) (padrão
  `{}`) : As opções empregadas para
  geração; essas seguem as mesmas regras
  que as opções usadas com `LLM.rag()"); o
  `model_id` padrão é `"llama3.2-3b-instruct-v1"`

**Tipo de retorno**

* `String`: Texto da resposta

**Uso**

* ``` //  These produce the same result

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}})

  let result = ml.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Assinatura (processamento em lote)**

* ```
  undefined ml.rag(
    Table inputTable,
    String inputColumn,
    String outputColumn,
    Object options
  )
  ```

**Argumentos**

* `inputTable` (`Tabela`): Tabela a ser usada para as operações

* `inputColumn` (`String`): Nome da coluna da `inputTable` a ser incorporada

* `outputColumn` (`String`): Nome da coluna onde os incorporados serão armazenados; isso pode ser um nome de coluna totalmente qualificado ou apenas o nome da coluna; no último caso, a tabela de entrada e seu esquema são usados para construir o nome totalmente qualificado

* `options` (`Objeto`) (`Optional` (padrão: `{}`)): Um objeto contendo as opções usadas para incorporação; veja a descrição de `ML_EMBED_ROW` para as opções disponíveis

**Tipo de retorno**

* `undefined`

**Uso**

* ``` let schema = session.getSchema("mlcorpus") let table = schema.getTable("genai_table")

  ml.rag(table, "input", "mlcorpus.predictions.response", {schema: ["vector_store"], n_citations: 1, model_options: {model_id: "llama3.2-3b-instruct-v1"}});
  ```