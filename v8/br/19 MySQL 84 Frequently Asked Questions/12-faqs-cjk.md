## A.11 Perguntas Frequentes do MySQL 8.4: Conjuntos de Caracteres Chinês, Japonês e Coreano do MySQL

Este conjunto de Perguntas Frequentes deriva da experiência dos grupos de Suporte e Desenvolvimento do MySQL ao lidar com muitas consultas sobre questões CJK (Chinês-Japonês-Coreano).

<th>FULLWIDTH OVERLINE</th> <td>FF5E</td> <td>3F</td> <td>3F</td> <td>8160</td> <td>A1C1</td> </tr></tbody></table></div><p> For more information, see Section 28.3.4, “The INFORMATION_SCHEMA.CHARACTER_SETS TABLE”. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> For example, if you try to insert a character that is not in the <code>gb2312</code> character set, MySQL will not insert it. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to insert or retrieve characters from that set. </p><p> If you are using a character set that is not supported by MySQL, you will not be able to

se(mysqli_connect_errno()) { printf("Conexão falhou: %s\n", mysqli_connect_error()); exit(); }

$link-&gt;query("SET NAMES 'utf8'"); ?&gt;</code></pre><p> Nesse caso, usamos <code>SET NAMES</code> para alterar <code>character_set_client</code>, <code>character_set_connection</code> e <code>character_set_results</code>.</p><p> Outro problema frequentemente encontrado em aplicações PHP tem a ver com suposições feitas pelo navegador. Às vezes, adicionar ou alterar uma tag <code>&lt;meta&gt;</code> é suficiente para corrigir o problema: por exemplo, para garantir que o agente do usuário interprete o conteúdo da página como <code>UTF-8</code>, inclua <code>&lt;meta http-equiv="Content-Type" content="text/html; charset=utf-8"&gt;</code> na seção <code>&lt;head&gt;</code> da página HTML.</p><p> Se você estiver usando Connector/J, consulte Usar conjuntos de caracteres e Unicode.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.11.10.</b></p></td><td align="left" valign="top"><p> Eu atualizei para o MySQL 8.4. Como posso reverter para o comportamento do MySQL 4.0 em relação aos conjuntos de caracteres? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> No MySQL Version 4.0, havia um único conjunto de caracteres <code>&lt;span class="quote">“<span class="quote">global”</span>”</code> para o servidor e o cliente, e a decisão sobre qual caractere usar era feita pelo administrador do servidor. Isso mudou a partir do MySQL Version 4.1. O que acontece agora é um <code>&lt;span class="quote">“<span class="quote">handshake”</span>”</code>, conforme descrito na Seção 12.4, “Conjunto de caracteres de conexão e colunas”: </p> <div class="blockquote"> <blockquote class="blockquote"><p> Quando um cliente se conecta, ele envia ao servidor o nome do conjunto de caracteres que deseja usar. O servidor usa o nome para definir as variáveis <code>character_set_client</code>, <code>character_set_results</code> e <code>character_set_connection</code>. Na prática, o servidor realiza uma operação <code>SET NAMES</code> usando o nome do conjunto de caracteres. </p></blockquote> </div> <p> O efeito disso é que você não pode controlar o conjunto de caracteres do cliente iniciando o <code>mysqld</code> com <code>--character-set-server=utf8</code>. No entanto, alguns clientes asiáticos preferem o comportamento do MySQL 4.0. Para permitir que você mantenha esse comportamento, adicionamos uma opção <code>mysqld</code>, <code>--character-set-client-handshake</code>, que pode ser desativada com <code>--skip-character-set-client-handshake</code>. Se você iniciar o <code>mysqld</code> com <code>--skip-character-set-client-handshake</code>, então, quando um cliente se conecta, ele envia ao servidor o nome do conjunto de caracteres que deseja usar. No entanto, o <code>server ignora essa solicitação do cliente</code>.</p><p> Como exemplo, suponha que seu conjunto de caracteres de servidor favorito é <code>latin1</code>. Suponha ainda que o cliente use <code>utf8</code> porque esse é o que o sistema operacional do cliente suporta. Inicie o servidor com <code>latin1</code> como conjunto de caracteres padrão: </p><pre class="programlisting copytoclipboard language-terminal one-line"><code class="language-terminal">mysqld --character-set-server=latin1</code></pre><p> E então inicie o cliente com o conjunto de caracteres padrão <code>utf8</code>: </p><pre class="programlisting copytoclipboard language-terminal one-line"><code class="language-terminal">mysql --default-character-set=utf8</code></pre><p> As configurações resultantes podem ser visualizadas exibindo a saída de <code>SHOW VARIABLES</code>: </p><pre class="programlisting copytoclipboard language-sql"><code class="language-sql">mysql&gt; SHOW VARIABLES LIKE 'char%' +--------------------------+----------------------------------------+ | Variable_name            | Value                                  | +--------------------------+----------------------------------------+ | character_set_client     | latin1                                 | | character_set_connection | latin1                                 | | character_set_database   | latin1                                 | | character_set_filesystem | binary                                 | | character_set_results    | utf8                                   | | character_set_server     | latin1

