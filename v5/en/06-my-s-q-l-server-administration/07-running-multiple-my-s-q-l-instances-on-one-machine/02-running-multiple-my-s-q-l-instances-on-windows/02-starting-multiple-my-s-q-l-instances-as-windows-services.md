#### 5.7.2.2 Iniciando Múltiplas Instâncias MySQL como Windows Services

No Windows, um MySQL server pode rodar como um Windows service. Os procedimentos para instalar, controlar e remover um único MySQL service estão descritos na [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Iniciando o MySQL como um Windows Service").

Para configurar múltiplos MySQL services, você deve garantir que cada instance utilize um service name diferente, além dos outros parâmetros que devem ser únicos por instance.

Para as instruções a seguir, suponha que você queira rodar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server a partir de duas versões diferentes do MySQL que estão instaladas em `C:\mysql-5.7.9` e `C:\mysql-5.7.44`, respectivamente. (Este pode ser o caso se você estiver rodando a versão 5.7.9 como seu production server, mas também desejar conduzir testes usando a 5.7.44.)

Para instalar o MySQL como um Windows service, use as opções `--install` ou `--install-manual`. Para informações sobre estas options, consulte a [Seção 2.3.4.8, “Iniciando o MySQL como um Windows Service”](windows-start-service.html "2.3.4.8 Iniciando o MySQL como um Windows Service").

Com base nas informações precedentes, você tem várias maneiras de configurar múltiplos services. As instruções a seguir descrevem alguns exemplos. Antes de tentar qualquer um deles, desligue e remova quaisquer MySQL services existentes.

* **Abordagem 1:** Especifique as options para todos os services em um dos option files padrão. Para fazer isso, use um service name diferente para cada server. Suponha que você queira rodar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") 5.7.9 usando o service name `mysqld1` e o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") 5.7.44 usando o service name `mysqld2`. Neste caso, você pode usar o group `[mysqld1]` para o 5.7.9 e o group `[mysqld2]` para o 5.7.44. Por exemplo, você pode configurar o `C:\my.cnf` desta forma:

  ```sql
  # options for mysqld1 service
  [mysqld1]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1

  # options for mysqld2 service
  [mysqld2]
  basedir = C:/mysql-5.7.44
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Instale os services da seguinte forma, usando os path names completos do server para garantir que o Windows registre o programa executável correto para cada service:

  ```sql
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
  C:\> C:\mysql-5.7.44\bin\mysqld --install mysqld2
  ```

  Para iniciar os services, use o gerenciador de services, ou **NET START** ou **SC START** com os service names apropriados:

  ```sql
  C:\> SC START mysqld1
  C:\> SC START mysqld2
  ```

  Para parar os services, use o gerenciador de services, ou use **NET STOP** ou **SC STOP** com os service names apropriados:

  ```sql
  C:\> SC STOP mysqld1
  C:\> SC STOP mysqld2
  ```

* **Abordagem 2:** Especifique options para cada server em files separados e use [`--defaults-file`](option-file-options.html#option_general_defaults-file) ao instalar os services para informar a cada server qual file usar. Neste caso, cada file deve listar as options usando um group `[mysqld]`.

  Com esta abordagem, para especificar options para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") 5.7.9, crie um file `C:\my-opts1.cnf` com a seguinte aparência:

  ```sql
  [mysqld]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1
  ```

  Para o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") 5.7.44, crie um file `C:\my-opts2.cnf` com a seguinte aparência:

  ```sql
  [mysqld]
  basedir = C:/mysql-5.7.44
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Instale os services da seguinte forma (digite cada comando em uma única linha):

  ```sql
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
             --defaults-file=C:\my-opts1.cnf
  C:\> C:\mysql-5.7.44\bin\mysqld --install mysqld2
             --defaults-file=C:\my-opts2.cnf
  ```

  Quando você instala um MySQL server como um service e usa a option [`--defaults-file`](option-file-options.html#option_general_defaults-file), o service name deve preceder a option.

  Após instalar os services, inicie e pare-os da mesma forma que no exemplo precedente.

Para remover múltiplos services, use **SC DELETE *`mysqld_service_name`*** para cada um. Alternativamente, use [**mysqld --remove**](mysqld.html "4.3.1 mysqld — The MySQL Server") para cada um, especificando um service name após a option [`--remove`](server-options.html#option_mysqld_remove). Se o service name for o padrão (`MySQL`), você pode omiti-lo ao usar [**mysqld --remove**](mysqld.html "4.3.1 mysqld — The MySQL Server").