#### 8.12.3.3 Uso de Links Simbólicos para Bancos de Dados no Windows

No Windows, os links simbólicos podem ser usados para diretórios de banco de dados. Isso permite que você coloque um diretório de banco de dados em um local diferente (por exemplo, em um disco diferente) configurando um link simbólico para ele. O uso de links simbólicos de banco de dados no Windows é semelhante ao seu uso no Unix, embora o procedimento para configurar o link seja diferente.

Suponha que você queira colocar o diretório do banco de dados de um banco de dados chamado `mydb` em `D:\data\mydb`. Para fazer isso, crie um link simbólico no diretório de dados do MySQL que aponte para `D:\data\mydb`. No entanto, antes de criar o link simbólico, certifique-se de que o diretório `D:\data\mydb` existe, criando-o se necessário. Se você já tiver um diretório de banco de dados chamado `mydb` no diretório de dados, mova-o para `D:\data`. Caso contrário, o link simbólico será ineficaz. Para evitar problemas, certifique-se de que o servidor não esteja em execução quando você mover o diretório do banco de dados.

No Windows, você pode criar um symlink usando o comando **mklink**. Esse comando requer privilégios administrativos.

1. Certifique-se de que o caminho desejado para o banco de dados existe. Para este exemplo, usamos `D:\data\mydb` e um banco de dados chamado `mydb`.

2. Se a base de dados ainda não existir, execute `CREATE DATABASE mydb` no cliente **mysql** para criá-la.

3. Pare o serviço MySQL.

4. Usando o Explorador do Windows ou a linha de comando, mova o diretório `mydb` do diretório de dados para `D:\data`, substituindo o diretório com o mesmo nome.

5. Se você ainda não estiver usando o prompt de comando, abra-o e mude a localização para o diretório de dados, da seguinte forma:

   ```sql
   C:\> cd \path\to\datadir
   ```

   Se a instalação do MySQL estiver no local padrão, você pode usar isso:

   ```sql
   C:\> cd C:\ProgramData\MySQL\MySQL Server 5.7\Data
   ```

6. No diretório de dados, crie um symlink chamado `mydb` que aponte para o local do diretório do banco de dados:

   ```sql
   C:\> mklink /d mydb D:\data\mydb
   ```

7. Inicie o serviço MySQL.

Depois disso, todas as tabelas criadas no banco de dados `mydb` serão criadas em `D:\data\mydb`.

Alternativamente, em qualquer versão do Windows suportada pelo MySQL, você pode criar um link simbólico para um banco de dados MySQL criando um arquivo `.sym` no diretório de dados que contém o caminho para o diretório de destino. O arquivo deve ser chamado de `db_name.sym`, onde *`db_name`* é o nome do banco de dados.

O suporte para links simbólicos de banco de dados no Windows usando arquivos `.sym` está habilitado por padrão. Se você não precisar de links simbólicos de arquivos `.sym`, pode desativá-los iniciando o **mysqld** com a opção `--skip-symbolic-links`. Para determinar se o seu sistema suporta links simbólicos de arquivos `.sym`, verifique o valor da variável de sistema `have_symlink` usando esta instrução:

```sql
SHOW VARIABLES LIKE 'have_symlink';
```

Para criar um link simbólico de arquivo `.sym`, use este procedimento:

1. Altere a localização para o diretório de dados:

   ```sql
   C:\> cd \path\to\datadir
   ```

2. No diretório de dados, crie um arquivo de texto chamado `mydb.sym` que contenha este nome de caminho: `D:\dados\mydb\`

   Nota

   O nome do caminho para o novo banco de dados e tabelas deve ser absoluto. Se você especificar um caminho relativo, a localização será relativa ao arquivo `mydb.sym`.

Depois disso, todas as tabelas criadas no banco de dados `mydb` serão criadas em `D:\data\mydb`.

Nota

Como o suporte para arquivos `.sym` é redundante, já que o suporte nativo para sylinks está disponível usando o **mklink**, o uso de arquivos `.sym` é desaconselhável; espere que o suporte a eles seja removido em uma futura versão do MySQL.

As seguintes limitações se aplicam ao uso de arquivos `.sym` para vinculação simbólica de bancos de dados no Windows. Essas limitações não se aplicam a symlinks criados usando **mklink**.

- O link simbólico não é usado se um diretório com o mesmo nome que o banco de dados existir no diretório de dados do MySQL.

- A opção `--innodb_file_per_table` não pode ser usada.

- Se você executar o **mysqld** como um serviço, não poderá usar uma unidade mapeada a um servidor remoto como destino do link simbólico. Como solução alternativa, você pode usar o caminho completo (`\\servername\path`).
