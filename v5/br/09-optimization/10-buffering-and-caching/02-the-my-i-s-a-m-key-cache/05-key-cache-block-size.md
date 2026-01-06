#### 8.10.2.5 Tamanho da chave do bloco de cache

É possível especificar o tamanho dos buffers de bloco para um cache de chaves individual usando a variável `key_cache_block_size`. Isso permite ajustar o desempenho das operações de E/S para arquivos de índice.

O melhor desempenho para operações de E/S é alcançado quando o tamanho dos buffers de leitura é igual ao tamanho dos buffers de E/S do sistema operacional nativo. Mas definir o tamanho dos nós-chave iguais ao tamanho do buffer de E/S não garante sempre o melhor desempenho geral. Ao ler os nós-folha grandes, o servidor carrega uma grande quantidade de dados desnecessários, impedindo efetivamente a leitura de outros nós-folha.

Para controlar o tamanho dos blocos no arquivo de índice `.MYI` das tabelas `MyISAM`, use a opção `--myisam-block-size` durante a inicialização do servidor.
