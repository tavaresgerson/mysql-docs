### 6.7.6 Solução de problemas do SELinux

Para solucionar problemas com o SELinux, geralmente é necessário colocar o SELinux no modo permissivo, executar novamente as operações problemáticas, verificar se há mensagens de negação de acesso no log de auditoria do SELinux e, após resolver os problemas, colocar o SELinux de volta no modo de aplicação.

Para evitar colocar todo o sistema no modo permissivo usando o **setenforce**, você pode permitir que apenas o serviço MySQL seja executado de forma permissiva, colocando seu domínio SELinux (`mysqld_t`) no modo permissivo usando o comando **semanage**:

```sql
semanage permissive -a mysqld_t
```

Quando você tiver terminado de solucionar problemas, use este comando para colocar o domínio `mysqld_t` de volta no modo de aplicação:

```sql
semanage permissive -d mysqld_t
```

O SELinux escreve logs para operações negadas em `/var/log/audit/audit.log`. Você pode verificar as denúncias procurando por mensagens com a palavra “negado”.

```sql
grep "denied" /var/log/audit/audit.log
```

As seções a seguir descrevem algumas áreas comuns onde problemas relacionados ao SELinux podem ser encontrados.

#### Contexto de arquivo

Se um diretório ou arquivo do MySQL tiver um contexto SELinux incorreto, o acesso pode ser negado. Esse problema pode ocorrer se o MySQL estiver configurado para ler ou escrever em um diretório ou arquivo não padrão. Por exemplo, se você configurar o MySQL para usar um diretório de dados não padrão, o diretório pode não ter o contexto SELinux esperado.

Tentar iniciar o serviço MySQL em um diretório de dados não padrão com um contexto SELinux inválido causa o seguinte erro de inicialização.

```sql
$> systemctl start mysql.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de "negação" é registrada em `/var/log/audit/audit.log`:

```sql
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587133719.786:194): avc:  denied  { write } for  pid=7133 comm="mysqld"
name="mysql" dev="dm-0" ino=51347078 scontext=system_u:system_r:mysqld_t:s0
tcontext=unconfined_u:object_r:default_t:s0 tclass=dir permissive=0
```

Para obter informações sobre a configuração do contexto SELinux adequado para diretórios e arquivos do MySQL, consulte Seção 6.7.4, “Contexto de arquivo SELinux”.

#### Acesso ao Porto

O SELinux espera que serviços como o MySQL Server usem portas específicas. Mudar as portas sem atualizar as políticas do SELinux pode causar falha no serviço.

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

Para obter informações sobre a configuração do contexto de porta SELinux adequado para o MySQL, consulte Seção 6.7.5, “Contexto de Porta TCP SELinux”. Problemas semelhantes de acesso à porta podem ocorrer ao habilitar recursos do MySQL que utilizam portas que não são definidas com o contexto necessário. Para obter mais informações, consulte Seção 6.7.5.2, “Definindo o Contexto de Porta TCP para Recursos do MySQL”.

#### Alterações na Aplicação

O SELinux pode não estar ciente das alterações nas aplicações. Por exemplo, uma nova versão, uma extensão de aplicativo ou uma nova funcionalidade podem acessar recursos do sistema de uma maneira que não é permitida pelo SELinux, resultando em negação de acesso. Nesses casos, você pode usar o utilitário **audit2allow** para criar políticas personalizadas para permitir o acesso quando necessário. O método típico para criar políticas personalizadas é alterar o modo SELinux para permissivo, identificar mensagens de negação de acesso no log de auditoria do SELinux e usar o utilitário **audit2allow** para criar políticas personalizadas para permitir o acesso.

Para obter informações sobre o uso do utilitário **audit2allow**, consulte a documentação do SELinux da sua distribuição.

Se você encontrar problemas de acesso ao MySQL que acredita que deveriam ser resolvidos pelos módulos padrão de políticas SELinux do MySQL, por favor, abra um relatório de erro no sistema de acompanhamento de bugs da sua distribuição.
