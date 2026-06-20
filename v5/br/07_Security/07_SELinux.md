## 6.7 SELinux

O Linux com segurança aprimorada (SELinux) é um sistema de controle de acesso obrigatório (MAC) que implementa direitos de acesso aplicando uma etiqueta de segurança referida como um *contexto SELinux* a cada objeto do sistema. Os módulos de política SELinux usam contextos SELinux para definir regras sobre como processos, arquivos, portas e outros objetos do sistema interagem entre si. A interação entre objetos do sistema só é permitida se uma regra de política permitir isso.

Um contexto SELinux (o rótulo aplicado a um objeto do sistema) tem os seguintes campos: `user`, `role`, `type` e `security level`. A informação do tipo, em vez do contexto SELinux inteiro, é usada com mais frequência para definir regras sobre como os processos interagem com outros objetos do sistema. Os módulos de política MySQL SELinux, por exemplo, definem regras de política usando a informação `type`.

Você pode visualizar os contextos SELinux usando comandos do sistema operacional, como **ls** e **ps**, com a opção `-Z`. Supondo que o SELinux esteja habilitado e um servidor MySQL esteja em execução, os seguintes comandos mostram o contexto SELinux para o processo `mysqld` e o diretório de dados do MySQL:

`mysqld` processo:

```sql
$> ps -eZ | grep mysqld
system_u:system_r:mysqld_t:s0    5924 ?        00:00:03 mysqld
```

Diretório de dados do MySQL:

```sql
$> cd /var/lib
$> ls -Z | grep mysql
system_u:object_r:mysqld_db_t:s0 mysql
```

onde:

* `system_u` é uma identidade de usuário SELinux para processos e objetos do sistema.

* `system_r` é um papel SELinux utilizado para processos do sistema.

* `objects_r` é um papel SELinux utilizado para objetos do sistema.

* `mysqld_t` é o tipo associado ao processo mysqld.

* `mysqld_db_t` é o tipo associado ao diretório de dados do MySQL e seus arquivos.

* `s0` é o nível de segurança.

Para obter mais informações sobre a interpretação dos contextos SELinux, consulte a documentação do SELinux da sua distribuição.

### 6.7.1 Verifique se o SELinux está habilitado

O SELinux é ativado por padrão em algumas distribuições Linux, incluindo o Oracle Linux, RHEL, CentOS e Fedora. Use o comando **sestatus** para determinar se o SELinux está ativado na sua distribuição:

```sql
$> sestatus
SELinux status:                 enabled
SELinuxfs mount:                /sys/fs/selinux
SELinux root directory:         /etc/selinux
Loaded policy name:             targeted
Current mode:                   enforcing
Mode from config file:          enforcing
Policy MLS status:              enabled
Policy deny_unknown status:     allowed
Memory protection checking:     actual (secure)
Max kernel policy version:      31
```

Se o SELinux estiver desativado ou se o comando **sestatus** não for encontrado, consulte a documentação do SELinux da sua distribuição para obter orientações antes de habilitar o SELinux.

### 6.7.2 Mudando o modo SELinux

O SELinux suporta modos de aplicação, permissiva e desativado. O modo de aplicação é o padrão. O modo permissivo permite operações que não são permitidas no modo de aplicação e registra essas operações no registro de auditoria do SELinux. O modo permissivo é tipicamente usado ao desenvolver políticas ou solucionar problemas. No modo desativado, as políticas não são aplicadas e os contextos não são aplicados aos objetos do sistema, o que dificulta a habilitação do SELinux posteriormente.

Para visualizar o modo atual do SELinux, use o comando **sestatus** mencionado anteriormente ou o utilitário **getenforce**.

```sql
$> getenforce
Enforcing
```

Para alterar o modo SELinux, use o utilitário `setenforce`:

```sql
$> setenforce 0
$> getenforce
Permissive
```

```sql
$> setenforce 1
$> getenforce
Enforcing
```

