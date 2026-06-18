### 8.1.6 Considerações de segurança para LOAD DATA LOCAL

A instrução `LOAD DATA` carrega um arquivo de dados em uma tabela. A instrução pode carregar um arquivo localizado no host do servidor ou, se a palavra-chave `LOCAL` for especificada, no host do cliente.

A versão `LOCAL` do `LOAD DATA` tem dois problemas de segurança potenciais:

- Como o `LOAD DATA LOCAL` é uma instrução SQL, a análise ocorre no lado do servidor, e a transferência do arquivo do host do cliente para o host do servidor é iniciada pelo servidor MySQL, que informa ao cliente o nome do arquivo mencionado na instrução. Em teoria, um servidor com correção poderia informar ao programa cliente para transferir um arquivo escolhido pelo servidor, em vez do arquivo mencionado na instrução. Um servidor com correção poderia acessar qualquer arquivo no host do cliente para o qual o usuário do cliente tenha acesso de leitura. (Um servidor com correção poderia, de fato, responder com uma solicitação de transferência de arquivo para qualquer instrução, não apenas `LOAD DATA LOCAL`, portanto, um problema mais fundamental é que os clientes não devem se conectar a servidores não confiáveis.)

- Em um ambiente web onde os clientes estão se conectando a um servidor web, um usuário poderia usar `LOAD DATA LOCAL` para ler quaisquer arquivos que o servidor web tenha acesso de leitura (assumindo que um usuário pudesse executar qualquer instrução contra o servidor SQL). Nesse ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor web, e não um programa remoto executado por usuários que se conectam ao servidor web.

Para evitar a conexão com servidores não confiáveis, os clientes podem estabelecer uma conexão segura e verificar a identidade do servidor conectando-se usando a opção `--ssl-mode=VERIFY_IDENTITY` e o certificado da CA apropriado. Para implementar esse nível de verificação, você deve primeiro garantir que o certificado da CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade ocorrerão. Para obter mais informações, consulte Opções de comando para conexões criptografadas.

Para evitar problemas com `LOAD DATA`, os clientes devem evitar o uso de `LOCAL`, a menos que as precauções adequadas do lado do cliente tenham sido tomadas.

Para o controle da carga de dados locais, o MySQL permite que a capacidade seja habilitada ou desabilitada. Além disso, a partir do MySQL 8.0.21, o MySQL permite que os clientes restrinjam as operações de carga de dados locais a arquivos localizados em um diretório designado.

- Habilitar ou desabilitar a capacidade de carregamento de dados locais
- Restrição de arquivos permitidos para carregamento de dados locais
- MySQL Shell e Carregamento de Dados Locais

#### Habilitar ou desabilitar a capacidade de carregamento de dados locais

Os administradores e aplicativos podem configurar se devem permitir o carregamento de dados locais da seguinte forma:

- No lado do servidor:

  - A variável de sistema `local_infile` controla a capacidade `LOCAL` do lado do servidor. Dependendo da configuração `local_infile`, o servidor pode recusar ou permitir o carregamento de dados locais por clientes que solicitam o carregamento de dados locais.

  - Por padrão, `local_infile` está desativado. (Essa é uma mudança em relação às versões anteriores do MySQL.) Para fazer com que o servidor recuse ou permita explicitamente as instruções `LOAD DATA LOCAL` (independentemente de como os programas e bibliotecas do cliente estiverem configurados no momento da compilação ou execução), inicie o **mysqld** com `local_infile` desativado ou ativado. `local_infile` também pode ser definido em tempo de execução.

