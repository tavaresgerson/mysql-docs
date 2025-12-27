### 25.6.5 Realizar um Reinício Rotativo de um Clúster NDB

Esta seção discute como realizar um reinício rotativo de uma instalação de um Clúster NDB, chamado assim porque envolve a parada e o início (ou reinício) de cada nó por vez, para que o próprio clúster permaneça operacional. Isso é frequentemente feito como parte de uma atualização ou atualização reversa rotativa, onde a alta disponibilidade do clúster é obrigatória e nenhum tempo de inatividade do clúster como um todo é permitido. Quando nos referimos a atualizações, as informações fornecidas aqui geralmente se aplicam também a atualizações reversas.

Há várias razões pelas quais um reinício rotativo pode ser desejável. Essas são descritas nos próximos parágrafos.

**Mudança na configuração.** Para fazer uma mudança na configuração do clúster, como adicionar um nó SQL ao clúster, ou definir um parâmetro de configuração para um novo valor.

**Atualização ou atualização reversa do software do Clúster NDB.** Para atualizar o clúster para uma versão mais nova do software do Clúster NDB (ou para atualizá-lo para uma versão mais antiga). Isso geralmente é referido como uma “atualização rotativa” (ou “atualização reversa”, quando se reverte para uma versão mais antiga do Clúster NDB).

**Mudança no host do nó.** Para fazer alterações no hardware ou no sistema operacional em que um ou mais nós do Clúster NDB estão executando processos.

**Reinício do sistema (reinício do clúster).** Para reiniciar o clúster porque ele atingiu um estado indesejável. Nesses casos, muitas vezes é desejável recarregar os dados e metadados de um ou mais nós de dados. Isso pode ser feito de qualquer uma das três maneiras:

