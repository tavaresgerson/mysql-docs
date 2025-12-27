### 25.4.3 Arquivos de Configuração do NDB Cluster

25.4.3.1 Configuração do NDB Cluster: Exemplo Básico

25.4.3.2 Configuração Inicial Recomendada para o NDB Cluster

25.4.3.3 Strings de Conexão do NDB Cluster

25.4.3.4 Definindo Computadores em um NDB Cluster

25.4.3.5 Definindo um Servidor de Gerenciamento do NDB Cluster

25.4.3.6 Definindo Nodos de Dados do NDB Cluster

25.4.3.7 Definindo Nodos SQL e Outros Nodos de API em um NDB Cluster

25.4.3.8 Definindo o Sistema

25.4.3.9 Opções e Variáveis do Servidor MySQL para o NDB Cluster

25.4.3.10 Conexões TCP/IP do NDB Cluster

25.4.3.11 Conexões TCP/IP do NDB Cluster Usando Conexões Direitas

25.4.3.12 Conexões de Memória Compartilhada do NDB Cluster

25.4.3.13 Gerenciamento de Memória do Nó de Dados

25.4.3.14 Configurando Parâmetros do Buffer de Envio do NDB Cluster

Configurar o NDB Cluster requer trabalhar com dois arquivos:

* `my.cnf`: Especifica opções para todos os executaveis do NDB Cluster. Este arquivo, com o qual você deve estar familiarizado com o trabalho anterior com o MySQL, deve ser acessível por cada executável que está em execução no cluster.

* `config.ini`: Este arquivo, às vezes conhecido como arquivo de configuração global, é lido apenas pelo servidor de gerenciamento do NDB Cluster, que então distribui as informações contidas nele para todos os processos que estão participando do cluster. O `config.ini` contém uma descrição de cada nó envolvido no cluster. Isso inclui parâmetros de configuração para nós de dados e parâmetros de configuração para conexões entre todos os nós no cluster. Para uma referência rápida às seções que podem aparecer neste arquivo e quais tipos de parâmetros de configuração podem ser colocados em cada seção, consulte Seções do Arquivo `config.ini`.

**Cache de dados de configuração.** O `NDB` utiliza configuração estática. Em vez de ler o arquivo de configuração global toda vez que o servidor de gerenciamento é reiniciado, o servidor de gerenciamento cacheia a configuração na primeira vez que é iniciado, e, a partir daí, o arquivo de configuração global é lido apenas quando uma das seguintes condições for verdadeira:

* **O servidor de gerenciamento é iniciado usando a opção --initial.** Quando a opção `--initial` é usada, o arquivo de configuração global é lido novamente, quaisquer arquivos de cache existentes são excluídos e o servidor de gerenciamento cria um novo cache de configuração.

* **O servidor de gerenciamento é iniciado usando a opção --reload.** A opção `--reload` faz com que o servidor de gerenciamento compare seu cache com o arquivo de configuração global. Se eles forem diferentes, o servidor de gerenciamento cria um novo cache de configuração; qualquer cache de configuração existente é preservado, mas não usado. Se o cache do servidor de gerenciamento e o arquivo de configuração global contiverem os mesmos dados de configuração, então o cache existente é usado e nenhum novo cache é criado.

* **O servidor de gerenciamento é iniciado usando --config-cache=FALSE.** Isso desabilita `--config-cache` (ativado por padrão) e pode ser usado para forçar o servidor de gerenciamento a ignorar completamente o cache de configuração. Neste caso, o servidor de gerenciamento ignora quaisquer arquivos de configuração que possam estar presentes, lendo sempre seus dados de configuração do arquivo `config.ini` em vez disso.

* **Cache de configuração não encontrado.** Neste caso, o servidor de gerenciamento lê o arquivo de configuração global e cria um cache contendo os mesmos dados de configuração encontrados no arquivo.

**Arquivos de cache de configuração.** O servidor de gerenciamento, por padrão, cria arquivos de cache de configuração em um diretório chamado `mysql-cluster` no diretório de instalação do MySQL. (Se você construir o NDB Cluster a partir do código-fonte em um sistema Unix, a localização padrão é `/usr/local/mysql-cluster`. Isso pode ser sobrescrito em tempo de execução ao iniciar o servidor de gerenciamento com a opção `--configdir`. Os arquivos de cache de configuração são arquivos binários nomeados de acordo com o padrão `ndb_node_id_config.bin.seq_id`, onde *`node_id`* é o ID de nó do servidor de gerenciamento no cluster, e *`seq_id`* é um identificador de cache. Os arquivos de cache são numerados sequencialmente usando *`seq_id`*, na ordem em que são criados. O servidor de gerenciamento usa o arquivo de cache mais recente conforme determinado pelo *`seq_id`*.

Nota

É possível reverter para uma configuração anterior ao excluir arquivos de cache de configuração posteriores ou renomeando um arquivo de cache anterior para que tenha um *`seq_id`* maior. No entanto, como os arquivos de cache de configuração são escritos em um formato binário, você não deve tentar editar seu conteúdo manualmente.

Para obter mais informações sobre as opções `--configdir`, `--config-cache`, `--initial` e `--reload` para o servidor de gerenciamento do NDB Cluster, consulte a Seção 25.5.4, “ndb\_mgmd — O Daemon do Servidor de Gerenciamento do NDB Cluster”.

Estamos constantemente melhorando a configuração do NDB Cluster e tentando simplificar esse processo. Embora nos esforcemos para manter a compatibilidade reversa, pode haver momentos em que introduzimos uma mudança incompatível. Nesses casos, tentamos informar os usuários do NDB Cluster com antecedência se uma mudança não for compatível com versões anteriores. Se você encontrar tal mudança e não a tenhamos documentado, por favor, informe-nos no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.6, “Como relatar bugs ou problemas”.