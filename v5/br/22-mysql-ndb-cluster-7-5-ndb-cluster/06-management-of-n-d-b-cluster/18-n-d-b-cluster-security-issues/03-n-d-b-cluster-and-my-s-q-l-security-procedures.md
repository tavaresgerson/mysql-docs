#### 21.6.18.3 Procedimentos de Segurança do NDB Cluster e MySQL

Nesta seção, discutimos os procedimentos de segurança padrão do MySQL conforme se aplicam à execução do NDB Cluster.

Em geral, qualquer procedimento padrão para executar o MySQL de forma segura também se aplica à execução de um MySQL Server como parte de um NDB Cluster. Em primeiro lugar, você deve sempre executar um MySQL Server como o `user` do sistema operacional `mysql`; isso não é diferente de executar o MySQL em um ambiente padrão (não-Cluster). A conta de sistema `mysql` deve ser definida de forma única e clara. Felizmente, este é o comportamento padrão para uma nova instalação do MySQL. Você pode verificar se o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") está sendo executado como o `user` do sistema operacional `mysql` usando um comando de sistema como o mostrado aqui:

```sql
$> ps aux | grep mysql
root     10467  0.0  0.1   3616  1380 pts/3    S    11:53   0:00 \
  /bin/sh ./mysqld_safe --ndbcluster --ndb-connectstring=localhost:1186
mysql    10512  0.2  2.5  58528 26636 pts/3    Sl   11:53   0:00 \
  /usr/local/mysql/libexec/mysqld --basedir=/usr/local/mysql \
  --datadir=/usr/local/mysql/var --user=mysql --ndbcluster \
  --ndb-connectstring=localhost:1186 --pid-file=/usr/local/mysql/var/mothra.pid \
  --log-error=/usr/local/mysql/var/mothra.err
jon      10579  0.0  0.0   2736   688 pts/0    S+   11:54   0:00 grep mysql
```

Se o processo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") estiver sendo executado como qualquer outro `user` que não seja `mysql`, você deve pará-lo imediatamente e reiniciá-lo como o `user` `mysql`. Se este `user` não existir no sistema, a conta de `user` `mysql` deve ser criada, e este `user` deve fazer parte do grupo de `users` `mysql`; neste caso, você também deve garantir que o diretório de dados do MySQL neste sistema (conforme definido usando a opção [`--datadir`](server-system-variables.html#sysvar_datadir) para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")) pertença ao `user` `mysql`, e que o arquivo `my.cnf` do SQL Node inclua `user=mysql` na seção `[mysqld]`. Alternativamente, você pode iniciar o processo do MySQL Server com [`--user=mysql`](server-options.html#option_mysqld_user) na linha de comando, mas é preferível usar a opção `my.cnf`, pois você pode esquecer de usar a opção de linha de comando e, assim, ter [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") sendo executado como outro `user` involuntariamente. O script de inicialização [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") força o MySQL a ser executado como o `user` `mysql`.

Importante

Nunca execute [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") como o `user` root do sistema. Fazer isso significa que potencialmente qualquer arquivo no sistema pode ser lido pelo MySQL e, portanto — caso o MySQL seja comprometido — por um atacante.

Conforme mencionado na seção anterior (veja [Section 21.6.18.2, “NDB Cluster and MySQL Privileges”](mysql-cluster-security-mysql-privileges.html "21.6.18.2 NDB Cluster and MySQL Privileges")), você deve sempre definir uma senha de root para o MySQL Server assim que ele estiver em execução. Você também deve excluir a conta de `user` anônimo que é instalada por padrão. Você pode realizar essas tarefas usando as seguintes instruções:

```sql
$> mysql -u root

mysql> UPDATE mysql.user
    ->     SET Password=PASSWORD('secure_password')
    ->     WHERE User='root';

mysql> DELETE FROM mysql.user
    ->     WHERE User='';

mysql> FLUSH PRIVILEGES;
```

Tenha muito cuidado ao executar a instrução [`DELETE`](delete.html "13.2.2 DELETE Statement") para não omitir a cláusula `WHERE`, ou você corre o risco de excluir *todos* os `users` do MySQL. Certifique-se de executar a instrução [`FLUSH PRIVILEGES`](flush.html#flush-privileges) assim que tiver modificado a tabela `mysql.user`, para que as alterações tenham efeito imediato. Sem [`FLUSH PRIVILEGES`](flush.html#flush-privileges), as alterações não entrarão em vigor até a próxima vez que o Server for reiniciado.

Nota

Muitos dos utilitários do NDB Cluster, como [**ndb_show_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables"), [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"), e [**ndb_select_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table"), também funcionam sem autenticação e podem revelar nomes de tabelas, schemas e dados. Por padrão, eles são instalados em sistemas estilo Unix com as permissões `wxr-xr-x` (755), o que significa que podem ser executados por qualquer `user` que possa acessar o diretório `mysql/bin`.

Veja [Section 21.5, “NDB Cluster Programs”](mysql-cluster-programs.html "21.5 NDB Cluster Programs"), para mais informações sobre esses utilitários.