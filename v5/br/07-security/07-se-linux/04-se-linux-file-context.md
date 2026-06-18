### 6.7.4 Contexto de arquivo SELinux

O MySQL Server lê e escreve em muitos arquivos. Se o contexto SELinux não estiver configurado corretamente para esses arquivos, o acesso aos arquivos pode ser negado.

As instruções a seguir utilizam o binário `semanage` para gerenciar o contexto do arquivo; no RHEL, ele faz parte do pacote `policycoreutils-python-utils`:

```sh
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os contextos de arquivo do MySQL usando `semanage` com a opção `fcontext`.

```sh
semanage fcontext -l | grep -i mysql
```

#### Definindo o contexto do diretório de dados do MySQL

A localização padrão do diretório de dados é `/var/lib/mysql/`; e o contexto SELinux usado é `mysqld_db_t`.

Se você editar o arquivo de configuração para usar um local diferente para o diretório de dados ou para qualquer um dos arquivos normalmente no diretório de dados (como os logs binários), você pode precisar definir o contexto para o novo local. Por exemplo:

```sh
semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/datadir(/.*)?"
restorecon -Rv /path/to/my/custom/datadir

semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/logdir(/.*)?"
restorecon -Rv /path/to/my/custom/logdir
```

#### Definindo o contexto do arquivo de registro de erros do MySQL

O local padrão para os RPMs do RedHat é `/var/log/mysqld.log`; e o tipo de contexto SELinux usado é `mysqld_log_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sh
semanage fcontext -a -t mysqld_log_t "/path/to/my/custom/error.log"
restorecon -Rv /path/to/my/custom/error.log
```

#### Definindo o contexto do arquivo PID

O local padrão para o arquivo PID é `/var/run/mysqld/mysqld.pid`; e o tipo de contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sh
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/pidfile/directory/.*?"
restorecon -Rv /path/to/my/custom/pidfile/directory
```

#### Definindo o contexto do Soquete de Domínio Unix

O local padrão para o socket de domínio Unix é `/var/lib/mysql/mysql.sock`; e o tipo de contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sh
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/mysql\.sock"
restorecon -Rv /path/to/my/custom/mysql.sock
```

#### Definindo o contexto de diretório secure_file_priv

Para as versões do MySQL a partir de 5.6.34, 5.7.16 e 8.0.11.

A instalação do RPM do MySQL Server cria um diretório `/var/lib/mysql-files/`, mas não define o contexto SELinux para ele. O diretório `/var/lib/mysql-files/` é destinado a ser usado para operações como `SELECT ... INTO OUTFILE`.

Se você ativou o uso desse diretório configurando `secure_file_priv`, você pode precisar definir o contexto da seguinte forma:

```sh
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql-files/(/.*)?"
restorecon -Rv /var/lib/mysql-files
```

Editar este caminho se você usou um local diferente. Por motivos de segurança, este diretório nunca deve estar dentro do diretório de dados.

Para obter mais informações sobre essa variável, consulte a documentação da variável `secure_file_priv`.
