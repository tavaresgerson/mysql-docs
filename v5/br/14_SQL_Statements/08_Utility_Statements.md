## 13.8 Declarações de Utilidade

### 13.8.1 Declaração DESCRIBE

As declarações `DESCRIBE` e `EXPLAIN` são sinônimos, usadas para obter informações sobre a estrutura da tabela ou planos de execução de consultas. Para mais informações, consulte a Seção 13.7.5.5, “Declaração SHOW COLUMNS”, e a Seção 13.8.2, “Declaração EXPLAIN”.

### 13.8.2 Declaração `EXPLAIN`

```sql
{EXPLAIN | DESCRIBE | DESC}
    tbl_name [col_name | wild]

{EXPLAIN | DESCRIBE | DESC}
    [explain_type]
    {explainable_stmt | FOR CONNECTION connection_id}

explain_type: {
    EXTENDED
  | PARTITIONS
  | FORMAT = format_name
}

format_name: {
    TRADITIONAL
  | JSON
}

explainable_stmt: {
    SELECT statement
  | DELETE statement
  | INSERT statement
  | REPLACE statement
  | UPDATE statement
}
```

As declarações `DESCRIBE` e `EXPLAIN` são sinônimos. Na prática, a palavra-chave `DESCRIBE` é mais frequentemente usada para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usada para obter um plano de execução de consulta (ou seja, uma explicação de como o MySQL executaria uma consulta).

A discussão a seguir utiliza as palavras-chave `DESCRIBE` e `EXPLAIN` de acordo com esses usos, mas o analisador MySQL as trata como completamente sinônimos.

* Obter informações sobre a estrutura da tabela
* Obter informações sobre o plano de execução

#### Obtenção de informações sobre a estrutura da tabela

`DESCRIBE` fornece informações sobre as colunas de uma tabela:

```sql
mysql> DESCRIBE City;
+------------+----------+------+-----+---------+----------------+
| Field      | Type     | Null | Key | Default | Extra          |
+------------+----------+------+-----+---------+----------------+
| Id         | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name       | char(35) | NO   |     |         |                |
| Country    | char(3)  | NO   | UNI |         |                |
| District   | char(20) | YES  | MUL |         |                |
| Population | int(11)  | NO   |     | 0       |                |
+------------+----------+------+-----+---------+----------------+
```

`DESCRIBE` é um atalho para `SHOW COLUMNS`. Essas declarações também exibem informações para visualizações. A descrição para `SHOW COLUMNS` fornece mais informações sobre as colunas de saída. Veja a Seção 13.7.5.5, “Declaração SHOW COLUMNS”.

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas da tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a declaração exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Pode conter os caracteres curinga `%` e `_` do SQL. Neste caso, a declaração exibe saída apenas para as colunas com nomes que correspondem à string. Não há necessidade de encerrar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A declaração `DESCRIBE` é fornecida para compatibilidade com o Oracle.

As declarações `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Veja a Seção 13.7.5, “Declarações SHOW”.

#### Obtenção de informações sobre o plano de execução

A declaração `EXPLAIN` fornece informações sobre como o MySQL executa as declarações:

* As declarações `EXPLAIN` funcionam com as declarações `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

* Quando `EXPLAIN` é usado com uma declaração explicável, o MySQL exibe informações do otimizador sobre o plano de execução da declaração. Isso significa que o MySQL explica como processaria a declaração, incluindo informações sobre como as tabelas são unidas e em que ordem. Para informações sobre o uso de `EXPLAIN` para obter informações sobre o plano de execução, consulte a Seção 8.8.2, “Formato de Saída EXPLAIN”.

* Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma declaração explicável, ele exibe o plano de execução da declaração que está sendo executada na conexão nomeada. Veja a Seção 8.8.4, “Obtenção de Informações do Plano de Execução para uma Conexão Nomeada”.

* Para as declarações `SELECT`, o `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja a Seção 8.8.3, “Formato de Saída de EXPLAIN Extendido”.

Nota

Em versões mais antigas do MySQL, as informações extensas eram produzidas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída extensível é habilitada por padrão, então a palavra-chave `EXTENDED` é supérflua e desatualizada. Seu uso resulta em um aviso, e é removido da sintaxe `EXPLAIN` no MySQL 8.0.

* `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja a Seção 22.3.5, “Obtenção de Informações sobre Partições”.

Nota

Em versões mais antigas do MySQL, as informações de partição eram produzidas usando `EXPLAIN PARTITIONS`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída de partição é habilitada por padrão, então a palavra-chave `PARTITIONS` é supérflua e desatualizada. Seu uso resulta em um aviso, e é removido da sintaxe `EXPLAIN` no MySQL 8.0.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se não houver opção `FORMAT`. O formato `JSON` exibe as informações em formato JSON.

Para declarações complexas, a saída JSON pode ser bastante grande; em particular, pode ser difícil, ao lê-la, alinhar o parêntese de fechamento e o parêntese de abertura; para fazer com que a chave da estrutura JSON, se houver, seja repetida perto do parêntese de fechamento, definida como `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON gerem um erro.

`EXPLAIN` exige os mesmos privilégios necessários para executar a declaração explicada. Além disso, `EXPLAIN` também exige o privilégio `SHOW VIEW` para qualquer visão explicada.

Com a ajuda do `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a declaração execute mais rápido, usando índices para encontrar strings. Você também pode usar o `EXPLAIN` para verificar se o otimizador está combinando as tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma declaração `SELECT`, comece a declaração com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja a Seção 13.2.9, “Declaração SELECT”.)

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para detalhes, consulte a Seção 8.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas que o otimizador faz. Veja a Seção 13.7.2.1, “Declaração ANALYZE TABLE”.

