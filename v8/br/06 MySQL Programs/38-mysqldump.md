### 6.5.4 `mysqldump` — Um Programa de Backup de Banco de Dados

O utilitário cliente `mysqldump` realiza backups lógicos, produzindo um conjunto de instruções SQL que podem ser executadas para reproduzir as definições originais dos objetos do banco de dados e os dados das tabelas. Ele faz o backup de um ou mais bancos de dados MySQL para backup ou transferência para outro servidor SQL. O comando `mysqldump` também pode gerar saída em formato CSV, texto delimitado ou XML.

Dica

Considere usar os utilitários de dump do MySQL Shell, que fornecem dumping paralelo com múltiplos threads, compressão de arquivos e exibição de informações de progresso, além de recursos na nuvem, como streaming de Armazenamento de Objetos da Oracle Cloud Infrastructure e verificações e modificações de compatibilidade do MySQL HeatWave. Os dumps podem ser facilmente importados em uma instância do MySQL Server ou em um Sistema de Banco de Dados MySQL HeatWave usando os utilitários de dump de carregamento do MySQL Shell. As instruções de instalação do MySQL Shell podem ser encontradas aqui.

* Considerações de Desempenho e Escalabilidade
* Sintaxe de Invocação
* Sintaxe de Opções - Resumo Alfabetizado
* Opções de Conexão
* Opções de Arquivo de Opção
* Opções DDL
* Opções de Depuração
* Opções de Ajuda
* Opções de Internacionalização
* Opções de Replicação
* Opções de Formato
* Opções de Filtragem
* Opções de Desempenho
* Opções Transacionais
* Grupos de Opções
* Exemplos
* Restrições

O `mysqldump` requer pelo menos o privilégio `SELECT` para tabelas excluídas, `SHOW VIEW` para vistas excluídas, `TRIGGER` para gatilhos excluídos, `LOCK TABLES` se a opção `--single-transaction` não for usada, `PROCESS` se a opção `--no-tablespaces` não for usada e o privilégio `RELOAD` ou `FLUSH_TABLES` com `--single-transaction` se estiverem habilitados `gtid_mode=ON` e `gtid_purged=ON|AUTO`. Algumas opções podem exigir outros privilégios, conforme indicado nas descrições das opções.

Para recarregar um arquivo de dump, você deve ter os privilégios necessários para executar as instruções que ele contém, como os privilégios apropriados `CREATE` para objetos criados por essas instruções.

A saída do `mysqldump` pode incluir instruções `ALTER DATABASE` que alteram a codificação da base de dados. Essas instruções podem ser usadas ao fazer um dump de programas armazenados para preservar suas codificações de caracteres. Para recarregar um arquivo de dump que contenha essas instruções, é necessário o privilégio `ALTER` para a base de dados afetada.

::: info Nota

Um dump feito usando o PowerShell no Windows com redirecionamento de saída cria um arquivo com codificação UTF-16:

```
mysqldump [options] > dump.sql
```

No entanto, o UTF-16 não é permitido como conjunto de caracteres de conexão (veja Conjuntos de caracteres de cliente impermissíveis), então o arquivo de dump não pode ser carregado corretamente. Para contornar esse problema, use a opção `--result-file`, que cria a saída no formato ASCII:

```
mysqldump [options] --result-file=dump.sql
```

Não é recomendado carregar um arquivo de dump quando os GTIDs estão habilitados no servidor ( `gtid_mode=ON`), se o seu arquivo de dump incluir tabelas de sistema. O `mysqldump` emite instruções DML para as tabelas de sistema que usam o motor de armazenamento não transacional MyISAM, e essa combinação não é permitida quando os GTIDs estão habilitados.

#### Considerações de desempenho e escalabilidade

As vantagens do `mysqldump` incluem a conveniência e flexibilidade de visualizar ou até mesmo editar a saída antes de restaurar. Você pode clonar bancos de dados para trabalho de desenvolvimento e DBA, ou produzir variações leves de um banco de dados existente para testes. Não é destinado como uma solução rápida ou escalável para fazer backups de grandes quantidades de dados. Com tamanhos de dados grandes, mesmo que o passo de backup leve um tempo razoável, restaurar os dados pode ser muito lento porque a reprodução das instruções SQL envolve I/O de disco para inserção, criação de índices, e assim por diante.

Para backups e restaurações em grande escala, um backup físico é mais apropriado, para copiar os arquivos de dados em seu formato original para que possam ser restaurados rapidamente.

Se suas tabelas são principalmente tabelas `InnoDB`, ou se você tem uma mistura de tabelas `InnoDB` e `MyISAM`, considere usar `mysqlbackup`, que está disponível como parte do MySQL Enterprise. Esta ferramenta oferece alto desempenho para backups de `InnoDB` com mínima interrupção; ela também pode fazer backup de tabelas de `MyISAM` e outros motores de armazenamento; ela também oferece várias opções convenientes para acomodar diferentes cenários de backup. Veja a Seção 32.1, “Visão Geral do Backup do MySQL Enterprise”.

`mysqldump` pode recuperar e dumper o conteúdo da tabela linha por linha, ou pode recuperar todo o conteúdo de uma tabela e bufferá-lo na memória antes de dumperá-lo. Bufferar na memória pode ser um problema se você estiver dumperando tabelas grandes. Para dumper tabelas linha por linha, use a opção `--quick` (ou `--opt`, que habilita `--quick`). A opção `--opt` (e, portanto, `--quick`) é habilitada por padrão, então para habilitar o bufferamento na memória, use `--skip-quick`.

Se você estiver usando uma versão recente do `mysqldump` para gerar um dump a ser recarregado em um servidor MySQL muito antigo, use a opção `--skip-opt` em vez da opção `--opt` ou `--extended-insert`.

Para informações adicionais sobre `mysqldump`, veja a Seção 9.4, “Usando mysqldump para Backups”.

#### Sintaxe de Invocação

Existem, em geral, três maneiras de usar `mysqldump`—para dumper um conjunto de uma ou mais tabelas, um conjunto de uma ou mais bases de dados completas, ou um servidor MySQL inteiro—como mostrado aqui:

```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

Para dumper bases de dados inteiras, não nomeie nenhuma tabela após `db_name`, ou use a opção `--databases` ou `--all-databases`.

Para ver uma lista das opções que sua versão do `mysqldump` suporta, execute o comando `mysqldump` `--help`.

#### Sintaxe de Opção - Resumo Alfabetizado

`mysqldump` suporta as seguintes opções, que podem ser especificadas na linha de comando ou nos grupos `[mysqldump]` e `[client]` de um arquivo de opções. Para informações sobre arquivos de opções usados por programas MySQL, veja a Seção 6.2.2.2, “Usando Arquivos de Opções”.

**Tabela 6.13 Opções do `mysqldump`**


         <td>Use <code>ServerName</code> in TLSv1.3 certificates</td>
      </tr>
      <tr>
         <td><code>--tls-sni-subject</code></td>
         <td>Use <code>Subject</code> in TLSv1.3 certificates</td>
      </tr>
      <tr>
         <td><code>--tls-transport-security-mode</code></td>
         <td>Desired transport security state of connection to server</td>
      </tr>
      <tr>
         <td><code>--trust-all-certificates</code></td>
         <td>Trust all certificates</td>
      </tr>
      <tr>
         <td><code>--trust-only-certificates</code></td>
         <td>Trust only specified certificates</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path</code></td>
         <td>Use the specified path for binary log files</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if binary log file path reuse fails</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if binary log file path reuse fails and binary log file path reuse fails again</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if binary log file path reuse fails, binary log file path reuse fails again, and binary log file path reuse fails again again</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if binary log file path reuse fails, binary log file path reuse fails again, binary log file path reuse fails again again, and binary log file path reuse fails again again again</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if binary log file path reuse fails, binary log file path reuse fails again, binary log file path reuse fails again again, binary log file path reuse fails again again again, and binary log file path reuse fails again again again again</td>
      </tr>
      <tr>
         <td><code>--use-binlog-path-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-on-failed-reuse-continue-

#### Opções de Conexão

O comando `mysqldump` faz login em um servidor MySQL para extrair informações. As seguintes opções especificam como se conectar ao servidor MySQL, seja na mesma máquina ou em um sistema remoto.

*  `--bind-address=ip_address`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Em um computador com múltiplas interfaces de rede, use esta opção para selecionar qual interface usar para se conectar ao servidor MySQL.
*  `--compress`, `-C`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Desatualizado</th>
<td>Sim</td> </tr><tr><th>Tipo</th>
<td>Booleano</td> </tr><tr><th>Valor Padrão</th>
<td><code>OFF</code></td> </tr></tbody></table>

  Compressar todas as informações enviadas entre o cliente e o servidor, se possível. Consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

  Esta opção está desatualizada. Espera-se que seja removida em uma versão futura do MySQL. Consulte Configurando a Compressão de Conexão Legado.
*  `--compression-algorithms=value`

<table>
   <tbody>
      <tr>
         <th>Formato de Linha de Comando</th>
         <td><code>--compression-algorithms=value</code></td>
      </tr>
      <tr>
         <th>Tipo</th>
         <td><code>Set</code></td>
      </tr>
      <tr>
         <th>Valor Padrão</th>
         <td><code>uncompressed</code></td>
      </tr>
      <tr>
         <th>Valores Válidos</th>
         <td><code>zlib</code><code>zstd</code><code>uncompressed</code></td>
      </tr>
   </tbody>
</table>

  Os algoritmos de compressão permitidos para conexões ao servidor. Os algoritmos disponíveis são os mesmos da variável de sistema `protocol_compression_algorithms`. O valor padrão é `uncompressed`.
*  `--default-auth=plugin`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Tipo</th>
<td><code>String</code></td> </tr></tbody></table>

Uma dica sobre qual plugin de autenticação do lado do cliente usar. Veja a Seção 8.2.17, “Autenticação Plugavel de Texto Aberto”.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ative o plugin de autenticação de texto aberto `mysql_clear_password`. (Veja a Seção 8.4.1.4, “Autenticação Plugavel de Texto Aberto do Lado do Cliente”).
*  `--get-server-public-key`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr></tbody></table>

  Peça ao servidor a chave pública necessária para a troca de senhas baseada em pares de chaves RSA. Esta opção se aplica a clientes que autenticam com o plugin de autenticação `caching_sha2_password`. Para esse plugin, o servidor não envia a chave pública a menos que seja solicitado. Esta opção é ignorada para contas que não autenticam com esse plugin. Também é ignorada se a troca de senha baseada em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=file_name` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para informações sobre o plugin `caching_sha2_password`, veja a Seção 8.4.1.2, “Autenticação Plugavel SHA-2”.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--host</code></td> </tr></tbody></table>

  Exiba dados do servidor MySQL no host fornecido. O host padrão é `localhost`.
