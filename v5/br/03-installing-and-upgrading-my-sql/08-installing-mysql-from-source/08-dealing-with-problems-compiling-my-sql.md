### 2.8.8 Lidando com problemas de compilação do MySQL

A solução para muitos problemas envolve a recarga. Se você recarregar, observe o seguinte:

- Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações coletadas durante sua invocação anterior. Essas informações são armazenadas no `CMakeCache.txt`. Quando o **CMake** começa, ele procura esse arquivo e lê seu conteúdo, se ele existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.

- Cada vez que você executar o **CMake**, você deve executar novamente o **make** para recompilar. No entanto, você pode querer remover os arquivos de objeto antigos de construções anteriores primeiro, pois eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usados, execute os seguintes comandos antes de executar novamente o **CMake**:

No Unix:

```shell
$> make clean
$> rm CMakeCache.txt
```

No Windows:

```shell
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Se você estiver construindo fora da árvore de origem, remova e recree seu diretório de construção antes de executar novamente o **CMake**. Para obter instruções sobre como construir fora da árvore de origem, consulte Como construir o MySQL Server com CMake.

Em alguns sistemas, podem ocorrer avisos devido a diferenças nos arquivos de inclusão do sistema. A lista a seguir descreve outros problemas que foram encontrados com maior frequência ao compilar o MySQL:

- Para definir quais compiladores C e C++ usar, você pode definir as variáveis de ambiente `CC` e `CXX`. Por exemplo:

  ```shell
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

  Embora isso possa ser feito na linha de comando, como foi demonstrado, você pode preferir definir esses valores em um script de construção, nesse caso, o comando **export** não é necessário.

  Para especificar suas próprias flags do compilador C e C++, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do CMake. Veja Flags do compilador.

  Para ver quais flags você pode precisar especificar, invocando **mysql\_config** com as opções `--cflags` e `--cxxflags`.

- Para ver quais comandos são executados durante a fase de compilação, após usar o **CMake** para configurar o MySQL, execute **make VERBOSE=1** em vez de apenas **make**.

- Se a compilação falhar, verifique se a opção `MYSQL_MAINTAINER_MODE` está habilitada. Esse modo faz com que os avisos do compilador se tornem erros, então desabilitá-lo pode permitir que a compilação prossiga.

- Se a compilação falhar com erros como qualquer um dos seguintes, você deve atualizar sua versão do **make** para o **make** do GNU:

  ```
  make: Fatal error in reader: Makefile, line 18:
  Badly formed macro assignment
  ```

  Ou:

  ```
  make: file `Makefile' line 18: Must be a separator (:
  ```

  Ou:

  ```
  pthread.h: No such file or directory
  ```

  Sabe-se que o Solaris e o FreeBSD têm programas **make** problemáticos.

  O GNU **make** 3.75 é conhecido por funcionar.

- O arquivo `sql_yacc.cc` é gerado a partir do `sql_yacc.yy`. Normalmente, o processo de compilação não precisa criar `sql_yacc.cc` porque o MySQL vem com uma cópia pré-gerada. No entanto, se você precisar recriá-lo, você pode encontrar esse erro:

  ```
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

  Isso é um sinal de que sua versão do **yacc** está incompleta. Provavelmente, você precisa instalar uma versão recente do **bison** (a versão GNU do **yacc**) e usá-la em vez disso.

  Versões do **bison** mais antigas que 1,75 podem apresentar esse erro:

  ```
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

  O tamanho máximo da tabela não é realmente ultrapassado; o erro é causado por bugs em versões mais antigas do **bison**.

Para obter informações sobre como adquirir ou atualizar ferramentas, consulte os requisitos do sistema na Seção 2.8, “Instalando o MySQL a partir da fonte”.
