### 17.2.2 Implantando o Group Replication Localmente

A maneira mais comum de implantar o Group Replication é usando múltiplas instâncias de *server*, para fornecer alta disponibilidade (*high availability*). Também é possível implantar o Group Replication localmente, por exemplo, para fins de teste. Esta seção explica como você pode implantar o Group Replication localmente.

Importante

O Group Replication é geralmente implantado em múltiplos *hosts* porque isso garante que a alta disponibilidade seja fornecida. As instruções nesta seção não são adequadas para implantações de produção porque todas as instâncias do MySQL server estão rodando no mesmo *host* único. No caso de falha deste *host*, todo o grupo falha. Portanto, esta informação deve ser usada para fins de teste e não deve ser usada em ambientes de produção.

Esta seção explica como criar um grupo de replicação com três instâncias do MySQL Server em uma máquina física. Isso significa que são necessários três *data directories*, um por instância de *server*, e que você precisa configurar cada instância independentemente. Este procedimento assume que o MySQL Server foi baixado e descompactado no diretório chamado `mysql-5.7`. Cada instância do MySQL server requer um *data directory* específico. Crie um diretório chamado `data`, e então, nesse diretório, crie um subdiretório para cada instância de *server*, por exemplo, s1, s2 e s3, e inicialize cada um.

```sql
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s1
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s2
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s3
```

Dentro de `data/s1`, `data/s2`, `data/s3` existe um *data directory* inicializado, contendo o *database* de sistema `mysql` e tabelas relacionadas e muito mais. Para saber mais sobre o procedimento de inicialização, consulte [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory").

Aviso

Não use `-initialize-insecure` em ambientes de produção; ele é usado aqui apenas para simplificar o tutorial. Para mais informações sobre configurações de segurança, consulte [Section 17.6, “Group Replication Security”](group-replication-security.html "17.6 Group Replication Security").

#### Configuração de Membros Locais do Group Replication

Ao seguir [Section 17.2.1.2, “Configuring an Instance for Group Replication”](group-replication-configuring-instances.html "17.2.1.2 Configuring an Instance for Group Replication"), você precisa adicionar a configuração para os *data directories* adicionados na seção anterior. Por exemplo:

```sql
[mysqld]

# server configuration
datadir=<full_path_to_data>/data/s1
basedir=<full_path_to_bin>/mysql-8.0/

port=24801
socket=<full_path_to_sock_dir>/s1.sock
```

Estas configurações definem o MySQL server para usar o *data directory* criado anteriormente e qual *port* o *server* deve abrir e começar a escutar por conexões de entrada.

Nota

O *port* não padrão de 24801 é usado porque, neste tutorial, as três instâncias do *server* utilizam o mesmo *hostname*. Em uma configuração com três máquinas diferentes, isso não seria necessário.

O Group Replication exige uma conexão de rede entre os membros, o que significa que cada membro deve ser capaz de resolver o endereço de rede de todos os outros membros. Por exemplo, neste tutorial, todas as três instâncias rodam em uma única máquina, então, para garantir que os membros possam se comunicar, você pode adicionar uma linha ao *option file* como [`report_host=127.0.0.1`](replication-options-replica.html#sysvar_report_host).

Em seguida, cada membro precisa ser capaz de se conectar aos outros membros em seus respectivos [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address). Por exemplo, no *option file* do membro s1, adicione:

```sql
group_replication_local_address= "127.0.0.1:24901"
group_replication_group_seeds= "127.0.0.1:24901,127.0.0.1:24902,127.0.0.1:24903"
```

Isso configura o s1 para usar o *port* 24901 para comunicação interna do grupo com os membros *seed*. Para cada instância de *server* que você deseja adicionar ao grupo, faça essas alterações no *option file* do membro. Para cada membro, você deve garantir que um endereço único seja especificado, portanto, use um *port* único por instância para [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address). Geralmente, você deseja que todos os membros possam servir como *seeds* para membros que estão entrando no grupo e que ainda não têm as transações processadas pelo grupo. Neste caso, adicione todos os *ports* a [`group_replication_group_seeds`](group-replication-system-variables.html#sysvar_group_replication_group_seeds), conforme mostrado acima.

As etapas restantes de [Section 17.2.1, “Deploying Group Replication in Single-Primary Mode”](group-replication-deploying-in-single-primary-mode.html "17.2.1 Deploying Group Replication in Single-Primary Mode") se aplicam da mesma forma a um grupo que você implantou localmente desta maneira.