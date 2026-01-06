### 15.8.3 Motor de Armazenamento FEDERATED Notas e Dicas

Você deve estar ciente dos seguintes pontos ao usar o mecanismo de armazenamento `FEDERATED`:

- As tabelas `FEDERATED` podem ser replicadas para outras réplicas, mas você deve garantir que os servidores da replica possam usar a combinação de usuário/senha definida na string `CONNECTION` (ou na linha da tabela `mysql.servers`) para se conectar ao servidor remoto.

Os itens a seguir indicam as funcionalidades que o mecanismo de armazenamento `FEDERATED` suporta e não suporta:

- O servidor remoto deve ser um servidor MySQL.

- A tabela remota a que a tabela `FEDERATED` aponta *deve* existir antes de você tentar acessar a tabela por meio da tabela `FEDERATED`.

- É possível que uma tabela `FEDERATED` aponte para outra, mas você deve ter cuidado para não criar um loop.

- Uma tabela `FEDERATED` não suporta índices no sentido usual; porque o acesso aos dados da tabela é gerenciado remotamente, é na verdade a tabela remota que faz uso de índices. Isso significa que, para uma consulta que não pode usar nenhum índice e, portanto, requer uma varredura completa da tabela, o servidor busca todas as linhas da tabela remota e as filtra localmente. Isso ocorre independentemente de qualquer cláusula `WHERE` ou `LIMIT` usada com essa instrução `SELECT`; essas cláusulas são aplicadas localmente às linhas retornadas.

  As consultas que não utilizam índices podem causar um desempenho ruim e sobrecarga na rede. Além disso, como as linhas devolvidas precisam ser armazenadas na memória, essa consulta também pode levar ao swap do servidor local ou até mesmo ao bloqueio.

- É preciso ter cuidado ao criar uma tabela `FEDERATED`, pois a definição de índice de uma tabela equivalente `MyISAM` ou outra pode não ser suportada. Por exemplo, a criação de uma tabela `FEDERATED` com um prefixo de índice falha para colunas `VARCHAR`, `TEXT` ou `BLOB`. A definição a seguir em `MyISAM` é válida:

  ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=MYISAM;
  ```

  O prefixo chave neste exemplo é incompatível com o motor `FEDERATED`, e a declaração equivalente falha:

  ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=FEDERATED
    CONNECTION='MYSQL://127.0.0.1:3306/TEST/T1';
  ```

  Se possível, tente separar a definição da coluna e do índice ao criar tabelas tanto no servidor remoto quanto no servidor local para evitar esses problemas de índice.

- Internamente, a implementação usa `SELECT`, `INSERT`, `UPDATE` e `DELETE`, mas não `HANDLER`.

- O mecanismo de armazenamento `FEDERATED` suporta `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE` e índices. Ele não suporta `ALTER TABLE` ou quaisquer instruções de Linguagem de Definição de Dados que afetem diretamente a estrutura da tabela, exceto `DROP TABLE`. A implementação atual não usa instruções preparadas.

- O `FEDERATED` aceita as instruções `INSERT ... ON DUPLICATE KEY UPDATE`, mas se ocorrer uma violação de chave duplicada, a instrução falhará com um erro.

- As transações não são suportadas.

- O `FEDERATED` realiza o manuseio de inserção em lote, enviando várias linhas para a tabela remota em um único lote, o que melhora o desempenho. Além disso, se a tabela remota for transacional, permite que o mecanismo de armazenamento remoto realize o rollback de instruções corretamente caso ocorra um erro. Essa capacidade tem as seguintes limitações:

  - O tamanho do inserto não pode exceder o tamanho máximo do pacote entre os servidores. Se o inserto exceder esse tamanho, ele será dividido em vários pacotes e o problema de rollback pode ocorrer.

  - O tratamento de inserção em lote não ocorre para `INSERT ... ON DUPLICATE KEY UPDATE`.

- Não há como o motor `FEDERATED` saber se a tabela remota foi alterada. A razão para isso é que essa tabela deve funcionar como um arquivo de dados que nunca seria escrito por nada além do sistema de banco de dados. A integridade dos dados na tabela local poderia ser violada se houvesse alguma alteração no banco de dados remoto.

- Ao usar uma string `CONNECTION`, você não pode usar o caractere '@' na senha. Você pode contornar essa limitação usando a instrução `CREATE SERVER` para criar uma conexão do servidor.

- As opções `insert_id` e `timestamp` não são propagadas ao provedor de dados.

- Qualquer declaração `DROP TABLE` emitida contra uma tabela `FEDERATED` exclui apenas a tabela local, não a tabela remota.

- As tabelas `FEDERATED` não funcionam com o cache de consultas.

- A partição definida pelo usuário não é suportada para tabelas `FEDERATED`.