As alterações feitas com o **setenforce** são perdidas quando você reinicia o sistema. Para alterar permanentemente o modo SELinux, edite o arquivo `/etc/selinux/config` e reinicie o sistema.

### 6.7.3 Políticas do MySQL Server SELinux

Os módulos de políticas do MySQL Server SELinux são, normalmente, instalados por padrão. Você pode visualizar os módulos instalados usando o comando **semodule -l**. Os módulos de políticas do MySQL Server SELinux incluem:

* `mysqld_selinux`
* `mysqld_safe_selinux`

Para obter informações sobre os módulos de políticas do MySQL Server SELinux, consulte as páginas do manual do SELinux. As páginas do manual fornecem informações sobre os tipos e os booleans associados ao serviço MySQL. As páginas do manual são nomeadas no formato `service-name_selinux`.

```sql
man mysqld_selinux
```

Se as páginas do manual do SELinux não estiverem disponíveis, consulte a documentação do SELinux da sua distribuição para obter informações sobre como gerar páginas do manual usando o utilitário `sepolicy manpage`.

### 6.7.4 Contexto de arquivo SELinux

O MySQL Server lê e escreve em muitos arquivos. Se o contexto SELinux não for configurado corretamente para esses arquivos, o acesso aos arquivos pode ser negado.

As instruções que se seguem utilizam o `semanage` binário para gerenciar o contexto do arquivo; no RHEL, faz parte do pacote `policycoreutils-python-utils`:

```sql
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os contextos de arquivo do MySQL usando `semanage` com a opção `fcontext`.

```sql
semanage fcontext -l | grep -i mysql
```

#### Definindo o diretório de dados do MySQL

O diretório de dados padrão é `/var/lib/mysql/`; e o contexto SELinux usado é `mysqld_db_t`.

Se você editar o arquivo de configuração para usar um local diferente para o diretório de dados, ou para qualquer um dos arquivos normalmente presentes no diretório de dados (como os logs binários), você pode precisar definir o contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/datadir(/.*)?"
restorecon -Rv /path/to/my/custom/datadir

semanage fcontext -a -t mysqld_db_t "/path/to/my/custom/logdir(/.*)?"
restorecon -Rv /path/to/my/custom/logdir
```

#### Definindo o contexto do arquivo de registro de erro do MySQL

O local padrão para os RPMs do RedHat é `/var/log/mysqld.log`; e o tipo de contexto SELinux utilizado é `mysqld_log_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_log_t "/path/to/my/custom/error.log"
restorecon -Rv /path/to/my/custom/error.log
```

#### Definindo o contexto do arquivo PID

