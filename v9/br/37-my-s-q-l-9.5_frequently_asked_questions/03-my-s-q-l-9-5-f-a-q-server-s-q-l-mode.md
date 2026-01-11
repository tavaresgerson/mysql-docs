## A.3 Perguntas frequentes sobre o MySQL 9.5: Modo SQL do servidor

A.3.1. O que são os modos SQL do servidor?

A.3.2. Quantos modos SQL do servidor existem?

A.3.3. Como você determina o modo SQL do servidor?

A.3.4. O modo é dependente do banco de dados ou da conexão?

A.3.5. As regras para o modo estrito podem ser estendidas?

A.3.6. O modo estrito impacta o desempenho?

A.3.7. Qual é o modo SQL do servidor padrão quando o MySQL 9.5 é instalado?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.3.1.</b></p></td><td align="left" valign="top"><p><b>A.3.1.1.</b></p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Os modos SQL do servidor definem a sintaxe SQL que o MySQL deve suportar e quais verificações de validação de dados ele deve realizar. Isso facilita o uso do MySQL em diferentes ambientes e a utilização do MySQL junto com outros servidores de banco de dados. O MySQL Server aplica esses modos individualmente a diferentes clientes. Para mais informações, consulte Seção 7.1.11, “Modos SQL do Servidor”. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.3.2.</b></p></td><td align="left" valign="top"><p> Quantos modos SQL do servidor existem? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Cada modo pode ser ligado e desligado independentemente. Consulte Seção 7.1.11, “Modos SQL do Servidor” para uma lista completa dos modos disponíveis. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.3.3.</b></p></td><td align="left" valign="top"><p> Como você determina o modo SQL do servidor? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Você pode definir o modo SQL do servidor padrão (para o início do <span><strong>mysqld</strong></span>) com a opção <code>--sql-mode</code>. Usando a instrução <code>SET [GLOBAL|SESSION] sql_mode='<em><code>modes</code></em>'</code>, você pode alterar as configurações localmente para a conexão ou para ter efeito global. Você pode recuperar o modo atual emitindo a instrução <code>SELECT @@sql_mode</code>. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.3.4.</b></p></td><td align="left" valign="top"><p> O modo é dependente do banco de dados ou da conexão? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Um modo não está vinculado a um banco de dados específico. Os modos podem ser definidos localmente para a sessão (conexão) ou globalmente para o servidor. Você pode alterar essas configurações usando <code>SET [GLOBAL|SESSION] sql_mode='<em><code>modes</code></em>'</code>. </p></td></tr><tr class="question"><td align="left" valign="top"><a