#### 10.10.2.5 Tamanho do Bloco de Cache de Chave

É possível especificar o tamanho dos buffers de bloco para uma cache de chave individual usando a variável `key_cache_block_size`. Isso permite ajustar o desempenho das operações de E/S para arquivos de índice.

O melhor desempenho para operações de E/S é alcançado quando o tamanho dos buffers de leitura é igual ao tamanho dos buffers de E/S do sistema operacional nativo. Mas definir o tamanho dos nós de chave igual ao tamanho do buffer de E/S nem sempre garante o melhor desempenho geral. Ao ler os nós de folha grandes, o servidor carrega muitos dados desnecessários, impedindo efetivamente a leitura de outros nós de folha.

Para controlar o tamanho dos blocos no arquivo de índice `.MYI` das tabelas `MyISAM`, use a opção `--myisam-block-size` na inicialização do servidor.