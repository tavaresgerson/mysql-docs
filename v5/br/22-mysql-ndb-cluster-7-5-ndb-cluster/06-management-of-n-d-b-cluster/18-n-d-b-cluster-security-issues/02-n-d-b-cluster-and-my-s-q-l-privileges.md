#### 21.6.18.2 NDB Cluster e Privilégios MySQL

Nesta seção, discutimos como o sistema de privilégios MySQL funciona em relação ao NDB Cluster e as implicações disso para manter um NDB Cluster seguro.

Privilégios padrão do MySQL se aplicam às tabelas do NDB Cluster. Isso inclui todos os tipos de privilégio MySQL (privilégio [`SELECT`](privileges-provided.html#priv_select), privilégio [`UPDATE`](privileges-provided.html#priv_update), privilégio [`DELETE`](privileges-provided.html#priv_delete) e assim por diante) concedidos no nível do Database, tabela e coluna. Assim como em qualquer outro MySQL Server, as informações de usuário e privilégios são armazenadas no system Database `mysql`. As instruções SQL usadas para conceder e revogar privilégios em tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), Databases que contêm tais tabelas e colunas dentro dessas tabelas são idênticas em todos os aspectos às instruções [`GRANT`](grant.html "13.7.1.4 GRANT Statement") e [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") usadas em conexão com objetos de Database que envolvem qualquer (outro) storage engine MySQL. O mesmo se aplica às instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") e [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement").

É importante ter em mente que, por padrão, as tabelas de concessão (grant tables) do MySQL usam o storage engine [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"). Por causa disso, essas tabelas normalmente não são duplicadas ou compartilhadas entre os MySQL Servers que atuam como SQL nodes em um NDB Cluster. Em outras palavras, as alterações nos usuários e seus privilégios não se propagam automaticamente entre os SQL nodes por padrão. Se desejar, você pode habilitar a distribuição automática de usuários e privilégios MySQL entre os SQL nodes do NDB Cluster; veja [Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables"), para detalhes.

Por outro lado, como não há como negar privilégios no MySQL (privilégios podem ser revogados ou não concedidos em primeiro lugar, mas não negados como tal), não há proteção especial para tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") em um SQL node contra usuários que possuem privilégios em outro SQL node. (Isso é verdade mesmo que você não esteja usando a distribuição automática de privilégios de usuário). O exemplo definitivo disso é a conta `root` do MySQL, que pode executar qualquer ação em qualquer objeto de Database. Em combinação com seções `[mysqld]` ou `[api]` vazias no arquivo `config.ini`, esta conta pode ser especialmente perigosa. Para entender o porquê, considere o seguinte cenário:

* O arquivo `config.ini` contém pelo menos uma seção `[mysqld]` ou `[api]` vazia. Isso significa que o management server do NDB Cluster não realiza nenhuma verificação do host a partir do qual um MySQL Server (ou outro API node) acessa o NDB Cluster.

* Não há firewall, ou o firewall falha em proteger contra acesso ao NDB Cluster a partir de hosts externos à rede.

* O nome do host ou o endereço IP do management server do NDB Cluster é conhecido ou pode ser determinado de fora da rede.

Se essas condições forem verdadeiras, qualquer pessoa, em qualquer lugar, pode iniciar um MySQL Server com [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) [`--ndb-connectstring=management_host`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) e acessar este NDB Cluster. Usando a conta `root` do MySQL, essa pessoa pode então executar as seguintes ações:

* Executar instruções de metadados, como a instrução [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") (para obter uma lista de todos os Databases [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") no server) ou a instrução [`SHOW TABLES FROM some_ndb_database`](show-tables.html "13.7.5.37 SHOW TABLES Statement") para obter uma lista de todas as tabelas [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") em um determinado Database.

* Executar quaisquer instruções MySQL válidas em qualquer uma das tabelas descobertas, tais como:

  + `SELECT * FROM some_table` para ler todos os dados de qualquer tabela.

  + `DELETE FROM some_table` para excluir todos os dados de uma tabela.

  + `DESCRIBE some_table` ou `SHOW CREATE TABLE some_table` para determinar o schema da tabela.

  + `UPDATE some_table SET column1 = some_value` para preencher uma coluna da tabela com dados “lixo”; isso pode realmente causar danos muito maiores do que simplesmente excluir todos os dados.

    Variações mais insidiosas podem incluir instruções como estas:

    ```sql
    UPDATE some_table SET an_int_column = an_int_column + 1
    ```

    ou

    ```sql
    UPDATE some_table SET a_varchar_column = REVERSE(a_varchar_column)
    ```

    Tais instruções maliciosas são limitadas apenas pela imaginação do atacante.

  As únicas tabelas que estariam a salvo desse tipo de caos seriam aquelas criadas usando storage engines diferentes de [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") e, portanto, não visíveis para um SQL node “invasor” (rogue).

  Um usuário que pode fazer login como `root` também pode acessar o Database `INFORMATION_SCHEMA` e suas tabelas, obtendo assim informações sobre Databases, tabelas, stored routines, scheduled events e quaisquer outros objetos de Database para os quais os metadados são armazenados em `INFORMATION_SCHEMA`.

  Também é uma excelente ideia usar senhas diferentes para as contas `root` em diferentes SQL nodes do NDB Cluster, a menos que você esteja usando privilégios distribuídos.

Em resumo, você não pode ter um NDB Cluster seguro se ele for acessível diretamente de fora de sua rede local.

Importante

*Nunca deixe a senha da conta `root` do MySQL vazia*. Isso é tão verdadeiro ao executar o MySQL como um SQL node do NDB Cluster quanto ao executá-lo como um MySQL Server standalone (não Cluster), e deve ser feito como parte do processo de instalação do MySQL antes de configurar o MySQL Server como um SQL node em um NDB Cluster.

Se você deseja empregar os recursos de privilégio distribuído do NDB Cluster, você não deve simplesmente converter manualmente as tabelas de sistema no Database `mysql` para usar o storage engine [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). Em vez disso, use a stored procedure fornecida para essa finalidade; veja [Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables").

Caso contrário, se você precisar sincronizar as tabelas de sistema `mysql` entre SQL nodes, você pode usar a Replication padrão do MySQL para isso, ou empregar um script para copiar entradas de tabela entre os MySQL Servers.

**Resumo.** Os pontos mais importantes a serem lembrados sobre o sistema de privilégios MySQL em relação ao NDB Cluster estão listados aqui:

1. Usuários e privilégios estabelecidos em um SQL node não existem ou não entram em vigor automaticamente em outros SQL nodes no Cluster. Inversamente, remover um usuário ou privilégio em um SQL node no Cluster não remove o usuário ou privilégio de quaisquer outros SQL nodes.

2. Você pode distribuir usuários e privilégios MySQL entre SQL nodes usando o script SQL, e as stored procedures que ele contém, que são fornecidos para essa finalidade na distribuição do NDB Cluster.

3. Uma vez que um usuário MySQL recebe privilégios em uma tabela [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") a partir de um SQL node em um NDB Cluster, esse usuário pode “ver” quaisquer dados nessa tabela, independentemente do SQL node de onde os dados se originaram, mesmo que você não esteja usando a distribuição de privilégios.