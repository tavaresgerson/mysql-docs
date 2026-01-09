### 8.1.6 Considerações de segurança para LOAD DATA LOCAL

A instrução `LOAD DATA` carrega um arquivo de dados para uma tabela. A instrução pode carregar um arquivo localizado no host do servidor ou, se a palavra-chave `LOCAL` for especificada, no host do cliente.

A versão `LOCAL` da instrução `LOAD DATA` tem dois problemas de segurança potenciais:

* Como a instrução `LOAD DATA LOCAL` é uma instrução SQL, a análise ocorre no lado do servidor, e a transferência do arquivo do host do cliente para o host do servidor é iniciada pelo servidor MySQL, que informa ao cliente o nome do arquivo mencionado na instrução. Teoricamente, um servidor com correções poderia informar ao programa cliente para transferir um arquivo escolhido pelo servidor, em vez do arquivo mencionado na instrução. Um servidor com essas correções poderia acessar qualquer arquivo no host do cliente ao qual o usuário cliente tenha acesso de leitura. (Um servidor com correções poderia, de fato, responder com uma solicitação de transferência de arquivo para qualquer instrução, não apenas `LOAD DATA LOCAL`, portanto, um problema mais fundamental é que os clientes não devem se conectar a servidores não confiáveis.)

* Em um ambiente Web, onde os clientes estão se conectando a partir de um servidor Web, um usuário poderia usar `LOAD DATA LOCAL` para ler quaisquer arquivos que o servidor Web tenha acesso de leitura (assumindo que um usuário pudesse executar qualquer instrução contra o servidor SQL). Nesse ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor Web, e não um programa remoto executado por usuários que se conectam ao servidor Web.

Para evitar a conexão com servidores não confiáveis, os clientes podem estabelecer uma conexão segura e verificar a identidade do servidor conectando-se usando a opção `--ssl-mode=VERIFY_IDENTITY` e o certificado CA apropriado. Para implementar esse nível de verificação, é necessário garantir que o certificado CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade ocorrerão. Para obter mais informações, consulte Opções de comando para conexões criptografadas.

Para evitar problemas de `LOAD DATA`, os clientes devem evitar usar `LOCAL` a menos que as precauções adequadas do lado do cliente tenham sido tomadas.

Para controlar a carga de dados locais, o MySQL permite habilitar ou desabilitar essa capacidade. O MySQL também permite que os clientes restrinjam as operações de carga de dados locais a arquivos localizados em um diretório designado.

* Habilitar ou desabilitar a capacidade de carga de dados locais
* Restrição de arquivos permitidos para carga de dados locais
* Shell MySQL e carga de dados locais

#### Habilitar ou desabilitar a capacidade de carga de dados locais

Administradores e aplicativos podem configurar se permitir a carga de dados locais da seguinte forma:

* No lado do servidor:

  + A variável de sistema `local_infile` controla a capacidade `LOCAL` no lado do servidor. Dependendo do ajuste de `local_infile`, o servidor recusa ou permite a carga de dados locais por clientes que solicitam a carga de dados locais.

  + Por padrão, `local_infile` está desativado. (Essa é uma mudança em relação às versões anteriores do MySQL.) Para fazer com que o servidor recuse ou permita explicitamente as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente são configurados no momento da construção ou do tempo de execução), inicie o **mysqld** com `local_infile` desativado ou ativado. `local_infile` também pode ser definido em tempo de execução.

* No lado do cliente:

