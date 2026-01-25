### 6.7.4 Contexto de Arquivo SELinux

O MySQL Server lê e escreve em muitos arquivos. Se o Contexto SELinux não estiver configurado corretamente para esses arquivos, o acesso a eles poderá ser negado.

As instruções a seguir utilizam o binário `semanage` para gerenciar o Contexto de arquivo; no RHEL, ele faz parte do pacote `policycoreutils-python-utils`:

```sql
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os contextos de arquivo do MySQL usando `semanage` com a opção `fcontext`.

```sql
semanage fcontext -l | grep -i mysql
```

#### Configurando o Contexto do Diretório de Dados do MySQL

O local padrão do diretório de dados é `/var/lib/mysql/`; e o Contexto SELinux usado é `mysqld_db_t`.

Se você editar o arquivo de configuração para usar um local diferente para o diretório de dados, ou para qualquer um dos arquivos normalmente presentes no diretório de dados (como os binary logs), pode ser necessário configurar o Contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/datadir(/.*)?"
restorecon -Rv /path/to/my/custom/datadir

semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/logdir(/.*)?"
restorecon -Rv /path/to/my/custom/logdir
```

#### Configurando o Contexto do Arquivo de Error Log do MySQL

O local padrão para os RPMs RedHat é `/var/log/mysqld.log`; e o tipo de Contexto SELinux usado é `mysqld_log_t`.

Se você editar o arquivo de configuração para usar um local diferente, pode ser necessário configurar o Contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_log_t "/path/to/my/custom/error.log"
restorecon -Rv /path/to/my/custom/error.log
```

#### Configurando o Contexto do PID File

O local padrão para o PID File é `/var/run/mysqld/mysqld.pid`; e o tipo de Contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, pode ser necessário configurar o Contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/pidfile/directory/.*?"
restorecon -Rv /path/to/my/custom/pidfile/directory
```

#### Configurando o Contexto do Unix Domain Socket

O local padrão para o Unix domain socket é `/var/lib/mysql/mysql.sock`; e o tipo de Contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, pode ser necessário configurar o Contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/mysql\.sock"
restorecon -Rv /path/to/my/custom/mysql.sock
```

#### Configurando o Contexto do Diretório secure_file_priv

Para versões do MySQL a partir de 5.6.34, 5.7.16 e 8.0.11.

A instalação do RPM do MySQL Server cria um diretório `/var/lib/mysql-files/`, mas não define o Contexto SELinux para ele. O diretório `/var/lib/mysql-files/` deve ser usado para operações como `SELECT ... INTO OUTFILE`.

Se você ativou o uso deste diretório configurando `secure_file_priv`, pode ser necessário definir o Contexto da seguinte forma:

```sql
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql-files/(/.*)?"
restorecon -Rv /var/lib/mysql-files
```

Edite este caminho se você usou um local diferente. Por motivos de segurança, este diretório nunca deve estar dentro do data directory.

Para mais informações sobre essa variável, consulte a documentação de [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv).