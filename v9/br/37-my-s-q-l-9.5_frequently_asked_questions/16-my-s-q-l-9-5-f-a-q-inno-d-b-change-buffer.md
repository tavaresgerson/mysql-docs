## A.16 Perguntas frequentes do MySQL 9.5: Buffer de alterações do InnoDB

A.16.1. Que tipos de operações modificam índices secundários e resultam no buffer de alterações?

A.16.2. Qual é o benefício do buffer de alterações do InnoDB?

A.16.3. O buffer de alterações do InnoDB suporta outros tipos de índices?

A.16.4. Quanto espaço o InnoDB usa para o buffer de alterações?

A.16.5. Como posso determinar o tamanho atual do buffer de alterações?

A.16.6. Quando ocorre a fusão do buffer de alterações?

A.16.7. Quando o buffer de alterações é descarregado?

A.16.8. Quando o buffer de alterações deve ser usado?

A.16.9. Quando o buffer de alterações não deve ser usado?

A.16.10. Onde posso encontrar informações adicionais sobre o buffer de alterações?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><a name="faq-innodb-change-buffer-operations"></a><a name="id471165"></a><p><b>A.16.1.</b></p></td><td align="left" valign="top"><p> Quais tipos de operações modificam índices secundários e resultam na bufferização de mudanças? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> As operações <code>INSERT</code>, <code>UPDATE</code> e <code>DELETE</code> podem modificar índices secundários. Se uma página de índice afetada não estiver no pool de buffer, as mudanças podem ser bufferizadas no buffer de mudança. As mudanças bufferizadas podem ser aplicadas posteriormente, em lotes, à medida que as páginas são lidas para o pool de buffer por outras operações de leitura. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-innodb-change-buffer-benefits"></a><a name="id471173"></a><p><b>A.16.2.</b></p></td><td align="left" valign="top"><p> Qual é o benefício do buffer de mudança do <code>InnoDB</code>? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> A bufferização de mudanças no buffer de mudança do <code>InnoDB</code> evita operações de I/O de acesso aleatório caras que seriam necessárias para ler imediatamente as páginas de índice afetadas do disco. As mudanças bufferizadas podem ser aplicadas posteriormente, em lotes, à medida que as páginas são lidas para o pool de buffer por outras operações de leitura. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-innodb-change-buffer-index-types"></a><a name="id471179"></a><p><b>A.16.3.</b></p></td><td align="left" valign="top"><p> O buffer de mudança suporta outros tipos de índices? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Não. O buffer de mudança só suporta índices secundários. Índices agrupados, índices de texto completo e índices espaciais não são suportados. Os índices de texto completo têm seu próprio mecanismo de cache. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-innodb-change-buffer-space-max-size"></a><a name="id471184"></a><p><b>A.16.4.</b></p></td><td align="left" valign="top"><p> Qual é o tamanho máximo do buffer de mudança do <code>InnoDB</code>? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Antes da introdução da opção de configuração <code>innodb_change_buffer_max_size</code> no MySQL 5.6, o tamanho máximo do buffer de mudança no espaço de tabelas do sistema era de 1/3 do tamanho do pool de buffer <code>InnoDB</code>. </p><p> No MySQL 5.6 e versões posteriores, a opção de configuração <code>innodb_change_buffer_max_size</code> define o tamanho máximo do buffer de mudança como um por cento do tamanho total do pool de buffer. Por padrão, <code>innodb_change_buffer_max_size</code> está definido para 25. O valor máximo é 50. </p><p> O <code>InnoDB</code> não bufferiza uma operação se isso exceder o limite definido. </p><p> As páginas do buffer de mudança não são obrigatoriamente mantidas no pool de buffer e podem ser evisceradas por operações LRU. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-innodb-change-buffer-current-size"></a><a name="id471201"></a><