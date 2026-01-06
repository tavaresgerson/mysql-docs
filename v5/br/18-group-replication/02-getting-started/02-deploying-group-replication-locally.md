### 17.2.2 Implantação da Replicação em Grupo Localmente

A maneira mais comum de implementar a Replicação em Grupo é usando várias instâncias de servidor, para fornecer alta disponibilidade. Também é possível implementar a Replicação em Grupo localmente, por exemplo, para fins de teste. Esta seção explica como você pode implementar a Replicação em Grupo localmente.

Importante

A replicação em grupo é geralmente implantada em vários hosts, pois isso garante a alta disponibilidade. As instruções nesta seção não são adequadas para implantações em produção, pois todas as instâncias do servidor MySQL estão em um único host. Em caso de falha deste host, todo o grupo falha. Portanto, essas informações devem ser usadas para fins de teste e não devem ser usadas em ambientes de produção.

Esta seção explica como criar um grupo de replicação com três instâncias do MySQL Server em uma única máquina física. Isso significa que são necessários três diretórios de dados, um por instância do servidor, e que você precisa configurar cada instância de forma independente. Este procedimento assume que o MySQL Server foi baixado e descompactado - no diretório denominado `mysql-5.7`. Cada instância do servidor MySQL requer um diretório de dados específico. Crie um diretório denominado `data`, em seguida, nesse diretório crie um subdiretório para cada instância do servidor, por exemplo, s1, s2 e s3, e inicie cada um.

```sql
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s1
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s2
mysql-5.7/bin/mysqld --initialize-insecure --basedir=$PWD/mysql-5.7 --datadir=$PWD/data/s3
```

Dentro de `data/s1`, `data/s2` e `data/s3`, há um diretório de dados inicializado, contendo o banco de dados do sistema MySQL e tabelas relacionadas, entre outros. Para saber mais sobre o procedimento de inicialização, consulte Seção 2.9.1, “Inicializando o Diretório de Dados”.

Aviso

Não use `-initialize-insecure` em ambientes de produção, ele é usado apenas aqui para simplificar o tutorial. Para mais informações sobre as configurações de segurança, consulte Seção 17.6, “Segurança da Replicação por Grupo”.

#### Configuração de membros da replicação de grupo local

Ao seguir Seção 17.2.1.2, “Configurando uma Instância para Replicação em Grupo”, você precisa adicionar a configuração para os diretórios de dados adicionados na seção anterior. Por exemplo:

```sql
[mysqld]

# server configuration
datadir=<full_path_to_data>/data/s1
basedir=<full_path_to_bin>/mysql-8.0/

port=24801
socket=<full_path_to_sock_dir>/s1.sock
```

Essas configurações configuram o servidor MySQL para usar o diretório de dados criado anteriormente e a porta que o servidor deve abrir e começar a ouvir conexões de entrada.

Nota

O porto não padrão de 24801 é usado porque, neste tutorial, as três instâncias do servidor usam o mesmo nome de host. Em uma configuração com três máquinas diferentes, isso não seria necessário.

A replicação em grupo requer uma conexão de rede entre os membros, o que significa que cada membro deve ser capaz de resolver o endereço de rede de todos os outros membros. Por exemplo, neste tutorial, todas as três instâncias estão em uma única máquina, então, para garantir que os membros possam se comunicar, você pode adicionar uma linha ao arquivo de opções, como `report_host=127.0.0.1`.

Então, cada membro precisa ser capaz de se conectar aos outros membros em seu `group_replication_local_address`. Por exemplo, no arquivo de opções do membro s1, adicione:

```sql
group_replication_local_address= "127.0.0.1:24901"
group_replication_group_seeds= "127.0.0.1:24901,127.0.0.1:24902,127.0.0.1:24903"
```

Isso configura o s1 para usar a porta 24901 para comunicação interna de grupo com os membros da semente. Para cada instância do servidor que você deseja adicionar ao grupo, faça essas alterações no arquivo de opções do membro. Para cada membro, você deve garantir que um endereço único seja especificado, então use uma porta única por instância para `group_replication_local_address`. Geralmente, você deseja que todos os membros possam atuar como sementes para membros que estão se juntando ao grupo e não receberam as transações processadas pelo grupo. Nesse caso, adicione todas as portas ao `group_replication_group_seeds` conforme mostrado acima.

Os passos restantes da Seção 17.2.1, “Implementando a Replicação em Grupo no Modo de Primárias Únicas” se aplicam igualmente a um grupo que você tenha implementado localmente dessa maneira.
