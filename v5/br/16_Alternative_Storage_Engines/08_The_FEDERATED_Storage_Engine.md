## 15.8 O Motor de Armazenamento FEDERATED

O motor de armazenamento `FEDERATED` permite que você acesse dados de um banco de dados MySQL remoto sem usar replicação ou tecnologia de cluster. A consulta a uma tabela local `FEDERATED` extrai automaticamente os dados das tabelas remotas (federadas). Nenhum dado é armazenado nas tabelas locais.

Para incluir o motor de armazenamento `FEDERATED` se você construir o MySQL a partir do código-fonte, invoque o **CMake** com a opção `-DWITH_FEDERATED_STORAGE_ENGINE`.

O motor de armazenamento `FEDERATED` não é habilitado por padrão no servidor em execução; para habilitar o `FEDERATED`, você deve iniciar o binário do servidor MySQL usando a opção `--federated`.

Para examinar a fonte do motor `FEDERATED`, procure no diretório `storage/federated` de uma distribuição de fonte MySQL.

### 15.8.1 Visão Geral do Motor de Armazenamento FEDERATED

Quando você cria uma tabela usando um dos motores de armazenamento padrão (como `MyISAM`, `CSV` ou `InnoDB`), a tabela consiste na definição da tabela e nos dados associados. Quando você cria uma tabela `FEDERATED`, a definição da tabela é a mesma, mas o armazenamento físico dos dados é gerenciado em um servidor remoto.

Uma tabela `FEDERATED` é composta por dois elementos:

* Um servidor remoto* com uma tabela de banco de dados, que, por sua vez, consiste na definição da tabela (armazenada no arquivo `.frm`) e na tabela associada. O tipo de tabela do banco de dados remoto pode ser qualquer tipo suportado pelo servidor remoto `mysqld`, incluindo `MyISAM` ou `InnoDB`.

* Um * servidor local * com uma tabela de banco de dados, onde a definição da tabela corresponde à tabela correspondente no servidor remoto. A definição da tabela é armazenada dentro do arquivo `.frm`. No entanto, não há um arquivo de dados no servidor local. Em vez disso, a definição da tabela inclui uma string de conexão que aponta para a tabela remota.

Ao executar consultas e declarações em uma tabela `FEDERATED` no servidor local, as operações que normalmente inseririam, atualizassem ou excluiriam informações de um arquivo de dados local são, em vez disso, enviadas ao servidor remoto para execução, onde elas atualizam o arquivo de dados no servidor remoto ou retornam strings correspondentes do servidor remoto.

A estrutura básica de uma configuração de tabela `FEDERATED` é mostrada na Figura 15.2, “Estrutura da tabela FEDERATED”.

**Figura 15.2 Estrutura da tabela FEDERATED**

![Content is described in the surrounding text.](images/se-federated-structure.png)

Quando um cliente emite uma declaração SQL que se refere a uma tabela `FEDERATED`, o fluxo de informações entre o servidor local (onde a declaração SQL é executada) e o servidor remoto (onde os dados são armazenados fisicamente) é o seguinte:

1. O mecanismo de armazenamento examina cada coluna que a tabela `FEDERATED` possui e constrói uma declaração SQL apropriada que se refere à tabela remota.

2. A declaração é enviada ao servidor remoto usando a API do cliente MySQL.

3. O servidor remoto processa a declaração e o servidor local recupera qualquer resultado que a declaração produza (um contador de strings afetadas ou um conjunto de resultados).

4. Se a declaração produzir um conjunto de resultados, cada coluna é convertida para o formato do motor de armazenamento interno que o motor `FEDERATED` espera e pode usar para exibir o resultado ao cliente que emitiu a declaração original.

O servidor local comunica-se com o servidor remoto usando as funções do cliente C da MySQL. Ele invoca `mysql_real_query()` para enviar a declaração. Para ler um conjunto de resultados, ele usa `mysql_store_result()` e obtém strings uma de cada vez usando `mysql_fetch_row()`.

