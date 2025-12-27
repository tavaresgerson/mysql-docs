### 17.11.1 E/S de Disco do `InnoDB`

O `InnoDB` utiliza E/S de disco assíncrona sempre que possível, criando vários threads para lidar com operações de E/S, permitindo que outras operações do banco de dados prossigam enquanto a E/S ainda está em andamento. Em plataformas Linux e Windows, o `InnoDB` utiliza as funções do sistema operacional e da biblioteca disponíveis para realizar E/S assíncrona “nativa”. Em outras plataformas, o `InnoDB` ainda utiliza threads de E/S, mas os threads podem realmente esperar pelos pedidos de E/S serem concluídos; essa técnica é conhecida como E/S assíncrona “simulada”.

#### Leitura Antecipada

Se o `InnoDB` puder determinar que há uma alta probabilidade de que os dados possam ser necessários em breve, ele realiza operações de leitura antecipada para trazer esses dados para o pool de buffers, para que estejam disponíveis na memória. Fazer algumas solicitações de leitura grandes para dados contíguos pode ser mais eficiente do que fazer várias solicitações pequenas e espalhadas. Existem duas heurísticas de leitura antecipada no `InnoDB`:

* Na leitura antecipada sequencial, se o `InnoDB` notar que o padrão de acesso a um segmento no espaço de tabelas é sequencial, ele publica antecipadamente um lote de leituras de páginas do banco de dados no sistema de E/S.

* Na leitura antecipada aleatória, se o `InnoDB` notar que uma área em um espaço de tabelas parece estar em processo de ser completamente lida para o pool de buffers, ele publica as leituras restantes no sistema de E/S.

Para obter informações sobre a configuração das heurísticas de leitura antecipada, consulte a Seção 17.8.3.4, “Configurando a Pré-visualização do Pool de Buffers do `InnoDB` (Leitura Antecipada”)").

#### Buffer de Dupla Escrita

O `InnoDB` utiliza uma técnica de limpeza de arquivos inovadora que envolve uma estrutura chamada buffer de dupla escrita, que é habilitada por padrão na maioria dos casos (`innodb_doublewrite=ON`). Isso adiciona segurança à recuperação após uma saída inesperada ou queda de energia e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`.

Antes de escrever páginas em um arquivo de dados, o `InnoDB` primeiro as escreve em uma área de armazenamento chamada buffer de dupla escrita. Somente após a escrita e o esvaziamento para o buffer de dupla escrita serem concluídos, o `InnoDB` escreve as páginas em suas posições apropriadas no arquivo de dados. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo `mysqld` durante a escrita de uma página (causando uma condição de página rasgada), o `InnoDB` pode, posteriormente, encontrar uma boa cópia da página do buffer de dupla escrita durante a recuperação.

Para mais informações sobre o buffer de dupla escrita, consulte a Seção 17.6.4, “Buffer de Dupla Escrita”.