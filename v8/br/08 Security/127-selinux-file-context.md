### 8.7.4 Contexto de Arquivo SELinux

O MySQL Server lê e escreve em muitos arquivos. Se o contexto SELinux não estiver configurado corretamente para esses arquivos, o acesso a eles pode ser negado.

As instruções a seguir usam o binário `semanage` para gerenciar o contexto de arquivo; no RHEL, faz parte do pacote `policycoreutils-python-utils`:

```
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os contextos de arquivo MySQL usando `semanage` com a opção `fcontext`.

```
semanage fcontext -l | grep -i mysql
```

#### Configurando o Contexto do Diretório de Dados do MySQL

A localização padrão do diretório de dados é `/var/lib/mysql/`; e o contexto SELinux usado é `mysqld_db_t`.

Se você editar o arquivo de configuração para usar uma localização diferente para o diretório de dados, ou para qualquer um dos arquivos normalmente no diretório de dados (como os logs binários), você pode precisar definir o contexto para a nova localização. Por exemplo:

```
semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/datadir(/.*)?"
restorecon -Rv /path/to/my/custom/datadir

semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/logdir(/.*)?"
restorecon -Rv /path/to/my/custom/logdir
```

#### Configurando o Arquivo de Log de Erro do MySQL

A localização padrão para RPMs do RedHat é `/var/log/mysqld.log`; e o tipo de contexto SELinux usado é `mysqld_log_t`.

Se você editar o arquivo de configuração para usar uma localização diferente, você pode precisar definir o contexto para a nova localização. Por exemplo:

```
semanage fcontext -a -t mysqld_log_t "/path/to/my/custom/error.log"
restorecon -Rv /path/to/my/custom/error.log
```

#### Configurando o Contexto do Arquivo de PID

A localização padrão do arquivo de PID é `/var/run/mysqld/mysqld.pid`; e o tipo de contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar uma localização diferente, você pode precisar definir o contexto para a nova localização. Por exemplo:

```
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/pidfile/directory/.*?"
restorecon -Rv /path/to/my/custom/pidfile/directory
```

#### Configurando o Contexto do Soquete de Domínio Unix

A localização padrão do soquete de domínio Unix é `/var/lib/mysql/mysql.sock`; e o tipo de contexto SELinux usado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar uma localização diferente, você pode precisar definir o contexto para a nova localização. Por exemplo:

```
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/mysql\.sock"
restorecon -Rv /path/to/my/custom/mysql.sock
```

#### Configurando o Contexto do Diretório secure_file_priv

Para versões do MySQL a partir de 5.6.34, 5.7.16 e 8.0.11.

A instalação do RPM do MySQL Server cria um diretório `/var/lib/mysql-files/`, mas não define o contexto SELinux para ele. O diretório `/var/lib/mysql-files/` é destinado a ser usado para operações como `SELECT ... INTO OUTFILE`.

Se você habilitou o uso deste diretório configurando `secure_file_priv`, você pode precisar definir o contexto da seguinte forma:

```
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql-files/(/.*)?"
restorecon -Rv /var/lib/mysql-files
```

Edite este caminho se você usou um local diferente. Por motivos de segurança, este diretório nunca deve estar dentro do diretório de dados.

Para obter mais informações sobre essa variável, consulte a documentação do `secure_file_priv`.