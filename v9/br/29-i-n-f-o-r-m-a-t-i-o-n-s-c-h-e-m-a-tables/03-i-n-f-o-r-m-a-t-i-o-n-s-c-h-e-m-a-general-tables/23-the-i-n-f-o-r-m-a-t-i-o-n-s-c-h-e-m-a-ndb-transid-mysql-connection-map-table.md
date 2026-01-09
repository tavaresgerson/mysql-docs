### 28.3.23 A tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map

A tabela `ndb_transid_mysql_connection_map` fornece uma mapeiação entre as transações `NDB`, os coordenadores de transações `NDB` e os servidores MySQL ligados a um NDB Cluster como nós de API. Essas informações são usadas ao preencher as tabelas `server_operations` e `server_transactions` do banco de dados de informações do NDB Cluster `ndbinfo`.

<table summary="Colunas na tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map. A tabela lista os nomes do INFORMATION_SCHEMA juntamente com os nomes correspondentes (se aplicável) e observações."><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th><code>INFORMATION_SCHEMA</code> Name</th> <th><code>SHOW</code> Name</th> <th>Observações</th> </tr></thead><tbody><tr> <th><code>mysql_connection_id</code></th> <td></td> <td>ID de conexão ou sessão do servidor MySQL</td> </tr><tr> <th><code>node_id</code></th> <td></td> <td>ID do nó do coordenador de transação</td> </tr><tr> <th><code>ndb_transid</code></th> <td></td> <td>ID da transação `NDB`</td> </tr></tbody></table>

O `mysql_connection_id` é o mesmo que o ID de conexão ou sessão mostrado na saída de `SHOW PROCESSLIST`.

Não há declarações `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para o NDB Cluster. Ela é implementada como um plugin do `INFORMATION_SCHEMA`; você pode verificar se ela é suportada verificando a saída da instrução `SHOW PLUGINS`. Se o suporte ao `ndb_transid_mysql_connection_map` estiver habilitado, a saída dessa instrução inclui um plugin com esse nome, do tipo `INFORMATION SCHEMA`, e com status `ACTIVE`, conforme mostrado aqui (usando texto em negrito):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |

...

| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE | DAEMON             | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
47 rows in set (0.01 sec)
```

O plugin está habilitado por padrão. Você pode desabilitá-lo (ou forçar o servidor a não funcionar a menos que o plugin seja iniciado) iniciando o servidor com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desabilitado, o status será exibido pela instrução `SHOW PLUGINS` como `DISABLED`. O plugin não pode ser habilitado ou desabilitado em tempo de execução.

Embora os nomes dessa tabela e de suas colunas sejam exibidos em minúsculas, você pode usar maiúsculas ou minúsculas ao referenciá-los em instruções SQL.

Para que essa tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição do NDB Cluster, ou um construído a partir das fontes do NDB Cluster com o suporte ao motor de armazenamento `NDB` habilitado. Ele não está disponível no servidor padrão MySQL 9.5.