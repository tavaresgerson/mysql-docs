### 2.8.8 Lidar com problemas de compilação do MySQL

A solução para muitos problemas envolve reconfiguração.

- Se `CMake` é executado depois de ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Estas informações são armazenadas em `CMakeCache.txt`. Quando `CMake` é iniciado, ele procura por esse arquivo e lê seu conteúdo, se ele existe, supondo que as informações ainda estão corretas. Essa suposição é inválida quando você reconfigura.
- Cada vez que você executa `CMake`, você deve executar `make` novamente para recompilar. No entanto, você pode querer remover arquivos de objetos antigos de builds anteriores primeiro porque eles foram compilados usando opções de configuração diferentes.

Para evitar que arquivos de objetos antigos ou informações de configuração sejam usados, execute os seguintes comandos antes de re-executar `CMake`:

Em Unix:

```
$> make clean
$> rm CMakeCache.txt
```

Em Windows:

```
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Se você construir fora da árvore de origem, remova e recrie seu diretório de compilação antes de re-executar `CMake`.

Em alguns sistemas, avisos podem ocorrer devido a diferenças no sistema incluem arquivos. A lista a seguir descreve outros problemas que foram encontrados para ocorrer com mais frequência ao compilar MySQL:

- Para definir quais compiladores C e C++ usar, você pode definir as variáveis de ambiente `CC` e `CXX`.

  ```
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

  Embora isso possa ser feito na linha de comando, como mostrado, você pode preferir definir esses valores em um script de compilação, caso em que o comando `export` não é necessário.

  Para especificar suas próprias bandeiras do compilador C e C ++, use as opções de CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS`.

  Para ver quais bandeiras você pode precisar especificar, invoque `mysql_config` com as opções `--cflags` e `--cxxflags`.
- Para ver quais comandos são executados durante a fase de compilação, depois de usar `CMake` para configurar o MySQL, execute `make VERBOSE=1` em vez de apenas `make`.
- Se a compilação falhar, verifique se a opção `MYSQL_MAINTAINER_MODE` está habilitada. Este modo faz com que os avisos do compilador se tornem erros, então desativá-lo pode permitir que a compilação continue.
- Se sua compilação falhar com erros como qualquer um dos seguintes, você deve atualizar sua versão de `make` para `make` GNU:

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

  O Solaris e o FreeBSD são conhecidos por terem programas `make` problemáticos.

  O GNU `make` `3.75` é conhecido por funcionar.
- O arquivo `sql_yacc.cc` é gerado a partir do `sql_yacc.yy`. Normalmente, o processo de compilação não precisa criar o `sql_yacc.cc` porque o MySQL vem com uma cópia pré-gerada. No entanto, se você precisar recriá-lo, poderá encontrar este erro:

  ```
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

  Este é um sinal de que a sua versão do `yacc` é deficiente. Você provavelmente precisa instalar uma versão recente do `bison` (a versão GNU do `yacc`) e usá-la em vez disso.

  Versões de `bison` mais antigas do que 1.75 podem relatar este erro:

  ```
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

  O tamanho máximo da tabela não é realmente excedido; o erro é causado por bugs em versões mais antigas do `bison`.
