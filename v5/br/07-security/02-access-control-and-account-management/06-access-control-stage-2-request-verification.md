### 6.2.6 Controle de Acesso, Etapa 2: Solicitação de Verificação

Após o servidor aceitar uma conexão, ele entra na Etapa 2 do controle de acesso. Para cada solicitação que você envia através da conexão, o servidor determina qual operação você deseja realizar e, em seguida, verifica se seus privilégios são suficientes. É aqui que as colunas de privilégio nas tabelas de concessão entram em jogo. Esses privilégios podem vir de qualquer uma das tabelas `user`, `db`, `tables_priv`, `columns_priv` ou `procs_priv`. (Você pode achar útil consultar a Seção 6.2.3, “Tabelas de Concessão”, que lista as colunas presentes em cada tabela de concessão.)

A tabela `user` concede privilégios globais. A linha da tabela `user` para uma conta indica os privilégios da conta que se aplicam de forma global, independentemente do banco de dados padrão. Por exemplo, se a tabela `user` lhe concede o privilégio `DELETE`, você pode excluir linhas de qualquer tabela em qualquer banco de dados no host do servidor. É recomendável conceder privilégios na tabela `user` apenas às pessoas que precisam deles, como administradores de banco de dados. Para outros usuários, deixe todos os privilégios na tabela `user` definidos como `'N'` e conceda privilégios apenas em níveis mais específicos (para bancos de dados, tabelas, colunas ou rotinas particulares).

A tabela `db` concede privilégios específicos do banco de dados. Os valores nas colunas de escopo desta tabela podem assumir as seguintes formas:

- Um valor `Usuário` em branco corresponde ao usuário anônimo. Um valor não em branco corresponde literalmente; não há caracteres especiais nos nomes de usuário.

- Os caracteres curinga `%` e `_` podem ser usados nas colunas `Host` e `Db`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`. Se você quiser usar qualquer caractere literalmente ao conceder privilégios, você deve escapar com uma barra invertida. Por exemplo, para incluir o caractere sublinhado (`_`) como parte de um nome de banco de dados, especifique-o como `\_` na declaração `GRANT`.

- Um valor de `'%'` ou `'Host'` em branco significa “qualquer host”.

- Um valor `%` ou `Db` em branco significa “qualquer banco de dados”.

O servidor lê a tabela `db` na memória e a ordena ao mesmo tempo em que lê a tabela `user`. O servidor ordena a tabela `db` com base nas colunas de escopo `Host`, `Db` e `User`. Assim como na tabela `user`, a ordenação coloca os valores mais específicos primeiro e os menos específicos por último. Quando o servidor procura por linhas correspondentes, ele usa a primeira correspondência que encontrar.

As tabelas `tables_priv`, `columns_priv` e `procs_priv` concedem privilégios específicos para tabelas, colunas e rotinas. Os valores nas colunas de escopo dessas tabelas podem assumir as seguintes formas:

- Os caracteres curinga `%` e `_` podem ser usados na coluna `Host`. Esses têm o mesmo significado que as operações de correspondência de padrões realizadas com o operador `LIKE`.

- Um valor de `'%'` ou `'Host'` em branco significa “qualquer host”.

- As colunas `Db`, `Table_name`, `Column_name` e `Routine_name` não podem conter asteriscos ou ficar em branco.

O servidor ordena as tabelas `tables_priv`, `columns_priv` e `procs_priv` com base nas colunas `Host`, `Db` e `User`. Isso é semelhante ao ordenamento da tabela `db`, mas mais simples porque apenas a coluna `Host` pode conter caracteres curingas.

O servidor usa as tabelas ordenadas para verificar cada solicitação que recebe. Para solicitações que requerem privilégios administrativos, como `SHUTDOWN` ou `RELOAD`, o servidor verifica apenas a linha da tabela `user`, porque é a única tabela que especifica privilégios administrativos. O servidor concede acesso se a linha permitir a operação solicitada e, caso contrário, nega o acesso. Por exemplo, se você quiser executar **mysqladmin shutdown**, mas a linha da sua tabela `user` não lhe concede o privilégio `SHUTDOWN`, o servidor negará o acesso, mesmo sem verificar a tabela `db`. (Esta última tabela não contém a coluna `Shutdown_priv`, então não há necessidade de verificá-la.)

Para solicitações relacionadas a bancos de dados (`INSERT`, `UPDATE`, e assim por diante), o servidor primeiro verifica os privilégios globais do usuário na linha da tabela `user`. Se a linha permitir a operação solicitada, o acesso é concedido. Se os privilégios globais na tabela `user` forem insuficientes, o servidor determina os privilégios específicos do usuário no banco de dados a partir da tabela `db`:

- O servidor procura na tabela `db` uma correspondência nas colunas `Host`, `Db` e `User`.

- As colunas `Host` e `User` são correspondidas ao nome do host do usuário conectado e ao nome de usuário do MySQL.

- A coluna `Db` é correspondida ao banco de dados que o usuário deseja acessar.

- Se não houver uma linha para os campos `Host` e `User`, o acesso será negado.

Após determinar os privilégios específicos do banco de dados concedidos pelas linhas da tabela `db`, o servidor adiciona-os aos privilégios globais concedidos pela tabela `user`. Se o resultado permitir a operação solicitada, o acesso é concedido. Caso contrário, o servidor verifica sucessivamente os privilégios da tabela e coluna do usuário nas tabelas `tables_priv` e `columns_priv`, adiciona-os aos privilégios do usuário e permite ou nega o acesso com base no resultado. Para operações de rotinas armazenadas, o servidor usa a tabela `procs_priv` em vez de `tables_priv` e `columns_priv`.

Expresso em termos lógicos, a descrição anterior sobre como os privilégios de um usuário são calculados pode ser resumida da seguinte forma:

```sql
global privileges
OR database privileges
OR table privileges
OR column privileges
OR routine privileges
```

Pode não ser óbvio por que, se os privilégios globais inicialmente forem considerados insuficientes para a operação solicitada, o servidor adiciona esses privilégios aos privilégios da base de dados, tabela e coluna mais tarde. A razão é que um pedido pode exigir mais de um tipo de privilégio. Por exemplo, se você executar uma declaração `INSERT INTO ... SELECT`, você precisa dos privilégios `INSERT` e `SELECT`. Seus privilégios podem ser tais que a linha da tabela `user` conceda um privilégio global e a linha da tabela `db` conceda o outro especificamente para a base de dados relevante. Neste caso, você tem os privilégios necessários para realizar o pedido, mas o servidor não pode dizer isso apenas com seus privilégios globais ou de base de dados. Ele deve tomar uma decisão de controle de acesso com base nos privilégios combinados.
