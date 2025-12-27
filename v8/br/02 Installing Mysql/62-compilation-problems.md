### 2.8.8 Lidando com Problemas de Compilação do MySQL

A solução para muitos problemas envolve a reconfiguração. Se você fizer a reconfiguração, observe o seguinte:

* Se o `CMake` for executado após ter sido executado anteriormente, ele pode usar informações coletadas durante sua invocação anterior. Essas informações são armazenadas no `CMakeCache.txt`. Quando o `CMake` começa, ele procura esse arquivo e lê seu conteúdo, se existir, assumindo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.
* Cada vez que você executa o `CMake`, você deve executar `make` novamente para recompilar. No entanto, você pode querer remover arquivos de objeto antigos de construções anteriores primeiro, pois eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objeto antigos ou informações de configuração sejam usadas, execute os seguintes comandos antes de reexecutar o `CMake`:

No Unix:

```
$> make clean
$> rm CMakeCache.txt
```

No Windows:

```
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Se você construir fora da árvore de origem, remova e recrie seu diretório de construção antes de reexecutar o `CMake`.

Em alguns sistemas, podem ocorrer avisos devido a diferenças nos arquivos de inclusão do sistema. A lista a seguir descreve outros problemas que foram encontrados com mais frequência ao compilar o MySQL:

* Para definir quais compiladores C e C++ usar, você pode definir as variáveis de ambiente `CC` e `CXX`. Por exemplo:

  ```
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

  Embora isso possa ser feito na linha de comando, como mostrado acima, você pode preferir definir esses valores em um script de construção, caso em que o comando `export` não é necessário.

* Para especificar suas próprias flags de compilador C e C++, use as opções `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS` do `CMake`. Consulte  Flags de Compilador.

Para ver quais flags você pode precisar especificar, invocando `mysql_config` com as opções `--cflags` e `--cxxflags`.
* Para ver quais comandos são executados durante a fase de compilação, após usar o `CMake` para configurar o MySQL, execute `make VERBOSE=1` em vez de apenas `make`.
* Se a compilação falhar, verifique se a opção `MYSQL_MAINTAINER_MODE` está habilitada. Esse modo faz com que as avisos do compilador se tornem erros, então desabilitá-lo pode permitir que a compilação prossiga.
* Se sua compilação falhar com erros como qualquer um dos seguintes, você deve atualizar sua versão do `make` para o `make` do GNU:

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

  Sabe-se que o Solaris e o FreeBSD têm programas `make` problemáticos.

  O `make` do GNU `3.75` é conhecido por funcionar.
* O arquivo `sql_yacc.cc` é gerado a partir de `sql_yacc.yy`. Normalmente, o processo de construção não precisa criar `sql_yacc.cc` porque o MySQL vem com uma cópia pré-gerada. No entanto, se você precisar recriá-lo, você pode encontrar esse erro:

  ```
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

  Isso é um sinal de que sua versão do `yacc` é deficiente. Provavelmente, você precisa instalar uma versão recente do `bison` (a versão do GNU do `yacc`) e usá-la.

  Versões do `bison` mais antigas que 1.75 podem relatar esse erro:

  ```
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

  O tamanho máximo da tabela não é realmente excedido; o erro é causado por bugs em versões mais antigas do `bison`.