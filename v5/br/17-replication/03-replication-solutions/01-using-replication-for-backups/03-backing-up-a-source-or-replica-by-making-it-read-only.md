#### 16.3.1.3 Fazer backup de uma fonte ou réplica tornando-a apenas de leitura

É possível fazer backup de servidores de origem ou replica em uma configuração de replicação ao adquirir um bloqueio de leitura global e manipular a variável de sistema `read_only` para alterar o estado de leitura somente do servidor que será feito backup:

1. Torne o servidor somente de leitura, para que ele processe apenas recuperações e bloqueie atualizações.

2. Realize o backup.

3. Volte o servidor ao seu estado normal de leitura/escrita.

Nota

As instruções nesta seção colocam o servidor para ser protegido em um estado seguro para métodos de backup que obtêm os dados do servidor, como **mysqldump** (veja Seção 4.5.4, “mysqldump — Um Programa de Backup de Banco de Dados”). Você não deve tentar usar essas instruções para fazer um backup binário copiando arquivos diretamente, pois o servidor ainda pode ter dados modificados armazenados na memória e não descarregados no disco.

As instruções a seguir descrevem como fazer isso para um servidor fonte e para um servidor replica. Para ambos os cenários discutidos aqui, vamos supor que você tenha a seguinte configuração de replicação:

- Um servidor fonte S1
- Um servidor de replicação R1 que tem S1 como sua fonte
- Um cliente C1 conectado a S1
- Um cliente C2 conectado a R1

Em qualquer um dos cenários, as declarações para adquirir o bloqueio de leitura global e manipular a variável `read_only` são realizadas no servidor que está sendo protegido e não se propagam para nenhuma réplica desse servidor.

**Cenário 1: Backup com uma Fonte Apenas de Leitura**

Coloque o arquivo de origem S1 em estado de leitura somente executando essas instruções nele:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o S1 estiver no estado de leitura somente, as seguintes propriedades serão verdadeiras:

- Solicitações de atualizações enviadas pelo C1 para o bloco S1 porque o servidor está no modo de leitura somente.

- As solicitações de resultados de consulta enviadas pelo C1 para o S1 têm sucesso.

- Fazer um backup no S1 é seguro.

- Fazer um backup no R1 não é seguro. Esse servidor ainda está em execução e pode estar processando o log binário ou solicitações de atualização vindas do cliente C2.

Embora o S1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no S1 ser concluída, restaure o S1 ao seu estado operacional normal, executando as seguintes instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Embora a realização do backup no S1 seja segura (no que diz respeito ao backup), não é otimizada para o desempenho, pois os clientes do S1 são bloqueados de executarem atualizações.

Essa estratégia se aplica ao fazer backup de um servidor fonte em uma configuração de replicação, mas também pode ser usada para um único servidor em uma configuração sem replicação.

**Cenário 2: Backup com uma Replicação Apenas de Leitura**

Coloque a réplica R1 em um estado de leitura somente executando essas instruções nela:

```sql
mysql> FLUSH TABLES WITH READ LOCK;
mysql> SET GLOBAL read_only = ON;
```

Enquanto o R1 estiver no estado de leitura somente, as seguintes propriedades serão verdadeiras:

- A fonte S1 continua em operação, portanto, fazer um backup na fonte não é seguro.

- A réplica R1 está parada, então fazer um backup na réplica R1 é seguro.

Essas propriedades fornecem a base para um cenário de backup popular: ter uma replica ocupada realizando um backup por um tempo não é um problema, pois isso não afeta toda a rede, e o sistema ainda está em execução durante o backup. Em particular, os clientes ainda podem realizar atualizações no servidor de origem, que permanece não afetado pela atividade de backup na replica.

Embora o R1 seja apenas de leitura, realize o backup. Por exemplo, você pode usar **mysqldump**.

Após a operação de backup no R1 ser concluída, restaure o R1 ao seu estado operacional normal, executando as seguintes instruções:

```sql
mysql> SET GLOBAL read_only = OFF;
mysql> UNLOCK TABLES;
```

Depois que a réplica é restaurada ao funcionamento normal, ela se sincroniza novamente com a fonte, recuperando quaisquer atualizações pendentes do log binário da fonte.
