#### 19.2.1.1 Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas

Cada formato de registro binário tem suas vantagens e desvantagens. Para a maioria dos usuários, o formato de replicação mista deve oferecer a melhor combinação de integridade de dados e desempenho. No entanto, se você quiser aproveitar as características específicas do formato de replicação baseada em declarações ou baseada em linhas ao realizar certas tarefas, você pode usar as informações nesta seção, que fornece um resumo de suas vantagens e desvantagens relativas, para determinar qual é a melhor opção para suas necessidades.

* Vantagens da replicação baseada em declarações

* Desvantagens da replicação baseada em declarações

* Vantagens da replicação baseada em linhas

* Desvantagens da replicação baseada em linhas

##### Vantagens da replicação baseada em declarações

* Tecnologia comprovada.
* Menos dados escritos nos arquivos de registro. Quando atualizações ou exclusões afetam muitas linhas, isso resulta em *muito* menos espaço de armazenamento necessário para os arquivos de registro. Isso também significa que a criação e restauração de backups podem ser realizadas mais rapidamente.

* Os arquivos de registro contêm todas as declarações que fizeram alterações, então eles podem ser usados para auditar o banco de dados.

##### Desvantagens da replicação baseada em declarações

* **Declarações que não são seguras para SBR.** Nem todas as declarações que modificam dados (como as declarações `INSERT`, `DELETE`, `UPDATE` e `REPLACE`) podem ser replicadas usando a replicação baseada em declarações. Qualquer comportamento não determinístico é difícil de replicar ao usar a replicação baseada em declarações. Exemplos de tais declarações de Linguagem de Modificação de Dados (DML) incluem:

+ Uma declaração que depende de uma função carregável ou de um programa armazenado que é não-determinístico, uma vez que o valor retornado por tal função ou programa armazenado depende de fatores distintos dos parâmetros fornecidos a ele. (A replicação baseada em linhas, no entanto, simplesmente replica o valor retornado pela função ou programa armazenado, portanto, seu efeito nas linhas e dados da tabela é o mesmo tanto na fonte quanto na replica.) Veja a Seção 19.5.1.16, “Replicação de Recursos Chamados”, para mais informações.

+ Declarações `DELETE` e `UPDATE` que usam uma cláusula `LIMIT` sem uma cláusula `ORDER BY` são não-determinísticas. Veja a Seção 19.5.1.19, “Replicação e LIMIT”.

+ Declarações de bloqueio de leituras (`SELECT ... FOR UPDATE` e `SELECT ... FOR SHARE`) que usam as opções `NOWAIT` ou `SKIP LOCKED`. Veja Bloqueio de Concorrência de Leitura com NOWAIT e SKIP LOCKED.

+ Funções carregáveis determinísticas devem ser aplicadas nas réplicas.

+ Declarações que usam qualquer uma das seguintes funções não podem ser replicadas corretamente usando a replicação baseada em declarações:

    - `LOAD_FILE()`
    - `UUID()`, `UUID_SHORT()`

    - `USER()`
    - `FOUND_ROWS()`
    - `SYSDATE()` (a menos que tanto a fonte quanto a replica sejam iniciadas com a opção `--sysdate-is-now`)

    - `GET_LOCK()`
    - `IS_FREE_LOCK()`
    - `IS_USED_LOCK()`
    - `RAND()`
    - `RELEASE_LOCK()`
    - `SOURCE_POS_WAIT()`
    - `SLEEP()`
    - `VERSION()`

    No entanto, todas as outras funções são replicadas corretamente usando a replicação baseada em declarações, incluindo `NOW()` e assim por diante.

    Para mais informações, veja a Seção 19.5.1.14, “Replicação e Funções do Sistema”.

  Declarações que não podem ser replicadas corretamente usando a replicação baseada em declarações são registradas com um aviso como o mostrado aqui:

  ```
  [Warning] Statement is not safe to log in statement format.
  ```

Um aviso semelhante também é emitido ao cliente nesses casos. O cliente pode exibir-lo usando `SHOW WARNINGS`.

* A instrução `INSERT ... SELECT` requer um número maior de bloqueios em nível de linha do que com replicação baseada em linha.

* As instruções `UPDATE` que exigem uma varredura da tabela (porque nenhum índice é usado na cláusula `WHERE`) devem bloquear um número maior de linhas do que com replicação baseada em linha.

