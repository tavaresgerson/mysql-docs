### 14.1.2 Melhores Práticas para Tabelas InnoDB

Esta seção descreve as melhores práticas ao usar tabelas `InnoDB`.

* Especifique uma Primary Key para cada tabela usando a coluna ou colunas que são consultadas (queried) com mais frequência, ou um valor auto-increment se não houver uma Primary Key óbvia.

* Use JOINs sempre que os dados forem extraídos de múltiplas tabelas com base em valores de ID idênticos dessas tabelas. Para um desempenho rápido do JOIN, defina Foreign Keys nas colunas de JOIN e declare essas colunas com o mesmo Data Type em cada tabela. Adicionar Foreign Keys garante que as colunas referenciadas sejam indexed, o que pode melhorar o desempenho. Foreign Keys também propagam DELETEs e UPDATEs para todas as tabelas afetadas e impedem a inserção de dados em uma tabela "child" (filha) se os IDs correspondentes não estiverem presentes na tabela "parent" (pai).

* Desative o autocommit. Realizar COMMIT hundreds de vezes por segundo limita o desempenho (limitado pela velocidade de escrita do seu dispositivo de armazenamento).

* Agrupe conjuntos de operações DML relacionadas em TRANSACTIONs, delimitando-as com as instruções `START TRANSACTION` e `COMMIT`. Embora você não queira fazer COMMIT com muita frequência, você também não deve emitir grandes lotes de instruções `INSERT`, `UPDATE` ou `DELETE` que sejam executadas por horas sem realizar COMMIT.

* Não utilize instruções `LOCK TABLES`. O InnoDB pode lidar com múltiplas sessions lendo e escrevendo na mesma tabela simultaneamente sem sacrificar a confiabilidade ou o alto desempenho. Para obter acesso de escrita exclusivo a um conjunto de linhas, use a sintaxe `SELECT ... FOR UPDATE` para LOCK (bloquear) apenas as linhas que você pretende atualizar.

* Habilite a variável `innodb_file_per_table` ou use general tablespaces para colocar os dados e Indexes das tabelas em arquivos separados, em vez do system tablespace. A variável `innodb_file_per_table` é habilitada por padrão.

* Avalie se seus dados e padrões de acesso se beneficiam dos recursos de compression (compressão) de tabela ou página do InnoDB. Você pode comprimir tabelas InnoDB sem sacrificar a capacidade de leitura/escrita (read/write capability).

* Execute o servidor com a opção `--sql_mode=NO_ENGINE_SUBSTITUTION` para evitar que tabelas sejam criadas com storage engines que você não deseja usar.