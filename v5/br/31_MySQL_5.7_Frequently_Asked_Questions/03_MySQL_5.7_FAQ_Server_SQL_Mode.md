## A.3 Perguntas frequentes sobre o MySQL 5.7: Modo SQL do servidor

A.3.1. O que são os modos SQL do servidor?

A.3.2. Quantos modos de SQL há no servidor?

A.3.3. Como você determina o modo SQL do servidor?

A.3.4. O modo depende do banco de dados ou da conexão?

A.3.5. As regras para o modo estrito podem ser estendidas?

A.3.6. O modo estrito afeta o desempenho?

A.3.7. Qual é o modo de servidor SQL padrão quando o MySQL 5.7 é instalado?

<table border="0" style="width: 100%;">
<colgroup>
<col align="left" width="1%"/>
<col/>
</colgroup>
<tbody>
<tr class="question">
<td align="left" valign="top"><b>A.3.1.</b></td>
<td align="left" valign="top">
<p>O que são os modos SQL do servidor?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Os modos do SQL do servidor definem a sintaxe SQL que o MySQL deve suportar e que tipo de verificações de validação de dados deve realizar. Isso facilita o uso do MySQL em diferentes ambientes e o uso do MySQL junto com outros servidores de banco de dados. O MySQL Server aplica esses modos individualmente a diferentes clientes. Para mais informações, consulte a Seção 5.1.10, “Modos do SQL do servidor”.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.2.</b></td>
<td align="left" valign="top">
<p>Quantos modos de SQL do servidor existem?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Cada modo pode ser ligado e desligado de forma independente. Consulte a Seção 5.1.10, “Modos SQL do servidor”, para uma lista completa dos modos disponíveis.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.3.</b></td>
<td align="left" valign="top">
<p>Como você determina o modo SQL do servidor?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Você pode definir o modo SQL padrão (para<strong>mysqld</strong>start-up) com o<code>--sql-mode</code>opção. Usando a declaração<a class="link" href="set-variable.html" title="13.7.4.1 SET Syntax for Variable Assignment"><code>SET [GLOBAL|SESSION] sql_mode='<code>modes</code>'</code></a>, você pode alterar as configurações dentro de uma conexão, seja localmente na conexão ou para que elas se tornem globais. Você pode recuperar o modo atual emitindo um<code>SELECT @@sql_mode</code> statement. </p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.4.</b></td>
<td align="left" valign="top">
<p>O modo depende do banco de dados ou da conexão?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Um modo não está vinculado a um banco de dados específico. Os modos podem ser definidos localmente para a sessão (conexão) ou globalmente para o servidor. Você pode alterar essas configurações usando<a class="link" href="set-variable.html" title="13.7.4.1 SET Syntax for Variable Assignment"><code>SET [GLOBAL|SESSION] sql_mode='<code>modes</code>'</code></a>. </p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.5.</b></td>
<td align="left" valign="top">
<p>As regras para o modo estrito podem ser estendidas?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Quando nos referimos a<em>modo rigoroso</em>, queremos dizer um modo em que pelo menos um dos modos<code>TRADITIONAL</code>,<code>STRICT_TRANS_TABLES</code>, ou<code>STRICT_ALL_TABLES</code>está habilitado. As opções podem ser combinadas, para que você possa adicionar restrições a um modo. Consulte a Seção 5.1.10, “Modos SQL do servidor”, para obter mais informações.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.6.</b></td>
<td align="left" valign="top">
<p>O modo estrito afeta o desempenho?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>A validação intensiva dos dados de entrada que algumas configurações exigem mais tempo do que se a validação não fosse feita. Embora o impacto no desempenho não seja muito grande, se você não precisar de tal validação (talvez sua aplicação já gere tudo isso), então o MySQL lhe dá a opção de deixar o modo estrito desativado. No entanto, se você precisar disso, o modo estrito pode fornecer tal validação.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.3.7.</b></td>
<td align="left" valign="top">
<p>Qual é o modo de servidor padrão SQL quando o MySQL 5.7 é instalado?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>O modo SQL padrão no MySQL 5.7 inclui esses modos:<code>ONLY_FULL_GROUP_BY</code>,<code>STRICT_TRANS_TABLES</code>,<code>NO_ZERO_IN_DATE</code>,<code>NO_ZERO_DATE</code>,<code>ERROR_FOR_DIVISION_BY_ZERO</code>,<code>NO_AUTO_CREATE_USER</code>, e<code>NO_ENGINE_SUBSTITUTION</code>. </p>
<p>Para obter informações sobre todos os modos disponíveis e o comportamento padrão do MySQL, consulte a Seção 5.1.10, “Modos SQL do servidor”.</p>
</td>
</tr>
</tbody>
</table>