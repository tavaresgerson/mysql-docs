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

As instruções `DESCRIBE` e `EXPLAIN` são sinônimos. Na prática, o termo `DESCRIBE` é mais frequentemente usado para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usado para obter um plano de execução de Query (isto é, uma explicação de como o MySQL executaria uma Query).

A discussão a seguir usa os termos `DESCRIBE` e `EXPLAIN` de acordo com esses usos, mas o parser do MySQL os trata como completamente sinônimos.

* Obtendo Informações de Estrutura de Tabela
* Obtendo Informações do Plano de Execução

#### Obtendo Informações de Estrutura de Tabela

`DESCRIBE` fornece informações sobre as colunas em uma tabela:

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

`DESCRIBE` é um atalho para `SHOW COLUMNS`. Essas instruções também exibem informações para Views. A descrição para `SHOW COLUMNS` fornece mais informações sobre as colunas de saída. Consulte Seção 13.7.5.5, “Instrução SHOW COLUMNS”.

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas na tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a instrução exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Ela pode conter os caracteres curinga (wildcard) `%` e `_` do SQL. Neste caso, a instrução exibe a saída apenas para as colunas cujos nomes correspondem à string. Não há necessidade de colocar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A instrução `DESCRIBE` é fornecida para compatibilidade com Oracle.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre tabelas. Consulte Seção 13.7.5, “Instruções SHOW”.

#### Obtendo Informações do Plano de Execução

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa as instruções:

* `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

* Quando `EXPLAIN` é usado com uma instrução explicável, o MySQL exibe informações do Optimizer sobre o plano de execução da instrução. Ou seja, o MySQL explica como ele processaria a instrução, incluindo informações sobre como as tabelas são unidas (joined) e em que ordem. Para obter informações sobre o uso de `EXPLAIN` para obter informações do plano de execução, consulte Seção 8.8.2, “Formato de Saída do EXPLAIN”.

* Quando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma instrução explicável, ele exibe o plano de execução para a instrução em execução na Connection nomeada. Consulte Seção 8.8.4, “Obtendo Informações do Plano de Execução para uma Connection Nomeada”.

* Para instruções `SELECT`, o `EXPLAIN` produz informações adicionais do plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Consulte Seção 8.8.3, “Formato de Saída EXPLAIN Estendido”.

  Nota

  Em versões mais antigas do MySQL, informações estendidas eram produzidas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade com versões anteriores, mas a saída estendida agora está habilitada por padrão, portanto, o termo `EXTENDED` é supérfluo e está depreciado. Seu uso resulta em um Warning e ele foi removido da sintaxe `EXPLAIN` no MySQL 8.0.

* `EXPLAIN` é útil para examinar Queries envolvendo tabelas particionadas. Consulte Seção 22.3.5, “Obtendo Informações Sobre Partições”.

  Nota

  Em versões mais antigas do MySQL, informações de Particionamento eram produzidas usando `EXPLAIN PARTITIONS`. Essa sintaxe ainda é reconhecida para compatibilidade com versões anteriores, mas a saída de Partições agora está habilitada por padrão, portanto, o termo `PARTITIONS` é supérfluo e está depreciado. Seu uso resulta em um Warning e ele foi removido da sintaxe `EXPLAIN` no MySQL 8.0.

* A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Este é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações em formato JSON.

  Para instruções complexas, a saída JSON pode ser bastante extensa; em particular, pode ser difícil ao lê-la parear os colchetes de abertura e fechamento; para fazer com que a Key da estrutura JSON, se houver, seja repetida perto do colchete de fechamento, defina `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON gerem um Error.

`EXPLAIN` requer os mesmos Privileges (privilégios) exigidos para executar a instrução explicada. Além disso, `EXPLAIN` também requer o Privilege `SHOW VIEW` para qualquer View explicada.

Com a ajuda de `EXPLAIN`, você pode ver onde deve adicionar Indexes às tabelas para que a instrução seja executada mais rapidamente usando Indexes para encontrar linhas. Você também pode usar `EXPLAIN` para verificar se o Optimizer está fazendo o JOIN das tabelas em uma ordem ideal. Para dar uma dica ao Optimizer para usar uma ordem de JOIN correspondente à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Consulte Seção 13.2.9, “Instrução SELECT”.)

O trace (rastreamento) do Optimizer pode, às vezes, fornecer informações complementares às de `EXPLAIN`. No entanto, o formato e o conteúdo do trace do Optimizer estão sujeitos a alterações entre as versões. Para detalhes, consulte Seção 8.15, “Tracing do Optimizer”.

Se você tiver um problema com Indexes que não estão sendo usados quando você acredita que deveriam, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade de Keys, que podem afetar as escolhas feitas pelo Optimizer. Consulte Seção 13.7.2.1, “Instrução ANALYZE TABLE”.

Nota

O MySQL Workbench tem um recurso Visual Explain que fornece uma representação visual da saída de `EXPLAIN`. Consulte Tutorial: Using Explain to Improve Query Performance.