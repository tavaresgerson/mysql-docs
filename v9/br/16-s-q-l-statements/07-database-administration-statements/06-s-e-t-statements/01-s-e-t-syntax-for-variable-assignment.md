#### 15.7.6.1 Sintaxe `SET` para Atribuição de Variáveis

```
SET variable = expr [, variable = expr] ...

variable: {
    user_var_name
  | param_name
  | local_var_name
  | {GLOBAL | @@GLOBAL.} system_var_name
  | {PERSIST | @@PERSIST.} system_var_name
  | {PERSIST_ONLY | @@PERSIST_ONLY.} system_var_name
  | [SESSION | @@SESSION. | @@] system_var_name
}
```

A sintaxe `SET` para atribuição de variáveis permite que você atribua valores a diferentes tipos de variáveis que afetam o funcionamento do servidor ou dos clientes:

* Variáveis definidas pelo usuário. Consulte a Seção 11.4, “Variáveis Definidas pelo Usuário”.
* Parâmetros de procedimentos armazenados e funções armazenadas, e variáveis locais de programas armazenados. Consulte a Seção 15.6.4, “Variáveis em Programas Armazenados”.
* Variáveis de sistema. Consulte a Seção 7.1.8, “Variáveis de Sistema do Servidor”. As variáveis de sistema também podem ser definidas na inicialização do servidor, conforme descrito na Seção 7.1.9, “Uso de Variáveis de Sistema”.

A instrução `SET` que atribui valores a variáveis não é escrita no log binário, portanto, em cenários de replicação, ela afeta apenas o host em que você a executa. Para afetar todos os hosts de replicação, execute a instrução em cada host.

As seções a seguir descrevem a sintaxe `SET` para definir variáveis. Elas usam o operador de atribuição `=` para a definição de variáveis, mas o operador de atribuição `:=` também é permitido para esse propósito.

* Atribuição de Variável Definida pelo Usuário
* Atribuição de Parâmetros e Variáveis Locais
* Atribuição de Variável de Sistema
* Gerenciamento de Erros de `SET`
* Atribuição de Variáveis Múltiplas
* Referências de Variáveis de Sistema em Expressões

##### Atribuição de Variável Definida pelo Usuário

Variáveis definidas pelo usuário são criadas localmente dentro de uma sessão e existem apenas dentro do contexto dessa sessão; consulte a Seção 11.4, “Variáveis Definidas pelo Usuário”.

Uma variável definida pelo usuário é escrita como `@var_name` e é atribuída um valor de expressão da seguinte forma:

```
SET @var_name = expr;
```

Exemplos:

```
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

Como demonstrado por essas instruções, *`expr`* pode variar de simples (um valor literal) a mais complexo (o valor retornado por uma subconsulta escalar).

A tabela do Schema de Desempenho `user_variables_by_thread` contém informações sobre variáveis definidas pelo usuário. Veja a Seção 29.12.10, “Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho”.

##### Atribuição de Parâmetros e Variáveis Locais

`SET` se aplica a parâmetros e variáveis locais no contexto do objeto armazenado dentro do qual são definidos. O seguinte procedimento usa o parâmetro de procedimento `increment` e a variável local `counter`:

```
CREATE PROCEDURE p(increment INT)
BEGIN
  DECLARE counter INT DEFAULT 0;
  WHILE counter < 10 DO
    -- ... do work ...
    SET counter = counter + increment;
  END WHILE;
END;
```

##### Atribuição de Variáveis de Sistema

O servidor MySQL mantém variáveis de sistema que configuram sua operação. Uma variável de sistema pode ter um valor global que afeta a operação do servidor como um todo, um valor de sessão que afeta a sessão atual ou ambos. Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET` para afetar a operação da instância atual do servidor. `SET` também pode ser usado para persistir certas variáveis de sistema no arquivo `mysqld-auto.cnf` no diretório de dados, para afetar a operação do servidor para inicializações subsequentes.

