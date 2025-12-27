#### 10.10.2.6 Reestruturação de um Cache de Chaves

Um cache de chaves pode ser reestruturado a qualquer momento, atualizando seus valores de parâmetros. Por exemplo:

```
mysql> SET GLOBAL cold_cache.key_buffer_size=4*1024*1024;
```

Se você atribuir ao componente cache de chaves `key_buffer_size` ou `key_cache_block_size` um valor que difere do valor atual do componente, o servidor destrói a estrutura antiga do cache e cria uma nova com base nos novos valores. Se o cache contiver blocos sujos, o servidor os salva no disco antes de destruir e recriar o cache. A reestruturação não ocorre se você alterar outros parâmetros do cache de chaves.

Ao reestruturar um cache de chaves, o servidor primeiro esvazia o conteúdo de quaisquer buffers sujos para o disco. Após isso, o conteúdo do cache fica indisponível. No entanto, a reestruturação não bloqueia consultas que precisam usar índices atribuídos ao cache. Em vez disso, o servidor acessa diretamente os índices da tabela usando o cache do sistema de arquivos nativo. O cache do sistema de arquivos não é tão eficiente quanto o uso de um cache de chaves, portanto, embora as consultas sejam executadas, pode ser antecipada uma desaceleração. Após a reestruturação do cache, ele torna-se disponível novamente para caches de índices atribuídos a ele, e o uso do cache do sistema de arquivos para os índices cessa.