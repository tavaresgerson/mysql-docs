#### 16.3.1.3 Fazendo Backup de um Source ou Replica Tornando-o Read Only

É possível fazer backup de servidores Source ou Replica em uma configuração de replicação adquirindo um global read lock e manipulando a variável de sistema [`read_only`](server-system-variables.html#sysvar_read_only) para alterar o estado read-only do servidor onde o backup será realizado:

1. Torne o servidor read-only, para que ele processe apenas recuperações (retrievals) e bloqueie updates.

2. Execute o backup.
3. Retorne o servidor ao seu estado normal de leitura/escrita (read/write).

Note

As instruções nesta seção colocam o servidor para backup em um estado que é seguro para métodos de backup que obtêm os dados do servidor, como o [**mysqldump**] (veja [Section 4.5.4, “mysqldump — A Database Backup Program”]). Você não deve tentar usar estas instruções para fazer um backup binário copiando arquivos diretamente, pois o servidor ainda pode ter dados modificados em cache na memória (in memory) e não ter sido descarregado para o disco (flushed to disk).

As instruções a seguir descrevem como fazer isso para um servidor Source e para um servidor Replica. Para ambos os cenários discutidos aqui, suponha que você tenha a seguinte configuração de replicação:

* Um servidor Source S1
* Um servidor Replica R1 que tem S1 como seu Source
* Um cliente C1 conectado a S1
* Um cliente C2 conectado a R1

Em ambos os cenários, as instruções para adquirir o global read lock e manipular a variável [`read_only`](server-system-variables.html#sysvar_read_only) são executadas no servidor onde o backup será realizado e não se propagam para quaisquer Replicas desse servidor.

**Cenário 1: Backup com um Source Read-Only**

Coloque o Source S1 em um estado read-only executando estas instruções nele:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto S1 estiver em um estado read-only, as seguintes propriedades são verdadeiras:

* Requisições de updates enviadas por C1 para S1 bloqueiam porque o servidor está no modo read-only.

* Requisições de resultados de Query enviadas por C1 para S1 são bem-sucedidas.
* Fazer um backup em S1 é seguro.
* Fazer um backup em R1 não é seguro. Este servidor ainda está em execução e pode estar processando o binary log ou requisições de update provenientes do cliente C2.

Enquanto S1 estiver read only, execute o backup. Por exemplo, você pode usar o [**mysqldump**].

Após a operação de backup em S1 ser concluída, restaure S1 ao seu estado operacional normal executando estas instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Embora realizar o backup em S1 seja seguro (no que diz respeito ao backup), não é ideal para o desempenho porque os clientes de S1 são impedidos de executar updates.

Esta estratégia se aplica ao backup de um servidor Source em uma configuração de replicação, mas também pode ser usada para um único servidor em uma configuração sem replicação.

**Cenário 2: Backup com um Replica Read-Only**

Coloque o Replica R1 em um estado read-only executando estas instruções nele:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto R1 estiver em um estado read-only, as seguintes propriedades são verdadeiras:

* O Source S1 continua a operar, então fazer um backup no Source não é seguro.

* O Replica R1 é interrompido (stopped), então fazer um backup no Replica R1 é seguro.

Essas propriedades fornecem a base para um cenário de backup popular: Ter um Replica ocupado executando um backup por um tempo não é um problema porque isso não afeta toda a rede, e o sistema ainda está em execução durante o backup. Em particular, os clientes ainda podem executar updates no servidor Source, que permanece inalterado pela atividade de backup no Replica.

Enquanto R1 estiver read only, execute o backup. Por exemplo, você pode usar o [**mysqldump**].

Após a operação de backup em R1 ser concluída, restaure R1 ao seu estado operacional normal executando estas instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Depois que o Replica é restaurado à operação normal, ele sincroniza novamente com o Source, alcançando quaisquer updates pendentes (outstanding updates) do binary log do Source.