Se uma instrução `SET` for emitida para uma variável de sistema sensível, a consulta é reescrita para substituir o valor por “`<redacted>”” antes de ser registrada no log geral e no log de auditoria. Isso ocorre mesmo se o armazenamento seguro por meio de um componente de chave de segurança não estiver disponível na instância do servidor.

Se você alterar uma variável de sistema de sessão, o valor permanecerá em vigor dentro da sua sessão até que você altere a variável para um valor diferente ou a sessão termine. A alteração não tem efeito em outras sessões.

Se você alterar uma variável de sistema global, o valor é lembrado e usado para inicializar o valor da sessão para novas sessões até que você altere a variável para um valor diferente ou o servidor saia. A alteração é visível para qualquer cliente que acesse o valor global. No entanto, a alteração afeta o valor correspondente da sessão apenas para clientes que se conectam após a alteração. A alteração da variável global não afeta o valor da sessão para nenhuma sessão de cliente atual (nem mesmo a sessão na qual a alteração da variável global ocorre).

Para tornar uma configuração de variável de sistema global permanente, para que ela seja aplicada em reinicializações do servidor, você pode persistir na configuração no arquivo `mysqld-auto.cnf` no diretório de dados. Também é possível fazer alterações de configuração persistentes manualmente modificando um arquivo de opção `my.cnf`, mas isso é mais trabalhoso e um erro em uma configuração inserida manualmente pode não ser descoberto até muito mais tarde. As declarações `SET` que persistem variáveis de sistema são mais convenientes e evitam a possibilidade de configurações malformadas porque as configurações com erros sintáticos não têm sucesso e não alteram a configuração do servidor. Para mais informações sobre a persistência de variáveis de sistema e o arquivo `mysqld-auto.cnf`, consulte a Seção 7.1.9.3, “Variáveis de Sistema Persistidas”.

Nota

Definir ou persistir o valor de uma variável de sistema global sempre requer privilégios especiais. Definir o valor de uma variável de sistema de sessão normalmente não requer privilégios especiais e pode ser feito por qualquer usuário, embora haja exceções. Para mais informações, consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”.

A discussão a seguir descreve as opções de sintaxe para definir e persistir variáveis de sistema:

* Para atribuir um valor a uma variável de sistema global, preceda o nome da variável com a palavra-chave `GLOBAL` ou o qualificador `@@GLOBAL.`:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Para atribuir um valor a uma variável de sistema de sessão, preceda o nome da variável com a palavra-chave `SESSION` ou `LOCAL`, com o qualificador `@@SESSION.`, `@@LOCAL.`, ou `@@`, ou sem nenhuma palavra-chave ou modificador:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

  Um cliente pode alterar suas próprias variáveis de sessão, mas não as de outros clientes.

* Para persistir uma variável de sistema global no arquivo de opção `mysqld-auto.cnf` no diretório de dados, preceda o nome da variável com a palavra-chave `PERSIST` ou o qualificador `@@PERSIST.`:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

  Esta sintaxe `SET` permite que você faça alterações na configuração em tempo de execução que também persistem após reinicialização do servidor. Como `SET GLOBAL`, `SET PERSIST` define o valor de runtime da variável global, mas também escreve o ajuste da variável no arquivo `mysqld-auto.cnf` (substituindo qualquer ajuste de variável existente, se houver).

* Para persistir uma variável de sistema global no arquivo `mysqld-auto.cnf` sem definir o valor de runtime da variável global, preceda o nome da variável com a palavra-chave `PERSIST_ONLY` ou o qualificador `@@PERSIST_ONLY.`:

  ```
  SET PERSIST_ONLY back_log = 100;
  SET @@PERSIST_ONLY.back_log = 100;
  ```

  Como `PERSIST`, `PERSIST_ONLY` escreve o ajuste da variável no `mysqld-auto.cnf`. No entanto, ao contrário de `PERSIST`, `PERSIST_ONLY` não modifica o valor de runtime da variável global. Isso torna `PERSIST_ONLY` adequado para configurar variáveis de sistema de leitura apenas que podem ser definidas apenas no início do servidor.

Para definir o valor de uma variável de sistema global para o valor padrão integrado do MySQL ou uma variável de sistema de sessão para o valor global correspondente atual, defina a variável para o valor `DEFAULT`. Por exemplo, as seguintes duas instruções são idênticas para definir o valor da sessão de `max_join_size` para o valor global atual:

```
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

Usar `SET` para persistir uma variável de sistema global para um valor de `DEFAULT` ou para seu valor padrão literal atribui a variável seu valor padrão e adiciona uma configuração para a variável no `mysqld-auto.cnf`. Para remover a variável do arquivo, use `RESET PERSIST`.

Algumas variáveis de sistema não podem ser persistidas ou são persistidas com restrições. Veja a Seção 7.1.9.4, “Variáveis de Sistema Não Persistidas e com Restrições de Persistimento”.

Uma variável de sistema implementada por um plugin pode ser persistida se o plugin for instalado quando a instrução `SET` for executada. A atribuição da variável persistida do plugin entra em vigor para reinicializações subsequentes do servidor se o plugin ainda estiver instalado. Se o plugin não estiver mais instalado, a variável do plugin não existirá mais quando o servidor ler o arquivo `mysqld-auto.cnf`. Nesse caso, o servidor escreve uma mensagem de aviso no log de erro e continua:

```
currently unknown variable 'var_name'
was read from the persisted config file
```

Para exibir os nomes e valores das variáveis de sistema:

