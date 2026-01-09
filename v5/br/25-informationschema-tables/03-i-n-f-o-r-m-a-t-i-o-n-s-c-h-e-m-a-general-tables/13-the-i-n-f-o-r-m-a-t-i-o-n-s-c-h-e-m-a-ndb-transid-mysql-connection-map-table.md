### 24.3.13 A tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map

A tabela `ndb_transid_mysql_connection_map` fornece uma associação entre as transações `NDB`, os coordenadores de transações `NDB` e os servidores MySQL ligados a um NDB Cluster como nós da API. Essas informações são usadas ao preencher as tabelas `server_operations` e `server_transactions` do banco de dados de informações do NDB Cluster `ndbinfo`.

A tabela `ndb_transid_mysql_connection_map` tem as seguintes colunas:

- `mysql_connection_id`

  O ID de conexão do servidor MySQL.

- `node_id`

  O ID do nó do coordenador da transação.

- `ndb_transid`

  O ID de transação `NDB`.

#### Notas

O valor `mysql_connection_id` é o mesmo do ID de conexão ou sessão exibido na saída de `SHOW PROCESSLIST` (show-processlist.html).

Não há declarações `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para o NDB Cluster. Ela é implementada como um plugin do `INFORMATION_SCHEMA`; você pode verificar se ela é suportada verificando a saída da instrução `SHOW PLUGINS`. Se o suporte ao `ndb_transid_mysql_connection_map` estiver habilitado, a saída dessa instrução inclui um plugin com esse nome, do tipo `INFORMATION SCHEMA`, e com status `ACTIVE`, conforme mostrado aqui (usando texto em negrito):

```sql
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCKS                     | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCK_WAITS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| partition                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
22 rows in set (0.00 sec)
```

O plugin está ativado por padrão. Você pode desativá-lo (ou forçar o servidor a não funcionar a menos que o plugin seja iniciado) iniciando o servidor com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desativado, o status será exibido por `SHOW PLUGINS` como `DESATIVADO`. O plugin não pode ser ativado ou desativado em tempo de execução.

Embora os nomes desta tabela e de suas colunas sejam exibidos em letras minúsculas, você pode usar letras maiúsculas ou minúsculas ao se referir a eles em instruções SQL.

Para que essa tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição do NDB Cluster ou um binário construído a partir das fontes do NDB Cluster com o suporte ao mecanismo de armazenamento `NDB`. Ele não está disponível no servidor padrão MySQL 5.7.