*  `--login-path=name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--login-path=name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia as opções do caminho de login nomeado no arquivo de caminho de login `.mylogin.cnf`. Um “caminho de login” é um grupo de opções que contém opções que especificam para qual servidor MySQL se conectar e qual conta autenticar. Para criar ou modificar um arquivo de caminho de login, use o utilitário `mysql_config_editor`. Veja a Seção 6.6.7, “mysql_config_editor — Ferramenta de Configuração do MySQL”.

Para informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--no-login-paths`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura de opções do arquivo de caminho de login.

  Veja `--login-path` para informações relacionadas.

  Para informações adicionais sobre esta e outras opções de arquivos de opções, veja a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--password[=password]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  A senha da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqldump` solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password=` ou `-p` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

  Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opção. Veja a Seção 8.1.2.1, “Diretrizes do Usuário Final para Segurança de Senhas”.

  Para especificar explicitamente que não há senha e que o `mysqldump` não deve solicitar uma, use a opção `--skip-password`.
*  `--password1[=pass_val]`

A senha para o fator de autenticação multifator 1 da conta MySQL usada para se conectar ao servidor. O valor da senha é opcional. Se não for fornecido, o `mysqldump` solicitará uma senha. Se for fornecida, não deve haver *espaço* entre `--password1=` e a senha que a segue. Se nenhuma opção de senha for especificada, o padrão é não enviar a senha.

Especificar uma senha na linha de comando deve ser considerado inseguro. Para evitar fornecer a senha na linha de comando, use um arquivo de opções. Veja a Seção 8.1.2.1, “Diretrizes para o Usuário Final sobre Segurança de Senhas”.

Para especificar explicitamente que não há senha e que o `mysqldump` não deve solicitar uma, use a opção `--skip-password1`.

`--password1` e `--password` são sinônimos, assim como `--skip-password1` e `--skip-password`.
*  `--password2[=pass_val]`

A senha para o fator de autenticação multifator 2 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
*  `--password3[=pass_val]`

A senha para o fator de autenticação multifator 3 da conta MySQL usada para se conectar ao servidor. A semântica desta opção é semelhante à semântica da opção `--password1`; consulte a descrição dessa opção para detalhes.
*  `--pipe`, `-W`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--pipe</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

No Windows, conecte-se ao servidor usando um pipe nomeado. Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por pipe nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
*  `--plugin-authentication-kerberos-client-mode=value`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-authentication-kerberos-client-mode</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>SSPI</code></td> </tr><tr><th>Valores válidos</th> <td><code>GSSAPI</code></td> </tr></tbody></table>

  No Windows, o plugin de autenticação `authentication_kerberos_client` suporta essa opção de plugin. Ele fornece dois valores possíveis que o usuário cliente pode definir em tempo de execução: `SSPI` e `GSSAPI`.

  O valor padrão para a opção de plugin do lado do cliente usa a Interface de Suporte de Serviços de Segurança (SSPI), que é capaz de adquirir credenciais do cache em memória do Windows. Alternativamente, o usuário cliente pode selecionar um modo que suporte a Interface de Programa de Aplicação de Serviços de Segurança Geral (GSSAPI) através da biblioteca MIT Kerberos no Windows. O GSSAPI é capaz de adquirir credenciais armazenadas anteriormente usando o comando `kinit`.

  Para mais informações, consulte Comandos para clientes do Windows no modo GSSAPI.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de diretório</td> </tr></tbody></table>

  O diretório onde procurar por plugins. Especifique esta opção se a opção `--default-auth` for usada para especificar um plugin de autenticação, mas o `mysqldump` não encontrá-lo. Veja a Seção 8.2.17, “Autenticação Personalizável”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--port=port_num</code></td> </tr><tr><th>Tipo</th> <td>Número</number></td> </tr><tr><th>Valor padrão</th> <td><code>3306</code></td> </tr></tbody></table>

  Para conexões TCP/IP, o número de porta a ser usado.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--protocol=tipo</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[ver texto]</code></td> </tr><tr><th>Valores válidos</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

  O protocolo de transporte a ser usado para se conectar ao servidor. É útil quando os outros parâmetros de conexão normalmente resultam no uso de um protocolo diferente do desejado. Para obter detalhes sobre os valores permitidos, consulte a Seção 6.2.7, “Protocolos de transporte de conexão”.
*  `--server-public-key-path=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--server-public-key-path=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho de um arquivo no formato PEM que contém uma cópia do lado do cliente da chave pública necessária pelo servidor para a troca de senhas com par de chaves RSA. Esta opção aplica-se a clientes que se autenticam com o plugin de autenticação `sha256_password` (desatualizado) ou `caching_sha2_password`. Esta opção é ignorada para contas que não se autenticam com um desses plugins. Também é ignorada se a troca de senhas com base em RSA não for usada, como é o caso quando o cliente se conecta ao servidor usando uma conexão segura.

  Se `--server-public-key-path=nome_arquivo` for fornecido e especificar um arquivo de chave pública válido, ele tem precedência sobre `--get-server-public-key`.

  Para `sha256_password` (desatualizado), esta opção aplica-se apenas se o MySQL foi compilado usando OpenSSL.

  Para obter informações sobre os plugins `sha256_password` e `caching_sha2_password`, consulte a Seção 8.4.1.3, “Autenticação substituível SHA-256”, e a Seção 8.4.1.2, “Autenticação substituível SHA-2”.
*  `--socket=caminho`, `-S caminho`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--socket={nome_arquivo|caminho_pipe}</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Para conexões com `localhost`, o arquivo de socket Unix a ser usado ou, no Windows, o nome do tubo nomeado a ser usado.

No Windows, essa opção só se aplica se o servidor foi iniciado com a variável de sistema `named_pipe` habilitada para suportar conexões por tubo nomeado. Além disso, o usuário que faz a conexão deve ser membro do grupo do Windows especificado pela variável de sistema `named_pipe_full_access_group`.
* `--ssl*`

  Opções que começam com `--ssl` especificam se conectar ao servidor usando criptografia e indicam onde encontrar as chaves e certificados SSL. Veja Opções de Comando para Conexões Criptografadas.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

  Controla se o modo FIPS deve ser habilitado no lado do cliente. A opção `--ssl-fips-mode` difere de outras opções `--ssl-xxx` porque não é usada para estabelecer conexões criptografadas, mas sim para afetar quais operações criptográficas devem ser permitidas. Veja Seção 8.8, “Suporte FIPS”.

  Esses valores de `--ssl-fips-mode` são permitidos:

  + `OFF`: Desabilitar o modo FIPS.
  + `ON`: Habilitar o modo FIPS.
  + `STRICT`: Habilitar o modo FIPS “estricto”.
  
  ::: info Nota

  Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `--ssl-fips-mode` é `OFF`. Nesse caso, definir `--ssl-fips-mode` para `ON` ou `STRICT` faz com que o cliente produza uma mensagem de aviso no início e opere no modo não FIPS.

  :::

  Esta opção está desatualizada. Espere que ela seja removida em uma versão futura do MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-ciphersuites=lista_de_cifra_suíte</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  As suíte de cifras permitidas para conexões criptografadas que utilizam TLSv1.3. O valor é uma lista de um ou mais nomes de suíte de cifra separados por vírgula. As suíte de cifra que podem ser nomeadas para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de Conexão Criptografada”.
*  `--tls-sni-servername=nome_do_servidor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-sni-servername=nome_do_servidor</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Quando especificado, o nome é passado para a biblioteca de API C `libmysqlclient` usando a opção `MYSQL_OPT_TLS_SNI_SERVERNAME` de `mysql_options()`. O nome do servidor não é case-sensitive. Para mostrar qual nome do servidor o cliente especificou para a sessão atual, se houver, verifique a variável `Tls_sni_server_name`.

  A Indicação de Nome do Servidor (SNI) é uma extensão do protocolo TLS (o OpenSSL deve ser compilado com extensões TLS para que esta opção funcione). A implementação do MySQL do SNI representa apenas o lado do cliente.
