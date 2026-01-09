### 21.6.5 Realizar um Reinício Rotativo de um Clúster NDB

Esta seção discute como realizar um reinício contínuo de uma instalação de NDB Cluster, chamado assim porque envolve a parada e o início (ou reinício) de cada nó por vez, para que o próprio cluster permaneça operacional. Isso é frequentemente feito como parte de uma atualização ou atualização contínua, onde a alta disponibilidade do cluster é obrigatória e nenhum tempo de inatividade do cluster como um todo é permitido. Quando nos referimos a atualizações, as informações fornecidas aqui geralmente se aplicam também a atualizações para versões anteriores.

Há várias razões pelas quais um reinício em andamento pode ser desejável. Essas razões são descritas nos próximos parágrafos.

**Alterações na configuração.** Para fazer uma alteração na configuração do cluster, como adicionar um nó SQL ao cluster ou definir um parâmetro de configuração para um novo valor.

Atualização ou downgrade do software do NDB Cluster. Para atualizar o cluster para uma versão mais recente do software do NDB Cluster (ou para fazer um downgrade para uma versão mais antiga). Isso geralmente é chamado de “atualização contínua” (ou “downgrade contínuo”, quando se reverte para uma versão mais antiga do NDB Cluster).

**Alteração no host do nó.** Para fazer alterações no hardware ou no sistema operacional em que um ou mais nós do NDB Cluster estão em execução.

**Reinicialização do sistema (reinicialização do cluster).** Para reinicializar o cluster porque ele atingiu um estado indesejável. Nesses casos, muitas vezes é desejável recarregar os dados e metadados de um ou mais nós de dados. Isso pode ser feito de três maneiras:

- Comece cada processo do nó de dados (**ndbd** ou possivelmente **ndbmtd**) com a opção `--initial` (**ndbd**), que obriga o nó de dados a limpar seu sistema de arquivos e a recarregar todos os dados e metadados do NDB Cluster dos outros nós de dados.

- Crie um backup usando o cliente **ndb_mgm** com o comando `START BACKUP` (mysql-cluster-backup-using-management-client.html) antes de realizar o reinício. Após a atualização, restaure o nó ou os nós usando **ndb_restore**.

  Para obter mais informações, consulte Seção 21.6.8, “Backup Online de NDB Cluster” e Seção 21.5.24, “ndb_restore — Restaurar um backup de NDB Cluster”.

- Use **mysqldump** para criar um backup antes da atualização; depois, restaure o dump usando `LOAD DATA`.

**Recuperação de recursos.** Para liberar a memória previamente alocada a uma tabela por operações consecutivas de `INSERT` e `DELETE`, para reutilizá-la por outras tabelas do NDB Cluster.

O processo para realizar um reinício contínuo pode ser generalizado da seguinte forma:

1. Pare todos os nós de gerenciamento de clúster (**ndb_mgmd** processos), reconecte-os e, em seguida, reinicie-os. (Veja Reinicializações em rolagem com múltiplos servidores de gerenciamento.)

2. Pare, reconfigure e, em seguida, reinicie cada nó de dados do cluster (processo **ndbd**) uma a uma.

   Alguns parâmetros de configuração de nós podem ser atualizados emitindo `RESTART` para cada um dos nós de dados no cliente **ndb_mgm** após o passo anterior. Outros parâmetros exigem que o nó de dados seja parado completamente usando o comando de gerenciamento `STOP`, e depois reiniciado novamente a partir de uma janela de sistema invocando o executável **ndbd** ou **ndbmtd** conforme apropriado. (Um comando de shell como **kill** também pode ser usado na maioria dos sistemas Unix para parar um processo de nó de dados, mas o comando `STOP` é preferido e geralmente mais simples.)

   Nota

   No Windows, você também pode usar os comandos **SC STOP** e **SC START**, os comandos `NET STOP` e `NET START`, ou o Gerenciador de Serviços do Windows para parar e iniciar nós que foram instalados como serviços do Windows (consulte Seção 21.3.2.4, “Instalando Processos do NDB Cluster como Serviços do Windows”).

   O tipo de reinício necessário está indicado na documentação para cada parâmetro de configuração do nó. Consulte Seção 21.4.3, “Arquivos de configuração do clúster NDB”.

3. Pare, reconfigure e, em seguida, reinicie cada nó do cluster SQL (**mysqld**) uma a uma.

O NDB Cluster suporta uma ordem de atualização dos nós um pouco flexível. Ao atualizar um NDB Cluster, você pode atualizar os nós de API (incluindo os nós de SQL) antes de atualizar os nós de gerenciamento, os nós de dados ou ambos. Em outras palavras, você tem permissão para atualizar os nós de API e SQL em qualquer ordem. Isso está sujeito às seguintes disposições:

- Essa funcionalidade é destinada ao uso como parte de uma atualização online apenas. Uma mistura de binários de nós de diferentes lançamentos do NDB Cluster não é intencional nem é suportada para uso contínuo e de longo prazo em um ambiente de produção.

- Você deve atualizar todos os nós do mesmo tipo (de gerenciamento, dados ou API) antes de atualizar quaisquer nós de um tipo diferente. Isso permanece verdadeiro, independentemente da ordem em que os nós são atualizados.

- Você deve atualizar todos os nós de gerenciamento antes de atualizar quaisquer nós de dados. Isso permanece verdadeiro, independentemente da ordem em que você atualizar os nós de API e SQL do cluster.

- As funcionalidades específicas da versão "nova" não devem ser utilizadas até que todos os nós de gerenciamento e nós de dados tenham sido atualizados.

  Isso também se aplica a qualquer mudança na versão do servidor MySQL que possa ser aplicada, além da mudança na versão do motor NDB, então não se esqueça de levar isso em consideração ao planejar a atualização. (Isso é verdade para atualizações online do NDB Cluster em geral.)

Não é possível que qualquer nó da API realize operações de esquema (como declarações de definição de dados) durante o reinício de um nó. Devido, em parte, a essa limitação, as operações de esquema também não são suportadas durante uma atualização ou redução online. Além disso, não é possível realizar backups nativos enquanto uma atualização ou redução está em andamento.

**Reinício em rolagem com múltiplos servidores de gerenciamento.**

Ao realizar um reinício contínuo de um NDB Cluster com vários nós de gerenciamento, você deve ter em mente que o **ndb_mgmd** verifica se algum outro nó de gerenciamento está em execução e, se estiver, tenta usar os dados de configuração desse nó. Para evitar que isso ocorra e forçar o **ndb_mgmd** a reler seu arquivo de configuração, siga os passos abaixo:

1. Pare todos os processos do NDB Cluster **ndb_mgmd**.

2. Atualize todos os arquivos `config.ini`.

3. Inicie um único **ndb_mgmd** com `--reload`, `--initial` ou ambas as opções conforme desejar.

4. Se você iniciou o primeiro **ndb_mgmd** com a opção `--initial`, você também deve iniciar quaisquer processos restantes de **ndb_mgmd** usando `--initial`.

   Independentemente das outras opções usadas ao iniciar o primeiro **ndb_mgmd**, você não deve iniciar quaisquer processos restantes do **ndb_mgmd** após o primeiro usando `--reload`.

5. Complete os reinícios contínuos dos nós de dados e dos nós de API como de costume.

Ao realizar um reinício contínuo para atualizar a configuração do clúster, você pode usar a coluna `config_generation` da tabela `ndbinfo.nodes` para acompanhar quais nós de dados foram reiniciados com sucesso com a nova configuração. Veja Seção 21.6.15.28, “A tabela ndbinfo nodes”.
