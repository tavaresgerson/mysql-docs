#### 19.4.1.3 Fazer backup de um servidor de origem ou replica fazendo-o somente leitura

É possível fazer backup de servidores de origem ou replica em uma configuração de replicação ao adquirir um bloqueio de leitura global e manipular a variável de sistema `read_only` para alterar o estado de leitura somente do servidor que será feito o backup:

1. Faça o servidor somente leitura, para que ele processe apenas recuperações e bloqueie atualizações.
2. Realize o backup.
3. Volte a alterar o servidor para seu estado normal de leitura/escrita.

Observação

As instruções nesta seção colocam o servidor que será feito o backup em um estado seguro para métodos de backup que obtêm os dados do servidor, como **mysqldump** (consulte a Seção 6.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”). Você não deve tentar usar essas instruções para fazer um backup binário copiando arquivos diretamente, pois o servidor ainda pode ter dados modificados cacheados na memória e não descarregados no disco.

As instruções a seguir descrevem como fazer isso para um servidor de origem e para uma replica. Para ambos os cenários discutidos aqui, suponha que você tenha a seguinte configuração de replicação:

* Um servidor de origem S1
* Um servidor replicador R1 que tem S1 como sua origem
* Um cliente C1 conectado a S1
* Um cliente C2 conectado a R1

Em qualquer cenário, as instruções para adquirir o bloqueio de leitura global e manipular a variável `read_only` são realizadas no servidor que será feito o backup e não se propagam para quaisquer replicas desse servidor.

**Cenário 1: Backup com uma Fonte Somente Leitura**

Coloque o servidor de origem S1 em um estado somente leitura executando essas instruções nele:

```
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto S1 estiver em um estado somente leitura, as seguintes propriedades serão verdadeiras:

* As solicitações de atualizações enviadas por C1 para S1 são bloqueadas porque o servidor está no modo somente leitura.

* As solicitações de resultados de consulta enviadas pelo C1 para o S1 têm sucesso.
* Fazer um backup no S1 é seguro.
* Fazer um backup no R1 não é seguro. Esse servidor ainda está em execução e pode estar processando o log binário ou solicitações de atualização vindas do cliente C2.

Embora o S1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no S1 ser concluída, restaure o S1 ao seu estado operacional normal, executando essas instruções:

```
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Embora realizar o backup no S1 seja seguro (no que diz respeito ao backup), não é ótimo para o desempenho, pois os clientes do S1 são bloqueados de executarem atualizações.

Essa estratégia se aplica ao fazer backup de uma fonte em uma configuração de replicação, mas também pode ser usada para um único servidor em um ambiente sem replicação.

**Cenário 2: Backup com uma Replica Apenas de Leitura**

Coloque a replica R1 em um estado de apenas leitura, executando essas instruções nela:

```
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o R1 estiver em estado de apenas leitura, as seguintes propriedades serão verdadeiras:

* A fonte S1 continua em operação, portanto, fazer um backup na fonte não é seguro.

* A replica R1 está parada, portanto, fazer um backup na replica R1 é seguro.

Essas propriedades fornecem a base para um cenário de backup popular: ter uma replica ocupada realizando um backup por um tempo não é um problema, pois não afeta toda a rede, e o sistema ainda está em execução durante o backup. Em particular, os clientes ainda podem realizar atualizações no servidor de origem, que permanece não afetado pela atividade de backup na replica.

Enquanto o R1 estiver apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no R1 ser concluída, restaure o R1 ao seu estado operacional normal, executando essas instruções:

```
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Depois que a réplica é restaurada ao funcionamento normal, ela se sincroniza novamente com a fonte, recuperando quaisquer atualizações pendentes do log binário da fonte.