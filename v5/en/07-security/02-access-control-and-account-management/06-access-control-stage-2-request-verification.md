### 6.2.6 Controle de Acesso, Estágio 2: Verificação de Request

Após o servidor aceitar uma conexão, ele entra no Estágio 2 do controle de acesso. Para cada *request* que você emite através da conexão, o servidor determina qual operação você deseja executar e, em seguida, verifica se seus *privileges* são suficientes. É aqui que as colunas de *privilege* nas *grant tables* entram em jogo. Esses *privileges* podem vir de qualquer uma das tabelas `user`, `db`, `tables_priv`, `columns_priv` ou `procs_priv`. (Pode ser útil consultar [Seção 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables"), que lista as colunas presentes em cada *grant table*.)

A tabela `user` concede *global privileges* (privilégios globais). A linha da tabela `user` para uma conta indica os *account privileges* que se aplicam em uma base global, independentemente de qual seja o *default database*. Por exemplo, se a tabela `user` lhe conceder o *privilege* [`DELETE`](privileges-provided.html#priv_delete), você poderá excluir linhas de qualquer *table* em qualquer *database* no *host* do servidor. É prudente conceder *privileges* na tabela `user` apenas para pessoas que deles necessitam, como administradores de *database*. Para outros *users*, deixe todos os *privileges* na tabela `user` definidos como `'N'` e conceda *privileges* apenas em níveis mais específicos (para *databases*, *tables*, *columns* ou *routines* particulares).

A tabela `db` concede *database-specific privileges* (privilégios específicos de *database*). Os valores nas colunas de escopo desta tabela podem assumir as seguintes formas:

* Um valor `User` em branco corresponde ao *user* anônimo. Um valor não branco corresponde literalmente; não há *wildcards* em nomes de *user*.

* Os caracteres *wildcard* `%` e `_` podem ser usados nas colunas `Host` e `Db`. Eles têm o mesmo significado que para operações de comparação de padrões realizadas com o operador [`LIKE`](string-comparison-functions.html#operator_like). Se você quiser usar qualquer um dos caracteres literalmente ao conceder *privileges*, você deve escapá-lo com uma barra invertida (*backslash*). Por exemplo, para incluir o caractere *underscore* (`_`) como parte de um nome de *database*, especifique-o como `\_` na instrução [`GRANT`](grant.html "13.7.1.4 GRANT Statement").

* Um valor `Host` `'%'` ou em branco significa "qualquer *host*".

* Um valor `Db` `'%'` ou em branco significa "qualquer *database*".

O servidor lê a tabela `db` para a memória e a ordena ao mesmo tempo em que lê a tabela `user`. O servidor ordena a tabela `db` com base nas colunas de escopo `Host`, `Db` e `User`. Assim como na tabela `user`, a ordenação coloca os valores mais específicos primeiro e os valores menos específicos por último, e quando o servidor procura por linhas correspondentes, ele usa a primeira correspondência que encontra.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` concedem *privileges* específicos de *table*, específicos de *column* e específicos de *routine*. Os valores nas colunas de escopo dessas tabelas podem assumir as seguintes formas:

* Os caracteres *wildcard* `%` e `_` podem ser usados na coluna `Host`. Eles têm o mesmo significado que para operações de comparação de padrões realizadas com o operador [`LIKE`](string-comparison-functions.html#operator_like).

* Um valor `Host` `'%'` ou em branco significa "qualquer *host*".

* As colunas `Db`, `Table_name`, `Column_name` e `Routine_name` não podem conter *wildcards* ou estar em branco.

O servidor ordena as tabelas `tables_priv`, `columns_priv` e `procs_priv` com base nas colunas `Host`, `Db` e `User`. Isso é semelhante à ordenação da tabela `db`, mas mais simples porque apenas a coluna `Host` pode conter *wildcards*.

O servidor usa as tabelas ordenadas para verificar cada *request* que recebe. Para *requests* que exigem *administrative privileges*, como [`SHUTDOWN`](privileges-provided.html#priv_shutdown) ou [`RELOAD`](privileges-provided.html#priv_reload), o servidor verifica apenas a linha da tabela `user`, pois esta é a única tabela que especifica *administrative privileges*. O servidor concede o acesso se a linha permitir a operação solicitada e nega o acesso caso contrário. Por exemplo, se você quiser executar [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") mas sua linha da tabela `user` não lhe conceder o *privilege* [`SHUTDOWN`](privileges-provided.html#priv_shutdown), o servidor nega o acesso sem sequer verificar a tabela `db`. (Esta última tabela não contém a coluna `Shutdown_priv`, portanto, não há necessidade de verificá-la.)

Para *requests* relacionados a *database* ([`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), e assim por diante), o servidor primeiro verifica os *global privileges* do *user* na linha da tabela `user`. Se a linha permitir a operação solicitada, o acesso é concedido. Se os *global privileges* na tabela `user` forem insuficientes, o servidor determina os *database-specific privileges* do *user* a partir da tabela `db`:

* O servidor procura na tabela `db` por uma correspondência nas colunas `Host`, `Db` e `User`.

* As colunas `Host` e `User` são comparadas com o nome do *host* e o nome de *user* MySQL do *user* que está se conectando.

* A coluna `Db` é comparada com o *database* que o *user* deseja acessar.

* Se não houver linha para o `Host` e o `User`, o acesso é negado.

Após determinar os *database-specific privileges* concedidos pelas linhas da tabela `db`, o servidor os adiciona aos *global privileges* concedidos pela tabela `user`. Se o resultado permitir a operação solicitada, o acesso é concedido. Caso contrário, o servidor verifica sucessivamente os *table* e *column privileges* do *user* nas tabelas `tables_priv` e `columns_priv`, adiciona-os aos *privileges* do *user* e permite ou nega o acesso com base no resultado. Para operações de *stored routine*, o servidor usa a tabela `procs_priv` em vez de `tables_priv` e `columns_priv`.

Expressa em termos booleanos, a descrição anterior de como os *privileges* de um *user* são calculados pode ser resumida assim:

```sql
global privileges
OR database privileges
OR table privileges
OR column privileges
OR routine privileges
```

Pode não ser óbvio por que, se os *global privileges* forem inicialmente considerados insuficientes para a operação solicitada, o servidor adiciona esses *privileges* aos *database*, *table* e *column privileges* posteriormente. A razão é que um *request* pode exigir mais de um tipo de *privilege*. Por exemplo, se você executar uma instrução [`INSERT INTO ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), você precisa dos *privileges* [`INSERT`](privileges-provided.html#priv_insert) e [`SELECT`](privileges-provided.html#priv_select). Seus *privileges* podem ser tais que a linha da tabela `user` concede um *privilege* global e a linha da tabela `db` concede o outro especificamente para o *database* relevante. Neste caso, você tem os *privileges* necessários para executar o *request*, mas o servidor não consegue identificar isso apenas a partir de seus *global privileges* ou *database privileges*. Ele deve tomar uma decisão de controle de acesso com base nos *privileges* combinados.