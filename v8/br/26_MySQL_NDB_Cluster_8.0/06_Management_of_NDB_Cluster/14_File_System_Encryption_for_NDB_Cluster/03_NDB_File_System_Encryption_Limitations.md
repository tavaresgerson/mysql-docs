#### 25.6.14.3 Limitações de criptografia do sistema de arquivos NDB

A criptografia de dados transparente no NDB Cluster está sujeita às seguintes restrições e limitações:

- A senha do sistema de arquivos deve ser fornecida a cada nó de dados individual.

- A rotação da senha do sistema de arquivos requer um reinício rotativo inicial dos nós de dados; isso deve ser feito manualmente ou por uma aplicação externa ao `NDB`).

- Para um cluster com apenas uma única replica (`NoOfReplicas = 1`), é necessário fazer um backup completo e restaurar para a rotação da senha do sistema de arquivos.

- A rotação de todas as chaves de criptografia de dados requer o reinício inicial do nó.

**NDB TDE e Replicação NDB.** O uso de um sistema de arquivos criptografado não afeta a Replicação NDB. Todos os seguintes cenários são suportados:

- Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não está criptografado.

- Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

- A replicação de um NDB Cluster cujo sistema de arquivos está criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

- Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.
