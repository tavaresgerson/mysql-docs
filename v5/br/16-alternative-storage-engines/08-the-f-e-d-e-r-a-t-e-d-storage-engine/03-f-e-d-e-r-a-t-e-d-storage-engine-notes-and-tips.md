### 15.8.3 Notas e Dicas sobre o Storage Engine FEDERATED

Você deve estar ciente dos seguintes pontos ao usar o storage engine `FEDERATED`:

*   Tabelas `FEDERATED` podem ser replicadas para outras replicas, mas você deve garantir que os replica servers sejam capazes de usar a combinação de user/password definida na `CONNECTION` string (ou a linha na tabela `mysql.servers`) para se conectar ao remote server.

Os itens a seguir indicam os recursos que o storage engine `FEDERATED` suporta e não suporta:

*   O remote server deve ser um MySQL server.
*   A remote table para a qual uma tabela `FEDERATED` aponta *deve* existir antes que você tente acessar a tabela através da tabela `FEDERATED`.

*   É possível que uma tabela `FEDERATED` aponte para outra, mas você deve tomar cuidado para não criar um loop.

*   Uma tabela `FEDERATED` não suporta indexes no sentido usual; como o acesso aos dados da tabela é tratado remotamente, é de fato a remote table que utiliza os indexes. Isso significa que, para uma Query que não pode usar indexes e, portanto, requer um full table scan, o server busca todas as linhas da remote table e as filtra localmente. Isso ocorre independentemente de qualquer cláusula `WHERE` ou `LIMIT` usada com esta instrução `SELECT`; essas cláusulas são aplicadas localmente às linhas retornadas.

    Queries que falham ao usar indexes podem, portanto, causar baixo desempenho e sobrecarga de rede. Além disso, como as linhas retornadas devem ser armazenadas na memória, essa Query também pode levar ao swapping do local server, ou até mesmo ao travamento (hanging).

*   Deve-se ter cuidado ao criar uma tabela `FEDERATED`, pois a index definition de uma tabela `MyISAM` ou outra tabela equivalente pode não ser suportada. Por exemplo, criar uma tabela `FEDERATED` com um index prefix falha para colunas `VARCHAR`, `TEXT` ou `BLOB`. A seguinte definição em `MyISAM` é válida:

    ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=MYISAM;
  ```

    O key prefix neste exemplo é incompatível com o engine `FEDERATED`, e a instrução equivalente falha:

    ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=FEDERATED
    CONNECTION='MYSQL://127.0.0.1:3306/TEST/T1';
  ```

    Se possível, você deve tentar separar a coluna e a index definition ao criar tabelas tanto no remote server quanto no local server para evitar esses problemas de index.

*   Internamente, a implementação usa `SELECT`, `INSERT`, `UPDATE` e `DELETE`, mas não `HANDLER`.

*   O storage engine `FEDERATED` suporta `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE` e indexes. Não suporta `ALTER TABLE` ou quaisquer instruções Data Definition Language que afetem diretamente a estrutura da tabela, exceto `DROP TABLE`. A implementação atual não usa prepared statements.

*   `FEDERATED` aceita instruções `INSERT ... ON DUPLICATE KEY UPDATE`, mas se ocorrer uma violação de duplicate-key, a instrução falhará com um erro.

*   Transactions não são suportadas.
*   `FEDERATED` realiza o tratamento de bulk-insert de modo que múltiplas linhas são enviadas para a remote table em lote (batch), o que melhora o desempenho. Além disso, se a remote table for transactional, isso permite que o remote storage engine execute o statement rollback corretamente em caso de erro. Essa capacidade tem as seguintes limitações:

    + O tamanho do insert não pode exceder o maximum packet size entre servers. Se o insert exceder esse tamanho, ele é dividido em múltiplos packets e o problema de rollback pode ocorrer.

    + O tratamento de bulk-insert não ocorre para `INSERT ... ON DUPLICATE KEY UPDATE`.

*   Não há como o engine `FEDERATED` saber se a remote table foi alterada. A razão para isso é que esta tabela deve funcionar como um arquivo de dados que nunca seria gravado por nada além do sistema Database. A integridade dos dados na tabela local poderia ser comprometida se houvesse qualquer alteração no remote database.

*   Ao usar uma `CONNECTION` string, você não pode usar o caractere '@' na password. Você pode contornar essa limitação usando a instrução `CREATE SERVER` para criar uma server connection.

*   As opções `insert_id` e `timestamp` não são propagadas para o data provider.

*   Qualquer instrução `DROP TABLE` emitida contra uma tabela `FEDERATED` descarta apenas a tabela local, não a remote table.

*   Tabelas `FEDERATED` não funcionam com o Query Cache.

*   User-defined partitioning não é suportado para tabelas `FEDERATED`.