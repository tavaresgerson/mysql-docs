### 6.1.6 Considerações de segurança para LOAD DATA LOCAL

A instrução `LOAD DATA` carrega um arquivo de dados em uma tabela. A instrução pode carregar um arquivo localizado no host do servidor ou, se a palavra-chave `LOCAL` for especificada, no host do cliente.

A versão `LOCAL` de `LOAD DATA` tem dois problemas de segurança potenciais:

- Como o `LOAD DATA LOCAL` é uma instrução SQL, a análise ocorre no lado do servidor, e a transferência do arquivo do host do cliente para o host do servidor é iniciada pelo servidor MySQL, que informa ao cliente o nome do arquivo mencionado na instrução. Em teoria, um servidor com correção poderia informar ao programa cliente para transferir um arquivo escolhido pelo servidor, em vez do arquivo mencionado na instrução. Um servidor com correção poderia acessar qualquer arquivo no host do cliente ao qual o usuário cliente tenha acesso de leitura. (Um servidor com correção poderia, de fato, responder com uma solicitação de transferência de arquivo para qualquer instrução, não apenas `LOAD DATA LOCAL`, portanto, um problema mais fundamental é que os clientes não devem se conectar a servidores não confiáveis.)

- Em um ambiente web onde os clientes estão se conectando a um servidor web, um usuário poderia usar `LOAD DATA LOCAL` para ler quaisquer arquivos que o servidor web tenha acesso de leitura (assumindo que um usuário pudesse executar qualquer instrução contra o servidor SQL). Nesse ambiente, o cliente em relação ao servidor MySQL é na verdade o servidor web, e não um programa remoto executado por usuários que se conectam ao servidor web.

Para evitar a conexão com servidores não confiáveis, os clientes podem estabelecer uma conexão segura e verificar a identidade do servidor conectando-se usando a opção `--ssl-mode=VERIFY_IDENTITY` e o certificado CA apropriado. Para implementar esse nível de verificação, você deve primeiro garantir que o certificado CA do servidor esteja disponível de forma confiável para a replica, caso contrário, problemas de disponibilidade ocorrerão. Para obter mais informações, consulte Opções de comando para conexões criptografadas.

Para evitar problemas com `LOAD DATA`, os clientes devem evitar o uso de `LOCAL`.

Os administradores e aplicativos podem configurar se permitir o carregamento de dados locais da seguinte forma:

- No lado do servidor:

  - A variável de sistema `local_infile` controla a capacidade `LOCAL` no lado do servidor. Dependendo da configuração da variável `local_infile`, o servidor pode recusar ou permitir o carregamento de dados locais por clientes que solicitam o carregamento de dados locais.

  - Por padrão, `local_infile` está habilitado. Para fazer com que o servidor recuse ou permita explicitamente as instruções `LOAD DATA LOCAL`, inicie o **mysqld** com `local_infile` desabilitado ou habilitado. `local_infile` também pode ser definido em tempo de execução.

- Do lado do cliente:

  - A opção `ENABLED_LOCAL_INFILE` do **CMake** controla a capacidade `LOCAL` integrada por padrão para a biblioteca de cliente MySQL (veja Seção 2.8.7, “Opções de Configuração de Código-Fonte do MySQL”). Os clientes que não fazem arranjos explícitos, portanto, têm a capacidade `LOCAL` desabilitada ou habilitada de acordo com a configuração `ENABLED_LOCAL_INFILE` especificada no momento da construção do MySQL.

  - Por padrão, a biblioteca do cliente nas distribuições binárias do MySQL é compilada com `ENABLED_LOCAL_INFILE` habilitada. Se você compilar o MySQL a partir da fonte, configure-o com `ENABLED_LOCAL_INFILE` desabilitada ou habilitada, dependendo se os clientes que não fazem arranjos explícitos devem ter a capacidade `LOCAL` desabilitada ou habilitada.

  - Para programas cliente que utilizam a API C, a capacidade de carregar dados localmente é determinada pelo padrão compilado na biblioteca de cliente MySQL. Para a habilitar ou desabilitar explicitamente, invocando a função da API C `mysql_options()`, você pode desabilitar ou habilitar a opção `MYSQL_OPT_LOCAL_INFILE`. Consulte mysql_options().

  - Para o cliente **mysql**, a capacidade de carregar dados localmente é determinada pelo padrão compilado na biblioteca do cliente MySQL. Para desabilitar ou habilitar explicitamente, use a opção `--local-infile=0` ou `--local-infile[=1]`.

  - Para o cliente **mysqlimport**, o carregamento de dados locais não é usado por padrão. Para desabilitar ou habilitar explicitamente, use a opção `--local=0` ou `--local[=1]`.

  - Se você usar `LOAD DATA LOCAL` em scripts Perl ou outros programas que leem o grupo `[client]` de arquivos de opções, você pode adicionar uma opção `local-infile` para esse grupo. Para evitar problemas com programas que não entendem essa opção, especifique-a usando o prefixo `loose-`:

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

