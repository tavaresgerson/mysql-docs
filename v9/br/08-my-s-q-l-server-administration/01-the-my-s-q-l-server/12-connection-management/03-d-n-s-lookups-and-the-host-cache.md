#### 7.1.12.3 Consultas de DNS e o Cache de Anfitriões

O servidor MySQL mantém um cache de anfitriões em memória que contém informações sobre os clientes: endereço IP, nome do host e informações de erro. A tabela do Schema de Desempenho `host_cache` expõe o conteúdo do cache de anfitriões para que ele possa ser examinado usando instruções `SELECT`. Isso pode ajudá-lo a diagnosticar as causas dos problemas de conexão. Veja a Seção 29.12.22.4, “A Tabela host_cache”.

As seções a seguir discutem como o cache de anfitriões funciona, bem como outros tópicos, como como configurar e monitorar o cache.

* Operação do Cache de Anfitriões
* Configuração do Cache de Anfitriões
* Monitoramento do Cache de Anfitriões
* Limpeza do Cache de Anfitriões
* Lidando com Anfitriões Bloqueados

##### Operação do Cache de Anfitriões

O servidor usa o cache de anfitriões apenas para conexões TCP que não são localhost. Ele não usa o cache para conexões TCP estabelecidas usando um endereço de interface de loopback (por exemplo, `127.0.0.1` ou `::1`), ou para conexões estabelecidas usando um arquivo de socket Unix, um tubo nomeado ou memória compartilhada.

O servidor usa o cache de anfitriões para vários propósitos:

* Ao armazenar os resultados das consultas de IP para nome de host, o servidor evita fazer uma consulta de Sistema de Nomes de Domínio (DNS) para cada conexão do cliente. Em vez disso, para um determinado host, ele precisa realizar uma consulta apenas para a primeira conexão desse host.

* O cache contém informações sobre erros que ocorrem durante o processo de conexão do cliente. Alguns erros são considerados “bloqueantes”. Se muitos desses ocorrerem sucessivamente de um determinado host sem uma conexão bem-sucedida, o servidor bloqueia mais conexões desse host. A variável de sistema `max_connect_errors` determina o número permitido de erros sucessivos antes que o bloqueio ocorra.

Para cada nova conexão de cliente aplicável, o servidor usa o endereço IP do cliente para verificar se o nome do host do cliente está no cache de hosts. Se estiver, o servidor recusa ou continua a processar a solicitação de conexão, dependendo se o host está bloqueado ou não. Se o host não estiver no cache, o servidor tenta resolver o nome do host. Primeiro, ele resolve o endereço IP para um nome de host e resolve esse nome de host de volta para um endereço IP. Em seguida, ele compara o resultado com o endereço IP original para garantir que sejam os mesmos. O servidor armazena informações sobre o resultado dessa operação no cache de hosts. Se o cache estiver cheio, a entrada menos recentemente usada é descartada.

O servidor realiza a resolução de nomes de hosts usando a chamada de sistema `getaddrinfo()`.

O servidor lida com as entradas no cache de hosts da seguinte forma:

1. Quando a primeira conexão de cliente TCP chega ao servidor a partir de um endereço IP dado, uma nova entrada é criada para registrar o IP do cliente, o nome do host e o sinalizador de validação de busca do cliente. Inicialmente, o nome do host é definido como `NULL` e o sinalizador é falso. Esta entrada também é usada para conexões subsequentes de cliente TCP do mesmo IP de origem.

2. Se o sinalizador de validação da entrada do IP do cliente for falso, o servidor tenta uma resolução DNS de IP para nome de host para IP. Se isso for bem-sucedido, o nome do host é atualizado com o nome de host resolvido e o sinalizador de validação é definido como verdadeiro. Se a resolução não for bem-sucedida, a ação tomada depende se o erro é permanente ou transitório. Para falhas permanentes, o nome do host permanece `NULL` e o sinalizador de validação é definido como verdadeiro. Para falhas transitórias, o nome do host e o sinalizador de validação permanecem inalterados. (Neste caso, outra tentativa de resolução DNS ocorre da próxima vez que um cliente se conecta a partir deste IP.)

3. Se ocorrer um erro ao processar uma conexão de cliente recebida de um endereço IP específico, o servidor atualiza os respectivos contadores de erros na entrada desse IP. Para uma descrição dos erros registrados, consulte a Seção 29.12.22.4, “A tabela host_cache”.

Para desbloquear hosts bloqueados, limpe o cache do host; consulte Como lidar com hosts bloqueados.

É possível que um host bloqueado seja desbloqueado mesmo sem limpar o cache do host se houver atividade de outros hosts:

* Se o cache estiver cheio quando uma conexão chega de um IP de cliente que não está no cache, o servidor descarta a entrada de cache menos recentemente usada para dar espaço para a nova entrada.

* Se a entrada descartada for para um host bloqueado, esse host é desbloqueado.

Alguns erros de conexão não estão associados a conexões TCP, ocorrem muito cedo no processo de conexão (mesmo antes de um endereço IP ser conhecido) ou não são específicos de nenhum endereço IP particular (como condições de memória insuficiente). Para obter informações sobre esses erros, consulte as variáveis de status `Connection_errors_xxx` (consulte a Seção 7.1.10, “Variáveis de status do servidor”).

