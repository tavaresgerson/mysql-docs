### 8.10.2 O Key Cache do MyISAM

8.10.2.1 Acesso Compartilhado ao Key Cache

8.10.2.2 Múltiplos Key Caches

8.10.2.3 Estratégia de Inserção no Ponto Médio

8.10.2.4 Pré-carregamento de Index

8.10.2.5 Tamanho do Block do Key Cache

8.10.2.6 Reestruturação de um Key Cache

Para minimizar o I/O de disco, o storage engine `MyISAM` explora uma estratégia usada por muitos Database Management Systems. Ele emprega um mecanismo de cache para manter os blocks da tabela mais frequentemente acessados na memória:

* Para blocks de Index, uma estrutura especial chamada key cache (ou key buffer) é mantida. A estrutura contém vários block buffers onde os index blocks mais usados são colocados.

* Para blocks de dados, o MySQL não usa um cache especial. Em vez disso, ele depende do cache nativo do file system do sistema operacional.

Esta seção primeiramente descreve a operação básica do key cache do `MyISAM`. Em seguida, discute recursos que melhoram o desempenho do key cache e que permitem um melhor controle da operação do cache:

* Múltiplas sessões podem acessar o cache concorrentemente.
* Você pode configurar múltiplos key caches e atribuir Indexes de tabela a caches específicos.

Para controlar o tamanho do key cache, use a system variable `key_buffer_size`. Se esta variável for definida como zero, nenhum key cache é utilizado. O key cache também não é usado se o valor de `key_buffer_size` for muito pequeno para alocar o número mínimo de block buffers (8).

Quando o key cache não está operacional, os arquivos de Index são acessados utilizando apenas o buffering nativo do file system fornecido pelo sistema operacional. (Em outras palavras, os index blocks da tabela são acessados usando a mesma estratégia empregada para os data blocks da tabela.)

Um index block é uma unidade contígua de acesso aos arquivos de Index do `MyISAM`. Geralmente, o tamanho de um index block é igual ao tamanho dos nodes da B-tree do Index. (Os Indexes são representados no disco usando uma estrutura de dados B-tree. Os nodes na base da árvore são leaf nodes. Os nodes acima dos leaf nodes são nonleaf nodes.)

Todos os block buffers em uma estrutura de key cache têm o mesmo tamanho. Este tamanho pode ser igual, maior ou menor que o tamanho de um index block de tabela. Geralmente, um desses dois valores é um múltiplo do outro.

Quando dados de qualquer index block de tabela devem ser acessados, o server verifica primeiro se eles estão disponíveis em algum block buffer do key cache. Se estiverem, o server acessa os dados no key cache em vez de no disco. Ou seja, ele lê ou escreve no cache, em vez de ler ou escrever no disco. Caso contrário, o server escolhe um cache block buffer que contém um index block de tabela (ou blocks) diferente e substitui os dados ali por uma cópia do index block de tabela necessário. Assim que o novo index block estiver no cache, os dados do Index podem ser acessados.

Se acontecer de um block selecionado para substituição ter sido modificado, ele é considerado "dirty" (sujo). Neste caso, antes de ser substituído, seu conteúdo é flushed (descarregado) para o Index da tabela de onde veio.

Geralmente, o server segue uma estratégia LRU (Least Recently Used): Ao escolher um block para substituição, ele seleciona o index block menos recentemente usado. Para facilitar essa escolha, o módulo key cache mantém todos os blocks usados em uma lista especial (LRU chain) ordenada pelo tempo de uso. Quando um block é acessado, ele é o mais recentemente usado e é colocado no final da lista. Quando os blocks precisam ser substituídos, os blocks no início da lista são os menos recentemente usados e se tornam os primeiros candidatos à remoção (eviction).

O storage engine `InnoDB` também usa um algoritmo LRU para gerenciar seu Buffer Pool. Consulte a Seção 14.5.1, “Buffer Pool”.