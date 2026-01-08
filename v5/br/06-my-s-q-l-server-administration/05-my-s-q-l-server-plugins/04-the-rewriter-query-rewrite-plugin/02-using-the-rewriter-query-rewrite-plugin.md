#### 5.5.4.2 Usar o Plugin de Reescrita de Consultas do Rewriter

Para habilitar ou desabilitar o plugin, habilite ou desabilite a variável de sistema `rewriter_enabled`. Por padrão, o plugin `Rewriter` está habilitado quando você o instala (veja Seção 5.5.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas de Reescrita”). Para definir o estado inicial do plugin explicitamente, você pode definir a variável no início do servidor. Por exemplo, para habilitar o plugin em um arquivo de opção, use essas linhas:

```sql
[mysqld]
rewriter_enabled=ON
```

É também possível habilitar ou desabilitar o plugin em tempo de execução:

```sql
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Supondo que o plugin `Rewriter` esteja ativado, ele examina e, possivelmente, modifica cada instrução `SELECT` recebida pelo servidor. O plugin determina se as instruções devem ser reescritas com base em seu cache de regras de reescrita na memória, que são carregadas a partir da tabela `rewrite_rules` no banco de dados `query_rewrite`.

- Adicionar regras de reescrita
- Como o Reconhecimento de Declarações Funciona
- Reescrita de declarações preparadas
- Informações Operacionais do Plugin Reescritor
- Uso do Plugin Reescritor de Conjuntos de Caracteres

##### Adicionar regras de reescrita

Para adicionar regras para o plugin `Rewriter`, adicione linhas à tabela `rewrite_rules`, depois invocando o procedimento armazenado `flush_rewrite_rules()`, carregue as regras da tabela para o plugin. O exemplo a seguir cria uma regra simples para corresponder a declarações que selecionam um único valor literal:

```sql
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante parece assim:

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

A regra especifica um modelo de template que indica quais instruções `SELECT` devem ser correspondidas, e um template de substituição que indica como reescrever as instruções correspondentes. No entanto, adicionar a regra à tabela `rewrite_rules` não é suficiente para fazer com que o plugin `Rewriter` use a regra. Você deve invocar `flush_rewrite_rules()` para carregar o conteúdo da tabela no cache em memória do plugin:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dica

Se suas regras de reescrita não estiverem funcionando corretamente, certifique-se de que você carregou novamente a tabela de regras chamando `flush_rewrite_rules()`.

Quando o plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (digestão de declaração) a partir do padrão e um valor de hash de digestão, e usa-os para atualizar as colunas `normalized_pattern` e `pattern_digest`:

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

Para obter informações sobre a digestão de declarações, declarações normalizadas e valores de hash de digestão, consulte Seção 25.10, “Digestas de declarações do Schema de Desempenho”.

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```sql
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o plugin escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema. Verifique a tabela `rewrite_rules` para linhas com valores na coluna `message` que não sejam `NULL` para ver quais problemas existem.

Os padrões usam a mesma sintaxe que as instruções preparadas (veja Seção 13.5.1, “Instrução PREPARE”). Dentro de um modelo de padrão, os caracteres `?` atuam como marcadores de parâmetros que correspondem aos valores de dados. Os caracteres `?` não devem ser fechados entre aspas. Os marcadores de parâmetros podem ser usados apenas onde os valores de dados devem aparecer, e não podem ser usados para palavras-chave SQL, identificadores, funções, etc. O plugin analisa uma instrução para identificar os valores literais (conforme definido em Seção 9.1, “Valores Literais”), então você pode colocar um marcador de parâmetro no lugar de qualquer valor literal.

Assim como o padrão, a substituição pode conter caracteres `?`. Para uma declaração que corresponde a um modelo de padrão, o plugin a reescreve, substituindo os marcadores de parâmetros `?` na substituição usando valores de dados correspondentes aos marcadores correspondentes no padrão. O resultado é uma string de declaração completa. O plugin pede ao servidor para analisá-la e retorna o resultado ao servidor como a representação da declaração reescrita.

Depois de adicionar e carregar a regra, verifique se a reescrita ocorre de acordo com a correspondência entre as declarações e o padrão da regra:

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

Não ocorre reescrita para a primeira instrução `SELECT`, mas sim para a segunda. A segunda instrução ilustra que, quando o plugin `Rewriter` reescreve uma instrução, ele gera uma mensagem de aviso. Para visualizar a mensagem, use `SHOW WARNINGS`:

```sql
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Para habilitar ou desabilitar uma regra existente, modifique sua coluna `enabled` e recarregue a tabela no plugin. Para desabilitar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite que você desative uma regra sem removê-la da tabela.

Para reativar a regra 1:

```sql
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que o `Rewriter` usa para corresponder a nomes de tabelas que não são qualificados com um nome de banco de dados:

- Os nomes de tabelas qualificados nas declarações correspondem aos nomes qualificados no padrão se os nomes de banco de dados e de tabela correspondentes forem idênticos.

- Nomes de tabelas não qualificados em declarações correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes das tabelas forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que as aplicações devam selecionar linhas da tabela usando uma consulta de uma dessas formas, onde a segunda pode ser usada quando `appdb` é o banco de dados padrão:

```sql
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela precise ser modificada para adicionar outro tipo de ID e seja necessário indicar mais especificamente qual tipo de ID a coluna `id` representa).

