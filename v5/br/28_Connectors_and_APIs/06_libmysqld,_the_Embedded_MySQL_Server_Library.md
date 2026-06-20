## 27.6 libmysqld, a Biblioteca do Servidor MySQL Integrado

A biblioteca de servidor MySQL embutida permite executar um servidor MySQL completo dentro de uma aplicação cliente. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações embutidas.

Nota

A biblioteca de servidor embutida `libmysqld` é descontinuada a partir do MySQL 5.7.19 e é removida no MySQL 8.0.

A biblioteca de servidor embutida é baseada na versão cliente/servidor do MySQL, que é escrita em C/C++. Consequentemente, o servidor embutido também é escrito em C/C++. Não há servidor embutido disponível em outros idiomas.

A API é idêntica para a versão MySQL embutida e para a versão cliente/servidor. Para alterar uma aplicação com suporte a múltiplos fios para usar a biblioteca embutida, normalmente você só precisa adicionar chamadas às seguintes funções.

**Tabela 27.2 Funções da Biblioteca de Servidor Integrado MySQL**

<table summary="MySQL embedded server library functions and descriptions of when the functions should be called."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th><p> Function </p></th> <th><p>Quando ligar</p></th> </tr></thead><tbody><tr> <td><p> <code>mysql_library_init()</code> </p></td> <td><p>Chame antes de qualquer outra função MySQL ser chamada, de preferência no início do script.<code>main()</code> function. </p></td> </tr><tr> <td><p> <code>mysql_library_end()</code> </p></td> <td><p>Chame-o antes de seu programa sair.</p></td> </tr><tr> <td><p> <code>mysql_thread_init()</code> </p></td> <td><p>Chame-o em cada thread que você criar e que acesse o MySQL.</p></td> </tr><tr> <td><code>mysql_thread_end()</code></td> <td>Chame antes de chamar<code>pthread_exit()</code>.</td> </tr></tbody></table>

Em seguida, vincule seu código com `libmysqld.a` em vez de `libmysqlclient.a`. Para garantir a compatibilidade binária entre sua aplicação e a biblioteca do servidor, sempre compile sua aplicação contra cabeçalhos para a mesma série de MySQL que foi usada para compilar a biblioteca do servidor. Por exemplo, se `libmysqld` foi compilado contra os cabeçalhos do MySQL 5.6, não compile sua aplicação contra os cabeçalhos do MySQL 5.7, ou vice-versa.

Como as funções do `mysql_library_xxx()` também estão incluídas no `libmysqlclient.a`, você pode alternar entre a versão integrada e a versão cliente/servidor, simplesmente vinculando sua aplicação com a biblioteca correta. Veja mysql\_library\_init().

Uma diferença entre o servidor integrado e o servidor autônomo é que, para o servidor integrado, a autenticação para conexões é desativada por padrão.

### 27.6.1 Compilando programas com libmysqld

Em distribuições binárias pré-compiladas do MySQL que incluem `libmysqld`, a biblioteca do servidor integrada, o MySQL constrói a biblioteca usando o compilador do fornecedor apropriado, se houver um.

Para obter uma biblioteca `libmysqld` se você construir o MySQL a partir do código fonte, você deve configurar o MySQL com a opção `-DWITH_EMBEDDED_SERVER=1`. Veja a Seção 2.8.7, “Opções de Configuração de Código Fonte do MySQL”.

Quando você vincula seu programa com `libmysqld`, também deve incluir as bibliotecas específicas do sistema `pthread` e algumas bibliotecas que o servidor MySQL usa. Você pode obter a lista completa das bibliotecas executando **mysql\_config --libmysqld-libs**.

As flags corretas para a compilação e vinculação de um programa com múltiplos fios devem ser usadas, mesmo que você não chame diretamente nenhuma função de fio em seu código.

Para compilar um programa em C que inclua os arquivos necessários para incorporar a biblioteca do servidor MySQL em uma versão executável de um programa, o compilador precisa saber onde encontrar vários arquivos e precisa de instruções sobre como compilar o programa. O exemplo a seguir mostra como um programa pode ser compilado a partir da linha de comando, assumindo que você está usando o **gcc**, use o compilador GNU C:

```sql
gcc mysql_test.c -o mysql_test \
`/usr/local/mysql/bin/mysql_config --include --libmysqld-libs`
```

Imediatamente após o comando **gcc**, vem o nome do arquivo fonte do programa C. Depois disso, a opção `-o` é dada para indicar que o nome do arquivo que segue é o nome que o compilador deve dar ao arquivo de saída, o programa compilado. A próxima linha de código diz ao compilador para obter a localização dos arquivos de inclusão e bibliotecas e outras configurações para o sistema em que ele é compilado. O comando **mysql\_config** está contido em barras duplas, não em aspas simples.

Em algumas plataformas que não são do **gcc**, a biblioteca embutida depende das bibliotecas de tempo de execução do C++, e a vinculação contra a biblioteca embutida pode resultar em erros de símbolo ausente. Para resolver isso, vincule usando um compilador de C++ ou liste explicitamente as bibliotecas necessárias na linha de comando de vinculação.

