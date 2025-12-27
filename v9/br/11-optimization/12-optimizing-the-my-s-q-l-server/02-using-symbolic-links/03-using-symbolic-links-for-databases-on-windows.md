#### 10.12.2.3 Usando Links Simbólicos para Bancos de Dados no Windows

No Windows, links simbólicos podem ser usados para diretórios de bancos de dados. Isso permite que você coloque um diretório de banco de dados em um local diferente (por exemplo, em um disco diferente) configurando um link simbólico para ele. O uso de links simbólicos de banco de dados no Windows é semelhante ao seu uso no Unix, embora o procedimento para configurar o link seja diferente.

Suponha que você queira colocar o diretório de banco de dados para um banco de dados chamado `mydb` em `D:\data\mydb`. Para fazer isso, crie um link simbólico no diretório de dados do MySQL que aponte para `D:\data\mydb`. No entanto, antes de criar o link simbólico, certifique-se de que o diretório `D:\data\mydb` existe, criando-o se necessário. Se você já tiver um diretório de banco de dados chamado `mydb` no diretório de dados, mova-o para `D:\data`. Caso contrário, o link simbólico não terá efeito. Para evitar problemas, certifique-se de que o servidor não esteja em execução quando você mover o diretório de banco de dados.

No Windows, você pode criar um link simbólico usando o comando **mklink**. Esse comando requer privilégios administrativos.

1. Certifique-se de que o caminho desejado para o banco de dados existe. Para este exemplo, usamos `D:\data\mydb`, e um banco de dados chamado `mydb`.

2. Se o banco de dados ainda não existir, execute `CREATE DATABASE mydb` no cliente **mysql** para criá-lo.

3. Pare o serviço MySQL.
4. Usando o Explorador do Windows ou a linha de comando, mova o diretório `mydb` do diretório de dados para `D:\data`, substituindo o diretório do mesmo nome.

5. Se você ainda não estiver usando o prompt de comando, abra-o e mude a localização para o diretório de dados, assim:

   ```
   C:\> cd \path\to\datadir
   ```

   Se sua instalação do MySQL estiver no local padrão, você pode usar:

   ```
   C:\> cd C:\ProgramData\MySQL\MySQL Server 9.5\Data
   ```

6. No diretório de dados, crie um symlink chamado `mydb` que aponte para a localização do diretório do banco de dados:

   ```
   C:\> mklink /d mydb D:\data\mydb
   ```

7. Inicie o serviço MySQL.

Após isso, todas as tabelas criadas no banco de dados `mydb` serão criadas em `D:\data\mydb`.

Alternativamente, em qualquer versão do Windows suportada pelo MySQL, você pode criar um link simbólico para um banco de dados MySQL criando um arquivo `.sym` no diretório de dados que contém o caminho do diretório de destino. O arquivo deve ser chamado `db_name.sym`, onde *`db_name`* é o nome do banco de dados.

O suporte para links simbólicos de banco de dados no Windows usando arquivos `.sym` está habilitado por padrão. Se você não precisar de links simbólicos de arquivos `.sym`, pode desabilitar o suporte para eles iniciando o **mysqld** com a opção `--skip-symbolic-links`. Para determinar se o seu sistema suporta links simbólicos de arquivos `.sym`, verifique o valor da variável de sistema `have_symlink` usando esta declaração:

```
SHOW VARIABLES LIKE 'have_symlink';
```

Para criar um link simbólico de arquivo `.sym`, use este procedimento:

1. Mude para o diretório de dados:

   ```
   C:\> cd \path\to\datadir
   ```

2. No diretório de dados, crie um arquivo de texto chamado `mydb.sym` que contenha este nome de caminho: `D:\data\mydb\`

   Nota

   O nome do caminho para o novo banco de dados e tabelas deve ser absoluto. Se você especificar um caminho relativo, a localização é relativa ao arquivo `mydb.sym`.

Após isso, todas as tabelas criadas no banco de dados `mydb` serão criadas em `D:\data\mydb`.