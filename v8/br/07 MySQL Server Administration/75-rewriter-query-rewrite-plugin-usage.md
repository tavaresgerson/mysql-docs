#### 7.6.4.2 Usando o Plugin Rewrite Query Rewrite

Para ativar ou desativar o plugin, ativar ou desativar a variável do sistema `rewriter_enabled`. Por padrão, o plugin `Rewriter` é ativado quando você o instala (veja Seção 7.6.4.1, Instalar ou Desinstalar o Plugin Rewrite Query Rewrite). Para definir o estado inicial do plugin explicitamente, você pode definir a variável na inicialização do servidor. Por exemplo, para ativar o plugin em um arquivo de opções, use estas linhas:

```
[mysqld]
rewriter_enabled=ON
```

Também é possível ativar ou desativar o plugin durante a execução:

```
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Assumindo que o plug-in `Rewriter` está ativado, ele examina e possivelmente modifica cada instrução reescritível recebida pelo servidor. O plugin determina se deve reescrever instruções com base em seu cache de regras de reescrita na memória, que são carregadas da tabela `rewrite_rules` no banco de dados `query_rewrite`.

Estas instruções estão sujeitas a reescrita: `SELECT`, `INSERT`, `REPLACE`, `UPDATE`, e `DELETE`.

As instruções independentes e as instruções preparadas estão sujeitas a reescrita. As instruções que ocorrem dentro das definições de visualização ou programas armazenados não estão sujeitas a reescrita.

As instruções executadas por usuários com o privilégio `SKIP_QUERY_REWRITE` não estão sujeitas a reescrita, desde que a variável do sistema `rewriter_enabled_for_threads_without_privilege_checks` esteja definida como `OFF` (padrão `ON`). Isso pode ser usado para instruções de controle e instruções que devem ser replicadas inalteradas, como as do `SOURCE_USER` especificadas por `CHANGE REPLICATION SOURCE TO`. Isso também é válido para instruções executadas por programas cliente MySQL, incluindo **mysqlbinlog**, `mysqladmin` e `mysqldump`; por esta razão, você deve conceder `SKIP_QUERY_REWRITE` à conta ou contas de usuário usadas por esses utilitários para se conectar ao MySQL.

- Adição de Regras de Reescrita
- Como a correspondência de declarações funciona
- Reescrever declarações preparadas
- Informações operacionais do Plugin Rewriter
- Plugin Rewriter Uso de conjuntos de caracteres

##### Adição de Regras de Reescrita

Para adicionar regras para o plug-in `Rewriter`, adicione linhas à tabela `rewrite_rules` e, em seguida, invoque o procedimento armazenado `flush_rewrite_rules()` para carregar as regras da tabela no plugin. O exemplo a seguir cria uma regra simples para corresponder a instruções que selecionam um único valor literal:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante é o seguinte:

```
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

A regra especifica um modelo de padrão indicando quais instruções do `SELECT` devem corresponder, e um modelo de substituição indicando como reescrever instruções correspondentes. No entanto, adicionar a regra à tabela `rewrite_rules` não é suficiente para fazer com que o plugin `Rewriter` use a regra. Você deve invocar `flush_rewrite_rules()` para carregar o conteúdo da tabela no cache da memória do plugin:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dicas

Se suas regras de reescrita não parecem estar funcionando corretamente, verifique se você recarregou a tabela de regras chamando `flush_rewrite_rules()`.

Quando o plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (digest de declaração) a partir do padrão e um valor de hash de digest, e os usa para atualizar as colunas `normalized_pattern` e `pattern_digest`:

```
mysql> SELECT * FROM query_rewrite.rewrite_rules\G
*************************** 1. row ***************************
                id: 1
           pattern: SELECT ?
  pattern_database: NULL
       replacement: SELECT ? + 1
           enabled: YES
           message: NULL
    pattern_digest: d1b44b0c19af710b5a679907e284acd2ddc285201794bc69a2389d77baedddae
normalized_pattern: select ?
```