Nota

O MySQL Workbench possui uma capacidade de Explicação Visual que fornece uma representação visual do `EXPLAIN` de saída. Veja o Tutorial: Usando Explicação para melhorar o desempenho da consulta.

### 13.8.3 Declaração de AJUDA

```sql
HELP 'search_string'
```

A declaração `HELP` retorna informações online do Manual de Referência do MySQL. Seu funcionamento adequado requer que as tabelas de ajuda no banco de dados `mysql` sejam inicializadas com informações sobre tópicos de ajuda (consulte Seção 5.1.14, “Suporte de Ajuda do Lado do Servidor”).

A declaração `HELP` procura as tabelas de ajuda pelo texto de pesquisa fornecido e exibe o resultado da pesquisa. O texto de pesquisa não é sensível ao caso.

A string de busca pode conter os caracteres de comodinho `%` e `_`. Estes têm o mesmo significado que para operações de correspondência de padrões realizadas com o operador `LIKE`. Por exemplo, `HELP 'rep%'` retorna uma lista de tópicos que começam com `rep`.

A declaração `HELP` não exige um terminador como `;` ou `\G`.

A declaração HELP entende vários tipos de strings de pesquisa:

* No nível mais geral, use `contents` para obter uma lista das categorias de ajuda de nível superior:

  ```sql
  HELP 'contents'
  ```

* Para uma lista de tópicos em uma categoria de ajuda dada, como `Data Types`, use o nome da categoria:

  ```sql
  HELP 'data types'
  ```

* Para obter ajuda sobre um tópico específico, como a função `ASCII()` ou a declaração `CREATE TABLE`, use a(s) palavra(s)‑chave associada(s):

  ```sql
  HELP 'ascii'
  HELP 'create table'
  ```

Em outras palavras, a string de busca corresponde a uma categoria, muitos tópicos ou um único tópico. As descrições a seguir indicam as formas que o conjunto de resultados pode assumir.

* Resultado vazio

Não foi possível encontrar uma correspondência para a string de pesquisa.

Exemplo: `HELP 'fake'`

Rendimentos:

  ```sql
  Nothing found
  Please try to run 'help contents' for a list of all accessible topics
  ```

* Conjunto de resultados contendo uma única string

Isso significa que a string de busca produziu um resultado para o tópico de ajuda. O resultado inclui os seguintes itens:

+ `name`: Nome do tópico.  
  + `description`: Texto de ajuda descritiva para o tópico.

+ `example`: Um ou mais exemplos de uso. (Pode estar vazio.)

Exemplo: `HELP 'log'`

Rendimentos:

  ```sql
  Name: 'LOG'
  Description:
  Syntax:
  LOG(X), LOG(B,X)

  If called with one parameter, this function returns the natural
  logarithm of X. If X is less than or equal to 0.0E0, the function
  returns NULL and a warning "Invalid argument for logarithm" is
  reported. Returns NULL if X or B is NULL.

  The inverse of this function (when called with a single argument) is
  the EXP() function.

  URL: https://dev.mysql.com/doc/refman/8.0/en/mathematical-functions.html

  Examples:
  mysql> SELECT LOG(2);
          -> 0.69314718055995
  mysql> SELECT LOG(-2);
          -> NULL
  ```

* Lista de tópicos.

Isso significa que a string de busca correspondeu a vários tópicos de ajuda.

Exemplo: `HELP 'status'`

Rendimentos:

  ```sql
  Many help items for your request exist.
  To make a more specific request, please type 'help <item>',
  where <item> is one of the following topics:
     FLUSH
     SHOW
     SHOW ENGINE
     SHOW FUNCTION STATUS
     SHOW MASTER STATUS
     SHOW PROCEDURE STATUS
     SHOW SLAVE STATUS
     SHOW STATUS
     SHOW TABLE STATUS
  ```

* Lista de tópicos.

Uma lista também é exibida se a string de busca corresponder a uma categoria.

Exemplo: `HELP 'functions'`

Rendimentos:

  ```sql
  You asked for help about help category: "Functions"
  For more information, type 'help <item>', where <item> is one of the following
  categories:
     Aggregate Functions and Modifiers
     Bit Functions
     Cast Functions and Operators
     Comparison Operators
     Date and Time Functions
     Encryption Functions
     Enterprise Encryption Functions
     Flow Control Functions
     GROUP BY Functions and Modifiers
     GTID
     Information Functions
     Locking Functions
     Logical Operators
     Miscellaneous Functions
     Numeric Functions
     Spatial Functions
     String Functions
     XML
  ```

### 13.8.4 Declaração de Uso

```sql
USE db_name
```

A declaração `USE` informa ao MySQL que use o banco de dados nomeado como o banco de dados padrão (atual) para declarações subsequentes. Essa declaração requer algum privilégio para o banco de dados ou algum objeto dentro dele.

O banco de dados nomeado permanece como padrão até o final da sessão ou até que outra declaração `USE` seja emitida:

```sql
USE db1;
SELECT COUNT(*) FROM mytable;   # selects from db1.mytable
USE db2;
SELECT COUNT(*) FROM mytable;   # selects from db2.mytable
```

O nome do banco de dados deve ser especificado em uma única string. As novas strings nos nomes dos bancos de dados não são suportadas.

Tornar um banco de dados específico o padrão por meio da declaração `USE` não impede o acesso a tabelas em outros bancos de dados. O exemplo a seguir acessa a tabela `author` do banco de dados `db1` e a tabela `editor` do banco de dados `db2`:

```sql
USE db1;
SELECT author_name,editor_name FROM author,db2.editor
  WHERE author.editor_id = db2.editor.editor_id;
```
