#### 15.8.2.1 Criando uma Tabela FEDERATED Usando CONNECTION

Para usar o primeiro método, você deve especificar a string `CONNECTION` após o tipo de ENGINE em uma instrução `CREATE TABLE`. Por exemplo:

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

`CONNECTION` substitui o `COMMENT` usado em algumas versões anteriores do MySQL.

A string `CONNECTION` contém as informações necessárias para se conectar ao servidor remoto que contém a tabela usada para o armazenamento físico dos dados. A string de conexão especifica o nome do servidor, as credenciais de login, o número da porta (*port number*) e as informações de Database/tabela. No exemplo, a tabela remota está no servidor `remote_host`, usando a porta 9306. O nome e o número da porta devem corresponder ao *host name* (ou endereço IP) e ao *port number* da instância remota do servidor MySQL que você deseja usar como sua tabela remota.

O formato da string de conexão é o seguinte:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

Onde:

* *`scheme`*: Um protocolo de conexão reconhecido. Somente `mysql` é suportado como valor de *`scheme`* neste momento.

* *`user_name`*: O nome de usuário para a conexão. Este usuário deve ter sido criado no servidor remoto e deve ter privilégios adequados para executar as ações necessárias (`SELECT`, `INSERT`, `UPDATE`, e assim por diante) na tabela remota.

* *`password`*: (Opcional) A *password* correspondente para *`user_name`*.

* *`host_name`*: O *host name* ou endereço IP do servidor remoto.

* *`port_num`*: (Opcional) O *port number* para o servidor remoto. O padrão é 3306.

* *`db_name`*: O nome da Database que contém a tabela remota.

* *`tbl_name`*: O nome da tabela remota. O nome da tabela local e da tabela remota não precisam ser iguais (*match*).

Exemplos de strings de conexão:

```sql
CONNECTION='mysql://username:password@hostname:port/database/tablename'
CONNECTION='mysql://username@hostname/database/tablename'
CONNECTION='mysql://username:password@hostname/database/tablename'
```