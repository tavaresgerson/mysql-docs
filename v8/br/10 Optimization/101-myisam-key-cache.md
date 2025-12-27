### 10.10.2 Cache de Chave MyISAM

Para minimizar o I/O de disco, o mecanismo de armazenamento `MyISAM` explora uma estratégia utilizada por muitos sistemas de gerenciamento de banco de dados. Ele emprega um mecanismo de cache para manter os blocos de tabela mais acessados na memória:

* Para blocos de índice, uma estrutura especial chamada cache de chave (ou buffer de chave) é mantida. A estrutura contém vários buffers de bloco onde os blocos de índice mais usados são colocados.
* Para blocos de dados, o MySQL não usa um cache especial. Em vez disso, depende do cache do sistema de arquivos nativo do sistema operacional.

Esta seção descreve primeiro o funcionamento básico do cache de chave `MyISAM`. Em seguida, discute recursos que melhoram o desempenho do cache de chave e que permitem que você controle melhor a operação do cache:

* Múltiplas sessões podem acessar o cache simultaneamente.
* Você pode configurar múltiplos caches de chave e atribuir índices de tabela a caches específicos.

Para controlar o tamanho do cache de chave, use a variável de sistema `key_buffer_size`. Se essa variável for definida como zero, não será usado nenhum cache de chave. O cache de chave também não é usado se o valor de `key_buffer_size` for muito pequeno para alocar o número mínimo de buffers de bloco (8).

Quando o cache de chave não está operacional, os arquivos de índice são acessados usando apenas o buffer de sistema de arquivos nativo fornecido pelo sistema operacional. (Em outras palavras, os blocos de índice de tabela são acessados usando a mesma estratégia empregada para blocos de dados de tabela.)

Um bloco de índice é uma unidade contínua de acesso aos arquivos de índice `MyISAM`. Normalmente, o tamanho de um bloco de índice é igual ao tamanho dos nós da árvore B de índice. (Os índices são representados em disco usando uma estrutura de dados B-tree. Os nós na parte inferior da árvore são nós de folha. Os nós acima dos nós de folha são nós não-folha.)

Todos os buffers de bloco em uma estrutura de cache de chave são do mesmo tamanho. Esse tamanho pode ser igual, maior ou menor que o tamanho de um bloco de índice de tabela. Normalmente, um desses dois valores é um múltiplo do outro.

Quando os dados de qualquer bloco de índice de tabela precisam ser acessados, o servidor primeiro verifica se estão disponíveis em algum buffer de bloco da cache de chaves. Se estiverem, o servidor acessa os dados na cache de chaves em vez de no disco. Ou seja, lê da cache ou escreve nela em vez de ler ou escrever no disco. Caso contrário, o servidor escolhe um buffer de bloco de cache que contenha um bloco (ou blocos) de índice de tabela diferente e substitui os dados por uma cópia do bloco de índice de tabela necessário. Assim que o novo bloco de índice estiver na cache, os dados do índice podem ser acessados.

Se acontecer que um bloco selecionado para substituição tenha sido modificado, o bloco é considerado “sujo”. Nesse caso, antes de ser substituído, seus conteúdos são descarregados da tabela de índice de onde ele veio.

Normalmente, o servidor segue uma estratégia LRU (Least Recently Used - Menos Recentemente Usado): Ao escolher um bloco para substituição, ele seleciona o bloco de índice menos recentemente usado. Para facilitar essa escolha, o módulo de cache de chaves mantém todos os blocos usados em uma lista especial (cadeia LRU) ordenada pelo tempo de uso. Quando um bloco é acessado, é o mais recentemente usado e é colocado no final da lista. Quando os blocos precisam ser substituídos, os blocos no início da lista são os menos recentemente usados e se tornam os primeiros candidatos à expulsão.

O mecanismo de armazenamento `InnoDB` também usa um algoritmo LRU para gerenciar seu pool de buffers. Veja a Seção 17.5.1, “Pool de Buffers”.