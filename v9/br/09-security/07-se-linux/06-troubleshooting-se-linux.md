### 8.7.6 Solução de problemas do SELinux

A solução de problemas do SELinux geralmente envolve colocar o SELinux no modo permissivo, executar operações problemáticas novamente, verificar mensagens de negação de acesso no log de auditoria do SELinux e colocar o SELinux de volta no modo de aplicação após os problemas serem resolvidos.

Para evitar colocar todo o sistema no modo permissivo usando o **setenforce**, você pode permitir que apenas o serviço MySQL seja executado de forma permissiva, colocando seu domínio SELinux (`mysqld_t`) no modo permissivo usando o comando **semanage**:

```
semanage permissive -a mysqld_t
```

Quando você terminar de solucionar problemas, use este comando para colocar o domínio `mysqld_t` de volta no modo de aplicação:

```
semanage permissive -d mysqld_t
```

O SELinux escreve logs para operações negadas em `/var/log/audit/audit.log`. Você pode verificar as denúncias procurando por mensagens de “negação”.

```
grep "denied" /var/log/audit/audit.log
```

As seções a seguir descrevem algumas áreas comuns onde problemas relacionados ao SELinux podem ser encontrados.

#### Contextos de Arquivo

Se um diretório ou arquivo do MySQL tiver um contexto SELinux incorreto, o acesso pode ser negado. Esse problema pode ocorrer se o MySQL estiver configurado para ler de ou escrever em um diretório ou arquivo não padrão. Por exemplo, se você configurar o MySQL para usar um diretório de dados não padrão, o diretório pode não ter o contexto SELinux esperado.

Tentar iniciar o serviço MySQL em um diretório de dados não padrão com um contexto SELinux inválido causa o seguinte erro de inicialização.

```
$> systemctl start mysql.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de “negação” é registrada em `/var/log/audit/audit.log`:

```
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587133719.786:194): avc:  denied  { write } for  pid=7133 comm="mysqld"
name="mysql" dev="dm-0" ino=51347078 scontext=system_u:system_r:mysqld_t:s0
tcontext=unconfined_u:object_r:default_t:s0 tclass=dir permissive=0
```

Para obter informações sobre como definir o contexto SELinux adequado para diretórios e arquivos do MySQL, consulte a Seção 8.7.4, “Contexto de Arquivo SELinux”.

#### Acesso a Porta
Portuguese (Brazilian):

O SELinux espera que serviços como o MySQL Server usem portas específicas. Alterar portas sem atualizar as políticas do SELinux pode causar falha no serviço.

O tipo de porta `mysqld_port_t` define as portas que o MySQL escuta. Se você configurar o MySQL Server para usar uma porta não padrão, como a porta 3307, e não atualizar a política para refletir a mudança, o serviço MySQL não consegue iniciar:

```
$> systemctl start mysqld.service
Job for mysqld.service failed because the control process exited with error code.
See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

Neste caso, uma mensagem de negação é registrada em `/var/log/audit/audit.log`:

```
$> grep "denied" /var/log/audit/audit.log
type=AVC msg=audit(1587134375.845:198): avc:  denied  { name_bind } for  pid=7340
comm="mysqld" src=3307 scontext=system_u:system_r:mysqld_t:s0
tcontext=system_u:object_r:unreserved_port_t:s0 tclass=tcp_socket permissive=0
```

Para obter informações sobre como definir o contexto de porta TCP do SELinux adequado para o MySQL, consulte a Seção 8.7.5, “Contexto de Porta TCP do SELinux”. Problemas de acesso a portas semelhantes podem ocorrer ao habilitar recursos do MySQL que usam portas não definidas com o contexto necessário. Para mais informações, consulte a Seção 8.7.5.2, “Definindo o Contexto de Porta TCP para Recursos do MySQL”.

#### Alterações na Aplicação

O SELinux pode não estar ciente das alterações na aplicação. Por exemplo, uma nova versão, uma extensão de aplicativo ou uma nova funcionalidade podem acessar recursos do sistema de uma maneira que não é permitida pelo SELinux, resultando em negação de acesso. Nesses casos, você pode usar o utilitário **audit2allow** para criar políticas personalizadas para permitir o acesso quando necessário. O método típico para criar políticas personalizadas é alterar o modo do SELinux para permissivo, identificar mensagens de negação de acesso no log de auditoria do SELinux e usar o utilitário **audit2allow** para criar políticas personalizadas para permitir o acesso.

Para obter informações sobre o uso do utilitário **audit2allow**, consulte a documentação do SELinux da sua distribuição.

Se você encontrar problemas de acesso para o MySQL que você acredita que deveriam ser tratados pelos módulos padrão de política SELinux do MySQL, por favor, abra um relatório de bug no sistema de rastreamento de bugs da sua distribuição.