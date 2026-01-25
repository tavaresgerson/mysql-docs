#### 8.10.2.6 Reestruturando um Key Cache

Um Key Cache pode ser reestruturado a qualquer momento atualizando seus valores de parâmetro. Por exemplo:

```sql
mysql> SET GLOBAL cold_cache.key_buffer_size=4*1024*1024;
```

Se você atribuir ao componente de Key Cache `key_buffer_size` ou `key_cache_block_size` um valor que difere do valor atual do componente, o server destrói a estrutura antiga do cache e cria uma nova baseada nos novos valores. Se o cache contiver quaisquer *dirty blocks*, o server os salva no disco antes de destruir e recriar o cache. A reestruturação não ocorre se você alterar outros parâmetros do Key Cache.

Ao reestruturar um Key Cache, o server primeiramente descarrega (*flushes*) o conteúdo de quaisquer *dirty buffers* para o disco. Depois disso, o conteúdo do cache se torna indisponível. No entanto, a reestruturação não bloqueia as Queries que precisam usar os Indexes atribuídos ao cache. Em vez disso, o server acessa diretamente os Indexes da tabela usando o *native file system caching* (cache nativo do sistema de arquivos). O *File system caching* não é tão eficiente quanto usar um Key Cache, então, embora as Queries sejam executadas, uma lentidão pode ser antecipada. Depois que o cache é reestruturado, ele se torna disponível novamente para o caching dos Indexes a ele atribuídos, e o uso do *file system caching* para os Indexes cessa.