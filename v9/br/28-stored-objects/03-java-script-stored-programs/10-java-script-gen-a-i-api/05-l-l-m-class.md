#### 27.3.10.5 Classe LLM

* LLM Constructor
* LLM.unload()")
* LLM.generate()")
* LLM.embed()")
* LLM.rag()")

Esta classe representa um modelo de linguagem grande. Os membros acessíveis a partir de instâncias desta classe estão listados aqui:

* `name` (`String`): O nome do modelo

* `options` (`Object`): As opções de configuração do modelo

* `isLoaded` (`Boolean`): `true` se o modelo estiver carregado, `false` se não estiver

##### LLM Constructor

A classe LLM tem o construtor mostrado aqui:

**Construtor da classe LLM**

* ``` LLM( String name, Object options )
  ```

**Argumentos**

* *`name`*
  (`String`): o nome do modelo
* *`options`*
  (`Object`) (padrão
  `{}`): um objeto contendo as opções
  usadas por esta instância

**Tipo de retorno**

* Uma instância de `LLM`

**Uso**

* ```
  let model = LLM("llama3.2-3b-instruct-v1", {max_tokens: 10})
  ```

`LLM` fornece métodos para criar embeddings, gerar respostas e realizar Retrieval Augmented Generation. A API também fornece métodos de conveniência; veja a Seção 27.3.10.8, “Métodos de Conveniência”. Ambas as versões desses métodos suportam variantes dos métodos para realizar tarefas individuais e processamento em lote.

##### LLM.unload()

Descarrega o modelo que foi carregado no construtor. Isso é opcional, mas recomendado, pois isso pode reduzir o uso de memória; após a descarga, qualquer tentativa subsequente de usar a instância gera um erro.

**Assinatura**

* ``` undefined LLM.unload()
  ```

**Argumentos**

* *Nenhum*

**Tipo de retorno**

* `undefined`

**Uso**

* ```
  model.unload()
  ```

##### LLM.generate()

Este método atua como um wrapper para `ML_GENERATE` e gera uma resposta usando o prompt e as opções fornecidas para o modelo carregado. Ele suporta duas variantes, uma para uma invocação única e uma para processamento em lote; ambas são descritas nos próximos parágrafos.

**Assinatura (tarefa individual)**

* ``` Object LLM.generate( String prompt, Object options )
  ```

**Argumentos**

* `prompt`
  (`String`): prompt a ser usado para geração de texto
* `options`
  (`Object`)(padrão
  `{}`) : um objeto contendo as opções
  usadas por essa instância; veja a descrição de
  `ML_GENERATE` para opções disponíveis
**Tipo de retorno**

* `Object` : A estrutura é semelhante à
  da `ML_GENERATE`.

**Uso**

* ```
  let response = model.generate("What is MySql?", {"top_k": 2})
  ```
**Assinatura (processamento em lote)**

* ``` undefined LLM.generate( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```
**Argumentos**

* `inputTable`
  (`Table`): Tabela a ser usada para operações
* `inputColumn`
  (`String`): Nome da coluna da
  `inputTable` a ser incorporada
* `outputColumn`
  (`String`): Nome da coluna onde os
  incorporados serão armazenados; isso pode ser
  qualquer nome de coluna totalmente qualificado ou
  apenas o nome da coluna; no último caso, a
  tabela de entrada e seu esquema são usados para
  construir o nome totalmente qualificado
* `options`
  (`Object`)(opcional; padrão
  `{}`) : Um objeto contendo as opções
  usadas para incorporação; veja a descrição de
  `ML_EMBED_ROW` para opções disponíveis
**Tipo de retorno**

* `undefined`

