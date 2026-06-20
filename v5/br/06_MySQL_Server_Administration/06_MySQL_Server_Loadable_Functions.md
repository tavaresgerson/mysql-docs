## 5.6 Funções carregáveis do MySQL Server

O MySQL suporta funções carregáveis, ou seja, funções que não são construídas internamente, mas podem ser carregadas em tempo de execução (durante o início ou posteriormente) para ampliar as capacidades do servidor, ou descarregadas para remover capacidades. Para uma tabela que descreve as funções carregáveis disponíveis, consulte a Seção 12.2, “Referência de Função Carregável”. As funções carregáveis contrastam com as funções integrais (nativas), que são implementadas como parte do servidor e estão sempre disponíveis; para uma tabela, consulte a Seção 12.1, “Referência de Função e Operador Integrado”.

Nota

As funções carregáveis eram anteriormente conhecidas como funções definidas pelo usuário (UDFs). Essa terminologia era um pouco equivocada, pois "definida pelo usuário" também pode se aplicar a outros tipos de funções, como funções armazenadas (um tipo de objeto armazenado escrito usando SQL) e funções nativas adicionadas modificando o código-fonte do servidor.

As distribuições do MySQL incluem funções carregáveis que implementam, total ou parcialmente, essas capacidades do servidor:

* A Edição Empresarial do MySQL inclui funções que realizam operações de criptografia com base na biblioteca OpenSSL. Veja a Seção 6.6, “Criptografia Empresarial do MySQL”.

* A Edição Empresarial do MySQL inclui funções que oferecem uma API de nível SQL para operações de mascaramento e desidentificação. Consulte a Seção 6.5.1, “Elementos de Mascaramento e Desidentificação de Dados do MySQL Empresarial”.

* A Edição Empresarial do MySQL inclui registro de auditoria para monitoramento e registro de atividade de conexão e consulta. Veja a Seção 6.4.5, “Auditoria Empresarial do MySQL”.

* A Edição Empresarial do MySQL inclui uma capacidade de firewall que implementa um firewall de nível de aplicação para permitir que os administradores de banco de dados permitam ou negam a execução de declarações SQL com base na correspondência com padrões para declarações aceitas. Veja a Seção 6.4.6, “Firewall Empresarial do MySQL”.

* Um reescritor de consulta examina as declarações recebidas pelo MySQL Server e, possivelmente, as reescreve antes de o servidor executá-las. Veja a Seção 5.5.4, “O Plugin de Reescrita de Consulta do Rewriter”

* Tokens de versão permite a criação e sincronização em torno de tokens do servidor que as aplicações podem usar para evitar o acesso a dados incorretos ou desatualizados. Veja a Seção 5.5.5, “Tokens de versão”.

* O Keyring do MySQL oferece armazenamento seguro para informações sensíveis. Veja a Seção 6.4.4, “O Keyring do MySQL”.

* Um serviço de bloqueio oferece uma interface de bloqueio para uso de aplicativos. Veja a Seção 5.5.6.1, “O Serviço de Bloqueio”.

As seções a seguir descrevem como instalar e desinstalar funções carregáveis e como determinar em tempo de execução quais funções carregáveis estão instaladas e obter informações sobre elas.

Para obter informações sobre como escrever funções carregáveis, consulte Adicionar funções ao MySQL.

### 5.6.1 Instalar e desinstalar funções carregáveis

As funções carregáveis, como o nome sugere, devem ser carregadas no servidor antes de serem utilizadas. O MySQL suporta o carregamento automático de funções durante a inicialização do servidor e o carregamento manual posteriormente.

Enquanto uma função carregável é carregada, as informações sobre ela estão disponíveis conforme descrito na Seção 5.6.2, “Obtenção de informações sobre funções carregáveis”.

* Instalar funções carregáveis
* Desinstalar funções carregáveis
* Reinstalar ou atualizar funções carregáveis

#### Instalação de Funções Carregáveis

Para carregar uma função carregável manualmente, use a declaração `CREATE FUNCTION`. Por exemplo:

```sql
CREATE FUNCTION metaphon
  RETURNS STRING
  SONAME 'udf_example.so';
```

O nome de base do arquivo depende da sua plataforma. Sufixos comuns são `.so` para Unix e sistemas semelhantes ao Unix, `.dll` para Windows.

`CREATE FUNCTION` tem esses efeitos:

* Carrega a função no servidor para torná-la disponível imediatamente.

* Registra a função na tabela de sistema `mysql.func` para torná-la persistente após reinicializações do servidor. Por essa razão, `CREATE FUNCTION` requer o privilégio `INSERT` para o banco de dados do sistema `mysql`.

O carregamento automático de funções carregáveis ocorre durante a sequência normal de inicialização do servidor. O servidor carrega as funções registradas na tabela `mysql.func`. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis.

#### Desinstalando funções carregáveis

Para remover uma função carregável, use a declaração `DROP FUNCTION`. Por exemplo:

```sql
DROP FUNCTION metaphon;
```

`DROP FUNCTION` tem esses efeitos:

* Descarrega a função para torná-la indisponível. * Remove a função da tabela do sistema `mysql.func`. Por esse motivo, `DROP FUNCTION` requer o privilégio do `DELETE` para o banco de dados do sistema `mysql`. Com a função não registrada mais na tabela `mysql.func`, o servidor não carrega a função durante os reinício subsequentes.

Enquanto uma função carregável está carregada, as informações sobre ela estão disponíveis na tabela do sistema `mysql.func`. Veja a Seção 5.6.2, “Obtenção de Informações sobre Funções Carregáveis”. `CREATE FUNCTION` adiciona a função à tabela e `DROP FUNCTION` a remove.

#### Reinstalação ou Atualização de Funções Carregáveis

Para reinstalar ou atualizar a biblioteca compartilhada associada a uma função carregável, emita uma declaração `DROP FUNCTION`, atualize a biblioteca compartilhada e, em seguida, emita uma declaração `CREATE FUNCTION`. Se você atualizar a biblioteca compartilhada primeiro e, em seguida, usar `DROP FUNCTION`, o servidor pode ser desligado inesperadamente.

### 5.6.2 Obter informações sobre funções carregáveis

A tabela do sistema `mysql.func` mostra quais funções carregáveis foram registradas usando `CREATE FUNCTION`:

```sql
SELECT * FROM mysql.func;
```

A tabela `func` tem essas colunas:

* `name`

O nome da função, conforme mencionado em declarações SQL.

* `ret`

O tipo do valor de retorno da função. Os valores permitidos são 0 (`STRING`), 1 (`REAL`), 2 (`INTEGER`), 3 (`ROW`), ou 4 (`DECIMAL`).

* `dl`

O nome do arquivo da biblioteca de funções que contém o código executável da função. O arquivo está localizado no diretório nomeado pela variável de sistema `plugin_dir`.

* `type`

O tipo de função, seja `function` (escalar) ou `aggregate`.