##### Configurando o Cache do Host

O cache do host é ativado por padrão. A variável de sistema `host_cache_size` controla seu tamanho, bem como o tamanho da tabela `host_cache` do Schema de Desempenho que expõe o conteúdo do cache. O tamanho do cache pode ser definido no início do servidor e alterado em tempo de execução. Por exemplo, para definir o tamanho para 100 no início, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
host_cache_size=200
```

Para alterar o tamanho para 300 em tempo de execução, faça isso:

```
SET GLOBAL host_cache_size=300;
```

Definir `host_cache_size` para 0, seja no início do servidor ou em tempo de execução, desativa o cache do host. Com o cache desativado, o servidor realiza uma pesquisa DNS toda vez que um cliente se conecta.

Alterar o tamanho do cache em tempo de execução causa uma operação implícita de esvaziamento do cache do host que limpa o cache do host, trunca a tabela `host_cache` e desbloqueia quaisquer hosts bloqueados; veja Esvaziar o Cache do Host.

Para desabilitar as consultas de nomes de host DNS, inicie o servidor com a variável de sistema `skip_name_resolve` habilitada. Nesse caso, o servidor usa apenas endereços IP e não nomes de host para corresponder os hosts conectados às linhas nas tabelas de concessão do MySQL. Apenas as contas especificadas nessas tabelas usando endereços IP podem ser usadas. (Um cliente pode não conseguir se conectar se não existir uma conta que especifique o endereço IP do cliente.)

Se você tiver um DNS muito lento e muitos hosts, poderá melhorar o desempenho habilitando `skip_name_resolve` para desabilitar as consultas DNS ou aumentando o valor de `host_cache_size` para tornar o cache do host maior.

Para desabilitar completamente as conexões TCP/IP, inicie o servidor com a variável de sistema `skip_networking` habilitada.

Para ajustar o número permitido de erros de conexão consecutivos antes que o host seja bloqueado, defina a variável de sistema `max_connect_errors`. Por exemplo, para definir o valor no início, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
max_connect_errors=10000
```

Para alterar o valor em tempo de execução, faça isso:

```
SET GLOBAL max_connect_errors=10000;
```

##### Monitoramento do Cache do Host

A tabela do Schema de Desempenho `host_cache` expõe o conteúdo do cache do host. Essa tabela pode ser examinada usando instruções `SELECT`, o que pode ajudá-lo a diagnosticar as causas dos problemas de conexão. Para informações sobre essa tabela, consulte a Seção 29.12.22.4, “A tabela host_cache”.

##### Esvaziar o Cache do Host

Esvaziar o cache do host pode ser aconselhável ou desejável nessas condições:

* Alguns de seus anfitriões de clientes alteram o endereço IP.
* A mensagem de erro "O host 'host_name' está bloqueado" ocorre para conexões de hosts legítimos. (Veja Como lidar com hosts bloqueados.)

O esvaziamento do cache de hosts tem esses efeitos:

* Limpa o cache de hosts na memória.
* Remove todas as linhas da tabela do Schema de Desempenho `host_cache` que exibem o conteúdo do cache.

* Desbloqueia quaisquer hosts bloqueados. Isso permite que novas tentativas de conexão desses hosts sejam feitas.

Para esvaziar o cache de hosts, use um dos seguintes métodos:

* Altere o valor da variável de sistema `host_cache_size`. Isso requer o privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio desatualizado `SUPER`).

* Execute uma instrução `TRUNCATE TABLE` que truncá a tabela do Schema de Desempenho `host_cache`. Isso requer o privilégio `DROP` para a tabela.

* Execute o comando **mysqladmin flush-hosts**. Isso requer o privilégio `DROP` para a tabela do Schema de Desempenho `host_cache` ou o privilégio `RELOAD`.

##### Como lidar com hosts bloqueados

O servidor usa o cache de hosts para rastrear erros que ocorrem durante o processo de conexão do cliente. Se o seguinte erro ocorrer, isso significa que o **mysqld** recebeu muitas solicitações de conexão do host dado que foram interrompidas no meio:

```
Host 'host_name' is blocked because of many connection errors.
Unblock with 'mysqladmin flush-hosts'
```

O valor da variável de sistema `max_connect_errors` determina quantos pedidos de conexão interrompidos consecutivos o servidor permite antes de bloquear um host. Após `max_connect_errors` falhar em pedidos sem uma conexão bem-sucedida, o servidor assume que algo está errado (por exemplo, que alguém está tentando invadir), e bloqueia o host de novas solicitações de conexão.

Para desbloquear hosts bloqueados, esvazie o cache de hosts; veja Esvaziar o Cache de Hosts.

Como alternativa, para evitar que a mensagem de erro ocorra, defina `max_connect_errors` conforme descrito na Configuração do Cache do Host. O valor padrão de `max_connect_errors` é 100. Aumentar `max_connect_errors` para um valor grande torna menos provável que um host atinja o limite e seja bloqueado. No entanto, se a mensagem de erro "O host 'host_name' está bloqueado" ocorrer, primeiro verifique se não há problemas com as conexões TCP/IP dos hosts bloqueados. Não adianta aumentar o valor de `max_connect_errors` se houver problemas de rede.