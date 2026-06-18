#### B.3.3.6 Como proteger ou alterar o arquivo de soquete Unix do MySQL

O local padrão para o arquivo de soquete Unix que o servidor usa para comunicação com clientes locais é `/tmp/mysql.sock`. (Para alguns formatos de distribuição, o diretório pode ser diferente, como `/var/lib/mysql` para RPMs.)

Em algumas versões do Unix, qualquer pessoa pode excluir arquivos no diretório `/tmp` ou em outros diretórios semelhantes usados para arquivos temporários. Se o arquivo de soquete estiver localizado em um desses diretórios no seu sistema, isso pode causar problemas.

Na maioria das versões do Unix, você pode proteger o diretório `/tmp` para que os arquivos só possam ser excluídos pelos seus proprietários ou pelo superusuário (`root`). Para fazer isso, defina o bit `sticky` no diretório `/tmp` fazendo login como `root` e usando o seguinte comando:

```
$> chmod +t /tmp
```

Você pode verificar se o bit `sticky` está definido executando `ls -ld /tmp`. Se o último caractere de permissão for `t`, o bit está definido.

Outra abordagem é alterar o local onde o servidor cria o arquivo de soquete Unix. Se você fizer isso, também deve informar aos programas cliente a nova localização do arquivo. Você pode especificar a localização do arquivo de várias maneiras:

- Especifique o caminho em um arquivo de opção local ou global. Por exemplo, coloque as seguintes linhas em `/etc/my.cnf`:

  ```
  [mysqld]
  socket=/path/to/socket

  [client]
  socket=/path/to/socket
  ```

  Consulte a Seção 6.2.2.2, “Usando arquivos de opção”.

- Especifique uma opção `--socket` na linha de comando para o **mysqld\_safe** e quando você executar programas de cliente.

- Defina a variável de ambiente `MYSQL_UNIX_PORT` para o caminho do arquivo de soquete Unix.

- Reconcompile o MySQL a partir da fonte para usar um local de arquivo de soquete Unix padrão diferente. Defina o caminho para o arquivo com a opção `MYSQL_UNIX_ADDR` quando você executar o **CMake**. Veja a Seção 2.8.7, “Opções de Configuração de Código Fonte do MySQL”.

Você pode testar se a nova localização do soquete funciona tentando se conectar ao servidor com este comando:

```
$> mysqladmin --socket=/path/to/socket version
```
