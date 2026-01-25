#### 8.10.2.5 Tamanho do Bloco do Key Cache

É possível especificar o tamanho dos *block buffers* para um *key cache* individual usando a variável `key_cache_block_size`. Isso permite o ajuste do desempenho das operações de I/O para arquivos de *index*.

O melhor desempenho para operações de I/O é alcançado quando o tamanho dos *read buffers* é igual ao tamanho dos *buffers* de I/O nativos do sistema operacional. Contudo, definir o tamanho dos nós de *key* (key nodes) igual ao tamanho do *I/O buffer* nem sempre garante o melhor desempenho geral. Ao ler os *leaf nodes* grandes, o *server* carrega muitos dados desnecessários, impedindo efetivamente a leitura de outros *leaf nodes*.

Para controlar o tamanho dos blocos no arquivo de *index* `.MYI` das tabelas *MyISAM*, utilize a *option* `--myisam-block-size` durante a inicialização do *server*.