A mudança significa que as aplicações devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas as aplicações antigas que não podem ser atualizadas deixam de funcionar corretamente. O plugin `Rewriter` pode resolver esse problema ao combinar e reescrever as declarações problemáticas. Para combinar a declaração `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de substituição na tabela de regras de reescrita. Se você também quiser combinar essa `SELECT` usando o nome da tabela não qualificada, também é necessário adicionar uma regra explícita. Usando `?` como um marcador de valor, as duas instruções `INSERT` (insert.html) necessárias são:

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

Após adicionar as duas novas regras, execute a seguinte instrução para que elas entrem em vigor:

```sql
CALL query_rewrite.flush_rewrite_rules();
```

O `Rewriter` usa a primeira regra para combinar declarações que usam o nome da tabela qualificado e a segunda para combinar declarações que usam o nome não qualificado. A segunda regra só funciona quando `appdb` é o banco de dados padrão.

##### Como funciona a correspondência de declarações

O plugin `Rewriter` usa resumos de declarações e valores de hash de resumo para combinar declarações recebidas com regras de reescrita em etapas. A variável de sistema `max_digest_length` determina o tamanho do buffer usado para calcular resumos de declarações. Valores maiores permitem a computação de resumos que distinguem declarações mais longas. Valores menores usam menos memória, mas aumentam a probabilidade de declarações mais longas colidirem com o mesmo valor de resumo.

O plugin combina cada declaração com as regras de reescrita da seguinte forma:

1. Calcule o valor do hash do digest da declaração e compare-o com os valores de hash do digest da regra. Isso pode gerar falsos positivos, mas serve como um teste rápido de rejeição.

2. Se o valor do hash do resumo da declaração corresponder a qualquer valor de hash de resumo de padrões, alinhe a forma normalizada (resumo da declaração) da declaração à forma normalizada dos padrões das regras de correspondência.

3. Se a declaração normalizada corresponder a uma regra, compare os valores literais na declaração e no padrão. Um caractere `?` no padrão corresponde a qualquer valor literal na declaração. Se a declaração preparar uma declaração `SELECT`, o `?` no padrão também corresponderá ao `?` na declaração. Caso contrário, os valores literais correspondentes devem ser os mesmos.

Se várias regras corresponderem a uma declaração, não é determinado qual plugin usa para reescrever a declaração.

Se um padrão contiver mais marcadores do que a substituição, o plugin descarta os valores de dados em excesso. Se um padrão contiver menos marcadores do que a substituição, é um erro. O plugin percebe isso quando a tabela de regras é carregada, escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema e define a variável de estado `Rewriter_reload_error` para `ON`.

##### Reescrita de declarações preparadas

As declarações preparadas são reescritas no momento da análise (ou seja, quando são preparadas), e não quando são executadas posteriormente.

As declarações preparadas diferem das declarações não preparadas porque podem conter caracteres `?` como marcadores de parâmetros. Para corresponder a um `?` em uma declaração preparada, um padrão de `Rewriter` deve conter `?` na mesma localização. Suponha que uma regra de reescrita tenha este padrão:

```sql
SELECT ?, 3
```

A tabela a seguir mostra várias instruções preparadas de `SELECT` e se o padrão da regra corresponde a elas.

<table summary="Como o plugin Rewriter compara declarações preparadas com o padrão SELECT ?,3."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Declaração preparada</th> <th>Se a declaração corresponde ao padrão</th> </tr></thead><tbody><tr> <td>[[<code>PREPARE s AS 'SELECT 3, 3'</code>]]</td> <td>Sim</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT ?, 3'</code>]]</td> <td>Sim</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT 3, ?'</code>]]</td> <td>Não</td> </tr><tr> <td>[[<code>PREPARE s AS 'SELECT ?, ?'</code>]]</td> <td>Não</td> </tr></tbody></table>

##### Informações operacionais do plugin de reescritor

O plugin `Rewriter` disponibiliza informações sobre sua operação por meio de várias variáveis de status:

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

Para descrições dessas variáveis, consulte Seção 5.5.4.3.4, “Variáveis de Status do Plugin de Reescrita de Consultas de Reescritor”.

Quando você carrega a tabela de regras chamando o procedimento armazenado `flush_rewrite_rules()`, se ocorrer um erro para alguma regra, a instrução `CALL` produz um erro, e o plugin define a variável `Rewriter_reload_error` para `ON`:

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

Nesse caso, verifique a tabela `rewrite_rules` para ver quais problemas existem, verificando os valores da coluna `message` que não são `NULL`.

##### Plugin de Reescritor Uso de Conjuntos de Caracteres

Quando a tabela `rewrite_rules` é carregada no plugin `Rewriter`, o plugin interpreta as declarações usando o valor global atual da variável de sistema `character_set_client`. Se o valor global de `character_set_client` for alterado posteriormente, a tabela de regras deve ser recarregada.

Um cliente deve ter um valor de sessão `character_set_client` idêntico ao valor global quando a tabela de regras foi carregada, ou a correspondência de regras não funcionará para esse cliente.