* Para `InnoDB`: Uma instrução `INSERT` que usa `AUTO_INCREMENT` bloqueia outras instruções `INSERT` não conflitantes.

* Para instruções complexas, a instrução deve ser avaliada e executada na replica antes que as linhas sejam atualizadas ou inseridas. Com replicação baseada em linha, a replica só precisa modificar as linhas afetadas, não executar a instrução completa.

* Se houver um erro na avaliação na replica, particularmente ao executar instruções complexas, a replicação baseada em instruções pode aumentar lentamente a margem de erro nas linhas afetadas ao longo do tempo. Veja a Seção 19.5.1.30, “Erros de Replicação Durante a Replicação”.

* As funções armazenadas são executadas com o mesmo valor de `NOW()` que a instrução que as chama. No entanto, isso não é verdade para procedimentos armazenados.

* As definições das tabelas devem ser (quase) idênticas na fonte e na replica. Veja a Seção 19.5.1.9, “Replicação com Definições de Tabela Diferentes na Fonte e na Replica”, para mais informações.

* Operações DML que leem dados do MySQL concedem tabelas (através de uma lista de junção ou subconsulta) mas não as modificam são realizadas como leituras sem bloqueio nas tabelas de concessão do MySQL e, portanto, não são seguras para replicação baseada em instruções. Para mais informações, veja Concessão de Concorrência de Tabela.

##### Vantagens da replicação baseada em linha

* Todas as alterações podem ser replicadas. Esta é a forma mais segura de replicação.

Nota

As declarações que atualizam as informações no esquema do sistema `mysql`, como `GRANT`, `REVOKE` e a manipulação de gatilhos, rotinas armazenadas (incluindo procedimentos armazenados) e visualizações, são todas replicadas para réplicas usando a replicação baseada em declarações.

Para declarações como `CREATE TABLE ... SELECT`, uma declaração `CREATE` é gerada a partir da definição da tabela e replicada usando o formato baseado em declarações, enquanto as inserções de linhas são replicadas usando o formato baseado em linhas.

* São necessárias menos bloqueadoras de linha na fonte, o que alcança assim maior concorrência, para os seguintes tipos de declarações:

  + `INSERT ... SELECT`

  + Declarações `INSERT` com `AUTO_INCREMENT`

  + Declarações `UPDATE` ou `DELETE` com cláusulas `WHERE` que não usam chaves ou não alteram a maioria das linhas examinadas.

* São necessárias menos bloqueadoras de linha na replica para qualquer declaração `INSERT`, `UPDATE` ou `DELETE`.

##### Desvantagens da replicação baseada em linhas

* A RBR pode gerar mais dados que devem ser registrados. Para replicar uma declaração DML (como uma declaração `UPDATE` ou `DELETE`), a replicação baseada em declarações escreve apenas a declaração no log binário. Em contraste, a replicação baseada em linhas escreve cada linha alterada no log binário. Se a declaração alterar muitas linhas, a replicação baseada em linhas pode escrever significativamente mais dados no log binário; isso é verdadeiro mesmo para declarações que são revertidas. Isso também significa que fazer e restaurar uma cópia de segurança pode exigir mais tempo. Além disso, o log binário é bloqueado por um tempo mais longo para escrever os dados, o que pode causar problemas de concorrência. Use `binlog_row_image=minimal` para reduzir consideravelmente a desvantagem.

* As funções carregáveis determinísticas que geram grandes valores de `BLOB` demoram mais para ser replicadas com a replicação baseada em linhas do que com a replicação baseada em instruções. Isso ocorre porque o valor da coluna `BLOB` é registrado, em vez de a instrução que gera os dados.

* Você não pode ver nas réplicas quais instruções foram recebidas da fonte e executadas. No entanto, você pode ver quais dados foram alterados usando **mysqlbinlog** com as opções `--base64-output=DECODE-ROWS` e `--verbose`.

  Alternativamente, use a variável `binlog_rows_query_log_events`, que, se habilitada, adiciona um evento `Rows_query` com a instrução ao **mysqlbinlog** quando a opção `-vv` é usada.

* Para tabelas que usam o motor de armazenamento `MyISAM`, é necessário um bloqueio mais forte na replica para instruções `INSERT` ao aplicá-las como eventos baseados em linhas no log binário do que ao aplicá-las como instruções. Isso significa que as inserções concorrentes em tabelas `MyISAM` não são suportadas ao usar a replicação baseada em linhas.