### 21.4.3 Arquivos de Configuração do NDB Cluster

[21.4.3.1 Configuração do NDB Cluster: Exemplo Básico](mysql-cluster-config-example.html)

[21.4.3.2 Configuração Inicial Recomendada para NDB Cluster](mysql-cluster-config-starting.html)

[21.4.3.3 Connection Strings do NDB Cluster](mysql-cluster-connection-strings.html)

[21.4.3.4 Definição de Computadores em um NDB Cluster](mysql-cluster-computer-definition.html)

[21.4.3.5 Definição de um NDB Cluster Management Server](mysql-cluster-mgm-definition.html)

[21.4.3.6 Definição dos Data Nodes do NDB Cluster](mysql-cluster-ndbd-definition.html)

[21.4.3.7 Definição de SQL e Outros API Nodes em um NDB Cluster](mysql-cluster-api-definition.html)

[21.4.3.8 Definição do Sistema](mysql-cluster-system-definition.html)

[21.4.3.9 Options e Variables do MySQL Server para NDB Cluster](mysql-cluster-options-variables.html)

[21.4.3.10 Conexões TCP/IP do NDB Cluster](mysql-cluster-tcp-definition.html)

[21.4.3.11 Conexões TCP/IP do NDB Cluster Usando Conexões Diretas](mysql-cluster-tcp-definition-direct.html)

[21.4.3.12 Conexões de Shared Memory do NDB Cluster](mysql-cluster-shm-definition.html)

[21.4.3.13 Configurando Parâmetros de Send Buffer do NDB Cluster](mysql-cluster-config-send-buffers.html)

Configurar o NDB Cluster requer trabalhar com dois arquivos:

* `my.cnf`: Especifica options para todos os executáveis do NDB Cluster. Este arquivo, com o qual você deve estar familiarizado de trabalhos anteriores com MySQL, deve estar acessível por cada executável rodando no Cluster.

* `config.ini`: Este arquivo, por vezes conhecido como o arquivo de configuração global, é lido apenas pelo Management Server do NDB Cluster, que então distribui as informações nele contidas para todos os processos participantes do Cluster. O `config.ini` contém uma descrição de cada Node envolvido no Cluster. Isso inclui configuration parameters para os Data Nodes e configuration parameters para as conexões entre todos os Nodes no Cluster. Para uma referência rápida às seções que podem aparecer neste arquivo, e que tipos de configuration parameters podem ser colocados em cada seção, consulte [Sections of the `config.ini` File](mysql-cluster-config-example.html#mysql-cluster-config-ini-sections "Sections of the config.ini File").

**Caching de dados de configuração.** O `NDB` utiliza configuração stateful (com estado). Em vez de ler o arquivo de configuração global toda vez que o Management Server é reiniciado, o Management Server armazena a configuration em cache na primeira vez que é iniciado e, posteriormente, o arquivo de configuração global é lido apenas quando uma das seguintes condições for verdadeira:

* **O Management Server é iniciado usando a option --initial.** Quando [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) é usado, o arquivo de configuração global é lido novamente, quaisquer arquivos de cache existentes são excluídos, e o Management Server cria um novo configuration cache.

* **O Management Server é iniciado usando a option --reload.** A option [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) faz com que o Management Server compare seu cache com o arquivo de configuração global. Se forem diferentes, o Management Server cria um novo configuration cache; qualquer configuration cache existente é preservado, mas não utilizado. Se o cache do Management Server e o arquivo de configuração global contiverem os mesmos dados de configuração, o cache existente é usado, e nenhum novo cache é criado.

* **O Management Server é iniciado usando --config-cache=FALSE.** Isso desabilita [`--config-cache`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache) (habilitado por default) e pode ser usado para forçar o Management Server a ignorar o configuration caching por completo. Neste caso, o Management Server ignora quaisquer arquivos de configuração que possam estar presentes, lendo sempre seus dados de configuração a partir do arquivo `config.ini`.

* **Nenhum configuration cache é encontrado.** Neste caso, o Management Server lê o arquivo de configuração global e cria um cache contendo os mesmos dados de configuração encontrados no arquivo.

**Arquivos de configuration cache.** Por default, o Management Server cria arquivos de configuration cache em um diretório chamado `mysql-cluster` no diretório de instalação do MySQL. (Se você compilar o NDB Cluster a partir do source em um sistema Unix, a localização default é `/usr/local/mysql-cluster`.) Isso pode ser sobrescrito em runtime, iniciando o Management Server com a option [`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir). Os arquivos de configuration cache são arquivos binários nomeados de acordo com o padrão `ndb_node_id_config.bin.seq_id`, onde *`node_id`* é o ID do Node do Management Server no Cluster, e *`seq_id`* é um identificador de cache. Os arquivos de cache são numerados sequencialmente usando *`seq_id`*, na ordem em que são criados. O Management Server utiliza o arquivo de cache mais recente, conforme determinado pelo *`seq_id`*.

Nota

É possível reverter para uma configuração anterior excluindo arquivos de configuration cache posteriores ou renomeando um arquivo de cache anterior para que ele tenha um *`seq_id`* mais alto. No entanto, uma vez que os arquivos de configuration cache são escritos em formato binário, você não deve tentar editar seu conteúdo manualmente.

Para mais informações sobre as options [`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir), [`--config-cache`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache), [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) e [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) para o Management Server do NDB Cluster, consulte [Section 21.5.4, “ndb_mgmd — O Daemon Management Server do NDB Cluster”](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon").

Estamos continuamente fazendo melhorias na configuração do Cluster e tentando simplificar este processo. Embora nos esforcemos para manter a backward compatibility (compatibilidade retroativa), pode haver momentos em que introduzimos uma alteração incompatível. Nesses casos, tentamos avisar os usuários do NDB Cluster com antecedência se uma alteração não for backward compatible. Se você encontrar tal alteração e não a tivermos documentado, por favor, relate-a no database de bugs do MySQL usando as instruções fornecidas em [Section 1.5, “Como Reportar Bugs ou Problemas”](bug-reports.html "1.5 How to Report Bugs or Problems").