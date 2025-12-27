#### 7.6.4.2 Usando o Plugin de Reescrita de Consultas Rewriter

Para habilitar ou desabilitar o plugin, habilite ou desabilite a variável de sistema `rewriter_enabled`. Por padrão, o plugin `Rewriter` está habilitado quando você o instala (veja a Seção 7.6.4.1, “Instalando ou Desinstalando o Plugin de Reescrita de Consultas Rewriter”). Para definir o estado inicial do plugin explicitamente, você pode definir a variável no início do servidor. Por exemplo, para habilitar o plugin em um arquivo de opções, use essas linhas:

```
[mysqld]
rewriter_enabled=ON
```

Também é possível habilitar ou desabilitar o plugin em tempo de execução:

```
SET GLOBAL rewriter_enabled = ON;
SET GLOBAL rewriter_enabled = OFF;
```

Supondo que o plugin `Rewriter` esteja habilitado, ele examina e possivelmente modifica cada declaração reescrivível recebida pelo servidor. O plugin determina se deve reescrever as declarações com base em sua cache de regras de reescrita na memória, que são carregadas da tabela `rewrite_rules` no banco de dados `query_rewrite`.

Essas declarações estão sujeitas à reescrita: `SELECT`, `INSERT`, `REPLACE`, `UPDATE` e `DELETE`.

Declarações independentes e declarações preparadas estão sujeitas à reescrita. Declarações que ocorrem dentro de definições de visualizações ou programas armazenados não estão sujeitas à reescrita.

Declarações executadas por usuários com o privilégio `SKIP_QUERY_REWRITE` não estão sujeitas à reescrita, desde que a variável de sistema `rewriter_enabled_for_threads_without_privilege_checks` esteja definida como `OFF` (padrão `ON`). Isso pode ser usado para declarações de controle e declarações que devem ser replicadas inalteradas, como as especificadas pelo `SOURCE_USER` no `CHANGE REPLICATION SOURCE TO`. Isso também é verdadeiro para declarações executadas por programas de cliente MySQL, incluindo **mysqlbinlog**, **mysqladmin** e **mysqldump**. Por essa razão, você deve conceder `SKIP_QUERY_REWRITE` à conta de usuário ou contas usadas por esses utilitários para se conectarem ao MySQL.

* Adicionar Regras de Reescrita
* Como Funciona o Alinhamento de Declarações
* Reescrita de Declarações Preparadas
* Informações Operacionais do Plugin Reescritor
* Uso de Conjuntos de Caracteres pelo Plugin Reescritor

##### Adicionar Regras de Reescrita

Para adicionar regras para o plugin `Rewriter`, adicione linhas à tabela `rewrite_rules`, depois invocando a procedure armazenada `flush_rewrite_rules()` para carregar as regras da tabela para o plugin. O exemplo a seguir cria uma regra simples para alinhar declarações que selecionam um único valor literal:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('SELECT ?', 'SELECT ? + 1');
```

O conteúdo da tabela resultante parece assim:

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

A regra especifica um modelo de padrão que indica quais declarações `SELECT` devem ser alinhadas, e um modelo de substituição que indica como reescrever as declarações correspondentes. No entanto, adicionar a regra à tabela `rewrite_rules` não é suficiente para fazer o plugin `Rewriter` usar a regra. Você deve invocar `flush_rewrite_rules()` para carregar o conteúdo da tabela no cache in-memory do plugin:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
```

Dica

Se suas regras de reescrita não estiverem funcionando corretamente, certifique-se de que você tenha recarregado a tabela de regras chamando `flush_rewrite_rules()`.

Quando o plugin lê cada regra da tabela de regras, ele calcula uma forma normalizada (digestão de declaração) do padrão e um valor de hash de digestão, e usa-os para atualizar as colunas `normalized_pattern` e `pattern_digest`:

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

Para informações sobre digestão de declarações, declarações normalizadas e valores de hash de digestão, consulte a Seção 29.10, “Digestas e Amostragem de Declarações do Schema de Desempenho”.

Se uma regra não puder ser carregada devido a algum erro, chamar `flush_rewrite_rules()` produz um erro:

```
mysql> CALL query_rewrite.flush_rewrite_rules();
ERROR 1644 (45000): Loading of some rule(s) failed.
```

Quando isso ocorre, o plugin escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema. Verifique a tabela `rewrite_rules` para linhas com valores não `NULL` na coluna `message` para ver quais problemas existem.

