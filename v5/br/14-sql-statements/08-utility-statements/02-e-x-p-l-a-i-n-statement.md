### 13.8.2 Instrução EXPLAIN

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

As instruções [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") e [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") são sinônimos. Na prática, o termo [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") é mais frequentemente usado para obter informações sobre a estrutura da tabela, enquanto [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") é usado para obter um plano de execução de Query (isto é, uma explicação de como o MySQL executaria uma Query).

A discussão a seguir usa os termos [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") e [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") de acordo com esses usos, mas o parser do MySQL os trata como completamente sinônimos.

* [Obtendo Informações de Estrutura de Tabela](explain.html#explain-table-structure "Obtendo Informações de Estrutura de Tabela")
* [Obtendo Informações do Plano de Execução](explain.html#explain-execution-plan "Obtendo Informações do Plano de Execução")

#### Obtendo Informações de Estrutura de Tabela

[`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") fornece informações sobre as colunas em uma tabela:

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

[`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") é um atalho para [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). Essas instruções também exibem informações para Views. A descrição para [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") fornece mais informações sobre as colunas de saída. Consulte [Seção 13.7.5.5, “Instrução SHOW COLUMNS”](show-columns.html "13.7.5.5 SHOW COLUMNS Statement").

Por padrão, [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") exibe informações sobre todas as colunas na tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a instrução exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Ela pode conter os caracteres curinga (wildcard) `%` e `_` do SQL. Neste caso, a instrução exibe a saída apenas para as colunas cujos nomes correspondem à string. Não há necessidade de colocar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A instrução [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") é fornecida para compatibilidade com Oracle.

As instruções [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") e [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") também fornecem informações sobre tabelas. Consulte [Seção 13.7.5, “Instruções SHOW”](show.html "13.7.5 SHOW Statements").

#### Obtendo Informações do Plano de Execução

A instrução [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") fornece informações sobre como o MySQL executa as instruções:

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") funciona com as instruções [`SELECT`](select.html "13.2.9 SELECT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement") e [`UPDATE`](update.html "13.2.11 UPDATE Statement").

* Quando [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") é usado com uma instrução explicável, o MySQL exibe informações do Optimizer sobre o plano de execução da instrução. Ou seja, o MySQL explica como ele processaria a instrução, incluindo informações sobre como as tabelas são unidas (joined) e em que ordem. Para obter informações sobre o uso de [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") para obter informações do plano de execução, consulte [Seção 8.8.2, “Formato de Saída do EXPLAIN”](explain-output.html "8.8.2 EXPLAIN Output Format").

* Quando [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") é usado com `FOR CONNECTION connection_id` em vez de uma instrução explicável, ele exibe o plano de execução para a instrução em execução na Connection nomeada. Consulte [Seção 8.8.4, “Obtendo Informações do Plano de Execução para uma Connection Nomeada”](explain-for-connection.html "8.8.4 Obtaining Execution Plan Information for a Named Connection").

* Para instruções [`SELECT`](select.html "13.2.9 SELECT Statement"), o [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") produz informações adicionais do plano de execução que podem ser exibidas usando [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). Consulte [Seção 8.8.3, “Formato de Saída EXPLAIN Estendido”](explain-extended.html "8.8.3 Extended EXPLAIN Output Format").

  Nota

  Em versões mais antigas do MySQL, informações estendidas eram produzidas usando [`EXPLAIN EXTENDED`](explain.html "13.8.2 EXPLAIN Statement"). Essa sintaxe ainda é reconhecida para compatibilidade com versões anteriores, mas a saída estendida agora está habilitada por padrão, portanto, o termo `EXTENDED` é supérfluo e está depreciado. Seu uso resulta em um Warning e ele foi removido da sintaxe [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") no MySQL 8.0.

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") é útil para examinar Queries envolvendo tabelas particionadas. Consulte [Seção 22.3.5, “Obtendo Informações Sobre Partições”](partitioning-info.html "22.3.5 Obtaining Information About Partitions").

  Nota

  Em versões mais antigas do MySQL, informações de Particionamento eram produzidas usando [`EXPLAIN PARTITIONS`](explain.html "13.8.2 EXPLAIN Statement"). Essa sintaxe ainda é reconhecida para compatibilidade com versões anteriores, mas a saída de Partições agora está habilitada por padrão, portanto, o termo `PARTITIONS` é supérfluo e está depreciado. Seu uso resulta em um Warning e ele foi removido da sintaxe [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") no MySQL 8.0.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações em formato JSON.

  Para instruções complexas, a saída JSON pode ser bastante extensa; em particular, pode ser difícil ao lê-la parear os colchetes de abertura e fechamento; para fazer com que a Key da estrutura JSON, se houver, seja repetida perto do colchete de fechamento, defina [`end_markers_in_json=ON`](server-system-variables.html#sysvar_end_markers_in_json). Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON gerem um Error.

[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") requer os mesmos Privileges (privilégios) exigidos para executar a instrução explicada. Além disso, [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") também requer o Privilege [`SHOW VIEW`](privileges-provided.html#priv_show-view) para qualquer View explicada.

Com a ajuda de [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), você pode ver onde deve adicionar Indexes às tabelas para que a instrução seja executada mais rapidamente usando Indexes para encontrar linhas. Você também pode usar [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") para verificar se o Optimizer está fazendo o JOIN das tabelas em uma ordem ideal. Para dar uma dica ao Optimizer para usar uma ordem de JOIN correspondente à ordem em que as tabelas são nomeadas em uma instrução [`SELECT`](select.html "13.2.9 SELECT Statement"), comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas [`SELECT`](select.html "13.2.9 SELECT Statement"). (Consulte [Seção 13.2.9, “Instrução SELECT”](select.html "13.2.9 SELECT Statement").)

O trace (rastreamento) do Optimizer pode, às vezes, fornecer informações complementares às de [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). No entanto, o formato e o conteúdo do trace do Optimizer estão sujeitos a alterações entre as versões. Para detalhes, consulte [Seção 8.15, “Tracing do Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

Se você tiver um problema com Indexes que não estão sendo usados quando você acredita que deveriam, execute [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") para atualizar as estatísticas da tabela, como a cardinalidade de Keys, que podem afetar as escolhas feitas pelo Optimizer. Consulte [Seção 13.7.2.1, “Instrução ANALYZE TABLE”](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

Nota

O MySQL Workbench tem um recurso Visual Explain que fornece uma representação visual da saída de [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). Consulte [Tutorial: Using Explain to Improve Query Performance](/doc/workbench/en/wb-tutorial-visual-explain-dbt3.html).