## A.11 Perguntas Frequentes do MySQL 9.5: Conjuntos de Caracteres Chinês, Japonês e Coreano

Este conjunto de Perguntas Frequentes deriva da experiência dos grupos de Suporte e Desenvolvimento do MySQL ao lidar com muitas consultas sobre questões CJK (Chinês-Japonês-Coreano).

A.11.1. Quais conjuntos de caracteres CJK estão disponíveis no MySQL?

A.11.2. Eu inseri caracteres CJK na minha tabela. Por que o SELECT os exibe como caracteres “?”?

A.11.3. Quais problemas devo estar ciente ao trabalhar com o conjunto de caracteres Chinês Big5?

A.11.4. Por que as conversões de conjuntos de caracteres japoneses falham?

A.11.5. O que devo fazer se eu quiser converter SJIS 81CA para cp932?

A.11.6. Como o MySQL representa o sinal do iene (¥)?

A.11.7. Quais problemas devo estar ciente ao trabalhar com conjuntos de caracteres coreanos no MySQL?

A.11.8. Por que recebo mensagens de erro de valor de string incorreto?

A.11.9. Por que meu front-end de GUI ou navegador exibe caracteres CJK incorretamente na minha aplicação usando Access, PHP ou outra API?

A.11.10. Eu atualizei para o MySQL 9.5. Como posso reverter para um comportamento como o do MySQL 4.0 em relação aos conjuntos de caracteres?

A.11.11. Por que algumas pesquisas LIKE e FULLTEXT com caracteres CJK falham?

A.11.12. Como faço para saber se o caractere X está disponível em todos os conjuntos de caracteres?

A.11.13. Por que as strings CJK são ordenadas incorretamente no Unicode? (I)

A.11.14. Por que as strings CJK são ordenadas incorretamente no Unicode? (II)

A.11.15. Por que meus caracteres suplementares são rejeitados pelo MySQL?

A.11.16. “CJK” deve ser “CJKV”?

A.11.17. O MySQL permite o uso de caracteres CJK em nomes de bancos de dados e tabelas?

A.11.18. Onde posso encontrar traduções do Manual do MySQL para chinês, japonês e coreano?

A.11.19. Onde posso obter ajuda com questões CJK e relacionadas no MySQL?

top"></td><td align="left" valign="top"><p> Japanese character set conversions can fail for several reasons: </p><ul class="itemizedlist"> <li class="listitem"><p> The character set used in the client application is not the same as the character set used in the MySQL server. </p></li><li class="listitem"><p> The character set used in the client application is not supported by the MySQL server. </p></li><li class="listitem"><p> The character set used in the client application is not correctly set in the MySQL client. </p></li><li class="listitem"><p> The character set used in the client application is not correctly set in the MySQL server. </p></li><li class="listitem"><p> The character set used in the client application is not correctly set in the MySQL client and server. </p></li></ul> </p><p> To avoid these problems, make sure that the character set used in the client application is the same as the character set used in the MySQL server. If you are using a client that supports multiple character sets, make sure that the character set used in the client is the same as the character set used in the MySQL server. </p><p> If you are using a client that does not support the character set used in the MySQL server, you may need to use a different character set. For example, if you are using a client that supports <code>big5</code>, you can use <code>big5</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>big5</code>, you can use <code>gb2312</code> in the MySQL server and client. </p><p> If you are using a client that does not support either <code>big5</code> or <code>gb2312</code>, you can use <code>utf8</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>utf8</code>, you can use <code>ucs2</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>ucs2</code>, you can use <code>utf8mb4</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>utf8mb4</code>, you can use <code>utf16</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>utf16</code>, you can use <code>utf32</code> in the MySQL server and client. </p><p> If you are using a client that does not support <code>utf32</code>, you can use <code>utf8mb4_general_ci</code> in the MySQL server and client. </p><p> For more information, see <a class="ulink" href="charset-unicode-sets.html" target="_blank">Section 12.10.1, “Unicode Character Sets”</a>. </p></td></tr></tbody></table></div>
xml
<div class="itemizedlist">
  <ul class="itemizedlist" style="list-style-type: disc; ">
    <li class="listitem"><p> The MySQL <code>big5</code> character set is in reality <span class="quote">“<span class="quote">Microsoft code page 950</span>”</span>. This differs from the official <code>big5</code> for characters <code>A1A4</code> (middle dot), <code>A1AA</code> (em dash), <code>A6E0-A6F5</code>, and <code>A8BB-A8C0</code>. </p></li>
    <li class="listitem"><p> For a listing of <code>big5/Unicode</code> mappings, see <a class="ulink" href="http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP956.TXT" target="_blank">http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP956.TXT</a>. </p></li>
  </ul>
</div>

se(mysqli_connect_errno()) { printf("Conexão falhou: %s\n", mysqli_connect_error()); exit(); }

