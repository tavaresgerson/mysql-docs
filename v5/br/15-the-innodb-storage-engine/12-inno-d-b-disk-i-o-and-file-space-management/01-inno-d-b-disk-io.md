### 14.12.1 I/O de Disco do InnoDB

O `InnoDB` usa I/O de disco assíncrono sempre que possível, criando diversos threads para lidar com operações de I/O, enquanto permite que outras operações de Database prossigam enquanto o I/O ainda está em andamento. Nas plataformas Linux e Windows, o `InnoDB` usa as funções de OS e de biblioteca disponíveis para realizar I/O assíncrono “nativo”. Em outras plataformas, o `InnoDB` ainda usa threads de I/O, mas os threads podem, na verdade, aguardar a conclusão das solicitações de I/O; essa técnica é conhecida como I/O assíncrono “simulado”.

#### Read-Ahead

Se o `InnoDB` puder determinar que há uma alta probabilidade de que os dados sejam necessários em breve, ele executa operações de Read-Ahead para trazer esses dados para o Buffer Pool, de modo que fiquem disponíveis na memória. Fazer algumas solicitações de leitura grandes para dados contíguos pode ser mais eficiente do que fazer várias solicitações pequenas e dispersas. Existem duas heurísticas de Read-Ahead no `InnoDB`:

* No Read-Ahead sequencial, se o `InnoDB` notar que o padrão de acesso a um segmento no Tablespace é sequencial, ele envia antecipadamente um lote de leituras de páginas do Database para o sistema de I/O.

* No Read-Ahead aleatório, se o `InnoDB` notar que alguma área em um Tablespace parece estar em processo de ser totalmente lida para o Buffer Pool, ele envia as leituras restantes para o sistema de I/O.

Para obter informações sobre a configuração de heurísticas de Read-Ahead, consulte a Seção 14.8.3.4, “Configurando o Prefetching do InnoDB Buffer Pool (Read-Ahead)”".

#### Doublewrite Buffer

O `InnoDB` usa uma nova técnica de flush de arquivo envolvendo uma estrutura chamada Doublewrite Buffer, que é habilitada por padrão na maioria dos casos (`innodb_doublewrite=ON`). Ele adiciona segurança à recovery após uma saída inesperada ou queda de energia, e melhora o desempenho na maioria das variedades de Unix, reduzindo a necessidade de operações de `fsync()`.

Antes de escrever páginas em um arquivo de dados, o `InnoDB` as grava primeiro em uma área contígua do Tablespace chamada Doublewrite Buffer. Somente após a conclusão da gravação e do flush para o Doublewrite Buffer é que o `InnoDB` grava as páginas em suas posições adequadas no arquivo de dados. Se houver uma saída inesperada do sistema operacional, subsistema de armazenamento ou do processo **mysqld** no meio de uma gravação de página (causando uma condição de *torn page*), o `InnoDB` pode, posteriormente, encontrar uma boa cópia da página no Doublewrite Buffer durante a recovery.

Se os arquivos do system Tablespace ("arquivos ibdata") estiverem localizados em dispositivos Fusion-io que suportam atomic writes, o *doublewrite buffering* é desabilitado automaticamente e atomic writes da Fusion-io são usados para todos os arquivos de dados. Como a configuração do Doublewrite Buffer é global, o *doublewrite buffering* também é desabilitado para arquivos de dados que residem em hardware que não seja Fusion-io. Este recurso é suportado apenas em hardware Fusion-io e é habilitado somente para Fusion-io NVMFS no Linux. Para aproveitar totalmente esse recurso, é recomendada uma configuração de `innodb_flush_method` como `O_DIRECT`.