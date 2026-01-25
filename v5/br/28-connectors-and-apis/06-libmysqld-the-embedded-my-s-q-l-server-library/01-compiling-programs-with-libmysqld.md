### 27.6.1 Compilando Programs com libmysqld

Em distribuições binárias pré-compiladas do MySQL que incluem a `libmysqld`, a biblioteca do servidor embarcado (embedded server library), o MySQL constrói a library usando o compiler do fornecedor apropriado, se houver um.

Para obter uma `libmysqld` library se você construir o MySQL a partir do source (código-fonte), você deve configurar o MySQL com a option [`-DWITH_EMBEDDED_SERVER=1`](source-configuration-options.html#option_cmake_with_embedded_server). Consulte a [Seção 2.8.7, “Opções de Configuração do Source do MySQL”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

Ao fazer o link do seu program com `libmysqld`, você também deve incluir as `pthread` libraries específicas do sistema e algumas libraries que o MySQL server utiliza. Você pode obter a lista completa de libraries executando [**mysql_config --libmysqld-libs**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients").

Os flags corretos para compiling e linking de um threaded program devem ser usados, mesmo que você não chame diretamente nenhuma função de thread no seu code.

Para compilar um C program de modo a incluir os arquivos necessários para embarcar (embed) a MySQL server library em uma versão executable de um program, o compiler precisa saber onde encontrar vários arquivos e necessita de instruções sobre como compilar o program. O exemplo a seguir mostra como um program poderia ser compilado a partir da command line, assumindo que você está usando **gcc**, o GNU C compiler:

```sql
gcc mysql_test.c -o mysql_test \
`/usr/local/mysql/bin/mysql_config --include --libmysqld-libs`
```

Imediatamente após o **gcc** command está o nome do C program source file. Depois dele, a option `-o` é fornecida para indicar que o nome do arquivo que a segue é o nome que o compiler deve dar ao output file, o compiled program. A próxima linha de code instrui o compiler a obter a localização dos include files e libraries, e outras configurações para o sistema no qual ele está sendo compilado. O [**mysql_config**](mysql-config.html "4.7.1 mysql_config — Display Options for Compiling Clients") command é contido em *backticks*, e não em aspas simples.

Em algumas platforms que não utilizam **gcc**, a embedded library depende de C++ runtime libraries, e o linking contra a embedded library pode resultar em erros de símbolos ausentes (*missing-symbol errors*). Para resolver isso, faça o link usando um C++ compiler ou liste explicitamente as libraries necessárias na link command line.