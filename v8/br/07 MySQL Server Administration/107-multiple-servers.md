## 7.8 Execução de múltiplas instâncias do MySQL em uma máquina

Em alguns casos, você pode querer executar várias instâncias do MySQL em uma única máquina. Você pode querer testar um novo lançamento do MySQL, deixando uma configuração de produção existente intacta. Ou você pode querer dar a diferentes usuários acesso a diferentes `mysqld` servidores que eles gerenciam. (Por exemplo, você pode ser um provedor de serviços de Internet que deseja fornecer instalações independentes do MySQL para diferentes clientes.)

É possível usar um binário de servidor MySQL diferente por instância, ou usar o mesmo binário para várias instâncias, ou qualquer combinação das duas abordagens. Por exemplo, você pode executar um servidor do MySQL 8.3 e um do MySQL 8.4, para ver como diferentes versões lidam com uma determinada carga de trabalho. Ou você pode executar várias instâncias da versão de produção atual, cada uma gerenciando um conjunto diferente de bancos de dados.

Independentemente de você usar ou não binários de servidor distintos, cada instância que você executa deve ser configurada com valores únicos para vários parâmetros operacionais. Isso elimina o potencial de conflito entre instâncias. Os parâmetros podem ser definidos na linha de comando, em arquivos de opções ou definindo variáveis de ambiente. Veja Seção 6.2.2, Especificar Opções de Programa. Para ver os valores usados por uma determinada instância, conecte-se a ela e execute uma instrução `SHOW VARIABLES`.

O recurso primário gerenciado por uma instância do MySQL é o diretório de dados. Cada instância deve usar um diretório de dados diferente, cuja localização é especificada usando a opção `--datadir=dir_name`.

Além de usar diferentes diretórios de dados, várias outras opções devem ter valores diferentes para cada instância de servidor:

- `--port=port_num`

  `--port` controla o número de porta para conexões TCP/IP. Alternativamente, se o host tiver vários endereços de rede, você pode definir a variável do sistema `bind_address` para fazer com que cada servidor escute um endereço diferente.
- `--socket={file_name|pipe_name}`

  O `--socket` controla o caminho do arquivo do soquete do Unix no Unix ou o nome do tubo nomeado no Windows. No Windows, é necessário especificar nomes de tubo distintos apenas para os servidores configurados para permitir conexões de tubo nomeado.
- `--shared-memory-base-name=name`

Esta opção é usada apenas no Windows. Designa o nome de memória compartilhada usado por um servidor Windows para permitir que os clientes se conectem usando memória compartilhada. É necessário especificar nomes de memória compartilhada distintos apenas para os servidores configurados para permitir conexões de memória compartilhada.

- `--pid-file=file_name`

Esta opção indica o nome do caminho do ficheiro no qual o servidor escreve o seu ID de processo.

Se você usar as seguintes opções de arquivo de registro, seus valores devem ser diferentes para cada servidor:

- `--general_log_file=file_name`
- `--log-bin[=file_name]`
- `--slow_query_log_file=file_name`
- `--log-error[=file_name]`

Para uma discussão mais aprofundada das opções de ficheiros de registo, ver Secção 7.4, MySQL Server Logs.

Para obter melhor desempenho, você pode especificar a seguinte opção de forma diferente para cada servidor, para distribuir a carga entre vários discos físicos:

- `--tmpdir=dir_name`

Ter diferentes diretórios temporários também facilita a determinação de qual servidor MySQL criou qualquer arquivo temporário.

Se você tiver várias instalações do MySQL em diferentes locais, você pode especificar o diretório base para cada instalação com a opção `--basedir=dir_name`. Isso faz com que cada instância use automaticamente um diretório de dados, arquivos de log e arquivo PID diferente, porque o padrão para cada um desses parâmetros é relativo ao diretório base. Nesse caso, as únicas outras opções que você precisa especificar são as opções `--socket` e `--port`.

Conforme discutido nas seções seguintes, é possível iniciar servidores adicionais especificando opções de comando apropriadas ou definindo variáveis de ambiente. No entanto, se você precisar executar vários servidores de forma mais permanente, é mais conveniente usar arquivos de opção para especificar para cada servidor os valores de opção que devem ser exclusivos para ele. A opção `--defaults-file` é útil para este propósito.