O local padrão para o arquivo PID é `/var/run/mysqld/mysqld.pid`; e o tipo de contexto SELinux utilizado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/pidfile/directory/.*?"
restorecon -Rv /path/to/my/custom/pidfile/directory
```

#### Configurando o contexto do socket de domínio Unix

O local padrão para o socket de domínio Unix é `/var/lib/mysql/mysql.sock`; e o tipo de contexto SELinux utilizado é `mysqld_var_run_t`.

Se você editar o arquivo de configuração para usar um local diferente, você pode precisar definir o contexto para o novo local. Por exemplo:

```sql
semanage fcontext -a -t mysqld_var_run_t "/path/to/my/custom/mysql\.sock"
restorecon -Rv /path/to/my/custom/mysql.sock
```

#### Definindo o contexto do diretório secure\_file\_priv

Para as versões do MySQL desde 5.6.34, 5.7.16 e 8.0.11.

A instalação do RPM do servidor MySQL cria um diretório `/var/lib/mysql-files/`, mas não define o contexto SELinux para ele. O diretório `/var/lib/mysql-files/` é destinado a ser usado para operações como `SELECT ... INTO OUTFILE`.

Se você habilitou o uso desse diretório configurando `secure_file_priv`, você pode precisar definir o contexto da seguinte forma:

```sql
semanage fcontext -a -t mysqld_db_t "/var/lib/mysql-files/(/.*)?"
restorecon -Rv /var/lib/mysql-files
```

Editar este caminho se você usou um local diferente. Por motivos de segurança, este diretório nunca deve estar dentro do diretório de dados.

Para mais informações sobre essa variável, consulte a documentação do `secure_file_priv`.

### 6.7.5 Contexto de Porta TCP SELinux

As instruções que se seguem utilizam o `semanage` binário para gerenciar o contexto de porta; no RHEL, faz parte do pacote `policycoreutils-python-utils`:

```sql
yum install -y policycoreutils-python-utils
```

Após instalar o binário `semanage`, você pode listar os ports definidos com o contexto `mysqld_port_t` usando `semanage` com a opção `port`.

```sql
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      1186, 3306, 63132-63164
```

#### 6.7.5.1 Configurando o contexto do porto TCP para mysqld

A porta TCP padrão para `mysqld` é `3306`; e o tipo de contexto SELinux utilizado é `mysqld_port_t`.

Se você configurar `mysqld` para usar um TCP diferente `port`, você pode precisar definir o contexto para a nova porta. Por exemplo, para definir o contexto SELinux para uma porta não padrão, como a porta 3307:

```sql
semanage port -a -t mysqld_port_t -p tcp 3307
```

Para confirmar que o porto foi adicionado:

```sql
$> semanage port -l | grep mysqld
mysqld_port_t                  tcp      3307, 1186, 3306, 63132-63164
```

#### 6.7.5.2 Configuração do contexto da porta TCP para recursos do MySQL

Se você ativar certas funcionalidades do MySQL, talvez precise definir o contexto de porta TCP do SELinux para portas adicionais usadas por essas funcionalidades. Se as portas usadas pelas funcionalidades do MySQL não tiverem o contexto correto do SELinux, as funcionalidades podem não funcionar corretamente.

As seções a seguir descrevem como definir contextos de porta para recursos do MySQL. Geralmente, o mesmo método pode ser usado para definir o contexto de porta para qualquer recurso do MySQL. Para informações sobre os ports usados pelos recursos do MySQL, consulte o Referência de Portas do MySQL.

##### Definindo o contexto do porto TCP para replicação de grupo

Se o SELinux estiver habilitado, você deve definir o contexto de porta para a porta de comunicação de Replicação de Grupo, que é definida pela variável `group_replication_local_address`. `mysqld` deve ser capaz de se ligar à porta de comunicação de Replicação de Grupo e ouvir nela. O InnoDB Cluster depende da Replicação de Grupo, então isso se aplica igualmente às instâncias usadas em um clúster. Para visualizar as portas atualmente usadas pelo MySQL, execute:

```sql
semanage port -l | grep mysqld
```

Supondo que o porto de comunicação da replicação do grupo seja 33061, defina o contexto do porto emitindo:

```sql
semanage port -a -t mysqld_port_t -p tcp 33061
```

##### Definindo o contexto do porto TCP para o armazenamento de documentos

Se o SELinux estiver habilitado, você deve definir o contexto de porta para a porta de comunicação usada pelo X Plugin, que é definida pela variável `mysqlx_port`. `mysqld` deve ser capaz de se ligar à porta de comunicação do X Plugin e ouvir lá.

Supondo que o porto de comunicação do X Plugin seja 33060, defina o contexto do porto emitindo:

```sql
semanage port -a -t mysqld_port_t -p tcp 33060
```

### 6.7.6 Solução de problemas do SELinux

O diagnóstico e solução de problemas do SELinux geralmente envolve colocar o SELinux no modo permissivo, executar novamente as operações problemáticas, verificar mensagens de negação de acesso no registro de auditoria do SELinux e colocar o SELinux de volta no modo de aplicação após os problemas serem resolvidos.

Para evitar colocar todo o sistema no modo permissivo usando o **setenforce**, você pode permitir que apenas o serviço MySQL execute de forma permissiva, colocando seu domínio SELinux (`mysqld_t`) no modo permissivo usando o comando **semanage**:

```sql
semanage permissive -a mysqld_t
```

Quando você tiver terminado de solucionar problemas, use este comando para colocar o domínio `mysqld_t` de volta no modo de aplicação:

```sql
semanage permissive -d mysqld_t
```

O SELinux escreve logs para operações negadas para `/var/log/audit/audit.log`. Você pode verificar as denúncias procurando por mensagens de “negado”.

```sql
grep "denied" /var/log/audit/audit.log
```

As seções a seguir descrevem algumas áreas comuns onde problemas relacionados ao SELinux podem ser encontrados.

#### Contextos de Arquivo

Se um diretório ou arquivo do MySQL tiver um contexto SELinux incorreto, o acesso pode ser negado. Esse problema pode ocorrer se o MySQL estiver configurado para ler ou escrever em um diretório ou arquivo não padrão. Por exemplo, se você configurar o MySQL para usar um diretório de dados não padrão, o diretório pode não ter o contexto SELinux esperado.

Tentar iniciar o serviço MySQL em um diretório de dados não padrão com um contexto SELinux inválido causa o seguinte erro de inicialização.

```sql
$> systemctl start mysql.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de “negação” é registrada em `/var/log/audit/audit.log`:

```sql
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587133719.786:194): avc:  denied  { write } for  pid=7133 comm="mysqld"
name="mysql" dev="dm-0" ino=51347078 scontext=system_u:system_r:mysqld_t:s0
tcontext=unconfined_u:object_r:default_t:s0 tclass=dir permissive=0
```

Para obter informações sobre a configuração do contexto SELinux adequado para diretórios e arquivos do MySQL, consulte a Seção 6.7.4, “Contexto de arquivo SELinux”.

#### Acesso ao Porto

O SELinux espera que serviços como o MySQL Server usem portas específicas. Alterar portas sem atualizar as políticas do SELinux pode causar falha no serviço.

O tipo de porta `mysqld_port_t` define as portas que o MySQL escuta. Se você configurar o servidor MySQL para usar uma porta não padrão, como a porta 3307, e não atualizar a política para refletir a mudança, o serviço MySQL não consegue iniciar:

```sql
$> systemctl start mysqld.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de negação é registrada em `/var/log/audit/audit.log`:

```sql
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587134375.845:198): avc:  denied  { name_bind } for  pid=7340
comm="mysqld" src=3307 scontext=system_u:system_r:mysqld_t:s0
tcontext=system_u:object_r:unreserved_port_t:s0 tclass=tcp_socket permissive=0
```

Para obter informações sobre a configuração do contexto do porto SELinux adequado para o MySQL, consulte a Seção 6.7.5, “Contexto de porto TCP SELinux”. Problemas semelhantes de acesso à porta podem ocorrer ao habilitar recursos do MySQL que utilizam portas que não são definidas com o contexto necessário. Para mais informações, consulte a Seção 6.7.5.2, “Definindo o contexto do porto TCP para recursos do MySQL”.

#### Alterações na Aplicação

O SELinux pode não estar ciente das mudanças nas aplicações. Por exemplo, uma nova versão, uma extensão de aplicativo ou uma nova funcionalidade podem acessar recursos do sistema de uma maneira que não é permitida pelo SELinux, resultando em denúncias de acesso. Nesses casos, você pode usar o utilitário **audit2allow** para criar políticas personalizadas para permitir o acesso quando necessário. O método típico para criar políticas personalizadas é alterar o modo SELinux para permissivo, identificar mensagens de denúncia de acesso no registro de auditoria do SELinux e usar o utilitário **audit2allow** para criar políticas personalizadas que permitam o acesso.

Para obter informações sobre o uso do utilitário **audit2allow**, consulte a documentação do SELinux da sua distribuição.

Se você encontrar problemas de acesso ao MySQL que acredita que devem ser tratados pelos módulos padrão de políticas SELinux do MySQL, por favor, abra um relatório de erro no sistema de rastreamento de bugs da sua distribuição.