*  `--tls-version=lista_de_protocolos`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tls-version=lista_de_protocolos</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 ou superior)<code>TLSv1,TLSv1.1,TLSv1.2</code> (caso contrário)</td> </tr></tbody></table>

  Os protocolos TLS permitidos para conexões criptografadas. O valor é uma lista de um ou mais nomes de protocolo separados por vírgula. Os protocolos que podem ser nomeados para esta opção dependem da biblioteca SSL usada para compilar o MySQL. Para obter detalhes, consulte a Seção 8.3.2, “Protocolos e cifras TLS de Conexão Criptografada”.
*  `--user=nome_do_usuário`, `-u nome_do_usuário`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--user=nome_do_usuário</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  O nome do usuário da conta MySQL a ser usado para se conectar ao servidor.

  Se você estiver usando o plugin `Rewriter`, você deve conceder a este usuário o privilégio `SKIP_QUERY_REWRITE`.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr></tbody></table>

  O nível de compressão a ser usado para conexões ao servidor que utilizam o algoritmo de compressão `zstd`. Os níveis permitidos são de 1 a 22, com valores maiores indicando níveis crescentes de compressão. O nível de compressão padrão `zstd` é 3. O ajuste do nível de compressão não tem efeito em conexões que não utilizam compressão `zstd`.

  Para mais informações, consulte a Seção 6.2.8, “Controle de compressão de conexão”.

#### Opções de arquivo de opções

Essas opções são usadas para controlar quais arquivos de opções devem ser lidos.

*  `--defaults-extra-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Leia este arquivo de opções após o arquivo de opções globais, mas (no Unix) antes do arquivo de opções do usuário. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`nome_do_arquivo`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

  Para obter informações adicionais sobre esta e outras opções de arquivo de opções, consulte a Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--defaults-file=nome_do_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=nome_do_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

Use apenas o arquivo de opções fornecido. Se o arquivo não existir ou estiver inacessível, ocorrerá um erro. Se *`file_name`* não for um nome de caminho absoluto, ele será interpretado em relação ao diretório atual.

Exceção: Mesmo com `--defaults-file`, os programas cliente leem `.mylogin.cnf`.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--defaults-group-suffix=str`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`str`*. Por exemplo, o `mysqldump` normalmente lê os grupos `[client]` e `[mysqldump]`. Se esta opção for fornecida como `--defaults-group-suffix=_other`, o `mysqldump` também lê os grupos `[client_other]` e `[mysqldump_other]`.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--no-defaults`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

Não leia nenhum arquivo de opções. Se o inicialização do programa falhar devido à leitura de opções desconhecidas de um arquivo de opções, o `--no-defaults` pode ser usado para impedir que sejam lidas.

A exceção é que o arquivo `.mylogin.cnf` é lido em todos os casos, se existir. Isso permite que as senhas sejam especificadas de uma maneira mais segura do que na linha de comando, mesmo quando o `--no-defaults` é usado. Para criar `.mylogin.cnf`, use o utilitário `mysql_config_editor`. Veja Seção 6.6.7, “mysql_config_editor — Ferramenta de configuração do MySQL”.

Para obter informações adicionais sobre isso e outras opções de arquivo de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o manuseio de arquivos de opções”.
*  `--print-defaults`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Imprima o nome do programa e todas as opções que ele obtém de arquivos de opções.

  Para obter informações adicionais sobre essa e outras opções de arquivos de opções, consulte  Seção 6.2.2.3, “Opções de linha de comando que afetam o tratamento de arquivos de opções”.

#### Opções DDL

Os cenários de uso do `mysqldump` incluem configurar uma nova instância completa do MySQL (incluindo tabelas de banco de dados) e substituir dados dentro de uma instância existente por bancos de dados e tabelas existentes. As seguintes opções permitem que você especifique quais coisas devem ser desmontadas e configuradas ao restaurar um dump, codificando várias declarações DDL dentro do arquivo de dump.

*  `--add-drop-database`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Escreva uma declaração `DROP DATABASE` antes de cada declaração `CREATE DATABASE`. Essa opção é tipicamente usada em conjunto com a opção `--all-databases` ou `--databases` porque nenhuma declaração `CREATE DATABASE` é escrita a menos que uma dessas opções seja especificada.

  ::: info Nota

  No MySQL 8.4, o esquema `mysql` é considerado um esquema de sistema que não pode ser desativado por usuários finais. Se `--add-drop-database` for usado com `--all-databases` ou com `--databases` onde a lista de esquemas a serem descarregados inclui `mysql`, o arquivo de dump contém uma declaração `DROP DATABASE `mysql` `` que causa um erro quando o arquivo de dump é carregado novamente.

  Em vez disso, para usar `--add-drop-database`, use `--databases` com uma lista de esquemas a serem descarregados, onde a lista não inclui `mysql`.

  :::

*  `--add-drop-table`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Escreva uma declaração `DROP TABLE` antes de cada declaração `CREATE TABLE`.
*  `--add-drop-trigger`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-drop-trigger</code></td> </tr></tbody></table>

Escreva uma declaração `DROP TRIGGER` antes de cada declaração `CREATE TRIGGER`.
* `--all-tablespaces`, `-Y`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--all-tablespaces</code></td> </tr></tbody></table>

  Adicione a um dump de tabela todas as instruções SQL necessárias para criar quaisquer tablespaces usados por uma tabela `NDB`. Essas informações não são incluídas de outra forma na saída de `mysqldump`. Esta opção atualmente é relevante apenas para tabelas do NDB Cluster.
* `--no-create-db`, `-n`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-create-db</code></td> </tr></tbody></table>

  Suprima as declarações `CREATE DATABASE` que, de outra forma, seriam incluídas na saída se a opção `--databases` ou `--all-databases` for fornecida.
* `--no-create-info`, `-t`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-create-info</code></td> </tr></tbody></table>

  Não escreva declarações `CREATE TABLE` que criam cada tabela dumpada.

  ::: info Nota

  Esta opção *não* exclui declarações que criam grupos de arquivos de log ou tablespaces da saída do `mysqldump`; no entanto, você pode usar a opção `--no-tablespaces` para esse propósito.

  :::

* `--no-tablespaces`, `-y`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-tablespaces</code></td> </tr></tbody></table>

  Esta opção suprime todas as declarações `CREATE LOGFILE GROUP` e `CREATE TABLESPACE` na saída do `mysqldump`.
* `--replace`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--replace</code></td> </tr></tbody></table>

  Escreva declarações `REPLACE` em vez de declarações `INSERT`.

#### Opções de depuração

As seguintes opções imprimem informações de depuração, codificam informações de depuração no arquivo de dump ou permitem que a operação de dump prossiga independentemente de problemas potenciais.

* `--allow-keywords`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--allow-keywords</code></td> </tr></tbody></table>

Permita a criação de nomes de colunas que sejam palavras-chave. Isso funciona prefixando cada nome de coluna com o nome da tabela.
* `--comments`, `-i`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--comments</code></td> </tr></tbody></table>

  Escreva informações adicionais no arquivo de dump, como a versão do programa, a versão do servidor e o host. Esta opção está habilitada por padrão. Para suprimir essas informações adicionais, use `--skip-comments`.
