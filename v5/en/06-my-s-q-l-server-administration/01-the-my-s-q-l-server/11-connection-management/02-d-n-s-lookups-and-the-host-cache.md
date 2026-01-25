#### 5.1.11.2 DNS Lookups e o Host Cache

O servidor MySQL mantém um cache de host em memória que contém informações sobre clientes: endereço IP, host name e informações de erro. A tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema expõe o conteúdo do cache de host para que possa ser examinado usando comandos [`SELECT`](select.html "13.2.9 SELECT Statement"). Isso pode ajudar você a diagnosticar as causas de problemas de conexão. Consulte [Seção 25.12.16.1, “A Tabela host_cache”](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table").

As seções a seguir discutem como o cache de host funciona, bem como outros tópicos, como configurar e monitorar o cache.

* [Host Cache Operation](host-cache.html#host-cache-operation "Host Cache Operation") (Operação do Host Cache)
* [Configuring the Host Cache](host-cache.html#host-cache-configuration "Configuring the Host Cache") (Configurando o Host Cache)
* [Monitoring the Host Cache](host-cache.html#host-cache-monitoring "Monitoring the Host Cache") (Monitorando o Host Cache)
* [Flushing the Host Cache](host-cache.html#host-cache-flushing "Flushing the Host Cache") (Limpando o Host Cache)
* [Dealing with Blocked Hosts](host-cache.html#blocked-host "Dealing with Blocked Hosts") (Lidando com Hosts Bloqueados)

##### Host Cache Operation

O servidor usa o cache de host apenas para conexões TCP que não são localhost. Ele não usa o cache para conexões TCP estabelecidas usando um endereço de interface de loopback (por exemplo, `127.0.0.1` ou `::1`), ou para conexões estabelecidas usando um arquivo Unix socket, named pipe ou memória compartilhada.

O servidor usa o cache de host para vários propósitos:

* Ao armazenar em cache os resultados de lookups de IP para host name, o servidor evita fazer um Domain Name System (DNS) lookup para cada conexão de cliente. Em vez disso, para um determinado host, ele precisa realizar uma pesquisa apenas na primeira conexão desse host.

* O cache contém informações sobre erros que ocorrem durante o processo de conexão do cliente. Alguns erros são considerados "bloqueadores". Se muitos deles ocorrerem sucessivamente a partir de um determinado host sem uma conexão bem-sucedida, o servidor bloqueia conexões futuras desse host. A variável de sistema [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) determina o número permitido de erros sucessivos antes que o bloqueio ocorra.

Para cada nova conexão de cliente aplicável, o servidor usa o endereço IP do cliente para verificar se o host name do cliente está no cache de host. Em caso afirmativo, o servidor recusa ou continua a processar a solicitação de conexão dependendo se o host está bloqueado ou não. Se o host não estiver no cache, o servidor tenta resolver o host name. Primeiro, ele resolve o endereço IP para um host name e resolve esse host name de volta para um endereço IP. Em seguida, ele compara o resultado com o endereço IP original para garantir que sejam iguais. O servidor armazena informações sobre o resultado desta operação no cache de host. Se o cache estiver cheio, a entrada menos usada recentemente é descartada.

O servidor realiza a resolução de host name usando a chamada de sistema `getaddrinfo()`.

O servidor manipula as entradas no cache de host da seguinte forma:

1. Quando a primeira conexão de cliente TCP atinge o servidor a partir de um determinado endereço IP, uma nova entrada de cache é criada para registrar o IP do cliente, o host name e o flag de validação de lookup do cliente. Inicialmente, o host name é definido como `NULL` e o flag é falso. Esta entrada também é usada para conexões TCP de clientes subsequentes a partir do mesmo IP de origem.

2. Se o flag de validação para a entrada do IP do cliente for falso, o servidor tenta uma resolução DNS de IP para host name e de volta para IP. Se isso for bem-sucedido, o host name é atualizado com o host name resolvido e o flag de validação é definido como verdadeiro (**true**). Se a resolução não for bem-sucedida, a ação tomada depende se o erro é permanente ou transiente. Para falhas permanentes, o host name permanece `NULL` e o flag de validação é definido como verdadeiro. Para falhas transientes, o host name e o flag de validação permanecem inalterados. (Neste caso, outra tentativa de resolução DNS ocorre na próxima vez que um cliente se conectar a partir deste IP.)

3. Se ocorrer um erro durante o processamento de uma conexão de cliente de entrada a partir de um determinado endereço IP, o servidor atualiza os contadores de erro correspondentes na entrada para aquele IP. Para uma descrição dos erros registrados, consulte [Seção 25.12.16.1, “A Tabela host_cache”](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table").

Para desbloquear hosts bloqueados, limpe (**flush**) o cache de host; consulte [Lidando com Hosts Bloqueados](host-cache.html#blocked-host "Dealing with Blocked Hosts").

É possível que um host bloqueado seja desbloqueado mesmo sem limpar o cache de host se houver atividade de outros hosts:

* Se o cache estiver cheio quando uma conexão chegar de um IP de cliente que não está no cache, o servidor descarta a entrada do cache menos usada recentemente para abrir espaço para a nova entrada.

* Se a entrada descartada for para um host bloqueado, esse host será desbloqueado.

Alguns erros de conexão não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos para qualquer endereço IP em particular (como condições de falta de memória). Para obter informações sobre esses erros, verifique as variáveis de status [`Connection_errors_xxx`](server-status-variables.html#statvar_Connection_errors_xxx) (consulte [Seção 5.1.9, “Variáveis de Status do Servidor”](server-status-variables.html "5.1.9 Server Status Variables")).

##### Configuring the Host Cache

O cache de host é habilitado por padrão. A variável de sistema [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) controla seu tamanho, bem como o tamanho da tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema que expõe o conteúdo do cache. O tamanho do cache pode ser definido na inicialização do servidor e alterado em runtime. Por exemplo, para definir o tamanho para 100 na inicialização, coloque estas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
host_cache_size=200
```

Para alterar o tamanho para 300 em runtime, faça isto:

```sql
SET GLOBAL host_cache_size=300;
```

Definir `host_cache_size` como 0, seja na inicialização do servidor ou em runtime, desabilita o cache de host. Com o cache desabilitado, o servidor realiza um DNS lookup toda vez que um cliente se conecta.

Alterar o tamanho do cache em runtime causa uma operação implícita de flushing do cache de host que limpa o cache de host, trunca a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") e desbloqueia quaisquer hosts bloqueados; consulte [Limpando o Host Cache](host-cache.html#host-cache-flushing "Flushing the Host Cache").

Usar a opção [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) é semelhante a definir a variável de sistema [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) como 0, mas [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) é mais flexível porque também pode ser usada para redimensionar, habilitar e desabilitar o cache de host em runtime, não apenas na inicialização do servidor. Iniciar o servidor com [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) não impede alterações em runtime no valor de [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size), mas tais alterações não têm efeito e o cache não é reativado mesmo que [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) seja definido como um valor maior que 0.

Para desabilitar DNS host name lookups, inicie o servidor com a variável de sistema [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve) habilitada. Neste caso, o servidor usa apenas endereços IP e não host names para corresponder hosts de conexão às linhas nas grant tables do MySQL. Apenas contas especificadas nessas tabelas usando endereços IP podem ser usadas. (Um cliente pode não conseguir se conectar se não existir nenhuma conta que especifique o endereço IP do cliente.)

Se você tiver um DNS muito lento e muitos hosts, poderá melhorar o performance habilitando [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve) para desabilitar os DNS lookups, ou aumentando o valor de [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) para tornar o cache de host maior.

Para desativar conexões TCP/IP inteiramente, inicie o servidor com a variável de sistema [`skip_networking`](server-system-variables.html#sysvar_skip_networking) habilitada.

Para ajustar o número permitido de erros de conexão sucessivos antes que o bloqueio do host ocorra, defina a variável de sistema [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors). Por exemplo, para definir o valor na inicialização, coloque estas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
max_connect_errors=10000
```

Para alterar o valor em runtime, faça isto:

```sql
SET GLOBAL max_connect_errors=10000;
```

##### Monitoring the Host Cache

A tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema expõe o conteúdo do cache de host. Esta tabela pode ser examinada usando comandos [`SELECT`](select.html "13.2.9 SELECT Statement"), o que pode ajudar você a diagnosticar as causas de problemas de conexão. O Performance Schema deve estar habilitado ou esta tabela estará vazia. Para obter informações sobre esta tabela, consulte [Seção 25.12.16.1, “A Tabela host_cache”](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table").

##### Flushing the Host Cache

Limpar (**flushing**) o cache de host pode ser aconselhável ou desejável nestas condições:

* Alguns de seus hosts clientes alteram o endereço IP.
* A mensagem de erro `Host 'host_name' is blocked` ocorre para conexões de hosts legítimos. (Consulte [Lidando com Hosts Bloqueados](host-cache.html#blocked-host "Dealing with Blocked Hosts").)

Limpar (**flushing**) o cache de host tem estes efeitos:

* Ele limpa o cache de host em memória.
* Ele remove todas as linhas da tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema que expõe o conteúdo do cache.

* Ele desbloqueia quaisquer hosts bloqueados. Isso permite novas tentativas de conexão desses hosts.

Para limpar o cache de host, use qualquer um destes métodos:

* Altere o valor da variável de sistema [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size). Isso requer o privilege [`SUPER`](privileges-provided.html#priv_super).

* Execute um comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") que trunca a tabela [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") do Performance Schema. Isso requer o privilege [`DROP`](privileges-provided.html#priv_drop) para a tabela.

* Execute um comando [`FLUSH HOSTS`](flush.html#flush-hosts). Isso requer o privilege [`RELOAD`](privileges-provided.html#priv_reload).

* Execute um comando [**mysqladmin flush-hosts**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"). Isso requer o privilege [`RELOAD`](privileges-provided.html#priv_reload).

##### Dealing with Blocked Hosts

O servidor usa o cache de host para rastrear erros que ocorrem durante o processo de conexão do cliente. Se o seguinte erro ocorrer, isso significa que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") recebeu muitas solicitações de conexão do host fornecido que foram interrompidas no meio:

```sql
Host 'host_name' is blocked because of many connection errors.
Unblock with 'mysqladmin flush-hosts'
```

O valor da variável de sistema [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) determina quantas solicitações de conexão interrompidas sucessivas o servidor permite antes de bloquear um host. Após [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) solicitações com falha sem uma conexão bem-sucedida, o servidor assume que algo está errado (por exemplo, que alguém está tentando invadir) e bloqueia o host para solicitações de conexão futuras.

Para desbloquear hosts bloqueados, limpe (**flush**) o cache de host; consulte [Limpando o Host Cache](host-cache.html#host-cache-flushing "Flushing the Host Cache").

Alternativamente, para evitar que a mensagem de erro ocorra, defina [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) conforme descrito em [Configurando o Host Cache](host-cache.html#host-cache-configuration "Configuring the Host Cache"). O valor padrão de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) é 100. Aumentar [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) para um valor alto torna menos provável que um host atinja o limite e seja bloqueado. No entanto, se a mensagem de erro `Host 'host_name' is blocked` ocorrer, primeiro verifique se não há nada de errado com as conexões TCP/IP dos hosts bloqueados. Não adianta aumentar o valor de [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) se houver problemas de rede.