Para obter informações sobre a digestão de enunciados, enunciados normalizados e valores de hash de digestão, ver Secção 29.10, "Performance Schema Statement Digests and Sampling".

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o plugin escreve uma mensagem de erro para a coluna `message` da linha de regras para comunicar o problema.

Os padrões usam a mesma sintaxe que as instruções preparadas (ver Seção 15.5.1, PREPARE Statement). Dentro de um modelo de padrão, os caracteres `?` atuam como marcadores de parâmetros que correspondem aos valores de dados. Os caracteres `?` não devem ser incluídos entre aspas. Os marcadores de parâmetros podem ser usados apenas onde os valores de dados devem aparecer, e não podem ser usados para palavras-chave SQL, identificadores, funções e assim por diante. O plugin analisa uma instrução para identificar os valores literais (conforme definido na Seção 11.1, Valores literais), para que você possa colocar um marcador de parâmetro no lugar de qualquer valor literal.

Como o padrão, a substituição pode conter caracteres `?`. Para uma instrução que corresponde a um modelo de padrão, o plugin reescreve, substituindo os marcadores de parâmetro `?` na substituição usando valores de dados correspondentes aos marcadores correspondentes no padrão. O resultado é uma string de instrução completa. O plugin pede ao servidor para analisá-lo e retorna o resultado ao servidor como a representação da instrução reescrita.

Depois de adicionar e carregar a regra, verifique se a reescrita ocorre de acordo com se as instruções correspondem ao padrão de regra:

```
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

A segunda instrução ilustra que, quando o plug-in `Rewriter` reescreve uma instrução, ele produz uma mensagem de aviso. Para visualizar a mensagem, use `SHOW WARNINGS`:

```
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Uma instrução não precisa ser reescrita para uma instrução do mesmo tipo. O exemplo a seguir carrega uma regra que reescreve instruções `DELETE` para instruções `UPDATE`:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('DELETE FROM db1.t1 WHERE col = ?',
       'UPDATE db1.t1 SET col = NULL WHERE col = ?');
CALL query_rewrite.flush_rewrite_rules();
```

Para ativar ou desativar uma regra existente, modifique sua coluna `enabled` e recarregue a tabela no plugin. Para desativar a regra 1:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite desativar uma regra sem removê-la da tabela.

Para reativar a regra 1:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que `Rewriter` usa para combinar nomes de tabela que não são qualificados com um nome de banco de dados:

- Os nomes de tabela qualificados nas instruções correspondem aos nomes qualificados no padrão se os nomes de banco de dados e de tabela correspondentes forem idênticos.
- Os nomes de tabela não qualificados nas instruções correspondem aos nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que os aplicativos devem selecionar linhas da tabela usando uma consulta de uma dessas formas, onde a segunda pode ser usada quando `appdb` é o banco de dados padrão:

```
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela deva ser modificada para adicionar outro tipo de ID e seja necessário indicar mais especificamente que tipo de ID a coluna `id` representa).

A mudança significa que os aplicativos devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas aplicativos antigos que não podem ser atualizados não funcionam mais corretamente. O plugin `Rewriter` pode resolver este problema combinando e reescrevendo instruções problemáticas. Para combinar a instrução `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de substituição nas regras da tabela de reescrever. Se você também quiser combinar esta `SELECT` usando o nome da tabela não qualificada, também é necessário adicionar uma regra explícita. Usando `?` como um valor de espaço, as duas instruções `INSERT` necessárias ficam assim:

```
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

Depois de adicionar as duas novas regras, execute a seguinte instrução para fazer com que elas tenham efeito:

```
CALL query_rewrite.flush_rewrite_rules();
```

`Rewriter` usa a primeira regra para combinar instruções que usam o nome de tabela qualificado, e a segunda para combinar instruções que usam o nome não qualificado. A segunda regra funciona apenas quando `appdb` é o banco de dados padrão.

##### Como a correspondência de declarações funciona

