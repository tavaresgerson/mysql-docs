#### 7.1.12.3 Pesquisas de DNS e o cache do host

O servidor MySQL mantém um cache de host na memória que contém informações sobre clientes: endereço IP, nome de host e informações de erro. A tabela de Performance Schema `host_cache` expõe o conteúdo do cache do host para que ele possa ser examinado usando instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. Veja Seção 29.12.22.3, The host\_cache Table.

As seções a seguir discutem como o cache do host funciona, bem como outros tópicos, como como configurar e monitorar o cache.

- Operação do cache do host
- Configurar o cache do host
- Monitoramento do cache do host
- Limpeza do cache do host
- Tratamento de hosts bloqueados

##### Operação do cache do host

O servidor usa o cache do host apenas para conexões TCP não-localhost. Ele não usa o cache para conexões TCP estabelecidas usando um endereço de interface de loopback (por exemplo, `127.0.0.1` ou `::1`), ou para conexões estabelecidas usando um arquivo de soquete Unix, named pipe ou memória compartilhada.

O servidor usa o cache do host para vários propósitos:

- Ao armazenar em cache os resultados das pesquisas de nomes de IP para host, o servidor evita fazer uma pesquisa do Sistema de Nomes de Domínio (DNS) para cada conexão do cliente.
- O cache contém informações sobre erros que ocorrem durante o processo de conexão do cliente. Alguns erros são considerados bloqueio. Se muitos deles ocorrem sucessivamente de um determinado host sem uma conexão bem-sucedida, o servidor bloqueia mais conexões desse host. A variável do sistema `max_connect_errors` determina o número permitido de erros sucessivos antes que ocorra o bloqueio.

Para cada nova conexão de cliente aplicável, o servidor usa o endereço IP do cliente para verificar se o nome do host do cliente está no cache do host. Se assim for, o servidor recusa ou continua a processar o pedido de conexão dependendo se o host está bloqueado ou não. Se o host não estiver no cache, o servidor tenta resolver o nome do host. Primeiro, ele resolve o endereço IP para um nome de host e resolve esse nome de host de volta para um endereço IP. Em seguida, compara o resultado com o endereço IP original para garantir que eles são os mesmos. O servidor armazena informações sobre o resultado desta operação no cache do host. Se o cache estiver cheio, a entrada menos usada recentemente é descartada.

O servidor executa a resolução do nome do host usando a chamada de sistema `getaddrinfo()`.

O servidor lida com as entradas no cache do host assim:

1. Quando a primeira conexão do cliente TCP atinge o servidor a partir de um determinado endereço IP, uma nova entrada de cache é criada para registrar o IP do cliente, o nome do host e a bandeira de validação de pesquisa do cliente. Inicialmente, o nome do host é definido como `NULL` e a bandeira é falsa. Esta entrada também é usada para subsequentes conexões TCP do cliente a partir do mesmo IP de origem.
2. Se a bandeira de validação para a entrada IP do cliente for falsa, o servidor tenta uma resolução DNS IP-host-host-name-IP. Se isso for bem sucedido, o nome do host é atualizado com o nome do host resolvido e a bandeira de validação é definida como verdadeira. Se a resolução não for bem sucedida, a ação tomada depende de se o erro é permanente ou transitório. Para falhas permanentes, o nome do host permanece `NULL` e a bandeira de validação é definida como verdadeira. Para falhas transitórias, o nome do host e a bandeira de validação permanecem inalterados. (Neste caso, outra tentativa de resolução DNS ocorre na próxima vez que um cliente se conecta a partir deste IP.)
3. Se ocorrer um erro durante o processamento de uma conexão de cliente de entrada de um determinado endereço IP, o servidor atualiza os contadores de erros correspondentes na entrada para esse IP. Para uma descrição dos erros registrados, consulte a Seção 29.12.22.3, The host\_cache Table.

Para desbloquear hosts bloqueados, limpe o cache do host; consulte Dealing with Blocked Hosts.

É possível que um host bloqueado seja desbloqueado mesmo sem limpar o cache do host se ocorrer atividade de outros hosts:

- Se o cache estiver cheio quando uma conexão chegar de um IP do cliente que não esteja no cache, o servidor descartará a entrada de cache menos usada recentemente para abrir espaço para a nova entrada.
- Se a entrada descartada é para um host bloqueado, esse host torna-se desbloqueado.

Alguns erros de conexão não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido), ou não são específicos para qualquer endereço IP específico (como condições de falta de memória).

##### Configurar o cache do host

O cache do host é habilitado por padrão. A variável do sistema `host_cache_size` controla seu tamanho, bem como o tamanho da tabela do Esquema de Desempenho `host_cache` que expõe o conteúdo do cache. O tamanho do cache pode ser definido no início do servidor e alterado no tempo de execução. Por exemplo, para definir o tamanho em 100 no início, coloque essas linhas no arquivo do servidor `my.cnf`:

```
[mysqld]
host_cache_size=200
```

Para mudar o tamanho para 300 no tempo de execução, faça o seguinte:

```
SET GLOBAL host_cache_size=300;
```

A definição de `host_cache_size` em 0, seja no início do servidor ou no tempo de execução, desativa o cache do host. Com o cache desativado, o servidor executa uma pesquisa de DNS toda vez que um cliente se conecta.

Alterar o tamanho do cache no tempo de execução provoca uma operação implícita de limpeza do cache do host que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia todos os hosts bloqueados; veja Limpeza do cache do host.

Para desativar as pesquisas de nomes de host do DNS, inicie o servidor com a variável de sistema `skip_name_resolve` ativada. Neste caso, o servidor usa apenas endereços IP e não nomes de host para combinar a conexão de hosts com linhas nas tabelas de concessão do MySQL. Apenas contas especificadas nessas tabelas usando endereços IP podem ser usadas. (Um cliente pode não ser capaz de se conectar se não existir nenhuma conta que especifique o endereço IP do cliente.)

Se você tem um DNS muito lento e muitos hosts, você pode ser capaz de melhorar o desempenho, seja ativando o `skip_name_resolve` para desativar as pesquisas de DNS, ou aumentando o valor do `host_cache_size` para aumentar o cache do host.

Para desautorizar completamente as conexões TCP/IP, inicie o servidor com a variável de sistema `skip_networking` habilitada.

Para ajustar o número permitido de erros de conexão sucessivos antes que ocorra o bloqueio do host, defina a variável de sistema `max_connect_errors`.

```
[mysqld]
max_connect_errors=10000
```

Para alterar o valor no tempo de execução, faça o seguinte:

```
SET GLOBAL max_connect_errors=10000;
```

##### Monitoramento do cache do host

A tabela do Esquema de Desempenho `host_cache` expõe o conteúdo do cache do host. Esta tabela pode ser examinada usando instruções `SELECT`, que podem ajudá-lo a diagnosticar as causas dos problemas de conexão. Para informações sobre esta tabela, consulte a Seção 29.12.22.3, The host\_cache Table.

##### Limpeza do cache do host

Limpeza do cache host pode ser aconselhável ou desejável sob estas condições:

- Alguns dos seus hosts clientes mudam de endereço IP.
- A mensagem de erro `Host 'host_name' is blocked` ocorre para conexões de hosts legítimos.

Limpeza do cache do host tem estes efeitos:

- Limpa o cache da memória.
- Ele remove todas as linhas da tabela de Performance Schema `host_cache` que expõe o conteúdo do cache.
- Desbloqueia todos os hosts bloqueados. Isso permite novas tentativas de conexão desses hosts.

Para limpar o cache do host, use qualquer um destes métodos:

- Alterar o valor da variável de sistema `host_cache_size` Isto requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio depreciado `SUPER`).
- Executar uma instrução `TRUNCATE TABLE` que truncar a tabela `host_cache` do esquema de desempenho. Isso requer o privilégio `DROP` para a tabela.
- Executar um comando **mysqladmin flush-hosts**. Isso requer o privilégio `DROP` para a tabela `host_cache` do Performance Schema ou o privilégio `RELOAD`.

##### Tratamento de hosts bloqueados

O servidor usa o cache do host para rastrear erros que ocorrem durante o processo de conexão do cliente. Se o seguinte erro ocorrer, significa que `mysqld` recebeu muitas solicitações de conexão do host dado que foram interrompidas no meio:

```
Host 'host_name' is blocked because of many connection errors.
Unblock with 'mysqladmin flush-hosts'
```

O valor da variável de sistema `max_connect_errors` determina quantos pedidos de conexão interrompidos sucessivos o servidor permite antes de bloquear um host. Após pedidos fracassados sem uma conexão bem-sucedida, o servidor assume que algo está errado (por exemplo, que alguém está tentando invadir) e bloqueia o host de mais pedidos de conexão.

Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpeza do cache do host.

Por outro lado, para evitar que a mensagem de erro ocorra, defina `max_connect_errors` como descrito em Configurar o cache do host. O valor padrão de `max_connect_errors` é 100. Aumentar `max_connect_errors` para um valor grande torna menos provável que um host atinja o limiar e seja bloqueado. No entanto, se a mensagem de erro `Host 'host_name' is blocked` ocorrer, verifique primeiro que não há nada de errado com as conexões TCP/IP dos hosts bloqueados. Não adianta aumentar o valor de `max_connect_errors` se houver problemas de rede.
