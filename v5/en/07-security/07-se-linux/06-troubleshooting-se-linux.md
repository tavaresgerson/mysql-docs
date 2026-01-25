### 6.7.6 Solução de Problemas do SELinux

A Solução de Problemas do SELinux geralmente envolve colocar o SELinux no modo permissivo (*permissive mode*), reexecutar operações problemáticas, verificar mensagens de negação de acesso (*access denial messages*) no *log* de auditoria do SELinux (*SELinux audit log*) e retornar o SELinux ao modo de imposição (*enforcing mode*) após a resolução dos problemas.

Para evitar colocar todo o sistema no modo permissivo usando **setenforce**, você pode permitir que apenas o *service* do MySQL seja executado permissivamente, colocando seu *domain* SELinux (`mysqld_t`) no modo permissivo usando o comando **semanage**:

```sql
semanage permissive -a mysqld_t
```

Quando terminar a Solução de Problemas, use este comando para retornar o *domain* `mysqld_t` ao modo de imposição (*enforcing mode*):

```sql
semanage permissive -d mysqld_t
```

O SELinux escreve *logs* para operações negadas em `/var/log/audit/audit.log`. Você pode verificar negações procurando por mensagens “denied”.

```sql
grep "denied" /var/log/audit/audit.log
```

As seções a seguir descrevem algumas áreas comuns onde problemas relacionados ao SELinux podem ser encontrados.

#### Contextos de Arquivo

Se um diretório ou arquivo do MySQL tiver um *SELinux context* incorreto, o acesso pode ser negado. Este problema pode ocorrer se o MySQL estiver configurado para ler ou gravar em um diretório ou arquivo não padrão. Por exemplo, se você configurar o MySQL para usar um *data directory* não padrão, o diretório pode não ter o *SELinux context* esperado.

A tentativa de iniciar o *service* do MySQL em um *data directory* não padrão com um *SELinux context* inválido causa a seguinte falha de inicialização.

```sql
$> systemctl start mysql.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de “denial” é registrada em `/var/log/audit/audit.log`:

```sql
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587133719.786:194): avc:  denied  { write } for  pid=7133 comm="mysqld"
name="mysql" dev="dm-0" ino=51347078 scontext=system_u:system_r:mysqld_t:s0
tcontext=unconfined_u:object_r:default_t:s0 tclass=dir permissive=0
```

Para obter informações sobre como definir o *SELinux context* apropriado para diretórios e arquivos MySQL, consulte [Section 6.7.4, “SELinux File Context”](selinux-file-context.html "6.7.4 Contexto de Arquivo do SELinux").

#### Acesso à Porta

O SELinux espera que *services* como o MySQL Server usem *ports* específicos. A alteração de *ports* sem atualizar as *policies* do SELinux pode causar uma falha no *service*.

O *port type* `mysqld_port_t` define as *ports* nas quais o MySQL escuta. Se você configurar o MySQL Server para usar uma *port* não padrão, como a *port* 3307, e não atualizar a *policy* para refletir a alteração, o *service* do MySQL falhará ao iniciar:

```sql
$> systemctl start mysqld.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de *denial* é registrada em `/var/log/audit/audit.log`:

```sql
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587134375.845:198): avc:  denied  { name_bind } for  pid=7340
comm="mysqld" src=3307 scontext=system_u:system_r:mysqld_t:s0
tcontext=system_u:object_r:unreserved_port_t:s0 tclass=tcp_socket permissive=0
```

Para obter informações sobre como definir o *SELinux port context* apropriado para o MySQL, consulte [Section 6.7.5, “SELinux TCP Port Context”](selinux-context-tcp-port.html "6.7.5 Contexto da Porta TCP do SELinux"). Problemas semelhantes de acesso à *port* podem ocorrer ao habilitar recursos do MySQL que usam *ports* que não estão definidos com o *context* exigido. Para mais informações, consulte [Section 6.7.5.2, “Setting the TCP Port Context for MySQL Features”](selinux-context-mysql-feature-ports.html "6.7.5.2 Definindo o Contexto da Porta TCP para Recursos do MySQL").

#### Alterações na Aplicação

O SELinux pode não estar ciente das alterações na aplicação. Por exemplo, um novo *release*, uma extensão de aplicação ou um novo recurso pode acessar recursos do sistema de uma forma não permitida pelo SELinux, resultando em *access denials*. Nesses casos, você pode usar o utilitário **audit2allow** para criar *custom policies* para permitir o acesso onde for necessário. O método típico para criar *custom policies* é alterar o modo do SELinux para permissivo (*permissive*), identificar mensagens de *access denial* no *SELinux audit log* e usar o utilitário **audit2allow** para criar *custom policies* para permitir o acesso.

Para obter informações sobre o uso do utilitário **audit2allow**, consulte a documentação do SELinux da sua distribuição.

Se você encontrar problemas de acesso para o MySQL que você acredita que deveriam ser tratados pelos *SELinux policy modules* padrão do MySQL, por favor, abra um *bug report* no sistema de rastreamento de *bugs* de sua distribuição.