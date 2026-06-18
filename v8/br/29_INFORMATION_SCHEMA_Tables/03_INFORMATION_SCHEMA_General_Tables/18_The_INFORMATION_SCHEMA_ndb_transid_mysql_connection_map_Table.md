### 28.3.18 A tabela INFORMATION\_SCHEMA ndb\_transid\_mysql\_connection\_map

A tabela `ndb_transid_mysql_connection_map` fornece uma correspondência entre as transações `NDB`, os coordenadores de transações `NDB` e os servidores MySQL conectados a um NDB Cluster como nós API. Essas informações são usadas ao preencher as tabelas `server_operations` e `server_transactions` do banco de dados de informações do NDB Cluster `ndbinfo`.

<table summary="Colunas na tabela INFORMATION_SCHEMA ndb_transid_mysql_connection_map. A tabela lista os nomes do INFORMATION_SCHEMA juntamente com os nomes correspondentes SHOW (se aplicável) e comentários."><thead><tr> <th scope="col">[[<code>INFORMATION_SCHEMA</code>]] Nome</th> <th scope="col">[[<code>SHOW</code>]] Nome</th> <th scope="col">Observações</th> </tr></thead><tbody><tr> <th>[[<code>mysql_connection_id</code>]]</th> <td></td> <td>ID de conexão do servidor MySQL</td> </tr><tr> <th>[[<code>node_id</code>]]</th> <td></td> <td>ID do nó do coordenador de transação</td> </tr><tr> <th>[[<code>ndb_transid</code>]]</th> <td></td> <td>[[<code>NDB</code>]] ID da transação</td> </tr></tbody></table>

O `mysql_connection_id` é o mesmo que o ID de conexão ou sessão exibido na saída do `SHOW PROCESSLIST`.

Não há declarações `SHOW` associadas a esta tabela.

Esta é uma tabela não padrão, específica para o NDB Cluster. Ela é implementada como um plugin `INFORMATION_SCHEMA`. Você pode verificar se ela é suportada verificando a saída de `SHOW PLUGINS`. Se o suporte ao `ndb_transid_mysql_connection_map` estiver habilitado, a saída desta declaração inclui um plugin com esse nome, do tipo `INFORMATION SCHEMA`, e com status `ACTIVE`, conforme mostrado aqui (usando texto em negrito):

```
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha2_cache_cleaner               | ACTIVE | AUDIT              | NULL    | GPL     |
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

O plugin está ativado por padrão. Você pode desativá-lo (ou forçar o servidor a não funcionar a menos que o plugin seja iniciado) iniciando o servidor com a opção `--ndb-transid-mysql-connection-map`. Se o plugin estiver desativado, o status será exibido por `SHOW PLUGINS` como `DISABLED`. O plugin não pode ser ativado ou desativado em tempo de execução.

Embora os nomes desta tabela e de suas colunas sejam exibidos em letras minúsculas, você pode usar letras maiúsculas ou minúsculas ao se referir a eles em instruções SQL.

Para que essa tabela seja criada, o MySQL Server deve ser um binário fornecido com a distribuição do NDB Cluster ou um binário construído a partir das fontes do NDB Cluster com o suporte ao motor de armazenamento `NDB`. Ele não está disponível no MySQL Server padrão 8.0.
