#### 21.6.18.3 Procedimentos de segurança do NDB Cluster e MySQL

Nesta seção, discutimos os procedimentos de segurança padrão do MySQL, conforme eles se aplicam ao funcionamento do NDB Cluster.

Em geral, qualquer procedimento padrão para executar um MySQL de forma segura também se aplica à execução de um servidor MySQL como parte de um NDB Cluster. Em primeiro lugar, você deve sempre executar um servidor MySQL como o usuário do sistema `mysql`; isso não difere da execução do MySQL em um ambiente padrão (não Cluster). A conta do sistema `mysql` deve ser definida de forma única e clara. Felizmente, esse é o comportamento padrão para uma nova instalação do MySQL. Você pode verificar se o processo **mysqld** está sendo executado como o usuário do sistema `mysql` usando o comando do sistema, como o mostrado aqui:

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

Se o processo **mysqld** estiver rodando como qualquer outro usuário além do `mysql`, você deve imediatamente fechá-lo e reiniciá-lo como o usuário `mysql`. Se esse usuário não existir no sistema, a conta do usuário `mysql` deve ser criada, e esse usuário deve fazer parte do grupo de usuários `mysql`; nesse caso, você também deve garantir que o diretório de dados MySQL neste sistema (definido usando a opção `--datadir` para **mysqld**) seja de propriedade do usuário `mysql`, e que o arquivo `my.cnf` do nó SQL inclua `user=mysql` na seção `[mysqld]`. Alternativamente, você pode iniciar o processo do servidor MySQL com a opção `--user=mysql` na linha de comando, mas é preferível usar a opção `my.cnf`, pois você pode esquecer de usar a opção de linha de comando e, assim, ter o **mysqld** rodando como outro usuário sem intencionalidade. O script de inicialização **mysqld_safe** obriga o MySQL a rodar como o usuário `mysql`.

Importante

Nunca execute **mysqld** como usuário root do sistema. Isso significa que qualquer arquivo no sistema pode ser lido pelo MySQL, e, portanto, se o MySQL for comprometido, por um atacante.

Como mencionado na seção anterior (veja Seção 21.6.18.2, “Nível de acesso do NDB e privilégios do MySQL”), você deve sempre definir uma senha para o servidor MySQL assim que ele estiver em execução. Você também deve excluir a conta de usuário anônimo que é instalada por padrão. Você pode realizar essas tarefas usando as seguintes instruções:

```sql
$> mysql -u root

mysql> UPDATE mysql.user
    ->     SET Password=PASSWORD('secure_password')
    ->     WHERE User='root';

mysql> DELETE FROM mysql.user
    ->     WHERE User='';

mysql> FLUSH PRIVILEGES;
```

Tenha muito cuidado ao executar a instrução `DELETE` para não omitir a cláusula `WHERE`, pois você corre o risco de excluir *todos* os usuários do MySQL. Certifique-se de executar a instrução [`FLUSH PRIVILEGES`]\(flush.html#flush-privileges] assim que você tiver modificado a tabela `mysql.user`, para que as alterações tenham efeito imediato. Sem [`FLUSH PRIVILEGES`]\(flush.html#flush-privileges], as alterações não terão efeito até que o servidor seja reiniciado da próxima vez.

Nota

Muitas das utilidades do NDB Cluster, como **ndb_show_tables**, **ndb_desc** e **ndb_select_all**, também funcionam sem autenticação e podem revelar nomes de tabelas, esquemas e dados. Por padrão, elas estão instaladas em sistemas de estilo Unix com as permissões `wxr-xr-x` (755), o que significa que podem ser executadas por qualquer usuário que possa acessar o diretório `mysql/bin`.

Consulte a Seção 21.5, “Programas de Cluster NDB” para obter mais informações sobre esses utilitários.
