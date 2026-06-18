### 24.3.13 A Tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map

A tabela `ndb_transid_mysql_connection_map` fornece um mapeamento entre transactions `NDB`, coordenadores de transaction `NDB` e MySQL Servers anexados a um NDB Cluster como nós de API. Esta informação é usada ao popular as tabelas `server_operations` e `server_transactions` do Database de informações do NDB Cluster `ndbinfo`.

A tabela `ndb_transid_mysql_connection_map` possui as seguintes colunas:

* `mysql_connection_id`

  O ID de conexão do MySQL Server.

* `node_id`

  O ID do nó coordenador da transaction.

* `ndb_transid`

  O ID da transaction `NDB`.

#### Notas

O valor de `mysql_connection_id` é o mesmo que o ID de conexão ou session exibido na saída da instrução `SHOW PROCESSLIST`.

Não há instruções `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para NDB Cluster. Ela é implementada como um plugin `INFORMATION_SCHEMA`; você pode verificar se é suportada verificando a saída de `SHOW PLUGINS`. Se o suporte a `ndb_transid_mysql_connection_map` estiver habilitado, a saída desta instrução incluirá um plugin com este nome, do tipo `INFORMATION SCHEMA` e com status `ACTIVE`, conforme mostrado aqui (usando texto em destaque):

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

O plugin é habilitado por padrão. Você pode desabilitá-lo (ou forçar o server a não rodar a menos que o plugin inicie) iniciando o server com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desabilitado, o status é mostrado por `SHOW PLUGINS` como `DISABLED`. O plugin não pode ser habilitado ou desabilitado em runtime.

Embora os nomes desta tabela e suas colunas sejam exibidos em letras minúsculas, você pode usar maiúsculas ou minúsculas ao se referir a eles em instruções SQL.

Para que esta tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição NDB Cluster, ou um construído a partir das fontes do NDB Cluster com suporte ao storage engine `NDB` habilitado. Não está disponível no MySQL 5.7 Server padrão.