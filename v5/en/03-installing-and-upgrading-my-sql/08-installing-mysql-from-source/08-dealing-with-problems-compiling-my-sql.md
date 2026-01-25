### 2.8.8 Lidando com Problemas na Compilação do MySQL

A solução para muitos problemas envolve a reconfiguração. Se você reconfigurar, observe o seguinte:

*   Se o **CMake** for executado após ter sido executado anteriormente, ele pode usar informações que foram coletadas durante sua invocação anterior. Essa informação é armazenada em `CMakeCache.txt`. Quando o **CMake** inicia, ele procura por esse arquivo e lê seu conteúdo, se existir, sob a suposição de que a informação ainda está correta. Essa suposição é inválida quando você reconfigura.

*   Toda vez que você executa o **CMake**, você deve executar o **make** novamente para recompile. No entanto, você pode querer remover object files antigos de builds anteriores primeiro, porque eles foram compilados usando opções de configuration diferentes.

Para evitar que object files antigos ou informações de configuration sejam usados, execute os seguintes comandos antes de re-executar o **CMake**:

No Unix:

```sql
$> make clean
$> rm CMakeCache.txt
```

No Windows:

```sql
$> devenv MySQL.sln /clean
$> del CMakeCache.txt
```

Se você fizer o build fora da source tree (árvore de código-fonte), remova e recrie seu build directory (diretório de build) antes de re-executar o **CMake**. Para instruções sobre como fazer o build fora da source tree, consulte Como Fazer o Build do MySQL Server com CMake.

Em alguns sistemas, warnings (avisos) podem ocorrer devido a diferenças nos arquivos include do sistema. A lista a seguir descreve outros problemas que foram encontrados com mais frequência ao compilar o MySQL:

*   Para definir quais C e C++ compilers usar, você pode definir as variáveis de ambiente `CC` e `CXX`. Por exemplo:

    ```sql
  $> CC=gcc
  $> CXX=g++
  $> export CC CXX
  ```

    Embora isso possa ser feito na linha de comando, como mostrado, você pode preferir definir esses valores em um script de build, caso em que o comando **export** não é necessário.

    Para especificar suas próprias C e C++ compiler flags, use as opções do CMake `CMAKE_C_FLAGS` e `CMAKE_CXX_FLAGS`. Consulte Compiler Flags.

    Para ver quais flags você pode precisar especificar, invoque o **mysql_config** com as opções `--cflags` e `--cxxflags`.

*   Para ver quais comandos são executados durante o estágio de compile, após usar o **CMake** para configurar o MySQL, execute **make VERBOSE=1** em vez de apenas **make**.

*   Se a compilation falhar, verifique se a opção `MYSQL_MAINTAINER_MODE` está habilitada. Este mode faz com que os compiler warnings se tornem errors, portanto, desabilitá-lo pode permitir que a compilation prossiga.

*   Se a sua compile falhar com errors como qualquer um dos seguintes, você deve atualizar sua versão do **make** para o GNU **make**:

    ```sql
  make: Fatal error in reader: Makefile, line 18:
  Badly formed macro assignment
  ```

    Ou:

    ```sql
  make: file `Makefile' line 18: Must be a separator (:
  ```

    Ou:

    ```sql
  pthread.h: No such file or directory
  ```

    Solaris e FreeBSD são conhecidos por terem programas **make** problemáticos.

    O GNU **make** 3.75 é conhecido por funcionar.

*   O arquivo `sql_yacc.cc` é gerado a partir de `sql_yacc.yy`. Normalmente, o processo de build não precisa criar `sql_yacc.cc` porque o MySQL vem com uma cópia pré-gerada. No entanto, se você precisar recriá-lo, poderá encontrar este error:

    ```sql
  "sql_yacc.yy", line xxx fatal: default action causes potential...
  ```

    Este é um sinal de que sua versão do **yacc** é deficiente. Você provavelmente precisa instalar uma versão recente do **bison** (a versão GNU do **yacc**) e usar essa em vez disso.

    Versões do **bison** anteriores a 1.75 podem relatar este error:

    ```sql
  sql_yacc.yy:#####: fatal error: maximum table size (32767) exceeded
  ```

    O tamanho máximo da tabela não é realmente excedido; o error é causado por bugs em versões mais antigas do **bison**.

Para informações sobre a aquisição ou atualização de ferramentas, consulte os requisitos de sistema na Seção 2.8, “Instalando MySQL a Partir do Código-Fonte (Source)”.