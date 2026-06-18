### 17.11.1 Entrada/saída de disco InnoDB

`InnoDB` utiliza I/O de disco assíncrono sempre que possível, criando vários threads para lidar com operações de I/O, permitindo que outras operações do banco de dados prossigam enquanto o I/O ainda está em andamento. Em plataformas Linux e Windows, `InnoDB` utiliza as funções do sistema operacional e da biblioteca disponíveis para realizar I/O assíncrono "nativo". Em outras plataformas, `InnoDB` ainda utiliza threads de I/O, mas os threads podem realmente esperar que as solicitações de I/O sejam concluídas; essa técnica é conhecida como I/O assíncrono "simulado".

#### Leia antecipadamente

Se o `InnoDB` puder determinar que há uma alta probabilidade de que os dados possam ser necessários em breve, ele realiza operações de leitura antecipada para trazer esses dados para o pool de buffer, para que estejam disponíveis na memória. Fazer algumas solicitações de leitura grandes para dados contíguos pode ser mais eficiente do que fazer várias solicitações pequenas e espalhadas. Existem duas heurísticas de leitura antecipada no `InnoDB`:

- No pré-leitura sequencial, se o `InnoDB` perceber que o padrão de acesso a um segmento no espaço de tabelas é sequencial, ele publica antecipadamente um lote de leituras de páginas do banco de dados no sistema de E/S.

- No pré-leitura aleatória, se o `InnoDB` perceber que uma área em um espaço de tabela parece estar em processo de ser totalmente lida no pool de buffers, ele envia as leituras restantes para o sistema de E/S.

Para obter informações sobre a configuração das heurísticas de pré-leitura, consulte a Seção 17.8.3.4, “Configurando a pré-pesquisa do buffer do InnoDB (Pré-leitura”).

#### Buffer de escrita dupla

O `InnoDB` utiliza uma técnica inovadora de esvaziamento de arquivos que envolve uma estrutura chamada buffer de dupla escrita, que é ativada por padrão na maioria dos casos (`innodb_doublewrite=ON`). Isso adiciona segurança à recuperação após uma saída inesperada ou queda de energia e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações `fsync()`.

Antes de escrever páginas em um arquivo de dados, `InnoDB` escreve-as primeiro em uma área de armazenamento chamada buffer de dupla escrita. Somente após a escrita e o esvaziamento para o buffer de dupla escrita serem concluídos, `InnoDB` escreve as páginas em suas posições corretas no arquivo de dados. Se houver um sistema operacional, subsistema de armazenamento ou saída inesperada do processo **mysqld** durante a escrita de uma página (causando uma condição de página rasgada), `InnoDB` pode, posteriormente, encontrar uma boa cópia da página do buffer de dupla escrita durante a recuperação.

Para obter mais informações sobre o buffer de escrita dupla, consulte a Seção 17.6.4, “Buffer de Escrita Dupla”.