+ A opção `ENABLED_LOCAL_INFILE` do **CMake** controla a capacidade `LOCAL` integrada por padrão para a biblioteca de clientes MySQL (veja a Seção 2.8.7, “Opções de Configuração de Fonte MySQL”). Clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no tempo de construção do MySQL.

  + Por padrão, a biblioteca de clientes nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` desativada. Se você compilar o MySQL a partir da fonte, configure-o com `ENABLED_LOCAL_INFILE` desativada ou ativada com base se os clientes que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desativada ou ativada.

  + Para programas de clientes que usam a API C, a capacidade de carregamento de dados local é determinada pelo padrão compilado na biblioteca de clientes MySQL. Para ativá-la ou desativá-la explicitamente, invocando a função C `mysql_options()` para desativar ou ativar a opção `MYSQL_OPT_LOCAL_INFILE`. Veja mysql_options().

  + Para o cliente **mysql**, a capacidade de carregamento de dados local é determinada pelo padrão compilado na biblioteca de clientes MySQL. Para desativá-la ou ativá-la explicitamente, use a opção `--local-infile=0` ou `--local-infile[=1]`.

  + Para o cliente **mysqlimport**, o carregamento de dados local não é usado por padrão. Para desativá-lo ou ativá-lo explicitamente, use a opção `--local=0` ou `--local[=1]`.

  + Se você usar `LOAD DATA LOCAL` em scripts Perl ou outros programas que leem o grupo `[client]` de arquivos de opção, você pode adicionar uma configuração de opção `local-infile` a esse grupo. Para evitar problemas para programas que não entendem essa opção, especifique-a usando o prefixo `loose-`:

    ```
    [client]
    loose-local-infile=0
    ```

    ou:

    ```
    [client]
    loose-local-infile=1
    ```

+ Em todos os casos, o uso bem-sucedido de uma operação de carregamento `LOCAL` por um cliente também exige que o servidor permita o carregamento local.

Se a capacidade `LOCAL` for desativada, seja no lado do servidor ou do cliente, um cliente que tente emitir uma declaração `LOAD DATA LOCAL` recebe a seguinte mensagem de erro:

```
ERROR 3950 (42000): Loading local data is disabled; this must be
enabled on both the client and server side
```

#### Restrição de Arquivos Permitidos para Carregamento de Dados Locais

A biblioteca de clientes MySQL permite que os aplicativos de cliente restrinjam as operações de carregamento de dados locais a arquivos localizados em um diretório designado. Certos programas de clientes MySQL aproveitam essa capacidade.

Os programas de clientes que usam a API C podem controlar quais arquivos permitir para o carregamento de dados usando as opções `MYSQL_OPT_LOCAL_INFILE` e `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` da função `mysql_options()` da API C (veja mysql_options()).

O efeito de `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` depende se o carregamento de dados `LOCAL` está habilitado ou desativado:

* Se o carregamento de dados `LOCAL` estiver habilitado, seja por padrão na biblioteca de clientes MySQL ou explicitamente habilitando `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` não tem efeito.

* Se o carregamento de dados `LOCAL` estiver desativado, seja por padrão na biblioteca de clientes MySQL ou explicitamente desabilitando `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` pode ser usada para designar um diretório permitido para arquivos carregados localmente. Neste caso, o carregamento de dados `LOCAL` é permitido, mas restrito a arquivos localizados no diretório designado. A interpretação do valor de `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` é a seguinte:

  + Se o valor for o ponteiro nulo (o padrão), ele não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para o carregamento de dados `LOCAL`.

Se o valor for o nome de um caminho de diretório, a carga de dados **LOCAL** é permitida, mas restrita a arquivos localizados no diretório nomeado. A comparação do nome do caminho de diretório e do nome do caminho dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente.

Os programas clientes MySQL usam as opções anteriores da `mysql_options()` da seguinte forma:

* O cliente **mysql** tem uma opção **`--load-data-local-dir`** que aceita um caminho de diretório ou uma string vazia. **mysql** usa o valor da opção para definir a opção **`MYSQL_OPT_LOAD_DATA_LOCAL_DIR`** (com uma string vazia definindo o valor para o ponteiro nulo). O efeito de **`--load-data-local-dir`** depende se a carga de dados **LOCAL** está habilitada:

  + Se a carga de dados **LOCAL** estiver habilitada, seja por padrão na biblioteca do cliente MySQL ou especificando **`--local-infile[=1]`**, a opção **`--load-data-local-dir`** é ignorada.

  + Se a carga de dados **LOCAL** estiver desabilitada, seja por padrão na biblioteca do cliente MySQL ou especificando **`--local-infile=0`**, a opção **`--load-data-local-dir`** se aplica.

Quando **`--load-data-local-dir`** se aplica, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho de diretório e do nome do caminho dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para a carga de dados locais.

* **mysqlimport** define **`MYSQL_OPT_LOAD_DATA_LOCAL_DIR`** para cada arquivo que processa, para que o diretório que contém o arquivo seja o diretório de carregamento local permitido.

* Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve as instruções `LOAD DATA LOCAL` para fazer com que os arquivos sejam carregados. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

Como outros processos podem escrever arquivos no diretório específico do sistema padrão, é aconselhável especificar a opção `--local-load` para o **mysqlbinlog** para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` para o **mysql** ao processar a saída do **mysqlbinlog**.