### 27.6.2 Restrições ao uso do servidor MySQL integrado

O servidor incorporado tem as seguintes limitações:

* Nenhuma função carregável. * Nenhum rastreamento de pilha no core dump. * Não é possível configurá-lo como uma fonte ou uma réplica (sem replicação).

* Conjuntos de resultados muito grandes podem não ser utilizáveis em sistemas com memória insuficiente. * Não é possível conectar-se a um servidor incorporado a partir de um processo externo com soquetes ou TCP/IP. No entanto, é possível conectar-se a uma aplicação intermediária, que, por sua vez, pode conectar-se a um servidor incorporado em nome de um cliente remoto ou de um processo externo.

* `libmysqld` não suporta conexões criptografadas. Uma implicação é que, se um aplicativo vinculado contra `libmysqld` estabelece uma conexão com um servidor remoto, a conexão não pode ser criptografada.

* `InnoDB` não é reentrante no servidor embutido e não pode ser usado para múltiplas conexões, sequencialmente ou simultaneamente.

* O Agendamento de Eventos não está disponível. Por isso, a variável de sistema `event_scheduler` está desativada.

* O Schema de Desempenho não está disponível. * O servidor incorporado não pode compartilhar o mesmo diretório `secure_file_priv` com outro servidor. A partir do MySQL 5.7.8, o valor padrão para este diretório pode ser definido na fase de construção com a opção `INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR` **CMake**.

Algumas dessas limitações podem ser alteradas editando o arquivo `mysql_embed.h` e recompilando o MySQL.

### 27.6.3 Opções com o Servidor Integrado

Quaisquer opções que possam ser fornecidas com o daemon do servidor `mysqld` podem ser usadas com uma biblioteca de servidor embutida. As opções do servidor podem ser fornecidas em um array como argumento para o `mysql_library_init()`, que inicializa o servidor. Elas também podem ser fornecidas em um arquivo de opção como `my.cnf`. Para especificar um arquivo de opção para um programa em C, use a opção `--defaults-file` como um dos elementos do segundo argumento da função `mysql_library_init()`. Consulte mysql\_library\_init(), para obter mais informações sobre a função `mysql_library_init()`.

Usar arquivos de opções pode facilitar a alternância entre uma aplicação cliente/servidor e uma em que o MySQL está embutido. Coloque opções comuns sob o grupo `[server]`. Essas são lidas por ambas as versões do MySQL. Opções específicas para cliente/servidor devem ir sob a seção `[mysqld]`. Coloque opções específicas para a biblioteca do servidor MySQL embutida na seção `[embedded]`. Opções específicas para aplicativos devem ir sob a seção rotulada `[ApplicationName_SERVER]`. Veja a Seção 4.2.2.2, “Usando arquivos de opções”.

### 27.6.4 Exemplos de servidor embutido

Esses dois programas de exemplo devem funcionar sem qualquer alteração em um sistema Linux ou FreeBSD. Para outros sistemas operacionais, são necessárias pequenas alterações, principalmente com caminhos de arquivos. Esses exemplos são projetados para fornecer detalhes suficientes para que você entenda o problema, sem a confusão que é uma parte necessária de uma aplicação real. O primeiro exemplo é muito simples. O segundo exemplo é um pouco mais avançado, com algumas verificações de erros. O primeiro é seguido por uma entrada de linha de comando para compilar o programa. O segundo é seguido por um arquivo GNUmake que pode ser usado para compilar em vez disso.

**Exemplo 1**

`test1_libmysqld.c`

```sql
#include <stdio.h>
#include <stdlib.h>
#include <stdarg.h>
#include "mysql.h"

MYSQL *mysql;
MYSQL_RES *results;
MYSQL_ROW record;

static char *server_options[] = \
       { "mysql_test", "--defaults-file=my.cnf", NULL };
int num_elements = (sizeof(server_options) / sizeof(char *)) - 1;

static char *server_groups[] = { "libmysqld_server",
                                 "libmysqld_client", NULL };

int main(void)
{
   mysql_library_init(num_elements, server_options, server_groups);
   mysql = mysql_init(NULL);
   mysql_options(mysql, MYSQL_READ_DEFAULT_GROUP, "libmysqld_client");
   mysql_options(mysql, MYSQL_OPT_USE_EMBEDDED_CONNECTION, NULL);

   mysql_real_connect(mysql, NULL,NULL,NULL, "database1", 0,NULL,0);

   mysql_query(mysql, "SELECT column1, column2 FROM table1");

   results = mysql_store_result(mysql);

   while((record = mysql_fetch_row(results))) {
      printf("%s - %s \n", record[0], record[1]);
   }

   mysql_free_result(results);
   mysql_close(mysql);
   mysql_library_end();

   return 0;
}
```

Aqui está o comando de linha para compilar o programa acima:

```sql
gcc test1_libmysqld.c -o test1_libmysqld \
 `/usr/local/mysql/bin/mysql_config --include --libmysqld-libs`
```

