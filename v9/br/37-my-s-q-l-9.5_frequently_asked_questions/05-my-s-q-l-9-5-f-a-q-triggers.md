## A.5 Perguntas Frequentes sobre MySQL 9.5: Triggers

A.5.1. Onde posso encontrar a documentação para triggers do MySQL 9.5?

A.5.2. Há um fórum de discussão para triggers do MySQL?

A.5.3. O MySQL tem triggers de nível de instrução ou de nível de linha?

A.5.4. Existem triggers padrão?

A.5.5. Como os triggers são gerenciados no MySQL?

A.5.6. Há uma maneira de visualizar todos os triggers em um banco de dados específico?

A.5.7. Onde os triggers são armazenados?

A.5.8. Um trigger pode chamar um procedimento armazenado?

A.5.9. Os triggers podem acessar tabelas?

A.5.10. Uma tabela pode ter múltiplos triggers com o mesmo evento de trigger e hora de ação?

A.5.11. É possível que um trigger atualize tabelas em um servidor remoto?

A.5.12. Os triggers funcionam com replicação?

A.5.13. Como as ações realizadas por triggers em uma fonte são replicadas para uma réplica?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col /></colgroup><tbody><tr class="question"><td align="left" valign="top"><a name="faq-mysql-where-triggers-docs"></a><a name="id468881"></a><p><b>A.5.1.</b></p></td><td align="left" valign="top"><p> Onde posso encontrar a documentação para triggers do MySQL 9.5? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Veja <a class="xref" href="triggers.html" title="27.4 Using Triggers">Seção 27.4, “Using Triggers”</a>. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-where-triggers-forum"></a><a name="id468887"></a><p><b>A.5.2.</b></p></td><td align="left" valign="top"><p> Há um fórum de discussão sobre triggers do MySQL? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Sim. Está disponível em <a class="ulink" href="https://forums.mysql.com/list.php?99">https://forums.mysql.com/list.php?99</a>. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-have-trigger-levels"></a><a name="id468893"></a><p><b>A.5.3.</b></p></td><td align="left" valign="top"><p> O MySQL tem triggers de nível de declaração ou de nível de linha? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Todos os triggers são <code>FOR EACH ROW</code>; ou seja, o trigger é ativado para cada linha inserida, atualizada ou excluída. O MySQL não suporta triggers usando <code>FOR EACH STATEMENT</code>. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-have-trigger-defaults"></a><a name="id468900"></a><p><b>A.5.4.</b></p></td><td align="left" valign="top"><p> Há triggers especiais? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Não explicitamente. O MySQL tem comportamento específico para algumas <a class="link" href="datetime.html" title="13.2.2 The DATE, DATETIME, and TIMESTAMP Types"><code>TIMESTAMP</code></a> colunas, bem como para colunas definidas usando <code>AUTO_INCREMENT</code>. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-mysql-how-triggers-managed"></a><a name="id468908"></a><p><b>A.5.5.</b></p></td><td align="left" valign="top"><p> Como os triggers são gerenciados no MySQL? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Os triggers podem ser criados usando a declaração <a class="link" href="create-trigger.html" title="15.1.26 CREATE TRIGGER Statement"><code>CREATE TRIGGER</code></a> e removidos usando <a class="link" href="drop-trigger.html" title="15.1.39 DROP TRIGGER Statement"><code>DROP TRIGGER</code></a>. Veja <a class="xref" href="create-trigger.html" title="15.1.26 CREATE TRIGGER Statement">Seção 15.1.26, “CREATE TRIGGER Statement”</a> e <a class="xref" href="drop-trigger.html" title="15.1.39 DROP TRIGGER Statement">Seção 15.1.39, “DROP TRIGGER Statement”</a>, para