### 8.10.2 Cache de Chave MyISAM

Para minimizar o I/O do disco, o mecanismo de armazenamento `MyISAM` utiliza uma estratégia que é usada por muitos sistemas de gerenciamento de banco de dados. Ele emprega um mecanismo de cache para manter os blocos de tabela mais acessados na memória:

- Para os blocos de índice, uma estrutura especial chamada cache de chaves (ou buffer de chaves) é mantida. A estrutura contém vários buffers de blocos onde os blocos de índice mais utilizados são armazenados.

- Para blocos de dados, o MySQL não usa um cache especial. Em vez disso, ele depende do cache do sistema de arquivos do sistema operacional nativo.

Esta seção descreve, primeiro, o funcionamento básico do cache de chaves `MyISAM`. Em seguida, discute as funcionalidades que melhoram o desempenho do cache de chaves e que permitem um melhor controle da operação do cache:

- Múltiplas sessões podem acessar o cache simultaneamente.
- Você pode configurar vários caches de chave e atribuir índices de tabela a caches específicos.

Para controlar o tamanho do cache de chaves, use a variável de sistema `key_buffer_size`. Se essa variável for definida como zero, o cache de chaves não será usado. O cache de chaves também não será usado se o valor de `key_buffer_size` for muito pequeno para alocar o número mínimo de buffers de bloco (8).

Quando o cache de chaves não está operacional, os arquivos de índice são acessados usando apenas o bufferização do sistema de arquivos nativo fornecido pelo sistema operacional. (Em outras palavras, os blocos de índice da tabela são acessados usando a mesma estratégia empregada para os blocos de dados da tabela.)

Um bloco de índice é uma unidade contínua de acesso aos arquivos de índice do `MyISAM`. Geralmente, o tamanho de um bloco de índice é igual ao tamanho dos nós da árvore B do índice. (Os índices são representados no disco usando uma estrutura de dados B-tree. Os nós na parte inferior da árvore são nós de folha. Os nós acima dos nós de folha são nós não-folha.)

Todos os buffers de bloco em uma estrutura de cache de chave têm o mesmo tamanho. Esse tamanho pode ser igual, maior ou menor que o tamanho de um bloco de índice de tabela. Normalmente, um desses dois valores é um múltiplo do outro.

Quando os dados de qualquer bloco de índice de tabela precisam ser acessados, o servidor verifica primeiro se estão disponíveis em algum buffer de bloco da cache de chaves. Se estiverem, o servidor acessa os dados na cache de chaves em vez de no disco. Ou seja, lê da cache ou escreve nela em vez de ler ou escrever no disco. Caso contrário, o servidor escolhe um buffer de bloco de cache que contenha um bloco (ou blocos) de índice de tabela diferente e substitui os dados por uma cópia do bloco de índice de tabela necessário. Assim que o novo bloco de índice estiver na cache, os dados do índice podem ser acessados.

Se acontecer que um bloco selecionado para substituição tenha sido modificado, o bloco é considerado "sujo". Nesse caso, antes de ser substituído, seu conteúdo é descartado no índice da tabela de onde ele veio.

Normalmente, o servidor segue uma estratégia LRU (Menos Recentemente Usado): Ao escolher um bloco para substituição, ele seleciona o bloco de índice menos recentemente usado. Para facilitar essa escolha, o módulo de cache de chaves mantém todos os blocos usados em uma lista especial (cadeia LRU) ordenada pelo tempo de uso. Quando um bloco é acessado, é o mais recentemente usado e é colocado no final da lista. Quando os blocos precisam ser substituídos, os blocos no início da lista são os menos recentemente usados e se tornam os primeiros candidatos à expulsão.

O mecanismo de armazenamento `InnoDB` também utiliza um algoritmo LRU para gerenciar seu pool de buffers. Veja a Seção 14.5.1, “Pool de Buffers”.