* `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>d:t:o,/tmp/mysqldump.trace</code></td> </tr></tbody></table>

  Escreva um log de depuração. Uma string típica de `debug_options` é `d:t:o,file_name`. O valor padrão é `d:t:o,/tmp/mysqldump.trace`.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--debug-check`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima algumas informações de depuração quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--debug-info`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug-info</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações de depuração e estatísticas de uso de memória e CPU quando o programa sair.

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são compilados com esta opção.
* `--dump-date`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--dump-date</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Se a opção `--comments` for fornecida, o `mysqldump` produz um comentário no final do dump da seguinte forma:

  ```
  -- Dump completed on DATE
  ```

  No entanto, a data faz com que os arquivos de dump tomados em momentos diferentes pareçam diferentes, mesmo que os dados sejam idênticos. `--dump-date` e `--skip-dump-date` controlam se a data é adicionada ao comentário. O valor padrão é `--dump-date` (incluir a data no comentário). `--skip-dump-date` suprime a impressão da data.
*  `--force`, `-f`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--force</code></td> </tr></tbody></table>

  Ignorar todos os erros; continuar mesmo que um erro SQL ocorra durante um dump de tabela.

  Uma utilização para esta opção é fazer com que o `mysqldump` continue a executar mesmo quando encontra uma visão que se tornou inválida porque a definição faz referência a uma tabela que foi removida. Sem `--force`, o `mysqldump` sai com uma mensagem de erro. Com `--force`, o `mysqldump` imprime a mensagem de erro, mas também escreve um comentário SQL contendo a definição da visão na saída do dump e continua a executar.

  Se a opção `--ignore-error` também for fornecida para ignorar erros específicos, `--force` tem precedência.
*  `--log-error=nome_arquivo`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--log-error=nome_arquivo</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Registrar avisos e erros anexando-os ao arquivo nomeado. O valor padrão é não registrar.
*  `--skip-comments`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-comments</code></td> </tr></tbody></table>

  Consulte a descrição da opção `--comments`.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--verbose</code></td> </tr></tbody></table>

Modo verbose. Imprima mais informações sobre o que o programa faz.

#### Opções de Ajuda

As seguintes opções exibem informações sobre o próprio comando `mysqldump`.

*  `--help`, `-?`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair.
*  `--version`, `-V`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--version</code></td> </tr></tbody></table>

  Exibir informações de versão e sair.

#### Opções de Internacionalização

As seguintes opções alteram como o comando `mysqldump` representa dados de caracteres com configurações de idioma nacional.

*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--character-sets-dir=dir_name</code></td> </tr></tbody></table>

  Diretório onde os conjuntos de caracteres estão instalados. Veja a Seção 12.15, “Configuração de Conjunto de Caracteres”.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Tipo</th> <td>Nome de string</th> </tr><tr><th>Valor Padrão</th> <td><code>utf8</code></td> </tr></tbody></table>

  Use *`charset_name`* como o conjunto de caracteres padrão. Veja  Seção 12.15, “Configuração de Conjunto de Caracteres”. Se nenhum conjunto de caracteres for especificado, o `mysqldump` usa `utf8mb4`.
*  `--no-set-names`, `-N`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--no-set-names</code></td> </tr><tr><th>Desatualizado</th> <td>Sim</td> </tr></tbody></table>

  Desativa a configuração `--set-charset`, o mesmo que especificar `--skip-set-charset`.
*  `--set-charset`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--set-charset</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-set-charset</code></td> </tr></tbody></table>

Escreva `SET NAMES default_character_set` na saída. Esta opção está habilitada por padrão. Para suprimir a declaração `SET NAMES`, use `--skip-set-charset`.

#### Opções de Replicação

O comando `mysqldump` é frequentemente usado para criar uma instância vazia ou uma instância que inclui dados em um servidor de replicação em uma configuração de replicação. As seguintes opções se aplicam ao dumping e ao restauração de dados em servidores de origem de replicação e réplicas.

*  `--apply-replica-statements`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--apply-replica-statements</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Para um dump de replica produzido com a opção `--dump-replica`, esta opção adiciona uma declaração `STOP REPLICA` antes da declaração com as coordenadas do log binário e uma declaração `START REPLICA` no final da saída.
*  `--apply-slave-statements`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--apply-slave-statements</code></td> </tr><tr><th>Descontinuado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Esta é uma alias descontinuada para `--apply-replica-statements`.
*  `--delete-source-logs`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--delete-source-logs</code></td> </tr></tbody></table>

  Em um servidor de origem de replicação, exclua os logs binários enviando uma declaração `PURGE BINARY LOGS` para o servidor após realizar a operação de dump. As opções exigem o privilégio `RELOAD` além de privilégios suficientes para executar essa declaração. Esta opção habilita automaticamente `--source-data`.
*  `--delete-master-logs`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--delete-master-logs</code></td> </tr></tbody></table>

  Esta é uma alias descontinuada para `--delete-source-logs`.
*  `--dump-replica[=value]`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--dump-replica[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valores Válidos</th> <td><code>1</code><code>2</code></td> </tr></tbody></table>

  Esta opção é semelhante à `--source-data`, exceto que é usada para drenar um servidor replica para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma replica que tem a mesma fonte que o servidor drenado. A opção faz com que a saída do dump inclua uma declaração `ALTERAR FONTE DE REPLICA PARA`, que indica as coordenadas do log binário (nome do arquivo e posição) da fonte da replica drenada. A declaração `ALTERAR FONTE DE REPLICA PARA` lê os valores de `Relay_Master_Log_File` e `Exec_Master_Log_Pos` da saída do `SHOW REPLICA STATUS` e os usa para `SOURCE_LOG_FILE` e `SOURCE_LOG_POS`, respectivamente. Estas são as coordenadas do servidor de fonte de replicação de onde a replica começa a replicar.

  ::: info Nota

  Inconsistências na sequência de transações do log de retransmissão que foram executadas podem causar o uso da posição errada.

  :::

  `--dump-replica` faz com que as coordenadas da fonte sejam usadas em vez das do servidor drenado, como é feito pela opção `--source-data`. Além disso, especificar esta opção substitui a opção `--source-data`.

  Aviso

  `--dump-replica` não deve ser usado se o servidor onde o dump será aplicado usar `gtid_mode=ON` e `SOURCE_AUTO_POSITION=1`.

  O valor da opção é tratado da mesma maneira que para `--source-data`. Definir nenhum valor ou 1 faz com que uma declaração `ALTERAR FONTE DE REPLICA PARA` seja escrita no dump. Definir 2 faz com que a declaração seja escrita, mas encapsulada em comentários SQL. Tem o mesmo efeito que `--source-data` em termos de habilitar ou desabilitar outras opções e em como o bloqueio é tratado.

`--dump-replica` faz com que o `mysqldump` pare o fio de replicação SQL antes do dump e o reinicie novamente depois.

`--dump-replica` envia uma declaração `SHOW REPLICA STATUS` para o servidor para obter informações, então eles exigem privilégios suficientes para executar essa declaração.

As opções `--apply-replica-statements` e `--include-source-host-port` podem ser usadas em conjunto com `--dump-replica`.
*  `--dump-slave[=value]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--dump-slave[=value]</code></td> </tr><tr><th>Desativado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Numérico</th> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valores válidos</th> <td><code>1</code><code>2</code></td> </tr></tbody></table>

  Este é um alias desativado para `--dump-replica`.
*  `--include-source-host-port`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--include-source-host-port</code></td> </tr><tr><th>Tipo</th> <td>Booleano</th> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Aumenta as opções `SOURCE_HOST` e `SOURCE_PORT` para o nome do host e o número de porta TCP/IP da fonte da replica, na declaração `CHANGE REPLICATION SOURCE TO` em um dump de replica produzido com a opção `--dump-replica`.
*  `--include-master-host-port`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--include-master-host-port</code></td> </tr><tr><th>Desativado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</th> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Este é um alias desativado para `--include-source-host-port`.
*  `--master-data[=value]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--master-data[=value]</code></td> </tr><tr><th>Desativado</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Numérico</th> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valores válidos</th> <td><code>1</code><code>2</code></td> </tr></tbody></table>

Este é um alias desatualizado para `--source-data`.
* `--output-as-version=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--output-as-version=value</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>SERVER</code></td> </tr><tr><th>Valores válidos</th> <td><code>BEFORE_8_0_23</code><code>BEFORE_8_2_0</code></td> </tr></tbody></table>

  Determina o nível de terminologia utilizado para declarações relacionadas a réplicas e eventos, permitindo criar dumps compatíveis com versões mais antigas do MySQL que não aceitam a nova terminologia. Esta opção pode assumir qualquer um dos seguintes valores, com os efeitos descritos aqui:

  + `SERVER`: Lê a versão do servidor e usa as versões mais recentes de declarações compatíveis com essa versão. Este é o valor padrão.
  + `BEFORE_8_0_23`: As declarações de SQL de replicação que usam termos desatualizados, como “slave” e “master”, são escritas na saída no lugar daquelas que usam “replica” e “source”, como nas versões do MySQL anteriores a 8.0.23.

  Esta opção também duplica os efeitos de `BEFORE_8_2_0` na saída de `SHOW CREATE EVENT`.
  + `BEFORE_8_2_0`: Esta opção faz com que `SHOW CREATE EVENT` reflita como o evento teria sido criado em um servidor MySQL antes da versão 8.2.0, exibindo `DISABLE ON SLAVE` em vez de `DISABLE ON REPLICA`.

  Esta opção afeta a saída de `--events`, `--dump-replica`, `--source-data`, `--apply-replica-statements` e `--include-source-host-port`.
* `--source-data[=value]`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--source-data[=value]</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valores válidos</th> <td><code>1</code><code>2</code></td> </tr></tbody></table>

Usado para descartar um servidor de fonte de replicação para produzir um arquivo de dump que pode ser usado para configurar outro servidor como uma réplica do fonte. As opções fazem com que a saída do dump inclua uma declaração `ALTERAR FONTE DE REPLICA PARA`, que indica as coordenadas do log binário (nome do arquivo e posição) do servidor descartado. Essas são as coordenadas do servidor de fonte de replicação a partir das quais a réplica deve começar a replicar após você carregar o arquivo de dump na réplica.

Se o valor da opção for 2, a declaração `ALTERAR FONTE DE REPLICA PARA` é escrita como um comentário SQL e, portanto, é informativa apenas; não tem efeito quando o arquivo de dump é carregado novamente. Se o valor da opção for 1, a declaração não é escrita como um comentário e tem efeito quando o arquivo de dump é carregado novamente. Se nenhum valor de opção for especificado, o valor padrão é 1.

`--source-data` envia uma declaração `SHOW BINARY LOG STATUS` para o servidor para obter informações, então eles requerem privilégios suficientes para executar essa declaração. Esta opção também requer o privilégio `RELOAD` e o log binário deve estar habilitado.

`--source-data` desativa automaticamente `--lock-tables`. Eles também ativam `--lock-all-tables`, a menos que `--single-transaction` também seja especificado, caso em que uma bloqueio de leitura global é adquirido apenas por um curto período no início do dump (veja a descrição para `--single-transaction`). Em todos os casos, qualquer ação nos logs acontece no exato momento do dump.

Também é possível configurar uma réplica descarregando uma réplica existente da fonte, usando a opção `--dump-replica`, que substitui `--source-data`, fazendo com que ela seja ignorada.

* `--set-gtid-purged=value`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--set-gtid-purged=value</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>AUTO</code></td> </tr><tr><th>Valores Válidos</th> <td><code>OFF</code><code>ON</code><code>AUTO</code></td> </tr></tbody></table>

