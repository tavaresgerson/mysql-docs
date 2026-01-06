### 14.12.1 Entrada/saída de disco InnoDB

O `InnoDB` utiliza o I/O de disco assíncrono sempre que possível, criando vários threads para lidar com as operações de I/O, permitindo que outras operações do banco de dados prossigam enquanto o I/O ainda está em andamento. Nas plataformas Linux e Windows, o `InnoDB` utiliza as funções do sistema operacional e da biblioteca disponíveis para realizar o I/O assíncrono "nativo". Em outras plataformas, o `InnoDB` ainda utiliza threads de I/O, mas os threads podem, na verdade, esperar pelos pedidos de I/O serem concluídos; essa técnica é conhecida como I/O assíncrono "simulado".

#### Leia antecipadamente

Se o `InnoDB` puder determinar que há uma alta probabilidade de que os dados possam ser necessários em breve, ele realiza operações de leitura antecipada para trazer esses dados para o pool de buffer, para que estejam disponíveis na memória. Fazer algumas solicitações de leitura grandes para dados contíguos pode ser mais eficiente do que fazer várias solicitações pequenas e espalhadas. Existem duas heurísticas de leitura antecipada no `InnoDB`:

- No pré-leitura sequencial, se o `InnoDB` perceber que o padrão de acesso a um segmento no espaço de tabelas é sequencial, ele envia antecipadamente um lote de leituras de páginas do banco de dados para o sistema de E/S.

- No pré-leitura aleatória, se o `InnoDB` perceber que uma área de um espaço de tabela parece estar em processo de ser totalmente lida para o pool de buffers, ele envia as leituras restantes para o sistema de E/S.

Para obter informações sobre a configuração das heurísticas de pré-leitura, consulte a Seção 14.8.3.4, “Configurando a pré-pesquisa do buffer do InnoDB (Pré-leitura”).

#### Buffer de escrita dupla

O `InnoDB` utiliza uma técnica inovadora de esvaziamento de arquivos que envolve uma estrutura chamada buffer de dupla escrita, que é ativada por padrão na maioria dos casos (`innodb_doublewrite=ON`). Isso adiciona segurança à recuperação após uma saída inesperada ou queda de energia e melhora o desempenho na maioria das versões do Unix, reduzindo a necessidade de operações `fsync()`.

Antes de escrever páginas em um arquivo de dados, o `InnoDB` primeiro as escreve em uma área de espaço de tabelas contíguas chamada buffer de dupla escrita. Somente após a escrita e o esvaziamento para o buffer de dupla escrita serem concluídos, o `InnoDB` escreve as páginas em suas posições corretas no arquivo de dados. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo `mysqld` durante a escrita de uma página (causando uma condição de página rasgada), o `InnoDB` pode, posteriormente, encontrar uma boa cópia da página do buffer de dupla escrita durante a recuperação.

Se os arquivos de espaço de tabela do sistema (“arquivos ibdata”) estiverem localizados em dispositivos Fusion-io que suportam escritas atômicas, o buffer de escrita dupla será desativado automaticamente e as escritas atômicas do Fusion-io serão usadas para todos os arquivos de dados. Como o ajuste do buffer de escrita dupla é global, o buffer de escrita dupla também será desativado para arquivos de dados que estejam em hardware não Fusion-io. Esse recurso é suportado apenas em hardware Fusion-io e só está habilitado para o Fusion-io NVMFS no Linux. Para aproveitar ao máximo esse recurso, é recomendado o ajuste `innodb_flush_method` de `O_DIRECT`.