- Do lado do cliente:

  - A opção `ENABLED_LOCAL_INFILE` **CMake** controla a capacidade padrão integrada `LOCAL` para a biblioteca de cliente MySQL (consulte a Seção 2.8.7, “Opções de Configuração de Código de Fonte MySQL”). Os clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desativada ou ativada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

  - Por padrão, a biblioteca do cliente nas distribuições binárias do MySQL é compilada com o `ENABLED_LOCAL_INFILE` desativado. Se você compilar o MySQL a partir da fonte, configure-o com o `ENABLED_LOCAL_INFILE` desativado ou ativado, dependendo se os clientes que não fazem acordos explícitos devem ter a capacidade `LOCAL` desativada ou ativada.

  - Para programas cliente que utilizam a API C, a capacidade de carregar dados localmente é determinada pelo padrão compilado na biblioteca de cliente MySQL. Para a habilitar ou desabilitar explicitamente, invocando a função `mysql_options()` da API C, você pode desabilitar ou habilitar a opção `MYSQL_OPT_LOCAL_INFILE`. Veja mysql\_options().

  - Para o cliente **mysql**, a capacidade de carregar dados localmente é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para desabilitar ou habilitar explicitamente, use a opção `--local-infile=0` ou `--local-infile[=1]`.

  - Para o cliente **mysqlimport**, o carregamento de dados locais não é usado por padrão. Para desabilitar ou habilitar explicitamente, use a opção `--local=0` ou `--local[=1]`.

  - Se você usar `LOAD DATA LOCAL` em scripts Perl ou outros programas que leem o grupo `[client]` de arquivos de opção, você pode adicionar um ajuste de opção `local-infile` a esse grupo. Para evitar problemas para programas que não entendem essa opção, especifique-a usando o prefixo `loose-`:

    ```
    [client]
    loose-local-infile=0
    ```

    ou:

    ```
    [client]
    loose-local-infile=1
    ```

  - Em todos os casos, o uso bem-sucedido de uma operação de carregamento `LOCAL` por um cliente também exige que o servidor permita o carregamento local.

Se a capacidade `LOCAL` for desativada, seja no lado do servidor ou do cliente, um cliente que tente emitir uma declaração `LOAD DATA LOCAL` receberá a seguinte mensagem de erro:

```
ERROR 3950 (42000): Loading local data is disabled; this must be
enabled on both the client and server side
```

#### Restrição de arquivos permitidos para carregamento de dados locais

A partir do MySQL 8.0.21, a biblioteca de clientes do MySQL permite que as aplicações cliente restrinjam as operações de carregamento de dados locais a arquivos localizados em um diretório designado. Alguns programas de clientes do MySQL aproveitam essa capacidade.

Os programas cliente que utilizam a API C podem controlar quais arquivos devem ser permitidos para carregar dados usando as opções `MYSQL_OPT_LOCAL_INFILE` e `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` da função `mysql_options()` da API C (veja mysql\_options()).

O efeito de `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` depende se o carregamento de dados de `LOCAL` está habilitado ou desabilitado:

- Se o carregamento de dados `LOCAL` estiver habilitado, seja por padrão na biblioteca do cliente MySQL ou ao habilitar explicitamente `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` não terá efeito.

- Se o carregamento de dados `LOCAL` estiver desativado, seja por padrão na biblioteca do cliente MySQL ou ao desativar explicitamente `MYSQL_OPT_LOCAL_INFILE`, a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` pode ser usada para designar um diretório permitido para arquivos carregados localmente. Nesse caso, o carregamento de dados `LOCAL` é permitido, mas restrito a arquivos localizados no diretório designado. A interpretação do valor `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` é a seguinte:

  - Se o valor for o ponteiro nulo (o padrão), ele não nomeia nenhum diretório, resultando em nenhum arquivo sendo permitido para a carga de dados do `LOCAL`.

  - Se o valor for o nome de um caminho de diretório, o carregamento de dados `LOCAL` é permitido, mas restrito a arquivos localizados no diretório nomeado. A comparação do nome do caminho de diretório e do nome dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente.

Os programas clientes do MySQL utilizam as opções anteriores `mysql_options()` da seguinte forma:

- O cliente **mysql** tem uma opção `--load-data-local-dir` que aceita um caminho de diretório ou uma string vazia. O **mysql** usa o valor da opção para definir a opção `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` (com uma string vazia definindo o valor para o ponteiro nulo). O efeito de `--load-data-local-dir` depende se o carregamento de dados `LOCAL` está habilitado:

  - Se o carregamento de dados `LOCAL` estiver habilitado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile[=1]`, a opção `--load-data-local-dir` será ignorada.

  - Se o carregamento de dados `LOCAL` estiver desativado, seja por padrão na biblioteca do cliente MySQL ou especificando `--local-infile=0`, a opção `--load-data-local-dir` será aplicada.

  Quando o `--load-data-local-dir` se aplica, o valor da opção designa o diretório em que os arquivos de dados locais devem estar localizados. A comparação do nome do caminho do diretório e do nome do caminho dos arquivos a serem carregados é case-sensitive, independentemente da sensibilidade de caso do sistema de arquivos subjacente. Se o valor da opção for a string vazia, ele não nomeia nenhum diretório, com o resultado de que nenhum arquivo é permitido para a carga de dados locais.

- O **mysqlimport** define `MYSQL_OPT_LOAD_DATA_LOCAL_DIR` para cada arquivo que processa, para que o diretório que contém o arquivo seja o diretório de carregamento local permitido.