Esta opção é para servidores que usam replicação baseada em GTID ( `gtid_mode=ON`). Ela controla a inclusão de uma declaração `SET @@GLOBAL.gtid_purged` na saída do dump, que atualiza o valor de `gtid_purged` em um servidor onde o arquivo de dump é recarregado, para adicionar o conjunto de GTIDs da variável de sistema `gtid_executed` do servidor de origem. `gtid_purged` armazena os GTIDs de todas as transações que foram aplicadas no servidor, mas não existem em nenhum arquivo de log binário no servidor. O `mysqldump` adiciona, portanto, os GTIDs das transações que foram executadas no servidor de origem, para que o servidor de destino registre essas transações como aplicadas, embora não as tenha em seus logs binários. `--set-gtid-purged` também controla a inclusão de uma declaração `SET @@SESSION.sql_log_bin=0`, que desabilita o registro binário enquanto o arquivo de dump está sendo recarregado. Esta declaração impede que novos GTIDs sejam gerados e atribuídos às transações no arquivo de dump à medida que são executadas, para que os GTIDs originais das transações sejam usados.

Se você não definir a opção `--set-gtid-purged`, o padrão é que uma declaração `SET @@GLOBAL.gtid_purged` seja incluída na saída do dump se os GTIDs estiverem habilitados no servidor que você está fazendo backup, e o conjunto de GTIDs no valor global da variável de sistema `gtid_executed` não estiver vazio. Uma declaração `SET @@SESSION.sql_log_bin=0` também é incluída se os GTIDs estiverem habilitados no servidor.

Você pode substituir o valor de `gtid_purged` por um conjunto de GTIDs especificado ou adicionar um sinal de mais (+) à declaração para anexar um conjunto de GTIDs especificado ao conjunto de GTIDs que já é mantido por `gtid_purged`. A declaração `SET @@GLOBAL.gtid_purged` registrada pelo `mysqldump` inclui um sinal de mais (`+`) em um comentário específico da versão, para que o MySQL adicione o conjunto de GTIDs do arquivo de dump ao valor `gtid_purged` existente.

É importante notar que o valor que o `mysqldump` inclui para a declaração `SET @@GLOBAL.gtid_purged` inclui os GTIDs de todas as transações no conjunto `gtid_executed` do servidor, mesmo aquelas que alteraram partes suprimidas do banco de dados, ou outros bancos de dados no servidor que não foram incluídos em um dump parcial. Isso pode significar que, após o valor de `gtid_purged` ter sido atualizado no servidor onde o arquivo de dump é reexecutado, GTIDs estão presentes que não se relacionam com nenhum dado no servidor de destino. Se você não reexecutar mais arquivos de dump no servidor de destino, os GTIDs estranhos não causam problemas com o funcionamento futuro do servidor, mas tornam mais difícil comparar ou reconciliar conjuntos de GTIDs em diferentes servidores na topologia de replicação. Se você reexecutar um arquivo de dump adicional no servidor de destino que contém os mesmos GTIDs (por exemplo, outro dump parcial do mesmo servidor de origem), qualquer declaração `SET @@GLOBAL.gtid_purged` no segundo arquivo de dump falha. Neste caso, remova a declaração manualmente antes de reexecutar o arquivo de dump, ou produza o arquivo de dump sem a declaração.

  Se a declaração `SET @@GLOBAL.gtid_purged` não tivesse o resultado desejado no seu servidor de destino, você pode excluir a declaração da saída ou incluí-la, mas com um comentário para que não seja executada automaticamente. Você também pode incluir a declaração, mas editá-la manualmente no arquivo de dump para obter o resultado desejado.

  Os valores possíveis para a opção `--set-gtid-purged` são os seguintes:

  `AUTO`: O valor padrão. Se GTIDs estiverem habilitados no servidor que você está fazendo o backup e `gtid_executed` não estiver vazio, `SET @@GLOBAL.gtid_purged` é adicionado à saída, contendo o conjunto de GTIDs de `gtid_executed`. Se GTIDs estiverem habilitados, `SET @@SESSION.sql_log_bin=0` é adicionado à saída. Se GTIDs não estiverem habilitados no servidor, as declarações não são adicionadas à saída.

`OFF`: `SET @@GLOBAL.gtid_purged` não é adicionado ao resultado, e `SET @@SESSION.sql_log_bin=0` não é adicionado ao resultado. Para um servidor onde os GTIDs não estão em uso, use esta opção ou `AUTO`. Use esta opção apenas para um servidor onde os GTIDs estão em uso se você tiver certeza de que o conjunto de GTIDs necessário já está presente em `gtid_purged` no servidor de destino e não deve ser alterado, ou se você planeja identificar e adicionar manualmente quaisquer GTIDs ausentes.

`ON`: Se os GTIDs estiverem habilitados no servidor que você está fazendo backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio), e `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado. Um erro ocorre se você definir esta opção, mas os GTIDs não estiverem habilitados no servidor. Para um servidor onde os GTIDs estão em uso, use esta opção ou `AUTO`, a menos que você tenha certeza de que os GTIDs em `gtid_executed` não são necessários no servidor de destino.

`COMMENTED`: Se os GTIDs estiverem habilitados no servidor que você está fazendo backup, `SET @@GLOBAL.gtid_purged` é adicionado ao resultado (a menos que `gtid_executed` esteja vazio), mas está comentado. Isso significa que o valor de `gtid_executed` está disponível no resultado, mas nenhuma ação é realizada automaticamente quando o arquivo de dump é recarregado. `SET @@SESSION.sql_log_bin=0` é adicionado ao resultado, e não está comentado. Com `COMMENTED`, você pode controlar o uso do conjunto `gtid_executed` manualmente ou por meio da automação. Por exemplo, você pode preferir fazer isso se estiver migrando dados para outro servidor que já tem diferentes bancos de dados ativos.

#### Opções de Formato

As seguintes opções especificam como representar todo o arquivo de dump ou certos tipos de dados no arquivo de dump. Elas também controlam se certas informações opcionais são escritas no arquivo de dump.

*  `--compact`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--compact</code></td> </tr></tbody></table>

Produza uma saída mais compacta. Esta opção habilita as opções `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys` e `--skip-set-charset`.
*  `--compatible=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--compatible=name[,name,...]</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>''</code></td> </tr><tr><th>Valores válidos</th> <td><code>ansi</code></td> </tr></tbody></table>

  Produza uma saída mais compatível com outros sistemas de banco de dados ou com servidores MySQL mais antigos. O único valor permitido para esta opção é `ansi`, que tem o mesmo significado que a opção correspondente para definir o modo SQL do servidor. Consulte  Seção 7.1.11, “Modos SQL do Servidor”.
*  `--complete-insert`, `-c`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--complete-insert</code></td> </tr></tbody></table>

  Use instruções `INSERT` completas que incluam os nomes das colunas.
*  `--create-options`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--create-options</code></td> </tr></tbody></table>

  Inclua todas as opções de tabela específicas do MySQL nas instruções `CREATE TABLE`.
*  `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--fields-terminated-by=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table><table><tbody><tr><th>Formato de linha de comando</th> <td><code>--fields-enclosed-by=string</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table><table><tbody><tr><th>Formato de linha de comando</th> <td><code>--fields-optionally-enclosed-by=string</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table><table><tbody><tr><th>Formato de linha de comando</th> <td><code>--fields-escaped-by</code></td> </tr><tr><th>Tipo</th> <td><code>String</code></td> </tr></tbody></table>

Essas opções são usadas com a opção `--tab` e têm o mesmo significado das cláusulas correspondentes `FIELDS` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.
*  `--hex-blob`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--hex-blob</code></td> </tr></tbody></table>

  Exiba colunas binárias usando notação hexadecimal (por exemplo, `'abc'` se torna `0x616263`). Os tipos de dados afetados são `BINARY`, `VARBINARY`, `BLOB`, `BIT`, todos os tipos de dados espaciais e outros tipos de dados não binários quando usados com o conjunto de caracteres `binary`.

  A opção `--hex-blob` é ignorada quando a `--tab` é usada.
*  `--lines-terminated-by=...`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lines-terminated-by=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Esta opção é usada com a opção `--tab` e tem o mesmo significado que a cláusula correspondente `LINES` para `LOAD DATA`. Veja a Seção 15.2.9, “Instrução LOAD DATA”.
*  `--quote-names`, `-Q`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--quote-names</code></td> </tr><tr><th>Desabilitada por</th> <td><code>skip-quote-names</code></td> </tr></tbody></table>

  Cota os identificadores (como nomes de banco de dados, tabelas e colunas) dentro de caracteres ` `` ``. Se o modo SQL `ANSI_QUOTES` estiver habilitado, os identificadores são cotados dentro de caracteres `"`. Esta opção é habilitada por padrão. Pode ser desabilitada com `--skip-quote-names`, mas essa opção deve ser dada após qualquer opção como `--compatible` que possa habilitar `--quote-names`.
