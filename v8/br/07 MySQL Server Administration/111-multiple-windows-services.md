#### 7.8.2.2 Iniciar múltiplas instâncias do MySQL como serviços do Windows

No Windows, um servidor MySQL pode ser executado como um serviço do Windows. Os procedimentos para instalar, controlar e remover um único serviço MySQL são descritos na Seção 2.3.3.8, "Começando o MySQL como um Serviço do Windows".

Para configurar vários serviços MySQL, você deve certificar-se de que cada instância usa um nome de serviço diferente, além dos outros parâmetros que devem ser únicos por instância.

Para as seguintes instruções, suponha que você queira executar o servidor `mysqld` a partir de duas versões diferentes do MySQL que estão instaladas em `C:\mysql-5.7.9` e `C:\mysql-8.4.6`, respectivamente. (Este pode ser o caso se você estiver executando o 5.7.9 como seu servidor de produção, mas também quiser realizar testes usando o 8.4.6.)

Para instalar o MySQL como um serviço do Windows, use a opção `--install` ou `--install-manual`.

Com base nas informações precedentes, você tem várias maneiras de configurar vários serviços. As instruções a seguir descrevem alguns exemplos. Antes de tentar qualquer um deles, feche e remova todos os serviços MySQL existentes.

- \*\* Abordagem 1:\*\* Especifique as opções para todos os serviços em um dos arquivos de opções padrão. Para fazer isso, use um nome de serviço diferente para cada servidor. Suponha que você queira executar o 5.7.9 `mysqld` usando o nome de serviço de `mysqld1` e o 8.4.6 `mysqld` usando o nome de serviço de `mysqld2`. Neste caso, você pode usar o grupo `[mysqld1]` para o 5.7.9 e o grupo `[mysqld2]` para o 8.4. Por exemplo, você pode configurar `C:\my.cnf` assim:

  ```
  # options for mysqld1 service
  [mysqld1]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1

  # options for mysqld2 service
  [mysqld2]
  basedir = C:/mysql-8.4.6
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Instale os serviços da seguinte forma, usando os nomes completos do caminho do servidor para garantir que o Windows registre o programa executável correto para cada serviço:

  ```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
  ```

  Para iniciar os serviços, utilize o gestor de serviços, ou **NET START** ou **SC START** com os nomes de serviço apropriados:

  ```
  C:\> SC START mysqld1
  C:\> SC START mysqld2
  ```

  Para interromper os serviços, utilize o gestor de serviços, ou utilize **NET STOP** ou **SC STOP** com os nomes de serviço apropriados:

  ```
  C:\> SC STOP mysqld1
  C:\> SC STOP mysqld2
  ```
- \*\* Abordagem 2:\*\* Especifique opções para cada servidor em arquivos separados e use `--defaults-file` quando você instalar os serviços para dizer a cada servidor qual arquivo usar. Neste caso, cada arquivo deve listar opções usando um grupo `[mysqld]`.

  Com esta abordagem, para especificar opções para o 5.7.9 `mysqld`, crie um arquivo `C:\my-opts1.cnf` que se parece com este:

  ```
  [mysqld]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1
  ```

  Para o 8.4.6 `mysqld`, crie um arquivo `C:\my-opts2.cnf` que se parece com este:

  ```
  [mysqld]
  basedir = C:/mysql-8.4.6
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

  Instalar os serviços da seguinte forma (inserir cada comando numa única linha):

  ```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
             --defaults-file=C:\my-opts1.cnf
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
             --defaults-file=C:\my-opts2.cnf
  ```

  Quando você instala um servidor MySQL como um serviço e usa uma opção `--defaults-file`, o nome do serviço deve preceder a opção.

  Depois de instalar os serviços, inicie-os e pare-os da mesma forma que no exemplo anterior.

Para remover vários serviços, use **SC DELETE `mysqld_service_name`** para cada um. Alternativamente, use **mysqld --remove** para cada um, especificando um nome de serviço seguindo a opção `--remove`. Se o nome de serviço é o padrão (`MySQL`), você pode omiti-lo ao usar **mysqld --remove**.
