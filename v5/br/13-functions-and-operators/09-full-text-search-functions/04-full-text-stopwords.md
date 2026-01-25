### 12.9.4 Stopwords de Texto Completo (Full-Text Stopwords)

A lista de stopwords é carregada e pesquisada para Queries de Full-Text usando o Character Set e a Collation do servidor (os valores das variáveis de sistema `character_set_server` e `collation_server`). Falsos positivos ou negativos podem ocorrer para buscas de stopword se o arquivo de stopword ou as colunas usadas para Indexing ou buscas de Full-Text tiverem um Character Set ou uma Collation diferente de `character_set_server` ou `collation_server`.

A sensibilidade a maiúsculas e minúsculas (case sensitivity) das buscas de stopword depende da Collation do servidor. Por exemplo, as buscas são case-insensitive se a Collation for `latin1_swedish_ci`, enquanto as buscas são case-sensitive se a Collation for `latin1_general_cs` ou `latin1_bin`.

* Stopwords para Indexes de Busca InnoDB
* Stopwords para Indexes de Busca MyISAM

#### Stopwords para Indexes de Busca InnoDB

O `InnoDB` possui uma lista relativamente curta de stopwords padrão, pois documentos de fontes técnicas, literárias e outras, frequentemente usam palavras curtas como keywords ou em frases significativas. Por exemplo, você pode pesquisar por “to be or not to be” e esperar obter um resultado sensato, em vez de ter todas essas palavras ignoradas.

Para ver a lista de stopwords padrão do `InnoDB`, execute uma Query na tabela `INNODB_FT_DEFAULT_STOPWORD` do Information Schema.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FT_DEFAULT_STOPWORD;
+-------+
| value |
+-------+
| a     |
| about |
| an    |
| are   |
| as    |
| at    |
| be    |
| by    |
| com   |
| de    |
| en    |
| for   |
| from  |
| how   |
| i     |
| in    |
| is    |
| it    |
| la    |
| of    |
| on    |
| or    |
| that  |
| the   |
| this  |
| to    |
| was   |
| what  |
| when  |
| where |
| who   |
| will  |
| with  |
| und   |
| the   |
| www   |
+-------+
36 rows in set (0.00 sec)
```

Para definir sua própria lista de stopwords para todas as tabelas `InnoDB`, defina uma tabela com a mesma estrutura da tabela `INNODB_FT_DEFAULT_STOPWORD`, popule-a com stopwords e defina o valor da opção `innodb_ft_server_stopword_table` para um valor no formato `db_name/table_name` antes de criar o Index de Full-Text. A tabela de stopword deve ter uma única coluna `VARCHAR` chamada `value`. O exemplo a seguir demonstra a criação e configuração de uma nova tabela de stopword global para o `InnoDB`.

```sql
-- Create a new stopword table

mysql> CREATE TABLE my_stopwords(value VARCHAR(30)) ENGINE = INNODB;
Query OK, 0 rows affected (0.01 sec)

-- Insert stopwords (for simplicity, a single stopword is used in this example)

mysql> INSERT INTO my_stopwords(value) VALUES ('Ishmael');
Query OK, 1 row affected (0.00 sec)

-- Create the table

mysql> CREATE TABLE opening_lines (
id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
opening_line TEXT(500),
author VARCHAR(200),
title VARCHAR(200)
) ENGINE=InnoDB;
Query OK, 0 rows affected (0.01 sec)

-- Insert data into the table

mysql> INSERT INTO opening_lines(opening_line,author,title) VALUES
('Call me Ishmael.','Herman Melville','Moby-Dick'),
('A screaming comes across the sky.','Thomas Pynchon','Gravity\'s Rainbow'),
('I am an invisible man.','Ralph Ellison','Invisible Man'),
('Where now? Who now? When now?','Samuel Beckett','The Unnamable'),
('It was love at first sight.','Joseph Heller','Catch-22'),
('All this happened, more or less.','Kurt Vonnegut','Slaughterhouse-Five'),
('Mrs. Dalloway said she would buy the flowers herself.','Virginia Woolf','Mrs. Dalloway'),
('It was a pleasure to burn.','Ray Bradbury','Fahrenheit 451');
Query OK, 8 rows affected (0.00 sec)
Records: 8  Duplicates: 0  Warnings: 0

-- Set the innodb_ft_server_stopword_table option to the new stopword table

mysql> SET GLOBAL innodb_ft_server_stopword_table = 'test/my_stopwords';
Query OK, 0 rows affected (0.00 sec)

-- Create the full-text index (which rebuilds the table if no FTS_DOC_ID column is defined)