* Use a instrução `SHOW VARIABLES`; veja a Seção 15.7.7.42, “Instrução SHOW VARIABLES”.
* Várias tabelas do Schema de Desempenho fornecem informações sobre variáveis de sistema. Veja a Seção 29.12.14, “Tabelas de Variáveis de Sistema do Schema de Desempenho”.
* A tabela `variables_info` do Schema de Desempenho contém informações sobre quando e por qual usuário cada variável de sistema foi definida mais recentemente. Veja a Seção 29.12.14.3, “Tabela variables_info do Schema de Desempenho”.

* A tabela do Schema de Desempenho `persisted_variables` fornece uma interface SQL ao arquivo `mysqld-auto.cnf`, permitindo que seu conteúdo seja inspecionado em tempo de execução usando instruções `SELECT`. Veja a Seção 29.12.14.2, “Tabela Schema de Desempenho persisted_variables”.

##### SET Gerenciamento de Erros

Se qualquer atribuição de variável em uma instrução `SET` falhar, toda a instrução falha e nenhuma variável é alterada, nem o arquivo `mysqld-auto.cnf` é alterado.

`SET` produz um erro nas circunstâncias descritas aqui. A maioria dos exemplos mostra instruções `SET` que usam sintaxe de palavras-chave (por exemplo, `GLOBAL` ou `SESSION`), mas os princípios também são verdadeiros para instruções que usam os modificadores correspondentes (por exemplo, `@@GLOBAL.` ou `@@SESSION.`).

* Uso de `SET` (qualquer variante) para definir uma variável de leitura somente:

  ```
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

* Uso de `GLOBAL`, `PERSIST` ou `PERSIST_ONLY` para definir uma variável que tem apenas um valor de sessão:

  ```
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1228 (HY000): Variable 'sql_log_bin' is a SESSION
  variable and can't be used with SET GLOBAL
  ```

* Uso de `SESSION` para definir uma variável que tem apenas um valor global:

  ```
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Omissão de `GLOBAL`, `PERSIST` ou `PERSIST_ONLY` para definir uma variável que tem apenas um valor global:

  ```
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Uso de `PERSIST` ou `PERSIST_ONLY` para definir uma variável que não pode ser persistente:

  ```
  mysql> SET PERSIST port = 3307;
  ERROR 1238 (HY000): Variable 'port' is a read only variable
  mysql> SET PERSIST_ONLY port = 3307;
  ERROR 1238 (HY000): Variable 'port' is a non persistent read only variable
  ```

* Os modificadores `@@GLOBAL.`, `@@PERSIST.`, `@@PERSIST_ONLY.`, `@@SESSION.` e `@@` aplicam-se apenas a variáveis de sistema. Uma tentativa de aplicá-los a variáveis definidas pelo usuário, parâmetros de procedimento armazenado ou função armazenada ou variáveis locais de programa armazenado resulta em um erro.

* Nem todas as variáveis de sistema podem ser definidas como `DEFAULT`. Nesse caso, a atribuição de `DEFAULT` resulta em um erro.

* Uma tentativa de atribuir `DEFAULT` a variáveis definidas pelo usuário, parâmetros de procedimento armazenado ou função armazenada ou variáveis locais de programa armazenado resulta em um erro.

##### Atribuição de Variáveis Múltiplas

Uma instrução `SET` pode conter múltiplas atribuições de variáveis, separadas por vírgulas. Esta instrução atribui valores a uma variável definida pelo usuário e a uma variável do sistema:

```
SET @x = 1, SESSION sql_mode = '';
```

Se você definir múltiplas variáveis do sistema em uma única instrução, a palavra-chave mais recente `GLOBAL`, `PERSIST`, `PERSIST_ONLY` ou `SESSION` na instrução é usada para as atribuições seguintes que não têm uma palavra-chave especificada.

Exemplos de atribuição de variáveis múltiplas:

```
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

Os modificadores `@@GLOBAL.`, `@@PERSIST.`, `@@PERSIST_ONLY.`, `@@SESSION.`, e `@@` aplicam-se apenas à variável do sistema imediatamente seguinte, não a quaisquer variáveis do sistema restantes. Esta instrução define o valor global `sort_buffer_size` para 50000 e o valor de sessão para 1000000:

```
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### Referências de Variáveis do Sistema em Expressões

Para referenciar o valor de uma variável do sistema em expressões, use um dos modificadores `@@` (exceto `@@PERSIST.` e `@@PERSIST_ONLY.`, que não são permitidos em expressões). Por exemplo, você pode recuperar os valores das variáveis do sistema em uma instrução `SELECT` assim:

```
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Observação

Uma referência a uma variável do sistema em uma expressão como `@@var_name` (com `@@` em vez de `@@GLOBAL.` ou `@@SESSION.`) retorna o valor de sessão se existir e o valor global caso contrário. Isso difere de `SET @@var_name = expr`, que sempre refere-se ao valor de sessão.