Crie a procedure p_convert(ucs2_char CHAR(1) CHARACTER SET ucs2) BEGIN

Crie a tabela tj (ucs2 CHAR(1) character set ucs2, utf8 CHAR(1) character set utf8, big5 CHAR(1) character set big5, cp932 CHAR(1) character set cp932, eucjpms CHAR(1) character set eucjpms, euckr CHAR(1) character set euckr, gb2312 CHAR(1) character set gb2312, gbk CHAR(1) character set gbk, sjis CHAR(1) character set sjis, ujis CHAR(1) character set ujis).

INSERIR NA tj (ucs2) VALUES (ucs2_char).

ATUALIZAR NA tj SET utf8=ucs2, big5=ucs2, cp932=ucs2, eucjpms=ucs2, euckr=ucs2, gb2312=ucs2, gbk=ucs2, sjis=ucs2, ujis=ucs2;

/* Se houver problemas de conversão, a atualização produz avisos. */

SELECT hex(ucs2) COMO ucs2, hex(utf8) COMO utf8, hex(big5) COMO big5, hex(cp932) COMO cp932, hex(eucjpms) COMO eucjpms, hex(euckr) COMO euckr, hex(gb2312) COMO gb2312, hex(gbk) COMO gbk, hex(sjis) COMO sjis, hex(ujis) COMO ujis FROM tj;

DROP TABLE tj;

FIM//

DELIMITER `;`
--
DELIMITER ;

SELECT 
    ucs2, 
    utf8, 
    big5, 
    cp932, 
    eucjpms, 
    euckr, 
    gb2312, 
    gbk 
FROM 
    (SELECT 
        ucs2, 
        utf8, 
        big5, 
        cp932, 
        eucjpms, 
        euckr, 
        gb2312, 
        gbk 
        FROM 
            utf8mb4_ja_0900_as_cs 
        WHERE 
            ucs2 = '30DA') AS result 
WHERE 
    result.ucs2 <> '3F' -- ponto de interrogação
    AND result.utf8 <> '30DA' -- código valor (representação hexadecimal) do caractere
    AND result.big5 <> '30DA' -- big5
    AND result.cp932 <> '30DA' -- cp932
    AND result.eucjpms <> '30DA' -- euckr
    AND result.gb2312 <> '30DA' -- sjis
    AND result.gbk <> '30DA' -- ujis

-- Como resultado, temos:
-- 30DA
-- E3839A
-- C772
-- 8379
-- A5DA
-- ABDA
-- A5DA
-- A5DA
-- A5DA
-- 8379
-- A5DA
--
-- Como nenhum dos valores da coluna é 3F, sabemos que todas as conversões funcionaram.
--
-- A.11.13.
--
-- Por que as strings CJK são classificadas incorretamente no Unicode? (I)
--
-- Problemas de classificação de CJK que ocorreram em versões anteriores do MySQL podem ser resolvidos a partir do MySQL 8.0 usando o conjunto de caracteres <code>utf8mb4</code> e a ponderação de classificação <code>utf8mb4_ja_0900_as_cs</code>.
--
-- A.11.14.
--
-- Por que as strings CJK são classificadas incorretamente no Unicode? (II)
--
-- Problemas de classificação de CJK que ocorreram em versões anteriores do MySQL podem ser resolvidos a partir do MySQL 8.0 usando o conjunto de caracteres <code>utf8mb4</code> e a ponderação de classificação <code>utf8mb4_ja_0900_as_cs</code>.
--
-- A.11.15.
--
-- Por que meus caracteres suplementares são rejeitados pelo MySQL?
--
-- Caracteres suplementares estão fora da <span><em>Plane Basic Multilingual / Plane 0</em></span> do Unicode. Os caracteres BMP têm códigos de ponto entre <code>U+0000</code> e <code>U+FFFF</code>. Os caracteres suplementares têm códigos de ponto entre <code>U+10000</code> e <code>U+10FFFF</code>.
-- Para armazenar caracteres suplementares, você deve usar um conjunto de caracteres que os permita:
-- <div class="itemizedlist">
-- <ul class="itemizedlist" style="list-style-type: disc; "><li><p> Os conjuntos de caracteres <code>utf8</code> e <code>ucs2</code> só suportam caracteres BMP.
-- <p> O conjunto de caracteres <code>utf8</code> permite apenas caracteres <code>UTF-8</code> que ocupam até três bytes. Isso levou a relatórios como o encontrado no Bug
-- <span class="quote">“<span class="quote">não é um bug</span>”</span> (Bug
-- <span class="quote">12600</span>). Com <code>utf8</code>, o MySQL deve truncar uma string de entrada quando encontra bytes que ele não entende. Caso contrário, é desconhecido quanto tempo o caractere multibyte ruim é.
-- Uma solução possível é usar <code>ucs2</code> em vez de <code>utf8</code>, no qual os caracteres ruins são alterados para pontos de interrogação. No entanto, não ocorre nenhuma redução. Você também pode alterar o tipo de dados para <code>BLOB</code> ou <code>BINARY</code>, que não realizam nenhuma verificação de validade.
-- <p> Os conjuntos de caracteres <code>utf8mb4</code>, <code>utf1