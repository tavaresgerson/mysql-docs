#### 14.18.1.1 Função que Configura o Primário da Replicação em Grupo

A função a seguir permite que você configure um membro de um grupo de replicação primário único para assumir o papel de primário. O primário atual se torna um secundário de leitura somente e o membro do grupo especificado se torna o primário de leitura/escrita. A função pode ser usada em qualquer membro de um grupo de replicação que esteja em modo primário único. Esta função substitui o processo usual de eleição do primário; consulte a Seção 20.5.1.1, “Mudando o Primário”, para obter mais informações.

Se um canal de replicação de fonte padrão para replica estiver em execução no membro primário existente, além dos canais de Replicação em Grupo, você deve parar esse canal de replica antes de poder alterar o membro do grupo. Você pode identificar o primário atual usando a coluna `MEMBER_ROLE` na tabela `replication_group_members` do Gerenciamento de Desempenho.

Todas as transações não confirmadas pelas quais o grupo está aguardando devem ser confirmadas, revertidas ou encerradas antes que a operação possa ser concluída. Você pode especificar um tempo limite para as transações que estão em execução ao usar a função. Para que o tempo limite funcione, todos os membros do grupo devem ser da versão 8.0.29 ou superior do MySQL.

Quando o tempo limite expira, para quaisquer transações que ainda não atingiram sua fase de commit, a sessão do cliente é desconectada para que a transação não prossiga. As transações que atingiram sua fase de commit são permitidas para serem concluídas. Ao definir um tempo limite, ele também impede que novas transações sejam iniciadas no primário a partir desse ponto. Transações explicitamente definidas (com uma declaração `START TRANSACTION` ou `BEGIN`) estão sujeitas ao tempo limite, à desconexão e ao bloqueio de transações recebidas, mesmo que não modifiquem nenhum dado. Para permitir a inspeção do primário enquanto a função estiver em operação, instruções únicas que não modifiquem dados, conforme listadas em Permitidas em consultas sob regras de consistência, são permitidas para prosseguir.

* `group_replication_set_as_primary()`

  Nomeia um membro específico do grupo como o novo primário, superpondo qualquer processo de eleição.

  Sintaxe:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

  Argumentos:

  + *`member_uuid`*: Uma string contendo o UUID do membro do grupo que você deseja que se torne o novo primário.

  + *`timeout`*: Um inteiro especificando um tempo limite em segundos para transações que estão em execução no primário existente quando você usar a função. Você pode definir um tempo limite de 0 segundos (imediatamente) até 3600 segundos (60 minutos). Quando você define um tempo limite, novas transações não podem ser iniciadas no primário a partir desse ponto. Não há configuração padrão para o tempo limite, então, se você não definir, não há limite superior para o tempo de espera, e novas transações podem ser iniciadas durante esse tempo.

  Valor de retorno:

  Uma string contendo o resultado da operação, por exemplo, se foi bem-sucedida ou não.

  Exemplo:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

Essa função aguarda que todas as transações e operações DML em andamento sejam concluídas antes de eleger o novo primário. No MySQL 9.5, ela também aguarda a conclusão de quaisquer declarações DDL em andamento, como `ALTER TABLE`. As operações consideradas declarações DDL para esse propósito estão listadas aqui:

+ `ALTER DATABASE`
+ `ALTER FUNCTION`
+ `ALTER INSTANCE`
+ `ALTER PROCEDURE`
+ `ALTER SERVER`
+ `ALTER TABLE`
+ `ALTER TABLESPACE`
+ `ALTER USER`
+ `ALTER VIEW`
+ `ANALYZE TABLE`
+ `CACHE INDEX`
+ `CHECK TABLE`
+ `CREATE DATABASE`
+ `CREATE FUNCTION`
+ `CREATE INDEX`
+ `CREATE ROLE`
+ `CREATE PROCEDURE`
+ `CREATE SERVER`
+ `CREATE SPATIAL REFERENCE SYSTEM`

+ `CREATE TABLE`
+ `CREATE TABLESPACE`
+ `CREATE TRIGGER`
+ `CREATE USER`
+ `CREATE VIEW`
+ `DROP DATABASE`
+ `DROP FUNCTION`
+ `DROP INDEX`
+ `DROP PROCEDURE`
+ `DROP ROLE`
+ `DROP SERVER`
+ `DROP SPATIAL REFERENCE SYSTEM`

+ `DROP TABLE`
+ `DROP TABLESPACE`
+ `DROP TRIGGER`
+ `DROP USER`
+ `DROP VIEW`
+ `GRANT`
+ `LOAD INDEX`
+ `OPTIMIZE TABLE`
+ `RENAME TABLE`
+ `REPAIR TABLE`
+ `REVOKE`
+ `TRUNCATE TABLE`

Isso também inclui quaisquer cursors abertos (consulte a Seção 15.6.6, “Cursors”).

Para mais informações, consulte a Seção 20.5.1.1, “Mudando o primário”.