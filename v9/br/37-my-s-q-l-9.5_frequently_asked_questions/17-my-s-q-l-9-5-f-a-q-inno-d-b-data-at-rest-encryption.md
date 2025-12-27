## A.17 Perguntas Frequentes sobre a Encriptação de Dados em Repouso do MySQL 9.5: InnoDB

A.17.1. Os dados são descriptografados para os usuários autorizados a vê-los?

A.17.2. Qual é o overhead associado à encriptação de dados em repouso do InnoDB?

A.17.3. Quais são os algoritmos de encriptação usados na encriptação de dados em repouso do InnoDB?

A.17.4. É possível usar algoritmos de encriptação de terceiros em vez do fornecido pelo recurso de encriptação de dados em repouso do InnoDB?

A.17.5. As colunas indexadas podem ser encriptadas?

A.17.6. Quais tipos de dados e comprimentos de dados o InnoDB suporta na encriptação de dados em repouso?

A.17.7. Os dados permanecem encriptados na rede?

A.17.8. A memória do banco de dados contém dados em texto claro ou encriptados?

A.17.9. Como eu sei quais dados devo encriptar?

A.17.10. Como o InnoDB difere da encriptação de dados em repouso do MySQL que já fornece?

A.17.11. A funcionalidade de espaços de tabelas transportables funciona com a encriptação de dados em repouso do InnoDB?

A.17.12. A compressão funciona com a encriptação de dados em repouso do InnoDB?

A.17.13. Posso usar mysqldump com tabelas encriptadas?

A.17.14. Como eu altero (rotação, re-chave) a chave de encriptação mestre?

A.17.15. Como eu migro dados de um espaço de tabelas em texto claro para um espaço de tabelas encriptado do InnoDB?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><a name="faq-tablespace-encryption-access-key"></a><a name="id471270"></a><p><b>A.17.1.</b></p></td><td align="left" valign="top"><p> <a name="id471271"></a>É o dado criptografado para usuários autorizados a vê-lo? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Sim. A criptografia de dados em at-rest do <code class="literal">InnoDB</code> é projetada para aplicar criptografia transparente dentro do banco de dados sem impactar aplicações existentes. Devolver dados em formato criptografado quebraria a maioria das aplicações existentes. A criptografia de dados em at-rest do <code class="literal">InnoDB</code> oferece o benefício da criptografia sem o overhead associado às soluções tradicionais de criptografia de banco de dados, que normalmente exigiriam mudanças caras e substanciais nas aplicações, nos gatilhos de banco de dados e nas visualizações. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-tablespace-encryption-overhead"></a><a name="id471277"></a><p><b>A.17.2.</b></p></td><td align="left" valign="top"><p> Qual é o overhead associado à criptografia de dados em at-rest do <code class="literal">InnoDB</code>? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Não há overhead adicional de armazenamento. De acordo com benchmarks internos, o overhead de desempenho é de uma diferença de porcentagem de dígito único. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-tablespace-encryption-algorithm"></a><a name="id471282"></a><p><b>A.17.3.</b></p></td><td align="left" valign="top"><p> Quais são os algoritmos de criptografia usados com a criptografia de dados em at-rest do <code class="literal">InnoDB</code>? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> A criptografia de dados em at-rest do <code class="literal">InnoDB</code> suporta o algoritmo de criptografia avançada (AES256) de bloco. Utiliza o modo de criptografia de bloco de Electronic Codebook (ECB) para a criptografia de chave de tablespace e o modo de criptografia de bloco de Cipher Block Chaining (CBC) para a criptografia de dados. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-tablespace-encryption-other-algorithms"></a><a name="id471289"></a><p><b>A.17.4.</b></p></td><td align="left" valign="top"><p> É possível usar algoritmos de criptografia de terceiros em vez do algoritmo fornecido pela funcionalidade de criptografia de dados em at-rest do <code class="literal">InnoDB</code>? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Não, não é possível usar outros algoritmos de criptografia. O algoritmo de criptografia fornecido é amplamente aceito. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-tablespace-encryption-indexed-columns"></a><a name="id471300"></a><p><b>A.17.5.</b></p></td><td align="left" valign="top"><p> Os índices podem ser criptografados? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Sim. A criptografia de dados em at-rest do <code class="literal">InnoDB</code> suporta todos os índices de forma transparente. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-tables