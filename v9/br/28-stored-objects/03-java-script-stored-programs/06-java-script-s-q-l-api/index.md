### 27.3.6 API SQL JavaScript

27.3.6.1 Objeto Session

27.3.6.2 Objeto SqlExecute

27.3.6.3 Objeto SqlResult

27.3.6.4 Objeto Schema

27.3.6.5 Objeto Table

27.3.6.6 Objeto Column

27.3.6.7 Objeto Row

27.3.6.8 Objeto Warning

27.3.6.9 Objeto PreparedStatement

27.3.6.10 API de Rotinas Armazenadas JavaScript

27.3.6.11 API de Transações JavaScript

27.3.6.12 Funções MySQL

27.3.6.13 Objeto SqlError

Esta seção fornece informações de referência para a API SQL e conjunto de resultados suportada pelas rotinas armazenadas JavaScript no Componente MLE.

A API suporta os objetos de nível superior listados aqui:

* `Column`: Metadados da coluna do conjunto de resultados.

* `PreparedStatement`: Manipulador para execução de declarações preparadas.

* `Row`: Linha em um conjunto de resultados.
* `Session`: Sessão do usuário MySQL. Para informações sobre os métodos transacionais `Session`, como `startTransaction()`, `commit()` e `rollback()`, consulte a Seção 27.3.6.11, “API de Transações JavaScript”.

* `SqlExecute`: Manipulador para execução de declarações SQL (simples). Seu método `execute()` executa uma declaração SQL.

* `SqlResult`: Conjunto de resultados retornado por uma declaração SQL.

* `Warning`: Aviso gerado pela execução da declaração.

A API SQL só pode ser usada dentro de procedimentos armazenados JavaScript e não pode ser usada dentro de funções armazenadas JavaScript.