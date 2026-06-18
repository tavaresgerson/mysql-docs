## A.6 Perguntas frequentes sobre o MySQL 8.0: Visualizações

A.6.1. Onde posso encontrar documentação sobre Visualizações do MySQL?

A.6.2. Há um fórum de discussão para Visualizações do MySQL?

A.6.3. O que acontece com uma visualização se uma tabela subjacente for excluída ou renomeada?

A.6.4. O MySQL tem instantâneos de tabela?

A.6.5. O MySQL tem visualizações materializadas?

A.6.6. Você pode inserir em visualizações que são baseadas em junções?

<table border="0" style="width: 100%;"><colgroup><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.6.1.</b></p></td><td align="left" valign="top"><p>Onde posso encontrar documentação sobre Visualizações do MySQL?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Veja a Seção 27.5, “Usando Visualizações”.</p><p>Você também pode achar os fóruns de usuários do MySQL úteis.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.6.2.</b></p></td><td align="left" valign="top"><p>Há um fórum de discussão para Visualizações do MySQL?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Veja os fóruns de usuários do MySQL.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.6.3.</b></p></td><td align="left" valign="top"><p>O que acontece com uma visualização se uma tabela subjacente for excluída ou renomeada?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Depois que uma visualização foi criada, é possível excluir ou alterar uma tabela ou visualização a qual a definição se refere. Para verificar a definição de uma visualização em busca de problemas desse tipo, use a instrução [[<code>CHECK TABLE</code>]]. (Consulte a Seção 15.7.3.2, “Instrução CHECK TABLE”.)</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.6.4.</b></p></td><td align="left" valign="top"><p>O MySQL tem instantâneos de tabela?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Não.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.6.5.</b></p></td><td align="left" valign="top"><p>O MySQL tem visualizações materializadas?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Não.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.6.6.</b></p></td><td align="left" valign="top"><p>Você pode inserir em visualizações que são baseadas em junções?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>É possível, desde que a sua declaração [[<code>INSERT</code>]] tenha uma lista de colunas que indique claramente que apenas uma tabela está envolvida.</p><p>Você<span class="emphasis"><em>não pode</em></span>inserir em várias tabelas com uma única inserção em uma visualização.</p></td></tr></tbody></table>