*  `--result-file=file_name`, `-r file_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--result-file=file_name</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  Saída direta para o arquivo nomeado. O arquivo de resultado é criado e seus conteúdos anteriores sobrescritos, mesmo que um erro ocorra durante a geração do dump.

Esta opção deve ser usada no Windows para evitar que os caracteres de nova linha `\n` sejam convertidos em sequências de retorno de carro/nova linha `\r\n`.
*  `--show-create-skip-secondary-engine=valor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--show-create-skip-secondary-engine</code></td> </tr></tbody></table>

  Exclui a cláusula `SECONDARY ENGINE` das instruções `CREATE TABLE`. Isso é feito habilitando a variável de sistema `show_create_table_skip_secondary_engine` durante a operação de dump. Alternativamente, você pode habilitar a variável de sistema `show_create_table_skip_secondary_engine` antes de usar o  `mysqldump`.
*  `--tab=nome_diretório`, `-T nome_diretório`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tab=nome_diretório</code></td> </tr><tr><th>Tipo</th> <td>Nome do diretório</td> </tr></tbody></table>

  Gera arquivos de dados no formato de texto com separadores de tabulação. Para cada tabela descarregada, o `mysqldump` cria um arquivo `tbl_name.sql` que contém a instrução `CREATE TABLE` que cria a tabela, e o servidor escreve um arquivo `tbl_name.txt` que contém seus dados. O valor da opção é o diretório onde os arquivos serão escritos.

  ::: info Nota

  Esta opção deve ser usada apenas quando o `mysqldump` é executado na mesma máquina que o servidor `mysqld`. Como o servidor cria arquivos `*.txt` no diretório que você especifica, o diretório deve ser legível pelo servidor e a conta MySQL que você usa deve ter o privilégio `FILE`. Como o `mysqldump` cria `*.sql` no mesmo diretório, ele deve ser legível pela conta de login do seu sistema.

  Por padrão, os arquivos de dados `.txt` são formatados usando caracteres de tabulação entre os valores das colunas e uma nova linha no final de cada linha. O formato pode ser especificado explicitamente usando as opções `--fields-xxx` e `--lines-terminated-by`.

  Os valores das colunas são convertidos para o conjunto de caracteres especificado pela opção `--default-character-set`.
*  `--tz-utc`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tz-utc</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-tz-utc</code></td> </tr></tbody></table>

  Esta opção permite que as colunas `TIMESTAMP` sejam descarregadas e recarregadas entre servidores em diferentes fusos horários. O `mysqldump` define seu fuso horário de conexão para UTC e adiciona `SET TIME_ZONE='+00:00'` ao arquivo de dump. Sem esta opção, as colunas `TIMESTAMP` são descarregadas e recarregadas nos fusos horários locais dos servidores de origem e destino, o que pode causar alterações nos valores se os servidores estiverem em fusos horários diferentes. `--tz-utc` também protege contra alterações devido ao horário de verão. `--tz-utc` está habilitado por padrão. Para desabilitá-lo, use `--skip-tz-utc`.
*  `--xml`, `-X`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--xml</code></td> </tr></tbody></table>

  Escreva a saída do dump como XML bem formado.

  **Valores `NULL`, `'NULL'` e Valores Vazios**: Para uma coluna chamada *`column_name`*, o valor `NULL`, uma string vazia e o valor da string `'NULL'` são distinguidos uns dos outros na saída gerada por esta opção da seguinte forma.

  <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Valor:</th> <th>Representação XML:</th> </tr></thead><tbody><tr> <td><code>NULL</code> (<span><em>valor desconhecido</em></span>)</td> <td><p> <code>&lt;field name="<em><code>column_name</code></em>" xsi:nil="true" /&gt;</code> </td> </tr><tr> <td><code>''</code> (<span><em>string vazia</em></span>)</td> <td><p> <code>&lt;field name="<em><code>column_name</code></em>"&gt;&lt;/field&gt;</code> </td> </tr><tr> <td><code>'NULL'</code> (<span><em>valor de string</em></span>)</td> <td><p> <code>&lt;field name="<em><code>column_name</code></em>"&gt;NULL&lt;/field&gt;</code> </td> </tr></tbody></table>

  A saída do cliente `mysql` quando executado com a opção `--xml` também segue as regras anteriores. (Veja a Seção 6.5.1.1, “Opções do Cliente `mysql`.”)

A saída XML do `mysqldump` inclui o namespace XML, como mostrado aqui:

```
  $> mysqldump --xml -u root world City
  <?xml version="1.0"?>
  <mysqldump xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <database name="world">
  <table_structure name="City">
  <field Field="ID" Type="int(11)" Null="NO" Key="PRI" Extra="auto_increment" />
  <field Field="Name" Type="char(35)" Null="NO" Key="" Default="" Extra="" />
  <field Field="CountryCode" Type="char(3)" Null="NO" Key="" Default="" Extra="" />
  <field Field="District" Type="char(20)" Null="NO" Key="" Default="" Extra="" />
  <field Field="Population" Type="int(11)" Null="NO" Key="" Default="0" Extra="" />
  <key Table="City" Non_unique="0" Key_name="PRIMARY" Seq_in_index="1" Column_name="ID"
  Collation="A" Cardinality="4079" Null="" Index_type="BTREE" Comment="" />
  <options Name="City" Engine="MyISAM" Version="10" Row_format="Fixed" Rows="4079"
  Avg_row_length="67" Data_length="273293" Max_data_length="18858823439613951"
  Index_length="43008" Data_free="0" Auto_increment="4080"
  Create_time="2007-03-31 01:47:01" Update_time="2007-03-31 01:47:02"
  Collation="latin1_swedish_ci" Create_options="" Comment="" />
  </table_structure>
  <table_data name="City">
  <row>
  <field name="ID">1</field>
  <field name="Name">Kabul</field>
  <field name="CountryCode">AFG</field>
  <field name="District">Kabol</field>
  <field name="Population">1780000</field>
  </row>

  ...

  <row>
  <field name="ID">4079</field>
  <field name="Name">Rafah</field>
  <field name="CountryCode">PSE</field>
  <field name="District">Rafah</field>
  <field name="Population">92020</field>
  </row>
  </table_data>
  </database>
  </mysqldump>
  ```

#### Opções de Filtragem

As seguintes opções controlam quais tipos de objetos do esquema são escritos no arquivo de dump: por categoria, como gatilhos ou eventos; por nome, por exemplo, escolhendo quais bancos de dados e tabelas serão dumpados; ou até mesmo filtrando linhas dos dados da tabela usando uma cláusula `WHERE`.

*  `--all-databases`, `-A`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Dumpar todas as tabelas em todos os bancos de dados. Isso é o mesmo que usar a opção `--databases` e nomear todos os bancos de dados na linha de comando.

  ::: info Nota

  Veja a descrição de `--add-drop-database` para informações sobre uma incompatibilidade dessa opção com `--all-databases`.

  :::

  Antes do MySQL 8.4, as opções `--routines` e `--events` para o `mysqldump` não eram necessárias para incluir rotinas e eventos armazenados ao usar a opção `--all-databases`: O dump incluía o banco de dados `mysql` do sistema e, portanto, também as tabelas `mysql.proc` e `mysql.event` que continham definições de rotinas e eventos armazenados. A partir do MySQL 8.4, as tabelas `mysql.event` e `mysql.proc` não são usadas. As definições dos objetos correspondentes são armazenadas em tabelas do dicionário de dados, mas essas tabelas não são dumpadas. Para incluir rotinas e eventos armazenados em um dump feito usando `--all-databases`, use as opções `--routines` e `--events` explicitamente.
*  `--databases`, `-B`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--databases</code></td> </tr></tbody></table>

  Dumpar vários bancos de dados. Normalmente, o `mysqldump` trata o argumento de nome no comando de linha de comando como um nome de banco de dados e os nomes seguintes como nomes de tabelas. Com essa opção, ele trata todos os argumentos de nome como nomes de bancos de dados. As instruções `CREATE DATABASE` e `USE` são incluídas na saída antes de cada novo banco de dados.

