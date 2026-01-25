#### 5.5.4.2 Utilizando o Plugin Rewriter Query Rewrite

Para habilitar ou desabilitar o Plugin, habilite ou desabilite a system variable [`rewriter_enabled`](rewriter-query-rewrite-plugin-reference.html#sysvar_rewriter_enabled). Por padrão, o Plugin `Rewriter` é habilitado quando você o instala (veja [Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin Rewriter Query Rewrite”](rewriter-query-rewrite-plugin-installation.html "5.5.4.1 Instalando ou Desinstalando o Plugin Rewriter Query Rewrite")). Para definir explicitamente o estado inicial do Plugin, você pode definir a variável na inicialização do servidor. Por exemplo, para habilitar o Plugin em um arquivo de opção, use estas linhas:

```sql
[mysqld]
rewriter_enabled=ON
```

Também é possível habilitar ou desabilitar o Plugin em tempo de execução (runtime):

```sql
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Assumindo que o Plugin `Rewriter` esteja habilitado, ele examina e possivelmente modifica cada instrução [`SELECT`](select.html "13.2.9 SELECT Statement") recebida pelo servidor. O Plugin determina se deve reescrever (rewrite) as instruções com base em seu cache de regras de reescrita em memória, que são carregadas da tabela `rewrite_rules` no Database `query_rewrite`.

* [Adicionando Regras de Rewrite](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-adding-rewrite-rules "Adicionando Regras de Rewrite")
* [Como Funciona a Correspondência de Instruções](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-how-statement-matching-works "Como Funciona a Correspondência de Instruções")
* [Rewriting de Prepared Statements](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-rewriting-prepared-statements "Rewriting de Prepared Statements")
* [Informações Operacionais do Plugin Rewriter](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-operational-information "Informações Operacionais do Plugin Rewriter")
* [Uso de Character Sets pelo Plugin Rewriter](rewriter-query-rewrite-plugin-usage.html#rewriter-query-rewrite-plugin-use-of-character-sets "Uso de Character Sets pelo Plugin Rewriter")

##### Adicionando Regras de Rewrite

Para adicionar regras ao Plugin `Rewriter`, adicione linhas à tabela `rewrite_rules` e, em seguida, invoque a stored procedure `flush_rewrite_rules()` para carregar as regras da tabela no Plugin. O exemplo a seguir cria uma regra simples para corresponder a instruções que selecionam um único valor literal:

```sql
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante se parece com isto:

```sql
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: NULL
normalized_pattern: NULL
```

A regra especifica um *pattern template* (modelo de padrão) indicando quais instruções [`SELECT`](select.html "13.2.9 SELECT Statement") devem ser correspondidas, e um *replacement template* (modelo de substituição) indicando como reescrever as instruções correspondentes. No entanto, adicionar a regra à tabela `rewrite_rules` não é suficiente para fazer com que o Plugin `Rewriter` use a regra. Você deve invocar `flush_rewrite_rules()` para carregar o conteúdo da tabela no cache em memória do Plugin:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dica

Se suas regras de rewrite não estiverem funcionando corretamente, certifique-se de ter recarregado a tabela de regras chamando `flush_rewrite_rules()`.

Quando o Plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (statement digest) a partir do padrão e um valor de digest hash, e os utiliza para atualizar as colunas `normalized_pattern` e `pattern_digest`:

```sql
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: 46b876e64cd5c41009d91c754921f1d4
normalized_pattern: select ?
```

Para informações sobre *statement digesting*, instruções normalizadas e valores de digest hash, consulte [Seção 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o Plugin grava uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema. Verifique a tabela `rewrite_rules` quanto a linhas com valores `message` que não sejam `NULL` para ver quais problemas existem.

Os Patterns (Padrões) usam a mesma sintaxe que os prepared statements (veja [Seção 13.5.1, “PREPARE Statement”](prepare.html "13.5.1 PREPARE Statement")). Dentro de um *pattern template*, os caracteres `?` atuam como parameter markers (marcadores de parâmetro) que correspondem a data values (valores de dados). Os caracteres `?` não devem ser incluídos em aspas. Os parameter markers podem ser usados apenas onde os data values devem aparecer, e não podem ser usados para SQL keywords, identifiers, functions, e assim por diante. O Plugin analisa uma instrução para identificar os valores literais (conforme definido na [Seção 9.1, “Valores Literais”](literals.html "9.1 Valores Literais")), então você pode colocar um parameter marker no lugar de qualquer valor literal.

Assim como o pattern, o replacement (substituição) pode conter caracteres `?`. Para uma instrução que corresponde a um *pattern template*, o Plugin a reescreve, substituindo os parameter markers `?` no replacement usando os data values correspondidos pelos marcadores correspondentes no pattern. O resultado é uma string de instrução completa. O Plugin solicita ao servidor que a analise e retorna o resultado ao servidor como a representação da instrução reescrita.

Após adicionar e carregar a regra, verifique se o rewrite ocorre de acordo com a correspondência das instruções ao pattern da regra:

```sql
mysql> SELECT PI();
+----------+
| PI()     |
+----------+
| 3.141593 |
+----------+
1 row in set (0.01 sec)

mysql> SELECT 10;
+--------+
| 10 + 1 |
+--------+
|     11 |
+--------+
1 row in set, 1 warning (0.00 sec)
```

Nenhum rewrite ocorre para a primeira instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), mas ocorre para a segunda. A segunda instrução ilustra que, quando o Plugin `Rewriter` reescreve uma instrução, ele produz uma mensagem de *warning*. Para visualizar a mensagem, use [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"):

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Para habilitar ou desabilitar uma regra existente, modifique sua coluna `enabled` e recarregue a tabela no Plugin. Para desabilitar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite que você desative uma regra sem removê-la da tabela.

Para reabilitar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que o `Rewriter` usa para corresponder a nomes de tabelas que não são qualificados com um nome de Database:

* Nomes de tabelas qualificados em instruções correspondem a nomes qualificados no pattern se os nomes de Database e de tabela correspondentes forem idênticos.

* Nomes de tabelas não qualificados em instruções correspondem a nomes não qualificados no pattern somente se o Database padrão for o mesmo que `pattern_database` e os nomes das tabelas forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que se espera que as aplicações selecionem linhas da tabela usando uma Query de uma destas formas, onde a segunda pode ser usada quando `appdb` é o Database padrão:

```sql
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela precise ser modificada para adicionar outro tipo de ID e seja necessário indicar de forma mais específica que tipo de ID a coluna `id` representa).

A alteração significa que as aplicações devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas aplicações antigas que não podem ser atualizadas deixam de funcionar corretamente. O Plugin `Rewriter` pode resolver esse problema correspondendo e reescrevendo instruções problemáticas. Para corresponder à instrução `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de replacement na tabela de regras de rewrite. Se você também quiser corresponder a este `SELECT` usando o nome da tabela não qualificado, também é necessário adicionar uma regra explícita. Usando `?` como um placeholder de valor, as duas instruções [`INSERT`](insert.html "13.2.5 INSERT Statement") necessárias se parecem com isto:

```sql
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement) VALUES(
    'SELECT * FROM appdb.users WHERE id = ?',
    'SELECT * FROM appdb.users WHERE user_id = ?'
    );
INSERT INTO query_rewrite.rewrite_rules
    (pattern, replacement, pattern_database) VALUES(
    'SELECT * FROM users WHERE id = ?',
    'SELECT * FROM users WHERE user_id = ?',
    'appdb'
    );
```

Após adicionar as duas novas regras, execute a seguinte instrução para fazê-las entrar em vigor:

```sql
CALL query_rewrite.flush_rewrite_rules();
```

O `Rewriter` usa a primeira regra para corresponder a instruções que utilizam o nome de tabela qualificado, e a segunda para corresponder a instruções que utilizam o nome não qualificado. A segunda regra funciona apenas quando `appdb` é o Database padrão.

##### Como Funciona a Correspondência de Instruções (Statement Matching)

O Plugin `Rewriter` usa *statement digests* e valores de *digest hash* para corresponder instruções recebidas contra regras de rewrite em estágios. A system variable `max_digest_length` determina o tamanho do Buffer usado para calcular os *statement digests*. Valores maiores permitem o cálculo de digests que distinguem instruções mais longas. Valores menores usam menos memória, mas aumentam a probabilidade de instruções mais longas colidirem com o mesmo valor de digest.

O Plugin corresponde cada instrução às regras de rewrite da seguinte forma:

1. Calcula o valor de statement digest hash e o compara aos valores de rule digest hash. Isso está sujeito a falsos positivos, mas serve como um teste rápido de rejeição.

2. Se o valor de statement digest hash corresponder a quaisquer valores de pattern digest hash, corresponde a forma normalizada (*statement digest*) da instrução à forma normalizada dos patterns de regra correspondentes.

3. Se a instrução normalizada corresponder a uma regra, compara os valores literais na instrução e no pattern. Um caractere `?` no pattern corresponde a qualquer valor literal na instrução. Se a instrução preparar uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), `?` no pattern também corresponde a `?` na instrução. Caso contrário, os literais correspondentes devem ser os mesmos.

Se múltiplas regras corresponderem a uma instrução, é não determinístico qual delas o Plugin usará para reescrever a instrução.

Se um pattern contiver mais markers do que o replacement, o Plugin descarta os data values em excesso. Se um pattern contiver menos markers do que o replacement, isso é um erro. O Plugin percebe isso quando a tabela de regras é carregada, grava uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema e define a status variable [`Rewriter_reload_error`](rewriter-query-rewrite-plugin-reference.html#statvar_Rewriter_reload_error) como `ON`.

##### Rewriting de Prepared Statements

Prepared statements são reescritos no momento da análise (parse time) (ou seja, quando são preparados), e não quando são executados posteriormente.

Prepared statements diferem de instruções não preparadas, pois podem conter caracteres `?` como parameter markers. Para corresponder a um `?` em um prepared statement, um pattern do `Rewriter` deve conter `?` no mesmo local. Suponha que uma regra de rewrite tenha este pattern:

```sql
SELECT ?, 3
```

A tabela a seguir mostra várias instruções [`SELECT`](select.html "13.2.9 SELECT Statement") preparadas e se o pattern da regra corresponde a elas.

| Prepared Statement | Se o Pattern Corresponde à Instrução |
| :--- | :--- |
| `PREPARE s AS 'SELECT 3, 3'` | Sim |
| `PREPARE s AS 'SELECT ?, 3'` | Sim |
| `PREPARE s AS 'SELECT 3, ?'` | Não |
| `PREPARE s AS 'SELECT ?, ?'` | Não |

##### Informações Operacionais do Plugin Rewriter

O Plugin `Rewriter` disponibiliza informações sobre sua operação por meio de diversas status variables:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Rewriter%';
+-----------------------------------+-------+
| Variable_name                     | Value |
+-----------------------------------+-------+
| Rewriter_number_loaded_rules      | 1     |
| Rewriter_number_reloads           | 5     |
| Rewriter_number_rewritten_queries | 1     |
| Rewriter_reload_error             | ON    |
+-----------------------------------+-------+
```

Para descrições dessas variáveis, consulte [Seção 5.5.4.3.4, “Rewriter Query Rewrite Plugin Status Variables”](rewriter-query-rewrite-plugin-reference.html#rewriter-query-rewrite-plugin-status-variables "5.5.4.3.4 Rewriter Query Rewrite Plugin Status Variables").

Quando você carrega a tabela de regras chamando a stored procedure `flush_rewrite_rules()`, se ocorrer um erro em alguma regra, a instrução `CALL` produz um erro, e o Plugin define a status variable `Rewriter_reload_error` como `ON`:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.

mysql> SHOW GLOBAL STATUS LIKE 'Rewriter_reload_error';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Rewriter_reload_error | ON    |
+-----------------------+-------+
```

Neste caso, verifique a tabela `rewrite_rules` quanto a linhas com valores `message` na coluna que não sejam `NULL` para ver quais problemas existem.

##### Uso de Character Sets pelo Plugin Rewriter

Quando a tabela `rewrite_rules` é carregada no Plugin `Rewriter`, o Plugin interpreta as instruções usando o valor global atual da system variable [`character_set_client`](server-system-variables.html#sysvar_character_set_client). Se o valor global de [`character_set_client`](server-system-variables.html#sysvar_character_set_client) for alterado posteriormente, a tabela de regras deve ser recarregada.

Um client deve ter um valor de session [`character_set_client`](server-system-variables.html#sysvar_character_set_client) idêntico ao valor global no momento em que a tabela de regras foi carregada, ou a correspondência de regras não funcionará para aquele client.