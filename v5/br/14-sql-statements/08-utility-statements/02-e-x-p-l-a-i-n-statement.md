### 13.8.2 Instrução EXPLAIN

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

As instruções `DESCRIBE` e `EXPLAIN` são sinônimas. Na prática, a palavra-chave `DESCRIBE` é mais frequentemente usada para obter informações sobre a estrutura da tabela, enquanto `EXPLAIN` é usada para obter um plano de execução da consulta (ou seja, uma explicação de como o MySQL executaria uma consulta).

A discussão a seguir utiliza as palavras-chave `DESCRIBE` e `EXPLAIN` de acordo com esses usos, mas o analisador MySQL as trata como completamente sinônimas.

- Obter informações sobre a estrutura da tabela
- Obter informações sobre o plano de execução

#### Obtendo Informações da Estrutura da Tabela

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

`DESCRIBE` é um atalho para `SHOW COLUMNS`. Essas declarações também exibem informações para visualizações. A descrição para `SHOW COLUMNS` fornece mais informações sobre as colunas de saída. Veja Seção 13.7.5.5, “Declaração SHOW COLUMNS”.

Por padrão, `DESCRIBE` exibe informações sobre todas as colunas da tabela. *`col_name`*, se fornecido, é o nome de uma coluna na tabela. Neste caso, a declaração exibe informações apenas para a coluna nomeada. *`wild`*, se fornecido, é uma string de padrão. Pode conter os caracteres de wildcard SQL `%` e `_`. Neste caso, a declaração exibe saída apenas para as colunas com nomes que correspondem à string. Não há necessidade de encerrar a string entre aspas, a menos que ela contenha espaços ou outros caracteres especiais.

A instrução `DESCRIBE` é fornecida para compatibilidade com o Oracle.

As instruções `SHOW CREATE TABLE`, `SHOW TABLE STATUS` e `SHOW INDEX` também fornecem informações sobre as tabelas. Veja Seção 13.7.5, “Instruções SHOW”.

#### Obter informações sobre o plano de execução

A instrução `EXPLAIN` fornece informações sobre como o MySQL executa instruções:

- `EXPLAIN` funciona com as instruções `SELECT`, `DELETE`, `INSERT`, `REPLACE` e `UPDATE`.

- Quando o `EXPLAIN` é usado com uma declaração explicável, o MySQL exibe informações sobre o plano de execução da declaração do otimizador. Ou seja, o MySQL explica como processaria a declaração, incluindo informações sobre como as tabelas são unidas e em que ordem. Para obter informações sobre o uso do `EXPLAIN` para obter informações sobre o plano de execução, consulte Seção 8.8.2, “Formato de Saída EXPLAIN”.

- Quando o comando `EXPLAIN` é usado com `FOR CONNECTION connection_id` em vez de uma instrução explicável, ele exibe o plano de execução da instrução que está sendo executada na conexão nomeada. Veja Seção 8.8.4, “Obtendo Informações do Plano de Execução para uma Conexão Nomeada”.

- Para as instruções `SELECT`, o `EXPLAIN` produz informações adicionais sobre o plano de execução que podem ser exibidas usando `SHOW WARNINGS`. Veja Seção 8.8.3, “Formato de Saída EXPLAIN Extendido”.

  Nota

  Em versões mais antigas do MySQL, as informações detalhadas eram geradas usando `EXPLAIN EXTENDED`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída detalhada agora está habilitada por padrão, então a palavra-chave `EXTENDED` é supérflua e desatualizada. Seu uso resulta em um aviso e é removido da sintaxe de `EXPLAIN` no MySQL 8.0.

- `EXPLAIN` é útil para examinar consultas que envolvem tabelas particionadas. Veja Seção 22.3.5, “Obtendo Informações Sobre Partições”.

  Nota

  Em versões mais antigas do MySQL, as informações das partições eram geradas usando `EXPLAIN PARTITIONS`. Essa sintaxe ainda é reconhecida para compatibilidade reversa, mas a saída das partições agora está habilitada por padrão, então a palavra-chave `PARTITIONS` é supérflua e desatualizada. Seu uso resulta em um aviso e é removido da sintaxe de `EXPLAIN` no MySQL 8.0.

- A opção `FORMAT` pode ser usada para selecionar o formato de saída. `TRADITIONAL` apresenta a saída em formato tabular. Isso é o padrão se nenhuma opção `FORMAT` estiver presente. O formato `JSON` exibe as informações no formato JSON.

  Para declarações complexas, a saída JSON pode ser bastante grande; em particular, pode ser difícil lê-la para combinar o parêntese de fechamento e o parêntese de abertura; para fazer com que a chave da estrutura JSON, se houver, seja repetida perto do parêntese de fechamento, configure `end_markers_in_json=ON`. Você deve estar ciente de que, embora isso torne a saída mais fácil de ler, também torna o JSON inválido, fazendo com que as funções JSON lancem um erro.

`EXPLAIN` requer os mesmos privilégios necessários para executar a declaração explicada. Além disso, `EXPLAIN` também requer o privilégio `SHOW VIEW` para qualquer visualização explicada.

Com a ajuda de `EXPLAIN`, você pode ver onde deve adicionar índices às tabelas para que a instrução seja executada mais rapidamente, usando índices para encontrar linhas. Você também pode usar `EXPLAIN` para verificar se o otimizador está realizando as junções das tabelas em uma ordem ótima. Para dar uma dica ao otimizador para usar uma ordem de junção correspondente à ordem em que as tabelas são nomeadas em uma instrução `SELECT`, comece a instrução com `SELECT STRAIGHT_JOIN` em vez de apenas `SELECT`. (Veja Seção 13.2.9, “Instrução SELECT”.)

O rastreamento do otimizador pode, às vezes, fornecer informações complementares às do `EXPLAIN`. No entanto, o formato e o conteúdo do rastreamento do otimizador estão sujeitos a alterações entre as versões. Para obter detalhes, consulte Seção 8.15, “Rastreamento do Otimizador”.

Se você tiver um problema com os índices não sendo usados quando você acredita que eles deveriam ser, execute `ANALYZE TABLE` para atualizar as estatísticas da tabela, como a cardinalidade das chaves, que podem afetar as escolhas do otimizador. Veja Seção 13.7.2.1, “Instrução ANALYZE TABLE”.

Nota

O MySQL Workbench possui uma funcionalidade Visual Explain que fornece uma representação visual do resultado do `EXPLAIN`. Veja Tutoriais: Usando Explain para Melhorar o Desempenho das Consultas.
