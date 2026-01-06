#### 5.1.11.2 Consultas de DNS e Cache de Anfitriões

O servidor MySQL mantém um cache de host de memória que contém informações sobre os clientes: endereço IP, nome do host e informações de erro. A tabela do Schema de Desempenho `host_cache` expõe o conteúdo do cache de host para que ele possa ser examinado usando instruções de `[SELECT]`]\(select.html). Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. Veja Seção 25.12.16.1, “A tabela host\_cache”.

As seções a seguir discutem como o cache do host funciona, além de outros tópicos, como como configurar e monitorar o cache.

- Operação de cache do host
- Configurando o Cache do Host
- Monitoramento do Cache do Host
- Limpar o cache do host
- Lidando com hosts bloqueados

##### Operação de hospedagem de cache

O servidor usa o cache do host apenas para conexões TCP que não são do localhost. Ele não usa o cache para conexões TCP estabelecidas usando um endereço de interface de loopback (por exemplo, `127.0.0.1` ou `::1`), ou para conexões estabelecidas usando um arquivo de socket Unix, um tubo compartilhado ou memória compartilhada.

O servidor utiliza o cache do host para vários propósitos:

- Ao armazenar os resultados das consultas de IP para nomes de host, o servidor evita fazer uma consulta no Sistema de Nomes de Domínio (DNS) para cada conexão do cliente. Em vez disso, para um determinado host, ele precisa realizar uma consulta apenas para a primeira conexão desse host.

- O cache contém informações sobre os erros que ocorrem durante o processo de conexão do cliente. Alguns erros são considerados "bloqueantes". Se muitos desses erros ocorrerem sucessivamente a partir de um determinado host sem uma conexão bem-sucedida, o servidor bloqueia mais conexões desse host. A variável de sistema `max_connect_errors` determina o número permitido de erros sucessivos antes que o bloqueio ocorra.

Para cada nova conexão de cliente aplicável, o servidor usa o endereço IP do cliente para verificar se o nome do host do cliente está no cache de hosts. Se estiver, o servidor recusa ou continua a processar a solicitação de conexão, dependendo se o host está bloqueado ou não. Se o host não estiver no cache, o servidor tenta resolver o nome do host. Primeiro, resolve o endereço IP para um nome de host e resolve esse nome de host de volta para um endereço IP. Em seguida, compara o resultado com o endereço IP original para garantir que sejam os mesmos. O servidor armazena informações sobre o resultado dessa operação no cache de hosts. Se o cache estiver cheio, a entrada menos recentemente usada é descartada.

O servidor realiza a resolução de nomes de host usando a chamada de sistema `getaddrinfo()`.

O servidor lida com as entradas no cache do host da seguinte forma:

1. Quando a primeira conexão do cliente TCP atinge o servidor a partir de um endereço IP específico, uma nova entrada de cache é criada para registrar o IP do cliente, o nome do host e a bandeira de validação de busca do cliente. Inicialmente, o nome do host é definido como `NULL` e a bandeira é falsa. Essa entrada também é usada para conexões subsequentes do cliente TCP a partir do mesmo IP de origem.

2. Se a bandeira de validação para a entrada do IP do cliente for falsa, o servidor tenta uma resolução DNS de nome de host para IP. Se isso for bem-sucedido, o nome do host é atualizado com o nome do host resolvido e a bandeira de validação é definida como verdadeira. Se a resolução não for bem-sucedida, a ação tomada depende se o erro é permanente ou transitório. Para falhas permanentes, o nome do host permanece `NULL` e a bandeira de validação é definida como verdadeira. Para falhas transitórias, o nome do host e a bandeira de validação permanecem inalterados. (Neste caso, outra tentativa de resolução DNS ocorre da próxima vez que um cliente se conectar a partir deste IP.)

3. Se ocorrer um erro ao processar uma conexão de cliente recebida de um determinado endereço IP, o servidor atualiza os contadores de erro correspondentes na entrada desse IP. Para uma descrição dos erros registrados, consulte Seção 25.12.16.1, “A Tabela host\_cache”.

Para desbloquear hosts bloqueados, limpe o cache do host; veja Lidando com hosts bloqueados.

É possível que um host bloqueado seja desbloqueado mesmo sem limpar o cache do host se houver atividade de outros hosts:

- Se o cache estiver cheio quando uma conexão chega de um IP de cliente que não está no cache, o servidor descarta a entrada de cache menos recentemente usada para dar espaço para a nova entrada.

- Se a entrada descartada for para um host bloqueado, esse host será desbloqueado.

Alguns erros de conexão não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos de qualquer endereço IP particular (como condições de memória insuficiente). Para obter informações sobre esses erros, consulte as variáveis de status `Connection_errors_xxx` (consulte Seção 5.1.9, “Variáveis de Status do Servidor”).

##### Configurando o Cache do Host