Os padrões usam a mesma sintaxe que as instruções preparadas (veja a Seção 15.5.1, “Instrução PREPARE”). Dentro de um modelo de padrão, os caracteres `?` atuam como marcadores de parâmetros que correspondem aos valores de dados. Os caracteres `?` não devem ser incluídos entre aspas. Os marcadores de parâmetros podem ser usados apenas onde os valores de dados devem aparecer e não podem ser usados para palavras-chave SQL, identificadores, funções, etc. O plugin analisa uma instrução para identificar os valores literais (conforme definido na Seção 11.1, “Valores Literais”), então você pode colocar um marcador de parâmetro no lugar de qualquer valor literal.

Assim como o padrão, a substituição pode conter caracteres `?`. Para uma instrução que corresponde a um modelo de padrão, o plugin a reescreve, substituindo os marcadores de parâmetros `?` na substituição usando valores de dados correspondentes aos marcadores correspondentes no padrão. O resultado é uma string de instrução completa. O plugin pede ao servidor para analisá-la e retorna o resultado ao servidor como a representação da instrução reescrita.

Após adicionar e carregar a regra, verifique se a reescrita ocorre de acordo com se as instruções correspondem ao padrão da regra:

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

Não ocorre reescrita para a primeira instrução `SELECT`, mas ocorre para a segunda. A segunda instrução ilustra que, quando o plugin `Rewriter` reescreve uma instrução, ele produz uma mensagem de aviso. Para ver a mensagem, use `SHOW WARNINGS`:

```
mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1105
Message: Query 'SELECT 10' rewritten to 'SELECT 10 + 1' by a query rewrite plugin
```

Uma instrução não precisa ser reescrita para uma instrução do mesmo tipo. O exemplo seguinte carrega uma regra que reescreve instruções `DELETE` para instruções `UPDATE`:

Para habilitar ou desabilitar uma regra existente, modifique a coluna `enabled` e recarregue a tabela no plugin. Para desabilitar a regra 1:

```
INSERT INTO query_rewrite.rewrite_rules (pattern, replacement)
VALUES('DELETE FROM db1.t1 WHERE col = ?',
       'UPDATE db1.t1 SET col = NULL WHERE col = ?');
CALL query_rewrite.flush_rewrite_rules();
```

Isso permite que você desative uma regra sem removê-la da tabela.

Para reabilitar a regra 1:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'NO' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

A tabela `rewrite_rules` contém uma coluna `pattern_database` que o `Rewriter` usa para corresponder nomes de tabelas que não são qualificados com um nome de banco de dados:

* Nomes de tabelas qualificados nas instruções correspondem a nomes qualificados no padrão se os nomes de banco de dados e de tabela correspondentes forem idênticos.
* Nomes de tabelas não qualificados nas instruções correspondem a nomes não qualificados no padrão apenas se o banco de dados padrão for o mesmo que `pattern_database` e os nomes de tabela forem idênticos.

Suponha que uma tabela chamada `appdb.users` tenha uma coluna chamada `id` e que as aplicações sejam esperadas para selecionar linhas da tabela usando uma consulta de uma dessas formas, onde a segunda pode ser usada quando `appdb` é o banco de dados padrão:

```
UPDATE query_rewrite.rewrite_rules SET enabled = 'YES' WHERE id = 1;
CALL query_rewrite.flush_rewrite_rules();
```

Suponha também que a coluna `id` seja renomeada para `user_id` (talvez a tabela precise ser modificada para adicionar outro tipo de ID e seja necessário indicar mais especificamente que tipo de ID a coluna `id` representa).

A mudança significa que as aplicações devem se referir a `user_id` em vez de `id` na cláusula `WHERE`, mas as aplicações antigas que não podem ser atualizadas deixam de funcionar corretamente. O plugin `Rewriter` pode resolver esse problema ao combinar e reescrever declarações problemáticas. Para combinar a declaração `SELECT * FROM appdb.users WHERE id = value` e reescrevê-la como `SELECT * FROM appdb.users WHERE user_id = value`, você pode inserir uma linha representando uma regra de substituição na tabela de regras de reescrita. Se você também quiser combinar essa `SELECT` usando o nome da tabela não qualificada, também é necessário adicionar uma regra explícita. Usando `?` como um placeholder de valor, as duas declarações `INSERT` necessárias parecem assim:

```
SELECT * FROM users WHERE appdb.id = id_value;
SELECT * FROM users WHERE id = id_value;
```

Após adicionar as duas novas regras, execute a seguinte declaração para fazer com que elas entrem em vigor:

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

O `Rewriter` usa a primeira regra para combinar declarações que usam o nome da tabela qualificada e a segunda para combinar declarações que usam o nome não qualificado. A segunda regra funciona apenas quando `appdb` é o banco de dados padrão.

