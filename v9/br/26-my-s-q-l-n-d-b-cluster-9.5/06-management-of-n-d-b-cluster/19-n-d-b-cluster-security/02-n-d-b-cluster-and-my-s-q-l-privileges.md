#### 25.6.19.2 NDB Cluster e Permissões do MySQL

Nesta seção, discutimos como o sistema de permissões do MySQL funciona em relação ao NDB Cluster e as implicações disso para manter o NDB Cluster seguro.

Os privilégios padrão do MySQL se aplicam às tabelas do NDB Cluster. Isso inclui todos os tipos de privilégios do MySQL (`prerrogativa de SELECT`, `prerrogativa de UPDATE`, `prerrogativa de DELETE`, e assim por diante) concedidos no nível de banco de dados, tabela e coluna. Como em qualquer outro servidor MySQL, as informações de usuário e privilégios são armazenadas no banco de dados do sistema `mysql`. As instruções SQL usadas para conceder e revogar privilégios em tabelas `NDB`, bancos que contêm tais tabelas e colunas dentro dessas tabelas são idênticas em todos os aspectos com as instruções `GRANT` e `REVOKE` usadas em conexão com objetos de banco de dados envolvendo qualquer (outro) motor de armazenamento MySQL. A mesma coisa é verdadeira em relação às instruções `CREATE USER` e `DROP USER`.

É importante lembrar que, por padrão, as tabelas de concessão do MySQL usam o motor de armazenamento `InnoDB`. Por causa disso, essas tabelas normalmente não são duplicadas ou compartilhadas entre servidores MySQL que atuam como nós SQL em um NDB Cluster. Em outras palavras, as alterações em usuários e seus privilégios não se propagam automaticamente por padrão entre os nós SQL. Se desejar, você pode habilitar a sincronização de usuários e privilégios do MySQL entre os nós SQL do NDB Cluster; consulte a Seção 25.6.13, “Sincronização de Privilégios e NDB_STORED_USER”, para detalhes.

Por outro lado, como não há como negar privilégios no MySQL (os privilégios podem ser revogados ou não concedidos em primeiro lugar, mas não negados como tal), não há proteção especial para as tabelas `NDB` em um nó SQL contra usuários que têm privilégios em outro nó SQL; isso é verdade mesmo que você não esteja usando a distribuição automática de privilégios de usuário. O exemplo definitivo disso é a conta `root` do MySQL, que pode realizar qualquer ação em qualquer objeto de banco de dados. Em combinação com as seções vazias `[mysqld]` ou `[api]` do arquivo `config.ini`, essa conta pode ser especialmente perigosa. Para entender por quê, considere o seguinte cenário:

* O arquivo `config.ini` contém pelo menos uma seção vazia `[mysqld]` ou `[api]`. Isso significa que o servidor de gerenciamento do NDB Cluster não realiza verificação do host a partir do qual um Servidor MySQL (ou outro nó API) acessa o NDB Cluster.

* Não há firewall, ou o firewall falha em proteger contra o acesso ao NDB Cluster de hosts externos à rede.

* O nome do host ou o endereço IP do servidor de gerenciamento do NDB Cluster é conhecido ou pode ser determinado de fora da rede.

Se essas condições forem verdadeiras, então qualquer pessoa, em qualquer lugar, pode iniciar um Servidor MySQL com `--ndbcluster` `--ndb-connectstring=management_host` e acessar esse NDB Cluster. Usando a conta `root` do MySQL, essa pessoa pode então realizar as seguintes ações:

* Executar declarações de metadados, como a declaração `SHOW DATABASES` (para obter uma lista de todas as bases de dados `NDB` no servidor) ou a declaração `SHOW TABLES FROM some_ndb_database` (para obter uma lista de todas as tabelas `NDB` em uma determinada base de dados)

* Executar quaisquer declarações legais do MySQL em qualquer uma das tabelas descobertas, como:

  + `SELECT * FROM some_table` ou `TABLE some_table` para ler todos os dados de qualquer tabela


+ `DELETE FROM alguma_tabela` ou `TRUNCATE TABLE` para excluir todos os dados de uma tabela

+ `DESCRIBE alguma_tabela` ou `SHOW CREATE TABLE alguma_tabela` para determinar o esquema da tabela

+ `UPDATE alguma_tabela SET coluna1 = algum_valor` para preencher uma coluna de uma tabela com dados "lixo"; isso pode causar muito mais danos do que simplesmente excluir todos os dados

Variantes mais insidiosas podem incluir declarações como estas:

```
    UPDATE some_table SET an_int_column = an_int_column + 1
    ```

ou

```
    UPDATE some_table SET a_varchar_column = REVERSE(a_varchar_column)
    ```

Tais declarações maliciosas são limitadas apenas pela imaginação do atacante.

As únicas tabelas que seriam seguras desse tipo de caos seriam aquelas criadas usando motores de armazenamento diferentes do `NDB`, e, portanto, não visíveis para um nó SQL "rogue".

Um usuário que pode fazer login como `root` também pode acessar o banco de dados `INFORMATION_SCHEMA` e suas tabelas, e, assim, obter informações sobre bancos de dados, tabelas, rotinas armazenadas, eventos agendados e quaisquer outros objetos do banco de dados para os quais os metadados são armazenados no `INFORMATION_SCHEMA`.

Também é uma boa ideia usar senhas diferentes para as contas `root` nos diferentes nós SQL do NDB Cluster, a menos que você esteja usando privilégios compartilhados.

Em resumo, você não pode ter um NDB Cluster seguro se ele for diretamente acessível de fora da sua rede local.

Importante

*Nunca deixe a senha da conta `root` do MySQL em branco*. Isso é verdade tanto ao executar o MySQL como um nó SQL do NDB Cluster quanto ao executá-lo como um servidor MySQL autônomo (não Cluster), e deve ser feito como parte do processo de instalação do MySQL antes de configurar o servidor MySQL como um nó SQL em um NDB Cluster.

Se você precisar sincronizar as tabelas do sistema `mysql` entre os nós SQL, pode usar a replicação padrão do MySQL para fazer isso, ou usar um script para copiar as entradas das tabelas entre os servidores MySQL. Os usuários e seus privilégios podem ser compartilhados e mantidos sincronizados usando o privilégio `NDB_STORED_USER`.

**Resumo.** Os pontos mais importantes a serem lembrados sobre o sistema de privilégios MySQL em relação ao NDB Cluster estão listados aqui:

1. Os usuários e privilégios estabelecidos em um nó SQL não existem ou não têm efeito automaticamente em outros nós SQL do cluster. Por outro lado, remover um usuário ou privilégio em um nó SQL do cluster não remove o usuário ou privilégio de nenhum outro nó SQL.

2. Você pode compartilhar usuários e privilégios MySQL entre os nós SQL usando `NDB_STORED_USER`.

3. Uma vez que um usuário MySQL recebe privilégios em uma tabela `NDB` de um nó SQL em um NDB Cluster, esse usuário pode "ver" qualquer dado nessa tabela, independentemente do nó SQL do qual os dados vieram, mesmo que esse usuário não seja compartilhado.