$link-&gt;query("SET NAMES 'utf8'"); ?&gt;`}
</pre><p> Neste caso, usamos <a class="link" href="set-names.html" title="15.7.6.3 SET NAMES Statement"><code>SET NAMES 'utf8'</code></a> para alterar <a class="link" href="character_set_client.html" title="15.7.6.3 Character Set Client"><code>character_set_client</code></a>, <a class="link" href="character_set_connection.html" title="15.7.6.3 Character Set Connection"><code>character_set_connection</code></a> e <a class="link" href="character_set_results.html" title="15.7.6.3 Character Set Results"><code>character_set_results</code></a>. </p><p> Outro problema frequentemente encontrado em aplicações PHP tem a ver com suposições feitas pelo navegador. Às vezes, adicionar ou alterar uma tag <code>&lt;meta&gt;</code> é suficiente para corrigir o problema: por exemplo, para garantir que o usuário agente interprete o conteúdo da página como <code>UTF-8</code>, inclua <code>&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8"&gt;</code> na seção <code>&lt;head&gt;</code> da página HTML. </p><p> Se você estiver usando o Connector/J, consulte <a class="ulink" href="/doc/connector-j/en/connector-j-reference-charsets.html" target="_top">Usando Caracteres e Unicode</a>. </p></td></tr><tr class="question"><td align="left" valign="top"><a name="faq-cjk-how-use-4-0-charset"></a><a name="id470638"></a><p><b>A.11.10.</b></p></td><td align="left" valign="top"><p> Eu atualizei para o MySQL 9.5. Como posso reverter para o comportamento do MySQL 4.0 em relação aos conjuntos de caracteres? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> No MySQL Versão 4.0, havia um único conjunto de caracteres <span class="quote">“<span class="quote">global</span>”</span> para o servidor e o cliente, e a decisão sobre qual caractere usar era feita pelo administrador do servidor. Isso mudou a partir do MySQL Versão 4.1. O que acontece agora é um <span class="quote">“<span class="quote">handshake</span>”</span>, conforme descrito em <a class="xref" href="charset-connection.html" title="12.4 Connection Character Sets and Collations">Seção 12.4, “Character Sets and Collations”</a>: </p> <div class="blockquote"> <blockquote class="blockquote"><p> Quando um cliente se conecta, ele envia ao servidor o nome do conjunto de caracteres que deseja usar. O servidor usa o nome para definir as variáveis de sistema <a class="link" href="character_set_client.html" title="15.7.6.3 Character Set Client"><code>character_set_client</code></a>, <a class="link" href="character_set_connection.html" title="15.7.6.3 Character Set Connection"><code>character_set_connection</code></a> e <a class="link" href="character_set_results.html" title="15.7.6.3 Character Set Results"><code>character_set_results</code></a>. Na verdade, o servidor realiza uma operação <a class="link" href="set-names.html" title="15.7.6.3 SET NAMES Statement"><code>SET NAMES</code></a> usando o nome do conjunto de caracteres. </p</blockquote> </div> <p> O efeito disso é que você não pode controlar o conjunto de caracteres do cliente iniciando <a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span><strong>mysqld</strong></span></a> com <a class="ulink" href="/doc/refman/8.0/en/server-options.html#option_mysqld_character-set-server=utf8"><span><strong>mysqld</strong></span></option>

Crie a procedure p_convert(ucs2_char CHAR(1) CHARACTER SET ucs2) BEGIN

Crie a tabela tj (ucs2 CHAR(1) character set ucs2, utf8 CHAR(1) character set utf8, big5 CHAR(1) character set big5, cp932 CHAR(1) character set cp932, eucjpms CHAR(1) character set eucjpms, euckr CHAR(1) character set euckr, gb2312 CHAR(1) character set gb2312, gbk CHAR(1) character set gbk, sjis CHAR(1) character set sjis, ujis CHAR(1) character set ujis).

INSERIR NA tj (ucs2) VALUES (ucs2_char).

ATUALIZAR NA tj SET utf8=ucs2, big5=ucs2, cp932=ucs2, eucjpms=ucs2, euckr=ucs2, gb2312=ucs2, gbk=ucs2, sjis=ucs2, ujis=ucs2.

/* Se houver problemas de conversão, a atualização produz avisos. */

SELECT hex(ucs2) AS ucs2, hex(utf8) AS utf8, hex(big5) AS big5, hex(cp932) AS cp932, hex(eucjpms) AS eucjpms, hex(euckr) AS euckr, hex(gb2312) AS gb2312, hex(gbk) AS gbk, hex(sjis) AS sjis, hex(ujis) AS ujis FROM tj.

DELIMITER `;`
\n
A entrada pode ser qualquer caractere <code>ucs2</code>, ou pode ser o valor numérico (representação hexadecimal) desse caractere. Por exemplo, a partir da lista de codificações e nomes de caracteres <code>ucs2</code> do Unicode (<a class="ulink" href="http://www.unicode.org/Public/UNIDATA/UnicodeData.txt" target="_blank">http://www.unicode.org/Public/UNIDATA/UnicodeData.txt</a>), sabemos que o caractere <span class="foreignphrase"><em class="foreignphrase">Pe</em></span> aparece em todos os conjuntos de caracteres CJK, e que seu valor numérico é <code>X'30DA'</code>. Se usarmos esse valor como argumento para <code>p_convert()</code>, o resultado será o seguinte: \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Desde que nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos valores da coluna é <code>3F</code> (ou seja, o caractere de interrogação, <code>?</code>), sabemos que todas as conversões funcionaram. \n
\n
Como nenhum dos