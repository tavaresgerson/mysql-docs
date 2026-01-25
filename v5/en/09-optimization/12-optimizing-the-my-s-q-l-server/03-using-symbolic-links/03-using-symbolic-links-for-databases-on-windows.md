#### 8.12.3.3 Usando Symbolic Links para Databases no Windows

No Windows, Symbolic Links podem ser usados para diretórios de Database. Isso permite que você coloque um diretório de Database em um local diferente (por exemplo, em um disco diferente) configurando um Symbolic Link para ele. O uso de database symlinks no Windows é semelhante ao seu uso no Unix, embora o procedimento para configurar o link seja diferente.

Suponha que você queira colocar o diretório da Database chamada `mydb` em `D:\data\mydb`. Para fazer isso, crie um Symbolic Link no diretório de dados do MySQL que aponte para `D:\data\mydb`. No entanto, antes de criar o Symbolic Link, certifique-se de que o diretório `D:\data\mydb` exista, criando-o, se necessário. Se você já tiver um diretório de Database chamado `mydb` no diretório de dados, mova-o para `D:\data`. Caso contrário, o Symbolic Link será ineficaz. Para evitar problemas, certifique-se de que o Server não esteja em execução ao mover o diretório da Database.

No Windows, você pode criar um Symlink usando o comando **mklink**. Este comando requer privilégios administrativos.

1. Certifique-se de que o caminho desejado para a Database exista. Para este exemplo, usamos `D:\data\mydb` e uma Database chamada `mydb`.

2. Se a Database ainda não existir, execute `CREATE DATABASE mydb` no Client **mysql** para criá-la.

3. Pare o Service do MySQL.
4. Usando o Windows Explorer ou a linha de comando, mova o diretório `mydb` do data directory para `D:\data`, substituindo o diretório de mesmo nome.

5. Se você ainda não estiver usando o prompt de comando, abra-o e altere o local para o data directory, assim:

   ```sql
   C:\> cd \path\to\datadir
   ```

   Se sua instalação do MySQL estiver no local padrão, você pode usar:

   ```sql
   C:\> cd C:\ProgramData\MySQL\MySQL Server 5.7\Data
   ```

6. No data directory, crie um Symlink chamado `mydb` que aponte para o local do diretório da Database:

   ```sql
   C:\> mklink /d mydb D:\data\mydb
   ```

7. Inicie o Service do MySQL.

Depois disso, todas as tabelas criadas na Database `mydb` são criadas em `D:\data\mydb`.

Alternativamente, em qualquer versão do Windows suportada pelo MySQL, você pode criar um Symbolic Link para uma Database MySQL criando um arquivo `.sym` no data directory que contenha o caminho para o diretório de destino. O arquivo deve ser nomeado como `db_name.sym`, onde *`db_name`* é o nome da Database.

O suporte para Symbolic Links de Database no Windows usando arquivos `.sym` é habilitado por padrão. Se você não precisar de Symbolic Links de arquivo `.sym`, você pode desabilitar o suporte para eles iniciando o **mysqld** com a opção `--skip-symbolic-links`. Para determinar se o seu sistema suporta Symbolic Links de arquivo `.sym`, verifique o valor da variável de sistema `have_symlink` usando esta Statement:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

Para criar um Symlink de arquivo `.sym`, use este procedimento:

1. Altere o local para o data directory:

   ```sql
   C:\> cd \path\to\datadir
   ```

2. No data directory, crie um arquivo de texto chamado `mydb.sym` que contenha este nome de caminho: `D:\data\mydb\`

   Note

   O caminho para a nova Database e tabelas deve ser absoluto. Se você especificar um caminho relativo, o local será relativo ao arquivo `mydb.sym`.

Depois disso, todas as tabelas criadas na Database `mydb` são criadas em `D:\data\mydb`.

Note

Uma vez que o suporte para arquivos `.sym` é redundante com o suporte nativo a Symlink disponível usando **mklink**, o uso de arquivos `.sym` está depreciado; espere que o suporte a eles seja removido em uma futura release do MySQL.

As seguintes limitações se aplicam ao uso de arquivos `.sym` para Symbolic Linking de Database no Windows. Estas limitações não se aplicam a Symlinks criados usando **mklink**.

* O Symbolic Link não é usado se um diretório com o mesmo nome da Database existir no data directory do MySQL.

* A opção `--innodb_file_per_table` não pode ser usada.

* Se você executar o **mysqld** como um Service, você não pode usar um drive mapeado para um Server remoto como destino do Symbolic Link. Como solução alternativa (workaround), você pode usar o caminho completo (`\\servername\path\`).