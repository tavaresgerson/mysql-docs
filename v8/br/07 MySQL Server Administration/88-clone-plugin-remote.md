#### 7.6.7.3 Clonagem de Dados Remotas

O plugin de clonagem suporta a seguinte sintaxe para clonar dados remotos, ou seja, clonar dados de uma instância de servidor MySQL remoto (o doador) e transferi-los para a instância MySQL onde a operação de clonagem foi iniciada (o destinatário).

```
CLONE INSTANCE FROM 'user'@'host':port
IDENTIFIED BY 'password'
[DATA DIRECTORY [=] 'clone_dir']
[REQUIRE [NO] SSL];
```

onde:

* `user` é o usuário de clonagem na instância do servidor MySQL doador.
* `password` é a senha do `user`.
* `host` é o endereço `hostname` da instância do servidor MySQL doador. O formato de endereço de Protocolo de Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.
* `port` é o número `port` da instância do servidor MySQL doador. (O port do protocolo X especificado por `mysqlx_port` não é suportado. A conexão com a instância do servidor MySQL doador através do MySQL Router também não é suportada.)
* `DATA DIRECTORY [=] 'clone_dir'` é uma cláusula opcional usada para especificar um diretório no destinatário para os dados que você está clonando. Use esta opção se você não quiser remover dados criados pelo usuário (schemas, tables, tablespaces) e logs binários do diretório de dados do destinatário. Um caminho absoluto é necessário e o diretório não deve existir. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Quando a cláusula opcional `DATA DIRECTORY [=] 'clone_dir'` não é usada, uma operação de clonagem remove dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e logs binários do diretório de dados do destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia automaticamente o servidor posteriormente.
* `[REQUIRE [NO] SSL]` especifica explicitamente se uma conexão criptografada deve ser usada ou não ao transferir dados clonados pela rede. Um erro é retornado se a especificação explícita não puder ser atendida. Se uma cláusula SSL não for especificada, o clone tenta estabelecer uma conexão criptografada por padrão, revertendo para uma conexão insegura se a tentativa de conexão segura falhar. Uma conexão segura é necessária ao clonar dados criptografados, independentemente de esta cláusula ser especificada. Para mais informações, consulte Configurando uma Conexão Criptografada para Clonagem.

::: info Nota

Por padrão, as tabelas e espaços de tabelas `InnoDB` criadas pelo usuário que residem no diretório de dados da instância do servidor MySQL do doador são clonadas para o diretório de dados da instância do servidor MySQL do destinatário. Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, elas são clonadas para o diretório especificado.

Tabelas e espaços de tabelas `InnoDB` criados pelo usuário que residem fora do diretório de dados da instância do servidor MySQL do doador são clonados para o mesmo caminho na instância do servidor MySQL do destinatário. Um erro é relatado se uma tabela ou espaço de tabela já existir.

Por padrão, o espaço de tabela do sistema `InnoDB`, os logs de redo e os espaços de tabelas undo são clonados para os mesmos locais que são configurados no doador (definidos por `innodb_data_home_dir` e `innodb_data_file_path`, `innodb_log_group_home_dir` e `innodb_undo_directory`, respectivamente). Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, esses espaços de tabelas e logs são clonados para o diretório especificado.

:::

##### Pré-requisitos para Clonagem Remota


Para realizar uma operação de clonagem, o plugin de clonagem deve estar ativo nas instâncias do servidor MySQL do doador e do destinatário. Para obter instruções de instalação, consulte a Seção 7.6.7.1, “Instalando o Plugin de Clonagem”.

Um usuário MySQL no doador e no destinatário é necessário para executar a operação de clonagem (o “usuário de clonagem”).

* No doador, o usuário de clonagem requer o privilégio `BACKUP_ADMIN` para acessar e transferir dados do doador e bloquear DDL concorrente durante a operação de clonagem. O DDL concorrente é permitido no doador por padrão. Consulte a Seção 7.6.7.4, “Clonagem e DDL Concorrente”.
* No destinatário, o usuário de clonagem requer o privilégio `CLONE_ADMIN` para substituir os dados do destinatário, bloquear DDL no destinatário durante a operação de clonagem e reiniciar automaticamente o servidor. O privilégio `CLONE_ADMIN` inclui implicitamente os privilégios `BACKUP_ADMIN` e `SHUTDOWN`.

As instruções para criar o usuário de clonagem e conceder os privilégios necessários estão incluídas no exemplo de clonagem remota que segue essas informações prévias.

Os seguintes pré-requisitos são verificados quando a instrução `CLONE INSTANCE` é executada:

* O doador e o destinatário devem ser da mesma série de servidores MySQL, como 8.4.0 e 8.4.11. Para determinar a versão do servidor MySQL, execute a seguinte consulta:

```
  mysql> SHOW VARIABLES LIKE 'version';
  +---------------+-------+
  | Variable_name | Value |
  +---------------+-------+
  | version       | 8.4.6 |
  +---------------+-------+
  ```
* As instâncias do servidor MySQL do doador e do destinatário devem rodar no mesmo sistema operacional e plataforma. Por exemplo, se a instância do doador estiver rodando em uma plataforma de 64 bits Linux, a instância do destinatário também deve estar rodando nessa plataforma. Consulte a documentação do seu sistema operacional para obter informações sobre como determinar a plataforma do seu sistema operacional.
* O destinatário deve ter espaço suficiente no disco para os dados clonados. Por padrão, os dados criados pelo usuário (esquemas, tabelas, espaços de tabelas) e os logs binários são removidos no destinatário antes da clonagem dos dados do doador, portanto, você só precisa de espaço suficiente para os dados do doador. Se você clonar para um diretório nomeado usando a cláusula `DATA DIRECTORY`, você deve ter espaço suficiente no disco para os dados existentes do destinatário e os dados clonados. Você pode estimar o tamanho dos seus dados verificando o tamanho do diretório de dados no seu sistema de arquivos e o tamanho de quaisquer espaços de tabelas que residem fora do diretório de dados. Ao estimar o tamanho dos dados no doador, lembre-se de que apenas os dados do `InnoDB` são clonados. Se você armazenar dados em outros motores de armazenamento, ajuste sua estimativa de tamanho de dados de acordo.
* O `InnoDB` permite criar alguns tipos de espaços de tabelas fora do diretório de dados. Se a instância do servidor MySQL do doador tiver espaços de tabelas que residem fora do diretório de dados, a operação de clonagem deve ser capaz de acessar esses espaços de tabelas. Você pode consultar a tabela `FILES` do Schema de Informações para identificar espaços de tabelas que residem fora do diretório de dados. Arquivos que residem fora do diretório de dados têm um caminho totalmente qualificado para um diretório diferente do diretório de dados.

```
  mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES;
  ```
* Os plugins que estão ativos no doador, incluindo qualquer plugin de chave, também devem estar ativos no destinatário. Você pode identificar os plugins ativos emitindo uma declaração `SHOW PLUGINS` ou consultando a tabela do Schema de Informações `PLUGINS`.
* O doador e o destinatário devem ter o mesmo conjunto de caracteres e collation do servidor MySQL. Para obter informações sobre a configuração do conjunto de caracteres e collation do servidor MySQL, consulte a Seção 12.15, “Configuração do Conjunto de Caracteres”.
* Os mesmos  `innodb_page_size` e  `innodb_data_file_path` devem ser configurados tanto no doador quanto no destinatário. A configuração `innodb_data_file_path` no doador e no destinatário deve especificar o mesmo número de arquivos de dados de tamanho equivalente. Você pode verificar as configurações variáveis usando a sintaxe `SHOW VARIABLES`.

  ```
  mysql> SHOW VARIABLES LIKE 'innodb_page_size';
  mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
  ```
* Se estiver clonando dados criptografados ou compactados em páginas, o doador e o destinatário devem ter o mesmo tamanho de bloco do sistema de arquivos. Para dados compactados em páginas, o sistema de arquivos do destinatário deve suportar arquivos esparsos e perfuração de buracos para que a perfuração de buracos ocorra no destinatário. Para obter informações sobre essas funcionalidades e como identificar tabelas e espaços de tabelas que as utilizam, consulte a Seção 7.6.7.5, “Clonagem de Dados Criptografados”, e a Seção 7.6.7.6, “Clonagem de Dados Compactados”. Para determinar o tamanho de bloco do seu sistema de arquivos, consulte a documentação do seu sistema operacional.
* Uma conexão segura é necessária se estiver clonando dados criptografados. Consulte Configurando uma Conexão Encriptada para Clonagem.
* A configuração `clone_valid_donor_list` no destinatário deve incluir o endereço do host da instância do servidor MySQL do doador. Você só pode clonar dados de um host na lista de doadores válidos. Um usuário MySQL com o privilégio `SYSTEM_VARIABLES_ADMIN` é necessário para configurar essa variável. As instruções para definir a variável `clone_valid_donor_list` estão fornecidas no exemplo de clonagem remota que segue essa seção. Você pode verificar a configuração `clone_valid_donor_list` usando a sintaxe `SHOW VARIABLES`.

```
  mysql> SHOW VARIABLES LIKE 'clone_valid_donor_list';
  ```
