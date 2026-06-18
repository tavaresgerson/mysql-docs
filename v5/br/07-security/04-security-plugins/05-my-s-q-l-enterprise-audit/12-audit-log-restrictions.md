#### 6.4.5.12 Restrições do Log de Auditoria

O MySQL Enterprise Audit está sujeito a essas restrições gerais:

- Apenas as instruções SQL são registradas. As alterações feitas por APIs não SQL, como memcached, Node.JS e a API NDB, não são registradas.

- Apenas as declarações de nível superior são registradas, não as declarações dentro de programas armazenados, como gatilhos ou procedimentos armazenados.

- O conteúdo dos arquivos referenciados por declarações como `LOAD DATA` não é registrado.

- Antes do MySQL 5.7.21, o MySQL Enterprise Audit usa tabelas `MyISAM` no banco de dados do sistema `mysql`. A Replicação por Grupo não suporta tabelas `MyISAM`. Portanto, o MySQL Enterprise Audit e o Grupo de Replicação não podem ser usados juntos.

**NBD Cluster.** É possível usar o MySQL Enterprise Audit com o MySQL NDB Cluster, sujeito às seguintes condições:

- Todas as alterações que devem ser registradas devem ser feitas usando a interface SQL. Alterações feitas com interfaces não SQL, como as fornecidas pela API NDB, memcached ou ClusterJ, não são registradas.

- O plugin deve ser instalado em cada servidor MySQL que é usado para executar SQL no cluster.

- Os dados do plugin de auditoria devem ser agregados entre todos os servidores MySQL usados com o clúster. Essa agregação é responsabilidade da aplicação ou do usuário.
