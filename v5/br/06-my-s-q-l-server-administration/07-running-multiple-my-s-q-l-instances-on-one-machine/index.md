## 5.7 Executando múltiplas instâncias do MySQL em uma única máquina

5.7.1 Configuração de diretórios de dados múltiplos

5.7.2 Execução de múltiplas instâncias do MySQL no Windows

5.7.3 Execução de múltiplas instâncias do MySQL no Unix

5.7.4 Uso de programas de cliente em um ambiente de múltiplos servidores

Em alguns casos, você pode querer executar várias instâncias do MySQL em uma única máquina. Você pode querer testar uma nova versão do MySQL enquanto deixa uma configuração de produção existente intacta. Ou você pode querer dar a diferentes usuários acesso a diferentes servidores **mysqld** que eles gerenciam por conta própria. (Por exemplo, você pode ser um provedor de serviços de Internet que deseja fornecer instalações independentes do MySQL para diferentes clientes.)

É possível usar um binário de servidor MySQL diferente por instância ou usar o mesmo binário para várias instâncias ou qualquer combinação das duas abordagens. Por exemplo, você pode executar um servidor do MySQL 5.6 e outro do MySQL 5.7 para ver como diferentes versões lidam com uma carga de trabalho específica. Ou você pode executar várias instâncias da versão atual de produção, cada uma gerenciando um conjunto diferente de bancos de dados.

Se você usar binários de servidor distintos ou não, cada instância que você executar deve ser configurada com valores únicos para vários parâmetros de operação. Isso elimina o potencial de conflito entre as instâncias. Os parâmetros podem ser definidos na linha de comando, em arquivos de opção ou configurando variáveis de ambiente. Veja Seção 4.2.2, “Especificação de Opções de Programa”. Para ver os valores usados por uma instância específica, conecte-se a ela e execute uma declaração `SHOW VARIABLES`.

O recurso principal gerenciado por uma instância do MySQL é o diretório de dados. Cada instância deve usar um diretório de dados diferente, cujo local é especificado usando a opção `--datadir=dir_name`. Para obter informações sobre como configurar cada instância com seu próprio diretório de dados e sobre os perigos de não fazer isso, consulte Seção 5.7.1, “Configurando Múltiplos Diretórios de Dados”.

Além de usar diferentes diretórios de dados, várias outras opções devem ter valores diferentes para cada instância do servidor:

- `--port=port_num`

  `--port` controla o número de porta para conexões TCP/IP. Alternativamente, se o host tiver múltiplos endereços de rede, você pode definir a variável de sistema `bind_address` para fazer com que cada servidor ouça um endereço diferente.

- `--socket={nome_do_arquivo|nome_do_pipe}`

  `--socket` controla o caminho do arquivo de socket Unix em Unix ou o nome da pipe nomeada em Windows. Em Windows, é necessário especificar nomes de pipe distintos apenas para os servidores configurados para permitir conexões por pipe nomeada.

- `--shared-memory-base-name=nome`

  Esta opção é usada apenas no Windows. Ela designa o nome de memória compartilhada usado por um servidor do Windows para permitir que os clientes se conectem usando memória compartilhada. É necessário especificar nomes de memória compartilhada distintos apenas para os servidores configurados para permitir conexões de memória compartilhada.

- `--pid-file=nome_do_arquivo`

  Esta opção indica o nome do caminho do arquivo no qual o servidor escreve seu ID de processo.

Se você usar as seguintes opções de arquivo de registro, seus valores devem ser diferentes para cada servidor:

- `--general_log_file=nome_do_arquivo`
- `--log-bin[=nome_do_arquivo]`
- `--slow_query_log_file=nome_do_arquivo`
- `--log-error[=nome_do_arquivo]`

Para mais informações sobre as opções dos arquivos de registro, consulte Seção 5.4, "Logs do Servidor MySQL".

Para obter um melhor desempenho, você pode especificar a seguinte opção de forma diferente para cada servidor, para distribuir a carga entre vários discos físicos:

- `--tmpdir=nome_pasta`

Ter diretórios temporários diferentes também facilita a determinação de qual servidor MySQL criou um determinado arquivo temporário.

Se você tiver várias instalações do MySQL em locais diferentes, pode especificar o diretório base para cada instalação com a opção `--basedir=dir_name`. Isso faz com que cada instância use automaticamente um diretório de dados, arquivos de log e arquivo de PID diferentes, pois o padrão para cada um desses parâmetros é relativo ao diretório base. Nesse caso, as únicas outras opções que você precisa especificar são as opções `--socket` e `--port`. Suponha que você instale diferentes versões do MySQL usando distribuições binárias de arquivos `tar`. Essas são instaladas em locais diferentes, então você pode iniciar o servidor para cada instalação usando o comando **bin/mysqld\_safe** sob seu diretório base correspondente. **mysqld\_safe** determina a opção adequada `--basedir` para passar para **mysqld**, e você precisa especificar apenas as opções `--socket` e `--port` para **mysqld\_safe**.

Como discutido nas seções a seguir, é possível iniciar servidores adicionais especificando opções de comando apropriadas ou configurando variáveis de ambiente. No entanto, se você precisar executar vários servidores de forma mais permanente, é mais conveniente usar arquivos de opções para especificar para cada servidor os valores dessas opções que devem ser exclusivos dele. A opção `--defaults-file` é útil para esse propósito.