* Inicie cada processo do nó de dados (**ndbd** ou possivelmente **ndbmtd**") com a opção `--initial`, que obriga o nó de dados a limpar seu sistema de arquivos e a recarregar todos os dados e metadados do NDB Cluster do outro nó de dados. Isso também obriga à remoção de todos os objetos e arquivos de Dados em Disco associados a esses objetos.

* Crie uma cópia de segurança usando o comando `START BACKUP` do cliente **ndb\_mgm** antes de realizar o reinício. Após a atualização, restaure o nó ou nós usando **ndb\_restore**.

Consulte a Seção 25.6.8, “Backup Online do NDB Cluster”, e a Seção 25.5.23, “ndb\_restore — Restaurar uma Cópia de Segurança do NDB Cluster”, para obter mais informações.

* Use **mysqldump** para criar uma cópia de segurança antes da atualização; depois, restaure o dump usando `LOAD DATA`.

**Recuperação de Recursos.** Para liberar a memória previamente alocada a uma tabela por operações consecutivas de `INSERT` e `DELETE`, para uso por outras tabelas do NDB Cluster.

O processo para realizar um reinício em rolagem pode ser generalizado da seguinte forma:

1. Parar todos os nós de gerenciamento do cluster (processos **ndb\_mgmd**), reconfigurá-los e, em seguida, reiniciá-los. (Veja Reinicializações em Rolagem com Múltiplos Servidores de Gerenciamento.)

2. Parar, reconfigurar e, em seguida, reiniciar cada nó de dados do cluster (processo **ndbd**), uma por uma.

Alguns parâmetros de configuração do nó podem ser atualizados emitindo `RESTART` para cada um dos nós de dados no cliente **ndb\_mgm** após a etapa anterior. Outros parâmetros exigem que o nó de dados seja parado completamente usando o comando `STOP` do cliente de gerenciamento, e, em seguida, reiniciado a partir de uma shell do sistema invocando o executável **ndbd** ou **ndbmtd"** conforme apropriado. (Um comando shell como **kill** também pode ser usado em sistemas Unix na maioria dos casos para parar um processo de nó de dados, mas o comando `STOP` é preferido e geralmente mais simples.)

Nota

No Windows, você também pode usar os comandos **SC STOP** e **SC START**, os comandos `NET STOP` e `NET START`, ou o Gerenciador de Serviços do Windows para parar e iniciar nós que foram instalados como serviços do Windows (veja a Seção 25.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”).

O tipo de reinício necessário está indicado na documentação para cada parâmetro de configuração do nó. Veja a Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”.

3. Parar, reconfigurar e, em seguida, reiniciar cada nó SQL do cluster (o processo **mysqld**) uma a uma.

O NDB Cluster suporta uma ordem um tanto flexível para a atualização dos nós. Ao atualizar um NDB Cluster, você pode atualizar nós API (incluindo nós SQL) antes de atualizar os nós de gerenciamento, nós de dados ou ambos. Em outras palavras, você tem permissão para atualizar os nós API e SQL em qualquer ordem. Isso está sujeito às seguintes disposições:

* Esta funcionalidade é destinada ao uso como parte de uma atualização online apenas. Uma mistura de binários de nós de diferentes versões do NDB Cluster não é intencionada nem suportada para uso contínuo e de longo prazo em um ambiente de produção.

* Você deve atualizar todos os nós do mesmo tipo (nó de gerenciamento, nó de dados ou nó API) antes de atualizar quaisquer nós de um tipo diferente. Isso permanece verdadeiro, independentemente da ordem em que os nós são atualizados.

* Você deve atualizar todos os nós de gerenciamento antes de atualizar quaisquer nós de dados. Isso permanece verdadeiro, independentemente da ordem em que você atualiza os nós API e SQL do cluster.

* Recursos específicos da versão “nova” não devem ser usados até que todos os nós de gerenciamento e nós de dados tenham sido atualizados.

Isso também se aplica a qualquer mudança na versão do servidor MySQL que possa ser aplicada, além da mudança na versão do motor NDB, então não se esqueça de levar isso em consideração ao planejar a atualização. (Isso é verdade para atualizações online do NDB Cluster em geral.)

Não é possível que qualquer nó da API realize operações de esquema (como declarações de definição de dados) durante uma reinicialização do nó. Devido, em parte, a essa limitação, as operações de esquema também não são suportadas durante uma atualização ou atualização para uma versão menor online. Além disso, não é possível realizar backups nativos enquanto uma atualização ou atualização para uma versão menor está em andamento.

**Reinicializações em rolagem com múltiplos servidores de gerenciamento.**

Ao realizar uma reinicialização em rolagem de um NDB Cluster com múltiplos nós de gerenciamento, você deve ter em mente que o **ndb\_mgmd** verifica se algum outro nó de gerenciamento está em execução e, se estiver, tenta usar os dados de configuração desse nó. Para evitar que isso ocorra e forçar o **ndb\_mgmd** a reler seu arquivo de configuração, siga os passos abaixo:

1. Pare todos os processos do **ndb\_mgmd** do NDB Cluster.
2. Atualize todos os arquivos `config.ini`.
3. Inicie um único **ndb\_mgmd** com `--reload`, `--initial` ou ambas as opções, conforme desejar.

4. Se você iniciou o primeiro **ndb\_mgmd** com a opção `--initial`, também deve iniciar quaisquer processos restantes do **ndb\_mgmd** usando `--initial`.

Independentemente de quaisquer outras opções usadas ao iniciar o primeiro **ndb\_mgmd**, você não deve iniciar quaisquer processos restantes do **ndb\_mgmd** após o primeiro usando `--reload`.

5. Complete as reinicializações em rolagem dos nós de dados e dos nós da API normalmente.

Ao realizar um reinício contínuo para atualizar a configuração do clúster, você pode usar a coluna `config_generation` da tabela `ndbinfo.nodes` para acompanhar quais nós de dados foram reiniciados com sucesso com a nova configuração. Veja a Seção 25.6.15.48, “A tabela ndbinfo nodes”.