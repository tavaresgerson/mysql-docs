#### B.3.2.11 Não é possível criar/escrever no arquivo

Se você receber um erro do tipo seguinte para algumas consultas, isso significa que o MySQL não consegue criar um arquivo temporário para o conjunto de resultados no diretório temporário:

```sql
Can't create/write to file '\\sqla3fe_0.ism'.
```

O erro anterior é uma mensagem típica do Windows; a mensagem do Unix é semelhante.

Uma solução é iniciar o [**mysqld**](mysqld.html) com a opção `--tmpdir` ou adicionar a opção à seção `[mysqld]` do seu arquivo de opções. Por exemplo, para especificar um diretório de `C:\temp`, use as seguintes linhas:

```sql
[mysqld]
tmpdir=C:/temp
```

O diretório `C:\temp` deve existir e ter espaço suficiente para o servidor MySQL escrever. Consulte [Seção 4.2.2.2, “Usando arquivos de opção”](option-files.html).

Outra causa desse erro pode ser problemas de permissões. Certifique-se de que o servidor MySQL possa gravar no diretório [`tmpdir`](server-system-variables.html#sysvar_tmpdir).

Verifique também o código de erro que você obtém com [**perror**](perror.html). Uma das razões pelas quais o servidor não pode escrever em uma tabela é que o sistema de arquivos está cheio:

```sql
$> perror 28
OS error code  28:  No space left on device
```

Se você receber um erro do tipo seguinte durante a inicialização, isso indica que o sistema de arquivos ou o diretório usado para armazenar arquivos de dados está protegido para escrita. Desde que o erro de escrita seja em um arquivo de teste, o erro não é grave e pode ser ignorado com segurança.

```sql
Can't create test file /usr/local/mysql/data/master.lower-test
```
