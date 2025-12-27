#### 7.8.2.2 Iniciar múltiplas instâncias do MySQL como serviços do Windows

No Windows, um servidor MySQL pode ser executado como um serviço do Windows. Os procedimentos para instalar, controlar e remover um único serviço MySQL estão descritos na Seção 2.3.3.8, “Iniciar o MySQL como um serviço do Windows”.

Para configurar múltiplos serviços MySQL, você deve garantir que cada instância use um nome de serviço diferente, além dos outros parâmetros que devem ser únicos por instância.

Para as instruções a seguir, suponha que você queira executar o servidor `mysqld` de duas versões diferentes do MySQL instaladas em `C:\mysql-5.7.9` e `C:\mysql-8.4.6`, respectivamente. (Isso pode ser o caso se você estiver executando 5.7.9 como seu servidor de produção, mas também quiser realizar testes usando 8.4.6.)

Para instalar o MySQL como um serviço do Windows, use a opção `--install` ou `--install-manual`. Para obter informações sobre essas opções, consulte a Seção 2.3.3.8, “Iniciar o MySQL como um serviço do Windows”.

Com base nas informações anteriores, você tem várias maneiras de configurar múltiplos serviços. As instruções a seguir descrevem alguns exemplos. Antes de tentar qualquer um deles, desligue e remova quaisquer serviços MySQL existentes.

* **Abordagem 1:** Especifique as opções para todos os serviços em um dos arquivos de opção padrão. Para fazer isso, use um nome de serviço diferente para cada servidor. Suponha que você queira executar o `mysqld` de 5.7.9 usando o nome de serviço `mysqld1` e o `mysqld` de 8.4.6 usando o nome de serviço `mysqld2`. Neste caso, você pode usar o grupo `[mysqld1]` para 5.7.9 e o grupo `[mysqld2]` para 8.4.6. Por exemplo, você pode configurar `C:\my.cnf` assim:

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

  Instale os serviços da seguinte forma, usando os nomes completos dos caminhos do servidor para garantir que o Windows registre o programa executável correto para cada serviço:

  ```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
  ```

  Para iniciar os serviços, use o gerenciador de serviços, ou `NET START` ou `SC START` com os nomes de serviço apropriados:

  ```
  C:\> SC START mysqld1
  C:\> SC START mysqld2
  ```

Para interromper os serviços, use o gerenciador de serviços ou use `NET STOP` ou `SC STOP` com os nomes de serviço apropriados:

```
  C:\> SC STOP mysqld1
  C:\> SC STOP mysqld2
  ```
* **Abordagem 2:** Especifique opções para cada servidor em arquivos separados e use `--defaults-file` ao instalar os serviços para indicar a cada servidor qual arquivo usar. Neste caso, cada arquivo deve listar opções usando um grupo `[mysqld]`.

Com esta abordagem, para especificar opções para o `mysqld` 5.7.9, crie um arquivo `C:\my-opts1.cnf` que tenha a seguinte aparência:

```
  [mysqld]
  basedir = C:/mysql-5.7.9
  port = 3307
  enable-named-pipe
  socket = mypipe1
  ```

Para o `mysqld` 8.4.6, crie um arquivo `C:\my-opts2.cnf` que tenha a seguinte aparência:

```
  [mysqld]
  basedir = C:/mysql-8.4.6
  port = 3308
  enable-named-pipe
  socket = mypipe2
  ```

Instale os serviços da seguinte forma (entre cada comando em uma única linha):

```
  C:\> C:\mysql-5.7.9\bin\mysqld --install mysqld1
             --defaults-file=C:\my-opts1.cnf
  C:\> C:\mysql-8.4.6\bin\mysqld --install mysqld2
             --defaults-file=C:\my-opts2.cnf
  ```

Quando você instala um servidor MySQL como serviço e usa a opção `--defaults-file`, o nome do serviço deve preceder a opção.

Após instalar os serviços, inicie e interrompa-os da mesma maneira que no exemplo anterior.

Para remover vários serviços, use `SC DELETE mysqld_service_name` para cada um. Alternativamente, use `mysqld --remove` para cada um, especificando um nome de serviço após a opção `--remove`. Se o nome do serviço for o padrão (`MySQL`), você pode omiti-lo ao usar `mysqld --remove`.