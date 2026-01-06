### 21.4.3 Arquivos de configuração do cluster do NDB

21.4.3.1 Configuração do NDB Cluster: Exemplo Básico

21.4.3.2 Configuração inicial recomendada para o NDB Cluster

21.4.3.3 Strings de Conexão do NDB Cluster

21.4.3.4 Definindo Computadores em um Clúster NDB

21.4.3.5 Definindo um servidor de gerenciamento de cluster NDB

21.4.3.6 Definindo nós de dados do cluster NDB

21.4.3.7 Definindo SQL e Outros Nodos de API em um NDB Cluster

21.4.3.8 Definindo o Sistema

21.4.3.9 Opções e variáveis do servidor MySQL para o NDB Cluster

21.4.3.10 Conexões de cluster TCP/IP do NDB

21.4.3.11 Conexões de Cluster NDB TCP/IP Usando Conexões Direitas

21.4.3.12 Conexões de Memória Compartilhada do NDB Cluster

21.4.3.13 Configurando parâmetros do buffer de envio do NDB Cluster

Para configurar o NDB Cluster, é necessário trabalhar com dois arquivos:

- `my.cnf`: Especifica opções para todos os executáveis do NDB Cluster. Este arquivo, com o qual você deve estar familiarizado por meio do trabalho anterior com o MySQL, deve ser acessível por cada executável que estiver em execução no cluster.

- `config.ini`: Este arquivo, às vezes conhecido como o arquivo de configuração global, é lido apenas pelo servidor de gerenciamento do NDB Cluster, que, em seguida, distribui as informações contidas nele para todos os processos que participam do clúster. O `config.ini` contém uma descrição de cada nó envolvido no clúster. Isso inclui parâmetros de configuração para nós de dados e parâmetros de configuração para conexões entre todos os nós do clúster. Para uma referência rápida às seções que podem aparecer neste arquivo e quais tipos de parâmetros de configuração podem ser colocados em cada seção, consulte Seções do arquivo `config.ini`.

**Cache de dados de configuração.** O `NDB` utiliza configuração estática. Em vez de ler o arquivo de configuração global toda vez que o servidor de gerenciamento é reiniciado, o servidor de gerenciamento armazena a configuração no cache na primeira vez que é iniciado, e, a partir daí, o arquivo de configuração global é lido apenas quando uma das seguintes condições for verdadeira:

- O servidor de gerenciamento é iniciado usando a opção `--initial`. Quando a opção `--initial` é usada, o arquivo de configuração global é lido novamente, quaisquer arquivos de cache existentes são excluídos e o servidor de gerenciamento cria um novo cache de configuração.

- **O servidor de gerenciamento é iniciado usando a opção `--reload`.** A opção `--reload` faz com que o servidor de gerenciamento compare seu cache com o arquivo de configuração global. Se houver diferenças, o servidor de gerenciamento cria um novo cache de configuração; qualquer cache de configuração existente é preservado, mas não utilizado. Se o cache do servidor de gerenciamento e o arquivo de configuração global contiverem os mesmos dados de configuração, então o cache existente é utilizado e nenhum novo cache é criado.

- O servidor de gerenciamento é iniciado usando `--config-cache=FALSE`. Isso desabilita `--config-cache` (ativado por padrão) e pode ser usado para forçar o servidor de gerenciamento a ignorar completamente o cache de configuração. Nesse caso, o servidor de gerenciamento ignora quaisquer arquivos de configuração que possam estar presentes, lendo sempre seus dados de configuração do arquivo `config.ini` em vez disso.

- **Não foi encontrado cache de configuração.** Nesse caso, o servidor de gerenciamento lê o arquivo de configuração global e cria um cache contendo os mesmos dados de configuração encontrados no arquivo.

**Arquivos de cache de configuração.** O servidor de gerenciamento, por padrão, cria arquivos de cache de configuração em um diretório chamado `mysql-cluster` no diretório de instalação do MySQL. (Se você construir o NDB Cluster a partir do código-fonte em um sistema Unix, a localização padrão é `/usr/local/mysql-cluster`. Isso pode ser substituído em tempo de execução iniciando o servidor de gerenciamento com a opção `--configdir`. Os arquivos de cache de configuração são arquivos binários nomeados de acordo com o padrão `ndb_node_id_config.bin.seq_id`, onde *`node_id`* é o ID do nó do servidor de gerenciamento no cluster e *`seq_id`* é um identificador de cache. Os arquivos de cache são numerados sequencialmente usando *`seq_id`*, na ordem em que são criados. O servidor de gerenciamento usa o arquivo de cache mais recente conforme determinado pelo *`seq_id`*.

Nota

É possível reverter para uma configuração anterior ao excluir os arquivos de cache de configuração posteriores ou renomeando um arquivo de cache anterior para que ele tenha um ID *seq\_id* maior. No entanto, como os arquivos de cache de configuração são escritos em um formato binário, você não deve tentar editar seu conteúdo manualmente.

Para obter mais informações sobre as opções `--configdir` (mysql-cluster-programs-ndb-mgmd.html#option\_ndb\_mgmd\_configdir), `--config-cache` (mysql-cluster-programs-ndb-mgmd.html#option\_ndb\_mgmd\_config-cache), `--initial` (mysql-cluster-programs-ndb-mgmd.html#option\_ndb\_mgmd\_initial) e `--reload` (mysql-cluster-programs-ndb-mgmd.html#option\_ndb\_mgmd\_reload) para o servidor de gerenciamento do NDB Cluster, consulte Seção 21.5.4, “ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster”.

Estamos constantemente melhorando a configuração do Cluster e tentando simplificar esse processo. Embora nos esforcemos para manter a compatibilidade reversa, pode haver momentos em que introduzimos uma mudança incompatível. Nesses casos, tentamos informar os usuários do NDB Cluster com antecedência se uma mudança não for compatível com versões anteriores. Se você encontrar tal mudança e não a tenhamos documentado, por favor, informe-nos no banco de bugs do MySQL usando as instruções fornecidas em Seção 1.5, “Como relatar bugs ou problemas”.