O plug-in `Rewriter` usa digest de instruções e valores de hash de digest para combinar instruções recebidas com regras de reescrita em etapas. A variável do sistema `max_digest_length` determina o tamanho do buffer usado para computação de digest de instruções. Valores maiores permitem o cálculo de digest que distinguem instruções mais longas. Valores menores usam menos memória, mas aumentam a probabilidade de instruções mais longas colidirem com o mesmo valor de digest.

O plugin combina cada instrução com as regras de reescrita da seguinte forma:

1. Compute o valor de hash de digestão de instruções e compare-o com os valores de hash de digestão de regras. Isso está sujeito a falsos positivos, mas serve como um teste de rejeição rápido.
2. Se o valor de hash do resumo da instrução corresponder a qualquer valor de hash do resumo do padrão, combine a forma normalizada (resumo da instrução) da instrução com a forma normalizada dos padrões de regra correspondentes.
3. Se a instrução normalizada corresponde a uma regra, compare os valores literais na instrução e no padrão. Um caracter `?` no padrão corresponde a qualquer valor literal na instrução. Se a instrução prepara uma instrução, `?` no padrão também corresponde a `?` na instrução. Caso contrário, os literais correspondentes devem ser os mesmos.

Se várias regras correspondem a uma instrução, é não-determinista qual o plugin usa para reescrever a instrução.

Se um padrão contém mais marcadores do que a substituição, o plugin descartará os valores de dados em excesso. Se um padrão contém menos marcadores do que a substituição, é um erro. O plugin percebe isso quando a tabela de regras é carregada, escreve uma mensagem de erro na coluna `message` da linha de regras para comunicar o problema e define a variável de status `Rewriter_reload_error` para `ON`.

##### Reescrever declarações preparadas

As instruções preparadas são reescritas no tempo de análise (ou seja, quando são preparadas), não quando são executadas mais tarde.

As instruções preparadas diferem das instruções não preparadas em que elas podem conter caracteres `?` como marcadores de parâmetros. Para corresponder a um `?` em uma instrução preparada, um padrão `Rewriter` deve conter `?` no mesmo local. Suponha que uma regra de reescrita tenha este padrão:

```
SELECT ?, 3
```

A tabela a seguir mostra várias instruções `SELECT` preparadas e se o padrão de regra corresponde a elas.

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Declaração preparada</th> <th>Se o padrão corresponde à declaração</th> </tr></thead><tbody><tr> <td>[[<code>PREPARE s AS 'SELECT 3, 3'</code>]]</td> <td>Sim , sim .</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT ?, 3'</code>]]</td> <td>Sim , sim .</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT 3, ?'</code>]]</td> <td>Não .</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT ?, ?'</code>]]</td> <td>Não .</td> </tr></tbody></table>

##### Informações operacionais do Plugin Rewriter

O plug-in `Rewriter` disponibiliza informações sobre seu funcionamento por meio de várias variáveis de status:

```
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

Para descrições dessas variáveis, consulte a Seção 7.6.4.3.4, "Variáveis de status do plugin de reescrita de consulta de reescritor".

Quando você carrega a tabela de regras chamando o procedimento `flush_rewrite_rules()` armazenado, se ocorrer um erro para alguma regra, a instrução `CALL` produz um erro, e o plugin define a variável de status `Rewriter_reload_error` para `ON`:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.

mysql> SHOW GLOBAL STATUS LIKE 'Rewriter_reload_error';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Rewriter_reload_error | ON    |
+-----------------------+-------+
```

Neste caso, verifique a tabela `rewrite_rules` para linhas com valores de coluna não-`NULL` `message` para ver quais problemas existem.

##### Plugin Rewriter Uso de conjuntos de caracteres

Quando a tabela `rewrite_rules` é carregada no plugin `Rewriter`, o plugin interpreta instruções usando o valor global atual da variável do sistema `character_set_client`.

Um cliente deve ter um valor de sessão `character_set_client` idêntico ao valor global quando a tabela de regras foi carregada ou a correspondência de regras não funciona para esse cliente.
