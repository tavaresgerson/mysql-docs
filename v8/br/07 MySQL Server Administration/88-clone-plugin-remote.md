#### 7.6.7.3 Clonagem de dados remotos

O plugin de clonagem suporta a seguinte sintaxe para clonagem de dados remotos; ou seja, clonagem de dados de uma instância remota do servidor MySQL (o doador) e transferência para a instância MySQL onde a operação de clonagem foi iniciada (o destinatário).

```
CLONE INSTANCE FROM 'user'@'host':port
IDENTIFIED BY 'password'
[DATA DIRECTORY [=] 'clone_dir']
[REQUIRE [NO] SSL];
```

em que:

- `user` é o usuário clone na instância do servidor MySQL doador.
- `password` é a senha `user`.
- `host` é o endereço `hostname` da instância do servidor MySQL doador. O formato de endereço do Protocolo Internet versão 6 (IPv6) não é suportado. Um alias para o endereço IPv6 pode ser usado em vez disso. Um endereço IPv4 pode ser usado como está.
- `port` é o número `port` da instância do servidor MySQL doador. (A porta do protocolo X especificada por `mysqlx_port` não é suportada. Conectar-se à instância do servidor MySQL doador através do Roteador MySQL também não é suportado.)
- `DATA DIRECTORY [=] 'clone_dir'` é uma cláusula opcional usada para especificar um diretório no destinatário para os dados que você está clonando. Use esta opção se você não quiser remover dados existentes criados pelo usuário (esquemas, tabelas, tablespaces) e logs binários do diretório de dados do destinatário. Um caminho absoluto é necessário, e o diretório não deve existir. O servidor MySQL deve ter o acesso de gravação necessário para criar o diretório.

  Quando a cláusula `DATA DIRECTORY [=] 'clone_dir'` opcional não é usada, uma operação de clonagem remove dados criados pelo usuário (esquemas, tabelas, tablespaces) e registros binários do diretório de dados do destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia automaticamente o servidor depois.
- \[`[REQUIRE [NO] SSL]`] especifica explicitamente se uma conexão criptografada deve ser usada ou não ao transferir dados clonados pela rede. Um erro é retornado se a especificação explícita não puder ser satisfeita. Se uma cláusula SSL não for especificada, o clone tentará estabelecer uma conexão criptografada por padrão, voltando a uma conexão insegura se a tentativa de conexão segura falhar. Uma conexão segura é necessária ao clonar dados criptografados, independentemente de esta cláusula ser especificada. Para mais informações, consulte Configurar uma conexão criptografada para clonagem.

::: info Note

Por padrão, as tabelas e os espaços de tabelas `InnoDB` criados pelo usuário que residem no diretório de dados na instância do servidor MySQL doador são clonados para o diretório de dados na instância do servidor MySQL receptor. Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, eles são clonados para o diretório especificado.

As tabelas e os espaços de tabelas criados pelo usuário que residem fora do diretório de dados na instância do servidor MySQL doador são clonados para o mesmo caminho na instância do servidor MySQL destinatário. Um erro é relatado se uma tabela ou um espaço de tabelas já existir.

Por padrão, o espaço de tabela do sistema `InnoDB`, os registros de repetição e os espaços de tabela de anulação são clonados para os mesmos locais que são configurados no doador (conforme definido por `innodb_data_home_dir` e `innodb_data_file_path`, `innodb_log_group_home_dir`, e `innodb_undo_directory`, respectivamente). Se a cláusula `DATA DIRECTORY [=] 'clone_dir'` for especificada, esses espaços de tabela e registros são clonados para o diretório especificado.

:::

##### Pré-requisitos de clonagem remota

Para executar uma operação de clonagem, o plugin clone deve estar ativo em ambas as instâncias do servidor MySQL doador e receptor.

É necessário um usuário MySQL no doador e no destinatário para executar a operação de clonagem (o "usuário de clonagem").

- No doador, o usuário do clone requer o privilégio `BACKUP_ADMIN` para acessar e transferir dados do doador e bloquear o DDL simultâneo durante a operação de clonagem.
- No destinatário, o usuário do clone requer o privilégio `CLONE_ADMIN` para substituir os dados do destinatário, bloquear o DDL no destinatário durante a operação de clonagem e reiniciar automaticamente o servidor. O privilégio `CLONE_ADMIN` inclui os privilégios `BACKUP_ADMIN` e `SHUTDOWN` implicitamente.

Instruções para criar o usuário clone e conceder os privilégios necessários estão incluídos no exemplo de clonagem remota que segue esta informação pré-requisito.

Os seguintes pré-requisitos são verificados quando a instrução `CLONE INSTANCE` é executada:

- O doador e o destinatário devem ser a mesma série de servidor MySQL, como 8.4.0 e 8.4.11. Para determinar a versão do servidor MySQL, emita a seguinte consulta:

  ```
  mysql> SHOW VARIABLES LIKE 'version';
  +---------------+-------+
  | Variable_name | Value |
  +---------------+-------+
  | version       | 8.4.6 |
  +---------------+-------+
  ```
- As instâncias do servidor MySQL doador e receptor devem ser executadas no mesmo sistema operacional e plataforma. Por exemplo, se a instância doadora for executada em uma plataforma Linux de 64 bits, a instância do receptor também deve ser executada nessa plataforma. Consulte a documentação do seu sistema operacional para obter informações sobre como determinar a plataforma do seu sistema operacional.
- O destinatário deve ter espaço suficiente no disco para os dados clonados. Por padrão, os dados criados pelo usuário (esquemas, tabelas, tablespaces) e registros binários são removidos no destinatário antes de clonar os dados do doador, então você só precisa de espaço suficiente para os dados do doador. Se você clonar para um diretório nomeado usando a cláusula `DATA DIRECTORY`, você deve ter espaço suficiente no disco para os dados do destinatário existentes e os dados clonados. Você pode estimar o tamanho de seus dados verificando o tamanho do diretório de dados em seu sistema de arquivos e o tamanho de quaisquer tablespaces que residem fora do diretório de dados. Ao estimar o tamanho de dados no doador, lembre-se de que apenas os dados `InnoDB` são clonados. Se você armazenar dados em outros mecanismos de armazenamento, ajuste sua estimativa de tamanho de dados de acordo.
- Se a instância do servidor MySQL doador tiver tablespaces que residem fora do diretório de dados, a operação de clonagem deve ser capaz de acessar esses tablespaces. Você pode consultar a tabela do Esquema de Informação `FILES` para identificar tablespaces que residem fora do diretório de dados. Arquivos que residem fora do diretório de dados têm um caminho totalmente qualificado para um diretório diferente do diretório de dados.

  ```
  mysql> SELECT FILE_NAME FROM INFORMATION_SCHEMA.FILES;
  ```
- Os plugins que estão ativos no doador, incluindo qualquer plugin de chaveiro, também devem estar ativos no destinatário. Você pode identificar plugins ativos emitindo uma instrução `SHOW PLUGINS` ou consultando a tabela de esquema de informações `PLUGINS`.
- O doador e o destinatário devem ter o mesmo conjunto de caracteres e coleta do servidor MySQL.
- As mesmas configurações de `innodb_page_size` e `innodb_data_file_path` são necessárias no doador e no receptor. A configuração de `innodb_data_file_path` no doador e no receptor deve especificar o mesmo número de arquivos de dados de tamanho equivalente. Você pode verificar as configurações de variáveis usando a sintaxe de `SHOW VARIABLES`.

  ```
  mysql> SHOW VARIABLES LIKE 'innodb_page_size';
  mysql> SHOW VARIABLES LIKE 'innodb_data_file_path';
  ```
- Se clonar dados criptografados ou compactados em páginas, o doador e o destinatário devem ter o mesmo tamanho de bloco do sistema de arquivos. Para dados compactados em páginas, o sistema de arquivos destinatário deve suportar arquivos esparsos e perfuramento de buraco para que o perfuramento de buraco ocorra no destinatário. Para informações sobre esses recursos e como identificar tabelas e espaços de tabela que os usam, consulte a Seção 7.6.7.5, Cloning Encrypted Data, e a Seção 7.6.7.6, Cloning Compressed Data. Para determinar o tamanho de bloco do sistema de arquivos, consulte a documentação do sistema operacional.
- Uma conexão segura é necessária se você estiver clonando dados criptografados. Veja Configurar uma conexão criptografada para clonagem.
- A configuração `clone_valid_donor_list` no destinatário deve incluir o endereço host da instância do servidor MySQL doador. Você só pode clonar dados de um host na lista de doadores válida. Um usuário MySQL com o privilégio `SYSTEM_VARIABLES_ADMIN` é necessário para configurar essa variável. Instruções para definir a variável `clone_valid_donor_list` são fornecidas no exemplo de clonagem remota que segue esta seção. Você pode verificar a configuração `clone_valid_donor_list` usando a sintaxe `SHOW VARIABLES`.

  ```
  mysql> SHOW VARIABLES LIKE 'clone_valid_donor_list';
  ```