mysql> CREATE FULLTEXT INDEX idx ON opening_lines(opening_line);
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 1
```

Verifique se a stopword especificada ('Ishmael') não aparece executando uma Query na tabela `INNODB_FT_INDEX_TABLE` do Information Schema.

Nota

Por padrão, palavras com menos de 3 caracteres de comprimento ou mais de 84 caracteres de comprimento não aparecem em um Index de busca Full-Text do `InnoDB`. Os valores de comprimento máximo e mínimo de palavras são configuráveis usando as variáveis `innodb_ft_max_token_size` e `innodb_ft_min_token_size`. Este comportamento padrão não se aplica ao plugin de parser ngram. O tamanho do token ngram é definido pela opção `ngram_token_size`.

```sql
mysql> SET GLOBAL innodb_ft_aux_table='test/opening_lines';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT word FROM INFORMATION_SCHEMA.INNODB_FT_INDEX_TABLE LIMIT 15;
+-----------+
| word      |
+-----------+
| across    |
| all       |
| burn      |
| buy       |
| call      |
| comes     |
| dalloway  |
| first     |
| flowers   |
| happened  |
| herself   |
| invisible |
| less      |
| love      |
| man       |
+-----------+
15 rows in set (0.00 sec)
```

Para criar listas de stopwords tabela por tabela, crie outras tabelas de stopword e use a opção `innodb_ft_user_stopword_table` para especificar a tabela de stopword que você deseja usar antes de criar o Index de Full-Text.

#### Stopwords para Indexes de Busca MyISAM

O arquivo de stopword é carregado e pesquisado usando `latin1` se `character_set_server` for `ucs2`, `utf16`, `utf16le` ou `utf32`.

Para substituir a lista de stopwords padrão para tabelas MyISAM, defina a variável de sistema `ft_stopword_file`. (Consulte a Seção 5.1.7, “Server System Variables”.) O valor da variável deve ser o nome do caminho do arquivo contendo a lista de stopword, ou uma string vazia para desativar a filtragem de stopword. O servidor procura o arquivo no diretório de dados, a menos que um nome de caminho absoluto seja fornecido para especificar um diretório diferente. Depois de alterar o valor desta variável ou o conteúdo do arquivo de stopword, reinicie o servidor e reconstrua seus Indexes `FULLTEXT`.

A lista de stopwords é de formato livre, separando stopwords com qualquer caractere não alfanumérico, como quebra de linha (newline), espaço ou vírgula. As exceções são o caractere de sublinhado (`_`) e um único apóstrofo (`'`), que são tratados como parte de uma palavra. O Character Set da lista de stopword é o Character Set padrão do servidor; consulte a Seção 10.3.2, “Server Character Set and Collation”.

A lista a seguir mostra as stopwords padrão para Indexes de busca `MyISAM`. Em uma distribuição de código-fonte do MySQL, você pode encontrar esta lista no arquivo `storage/myisam/ft_static.c`.

```sql
a's           able          about         above         according
accordingly   across        actually      after         afterwards
again         against       ain't         all           allow
allows        almost        alone         along         already
also          although      always        am            among
amongst       an            and           another       any
anybody       anyhow        anyone        anything      anyway
anyways       anywhere      apart         appear        appreciate
appropriate   are           aren't        around        as
aside         ask           asking        associated    at
available     away          awfully       be            became
because       become        becomes       becoming      been
before        beforehand    behind        being         believe
below         beside        besides       best          better
between       beyond        both          brief         but
by            c'mon         c's           came          can
can't         cannot        cant          cause         causes
certain       certainly     changes       clearly       co
com           come          comes         concerning    consequently
consider      considering   contain       containing    contains
corresponding could         couldn't      course        currently
definitely    described     despite       did           didn't
different     do            does          doesn't       doing
don't         done          down          downwards     during
each          edu           eg            eight         either
else          elsewhere     enough        entirely      especially
et            etc           even          ever          every
everybody     everyone      everything    everywhere    ex
exactly       example       except        far           few
fifth         first         five          followed      following
follows       for           former        formerly      forth
four          from          further       furthermore   get
gets          getting       given         gives         go
goes          going         gone          got           gotten
greetings     had           hadn't        happens       hardly
has           hasn't        have          haven't       having
he            he's          hello         help          hence
her           here          here's        hereafter     hereby
herein        hereupon      hers          herself       hi
him           himself       his           hither        hopefully
how           howbeit       however       i'd           i'll
i'm           i've          ie            if            ignored
immediate     in            inasmuch      inc           indeed
indicate      indicated     indicates     inner         insofar
instead       into          inward        is            isn't
it            it'd          it'll         it's          its
itself        just          keep          keeps         kept
know          known         knows         last          lately
later         latter        latterly      least         less
lest          let           let's         like          liked
likely        little        look          looking       looks
ltd           mainly        many          may           maybe
me            mean          meanwhile     merely        might
more          moreover      most          mostly        much
must          my            myself        name          namely
nd            near          nearly        necessary     need
needs         neither       never         nevertheless  new
next          nine          no            nobody        non
none          noone         nor           normally      not
nothing       novel         now           nowhere       obviously
of            off           often         oh            ok
okay          old           on            once          one
ones          only          onto          or            other
others        otherwise     ought         our           ours
ourselves     out           outside       over          overall
own           particular    particularly  per           perhaps
placed        please        plus          possible      presumably
probably      provides      que           quite         qv
rather        rd            re            really        reasonably
regarding     regardless    regards       relatively    respectively
right         said          same          saw           say
saying        says          second        secondly      see
seeing        seem          seemed        seeming       seems
seen          self          selves        sensible      sent
serious       seriously     seven         several       shall
she           should        shouldn't     since         six
so            some          somebody      somehow       someone
something     sometime      sometimes     somewhat      somewhere
soon          sorry         specified     specify       specifying
still         sub           such          sup           sure
t's           take          taken         tell          tends
th            than          thank         thanks        thanx
that          that's        thats         the           their
theirs        them          themselves    then          thence
there         there's       thereafter    thereby       therefore
therein       theres        thereupon     these         they
they'd        they'll       they're       they've       think
third         this          thorough      thoroughly    those
though        three         through       throughout    thru
thus          to            together      too           took
toward        towards       tried         tries         truly
try           trying        twice         two           un
under         unfortunately unless        unlikely      until
unto          up            upon          us            use
used          useful        uses          using         usually
value         various       very          via           viz
vs            want          wants         was           wasn't
way           we            we'd          we'll         we're
we've         welcome       well          went          were
weren't       what          what's        whatever      when
whence        whenever      where         where's       whereafter
whereas       whereby       wherein       whereupon     wherever
whether       which         while         whither       who
who's         whoever       whole         whom          whose
why           will          willing       wish          with
within        without       won't         wonder        would
wouldn't      yes           yet           you           you'd
you'll        you're        you've        your          yours
yourself      yourselves    zero
```