#### B.3.2.11 Não é possível criar/escrever no arquivo

Se você receber um erro do tipo a seguir para algumas consultas, isso significa que o MySQL não consegue criar um arquivo temporário para o conjunto de resultados no diretório temporário:

```
Can't create/write to file '\\sqla3fe_0.ism'.
```

O erro anterior é uma mensagem típica para o Windows; a mensagem Unix é semelhante.

Uma solução é iniciar o **mysqld** com a opção `--tmpdir` ou adicionar a opção à seção `[mysqld]` do seu arquivo de opções. Por exemplo, para especificar um diretório de `C:\temp`, use essas linhas:

```
[mysqld]
tmpdir=C:/temp
```

O diretório `C:\temp` deve existir e ter espaço suficiente para o servidor MySQL escrever. Veja a Seção 6.2.2.2, “Usando arquivos de opções”.

Outra causa desse erro pode ser problemas de permissões. Certifique-se de que o servidor MySQL possa escrever no diretório `tmpdir`.

Verifique também o código de erro que você obtém com **perror**. Uma razão pela qual o servidor não pode escrever em uma tabela é que o sistema de arquivos está cheio:

```
$> perror 28
OS error code  28:  No space left on device
```

Se você receber um erro do tipo a seguir durante a inicialização, isso indica que o sistema de arquivos ou o diretório usado para armazenar arquivos de dados está protegido para escrita. Desde que o erro de escrita seja para um arquivo de teste, o erro não é grave e pode ser ignorado com segurança.

```
Can't create test file /usr/local/mysql/data/master.lower-test
```