- Não deve haver nenhuma outra operação de clonagem em execução. Apenas uma única operação de clonagem é permitida de cada vez. Para determinar se uma operação de clonagem está em execução, consulte a tabela `clone_status`.
- O plugin clone transfere dados em pacotes de 1MB mais metadados. O valor mínimo necessário `max_allowed_packet` é, portanto, 2MB nas instâncias do servidor MySQL doador e do destinatário. Um valor `max_allowed_packet` menor que 2MB resulta em um erro. Use a seguinte consulta para verificar sua configuração `max_allowed_packet`:

  ```
  mysql> SHOW VARIABLES LIKE 'max_allowed_packet';
  ```

São igualmente aplicáveis os seguintes pré-requisitos:

- Quando os dados são clonados para o destinatário, os tablespaces de desativação, independentemente de sua localização no doador, são clonados para o local `innodb_undo_directory` no destinatário ou para o diretório especificado pela cláusula `DATA DIRECTORY [=] 'clone_dir'`, se usado. Os nomes de arquivo de tablespaces de desativação duplicados no doador não são permitidos por este motivo. Um erro é relatado se nomes de arquivo de tablespaces de desativação duplicados forem encontrados durante uma operação de clonagem.

  Para ver os nomes de arquivo de desfecho de espaço de tabela no doador para garantir que eles sejam únicos, consulte a tabela `FILES`:

  ```
  mysql> SELECT TABLESPACE_NAME, FILE_NAME FROM INFORMATION_SCHEMA.FILES
         WHERE FILE_TYPE LIKE 'UNDO LOG';
  ```

  Para obter informações sobre a eliminação e a adição de ficheiros de espaço de tabela de anulação, ver Secção 17.6.3.4, "Undo Tablespaces".
- Por padrão, a instância do servidor MySQL do destinatário é reiniciada (parada e iniciada) automaticamente após a clonagem dos dados. Para que uma reinicialização automática ocorra, um processo de monitoramento deve estar disponível no destinatário para detectar desligamentos de servidor. Caso contrário, a operação de clonagem é interrompida com o seguinte erro após a clonagem dos dados, e a instância do servidor MySQL do destinatário é desligada:

  ```
  ERROR 3707 (HY000): Restart server failed (mysqld is not managed by supervisor process).
  ```

  Este erro não indica uma falha de clonagem. Significa que a instância do servidor MySQL destinatário deve ser iniciada novamente manualmente depois que os dados são clonados. Depois de iniciar o servidor manualmente, você pode se conectar à instância do servidor MySQL destinatário e verificar as tabelas de clonagem do esquema de desempenho para verificar se a operação de clonagem foi concluída com sucesso (ver Monitoramento de Operações de Clonagem usando tabelas de clonagem do esquema de desempenho). A instrução `RESTART` tem o mesmo requisito de processo de monitoramento. Para mais informações, consulte a Seção 15.7.8.8, Instrução RESTART. Este requisito não é aplicável se a clonagem para um diretório nomeado usando a cláusula `DATA DIRECTORY` for executada, pois uma reinicialização automática não é realizada neste caso.
- Várias variáveis controlam vários aspectos de uma operação de clonagem remota. Antes de executar uma operação de clonagem remota, revise as variáveis e ajuste as configurações conforme necessário para se adequar ao seu ambiente de computação. As variáveis de clonagem são definidas na instância do servidor MySQL destinatário onde a operação de clonagem é executada. Veja Seção 7.6.7.13, Variáveis de sistema de clonagem.

##### Clonagem de dados remotos

O exemplo a seguir demonstra a clonagem de dados remotos. Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (esquemas, tabelas, tablespaces) e registros binários no destinatário, clona os novos dados para o diretório de dados do destinatário e reinicia o servidor MySQL depois.

O exemplo assume que os pré-requisitos de clonagem remota estão preenchidos.