Se a capacidade `LOCAL` estiver desativada, seja no lado do servidor ou do cliente, um cliente que tente emitir uma instrução `[LOAD DATA LOCAL`]\(load-data.html) receberá a seguinte mensagem de erro:

```
ERROR 1148: The used command is not allowed with this MySQL version
```

#### MySQL Shell e Carregamento de Dados Locais

O MySQL Shell oferece vários utilitários para fazer o dump de tabelas, esquemas ou instâncias do servidor e carregá-los em outras instâncias. Quando você usa esses utilitários para manipular os dados, o MySQL Shell oferece funções adicionais, como pré-processamento de entrada, carregamento paralelo multithread, compressão e descompactação de arquivos e gerenciamento do acesso aos buckets do Oracle Cloud Infrastructure Object Storage. Para obter a melhor funcionalidade, sempre use a versão mais recente disponível dos utilitários de dump e carregamento do MySQL Shell.

As ferramentas de upload de dados do MySQL Shell usam as instruções `LOAD DATA LOCAL INFILE` para fazer o upload de dados, então a variável de sistema `local_infile` deve estar definida como `ON` na instância do servidor de destino. Você pode fazer isso antes de fazer o upload dos dados e removê-la novamente depois. As ferramentas lidam com as solicitações de transferência de arquivos de forma segura para lidar com as considerações de segurança discutidas neste tópico.

O MySQL Shell inclui esses utilitários de dump e de carregamento de dump:

Utilização de exportação de tabela `util.exportTable()`: Exporta uma tabela relacional MySQL para um arquivo de dados, que pode ser carregado em uma instância do servidor MySQL usando a utilidade de importação de tabela paralela do MySQL Shell, importado para um aplicativo diferente ou usado como backup lógico. A utilidade tem opções pré-definidas e opções de personalização para produzir diferentes formatos de saída.

Utilitário de importação de tabela paralela `util.importTable()`:   Importa um arquivo de dados para uma tabela relacional MySQL. O arquivo de dados pode ser o resultado do utilitário de exportação de tabela do MySQL Shell ou outro formato suportado pelas opções de pré-configuração e personalização do utilitário. O utilitário pode realizar pré-processamento de entrada antes de adicionar os dados à tabela. Ele pode aceitar vários arquivos de dados para ser fundido em uma única tabela relacional e descomprimir automaticamente arquivos comprimidos.

Utilidades de exclusão de instância `util.dumpInstance()`, utilidades de exclusão de esquema `util.dumpSchemas()` e utilidades de exclusão de tabela `util.dumpTables()`: Expor uma instância, um esquema ou uma tabela para um conjunto de arquivos de exclusão, que podem então ser carregados em uma instância MySQL usando a utilidade de carregamento de exclusão do MySQL Shell. As utilidades fornecem verificações e modificações de compatibilidade do MySQL HeatWave Service e streaming do Oracle Cloud Infrastructure Object Storage, além da capacidade de realizar uma execução em modo de teste para identificar problemas antes de prosseguir com a exclusão.

Utilitário de carregamento de dumps `util.loadDump()`: Importe arquivos de dump criados usando o utilitário de dump de instância, esquema ou tabela do MySQL Shell para um sistema de banco de dados MySQL HeatWave Service ou uma instância do MySQL Server. O utilitário gerencia o processo de upload e fornece streaming de dados a partir do armazenamento remoto, carregamento paralelo de tabelas ou partes de tabelas, rastreamento do estado de progresso, capacidade de retomada e reinicialização, e a opção de carregamento concorrente enquanto o dump ainda está ocorrendo. O utilitário de importação de tabela paralela do MySQL Shell pode ser usado em combinação com o utilitário de carregamento de dumps para modificar os dados antes de enviá-los para a instância MySQL de destino.

Para obter detalhes sobre as ferramentas, consulte MySQL Shell Utilities.