**Uso**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.generate(table, "input", "mlcorpus.predictions.response")
  ```

##### LLM.embed()

Este método é um wrapper para `ML_EMBED_ROW`, e gera uma incorporação cujo tipo corresponde ao tipo `VECTOR` do MySQL. Ele suporta duas variantes, uma para uma única invocação e outra para processamento em lote; ambas são descritas nos próximos parágrafos.

**Assinatura (um único trabalho)**

* ``` Float32Array LLM.embed( String query, Object options )
  ```
**Argumentos**

* `query`
  (`String`): O texto a ser incorporado
* `options`
  (`Object`)(opcional; padrão
  `{}`) : Um objeto contendo as opções
  usadas para incorporação; veja a descrição de
  `ML_EMBED_ROW` para opções disponíveis
**Tipo de retorno**

* `Float32Array` (MySQL
  `VECTOR`): A incorporação

**Uso**

* ```
  let embedding = model.embed("What is MySql?")
  ```
**Assinatura (processamento em lote)**

* ``` undefined LLM.embed( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Argumentos**

* `inputTable`
  (`Tabela`): Tabela a ser usada para operações
* `inputColumn`
  (`String`): Nome da coluna da
  `inputTable` a ser incorporada
* `outputColumn`
  (`String`): Nome da coluna onde os
  incorporados serão armazenados; pode ser
  um nome de coluna totalmente qualificado
  ou apenas o nome da coluna; no último
  caso, a tabela de entrada e seu esquema
  são usados para construir o nome
  totalmente qualificado
* `options`
  (`Objeto`) (opcional; padrão
  `{}`) : Um objeto contendo as opções
  usadas para incorporação; veja a
  descrição de `ML_EMBED_ROW` para
  opções disponíveis

**Tipo de retorno**

* `undefined`

**Uso**

* ```
  // Using fully-qualified output column name

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "mlcorpus.predictions.response")

  // Using output column name only; constructs the fully-qualfied name
  // "mlcorpus.genai_table.response"

  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")
  model.embed(table, "input", "response")
  ```

##### LLM.rag()

Este método realiza a Geração Aumentada de Recuperação para uma consulta dada, usando o modelo genAI carregado, atuando como um wrapper para `ML_RAG`. Ele suporta duas variantes, uma para uma invocação única e uma para processamento em lote; ambas são descritas nos próximos parágrafos.

**Assinatura (um único trabalho)**

* ``` Object LLM.rag( String query, Object options )
  ```

**Argumentos**

* `query`
  (`String`): O texto a ser usado para
  recuperação e geração de conteúdo
* `options` (Objeto) (padrão
  `{}`) : As opções empregadas para
  geração; essas seguem as mesmas regras
  que as opções usadas com `LLM.generate()`")

**Tipo de retorno**

* `Objeto`: A estrutura é semelhante à
  da estrutura do objeto retornado por
  `ML_RAG`.

**Uso**

* ```
  let result = model.rag("What is MySql?", {schema: ["vector_store"], n_citations: 1})
  ```

**Assinatura (processamento em lote)**

* ``` undefined LLM.rag( Table inputTable, String inputColumn, String outputColumn, Object options )
  ```

**Argumentos**

* `inputTable`
  (`Tabela`): Tabela a ser usada para as operações
* `inputColumn`
  (`String`): Nome da coluna da
  `inputTable` a ser incorporada
* `outputColumn`
  (`String`): Nome da coluna onde os
  incorporados serão armazenados; pode ser
  um nome de coluna totalmente qualificado
  ou apenas o nome da coluna; no último
  caso, a tabela de entrada e seu esquema
  são usados para construir o nome
  totalmente qualificado
* `options`
  (`Objeto`)(opcional; padrão
  `{}`) : Um objeto contendo as opções
  usadas para incorporação; veja a
  descrição de `ML_EMBED_ROW` para
  opções disponíveis

**Tipo de retorno**

* `undefined`

**Uso**

* ```
  let schema = session.getSchema("mlcorpus")
  let table = schema.getTable("genai_table")

  model.rag(table, "input", "mlcorpus.predictions.response",
    {schema: ["vector_store"], n_citations: 1})
  ```