##### Como Funciona a Combinação de Declarações

O plugin `Rewriter` usa valores de hash de digestas de declarações e valores de hash de digestas para combinar declarações recebidas contra regras de reescrita em etapas. A variável de sistema `max_digest_length` determina o tamanho do buffer usado para calcular os valores de hash de digestas. Valores maiores permitem a computação de digestas que distinguem declarações mais longas. Valores menores usam menos memória, mas aumentam a probabilidade de declarações mais longas colidirem com o mesmo valor de digestas.

O plugin combina cada declaração com as regras de reescrita da seguinte forma:

1. Calcule o valor de hash de digestas da declaração e compare-o com os valores de hash de digestas das regras. Isso está sujeito a falsos positivos, mas serve como um teste de rejeição rápida.

2. Se o valor do hash do resumo da declaração corresponder a qualquer valor de hash de resumo de padrão, alinhe a forma normalizada (resumo da declaração) da declaração à forma normalizada dos padrões das regras de correspondência.

3. Se a declaração normalizada corresponder a uma regra, compare os valores literais na declaração e no padrão. Um caractere `?` no padrão corresponde a qualquer valor literal na declaração. Se a declaração preparar uma declaração, o `?` no padrão também corresponde ao `?` na declaração. Caso contrário, os valores literais correspondentes devem ser os mesmos.

Se várias regras corresponderem a uma declaração, não é determinado qual plugin usa para reescrever a declaração.

Se um padrão contém mais marcadores do que a substituição, o plugin descarta os valores de dados excedentes. Se um padrão contém menos marcadores do que a substituição, há um erro. O plugin percebe isso quando a tabela de regras é carregada, escreve uma mensagem de erro na coluna `message` da linha da regra para comunicar o problema e define a variável `Rewriter_reload_error` para `ON`.

##### Reescrita de Declarações Preparadas

As declarações preparadas são reescritas no momento da análise (ou seja, quando são preparadas), e não quando são executadas posteriormente.

As declarações preparadas diferem das não preparadas porque podem conter caracteres `?` como marcadores de parâmetros. Para corresponder a um `?` em uma declaração preparada, um padrão de `Rewriter` deve conter `?` na mesma localização. Suponha que uma regra de reescrita tenha este padrão:

```
CALL query_rewrite.flush_rewrite_rules();
```

A tabela a seguir mostra várias declarações `SELECT` preparadas e se o padrão da regra as corresponde.

<table summary="Como o plugin Reescritor compara declarações preparadas com o padrão SELECT ?,3">
<col style="width: 50%"/><col style="width: 50%"/>
<thead><tr>
<th>Declaração Preparada</th>
<th>Declaração que Alinha com o Padrão</th>
</tr></thead>
<tbody>
<tr>
<td><code class="literal">PREPARE s AS 'SELECT 3, 3'</code></td>
<td>Sim</td>
</tr>
<tr>
<td><code class="literal">PREPARE s AS 'SELECT ?, 3'</code></td>
<td>Sim</td>
</tr>
<tr>
<td><code class="literal">PREPARE s AS 'SELECT 3, ?'</code></td>
<td>Não</td>
</tr>
<tr>
<td><code class="literal">PREPARE s AS 'SELECT ?, ?'</code></td>
<td>Não</td>
</tr>
</tbody></table>

##### Informações Operacionais do Plugin Reescritor

O plugin `Reescritor` disponibiliza informações sobre sua operação por meio de várias variáveis de status:

```
SELECT ?, 3
```

Para descrições dessas variáveis, consulte a Seção 7.6.4.3.4, “Variáveis de Status do Plugin de Reescrita de Consultas de Reescritor”.

Quando você carrega a tabela de regras chamando o procedimento armazenado `flush_rewrite_rules()`, se ocorrer um erro para alguma regra, a instrução `CALL` produz um erro, e o plugin define a variável de status `Rewriter_reload_error` para `ON`:

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

Nesse caso, verifique a tabela `rewrite_rules` em busca de linhas com valores não `NULL` na coluna `message` para ver quais problemas existem.

##### Uso do Plugin Reescritor de Conjuntos de Caracteres

Quando a tabela `rewrite_rules` é carregada no plugin `Reescritor`, o plugin interpreta as declarações usando o valor global atual da variável de sistema `character_set_client`. Se o valor global de `character_set_client` for alterado posteriormente, a tabela de regras deve ser recarregada.

Um cliente deve ter um valor de `character_set_client` de sessão idêntico ao valor global quando a tabela de regras foi carregada, ou a correspondência de regras não funcionará para esse cliente.