**Exemplo 2**

Para testar o exemplo, crie um diretório `test2_libmysqld` no mesmo nível do diretório de origem do MySQL. Salve a fonte `test2_libmysqld.c` e a fonte `GNUmakefile` no diretório e execute o GNU `make` a partir do diretório `test2_libmysqld`.

`test2_libmysqld.c`

```sql
/*
 * A simple example client, using the embedded MySQL server library
*/

#include <mysql.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>

MYSQL *db_connect(const char *dbname);
void db_disconnect(MYSQL *db);
void db_do_query(MYSQL *db, const char *query);

const char *server_groups[] = {
  "test2_libmysqld_SERVER", "embedded", "server", NULL
};

int
main(int argc, char **argv)
{
  MYSQL *one, *two;

  /* mysql_library_init() must be called before any other mysql
   * functions.
   *
   * You can use mysql_library_init(0, NULL, NULL), and it
   * initializes the server using groups = {
   *   "server", "embedded", NULL
   *  }.
   *
   * In your $HOME/.my.cnf file, you probably want to put:

[test2_libmysqld_SERVER]
language = /path/to/source/of/mysql/sql/share/english

   * You could, of course, modify argc and argv before passing
   * them to this function.  Or you could create new ones in any
   * way you like.  But all of the arguments in argv (except for
   * argv[0], which is the program name) should be valid options
   * for the MySQL server.
   *
   * If you link this client against the normal mysqlclient
   * library, this function is just a stub that does nothing.
   */
  mysql_library_init(argc, argv, (char **)server_groups);

  one = db_connect("test");
  two = db_connect(NULL);

  db_do_query(one, "SHOW TABLE STATUS");
  db_do_query(two, "SHOW DATABASES");

  mysql_close(two);
  mysql_close(one);

  /* This must be called after all other mysql functions */
  mysql_library_end();

  exit(EXIT_SUCCESS);
}

static void
die(MYSQL *db, char *fmt, ...)
{
  va_list ap;
  va_start(ap, fmt);
  vfprintf(stderr, fmt, ap);
  va_end(ap);
  (void)putc('\n', stderr);
  if (db)
    db_disconnect(db);
  exit(EXIT_FAILURE);
}

MYSQL *
db_connect(const char *dbname)
{
  MYSQL *db = mysql_init(NULL);
  if (!db)
    die(db, "mysql_init failed: no memory");
  /*
   * Notice that the client and server use separate group names.
   * This is critical, because the server does not accept the
   * client's options, and vice versa.
   */
  mysql_options(db, MYSQL_READ_DEFAULT_GROUP, "test2_libmysqld_CLIENT");
  if (!mysql_real_connect(db, NULL, NULL, NULL, dbname, 0, NULL, 0))
    die(db, "mysql_real_connect failed: %s", mysql_error(db));

  return db;
}

void
db_disconnect(MYSQL *db)
{
  mysql_close(db);
}

void
db_do_query(MYSQL *db, const char *query)
{
  if (mysql_query(db, query) != 0)
    goto err;

  if (mysql_field_count(db) > 0)
  {
    MYSQL_RES   *res;
    MYSQL_ROW    row, end_row;
    int num_fields;

    if (!(res = mysql_store_result(db)))
      goto err;
    num_fields = mysql_num_fields(res);
    while ((row = mysql_fetch_row(res)))
    {
      (void)fputs(">> ", stdout);
      for (end_row = row + num_fields; row < end_row; ++row)
        (void)printf("%s\t", row ? (char*)*row : "NULL");
      (void)fputc('\n', stdout);
    }
    (void)fputc('\n', stdout);
    mysql_free_result(res);
  }
  else
    (void)printf("Affected rows: %lld\n", mysql_affected_rows(db));

  return;

err:
  die(db, "db_do_query failed: %s [%s]", mysql_error(db), query);
}
```

`GNUmakefile`

```sql
# This assumes the MySQL software is installed in /usr/local/mysql
inc      := /usr/local/mysql/include/mysql
lib      := /usr/local/mysql/lib

# If you have not installed the MySQL software yet, try this instead
#inc      := $(HOME)/mysql-5.7/include
#lib      := $(HOME)/mysql-5.7/libmysqld

CC       := gcc
CPPFLAGS := -I$(inc) -D_THREAD_SAFE -D_REENTRANT
CFLAGS   := -g -W -Wall
LDFLAGS  := -static
# You can change -lmysqld to -lmysqlclient to use the
# client/server library
LDLIBS    = -L$(lib) -lmysqld -lm -ldl -lcrypt

ifneq (,$(shell grep FreeBSD /COPYRIGHT 2>/dev/null))
# FreeBSD
LDFLAGS += -pthread
else
# Assume Linux
LDLIBS += -lpthread
endif

# This works for simple one-file test programs
sources := $(wildcard *.c)
objects := $(patsubst %c,%o,$(sources))
targets := $(basename $(sources))

all: $(targets)

clean:
        rm -f $(targets) $(objects) *.core
```