1. Faça login na instância do servidor MySQL doador com uma conta de usuário administrador.

   1. Crie um usuário clone com o privilégio `BACKUP_ADMIN`.

      ```
      mysql> CREATE USER 'donor_clone_user'@'example.donor.host.com' IDENTIFIED BY 'password';
      mysql> GRANT BACKUP_ADMIN on *.* to 'donor_clone_user'@'example.donor.host.com';
      ```
   2. Instalar o plugin clone:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```
2. Iniciar sessão na instância do servidor MySQL destinatário com uma conta de utilizador administrativo.

   1. Crie um usuário clone com o privilégio `CLONE_ADMIN`.

      ```
      mysql> CREATE USER 'recipient_clone_user'@'example.recipient.host.com' IDENTIFIED BY 'password';
      mysql> GRANT CLONE_ADMIN on *.* to 'recipient_clone_user'@'example.recipient.host.com';
      ```
   2. Instalar o plugin clone:

      ```
      mysql> INSTALL PLUGIN clone SONAME 'mysql_clone.so';
      ```
   3. Adicione o endereço host da instância do servidor MySQL doador à configuração da variável `clone_valid_donor_list`.

      ```
      mysql> SET GLOBAL clone_valid_donor_list = 'example.donor.host.com:3306';
      ```
3. Faça login na instância do servidor MySQL destinatário como o usuário clone que você criou anteriormente (`recipient_clone_user'@'example.recipient.host.com`) e execute a instrução `CLONE INSTANCE`.

   ```
   mysql> CLONE INSTANCE FROM 'donor_clone_user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password';
   ```

   Após a clonagem dos dados, a instância do servidor MySQL no destinatário é reiniciada automaticamente.

   Para obter informações sobre a monitorização do estado e progresso das operações de clonagem, ver secção 7.6.7.10, "Monitorização das operações de clonagem".

##### Clonar para um diretório nomeado

Por padrão, uma operação de clonagem remota remove dados criados pelo usuário (esquemas, tabelas, tablespaces) e registros binários do diretório de dados do destinatário antes de clonar dados da instância do MySQL Server doador. Ao clonar para um diretório nomeado, você pode evitar a remoção de dados do diretório de dados do destinatário atual.

O procedimento para clonar para um diretório nomeado é o mesmo procedimento descrito em Cloning Remote Data com uma exceção: A instrução `CLONE INSTANCE` deve incluir a cláusula `DATA DIRECTORY`.

```
mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
       IDENTIFIED BY 'password'
       DATA DIRECTORY = '/path/to/clone_dir';
```

Um caminho absoluto é necessário, e o diretório não deve existir. O servidor MySQL deve ter o acesso de gravação necessário para criar o diretório.

Ao clonar para um diretório nomeado, a instância do servidor MySQL do destinatário não é reiniciada automaticamente depois que os dados são clonados. Se você quiser reiniciar o servidor MySQL no diretório nomeado, você deve fazê-lo manualmente:

```
$> mysqld_safe --datadir=/path/to/clone_dir
```

onde `/path/to/clone_dir` é o caminho para o diretório nomeado no destinatário.

##### Configurar uma conexão criptografada para clonagem

Você pode configurar uma conexão criptografada para operações de clonagem remota para proteger os dados à medida que são clonados pela rede. Uma conexão criptografada é necessária por padrão ao clonar dados criptografados (ver Seção 7.6.7.5, "Clonar Dados Criptografados").

As instruções que se seguem descrevem como configurar a instância do servidor MySQL receptor para usar uma conexão criptografada.

Para configurar a instância do servidor MySQL destinatário para usar uma conexão criptografada:

1. Fazer o certificado do cliente e os arquivos-chave da instância do servidor MySQL doador disponíveis para o host destinatário. Ou distribuir os arquivos para o host destinatário usando um canal seguro ou colocá-los em uma partição montada que é acessível ao host destinatário. O certificado do cliente e os arquivos-chave a disponibilizar incluem:

   - `ca.pem`

     Ficheiro da autoridade de certificação (CA) auto-assinada.
   - `client-cert.pem`

     O ficheiro de certificado de chave pública do cliente.
   - `client-key.pem`

     O ficheiro de chave privada do cliente.
2. Configure as seguintes opções SSL na instância do servidor MySQL destinatário.

   - `clone_ssl_ca`

   Especifica o caminho para o ficheiro da autoridade de certificação (CA) auto-assinada.

   - `clone_ssl_cert`

   Especifica o caminho para o ficheiro de certificado de chave pública do cliente.

   - `clone_ssl_key`

   Especifica o caminho para o ficheiro de chave privada do cliente.

   Por exemplo:

   ```
   clone_ssl_ca=/path/to/ca.pem
   clone_ssl_cert=/path/to/client-cert.pem
   clone_ssl_key=/path/to/client-key.pem
   ```
3. Para exigir que uma conexão criptografada seja usada, inclua a cláusula `REQUIRE SSL` ao emitir a instrução `CLONE` no destinatário.

   ```
   mysql> CLONE INSTANCE FROM 'user'@'example.donor.host.com':3306
          IDENTIFIED BY 'password'
          DATA DIRECTORY = '/path/to/clone_dir'
          REQUIRE SSL;
   ```

   Se uma cláusula SSL não for especificada, o plugin clone tenta estabelecer uma conexão criptografada por padrão, voltando a uma conexão não criptografada se a tentativa de conexão criptografada falhar.

   ::: info Note

   Se você estiver clonando dados criptografados, uma conexão criptografada é necessária por padrão, independentemente de a cláusula `REQUIRE SSL` ser especificada. Usar `REQUIRE NO SSL` causa um erro se você tentar clonar dados criptografados.

   :::
