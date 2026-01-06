#### 21.6.18.2 NDB Cluster e privilégios do MySQL

Nesta seção, discutimos como o sistema de privilégios do MySQL funciona em relação ao NDB Cluster e as implicações disso para manter o NDB Cluster seguro.

Os privilégios padrão do MySQL são aplicados às tabelas do NDB Cluster. Isso inclui todos os tipos de privilégios do MySQL (\[privilégios fornecidos.html#priv\_select] privilégio, \[atualizar]\(privilégios fornecidos.html#priv\_update) privilégio, \[deletar]\(privilégios fornecidos.html#priv\_delete) privilégio, e assim por diante) concedidos no nível de banco de dados, tabela e coluna. Como em qualquer outro servidor MySQL, as informações de usuário e privilégios são armazenadas no banco de dados do sistema `mysql`. As instruções SQL usadas para conceder e revogar privilégios em tabelas de `NDB`, bancos que contêm tais tabelas e colunas dentro dessas tabelas são idênticas em todos os aspectos com as instruções `GRANT` e `REVOKE` usadas em conexão com objetos de banco de dados envolvendo qualquer (outro) motor de armazenamento MySQL. A mesma coisa é verdadeira em relação às instruções `CREATE USER` e `DROP USER`.

É importante ter em mente que, por padrão, as tabelas de concessão do MySQL usam o mecanismo de armazenamento `MyISAM`. Por isso, essas tabelas normalmente não são duplicadas ou compartilhadas entre os servidores MySQL que atuam como nós SQL em um NDB Cluster. Em outras palavras, as alterações nos usuários e seus privilégios não se propagam automaticamente entre os nós SQL por padrão. Se desejar, você pode habilitar a distribuição automática de usuários e privilégios do MySQL entre os nós SQL do NDB Cluster; consulte Seção 21.6.13, “Privilégios Distribuídos Usando Tabelas de Concessão Compartilhadas” para obter detalhes.

Por outro lado, como não há como negar privilégios no MySQL (os privilégios podem ser revogados ou não concedidos em primeiro lugar, mas não negados como tal), não há proteção especial para as tabelas de `NDB` em um nó SQL de usuários que têm privilégios em outro nó SQL; (Isto é verdade mesmo que você não esteja usando a distribuição automática de privilégios de usuário. O exemplo definitivo disso é a conta `root` do MySQL, que pode realizar qualquer ação em qualquer objeto de banco de dados. Em combinação com as seções `[mysqld]` ou `[api]` vazias do arquivo `config.ini`, essa conta pode ser especialmente perigosa. Para entender por quê, considere o seguinte cenário:

- O arquivo `config.ini` contém pelo menos uma seção `[mysqld]` ou `[api]` vazia. Isso significa que o servidor de gerenciamento do NDB Cluster não realiza nenhuma verificação do host a partir do qual um servidor MySQL (ou outro nó da API) acessa o NDB Cluster.

- Não há firewall, ou o firewall não consegue proteger contra o acesso ao NDB Cluster de hosts externos à rede.

- O nome do host ou o endereço IP do servidor de gerenciamento do NDB Cluster é conhecido ou pode ser determinado fora da rede.

Se essas condições forem verdadeiras, qualquer pessoa, em qualquer lugar, pode iniciar um servidor MySQL com `--ndbcluster` `--ndb-connectstring=management_host` e acessar o NDB Cluster. Usando a conta `root` do MySQL, essa pessoa pode então realizar as seguintes ações:

- Execute declarações de metadados, como a declaração `SHOW DATABASES` (para obter uma lista de todas as bases de dados `NDB` no servidor) ou a declaração `SHOW TABLES FROM some_ndb_database` para obter uma lista de todas as tabelas `NDB` em uma determinada base de dados

- Execute quaisquer declarações legais do MySQL em qualquer uma das tabelas descobertas, como:

  - `SELECT * FROM alguma_tabela` para ler todos os dados de qualquer tabela

  - `DELETE FROM alguma_tabela` para excluir todos os dados de uma tabela

  - Use `DESCRIBE alguma_tabela` ou `SHOW CREATE TABLE alguma_tabela` para determinar o esquema da tabela

  - `UPDATE some_table SET column1 = some_value` para preencher uma coluna de uma tabela com dados "lixo"; isso pode causar danos muito maiores do que simplesmente excluir todos os dados

    Variantes mais subversivas podem incluir declarações como essas:

    ```sql
    UPDATE some_table SET an_int_column = an_int_column + 1
    ```

    ou

    ```sql
    UPDATE some_table SET a_varchar_column = REVERSE(a_varchar_column)
    ```

    Tais declarações maliciosas são limitadas apenas pela imaginação do agressor.

  As únicas tabelas que estariam seguras desse tipo de caos seriam aquelas criadas usando motores de armazenamento diferentes de `NDB`, e, portanto, não seriam visíveis para um nó SQL "vilão".

  Um usuário que conseguir fazer login como `root` também pode acessar o banco de dados `INFORMATION_SCHEMA` e suas tabelas, e assim obter informações sobre bancos de dados, tabelas, rotinas armazenadas, eventos agendados e quaisquer outros objetos do banco de dados para os quais os metadados estão armazenados no `INFORMATION_SCHEMA`.

  Também é uma ótima ideia usar senhas diferentes para as contas `root` em diferentes nós do NDB Cluster SQL, a menos que você esteja usando privilégios distribuídos.

Em resumo, você não pode ter um NDB Cluster seguro se ele estiver diretamente acessível de fora da sua rede local.

Importante

*Nunca deixe a senha da conta raiz do MySQL em branco*. Isso é igualmente verdadeiro ao executar o MySQL como um nó SQL do NDB Cluster, assim como ao executá-lo como um servidor MySQL autônomo (não Cluster), e deve ser feito como parte do processo de instalação do MySQL antes de configurar o servidor MySQL como um nó SQL em um NDB Cluster.

Se você deseja utilizar as capacidades de privilégios distribuídos do NDB Cluster, não deve simplesmente converter as tabelas do sistema no banco de dados `mysql` para usar o mecanismo de armazenamento `NDB` manualmente. Use o procedimento armazenado fornecido para esse propósito; veja Seção 21.6.13, “Privilégios Distribuídos Usando Tabelas de Concessão Compartilhadas”.

Caso contrário, se você precisar sincronizar as tabelas do sistema `mysql` entre os nós SQL, você pode usar a replicação padrão do MySQL para fazer isso ou usar um script para copiar as entradas das tabelas entre os servidores MySQL.

**Resumo.** Aqui estão listados os pontos mais importantes a serem lembrados sobre o sistema de privilégios do MySQL em relação ao NDB Cluster:

1. Os usuários e privilégios estabelecidos em um nó SQL não existem ou não têm efeito automaticamente em outros nós SQL do clúster. Por outro lado, a remoção de um usuário ou privilégio em um nó SQL do clúster não remove o usuário ou privilégio de quaisquer outros nós SQL.

2. Você pode distribuir usuários e privilégios do MySQL entre os nós SQL usando o script SQL e os procedimentos armazenados que ele contém, que são fornecidos para esse propósito na distribuição do NDB Cluster.

3. Uma vez que um usuário do MySQL receba privilégios em uma tabela `NDB` de um nó SQL em um NDB Cluster, esse usuário poderá "ver" qualquer dado naquela tabela, independentemente do nó SQL do qual os dados foram originados, mesmo que você não esteja usando a distribuição de privilégios.