Esta opção pode ser usada para descartar o banco de dados `performance_schema`, que normalmente não é descartado mesmo com a opção `--all-databases`. (Use também a opção `--skip-lock-tables`.

::: info Nota

Consulte a descrição da opção `--add-drop-database` para obter informações sobre uma incompatibilidade dessa opção com `--databases`.

:::
*  `--events`, `-E`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--events</code></td> </tr></tbody></table>

  Inclua os eventos do Agendamento de Eventos nos arquivos de saída. Essa opção requer os privilégios `EVENT` para esses bancos de dados.

  A saída gerada usando `--events` contém instruções `CREATE EVENT` para criar os eventos.
*  `--ignore-error=error[,error]...`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ignore-error=error[,error]...</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Ignore os erros especificados. O valor da opção é uma lista de números de erro separados por vírgula, especificando os erros a serem ignorados durante a execução do `mysqldump`. Se a opção `--force` também for dada para ignorar todos os erros, a `--force` tem precedência.
*  `--ignore-table=db_name.tbl_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ignore-table=db_name.tbl_name</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Não descarte a tabela especificada, que deve ser especificada usando tanto os nomes do banco de dados quanto da tabela. Para ignorar múltiplas tabelas, use essa opção várias vezes. Essa opção também pode ser usada para ignorar visualizações.
*  `--ignore-views=boolean`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--ignore-views</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Ignora as visualizações de tabela no arquivo de dump.
*  `--init-command=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--init-command=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Instrução SQL única para executar após a conexão com o servidor MySQL. A definição reinicia as instruções existentes definidas por ela ou `init-command-add`.
*  `--init-command-add=str`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--init-command-add=str</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

  Adicione uma instrução SQL adicional para executar após a conexão ou reconexão com o servidor MySQL. É possível usá-la sem `--init-command`, mas não terá efeito se usada antes dele, pois `init-command` reinicia a lista de comandos a serem chamados.
*  `--no-data`, `-d`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-data</code></td> </tr></tbody></table>

  Não escreva informações de linha de tabela (ou seja, não descarte o conteúdo da tabela). Isso é útil se você quiser descarregar apenas a instrução `CREATE TABLE` da tabela (por exemplo, para criar uma cópia vazia da tabela carregando o arquivo de descarte).
*  `--routines`, `-R`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--routines</code></td> </tr></tbody></table>

  Inclua rotinas armazenadas (procedimentos e funções) para as bases de dados descarregadas na saída. Esta opção requer o privilégio global `SELECT`.

  A saída gerada usando `--routines` contém instruções `CREATE PROCEDURE` e `CREATE FUNCTION` para criar as rotinas.
*  `--skip-generated-invisible-primary-key`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-generated-invisible-primary-key</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Esta opção faz com que as chaves primárias invisíveis geradas sejam excluídas da saída. Para mais informações, consulte a Seção 15.1.20.11, “Chaves Primárias Invisíveis Geradas”.
*  `--tables`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--tables</code></td> </tr></tbody></table>

Supere a opção `--databases` ou `-B`. O `mysqldump` considera todos os argumentos de nome após a opção como nomes de tabela.
* `--triggers`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--triggers</code></td> </tr><tr><th>Desativado por</th> <td><code>skip-triggers</code></td> </tr></tbody></table>

  Inclua os gatilhos para cada tabela descarregada na saída. Esta opção está habilitada por padrão; desabilite-a com `--skip-triggers`.

  Para poder descarregar os gatilhos de uma tabela, você deve ter o privilégio `TRIGGER` para a tabela.

  Múltiplos gatilhos são permitidos. O `mysqldump` descarrega os gatilhos na ordem de ativação, para que, quando o arquivo de descarregamento for recarregado, os gatilhos sejam criados na mesma ordem de ativação. No entanto, se um arquivo de descarregamento do `mysqldump` contiver múltiplos gatilhos para uma tabela que têm o mesmo evento de gatilho e hora de ação, ocorrerá um erro para tentativas de carregar o arquivo de descarregamento em um servidor mais antigo que não suporte múltiplos gatilhos. (Para uma solução alternativa, consulte Notas de Desempenho; você pode converter os gatilhos para serem compatíveis com servidores mais antigos.)
* `--where='where_condition'`, `-w 'where_condition'`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--where='where_condition'</code></td> </tr></tbody></table>

  Descarregue apenas as linhas selecionadas pela condição `WHERE` dada. As aspas ao redor da condição são obrigatórias se ela contiver espaços ou outros caracteres que são especiais para o interpretador de comandos.

  Exemplos:

  ```
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Opções de desempenho

As seguintes opções são as mais relevantes para o desempenho, particularmente das operações de restauração. Para conjuntos de dados grandes, a operação de restauração (processamento das instruções `INSERT` no arquivo de descarregamento) é a parte mais demorada. Quando é urgente restaurar os dados rapidamente, planeje e teste o desempenho desta etapa com antecedência. Para tempos de restauração medidos em horas, você pode preferir uma solução de backup e restauração alternativa, como o MySQL Enterprise Backup para bancos de dados `InnoDB` e de uso misto.

O desempenho também é afetado pelas opções de transação, principalmente para a operação de dump.

*  `--column-statistics`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--column-statistics</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Adicione  declarações `ANALYZE TABLE` à saída para gerar estatísticas de histogramas para tabelas descarregadas quando o arquivo de dump for carregado novamente. Esta opção é desabilitada por padrão porque a geração de histogramas para tabelas grandes pode levar muito tempo.
*  `--disable-keys`, `-K`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--disable-keys</code></td> </tr></tbody></table>

  Para cada tabela, rode as declarações `INSERT` com as declarações `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` e `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;`. Isso torna o carregamento do arquivo de dump mais rápido porque os índices são criados após todas as linhas serem inseridas. Esta opção é eficaz apenas para índices não únicos de tabelas `MyISAM`.
*  `--extended-insert`, `-e`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--extended-insert</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-extended-insert</code></td> </tr></tbody></table>

  Escreva declarações `INSERT` usando sintaxe de múltiplas linhas que incluem várias listas de `VALUES`. Isso resulta em um arquivo de dump menor e acelera as inserções quando o arquivo é carregado novamente.
*  `--insert-ignore`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--insert-ignore</code></td> </tr></tbody></table>

  Escreva declarações `INSERT IGNORE` em vez de declarações `INSERT`.
*  `--max-allowed-packet=value`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--max-allowed-packet=value</code></td> </tr><tr><th>Tipo</th> <td>Numeric</td> </tr><tr><th>Valor padrão</th> <td><code>25165824</code></td> </tr></tbody></table>

  O tamanho máximo do buffer para a comunicação cliente/servidor. O padrão é 24MB, o máximo é 1GB.

::: info Nota

O valor desta opção é específico para o `mysqldump` e não deve ser confundido com a variável de sistema `max_allowed_packet` do servidor MySQL; o valor do servidor não pode ser excedido por um único pacote do `mysqldump`, independentemente de qualquer configuração para a opção `mysqldump`, mesmo que esta seja maior.

:::
*  `--mysqld-long-query-time=valor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--mysqld-long-query-time=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>Configuração global do servidor</code></td> </tr></tbody></table>

  Defina o valor de sessão da variável de sistema `long_query_time`. Use esta opção se quiser aumentar o tempo permitido para consultas do `mysqldump` antes que sejam registradas no arquivo de log de consultas lentas. O `mysqldump` realiza uma varredura completa da tabela, o que significa que suas consultas podem frequentemente exceder um ajuste global de `long_query_time` que é útil para consultas regulares. O ajuste global padrão é de 10 segundos.

  Você pode usar `--mysqld-long-query-time` para especificar um valor de sessão de 0 (o que significa que cada consulta do `mysqldump` é registrada no log de consultas lentas) a 31536000, que é de 365 dias em segundos. Para a opção do `mysqldump`, você só pode especificar segundos inteiros. Quando você não especifica esta opção, o ajuste global do servidor aplica-se às consultas do `mysqldump`.
*  `--net-buffer-length=valor`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--net-buffer-length=valor</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td><code>16384</code></td> </tr></tbody></table>

  O tamanho inicial do buffer para a comunicação cliente/servidor. Ao criar declarações de inserção de múltiplas linhas (como com a opção `--extended-insert` ou `--opt`), o `mysqldump` cria linhas de até `--net-buffer-length` bytes de comprimento. Se você aumentar esta variável, certifique-se de que a variável de sistema `net_buffer_length` do servidor MySQL tenha um valor pelo menos tão grande.
*  `--network-timeout`, `-M`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--network-timeout[={0|1}]</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Ative a exclusão de grandes tabelas definindo `--max-allowed-packet` no seu valor máximo e os timeout de leitura e escrita de rede para um valor grande. Esta opção está habilitada por padrão. Para desabilitá-la, use `--skip-network-timeout`.
*  `--opt`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--opt</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-opt</code></td> </tr></tbody></table>

  Esta opção, habilitada por padrão, é uma abreviação da combinação de `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. Ela oferece uma operação de exclusão rápida e produz um arquivo de exclusão que pode ser carregado rapidamente em um servidor MySQL.

  Como a opção `--opt` está habilitada por padrão, você especifica apenas seu oposto, o `--skip-opt` para desativar várias configurações padrão. Consulte a discussão sobre os grupos de opções do `mysqldump` para obter informações sobre como habilitar ou desabilitar seletivamente um subconjunto das opções afetadas por `--opt`.
*  `--quick`, `-q`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--quick</code></td> </tr><tr><th>Desabilitado por</th> <td><code>skip-quick</code></td> </tr></tbody></table>

  Esta opção é útil para a exclusão de grandes tabelas. Ela obriga o `mysqldump` a recuperar linhas de uma tabela do servidor uma linha de cada vez, em vez de recuperar o conjunto de linhas inteiro e bufferá-lo na memória antes de gravá-lo.
*  `--skip-opt`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--skip-opt</code></td> </tr></tbody></table>

  Consulte a descrição da opção `--opt`.

#### Opções Transacionais

As seguintes opções fazem um trade-off entre o desempenho da operação de exclusão e a confiabilidade e consistência dos dados exportados.

*  `--add-locks`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Certifique-se de envolver cada dump de tabela com as instruções `LOCK TABLES` e `UNLOCK TABLES`. Isso resulta em inserções mais rápidas quando o arquivo de dump é recarregado.
*  `--flush-logs`, `-F`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--flush-logs</code></td> </tr></tbody></table>

  Esvazie os arquivos de log do servidor MySQL antes de iniciar o dump. Esta opção requer o privilégio `RELOAD`. Se você usar esta opção em combinação com a opção `--all-databases`, os logs são esvaziados *para cada banco de dados excluído*. A exceção é quando você usa `--lock-all-tables`, `--source-data` ou `--single-transaction`. Nesses casos, os logs são esvaziados apenas uma vez, correspondendo ao momento em que todas as tabelas são bloqueadas por `FLUSH TABLES WITH READ LOCK`. Se você deseja que o dump e o esvaziamento do log ocorram exatamente no mesmo momento, você deve usar `--flush-logs` junto com `--lock-all-tables`, `--source-data` ou `--single-transaction`.
*  `--flush-privileges`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--flush-privileges</code></td> </tr></tbody></table>

  Adicione uma instrução `FLUSH PRIVILEGES` à saída do dump após o dump do banco de dados `mysql`. Esta opção deve ser usada sempre que o dump contiver o banco de dados `mysql` e qualquer outro banco de dados que dependa dos dados no banco de dados `mysql` para a restauração adequada.

  Como o arquivo de dump contém uma instrução `FLUSH PRIVILEGES`, a recarga do arquivo requer privilégios suficientes para executar essa instrução.
*  `--lock-all-tables`, `-x`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-all-tables</code></td> </tr></tbody></table>

  Bloqueie todas as tabelas em todos os bancos de dados. Isso é alcançado ao adquirir um bloqueio de leitura global por toda a duração do dump. Esta opção desativa automaticamente `--single-transaction` e `--lock-tables`.
*  `--lock-tables`, `-l`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--lock-tables</code></td> </tr></tbody></table>

  Para cada banco de dados descarregado, bloqueie todas as tabelas a serem descarregadas antes de descarregá-las. As tabelas são bloqueadas com `READ LOCAL` para permitir inserções concorrentes no caso de tabelas `MyISAM`. Para tabelas transacionais, como `InnoDB`, `--single-transaction` é uma opção muito melhor do que `--lock-tables` porque não precisa bloquear as tabelas.

  Como `--lock-tables` bloqueia as tabelas para cada banco de dados separadamente, essa opção não garante que as tabelas no arquivo de dump estejam logicamente consistentes entre os bancos de dados. Tabelas em diferentes bancos de dados podem ser descarregadas em estados completamente diferentes.

  Algumas opções, como `--opt`, habilitam automaticamente `--lock-tables`. Se você quiser sobrescrevê-la, use `--skip-lock-tables` no final da lista de opções.
*  `--no-autocommit`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-autocommit</code></td> </tr></tbody></table>

  Envolva as instruções `INSERT` para cada tabela descarregada dentro de `SET autocommit = 0` e as instruções `COMMIT`.
*  `--order-by-primary`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--order-by-primary</code></td> </tr></tbody></table>

  Descarregue as linhas de cada tabela ordenadas por sua chave primária, ou pelo seu primeiro índice único, se houver. Isso é útil ao descarregar uma tabela `MyISAM` para ser carregada em uma tabela `InnoDB`, mas faz com que a operação de descarregamento demore consideravelmente mais tempo.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Especifico para a plataforma</th> <td>Windows</td> </tr></tbody></table>

  Em Windows, o nome da memória compartilhada a ser usado para conexões feitas usando memória compartilhada com um servidor local. O valor padrão é `MYSQL`. O nome da memória compartilhada é sensível a maiúsculas e minúsculas.

Esta opção só se aplica se o servidor foi iniciado com a variável de sistema `shared_memory` habilitada para suportar conexões de memória compartilhada.
*  `--single-transaction`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--single-transaction</code></td> </tr></tbody></table>

  Esta opção define o modo de isolamento de transação para `REPEATABLE READ` e envia uma instrução SQL `START TRANSACTION` para o servidor antes de drenar os dados. É útil apenas com tabelas transacionais, como `InnoDB`, porque, nesse caso, drenar o estado consistente do banco de dados no momento em que a instrução `START TRANSACTION` foi emitida, sem bloquear nenhuma aplicação.

  O privilégio `RELOAD` ou `FLUSH_TABLES` é necessário com `--single-transaction` se `gtid_mode=ON` e `gtid_purged=ON|AUTO`.

  Ao usar esta opção, você deve ter em mente que apenas as tabelas `InnoDB` são descarregadas em um estado consistente. Por exemplo, quaisquer tabelas `MyISAM` ou `MEMORY` descarregadas enquanto estiver usando esta opção ainda podem mudar de estado.

  Enquanto um descarregamento `--single-transaction` estiver em andamento, para garantir um arquivo de descarregamento válido (conteúdo correto da tabela e coordenadas do log binário), nenhuma outra conexão deve usar as seguintes instruções: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. Uma leitura consistente não é isolada dessas instruções, então o uso delas em uma tabela a ser descarregada pode fazer com que o `SELECT` realizado pelo `mysqldump` retorne o conteúdo incorreto ou falhe.

  A opção `--single-transaction` e a opção `--lock-tables` são mutuamente exclusivas porque `LOCK TABLES` faz com que quaisquer transações pendentes sejam implicitamente comprometidas.

  Para descarregar tabelas grandes, combine a opção `--single-transaction` com a opção `--quick`.
#### Grupos de opções

* A opção `--opt` habilita várias configurações que trabalham juntas para realizar uma operação de dump rápida. Todas essas configurações estão ativadas por padrão, porque `--opt` está ativado por padrão. Assim, você raramente, ou nunca, especifica `--opt`. Em vez disso, você pode desativar essas configurações como um grupo, especificando `--skip-opt`, e, opcionalmente, reativar certas configurações especificando as opções associadas mais tarde na linha de comando.
* A opção `--compact` desativa várias configurações que controlam se declarações opcionais e comentários aparecem na saída. Novamente, você pode seguir essa opção com outras opções que reativam certas configurações, ou ativar todas as configurações usando a forma `--skip-compact`.

Quando você habilita ou desabilita seletivamente o efeito de uma opção de grupo, a ordem é importante, pois as opções são processadas da primeira à última. Por exemplo, `--disable-keys` `--lock-tables` `--skip-opt` não teria o efeito desejado; é a mesma coisa que `--skip-opt` por si só.

#### Exemplos

Para fazer um backup de um banco de dados inteiro:

```
mysqldump db_name > backup-file.sql
```

Para carregar o arquivo de dump de volta no servidor:

```
mysql db_name < backup-file.sql
```

Outra maneira de recarregar o arquivo de dump:

```
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

O `mysqldump` também é muito útil para preencher bancos de dados copiando dados de um servidor MySQL para outro:

```
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

Você pode fazer um dump de vários bancos de dados com um comando:

```
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

Para fazer um dump de todos os bancos de dados, use a opção `--all-databases`:

```
mysqldump --all-databases > all_databases.sql
```

Para tabelas `InnoDB`, o `mysqldump` fornece uma maneira de fazer um backup online:

```
mysqldump --all-databases --source-data --single-transaction > all_databases.sql
```

Este backup obtém um bloqueio de leitura global em todas as tabelas (usando `FLUSH TABLES WITH READ LOCK`) no início do dump. Assim que esse bloqueio é adquirido, os códigos de coordenação do log binário são lidos e o bloqueio é liberado. Se declarações de atualização longas estiverem em execução quando a instrução `FLUSH` for emitida, o servidor MySQL pode ficar parado até que essas declarações sejam concluídas. Após isso, o dump se torna livre de bloqueios e não interfere em leituras e escritas nas tabelas. Se as declarações de atualização que o servidor MySQL recebe forem curtas (em termos de tempo de execução), o período inicial de bloqueio não deve ser perceptível, mesmo com muitas atualizações.

Para a recuperação em um ponto no tempo (também conhecida como “roll-forward”, quando você precisa restaurar um backup antigo e refazer as alterações que ocorreram desde esse backup), muitas vezes é útil rotular o log binário (veja a Seção 7.4.4, “O Log Binário”) ou pelo menos conhecer as coordenadas do log binário a que o dump corresponde:

```
mysqldump --all-databases --source-data=2 > all_databases.sql
```

Ou:

```
mysqldump --all-databases --flush-logs --source-data=2 > all_databases.sql
```

A opção `--source-data` pode ser usada simultaneamente com a opção `--single-transaction`, o que fornece uma maneira conveniente de fazer um backup online adequado para uso antes da recuperação em um ponto no tempo, se as tabelas forem armazenadas usando o motor de armazenamento `InnoDB`.

Para mais informações sobre fazer backups, consulte a Seção 9.2, “Métodos de Backup de Banco de Dados”, e a Seção 9.3, “Estratégia de Backup e Recuperação Exemplo”.

* Para selecionar o efeito de `--opt` exceto por algumas funcionalidades, use a opção `--skip` para cada funcionalidade. Para desabilitar inserções extensas e bufferização de memória, use `--opt` `--skip-extended-insert` `--skip-quick`. (Na verdade, `--skip-extended-insert` `--skip-quick` é suficiente porque `--opt` está ativado por padrão.)
* Para reverter `--opt` para todas as funcionalidades exceto a desativação de índices e bloqueio de tabelas, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrições

O `mysqldump` não exclui o esquema `performance_schema` ou `sys` por padrão. Para excluí-los, nomeie-os explicitamente na linha de comando. Você também pode nomeá-los com a opção `--databases`. Para `performance_schema`, use também a opção `--skip-lock-tables`.

O `mysqldump` não exclui o esquema `INFORMATION_SCHEMA`.

O `mysqldump` não exclui os comandos `CREATE TABLESPACE` do InnoDB.

O `mysqldump` não exclui o banco de dados de informações do NDB Cluster `ndbinfo`.

O `mysqldump` inclui instruções para recriar as tabelas `general_log` e `slow_query_log` para exclusões do banco de dados `mysql`. O conteúdo das tabelas de log não é excluído.

Se você encontrar problemas ao fazer backup de visualizações devido a privilégios insuficientes, consulte a Seção 27.9, “Restrições sobre visualizações” para uma solução alternativa.