#### MySQL Shell e Carregamento Local de Dados

O MySQL Shell fornece várias ferramentas para drenar tabelas, esquemas ou instâncias do servidor e carregá-las em outras instâncias. Quando você usa essas ferramentas para lidar com os dados, o MySQL Shell fornece funções adicionais, como pré-processamento de entrada, carregamento paralelo multithread, compressão e descompactação de arquivos e gerenciamento de acesso a buckets do Oracle Cloud Infrastructure Object Storage. Para obter a melhor funcionalidade, sempre use a versão mais recente disponível das ferramentas de dump e carregamento do MySQL Shell.

As ferramentas de upload de dados do MySQL Shell usam instruções `LOAD DATA LOCAL INFILE` para fazer o upload de dados, então a variável de sistema `local_infile` deve ser definida como `ON` na instância do servidor alvo. Você pode fazer isso antes de fazer o upload dos dados e removê-la novamente depois. As ferramentas lidam com as solicitações de transferência de arquivos de forma segura para lidar com as considerações de segurança discutidas neste tópico.

O MySQL Shell inclui esses utilitários de dump e carregamento de dump:

Utilitário de exportação de tabela `util.exportTable()`:   Exporta uma tabela relacional MySQL em um arquivo de dados, que pode ser carregado em uma instância do MySQL Shell usando o utilitário de importação de tabela paralela do MySQL Shell, importado para um aplicativo diferente ou usado como backup lógico. O utilitário tem opções pré-definidas e opções de personalização para produzir diferentes formatos de saída.

Utilitário de importação de tabela paralela `util.importTable()`:   Importa um arquivo de dados para uma tabela relacional MySQL. O arquivo de dados pode ser a saída do utilitário de exportação de tabela do MySQL Shell ou outro formato suportado pelas opções pré-definidas e de personalização do utilitário. O utilitário pode realizar pré-processamento de entrada antes de adicionar os dados à tabela. Ele pode aceitar vários arquivos de dados para ser fundido em uma única tabela relacional e descomprimir automaticamente arquivos comprimidos.

Utilitário de dump de instância `util.dumpInstance()`, utilitário de dump de esquema `util.dumpSchemas()` e utilitário de dump de tabela `util.dumpTables()`:   Exporta uma instância, esquema ou tabela para um conjunto de arquivos de dump, que podem então ser carregados em uma instância do MySQL usando o utilitário de carregamento de dump do MySQL Shell. Os utilitários fornecem verificações e modificações de compatibilidade do Oracle Cloud Infrastructure Object Storage streaming, MySQL HeatWave Service e a capacidade de realizar uma execução em modo de teste para identificar problemas antes de prosseguir com o dump.

Utilitário de carregamento de dumps `util.loadDump()`: Importe arquivos de dump criados usando o utilitário de dump de instância, esquema ou tabela do MySQL Shell para um sistema de banco de dados MySQL HeatWave Service ou uma instância do MySQL Server. O utilitário gerencia o processo de upload e fornece streaming de dados de armazenamento remoto, carregamento paralelo de tabelas ou partes de tabelas, acompanhamento do estado de progresso, capacidade de retomada e reinicialização, e a opção de carregamento concorrente enquanto o dump ainda está ocorrendo. O utilitário de importação de tabela paralela do MySQL Shell pode ser usado em combinação com o utilitário de carregamento de dumps para modificar os dados antes de enviá-los para a instância MySQL de destino.

Para obter detalhes dos utilitários, consulte MySQL Shell Utilities.