* Não deve haver nenhuma outra operação de clonagem em execução. Apenas uma única operação de clonagem é permitida de cada vez. Para determinar se uma operação de clonagem está em execução, consulte a tabela `clone_status`. Veja Monitoramento de Operações de Clonagem usando Tabelas de Clonagem do Schema de Desempenho.
* O plugin de clonagem transfere dados em pacotes de 1 MB, além de metadados. O valor mínimo necessário para `max_allowed_packet` é, portanto, 2 MB nas instâncias do servidor MySQL do servidor doador e do receptor. Um valor de `max_allowed_packet` menor que 2 MB resulta em um erro. Use a seguinte consulta para verificar sua configuração de `max_allowed_packet`:

  ```
  mysql> SHOW VARIABLES LIKE 'max_allowed_packet';
  ```

Os seguintes pré-requisitos também se aplicam:

* Os nomes dos arquivos do espaço de tabelas do doador devem ser únicos. Quando os dados são clonados para o receptor, os espaços de tabelas, independentemente de sua localização no doador, são clonados para o local `innodb_undo_directory` no receptor ou para o diretório especificado pela cláusula `DATA DIRECTORY [=] 'clone_dir'`, se usada. Nomes de arquivos de espaço de tabelas duplicados no doador não são permitidos por essa razão. Um erro é relatado se nomes de arquivos de espaço de tabelas duplicados forem encontrados durante uma operação de clonagem.

  Para visualizar os nomes de arquivos de espaço de tabelas do doador para garantir que sejam únicos, consulte a tabela `FILES`:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
         WHERE FILE_TYPE LIKE 'UNDO LOG';
  ```

  Para informações sobre a remoção e adição de arquivos de espaço de tabelas, consulte a Seção 17.6.3.4, “Espaços de Tabelas de Desempenho”.
* Por padrão, a instância do servidor MySQL do receptor é reiniciada (parada e reiniciada) automaticamente após a clonagem dos dados. Para que um reinício automático ocorra, um processo de monitoramento deve estar disponível no receptor para detectar desligamentos do servidor. Caso contrário, a operação de clonagem é interrompida com o seguinte erro após a clonagem dos dados, e a instância do servidor MySQL do receptor é desligada:

  ```
  ERROR 3707 (HY000): Restart server failed (mysqld is not managed by supervisor process).
  ```

Esse erro não indica uma falha de clonagem. Isso significa que a instância do servidor MySQL do destinatário deve ser reiniciada manualmente após a clonagem dos dados. Após reiniciar o servidor manualmente, você pode se conectar à instância do servidor MySQL do destinatário e verificar as tabelas de clonagem do Schema de Desempenho para verificar se a operação de clonagem foi concluída com sucesso (veja Monitoramento de Operações de Clonagem usando Tabelas de Clonagem do Schema de Desempenho). A declaração `RESTART` tem o mesmo requisito de processo de monitoramento. Para mais informações, consulte a Seção 15.7.8.8, “Declaração RESTART”. Esse requisito não é aplicável se a clonagem estiver sendo realizada em um diretório nomeado usando a cláusula `DATA DIRECTORY`, pois um reinício automático não é realizado nesse caso.
* Várias variáveis controlam vários aspectos de uma operação de clonagem remota. Antes de realizar uma operação de clonagem remota, revise as variáveis e ajuste as configurações conforme necessário para atender ao seu ambiente de computação. As variáveis de clonagem são definidas na instância do servidor MySQL do destinatário onde a operação de clonagem é executada. Veja a Seção 7.6.7.13, “Variáveis de Sistema de Clonagem”.

##### Clonagem de Dados Remotas

O exemplo a seguir demonstra a clonagem de dados remotos. Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (schemas, tables, tablespaces) e logs binários no destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia o servidor MySQL depois disso.

O exemplo assume que os pré-requisitos de clonagem remota estão atendidos. Veja Pré-requisitos de Clonagem Remota.

1. Faça login na instância do servidor MySQL do doador com uma conta de usuário administrativa.

   1. Crie um usuário de clonagem com o privilégio `BACKUP_ADMIN`.

      ```
      mysql> CREATE USER 'donor_clone_user'@'example.donor.host.com' IDENTIFIED BY 'password';
      mysql> GRANT BACKUP_ADMIN on *.* to 'donor_clone_user'@'example.donor.host.com';
      ```
   2. Instale o plugin de clonagem:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```
2. Faça login na instância do servidor MySQL do destinatário com uma conta de usuário administrativa.

   1. Crie um usuário de clonagem com o privilégio `CLONE_ADMIN`.

      ```
      mysql> CREATE USER 'recipient_clone_user'@'example.recipient.host.com' IDENTIFIED BY 'password';
      mysql> GRANT CLONE_ADMIN on *.* to 'recipient_clone_user'@'example.recipient.host.com';
      ```
   2. Instale o plugin de clonagem:

```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```
3. Adicione o endereço do host da instância do servidor MySQL do doador à configuração da variável `clone_valid_donor_list`.

```
      mysql> SET GLOBAL clone_valid_donor_list = 'example.donor.host.com:3306';
      ```
3. Faça login na instância do servidor MySQL do destinatário como o usuário clone que você criou anteriormente (`recipient_clone_user'@'example.recipient.host.com`) e execute a instrução `CLONE INSTANCE`.

```
   mysql> CLONE INSTANCE FROM 'donor_clone_user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password';
   ```

Após a clonagem dos dados, a instância do servidor MySQL do destinatário é reiniciada automaticamente.

Para obter informações sobre o monitoramento do status e do progresso da operação de clonagem, consulte a Seção 7.6.7.10, “Monitoramento de Operações de Clonagem”.

##### Clonagem para um Diretório Nomeado

Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (schemas, tables, tablespaces) e logs binários do diretório de dados do destinatário antes de clonar dados da instância do servidor MySQL do doador. Ao clonar para um diretório nomeado, você pode evitar a remoção de dados do diretório de dados atual do destinatário.

O procedimento para clonagem para um diretório nomeado é o mesmo procedimento descrito na Clonagem de Dados Remotas com uma exceção: A instrução `CLONE INSTANCE` deve incluir a cláusula `DATA DIRECTORY`. Por exemplo:

```
mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
       IDENTIFIED BY 'password'
       DATA DIRECTORY = '/path/to/clone_dir';
```

É necessário um caminho absoluto e o diretório não deve existir. O servidor MySQL deve ter o acesso de escrita necessário para criar o diretório.

Ao clonar para um diretório nomeado, a instância do servidor MySQL do destinatário não é reiniciada automaticamente após a clonagem dos dados. Se você quiser reiniciar o servidor MySQL no diretório nomeado, deve fazê-lo manualmente:

```
$> mysqld_safe --datadir=/path/to/clone_dir
```

onde *`/caminho/para/clone_dir`* é o caminho para o diretório nomeado no destinatário.

##### Configurando uma Conexão Encriptada para Clonagem

Você pode configurar uma conexão encriptada para operações de clonagem remota para proteger os dados enquanto eles são clonados pela rede. Uma conexão encriptada é necessária por padrão ao clonar dados encriptados. (consulte a Seção 7.6.7.5, “Clonagem de Dados Encriptados”.)

As instruções a seguir descrevem como configurar a instância do servidor MySQL do destinatário para usar uma conexão criptografada. Assume-se que a instância do servidor MySQL do doador já está configurada para usar conexões criptografadas. Se não estiver, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas”, para instruções de configuração no lado do servidor.

Para configurar a instância do servidor MySQL do destinatário para usar uma conexão criptografada:

1. Disponibilize os arquivos de certificado e chave do cliente da instância do servidor MySQL do doador para o host do destinatário. Distribua os arquivos para o host do destinatário usando um canal seguro ou coloque-os em uma partição montada que seja acessível ao host do destinatário. Os arquivos de certificado e chave do cliente que devem ser disponibilizados incluem:

   * `ca.pem`

     O arquivo da autoridade de certificação (CA) autoassinada.
   * `client-cert.pem`

     O arquivo de certificado da chave pública do cliente.
   * `client-key.pem`

     O arquivo da chave privada do cliente.
2. Configure as seguintes opções SSL na instância do servidor MySQL do destinatário.

   *  `clone_ssl_ca`

     Especifica o caminho para o arquivo da autoridade de certificação (CA) autoassinada.
   *  `clone_ssl_cert`

     Especifica o caminho para o arquivo de certificado da chave pública do cliente.
   *  `clone_ssl_key`

     Especifica o caminho para o arquivo da chave privada do cliente.

   Por exemplo:

   ```
   clone_ssl_ca=/path/to/ca.pem
   clone_ssl_cert=/path/to/client-cert.pem
   clone_ssl_key=/path/to/client-key.pem
   ```
3. Para exigir que uma conexão criptografada seja usada, inclua a cláusula `REQUIRE SSL` ao emitir a declaração `CLONE` no destinatário.

   ```
   mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password'
          DATA DIRECTORY = '/path/to/clone_dir'
          REQUIRE SSL;
   ```

   Se uma cláusula SSL não for especificada, o plugin de clonagem tentará estabelecer uma conexão criptografada por padrão, revertendo para uma conexão não criptografada se a tentativa de conexão criptografada falhar.

   ::: info Nota

   Se você estiver clonando dados criptografados, uma conexão criptografada é necessária por padrão, independentemente de a cláusula `REQUIRE SSL` ser especificada. Usar `REQUIRE NO SSL` causa um erro se você tentar clonar dados criptografados.

   :::