- Para operações de carregamento de dados correspondentes às instruções `LOAD DATA`, o **mysqlbinlog** extrai os arquivos dos eventos do log binário, escreve-os como arquivos temporários no sistema de arquivos local e escreve as instruções `LOAD DATA LOCAL` para fazer com que os arquivos sejam carregados. Por padrão, o **mysqlbinlog** escreve esses arquivos temporários em um diretório específico do sistema operacional. A opção `--local-load` pode ser usada para especificar explicitamente o diretório onde o **mysqlbinlog** deve preparar arquivos temporários locais.

  Como outros processos podem gravar arquivos no diretório padrão específico do sistema, é aconselhável especificar a opção `--local-load` para o **mysqlbinlog** para designar um diretório diferente para os arquivos de dados, e, em seguida, designar o mesmo diretório especificando a opção `--load-data-local-dir` para o **mysql** ao processar a saída do **mysqlbinlog**.

#### MySQL Shell e Carregamento de Dados Locais

O MySQL Shell oferece vários utilitários para fazer o dump de tabelas, esquemas ou instâncias do servidor e carregá-los em outras instâncias. Quando você usa esses utilitários para manipular os dados, o MySQL Shell oferece funções adicionais, como pré-processamento de entrada, carregamento paralelo multithread, compressão e descompactação de arquivos e gerenciamento do acesso aos buckets do Oracle Cloud Infrastructure Object Storage. Para obter a melhor funcionalidade, sempre use a versão mais recente disponível dos utilitários de dump e carregamento do MySQL Shell.

As ferramentas de upload de dados do MySQL Shell usam instruções `LOAD DATA LOCAL INFILE` para fazer o upload de dados, então a variável de sistema `local_infile` deve ser definida como `ON` na instância do servidor de destino. Você pode fazer isso antes de fazer o upload dos dados e removê-la novamente depois. As ferramentas lidam com as solicitações de transferência de arquivos de forma segura para lidar com as considerações de segurança discutidas neste tópico.

O MySQL Shell inclui esses utilitários de dump e de carregamento de dump:

Ferramenta de exportação de tabela `util.exportTable()` :   Exporta uma tabela relacional MySQL em um arquivo de dados, que pode ser carregado em uma instância do servidor MySQL usando a ferramenta de importação de tabela paralela do MySQL Shell, importado para um aplicativo diferente ou usado como backup lógico. A ferramenta tem opções pré-definidas e opções de personalização para produzir diferentes formatos de saída.

Ferramenta de importação de tabela paralela `util.importTable()` :   Importa um arquivo de dados para uma tabela relacional MySQL. O arquivo de dados pode ser o resultado do utilitário de exportação de tabela do MySQL Shell ou outro formato suportado pelas opções de pré-configuração e personalização do utilitário. A ferramenta pode realizar pré-processamento de entrada antes de adicionar os dados à tabela. Ela pode aceitar vários arquivos de dados para ser mesclados em uma única tabela relacional e descomprimir automaticamente arquivos comprimidos.

Ferramentas de exclusão de instâncias `util.dumpInstance()`, ferramentas de exclusão de esquemas `util.dumpSchemas()` e ferramentas de exclusão de tabelas `util.dumpTables()`:   Expor uma instância, um esquema ou uma tabela para um conjunto de arquivos de exclusão, que podem ser então carregados em uma instância MySQL usando a ferramenta de carregamento de exclusão do MySQL Shell. As ferramentas fornecem verificações e modificações de compatibilidade do MySQL HeatWave Service com o Oracle Cloud Infrastructure Object Storage e a capacidade de realizar uma execução em modo de teste para identificar problemas antes de prosseguir com a exclusão.

Utilitário de carregamento de dump `util.loadDump()` :   Importe arquivos de dump criados usando o utilitário de dump de instância, esquema ou tabela do MySQL Shell para um sistema de banco de dados MySQL HeatWave Service ou uma instância do MySQL Server. O utilitário gerencia o processo de upload e fornece streaming de dados a partir do armazenamento remoto, carregamento paralelo de tabelas ou partes de tabelas, rastreamento do estado de progresso, capacidade de retomada e reinicialização, e a opção de carregamento concorrente enquanto o dump ainda está ocorrendo. O utilitário de importação de tabela paralela do MySQL Shell pode ser usado em combinação com o utilitário de carregamento de dump para modificar os dados antes de enviá-los para a instância MySQL de destino.

Para obter detalhes sobre as ferramentas, consulte Ferramentas do Shell MySQL.
