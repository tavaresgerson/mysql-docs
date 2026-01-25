#### B.3.2.11 Não é possível criar/escrever no arquivo

Se você receber um erro do tipo a seguir para algumas Queries, isso significa que o MySQL não consegue criar um arquivo temporário para o conjunto de resultados no diretório temporário:

```sql
Can't create/write to file '\\sqla3fe_0.ism'.
```

O erro anterior é uma mensagem típica para Windows; a mensagem Unix é semelhante.

Uma correção é iniciar o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com a opção [`--tmpdir`](server-options.html#option_mysqld_tmpdir) ou adicionar a opção à seção `[mysqld]` do seu arquivo de opções. Por exemplo, para especificar um diretório `C:\temp`, use estas linhas:

```sql
[mysqld]
tmpdir=C:/temp
```

O diretório `C:\temp` deve existir e ter espaço suficiente para o MySQL Server poder escrever. Veja [Seção 4.2.2.2, “Usando Arquivos de Opções”](option-files.html "4.2.2.2 Using Option Files").

Outra causa deste erro pode ser problemas de permissão. Certifique-se de que o MySQL Server pode escrever no diretório [`tmpdir`](server-system-variables.html#sysvar_tmpdir).

Verifique também o código de erro que você recebe com o [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information"). Uma razão pela qual o Server não pode escrever em uma table é que o file system (sistema de arquivos) está cheio:

```sql
$> perror 28
OS error code  28:  No space left on device
```

Se você receber um erro do tipo a seguir durante a inicialização, isso indica que o file system ou diretório usado para armazenar arquivos de dados está protegido contra escrita. Se o erro de escrita for em um arquivo de teste, o erro não é grave e pode ser ignorado com segurança.

```sql
Can't create test file /usr/local/mysql/data/master.lower-test
```