O cache do host é ativado por padrão. A variável de sistema `host_cache_size` controla seu tamanho, assim como o tamanho da tabela do Schema de Desempenho `host_cache` que expõe o conteúdo do cache. O tamanho do cache pode ser definido na inicialização do servidor e alterado em tempo de execução. Por exemplo, para definir o tamanho para 100 na inicialização, coloque essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
host_cache_size=200
```

Para alterar o tamanho para 300 no momento da execução, faça o seguinte:

```sql
SET GLOBAL host_cache_size=300;
```

Definir `host_cache_size` para 0, seja no início do servidor ou durante o runtime, desabilita o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

Alterar o tamanho do cache em tempo de execução causa uma operação de esvaziamento implícito do cache do host, que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados; veja Esvaziar o Cache do Host.

Usar a opção `--skip-host-cache` é semelhante a definir a variável de sistema `host_cache_size` para 0, mas `host_cache_size` é mais flexível porque também pode ser usado para redimensionar, habilitar e desabilitar o cache do host em tempo de execução, não apenas no início do servidor. Iniciar o servidor com `--skip-host-cache` não impede alterações em tempo de execução no valor de `host_cache_size`, mas tais alterações não têm efeito e o cache não é reativado mesmo se `host_cache_size` for definido maior que 0.

Para desabilitar as consultas de nomes de host DNS, inicie o servidor com a variável de sistema `skip_name_resolve` habilitada. Nesse caso, o servidor usa apenas endereços IP e não nomes de host para associar os hosts de conexão a linhas nas tabelas de concessão do MySQL. Apenas as contas especificadas nessas tabelas usando endereços IP podem ser usadas. (Um cliente pode não conseguir se conectar se não existir uma conta que especifique o endereço IP do cliente.)

Se você tiver um DNS muito lento e muitos hosts, poderá melhorar o desempenho habilitando `skip_name_resolve` para desabilitar as pesquisas DNS ou aumentando o valor de `host_cache_size` para aumentar o tamanho do cache de hosts.

Para impedir completamente as conexões TCP/IP, inicie o servidor com a variável de sistema `skip_networking` habilitada.

Para ajustar o número permitido de erros de conexão consecutivos antes que o bloqueio do host ocorra, defina a variável de sistema `max_connect_errors`. Por exemplo, para definir o valor no início, coloque essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
max_connect_errors=10000
```

Para alterar o valor em tempo de execução, faça o seguinte:

```sql
SET GLOBAL max_connect_errors=10000;
```

##### Monitorar o cache do host

A tabela do Schema de Desempenho `host_cache` exibe o conteúdo do cache do host. Essa tabela pode ser examinada usando instruções de `SELECT`, o que pode ajudar a diagnosticar as causas dos problemas de conexão. O Schema de Desempenho deve estar habilitado ou essa tabela estará vazia. Para obter informações sobre essa tabela, consulte Seção 25.12.16.1, “A tabela host\_cache”.

##### Limpar o cache do host

A limpeza do cache do host pode ser aconselhável ou desejável nessas condições:

- Alguns dos seus anfitriões de clientes alteram o endereço IP.
- A mensagem de erro `O host 'host_name' está bloqueado` ocorre para conexões de hosts legítimos. (Veja Como lidar com hosts bloqueados.)

A limpeza do cache do host tem esses efeitos:

- Limpa o cache do host de memória.

- Ele remove todas as linhas da tabela do Schema de Desempenho `host_cache` que exibe o conteúdo do cache.

- Desbloqueia qualquer host bloqueado. Isso permite que novas tentativas de conexão sejam feitas a partir desses hosts.

Para limpar o cache do host, use qualquer um desses métodos:

- Altere o valor da variável de sistema `host_cache_size`. Isso requer o privilégio `SUPER`.

- Execute uma instrução `TRUNCATE TABLE` que trunque a tabela do Schema de Desempenho `host_cache`. Isso requer o privilégio `DROP` para a tabela.

- Execute a instrução `FLUSH HOSTS`. Isso requer o privilégio `RELOAD`.

- Execute o comando **mysqladmin flush-hosts**. Isso requer o privilégio `RELOAD`.

##### Lidando com Hosts Bloqueados

O servidor usa o cache do host para rastrear erros que ocorrem durante o processo de conexão do cliente. Se o seguinte erro ocorrer, isso significa que o **mysqld** recebeu muitas solicitações de conexão do host fornecido que foram interrompidas no meio:

```sql
Host 'host_name' is blocked because of many connection errors.
Unblock with 'mysqladmin flush-hosts'
```

O valor da variável de sistema `max_connect_errors` determina quantos pedidos de conexão interrompidos consecutivos o servidor permite antes de bloquear um host. Após os pedidos com falha sem uma conexão bem-sucedida, o servidor assume que algo está errado (por exemplo, que alguém está tentando invadir), e bloqueia o host de novos pedidos de conexão.

Para desbloquear hosts bloqueados, limpe o cache do host; veja Limpeza do Cache do Host.

Como alternativa, para evitar que a mensagem de erro ocorra, defina `max_connect_errors` conforme descrito em Configurando o Cache do Host. O valor padrão de `max_connect_errors` é 100. Aumentar `max_connect_errors` para um valor grande torna menos provável que um host atinja o limite e seja bloqueado. No entanto, se a mensagem de erro `Host 'host_name' is blocked` ocorrer, primeiro verifique se não há nada errado com as conexões TCP/IP dos hosts bloqueados. Não adianta aumentar o valor de `max_connect_errors` se houver problemas de rede.