### 15.8.2 Como criar tabelas FEDERATED

Para criar uma tabela `FEDERATED`, você deve seguir estes passos:

1. Crie a tabela no servidor remoto. Alternativamente, anote a definição da tabela de uma tabela existente, talvez usando a declaração `SHOW CREATE TABLE`.

2. Crie a tabela no servidor local com uma definição de tabela idêntica, mas adicione as informações de conexão que ligam a tabela local à tabela remota.

Por exemplo, você pode criar a tabela a seguir no servidor remoto:

```sql
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=MyISAM
DEFAULT CHARSET=latin1;
```

Para criar a tabela local a ser federada à tabela remota, existem duas opções disponíveis. Você pode criar a tabela local e especificar a string de conexão (contendo o nome do servidor, login e senha) a ser usada para se conectar à tabela remota usando o `CONNECTION`, ou você pode usar uma conexão existente que você criou anteriormente usando a declaração `CREATE SERVER`.

Importante

Quando você cria a tabela local, ela *deve* ter uma definição de campo idêntica à da tabela remota.

Nota

Você pode melhorar o desempenho de uma tabela `FEDERATED` adicionando índices à tabela no host. A otimização ocorre porque a consulta enviada ao servidor remoto inclui o conteúdo da cláusula `WHERE`, e é enviada ao servidor remoto e, posteriormente, executada localmente. Isso reduz o tráfego de rede que, de outra forma, solicitaria toda a tabela do servidor para processamento local.

#### 15.8.2.1 Criando uma Tabela FEDERATED Usando CONEXÃO

Para usar o primeiro método, você deve especificar a string `CONNECTION` após o tipo de motor em uma declaração `CREATE TABLE`. Por exemplo:

```sql
CREATE TABLE federated_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=latin1
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

Nota

`CONNECTION` substitui o `COMMENT` utilizado em algumas versões anteriores do MySQL.

A string `CONNECTION` contém as informações necessárias para se conectar ao servidor remoto que contém a tabela usada para armazenamento físico dos dados. A string de conexão especifica o nome do servidor, as credenciais de login, o número de porta e as informações da base de dados/tabela. No exemplo, a tabela remota está no servidor `remote_host`, usando a porta

9306. O nome e o número do porto devem corresponder ao nome do host (ou endereço IP) e ao número do porto da instância do servidor MySQL remoto que você deseja usar como sua tabela remota.

O formato da cadeia de conexão é o seguinte:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

Onde:

* *`scheme`*: Um protocolo de conexão reconhecido. Apenas `mysql` é suportado como o valor *`scheme`* neste ponto.

* *`user_name`*: O nome do usuário para a conexão. Este usuário deve ter sido criado no servidor remoto e deve ter privilégios adequados para realizar as ações necessárias (`SELECT`, `INSERT`, `UPDATE` e assim por diante) na tabela remota.

* *`password`*: (Opcional) A senha correspondente para *`user_name`*.

* *`host_name`*: O nome de domínio ou endereço IP do servidor remoto.

* *`port_num`*: (Opcional) O número de porta para o servidor remoto. O padrão é 3306.

* *`db_name`*: O nome do banco de dados que contém a tabela remota.

* *`tbl_name`*: O nome da tabela remota. O nome da tabela local e remota não precisam ser iguais.

Strings de conexão de exemplo:

```sql
CONNECTION='mysql://username:password@hostname:port/database/tablename'
CONNECTION='mysql://username@hostname/database/tablename'
CONNECTION='mysql://username:password@hostname/database/tablename'
```

#### 15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Se você está criando várias tabelas `FEDERATED` no mesmo servidor, ou se deseja simplificar o processo de criação de tabelas `FEDERATED`, pode usar a declaração `CREATE SERVER` para definir os parâmetros de conexão do servidor, assim como faria com a string `CONNECTION`.

O formato da declaração `CREATE SERVER` é:

```sql
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

