### 6.1.6 Considerações de Segurança para LOAD DATA LOCAL

A instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") carrega um arquivo de dados em uma table. A instrução pode carregar um arquivo localizado no host do Server ou, se a palavra-chave `LOCAL` for especificada, no host do Client.

A versão `LOCAL` de [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") apresenta dois problemas de segurança potenciais:

* Como [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") é uma instrução SQL, a análise (parsing) ocorre no lado do Server, e a transferência do arquivo do host do Client para o host do Server é iniciada pelo MySQL Server, que informa ao Client o arquivo nomeado na instrução. Em teoria, um Server modificado (patched) poderia instruir o programa Client a transferir um arquivo de escolha do Server, em vez do arquivo nomeado na instrução. Tal Server poderia acessar qualquer arquivo no host do Client ao qual o usuário do Client tenha acesso de leitura. (Um Server modificado poderia, de fato, responder com uma solicitação de transferência de arquivo a qualquer instrução, não apenas a [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement"), então uma questão mais fundamental é que os Clients não devem se conectar a Servers não confiáveis.)

* Em um ambiente Web onde os Clients estão se conectando a partir de um Web Server, um usuário poderia usar [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") para ler quaisquer arquivos aos quais o processo do Web Server tenha acesso de leitura (assumindo que um usuário possa executar qualquer instrução contra o SQL Server). Neste ambiente, o Client em relação ao MySQL Server é, na verdade, o Web Server, e não um programa remoto sendo executado por usuários que se conectam ao Web Server.

Para evitar a conexão a Servers não confiáveis, os Clients podem estabelecer uma conexão segura e verificar a identidade do Server conectando-se usando a opção [`--ssl-mode=VERIFY_IDENTITY`](connection-options.html#option_general_ssl-mode) e o certificado CA apropriado. Para implementar este nível de verificação, você deve primeiro garantir que o certificado CA para o Server esteja confiavelmente disponível para a replica, caso contrário, problemas de disponibilidade ocorrerão. Para mais informações, consulte [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

Para evitar problemas com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), os Clients devem evitar usar `LOCAL`.

Administradores e aplicações podem configurar se o carregamento local de dados deve ser permitido da seguinte forma:

* No lado do Server:

  + A System Variable [`local_infile`](server-system-variables.html#sysvar_local_infile) controla a capacidade `LOCAL` do lado do Server. Dependendo da configuração de [`local_infile`](server-system-variables.html#sysvar_local_infile), o Server recusa ou permite o carregamento local de dados por Clients que solicitam o carregamento local de dados.

  + Por padrão, [`local_infile`](server-system-variables.html#sysvar_local_infile) está habilitado (enabled). Para fazer com que o Server recuse ou permita explicitamente as instruções [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") (independentemente de como os programas e bibliotecas Client estejam configurados em tempo de build ou runtime), inicie o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com [`local_infile`](server-system-variables.html#sysvar_local_infile) desabilitado (disabled) ou habilitado. [`local_infile`](server-system-variables.html#sysvar_local_infile) também pode ser definido em runtime.

* No lado do Client:

  + A opção **CMake** [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) controla a capacidade `LOCAL` padrão compilada para a biblioteca Client do MySQL (consulte [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options")). Os Clients que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desabilitada ou habilitada de acordo com a configuração de [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) especificada no tempo de build do MySQL.

  + Por padrão, a biblioteca Client nas distribuições binárias do MySQL é compilada com [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) habilitado. Se você compilar o MySQL a partir do source, configure-o com [`ENABLED_LOCAL_INFILE`](source-configuration-options.html#option_cmake_enabled_local_infile) desabilitado ou habilitado, dependendo se os Clients que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desabilitada ou habilitada.

  + Para programas Client que usam a C API, a capacidade de carregamento local de dados é determinada pelo padrão compilado na biblioteca Client do MySQL. Para habilitá-la ou desabilitá-la explicitamente, invoque a função C API [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) para desabilitar ou habilitar a opção `MYSQL_OPT_LOCAL_INFILE`. Consulte [mysql_options()](/doc/c-api/5.7/en/mysql-options.html).

  + Para o Client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), a capacidade de carregamento local de dados é determinada pelo padrão compilado na biblioteca Client do MySQL. Para desabilitá-la ou habilitá-la explicitamente, use a opção [`--local-infile=0`](mysql-command-options.html#option_mysql_local-infile) ou [`--local-infile[=1]`](mysql-command-options.html#option_mysql_local-infile).

  + Para o Client [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program"), o carregamento local de dados não é usado por padrão. Para desabilitá-lo ou habilitá-lo explicitamente, use a opção [`--local=0`](mysqlimport.html#option_mysqlimport_local) ou [`--local[=1]`](mysqlimport.html#option_mysqlimport_local).

  + Se você usar [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") em scripts Perl ou outros programas que leem o grupo `[client]` dos option files, você pode adicionar uma configuração de opção `local-infile` a esse grupo. Para evitar problemas para programas que não entendem esta opção, especifique-a usando o prefixo [`loose-`](option-modifiers.html "4.2.2.4 Program Option Modifiers"):

    ```sql
    [client]
    loose-local-infile=0
    ```

    ou:

    ```sql
    [client]
    loose-local-infile=1
    ```

  + Em todos os casos, o uso bem-sucedido de uma operação de carregamento `LOCAL` por um Client também exige que o Server permita o carregamento local.

Se a capacidade `LOCAL` estiver desabilitada, seja no lado do Server ou do Client, um Client que tentar emitir uma instrução [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") receberá a seguinte mensagem de erro:

```sql
ERROR 1148: The used command is not allowed with this MySQL version
```

#### MySQL Shell e Carregamento Local de Dados

O MySQL Shell fornece uma série de Utilities para fazer Dump de tables, Schemas ou Server Instances e carregá-los em outras Instances. Ao usar esses Utilities para manipular os dados, o MySQL Shell fornece funções adicionais, como pré-processamento de input, carregamento paralelo multithreaded, compressão e descompressão de arquivos, e gerenciamento de acesso a Oracle Cloud Infrastructure Object Storage buckets. Para obter a melhor funcionalidade, use sempre a versão mais recente disponível dos Utilities de dump e dump loading do MySQL Shell.

Os Utilities de upload de dados do MySQL Shell usam instruções [`LOAD DATA LOCAL INFILE`](load-data.html "13.2.6 LOAD DATA Statement") para fazer o upload de dados, portanto, a System Variable [`local_infile`](server-system-variables.html#sysvar_local_infile) deve ser definida como `ON` na target Server Instance. Você pode fazer isso antes de fazer o upload dos dados e revertê-lo novamente depois. Os Utilities lidam com as solicitações de transferência de arquivo de forma segura para abordar as considerações de segurança discutidas neste tópico.

O MySQL Shell inclui os seguintes Utilities de dump e dump loading:

Utility de exportação de Table `util.exportTable()` : Exporta uma Table relacional MySQL para um arquivo de dados, que pode ser carregado em um MySQL Server Instance usando o utility de importação paralela de Table do MySQL Shell, importado para uma aplicação diferente, ou usado como um Backup lógico. O Utility possui opções predefinidas e opções de customização para produzir diferentes formatos de output.

Utility de importação paralela de Table `util.importTable()` : Importa um arquivo de dados para uma Table relacional MySQL. O arquivo de dados pode ser o output do utility de exportação de Table do MySQL Shell ou outro formato suportado pelas opções predefinidas e de customização do utility. O utility pode realizar o pré-processamento de input antes de adicionar os dados à Table. Ele pode aceitar múltiplos arquivos de dados para merge em uma única Table relacional e descompacta automaticamente arquivos comprimidos.

Utility de Dump de Instance `util.dumpInstance()`, Utility de Dump de Schema `util.dumpSchemas()`, e Utility de Dump de Table `util.dumpTables()` : Exportam uma Instance, Schema ou Table para um conjunto de Dump Files, que podem então ser carregados em uma MySQL Instance usando o Utility de Dump Loading do MySQL Shell. Os Utilities fornecem streaming para Oracle Cloud Infrastructure Object Storage, verificações e modificações de compatibilidade com MySQL HeatWave Service, e a capacidade de realizar um dry run para identificar problemas antes de prosseguir com o Dump.

Utility de Dump Loading `util.loadDump()` : Importa Dump Files criados usando o Utility de Dump de Instance, Schema ou Table do MySQL Shell para um MySQL HeatWave Service DB System ou um MySQL Server Instance. O Utility gerencia o processo de upload e fornece data streaming de storage remoto, carregamento paralelo de Tables ou Table Chunks, rastreamento de estado de progresso (progress state tracking), capacidade de resume e reset, e a opção de carregamento concorrente enquanto o Dump ainda está em andamento. O utility de importação paralela de Table do MySQL Shell pode ser usado em combinação com o Utility de Dump Loading para modificar dados antes de carregá-los na target MySQL Instance.

Para detalhes sobre os Utilities, consulte [MySQL Shell Utilities](/doc/mysql-shell/8.0/en/mysql-shell-utilities.html).