O *`server_name` é usado na cadeia de conexão ao criar uma nova tabela `FEDERATED`.

Por exemplo, para criar uma conexão de servidor idêntica à string `CONNECTION`,:

```sql
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

Você usaria a seguinte declaração:

```sql
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

Para criar uma tabela `FEDERATED` que utilize essa conexão, você ainda usa a palavra-chave `CONNECTION`, mas especifique o nome que você usou na declaração `CREATE SERVER`.

```sql
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=latin1
CONNECTION='fedlink/test_table';
```

O nome da conexão neste exemplo contém o nome da conexão (`fedlink`) e o nome da tabela a ser vinculada, separados por uma barra. Se você especificar apenas o nome da conexão sem um nome de tabela, o nome da tabela da tabela local é usado em vez disso.

Para mais informações sobre `CREATE SERVER`(create-server.html "13.1.17 CREATE SERVER Statement"), consulte a Seção 13.1.17, “Instrução CREATE SERVER”.

A declaração `CREATE SERVER` aceita os mesmos argumentos que a string `CONNECTION`. A declaração `CREATE SERVER` atualiza as strings na tabela `mysql.servers`. Consulte a tabela a seguir para obter informações sobre a correspondência entre os parâmetros em uma string de conexão, as opções na declaração [`CREATE SERVER`(create-server.html "13.1.17 CREATE SERVER Statement") e as colunas na tabela `mysql.servers`. Para referência, o formato da string `CONNECTION` é o seguinte:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

<table summary="The correspondence between parameters in a connection string, options in the CREATE SERVER statement, and the columns in the mysql.servers table."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Description</th> <th><code>CONNECTION</code> string</th> <th><code>CREATE SERVER</code> option</th> <th><code>mysql.servers</code> column</th> </tr></thead><tbody><tr> <th>Connection scheme</th> <td><code>scheme</code></td> <td><code>wrapper_name</code></td> <td><code>Wrapper</code></td> </tr><tr> <th>Remote user</th> <td><code>user_name</code></td> <td><code>USER</code></td> <td><code>Username</code></td> </tr><tr> <th>Remote password</th> <td><code>password</code></td> <td><code>PASSWORD</code></td> <td><code>Password</code></td> </tr><tr> <th>Remote host</th> <td><code>host_name</code></td> <td><code>HOST</code></td> <td><code>Host</code></td> </tr><tr> <th>Remote port</th> <td><code>port_num</code></td> <td><code>PORT</code></td> <td><code>Port</code></td> </tr><tr> <th>Remote database</th> <td><code>db_name</code></td> <td><code>DATABASE</code></td> <td><code>Db</code></td> </tr></tbody></table>

### 15.8.3 Notas e dicas do mecanismo de armazenamento FEDERATED

Você deve estar ciente dos seguintes pontos ao usar o motor de armazenamento `FEDERATED`:

As tabelas `FEDERATED` podem ser replicadas para outros servidores replicados, mas você deve garantir que os servidores replicados sejam capazes de usar a combinação de usuário/senha definida na string `CONNECTION` (ou na string da tabela `mysql.servers` para se conectar ao servidor remoto.

Os itens a seguir indicam as funcionalidades que o motor de armazenamento `FEDERATED` suporta e as que não suporta:

* O servidor remoto deve ser um servidor MySQL. * A tabela remota a que uma tabela `FEDERATED` aponta *deve* existir antes de tentar acessar a tabela através da tabela `FEDERATED`.

* É possível que uma tabela `FEDERATED` aponte para outra, mas você deve ter cuidado para não criar um laço.

* Uma tabela `FEDERATED` não suporta índices no sentido usual; porque o acesso aos dados da tabela é gerenciado remotamente, é na verdade a tabela remota que faz uso de índices. Isso significa que, para uma consulta que não pode usar nenhum índice e, portanto, requer uma varredura completa da tabela, o servidor obtém todas as strings da tabela remota e as filtra localmente. Isso ocorre independentemente de qualquer `WHERE` ou `LIMIT` usado com esta declaração `SELECT`; essas cláusulas são aplicadas localmente às strings devolvidas.

As consultas que não utilizam índices podem, portanto, causar um desempenho ruim e sobrecarga na rede. Além disso, uma vez que as strings devolvidas devem ser armazenadas na memória, essa consulta também pode levar ao swap do servidor local, ou até mesmo ao bloqueio.

* Deve-se ter cuidado ao criar uma tabela `FEDERATED`, pois a definição do índice de uma tabela equivalente `MyISAM` ou outra tabela pode não ser suportada. Por exemplo, criar uma tabela `FEDERATED` com um prefixo de índice falha para as colunas `VARCHAR`, `TEXT` ou `BLOB`. A definição seguinte em `MyISAM` é válida:

  ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=MYISAM;
  ```

O prefixo chave neste exemplo é incompatível com o motor `FEDERATED`, e a declaração equivalente falha:

  ```sql
  CREATE TABLE `T1`(`A` VARCHAR(100),UNIQUE KEY(`A`(30))) ENGINE=FEDERATED
    CONNECTION='MYSQL://127.0.0.1:3306/TEST/T1';
  ```

Se possível, você deve tentar separar a definição da coluna e do índice ao criar tabelas tanto no servidor remoto quanto no servidor local para evitar esses problemas de índice.

* Internamente, a implementação utiliza `SELECT`, `INSERT`, `UPDATE` e `DELETE`, mas não `HANDLER`.

* O motor de armazenamento `FEDERATED` suporta `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE TABLE` e índices. Não suporta `ALTER TABLE`, ou quaisquer declarações de Linguagem de Definição de Dados que afetem diretamente a estrutura da tabela, exceto `DROP TABLE`. A implementação atual não utiliza declarações preparadas.

* `FEDERATED` aceita declarações `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), mas se ocorrer uma violação de chave duplicada, a declaração falha com um erro.

* As transações não são suportadas.
* `FEDERATED` realiza o tratamento de inserção em massa de forma que várias strings são enviadas para a tabela remota em um lote, o que melhora o desempenho. Além disso, se a tabela remota for transacional, permite que o motor de armazenamento remoto realize o rollback de declaração corretamente caso ocorra um erro. Essa capacidade tem as seguintes limitações:

+ O tamanho do inserto não pode exceder o tamanho máximo do pacote entre os servidores. Se o inserto exceder esse tamanho, ele é dividido em vários pacotes e o problema de rollback pode ocorrer.

O tratamento de inserção em massa não ocorre para `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

* Não há como o motor `FEDERATED` saber se a tabela remota mudou. A razão para isso é que essa tabela deve funcionar como um arquivo de dados que nunca seria escrito por nada além do sistema de banco de dados. A integridade dos dados na tabela local poderia ser violada se houvesse alguma mudança no banco de dados remoto.

* Ao usar uma string `CONNECTION`, não é possível usar o caractere '@' na senha. Você pode contornar essa limitação usando a declaração [[`CREATE SERVER`][(create-server.html "13.1.17 CREATE SERVER Statement")]] para criar uma conexão com o servidor.

* As opções `insert_id` e `timestamp` não são propagadas ao provedor de dados.

* Qualquer declaração `DROP TABLE` emitida contra uma tabela `FEDERATED` exclui apenas a tabela local, não a tabela remota.

* As tabelas `FEDERATED` não funcionam com o cache de consulta.

* A partição definida pelo usuário não é suportada para as tabelas `FEDERATED`.

### 15.8.4 Recursos do mecanismo de armazenamento FEDERATED

Os seguintes recursos adicionais estão disponíveis para o motor de armazenamento `FEDERATED`:

* Um fórum dedicado ao motor de armazenamento `FEDERATED` está disponível em <https://forums.mysql.com/list.php?105>.